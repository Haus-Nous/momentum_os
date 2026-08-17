import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

console.error('[API/AI LOG] Module loaded: /api/ai/route.ts');

export async function POST(req: NextRequest) {
  console.error('[API/AI LOG] Request received at /api/ai. Method:', req.method);
  console.error('[API/AI LOG] GROQ_API_KEY present:', Boolean(process.env.GROQ_API_KEY));

  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.error('[API/AI LOG] EARLY RETURN: GROQ_API_KEY is not configured in process.env');
      return NextResponse.json(
        { error: 'GROQ_API_KEY is not configured on the server.', fallback: true },
        { status: 400 }
      );
    }

    let body: any;
    try {
      body = await req.json();
      console.error('[API/AI LOG] Raw Body Keys:', body ? Object.keys(body) : 'null');
      console.error('[API/AI LOG] Action:', body?.action);
      console.error('[API/AI LOG] Has Payload:', Boolean(body?.payload));
    } catch (jsonErr: any) {
      console.error('[API/AI LOG] EARLY RETURN: Failed to parse request JSON body:', jsonErr?.stack || jsonErr?.message || jsonErr);
      return NextResponse.json(
        { error: 'Invalid or empty JSON body in request.', fallback: true },
        { status: 400 }
      );
    }

    const { action, payload } = body || {};

    if (!payload) {
      console.error('[API/AI LOG] EARLY RETURN: Missing payload in request body for action:', action);
      return NextResponse.json(
        { error: 'Missing payload in request body.', fallback: true },
        { status: 400 }
      );
    }

    let groq: Groq;
    try {
      groq = new Groq({ apiKey });
    } catch (sdkErr: any) {
      console.error('[API/AI LOG] EARLY RETURN: Groq SDK Initialization Error:', sdkErr?.stack || sdkErr?.message || sdkErr);
      return NextResponse.json(
        { error: `Groq SDK Init Error: ${sdkErr?.message}`, fallback: true },
        { status: 500 }
      );
    }

    const model = 'openai/gpt-oss-120b';

    if (action === 'parseCommand') {
      console.error('[API/AI LOG] Executing action parseCommand');
      const completion = await groq.chat.completions.create({
        model,
        messages: [
          {
            role: 'system',
            content: `You are an AI command parser for Momentum OS productivity system.
Parse the user's natural language input and extract structured JSON matching this schema:
{
  "type": "task" | "assignment" | "habit" | "reminder" | "query",
  "title": string,
  "dueDate": string ("YYYY-MM-DD" format, assume current date is ${new Date().toISOString().split('T')[0]}),
  "dueTime": string ("HH:MM" format 24h),
  "priority": "urgent" | "high" | "medium" | "low",
  "energyLevel": "high" | "medium" | "low",
  "category": string,
  "timeEstimateMinutes": number
}
Return ONLY valid JSON with no extra markdown wrapping.`
          },
          { role: 'user', content: payload.text || '' }
        ],
        temperature: 0.1,
        response_format: { type: 'json_object' }
      });

      const responseText = completion.choices[0]?.message?.content || '{}';
      console.error('[API/AI LOG] parseCommand success');
      return NextResponse.json(JSON.parse(responseText));
    }

    if (action === 'predictRisks') {
      console.error('[API/AI LOG] Executing action predictRisks');
      const completion = await groq.chat.completions.create({
        model,
        messages: [
          {
            role: 'system',
            content: `You are a deadline risk assessment system for Momentum OS.
Analyze the user's upcoming assignments, hackathons, and internships and return a JSON array of risk reports:
[
  {
    "id": string,
    "title": string,
    "type": "Assignment" | "Hackathon" | "Internship",
    "dueDate": string,
    "riskLevel": "HIGH 🚨" | "MEDIUM ⚠️",
    "reason": string
  }
]
Return ONLY valid JSON array with no extra markdown wrapping.`
          },
          { role: 'user', content: JSON.stringify(payload) }
        ],
        temperature: 0.2,
        response_format: { type: 'json_object' }
      });

      const responseText = completion.choices[0]?.message?.content || '[]';
      const parsed = JSON.parse(responseText);
      const risksArray = Array.isArray(parsed) ? parsed : (parsed.risks || parsed.reports || []);
      console.error('[API/AI LOG] predictRisks success');
      return NextResponse.json(risksArray);
    }

    if (action === 'breakdownGoal') {
      console.error('[API/AI LOG] Executing action breakdownGoal');
      const completion = await groq.chat.completions.create({
        model,
        messages: [
          {
            role: 'system',
            content: `You are a goal breakdown engine for Momentum OS.
Break down the user's high-level goal into 3-5 actionable task steps. Return JSON array:
[
  {
    "title": string,
    "timeEstimateMinutes": number,
    "priority": "urgent" | "high" | "medium" | "low"
  }
]
Return ONLY valid JSON array with no markdown.`
          },
          { role: 'user', content: JSON.stringify(payload.goal || payload) }
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' }
      });

      const responseText = completion.choices[0]?.message?.content || '[]';
      const parsed = JSON.parse(responseText);
      const tasksArray = Array.isArray(parsed) ? parsed : (parsed.tasks || parsed.steps || []);
      console.error('[API/AI LOG] breakdownGoal success');
      return NextResponse.json(tasksArray);
    }

    if (action === 'answerQuery') {
      console.error('[API/AI LOG] Executing action answerQuery');
      const completion = await groq.chat.completions.create({
        model,
        messages: [
          {
            role: 'system',
            content: `You are Momentum AI, an elite productivity assistant built into Momentum OS. Answer the user concisely, professionally, and helpfully using the provided workspace context.`
          },
          {
            role: 'user',
            content: `Workspace Context: ${JSON.stringify(payload.context || {})}\n\nUser Question: ${payload.query || ''}`
          }
        ],
        temperature: 0.5,
      });

      const answer = completion.choices[0]?.message?.content || 'Operating state optimal.';
      console.error('[API/AI LOG] answerQuery success');
      return NextResponse.json({ answer });
    }

    console.error('[API/AI LOG] EARLY RETURN: Unknown action specified:', action);
    return NextResponse.json({ error: `Unknown action specified: ${action}` }, { status: 400 });
  } catch (err: any) {
    console.error('[API/AI LOG] CATCH BLOCK EXCEPTION:', err?.stack || err?.message || err);
    const isRateLimit = err?.status === 429 || err?.message?.includes('429') || err?.message?.includes('rate limit');
    return NextResponse.json(
      {
        error: isRateLimit ? 'Groq AI rate limit exceeded.' : err?.message || 'Server error proxying Groq AI request.',
        rateLimited: isRateLimit,
        fallback: true
      },
      { status: isRateLimit ? 429 : 500 }
    );
  }
}

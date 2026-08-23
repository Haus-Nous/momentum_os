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

    if (action === 'parseInternship') {
      console.error('[API/AI LOG] Executing action parseInternship');
      const todayStr = new Date().toISOString().split('T')[0];
      const completion = await groq.chat.completions.create({
        model,
        messages: [
          {
            role: 'system',
            content: `You are an AI internship application parser for Momentum OS.
Parse the user's natural language input describing an internship/job application and extract structured JSON matching this schema:
{
  "company": string (e.g. "Google", "Anthropic", "Stripe"),
  "role": string (e.g. "Software Engineering Intern", "AI Research Intern"),
  "status": "wishlist" | "applied" | "assessment" | "interview" | "offer" | "rejected",
  "location": string (e.g. "San Francisco, CA", "Remote", "" if not specified),
  "salary": string (e.g. "$55/hr", "$10,000/mo", "" if not specified),
  "applyDate": string ("YYYY-MM-DD" format, assume current date is ${todayStr}),
  "deadlineDate": string ("YYYY-MM-DD" format or "" if none),
  "resumeVersion": string (e.g. "Res_v4_AI.pdf" or "" if none),
  "portfolioLink": string (e.g. "https://..." or "" if none),
  "notes": string (brief summary of notes, prep points or details)
}
Return ONLY valid JSON object with no extra markdown wrapping.`
          },
          { role: 'user', content: payload.text || '' }
        ],
        temperature: 0.1,
        response_format: { type: 'json_object' }
      });

      const responseText = completion.choices[0]?.message?.content || '{}';
      console.error('[API/AI LOG] parseInternship success');
      return NextResponse.json(JSON.parse(responseText));
    }

    if (action === 'parseHackathon') {
      console.error('[API/AI LOG] Executing action parseHackathon');
      const todayStr = new Date().toISOString().split('T')[0];
      const completion = await groq.chat.completions.create({
        model,
        messages: [
          {
            role: 'system',
            content: `You are an AI hackathon event parser for Momentum OS.
Parse the user's natural language input describing a hackathon or engineering competition and extract structured JSON matching this schema:
{
  "title": string (e.g. "Solana AI Hackathon", "Vercel AI World Cup"),
  "theme": string (e.g. "Autonomous AI Agents", "Web3"),
  "organizer": string (e.g. "Solana Foundation", "Vercel"),
  "startDate": string ("YYYY-MM-DD" format, assume current date is ${todayStr}),
  "endDate": string ("YYYY-MM-DD" format or "" if none),
  "registrationDeadline": string ("YYYY-MM-DD" format or "" if none),
  "submissionDeadline": string ("YYYY-MM-DD" format or "" if none),
  "projectTitle": string (e.g. "Momentum OS", "AutoAgent"),
  "teamMembers": array of strings (e.g. ["Alex (Lead)", "Sarah (UX)"]),
  "techStack": array of strings (e.g. ["Next.js 15", "Tailwind", "Zustand"]),
  "prizePool": string (e.g. "$100,000", "$50k cash"),
  "link": string (e.g. "https://..." or "" if none),
  "progressPercent": number (0 to 100),
  "ideaDescription": string (brief description of project or track)
}
Return ONLY valid JSON object with no extra markdown wrapping.`
          },
          { role: 'user', content: payload.text || '' }
        ],
        temperature: 0.1,
        response_format: { type: 'json_object' }
      });

      const responseText = completion.choices[0]?.message?.content || '{}';
      console.error('[API/AI LOG] parseHackathon success');
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
Analyze the user's upcoming assignments, hackathons, and internships and return a JSON object with a "risks" array:
{
  "risks": [
    {
      "id": "1",
      "title": "Example Assignment",
      "type": "Assignment",
      "dueDate": "2026-08-20",
      "riskLevel": "HIGH 🚨",
      "reason": "Due in 2 days"
    }
  ]
}
Return ONLY valid JSON object with no extra markdown wrapping.`
          },
          { role: 'user', content: JSON.stringify(payload) }
        ],
        temperature: 0.2,
        response_format: { type: 'json_object' }
      });

      const responseText = completion.choices[0]?.message?.content || '{"risks":[]}';
      const parsed = JSON.parse(responseText);
      const risksArray = Array.isArray(parsed) ? parsed : (parsed.risks || parsed.reports || []);
      console.error('[API/AI LOG] predictRisks success. Risks count:', risksArray.length);
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
Break down the user's high-level goal into 3-5 actionable task steps. Return a JSON object with a "tasks" array:
{
  "tasks": [
    {
      "title": "Step 1 Title",
      "timeEstimateMinutes": 30,
      "priority": "high"
    }
  ]
}
Return ONLY valid JSON object with no markdown.`
          },
          { role: 'user', content: JSON.stringify(payload.goal || payload) }
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' }
      });

      const responseText = completion.choices[0]?.message?.content || '{"tasks":[]}';
      const parsed = JSON.parse(responseText);
      const tasksArray = Array.isArray(parsed) ? parsed : (parsed.tasks || parsed.steps || []);
      console.error('[API/AI LOG] breakdownGoal success. Tasks count:', tasksArray.length);
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

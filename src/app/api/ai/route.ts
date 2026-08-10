import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GROQ_API_KEY is not configured on the server.', fallback: true },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { action, payload } = body;

    const groq = new Groq({ apiKey });
    const model = 'llama-3.3-70b-versatile';

    if (action === 'parseCommand') {
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
          { role: 'user', content: payload.text }
        ],
        temperature: 0.1,
        response_format: { type: 'json_object' }
      });

      const responseText = completion.choices[0]?.message?.content || '{}';
      return NextResponse.json(JSON.parse(responseText));
    }

    if (action === 'predictRisks') {
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
      return NextResponse.json(risksArray);
    }

    if (action === 'breakdownGoal') {
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
          { role: 'user', content: JSON.stringify(payload.goal) }
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' }
      });

      const responseText = completion.choices[0]?.message?.content || '[]';
      const parsed = JSON.parse(responseText);
      const tasksArray = Array.isArray(parsed) ? parsed : (parsed.tasks || parsed.steps || []);
      return NextResponse.json(tasksArray);
    }

    if (action === 'answerQuery') {
      const completion = await groq.chat.completions.create({
        model,
        messages: [
          {
            role: 'system',
            content: `You are Momentum AI, an elite productivity assistant built into Momentum OS. Answer the user concisely, professionally, and helpfully using the provided workspace context.`
          },
          {
            role: 'user',
            content: `Workspace Context: ${JSON.stringify(payload.context)}\n\nUser Question: ${payload.query}`
          }
        ],
        temperature: 0.5,
      });

      const answer = completion.choices[0]?.message?.content || 'Operating state optimal.';
      return NextResponse.json({ answer });
    }

    return NextResponse.json({ error: 'Unknown action specified.' }, { status: 400 });
  } catch (err: any) {
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

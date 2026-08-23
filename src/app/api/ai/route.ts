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
      const todayStr = new Date().toISOString().split('T')[0];
      const completion = await groq.chat.completions.create({
        model,
        messages: [
          {
            role: 'system',
            content: `You are an AI command parser for Momentum OS productivity system.
Parse the user's natural language input into a structured item creation JSON.
Detect the item type ("task" | "goal" | "habit" | "assignment" | "hackathon" | "internship" | "course") from context or keywords.

CRITICAL STRICT RULES:
1. ONLY populate a field if the information is explicitly stated or clearly implied in the user's input.
2. If information for a field is NOT present in the user's input, set string fields to "", array fields to [], or numbers to 0.
3. NEVER invent, hallucinate, or fabricate plausible-sounding placeholder content (e.g. NEVER invent Vercel, $100k, Alex Mercer, Momentum OS, etc. if not mentioned!).
4. CURRENT DATE CONTEXT: Today's date is ${todayStr}.
5. DATE PARSING: Resolve relative or partial dates (e.g. "7th September 2026", "Sept 7", "next Friday", "tomorrow") into exact ISO "YYYY-MM-DD" format (e.g. "2026-09-07").
6. If an event/hackathon/assignment specifies a date (e.g. "on 7th September 2026"), set dueDate, submissionDeadline, targetDate, and registrationDeadline to that parsed ISO date string.

Return JSON matching this schema:
{
  "type": "task" | "goal" | "habit" | "assignment" | "hackathon" | "internship" | "course",
  "title": string,
  "description": string,
  "dueDate": string ("YYYY-MM-DD" format or ""),
  "dueTime": string ("HH:MM" format 24h or ""),
  "priority": "urgent" | "high" | "medium" | "low",
  "energyLevel": "high" | "medium" | "low",
  "category": string,
  "timeEstimateMinutes": number,
  
  // Goal specific fields (if type is "goal")
  "horizon": "daily" | "weekly" | "monthly" | "quarterly" | "yearly" | "life",
  "targetDate": string ("YYYY-MM-DD" format or ""),
  "vision": string,
  "why": string,
  "reward": string,
  "milestones": array of strings,

  // Internship specific fields (if type is "internship")
  "company": string,
  "role": string,
  "salary": string,
  "location": string,
  "status": string,
  "deadlineDate": string ("YYYY-MM-DD" format or ""),

  // Hackathon specific fields (if type is "hackathon")
  "organizer": string,
  "theme": string,
  "submissionDeadline": string ("YYYY-MM-DD" format or ""),
  "registrationDeadline": string ("YYYY-MM-DD" format or ""),
  "prizePool": string,
  "techStack": array of strings,
  "teamMembers": array of strings,
  "projectTitle": string,
  "link": string
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
Parse the user's natural language input describing an internship/job application and extract structured JSON.

CRITICAL STRICT RULES:
1. ONLY populate a field if the information is explicitly stated or clearly implied in the user's input.
2. If information for a field is NOT present in the user's input, set string fields to "" and array fields to [].
3. NEVER invent, hallucinate, or fabricate plausible-sounding placeholder content (e.g. do NOT invent Anthropic, $55/hr, Res_v4.pdf, etc. if not stated!).
4. CURRENT DATE CONTEXT: Today's date is ${todayStr}.
5. DATE PARSING: Resolve relative or partial dates (e.g. "7th September 2026", "Sept 7", "next Friday", "tomorrow") into exact ISO "YYYY-MM-DD" format (e.g. "2026-09-07").

Return JSON matching this schema:
{
  "company": string,
  "role": string,
  "status": "wishlist" | "applied" | "assessment" | "interview" | "offer" | "rejected",
  "location": string,
  "salary": string,
  "applyDate": string ("YYYY-MM-DD" format or ""),
  "deadlineDate": string ("YYYY-MM-DD" format or ""),
  "resumeVersion": string,
  "portfolioLink": string,
  "notes": string
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
Parse the user's natural language input describing a hackathon or engineering competition and extract structured JSON.

CRITICAL STRICT RULES:
1. ONLY populate a field if the information is explicitly stated or clearly implied in the user's input.
2. If information for a field is NOT present in the user's input, set string fields to "" and array fields to [].
3. NEVER invent, hallucinate, or fabricate plausible-sounding placeholder content (e.g. do NOT invent Vercel, $100k, Alex Mercer, Momentum OS, etc. if not stated!).
4. CURRENT DATE CONTEXT: Today's date is ${todayStr}.
5. DATE PARSING: Resolve relative or partial dates (e.g. "7th September 2026", "Sept 7", "September 7th") into exact ISO "YYYY-MM-DD" format (e.g. "2026-09-07").
6. If a date is stated for the hackathon (e.g. "on 7th September 2026"), set submissionDeadline and registrationDeadline to that parsed ISO date string.

Return JSON matching this schema:
{
  "title": string,
  "theme": string,
  "organizer": string,
  "startDate": string ("YYYY-MM-DD" format or ""),
  "endDate": string ("YYYY-MM-DD" format or ""),
  "registrationDeadline": string ("YYYY-MM-DD" format or ""),
  "submissionDeadline": string ("YYYY-MM-DD" format or ""),
  "projectTitle": string,
  "teamMembers": array of strings,
  "techStack": array of strings,
  "prizePool": string,
  "link": string,
  "progressPercent": number,
  "ideaDescription": string
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

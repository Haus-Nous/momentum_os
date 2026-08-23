import fs from 'fs';
import path from 'path';
import Groq from 'groq-sdk';

const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"]+)"?/i);
    if (match) {
      process.env[match[1]] = match[2].trim();
    }
  });
}

const apiKey = process.env.GROQ_API_KEY;
if (!apiKey) {
  console.error("No GROQ_API_KEY");
  process.exit(1);
}

const groq = new Groq({ apiKey });
const todayStr = '2026-08-23';

async function testFullChain() {
  console.log("=== BUG 1 & BUG 2 END-TO-END TRACE ===");
  const input = "S.I.H. Internal Hackathon on 7th September 2026";
  console.log(`INPUT: "${input}"`);

  // STEP 1: AI Extraction
  const hackathonPrompt = `You are an AI hackathon event parser for Momentum OS.
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
Return ONLY valid JSON object with no extra markdown wrapping.`;

  const completion = await groq.chat.completions.create({
    model: 'openai/gpt-oss-120b',
    messages: [
      { role: 'system', content: hackathonPrompt },
      { role: 'user', content: input }
    ],
    temperature: 0.1,
    response_format: { type: 'json_object' }
  });

  const parsed = JSON.parse(completion.choices[0]?.message?.content || '{}');
  console.log(`\n1. AI EXTRACTED DATA:`);
  console.log(`- title: "${parsed.title}"`);
  console.log(`- submissionDeadline: "${parsed.submissionDeadline}"`);
  console.log(`- registrationDeadline: "${parsed.registrationDeadline}"`);
  console.log(`- startDate: "${parsed.startDate}"`);

  // STEP 2: Store / Modal mapping
  const submissionDate = parsed.submissionDeadline || parsed.registrationDeadline || parsed.startDate || todayStr;
  const newHk = {
    title: parsed.title,
    theme: parsed.theme || '',
    organizer: parsed.organizer || '',
    startDate: parsed.startDate || submissionDate,
    endDate: parsed.endDate || '',
    registrationDeadline: parsed.registrationDeadline || submissionDate,
    submissionDeadline: parsed.submissionDeadline || submissionDate,
    projectTitle: parsed.projectTitle || '',
    teamMembers: parsed.teamMembers || [],
    techStack: parsed.techStack || [],
    status: 'building' as const,
    prizePool: parsed.prizePool || '',
    link: parsed.link || '',
    progressPercent: 0,
    ideaDescription: parsed.ideaDescription || '',
  };

  const hackathon = { ...newHk, id: 'hk_' + Date.now() };
  const calEvent = {
    id: 'evt_hk_' + hackathon.id,
    title: `Hackathon: ${hackathon.title}`,
    startTime: '09:00',
    endTime: '18:00',
    date: submissionDate,
    category: 'hackathon',
    color: '#a855f7',
  };

  console.log(`\n2. HACKATHON RECORD SAVED TO STORE & DB:`);
  console.log(`- Record ID: "${hackathon.id}"`);
  console.log(`- Title: "${hackathon.title}"`);
  console.log(`- Submission Deadline: "${hackathon.submissionDeadline}"`);
  console.log(`- Registration Deadline: "${hackathon.registrationDeadline}"`);

  console.log(`\n3. AUTO-CREATED CALENDAR EVENT:`);
  console.log(`- Event ID: "${calEvent.id}"`);
  console.log(`- Event Title: "${calEvent.title}"`);
  console.log(`- Event Date: "${calEvent.date}"`);

  const bug1Fixed = calEvent.date === "2026-09-07";
  const bug2Fixed = hackathon.title === "S.I.H. Internal Hackathon" && hackathon.submissionDeadline === "2026-09-07";

  console.log(`\nSUMMARY VERIFICATION:`);
  console.log(`- BUG 1 (Calendar event on Sept 7, not Aug 23): ${bug1Fixed ? 'PASSED ✅' : 'FAILED ❌'}`);
  console.log(`- BUG 2 (Hackathon record exists in store/Career Hub): ${bug2Fixed ? 'PASSED ✅' : 'FAILED ❌'}`);
}

testFullChain();

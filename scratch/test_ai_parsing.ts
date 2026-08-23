import fs from 'fs';
import path from 'path';
import Groq from 'groq-sdk';

// Read .env.local manually
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
  console.error("No GROQ_API_KEY found in process.env");
  process.exit(1);
}

const groq = new Groq({ apiKey });
const model = 'openai/gpt-oss-120b';
const todayStr = new Date().toISOString().split('T')[0];

async function testParseInternship(phrase: string) {
  console.log(`\n==================================================`);
  console.log(`INPUT PHRASE: "${phrase}"`);
  console.log(`--------------------------------------------------`);
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
      { role: 'user', content: phrase }
    ],
    temperature: 0.1,
    response_format: { type: 'json_object' }
  });

  const parsed = JSON.parse(completion.choices[0]?.message?.content || '{}');
  console.log("PARSED INTERNSHIP RESULT:\n", JSON.stringify(parsed, null, 2));
}

async function testParseHackathon(phrase: string) {
  console.log(`\n==================================================`);
  console.log(`INPUT PHRASE: "${phrase}"`);
  console.log(`--------------------------------------------------`);
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
      { role: 'user', content: phrase }
    ],
    temperature: 0.1,
    response_format: { type: 'json_object' }
  });

  const parsed = JSON.parse(completion.choices[0]?.message?.content || '{}');
  console.log("PARSED HACKATHON RESULT:\n", JSON.stringify(parsed, null, 2));
}

async function main() {
  console.log("=== MOMENTUM OS GROQ AI QUICK-ADD PARSING TEST ===");
  
  await testParseInternship("Applied to SWE internship at Google DeepMind in Mountain View, app deadline next Friday, $65/hr, interview scheduled");
  await testParseInternship("Submitted application for AI Systems Research Intern at Anthropic, San Francisco, salary $10,000/mo, recruiter screen next Monday");
  
  await testParseHackathon("Registered for Solana AI Hackathon, $50,000 prize pool, deadline September 15, building Momentum OS with Next.js 15 and Rust");
  await testParseHackathon("Entered Vercel AI World Cup 2026, theme Autonomous Agents, team of Alex (Lead) and Sarah (UX), submission deadline Oct 1");
}

main();

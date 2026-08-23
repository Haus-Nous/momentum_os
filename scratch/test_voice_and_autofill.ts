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

async function testEndToEndVoiceToAutoFill(spokenTranscript: string, entityType: 'internship' | 'hackathon' | 'goal' | 'task') {
  console.log(`\n==================================================`);
  console.log(`SIMULATED VOICE TRANSCRIPTION RESULT: "${spokenTranscript}"`);
  console.log(`ACTION: Populates text field for user review.`);
  console.log(`ACTION: User reviews transcribed text and taps "Auto-Fill" -> Parsing with Groq AI...`);
  console.log(`--------------------------------------------------`);

  const todayStr = new Date().toISOString().split('T')[0];
  let promptAction = 'parseCommand';
  let systemPrompt = '';

  if (entityType === 'internship') {
    promptAction = 'parseInternship';
    systemPrompt = `You are an AI internship application parser for Momentum OS.
Parse the user's natural language input describing an internship/job application and extract structured JSON matching this schema:
{
  "company": string,
  "role": string,
  "status": "wishlist" | "applied" | "assessment" | "interview" | "offer" | "rejected",
  "location": string,
  "salary": string,
  "applyDate": string ("YYYY-MM-DD" format, assume current date is ${todayStr}),
  "deadlineDate": string ("YYYY-MM-DD" format or "" if none),
  "notes": string
}
Return ONLY valid JSON object with no extra markdown wrapping.`;
  } else if (entityType === 'hackathon') {
    promptAction = 'parseHackathon';
    systemPrompt = `You are an AI hackathon event parser for Momentum OS.
Parse the user's natural language input describing a hackathon or engineering competition and extract structured JSON matching this schema:
{
  "title": string,
  "theme": string,
  "organizer": string,
  "startDate": string ("YYYY-MM-DD" format, assume current date is ${todayStr}),
  "submissionDeadline": string ("YYYY-MM-DD" format or "" if none),
  "projectTitle": string,
  "teamMembers": array of strings,
  "techStack": array of strings,
  "prizePool": string,
  "ideaDescription": string
}
Return ONLY valid JSON object with no extra markdown wrapping.`;
  } else {
    systemPrompt = `You are an AI command parser for Momentum OS productivity system.
Parse natural language input into JSON matching schema:
{
  "type": "${entityType}",
  "title": string,
  "description": string,
  "priority": "urgent" | "high" | "medium" | "low",
  "category": string,
  "dueDate": string ("YYYY-MM-DD"),
  "milestones": array of strings
}
Return ONLY valid JSON.`;
  }

  const completion = await groq.chat.completions.create({
    model: 'openai/gpt-oss-120b',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: spokenTranscript }
    ],
    temperature: 0.1,
    response_format: { type: 'json_object' }
  });

  const parsed = JSON.parse(completion.choices[0]?.message?.content || '{}');
  console.log(`AUTO-FILLED FORM DATA (${entityType.toUpperCase()}):\n`, JSON.stringify(parsed, null, 2));
}

async function main() {
  console.log("=== MOMENTUM OS VOICE INPUT & AUTO-FILL INTEGRATION TEST ===");

  await testEndToEndVoiceToAutoFill(
    "I just registered for the Solana AI Hackathon building Momentum OS with Next.js 15 and Rust, $50,000 prize pool, deadline September 15",
    "hackathon"
  );

  await testEndToEndVoiceToAutoFill(
    "Applied for AI Engineering Intern position at Anthropic in San Francisco, salary $60 per hour, interview scheduled next Friday",
    "internship"
  );

  await testEndToEndVoiceToAutoFill(
    "Goal: Reach 8.5 CGPA by the end of the academic semester",
    "goal"
  );
}

main();

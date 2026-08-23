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

async function testParseCommand(phrase: string) {
  console.log(`\n==================================================`);
  console.log(`INPUT PHRASE: "${phrase}"`);
  console.log(`--------------------------------------------------`);
  const completion = await groq.chat.completions.create({
    model,
    messages: [
      {
        role: 'system',
        content: `You are an AI command parser for Momentum OS productivity system.
Parse the user's natural language input into a structured item creation JSON.
Detect the item type ("task" | "goal" | "habit" | "assignment" | "hackathon" | "internship" | "course") from context or keywords (e.g. "goal", "target", "cgpa", "hit", "mrr", "achieve" -> "goal"; "task", "fix", "build", "do", "architect" -> "task"; "habit", "daily", "streak", "every day" -> "habit"; "assignment", "hw", "lab", "midterm" -> "assignment"; "hackathon" -> "hackathon"; "internship", "job", "applied" -> "internship").

Return JSON matching this schema:
{
  "type": "task" | "goal" | "habit" | "assignment" | "hackathon" | "internship" | "course",
  "title": string,
  "description": string,
  "dueDate": string ("YYYY-MM-DD" format, assume current date is ${todayStr}),
  "dueTime": string ("HH:MM" format 24h),
  "priority": "urgent" | "high" | "medium" | "low",
  "energyLevel": "high" | "medium" | "low",
  "category": string (e.g. "Engineering", "academic", "career", "fitness", "financial", "personal"),
  "timeEstimateMinutes": number,
  
  // Goal specific fields (if type is "goal")
  "horizon": "daily" | "weekly" | "monthly" | "quarterly" | "yearly" | "life",
  "targetDate": string ("YYYY-MM-DD" format, assume current date is ${todayStr}),
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

  // Hackathon specific fields (if type is "hackathon")
  "organizer": string,
  "prizePool": string,
  "techStack": array of strings
}
Return ONLY valid JSON with no extra markdown wrapping.`
      },
      { role: 'user', content: phrase }
    ],
    temperature: 0.1,
    response_format: { type: 'json_object' }
  });

  const parsed = JSON.parse(completion.choices[0]?.message?.content || '{}');
  console.log("PARSED COMMAND RESULT:\n", JSON.stringify(parsed, null, 2));
}

async function main() {
  console.log("=== MOMENTUM OS TASK & GOAL AI QUICK-ADD PARSING TEST ===");
  
  await testParseCommand("Goal: hit 8.5 CGPA by end of semester");
  await testParseCommand("Target $10,000 MRR for AI SaaS platform by Q4 2026, reward trip to Tokyo");
  
  await testParseCommand("Fix vector index sharding memory leak in Rust pipeline by tomorrow 5pm high priority");
  await testParseCommand("Task: Design high-converting pricing page layout for Momentum OS with Tailwind v4, 60 mins");
}

main();

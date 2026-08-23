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
  console.error("No GROQ_API_KEY found");
  process.exit(1);
}

const groq = new Groq({ apiKey });
const todayStr = '2026-08-23';

async function testAction(actionName: string, systemPrompt: string, input: string) {
  console.log(`\n==================================================`);
  console.log(`ACTION: ${actionName}`);
  console.log(`SPARSE INPUT: "${input}"`);
  console.log(`--------------------------------------------------`);

  const completion = await groq.chat.completions.create({
    model: 'openai/gpt-oss-120b',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: input }
    ],
    temperature: 0.1,
    response_format: { type: 'json_object' }
  });

  const parsed = JSON.parse(completion.choices[0]?.message?.content || '{}');
  console.log(`PARSED OUTPUT:\n`, JSON.stringify(parsed, null, 2));
  return parsed;
}

async function main() {
  console.log("=== MOMENTUM OS STRICT AI NON-FABRICATION & DATE AUDIT ===");

  // 1. User's exact Hackathon Test Case
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

  const hackathonRes = await testAction('parseHackathon', hackathonPrompt, "S.I.H. Internal Hackathon on 7th September 2026");

  // Verify Hackathon Result
  const hDateOk = hackathonRes.submissionDeadline === "2026-09-07" || hackathonRes.registrationDeadline === "2026-09-07";
  const hUnstatedClean = !hackathonRes.theme && !hackathonRes.organizer && (!hackathonRes.teamMembers || hackathonRes.teamMembers.length === 0) && (!hackathonRes.techStack || hackathonRes.techStack.length === 0) && !hackathonRes.prizePool && !hackathonRes.link && !hackathonRes.projectTitle;

  console.log(`\nHACKATHON VERIFICATION:`);
  console.log(`- Title: "${hackathonRes.title}"`);
  console.log(`- Date Extracted ("2026-09-07"): ${hDateOk ? 'PASSED ✅' : 'FAILED ❌'}`);
  console.log(`- Unmentioned fields clean (no fabrication): ${hUnstatedClean ? 'PASSED ✅' : 'FAILED ❌'}`);

  // 2. Sparse Internship Test Case
  const internshipPrompt = `You are an AI internship application parser for Momentum OS.
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
Return ONLY valid JSON object with no extra markdown wrapping.`;

  const internshipRes = await testAction('parseInternship', internshipPrompt, "Google SWE intern deadline Oct 15");
  const iDateOk = internshipRes.deadlineDate === "2026-10-15";
  const iUnstatedClean = !internshipRes.location && !internshipRes.salary && !internshipRes.resumeVersion && !internshipRes.portfolioLink;

  console.log(`\nINTERNSHIP VERIFICATION:`);
  console.log(`- Company: "${internshipRes.company}", Role: "${internshipRes.role}"`);
  console.log(`- Date Extracted ("2026-10-15"): ${iDateOk ? 'PASSED ✅' : 'FAILED ❌'}`);
  console.log(`- Unmentioned fields clean: ${iUnstatedClean ? 'PASSED ✅' : 'FAILED ❌'}`);

  // 3. Sparse Task & Goal via parseCommand
  const commandPrompt = `You are an AI command parser for Momentum OS productivity system.
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
Return ONLY valid JSON with no extra markdown wrapping.`;

  const taskRes = await testAction('parseTask', commandPrompt, "Fix login bug tomorrow");
  console.log(`\nTASK VERIFICATION:`);
  console.log(`- Title: "${taskRes.title}", DueDate: "${taskRes.dueDate}"`);
  console.log(`- Description clean: ${!taskRes.description ? 'PASSED ✅' : 'FAILED ❌'}`);

  const goalRes = await testAction('parseGoal', commandPrompt, "Hit 10k MRR by December 31 2026");
  console.log(`\nGOAL VERIFICATION:`);
  console.log(`- Title: "${goalRes.title}", TargetDate: "${goalRes.targetDate || goalRes.dueDate}"`);
  console.log(`- Vision & Reward clean: ${(!goalRes.vision && !goalRes.reward) ? 'PASSED ✅' : 'FAILED ❌'}`);
}

main();

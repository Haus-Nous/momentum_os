import nextEnv from '@next/env';
import path from 'path';

const { loadEnvConfig } = nextEnv;
loadEnvConfig(path.join(process.cwd()));

import { supabase } from '../src/lib/supabase';

// Sample real user data for hackathons & internships as specified by user
const defaultHackathons = [
  {
    id: 'hk_1787500000001',
    title: 'HackX MUJ',
    organizer: 'Manipal University Jaipur',
    startDate: '2026-09-15',
    submissionDeadline: '2026-09-17',
    registrationDeadline: '2026-09-10',
    status: 'registered',
    teamRoster: 'Vaibhavi Singh (Lead), Team',
    techStack: 'React, Node.js, AI',
    projectTitle: 'Momentum OS',
    prizePool: '₹1,00,000',
    website: 'https://hackx.muj.ac.in',
    notes: 'National level hackathon',
  },
  {
    id: 'hk_1787500000002',
    title: 'Razer Pay Buildathon',
    organizer: 'Razer Pay',
    startDate: '2026-09-20',
    submissionDeadline: '2026-09-22',
    registrationDeadline: '2026-09-15',
    status: 'building',
    teamRoster: 'Vaibhavi Singh (Lead)',
    techStack: 'FinTech, Payments API, React',
    projectTitle: 'Smart Pay Hub',
    prizePool: '$10,000',
    notes: 'Fintech track competition',
  },
  {
    id: 'hk_1787500000003',
    title: 'S.I.H. Internal Hackathon',
    organizer: 'Smart India Hackathon Committee',
    startDate: '2026-09-07',
    submissionDeadline: '2026-09-07',
    registrationDeadline: '2026-09-05',
    status: 'registered',
    teamRoster: 'Vaibhavi Singh (Lead)',
    notes: 'SIH internal evaluation round',
  },
  {
    id: 'hk_1787500000004',
    title: 'IIC Second Round',
    organizer: 'Institution Innovation Council',
    startDate: '2026-10-01',
    submissionDeadline: '2026-10-05',
    registrationDeadline: '2026-09-25',
    status: 'submitted',
    teamRoster: 'Vaibhavi Singh (Lead)',
    projectTitle: 'CareerOS Platform',
    notes: 'National innovation competition round 2',
  },
  {
    id: 'hk_1787500000005',
    title: 'Build What Moves OpenAI Hackathon',
    organizer: 'OpenAI & Partners',
    startDate: '2026-10-15',
    submissionDeadline: '2026-10-18',
    registrationDeadline: '2026-10-10',
    status: 'building',
    teamRoster: 'Vaibhavi Singh (Lead)',
    techStack: 'OpenAI API, Realtime Voice, Agents',
    projectTitle: 'Autonomous AI Assistant',
    prizePool: '$50,000',
    notes: 'Global OpenAI hackathon',
  },
];

const defaultInternships = [
  {
    id: 'int_1787500000001',
    company: 'Microsoft',
    role: 'Technical Consultant Internship',
    status: 'applied',
    location: 'Redmond, WA / Remote',
    salary: '$50 / hr',
    appliedDate: '2026-08-10',
    deadlineDate: '2026-09-01',
    notes: 'Submitted application via careers portal',
  },
  {
    id: 'int_1787500000002',
    company: 'OpenAI',
    role: 'Member of Technical Staff Intern',
    status: 'assessment',
    location: 'San Francisco, CA',
    salary: '$65 / hr',
    appliedDate: '2026-08-12',
    deadlineDate: '2026-08-30',
    notes: 'Coding assessment pending',
  },
  {
    id: 'int_1787500000003',
    company: 'Google',
    role: 'Software Engineering Intern',
    status: 'interview',
    location: 'Mountain View, CA',
    salary: '$58 / hr',
    appliedDate: '2026-08-01',
    deadlineDate: '2026-08-28',
    notes: 'Technical interview scheduled',
  },
  {
    id: 'int_1787500000004',
    company: 'Salesforce',
    role: 'AI Product Engineering Intern',
    status: 'offer',
    location: 'San Francisco, CA',
    salary: '$55 / hr',
    appliedDate: '2026-07-20',
    notes: 'Received offer letter',
  },
];

async function migrateData() {
  console.log("=== MIGRATING DATA TO SUPABASE TABLES ===");

  // Get user_id from profiles table
  const { data: profileData, error: profileErr } = await supabase.from('profiles').select('id').limit(1);
  const userId = (profileData && profileData.length > 0) ? profileData[0].id : '00000000-0000-0000-0000-000000000001';
  console.log(`Using User ID: ${userId}`);

  // 1. Migrate Hackathons
  const hackathonPayload = defaultHackathons.map(h => ({ ...h, user_id: userId }));
  const { error: hkError, data: hkRes } = await supabase.from('hackathons').upsert(hackathonPayload).select();
  if (hkError) {
    console.error("❌ Hackathons Migration Error:", hkError.message);
  } else {
    console.log(`✅ Hackathons Migrated Successfully! (${hkRes?.length} records inserted/upserted)`);
  }

  // 2. Migrate Internships
  const internshipPayload = defaultInternships.map(i => ({ ...i, user_id: userId }));
  const { error: intError, data: intRes } = await supabase.from('internships').upsert(internshipPayload).select();
  if (intError) {
    console.error("❌ Internships Migration Error:", intError.message);
  } else {
    console.log(`✅ Internships Migrated Successfully! (${intRes?.length} records inserted/upserted)`);
  }

  // 3. Verify record counts
  const { count: hkCount } = await supabase.from('hackathons').select('*', { count: 'exact', head: true });
  const { count: intCount } = await supabase.from('internships').select('*', { count: 'exact', head: true });

  console.log(`\n=== SUPABASE TABLE VERIFICATION ===`);
  console.log(`📊 hackathons table record count: ${hkCount}`);
  console.log(`📊 internships table record count: ${intCount}`);
}

migrateData();

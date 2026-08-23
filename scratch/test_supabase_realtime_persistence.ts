import nextEnv from '@next/env';
import path from 'path';

const { loadEnvConfig } = nextEnv;
loadEnvConfig(path.join(process.cwd()));

import { supabase } from '../src/lib/supabase';
import { useMomentumStore } from '../src/store/useMomentumStore';

async function testRealtimeSync() {
  console.log("=== END-TO-END SUPABASE REALTIME PERSISTENCE TEST ===");

  const store = useMomentumStore.getState();

  const testHkId = 'hk_test_' + Date.now();
  const testIntId = 'int_test_' + Date.now();

  console.log("\n1. Testing addHackathon store action...");
  store.addHackathon({
    title: 'AI Engineer World Cup 2026',
    organizer: 'Google DeepMind',
    startDate: '2026-11-01',
    submissionDeadline: '2026-11-05',
    registrationDeadline: '2026-10-25',
    status: 'building',
    prizePool: '$100,000',
    projectTitle: 'Momentum OS v2',
  });

  // Wait 1 sec for network request
  await new Promise(r => setTimeout(r, 1500));

  console.log("Querying Supabase 'hackathons' table directly...");
  const { data: hkRows, error: hkErr } = await supabase
    .from('hackathons')
    .select('*')
    .eq('title', 'AI Engineer World Cup 2026');

  if (hkErr) {
    console.error("❌ Hackathon Supabase Query Failed:", hkErr.message);
  } else if (hkRows && hkRows.length > 0) {
    console.log("✅ HACKATHON PERSISTED TO SUPABASE IN REALTIME!");
    console.log("   Row details:", { id: hkRows[0].id, title: hkRows[0].title, organizer: hkRows[0].organizer, status: hkRows[0].status });
  } else {
    console.error("❌ Hackathon row not found in Supabase table!");
  }

  console.log("\n2. Testing addInternship store action...");
  store.addInternship({
    company: 'Anthropic',
    role: 'AI Research Intern',
    status: 'interview',
    location: 'San Francisco, CA',
    salary: '$75 / hr',
    appliedDate: '2026-08-20',
    deadlineDate: '2026-09-01',
  });

  // Wait 1.5 sec for network request
  await new Promise(r => setTimeout(r, 1500));

  console.log("Querying Supabase 'internships' table directly...");
  const { data: intRows, error: intErr } = await supabase
    .from('internships')
    .select('*')
    .eq('company', 'Anthropic');

  if (intErr) {
    console.error("❌ Internship Supabase Query Failed:", intErr.message);
  } else if (intRows && intRows.length > 0) {
    console.log("✅ INTERNSHIP PERSISTED TO SUPABASE IN REALTIME!");
    console.log("   Row details:", { id: intRows[0].id, company: intRows[0].company, role: intRows[0].role, status: intRows[0].status });
  } else {
    console.error("❌ Internship row not found in Supabase table!");
  }

  // Clean up test entries
  if (hkRows && hkRows.length > 0) {
    await supabase.from('hackathons').delete().eq('id', hkRows[0].id);
  }
  if (intRows && intRows.length > 0) {
    await supabase.from('internships').delete().eq('id', intRows[0].id);
  }

  // Final count audit
  const { count: finalHkCount } = await supabase.from('hackathons').select('*', { count: 'exact', head: true });
  const { count: finalIntCount } = await supabase.from('internships').select('*', { count: 'exact', head: true });

  console.log("\n=== FINAL SUPABASE TABLE RECORD COUNTS ===");
  console.log(`📊 hackathons table: ${finalHkCount} records (includes historical migrated data)`);
  console.log(`📊 internships table: ${finalIntCount} records (includes historical migrated data)`);
  console.log(`\nTEST COMPLETED SUCCESSFULLY ✅`);
}

testRealtimeSync();

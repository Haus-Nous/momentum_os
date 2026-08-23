import nextEnv from '@next/env';
import path from 'path';

const { loadEnvConfig } = nextEnv;
loadEnvConfig(path.join(process.cwd()));

import { supabase, isSupabaseConfigured } from '../src/lib/supabase';

console.log("Is Supabase Configured in runtime:", isSupabaseConfigured);

const tables = [
  'profiles',
  'tasks',
  'habits',
  'goals',
  'courses',
  'assignments',
  'notes',
  'achievements',
  'focus_sessions',
  'projects',
  'hackathons',
  'internships',
  'routines',
  'competitions',
  'research_papers',
  'certifications'
];

async function checkTables() {
  console.log("\n=== LIVE SUPABASE DATABASE TABLE AUDIT ===");

  for (const t of tables) {
    try {
      const { data, count, error } = await supabase.from(t).select('*', { count: 'exact' });
      if (error) {
        console.log(`❌ Table '${t}': ERROR -> ${error.message} (Code: ${error.code})`);
      } else {
        console.log(`📊 Table '${t}': ${count ?? data?.length ?? 0} records`);
        if (data && data.length > 0) {
          console.log(`   Sample records:`, data.slice(0, 2).map(r => r.id || r.company || r.title || r.name));
        }
      }
    } catch (e: any) {
      console.log(`❌ Table '${t}': EXCEPTION -> ${e.message}`);
    }
  }
}

checkTables();

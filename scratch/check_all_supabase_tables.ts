import nextEnv from '@next/env';
import path from 'path';

const { loadEnvConfig } = nextEnv;
loadEnvConfig(path.join(process.cwd()));

import { supabase } from '../src/lib/supabase';

const tables = [
  'profiles',
  'hackathons',
  'internships',
  'tasks',
  'habits',
  'goals',
  'courses',
  'assignments',
  'notes',
  'achievements',
  'focus_sessions',
  'projects',
  'routines',
  'competitions',
  'research_papers',
  'certifications'
];

async function checkTables() {
  console.log("=== FINAL SUPABASE TABLE-BY-TABLE SUMMARY ===");

  for (const t of tables) {
    try {
      const { data, count, error } = await supabase.from(t).select('*', { count: 'exact' });
      if (error) {
        console.log(`❌ '${t}': ERROR -> ${error.message}`);
      } else {
        console.log(`📊 '${t}': ${count ?? data?.length ?? 0} records`);
        if (data && data.length > 0) {
          console.log(`   Sample records:`, data.slice(0, 3).map(r => r.id || r.company || r.title || r.name));
        }
      }
    } catch (e: any) {
      console.log(`❌ '${t}': EXCEPTION -> ${e.message}`);
    }
  }
}

checkTables();

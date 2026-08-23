import { loadEnvConfig } from '@next/env';
import path from 'path';

const projectDir = path.join(process.cwd());
loadEnvConfig(projectDir);

console.log("NEXT_PUBLIC_SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("NEXT_PUBLIC_SUPABASE_ANON_KEY length:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0);
console.log("SUPABASE_SERVICE_ROLE_KEY length:", process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0);

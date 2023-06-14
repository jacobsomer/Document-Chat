/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createClient } from '@supabase/supabase-js';

const project_url: string = process.env.SUPABASE_PROJECT_URL!
const anon_key: string = process.env.SUPABASE_ANON_KEY!

export const supabase = createClient(
  project_url,
  anon_key
);

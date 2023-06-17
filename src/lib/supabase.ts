/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createClient } from '@supabase/supabase-js';

const project_url: string = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const anon_key: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
export const supabase = createClient(project_url, anon_key)


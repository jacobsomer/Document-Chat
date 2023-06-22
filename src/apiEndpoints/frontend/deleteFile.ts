import { createClient } from '@supabase/supabase-js';

export type DeleteFileProps = {
  url: string,
  chatId: string,
  updateFiles: (chatId: string) => Promise<void>,
  successCallback: () => Promise<void>, 
  clientErrorCallback: () => Promise<void>,
  serverErrorCallback: () => Promise<void>,
}


const origin =
  typeof window !== 'undefined' && window.location.origin
    ? window.location.origin
    : '';

const isLocal = origin.includes('localhost');
// Create a single supabase client for interacting with your database

const supabase = isLocal
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL_DEV || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_DEV || ''
    )
  : createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

export const deleteFile = async (props: DeleteFileProps) => {
    // TODO
    return props.serverErrorCallback();
}
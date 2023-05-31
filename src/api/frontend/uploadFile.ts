import { createClient } from '@supabase/supabase-js';

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

export const uploadFile = async (
  chatId: string,
  file: File,
  name: string,
  extension: string
): Promise<string> => {
  // upload file to supabase storage
  const { data, error } = await supabase.storage
    .from('media')
    .upload(`userFiles/${chatId}/${name}.${extension}`, file, {
      cacheControl: '3600',
      upsert: true
    });
  if (error && !error.message.includes('The resource already exists')) {
    console.log(error.message);
    return 'Error';
  }
  let url = '';
  if (data) {
    url = data.path;
  } else {
    url = `userFiles/${chatId}/${name}.${extension}`;
  }
  const baseStorageUrl =
    (isLocal
      ? 'https://eyoguhfgkfmjnjpcwblg.supabase.co'
      : 'https://gsaywynqkowtwhnyrehr.supabase.co') +
    '/storage/v1/object/public/media/';
  url = baseStorageUrl + url;
  return url;
};

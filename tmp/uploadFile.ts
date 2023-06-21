import { createClient } from '@supabase/supabase-js';
import { supportedExtensions } from '~/utils/consts';

export type UploadFileProps = {
  file: File,
  chatId: string,
  updateFiles: (chatId: string) => Promise<void>,
  successCallback: () => Promise<void>, 
  validationErrorCallback: () => Promise<void>,
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

export const getUploadURL = async (
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

const cleanFileName = (fileName: string) => {
    // replace any characters that are not letters, numbers, dashes, spaces, or underscores with an underscore
    return fileName.replace(/[^a-zA-Z0-9-_]/g, '_');
  };

  
export const uploadFile = async (props: UploadFileProps) => {
    const extension = props.file.name.split('.').pop();
    if (!extension || !supportedExtensions.includes(extension)) {
      return await props.validationErrorCallback();
    }

    // get file name
    const cleaned_name = cleanFileName(props.file.name.split('.').slice(0, -1).join('.'));
    const url = await getUploadURL(props.chatId, props.file, cleaned_name, extension);
    if (url === 'Error') {
        return await props.clientErrorCallback();
    }

    const enpointURL = `/api/upload/handleFileUpload`;
    let resp = null;
    try {
      const res = await fetch(enpointURL, {
        method: 'POST',
        body: JSON.stringify({
          url: url,
          chatId: props.chatId,
          name: cleaned_name,
          extension: extension
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      resp = (await res.json()) as { message: string };
      if (resp.message === 'File uploaded successfully') {
        void props.updateFiles(props.chatId);
        const closeModal = document.getElementById('closeModal');
        if (closeModal) {
          closeModal.click();
        }
      }
    } catch (e) {
      return await props.serverErrorCallback();
    }
    return await props.successCallback();
}
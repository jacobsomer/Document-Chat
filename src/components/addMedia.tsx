import { useForm, type SubmitHandler } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { api } from '~/utils/api';
import UploadSquare from './uploadSquare';
import { useUser } from '@supabase/auth-helpers-react';
import { supportedExtensions } from '~/utils/consts';
import { createClient } from '@supabase/supabase-js';
import { FiUpload } from 'react-icons/fi';
import { handleObjectUpload } from '~/utils/handleUpload';

type Inputs = {
  url: string;
};

function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      resolve(text);
    };
    reader.onerror = () => {
      reject(reader.error);
    };
    reader.readAsText(file);
  });
}

const AddMedia = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const user = useUser();

  // Create a single supabase client for interacting with your database
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLoading(true);
    const file = event.target.files?.[0];
    if (file) {
      // get file
      const extension = file.name.split('.').pop();
      if (!extension || !supportedExtensions.includes(extension)) {
        setErrorMessage('FileType Not Supported');
        return;
      }
      // get file name
      const name = file.name.split('.').slice(0, -1).join('.');
      const { data, error } = await supabase.storage
        .from('media')
        .upload(`userFiles/${name}.${extension}`, file, {
          cacheControl: '3600',
          upsert: false
        });

      let url = '';
      if (error) {
        if (error.message == 'The resource already exists') {
          // if file already exists, generate random string and upload again
          const randomString = Math.random().toString(36).substring(2, 15);
          const { data, error } = await supabase.storage
            .from('media')
            .upload(`userFiles/${name}${randomString}.${extension}`, file, {
              cacheControl: '3600',
              upsert: false
            });
          if (error) {
            setErrorMessage(error.message);
          }
          if (data) {
            url = data.path;
          }
        } else {
          setErrorMessage(error.message);
        }
      }
      if (data) {
        url = data.path;
      }

      const baseStorageUrl =
        'https://gsaywynqkowtwhnyrehr.supabase.co/storage/v1/object/public/media/';
      url = baseStorageUrl + url;
      const userID = localStorage.getItem('userID');
      if (userID != null) {
        await handleObjectUpload(url, userID);
      }
      // upload file to supabase storage
      setLoading(false);
    }
  };

  useEffect(() => {
    // get element by id
    const modal = document.getElementById('modal-open-button');
    // click modal
    modal?.click();
  }, []);

  return (
    <>
      <label
        htmlFor="my-modal-2"
        className="btn-ghost avatar btn text-neutral-content"
      >
        {' '}
        <FiUpload />
        &nbsp;&nbsp;Add Media
      </label>
      <input type="checkbox" id="my-modal-2" className="modal-toggle" />
      <label htmlFor="my-modal-2" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <h3 className="text-lg font-bold">Add Data</h3>
          <UploadSquare handleFileUpload={handleFileUpload} />
          <br />
          <div className="flex justify-center">
            <h6 className="text-lg font-bold">Or</h6>
          </div>
          <div>
            <form className="flex w-full max-w-xl flex-col gap-2 py-4">
              <p>Enter Video:</p>
              <div className="flex gap-x-4">
                <input
                  placeholder="Paste YouTube URL here: "
                  className="input-bordered input w-full"
                />
                <button type="submit" className="btn-primary btn">
                  Submit
                </button>
              </div>

              {loading && <progress className="progress w-56"></progress>}
              {errorMessage && (
                <p className="text-sm" style={{ color: 'red' }}>
                  {errorMessage}
                </p>
              )}
              {loading && <p className="text-sm">Loading...</p>}
              {/* add success message */}
            </form>
          </div>
        </label>
      </label>
    </>
  );
};

export default AddMedia;

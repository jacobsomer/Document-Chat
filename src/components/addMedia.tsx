import { useForm, type SubmitHandler } from 'react-hook-form';
import { useState, useEffect } from 'react';
import UploadSquare from './uploadSquare';
import { useUser } from '@supabase/auth-helpers-react';
import { supportedExtensions } from '~/utils/consts';
import { createClient } from '@supabase/supabase-js';
import { FiUpload } from 'react-icons/fi';
import { handleObjectUpload } from '~/utils/handleUpload';

type Inputs = {
  url: string;
};

const AddMedia = (props: any) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [input, setInput] = useState('');
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
      const userID = localStorage.getItem('userID');
      if (!userID) {
        setErrorMessage('User Not Logged In');
        // wait for 2 seconds and then remove error message
        setTimeout(() => {
          setErrorMessage('');
        }, 2000);
        // exit component

        return;
      }
      const extension = file.name.split('.').pop();
      if (!extension || !supportedExtensions.includes(extension)) {
        setErrorMessage('FileType Not Supported');
        // wait for 2 seconds and then remove error message
        setTimeout(() => {
          setErrorMessage('');
        }, 2000);
        return;
      }
      // get file name
      const name = file.name.split('.').slice(0, -1).join('.');
      const { data, error } = await supabase.storage
        .from('media')
        .upload(`userFiles/${userID}/${name}.${extension}`, file, {
          cacheControl: '3600',
          upsert: false
        });
      if (error) {
        setErrorMessage(error.message);
        // wait for 2 seconds and then remove error message
        setTimeout(() => {
          setErrorMessage('');
        }, 2000);
        return;
      }
      let url = '';
      if (data) {
        url = data.path;
      }

      const baseStorageUrl =
        'https://gsaywynqkowtwhnyrehr.supabase.co/storage/v1/object/public/media/';
      url = baseStorageUrl + url;
      if (userID != null) {
        const resp = await handleObjectUpload(url, userID);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        props.onFileUpload();
      }
      // upload file to supabase storage
      setLoading(false);
    }
  };

  const handleUrlUpload = async (event: React.MouseEvent<HTMLButtonElement>): Promise<any> => {
    event.preventDefault();
    setLoading(true);
    const userID = localStorage.getItem('userID');
    if (!userID) {
      setErrorMessage('User Not Logged In');
      // wait for 2 seconds and then remove error message
      setTimeout(() => {
        setErrorMessage('');
      }, 2000);
      return;
    }

    await handleObjectUpload(input, userID);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    props.onFileUpload();
    setLoading(false);
    return
  };

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
                  type="text"
                  value={input}
                  onInput={(e) =>
                    setInput((e.target as HTMLTextAreaElement).value)
                  }
                />
                <button
                  type="submit"
                  className="btn-primary btn"
                  // eslint-disable-next-line @typescript-eslint/no-misused-promises
                  onClick={handleUrlUpload}
                >
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
            </form>
          </div>
          <div className="modal-action"></div>
        </label>
      </label>
    </>
  );
};

export default AddMedia;

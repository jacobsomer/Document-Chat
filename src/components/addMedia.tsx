import { useState, useEffect } from 'react';
import UploadSquare from './uploadSquare';
import { supportedExtensions } from '~/utils/consts';
import { createClient } from '@supabase/supabase-js';
import { FiUpload } from 'react-icons/fi';
import { handleObjectUpload } from '~/utils/handleUpload';
import { useUser } from '@supabase/auth-helpers-react';
import { v4 } from 'uuid';
import { type AddMediaProps } from '~/types/types';

const cleanFileName = (fileName: string) => {
  // replace any characters that are not letters, numbers, dashes, spaces, or underscores with an underscore
  return fileName.replace(/[^a-zA-Z0-9-_]/g, '_');
};
const AddMedia = (props: AddMediaProps) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [input, setInput] = useState('');
  const user = useUser();
  // Create a single supabase client for interacting with your database
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );

  const removeErrorMessageAfter4Seconds = () => {
    setLoading(false);
    setTimeout(() => {
      setErrorMessage('');
    }, 4000);
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLoading(true);
    const file = event.target.files?.[0];
    if (file) {
      const extension = file.name.split('.').pop();
      if (!extension || !supportedExtensions.includes(extension)) {
        setErrorMessage(
          'FileType is not one of: ' + supportedExtensions.toString()
        );
        removeErrorMessageAfter4Seconds();
        return;
      }
      // get file name
      const name = file.name.split('.').slice(0, -1).join('.');

      const cleaned_name = cleanFileName(name);

      const { data, error } = await supabase.storage
        .from('media')
        .upload(
          `userFiles/${props.chatId}/${cleaned_name}.${extension}`,
          file,
          {
            cacheControl: '3600',
            upsert: false
          }
        );
      if (error) {
        setErrorMessage(error.message);
        removeErrorMessageAfter4Seconds();
        return;
      }
      let url = '';
      if (data) {
        url = data.path;
      }
      const baseStorageUrl =
        'https://gsaywynqkowtwhnyrehr.supabase.co/storage/v1/object/public/media/';
      url = baseStorageUrl + url;
      const newDocId = v4();
      const { docId: docId, error: error1 } = await handleObjectUpload(
        url,
        newDocId
      );
      if (error1) {
        setErrorMessage(error1);
        removeErrorMessageAfter4Seconds();
        return;
      }
      const { error: insertError } = await supabase.from('chats').insert({
        chatId: props.chatId,
        docId: docId
      });

      if (insertError) {
        setErrorMessage(insertError.message);
        removeErrorMessageAfter4Seconds();
        return;
      }

      await props.updateFiles(props.chatId);

      // upload file to supabase storage
      setLoading(false);
    }
  };

  const handleUrlUpload = async (
    event: React.MouseEvent<HTMLButtonElement>
  ): Promise<any> => {
    event.preventDefault();
    setLoading(true);

    // check if url is already in userdocuments
    const { data: userDocs, error: userDocsError } = await supabase
      .from('userdocuments')
      .select('*')
      .eq('url', input);
    if (userDocsError) {
      setErrorMessage(userDocsError.message);
      removeErrorMessageAfter4Seconds();
    }
    if (userDocs && userDocs.length > 0) {
      if (userDocs[0]) {
        const docId = userDocs[0].docId as string;
        const { error: insertError } = await supabase.from('chats').insert({
          chatId: props.chatId,
          docId: docId
        });
        if (insertError) {
          setErrorMessage(insertError.message);
          removeErrorMessageAfter4Seconds();
          return;
        }
        await props.updateFiles(props.chatId);
        setLoading(false);
        return;
      }
    }
    const newDocId = v4();
    const { docId: docId, error: error1 } = await handleObjectUpload(
      input,
      newDocId
    );
    if (error1) {
      setErrorMessage(error1);
      removeErrorMessageAfter4Seconds();
      return;
    }
    const { error: insertError } = await supabase.from('chats').insert({
      chatId: props.chatId,
      docId: docId
    });
    if (insertError) {
      setErrorMessage(insertError.message);
      removeErrorMessageAfter4Seconds();
      return;
    }
    await props.updateFiles(props.chatId);
    setLoading(false);
    return;
  };

  return (
    <>
      <label
        htmlFor="my-modal-2"
        className="btn-ghost avatar btn text-base-content"
      >
        <FiUpload />
        &nbsp;&nbsp;Add Media
      </label>
      <input type="checkbox" id="my-modal-2" className="modal-toggle" />
      <label htmlFor="my-modal-2" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <h3 className="font-base-content text-lg">Add Data</h3>
          <UploadSquare handleFileUpload={handleFileUpload} />
          <br />
          <div className="flex justify-center">
            <h6 className="font-base-content text-lg">Or</h6>
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
                  onClick={(e) => void handleUrlUpload(e)}
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

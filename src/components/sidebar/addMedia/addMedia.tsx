import { useState } from 'react';
import UploadSquare from './uploadSquare';
import { supportedExtensions } from '~/utils/consts';

import { FiUpload } from 'react-icons/fi';
import { type AddMediaProps } from '~/types/types';
import { isMobile } from 'react-device-detect';
import { createClient } from '@supabase/supabase-js';
import FileMetadata from '../fileDisplay/file/fileModel';

import { uploadFile } from '~/api/frontend/uploadFile';

const cleanFileName = (fileName: string) => {
  // replace any characters that are not letters, numbers, dashes, spaces, or underscores with an underscore
  return fileName.replace(/[^a-zA-Z0-9-_]/g, '_');
};

const AddMedia = (props: AddMediaProps) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [input, setInput] = useState('');
  const [loadingForAWhile, setLoadingForAWhile] = useState(false);
 
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

  const removeErrorMessageAfter4Seconds = () => {
    setLoading(false);
    setTimeout(() => {
      setErrorMessage('');
    }, 4000);
  };

  const fileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
     successCallback: () => void, errorCallback: () => void,
  ) => {
    setLoading(true);
    setLoadingForAWhile(false);
    setTimeout(() => {
      setLoadingForAWhile(true);
    }, 10000);
    const file = event.target.files?.[0];

    if (file) {
      const extension = file.name.split('.').pop();

      if (!extension || !supportedExtensions.includes(extension)) {
        setErrorMessage(
          'FileType is not one of: ' + supportedExtensions.toString()
        );
        removeErrorMessageAfter4Seconds();
        errorCallback();
        return;
      }

      // get file name
      const name = file.name.split('.').slice(0, -1).join('.');

      const cleaned_name = cleanFileName(name);

      const url = await uploadFile(props.chatId, file, cleaned_name, extension);
      if (url === 'Error') {
        setErrorMessage('Error uploading file');
        removeErrorMessageAfter4Seconds();
        errorCallback();
        return;
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
          successCallback();
          setLoading(false);
          setLoadingForAWhile(false);
          return;
        }
      } catch (e) {
        errorCallback();
        setErrorMessage('Internal server error');
        removeErrorMessageAfter4Seconds();
        setLoading(false);
        setLoadingForAWhile(false);
        return;
      }
    }
  };

  const handleUrlUpload = async (
    event: React.MouseEvent<HTMLButtonElement>,
     successCallback: () => Promise<void>, errorCallback: () => Promise<void>,
  ): Promise<void> => {
    event.preventDefault();
    setLoading(true);
    setLoadingForAWhile(false);
    setTimeout(() => {
      setLoadingForAWhile(true);
    }, 10000);
    const enpointURL = '/api/upload/handleUrlUpload';
    const response = await fetch(enpointURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: input, chatId: props.chatId })
    });
    if (!response.ok) {
      await errorCallback();
      setErrorMessage('Error with API');
      removeErrorMessageAfter4Seconds();
      setLoading(false);
      setLoadingForAWhile(false);
      return;
    }
    const resp = (await response.json()) as { message: string };
    if (resp.message === 'File uploaded successfully') {
      await props.updateFiles(props.chatId);
      const closeModal = document.getElementById('closeModal');
      if (closeModal) {
        closeModal.click();
      }
      await successCallback();
      setLoading(false);
      setLoadingForAWhile(false);
      return;
    }
    else{
       await errorCallback();
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLoading(true);
    setLoadingForAWhile(false);
    setTimeout(() => {
      setLoadingForAWhile(true);
    }, 10000);
    
    const closeModal = document.getElementById('closeModal');
    if (closeModal) {
      closeModal.click();
    }
    const metadata: FileMetadata = await props.updateFiletree({
      url: "URL placeholder", // TODO
      docId: "DocID placeholder", // TODO
      docName: event.target.files?.[0] ? event.target.files?.[0].name : "upload error",
    });
    const successCallback = () => { 
      console.log("upload successful, metadata object mutated")
      metadata.finishLoading(); 
    }; // TODO
    const errorCallback = () => {
      console.log("upload unsuccessful, metadata object mutated")
      metadata.finishLoading(); 
    }; // TODO

    
    await fileUpload(event, successCallback, errorCallback);
    setLoading(false);
    setLoadingForAWhile(false);
    return;
  };

  return (
    <>
      {isMobile ? (
        <label
          htmlFor="my-modal-2"
          className="btn-lg avatar btn btn mb-10 rounded-md px-4  py-2 text-2xl"
          onClick={() => {
            props.setToolTipString('');
          }}
        >
          <FiUpload />
          &nbsp;&nbsp;Add Media
        </label>
      ) : (
        <label
          htmlFor="my-modal-2"
          className="btn-ghost avatar btn text-base-content"
          onClick={() => {
            props.setToolTipString('');
          }}
        >
          <FiUpload />
          &nbsp;&nbsp;Add Media
        </label>
      )}

      <input type="checkbox" id="my-modal-2" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative">
          {isMobile ? (
            <>
              <label
                htmlFor="my-modal-2"
                className="btn-circle btn-lg btn absolute right-2 top-2 text-3xl"
                id="closeModal"
              >
                ✕
              </label>

              <h3 className="font-base-content text-3xl">Press To Add Data</h3>
            </>
          ) : (
            <>
              <label
                htmlFor="my-modal-2"
                className="btn-sm btn-circle btn absolute right-2 top-2"
                id="closeModal"
              >
                ✕
              </label>
              <h3 className="font-base-content text-lg">Add Data</h3>
            </>
          )}
          <UploadSquare handleFileUpload={async (event: React.ChangeEvent<HTMLInputElement>) => {      
            props.forceUpdateFiletree();
            await handleFileUpload(event); 
          }} />
          <div className="divider relative w-[100%]">OR</div>
          <div>
            <form className="flex w-full max-w-xl flex-col gap-2 py-4">
              {isMobile ? (
                <>
                  <p className="text-3xl">Enter URL:</p>
                  <div className="flex gap-x-4">
                    <input
                      placeholder="ex. https://www.youtube.com/watch?v=qbIk7-JPB2c"
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
                  <p className="text-xl">
                    Supported URLs include, youtube videos, wikipedia articles,
                    news, and more.
                  </p>
                </>
              ) : (
                <>
                  <p>Enter URL </p>
                  <div className="flex gap-x-4">
                    <input
                      placeholder="ex. https://www.youtube.com/watch?v=qbIk7-JPB2c"
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
                  <p className="text-sm">
                    Supported URLs include, youtube videos, wikipedia articles,
                    news, and more.
                  </p>
                </>
              )}

              {loading && <progress className="progress w-56"></progress>}
              {errorMessage && (
                <p className="text-sm" style={{ color: 'red' }}>
                  {errorMessage}
                </p>
              )}
              {loading && !loadingForAWhile && (
                <p className="text-sm">Loading...</p>
              )}
              {loadingForAWhile && loading && (
                <p className="text-sm">
                  Please wait as this may take a few moments...
                </p>
              )}
            </form>
          </div>
          <div className="modal-action"></div>
        </div>
      </div>
    </>
  );
};

export default AddMedia;

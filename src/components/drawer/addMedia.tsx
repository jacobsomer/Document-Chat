import { useReducer, useState } from 'react';
import UploadSquare from './uploadSquare';
import { supportedExtensions, unstructuredExtensions } from '~/utils/consts';

import { FiUpload } from 'react-icons/fi';
import { File } from '~/types/types';
import { handleObjectUpload } from '~/utils/handleUpload';
import { v4 } from 'uuid';
import { type AddMediaProps } from '~/types/types';
import { isMobile } from 'react-device-detect';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';
import FileMetadata from '../sidebar/fileMetadata';

const cleanFileName = (fileName: string) => {
  // replace any characters that are not letters, numbers, dashes, spaces, or underscores with an underscore
  return fileName.replace(/[^a-zA-Z0-9-_]/g, '_');
};

const AddMedia = (props: AddMediaProps) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [input, setInput] = useState('');
  const [loadingForAWhile, setLoadingForAWhile] = useState(false);
  const router = useRouter();

  const origin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : '';
  // Create a single supabase client for interacting with your database
  const supabase = origin.includes('localhost')
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
    successCallback: () => Promise<void>, errorCallback: () => Promise<void>,
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      // Step 1: parse the file name and extension
      const extension = file.name.split('.').pop();

      if (!extension || !supportedExtensions.includes(extension)) {
        setErrorMessage(
          'FileType is not one of: ' + supportedExtensions.toString()
        );
        removeErrorMessageAfter4Seconds();
        const closeModal = document.getElementById('closeModal');
        if (closeModal) {
          closeModal.click();
        }
        return;
      }

      // get file name
      const name = file.name.split('.').slice(0, -1).join('.');
      const cleaned_name = cleanFileName(name);

      // Step 2: call the right logic per file extension type. Either we have a 
      // relatively normal/unstructured/NLP extension supported by JS, or send it to the backend to handle. 
      if (
        extension === 'pdf' ||
        extension === 'txt' ||
        extension === 'docx' ||
        extension === 'csv' ||
        unstructuredExtensions.includes(extension)
      ) {
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch(
          '/api/upload/handleFileUpload' +
            '?chatId=' +
            props.chatId +
            '&name=' +
            cleaned_name +
            '&extension=' +
            extension,
          {
            method: 'POST',
            body: formData
          }
        );
        const resp = (await response.json()) as { message: string };
        if (resp.message === 'File uploaded successfully') {
          await props.updateFiles(props.chatId);
          void supabase.storage
            .from('media')
            .upload(
              `userFiles/${props.chatId}/${cleaned_name}.${extension}`,
              file,
              {
                cacheControl: '3600',
                upsert: false
              }
            );
            await successCallback();
        } else {
          console.log(resp.message);
          await errorCallback();
        }
      } else {
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
        if (error && !error.message.includes('The resource already exists')) {
          setErrorMessage(error.message);
          removeErrorMessageAfter4Seconds();
          return;
        }
        let url = '';
        if (data) {
          url = data.path;
        } else {
          url = `userFiles/${props.chatId}/${cleaned_name}.${extension}`;
        }
        const baseStorageUrl =
          'https://gsaywynqkowtwhnyrehr.supabase.co/storage/v1/object/public/media/';
        url = baseStorageUrl + url;
        const newDocId = v4();
        const apiURL =
          '/api/upload/getEmbeddingsForText?chatId=' +
          props.chatId +
          '&name=' +
          cleaned_name +
          '&url=' +
          url +
          '&newDocId=' +
          newDocId;
        const response = await fetch(apiURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ url: url })
        });
        if (!response.ok) {
          await errorCallback();
          setErrorMessage('Error with API');
          removeErrorMessageAfter4Seconds();
          setLoading(false);
          setLoadingForAWhile(false);
        } else {
          await successCallback();
        }
        const resp = (await response.json()) as { message: string };
        if (resp.message === 'File uploaded successfully') {
          await props.updateFiles(props.chatId);
        }
      }
      await successCallback();
      return;
    }
  }

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
    const successCallback = async () => { 
      console.log("upload successful, metadata object mutated")
      metadata.finishLoading(); 
    }; // TODO
    const errorCallback = async () => {
      console.log("upload unsuccessful, metadata object mutated")
      metadata.finishLoading(); 
    }; // TODO

    
    await fileUpload(event, successCallback, errorCallback);
    console.log("file upload called");

    setLoading(false);
    setLoadingForAWhile(false);
    return;
  };

  const handleUrlUpload = async (
    event: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    event.preventDefault();
    setLoading(true);
    setLoadingForAWhile(false);
    setTimeout(() => {
      setLoadingForAWhile(true);
    }, 10000);
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
            console.log("hit: handleFileUpload called")
            
            console.log("hit: updateFileTree called");
            props.forceUpdateFiletree();
            // TODO: call a force update on Sidebar
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

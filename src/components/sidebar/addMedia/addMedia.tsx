import { useState } from 'react';
import UploadSquare from './uploadSquare';
import { supportedExtensions } from '~/utils/consts';

import { FiUpload } from 'react-icons/fi';
import { type AddMediaProps } from '~/types/types';
import { isMobile } from 'react-device-detect';
import FileMetadata from '../fileDisplay/file/fileModel';

import { uploadFile } from '~/apiEndpoints/frontend/uploadFile';
import { uploadUrl } from '~/apiEndpoints/frontend/uploadUrl';

const AddMedia = (props: AddMediaProps) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [input, setInput] = useState('');
  const [loadingForAWhile, setLoadingForAWhile] = useState(false);

  // Call whenever the action to initiate an upload has begun
  const resetLoadingStates = () => {
    setLoading(true);
    setLoadingForAWhile(false);
    setTimeout(() => {
      setLoadingForAWhile(true);
    }, 10000);
    const closeModal = document.getElementById('closeModal');
    if (closeModal) {
      closeModal.click();
    }
  };

  // Call whenever a response has been received regarding an upload.
  const terminateLoadingStates = async (
    callback: () => Promise<void>,
    errorMessage?: string
  ) => {
    await callback();
    if (errorMessage) {
      setErrorMessage(errorMessage);
      removeErrorMessageAfter4Seconds();
    }
    setLoading(false);
    setLoadingForAWhile(false);
  };

  const removeErrorMessageAfter4Seconds = () => {
    setLoading(false);
    setTimeout(() => {
      setErrorMessage('');
    }, 4000);
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // Preemptively create new objects to map to components so that the upload is immediately reflected in the sidebar.
    resetLoadingStates();
    
    // Extract data from the event to pass into the API endpoint
    if (event.target.files) {
      for (var i: number = 0; i < event.target.files.length; i++) {
        const file = event.target.files?.[i];

        if (file && file.name != ".DS_Store") {
          const metadata: FileMetadata = await props.updateFiletree({
            url: 'URL placeholder',
            docId: 'DocID placeholder',
            docName: file
              ? file.webkitRelativePath
              : 'upload error'
          });
          const mainCallback = async () => {
            metadata.finishLoading();
            props.forceUpdateFiletree();
          };
          const errorCallback = async () => {
            console.log('upload unsuccessful');
            metadata.finishLoading();
            props.forceUpdateFiletree();
          };

          await uploadFile({
            file: file,
            chatId: props.chatId,
            updateFiles: props.updateFiles,
            successCallback: async () => {await terminateLoadingStates(mainCallback, undefined)},
            validationErrorCallback: async () => {await terminateLoadingStates(
                errorCallback,
                'FileType is not one of: ' + supportedExtensions.toString()
              )},
            clientErrorCallback: async () => {await terminateLoadingStates(errorCallback, 'Error uploading file')},
            serverErrorCallback: async () => {await terminateLoadingStates(errorCallback, 'Internal server error')}
          });
        }
        
      }
    }
    return;
  };

  const handleUrlUpload = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    // Preemptively create new objects to map to components so that the upload is immediately reflected in the sidebar.
    resetLoadingStates();
    const closeModal = document.getElementById('closeModal');
    if (closeModal) {
      closeModal.click();
    }
    const metadata: FileMetadata = await props.updateFiletree({
      url: 'URL placeholder',
      docId: 'DocID placeholder',
      docName: input
    });
    const successCallback = async () => {
      console.log('upload successful');
      metadata.finishLoading();
      props.forceUpdateFiletree();
    };
    const errorCallback = async () => {
      console.log('upload unsuccessful');
      metadata.finishLoading();
      props.forceUpdateFiletree();
    };

    // Extract data from the event to pass into the API endpoint
    event.preventDefault();
    await uploadUrl({
      input: input,
      chatId: props.chatId,
      updateFiles: props.updateFiles,
      successCallback: async () => await terminateLoadingStates(successCallback),
      clientErrorCallback: async () => await terminateLoadingStates(errorCallback, 'Error with API'),
      serverErrorCallback: async () => await terminateLoadingStates(errorCallback, 'Internal server error')
    });
    terminateLoadingStates(async () => {});
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
          &nbsp;&nbsp;Add {props.directoryUpload ? "Folder" : "Files" }
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
          <UploadSquare
            handleFileUpload={async (
              event: React.ChangeEvent<HTMLInputElement>
            ) => {
              props.forceUpdateFiletree();
              await handleFileUpload(event);
            }}
          />
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

import { useState } from 'react';
import UploadSquare from './uploadSquare';
import { supportedExtensions } from '~/utils/consts';

import { type AddMediaProps } from '~/types/types';
import { isMobile } from 'react-device-detect';
import FileModel from '../fileDisplay/file/fileModel';

import { uploadFile } from '~/apiEndpoints/frontend/uploadFile';
import { uploadUrl } from '~/apiEndpoints/frontend/uploadUrl';
import { AddMediaButton } from './addMediaButton';
import { AddDataHeader } from './addDataHeader';
import { AddUrl } from './addUrl';
import { getUploadURL } from 'tmp/uploadFile';


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
      const temp = new Array<File | undefined>;
      for (var i: number = 0; i < event.target.files?.length; i++) {
        temp.push(event.target.files?.[i])
      }

      for (var i: number = 0; i < temp.length; i++) {
        const file = temp?.[i];
        if (file && file.name != ".DS_Store") {
          handleSingleFile(file);
        }
      }
    }
    return;
  };

  const handleSingleFile = async (file: File) => {

    const fileModel: FileModel = await props.updateFiletree({
      url: '',
      docId: '', // TODO: is this needed if docName is unique?
      docName: file
        ? file.webkitRelativePath
        : 'upload error',
      sourceFile: file,
      chatId: props.chatId,
      updateFiles: props.updateFiles,
    });
    const mainCallback = async () => {
      fileModel.finishLoading();
      props.forceUpdateFiletree();
    };
    const errorCallback = async () => {
      console.log('upload unsuccessful');
      fileModel.finishLoading();
      fileModel.deleteFile();
      props.forceUpdateFiletree();
    };

    await uploadFile({
      file: file,
      fileModel: fileModel,
      chatId: props.chatId,
      updateFiles: props.updateFiles,
      successCallback: async () => {
        await terminateLoadingStates(mainCallback, undefined)
      },
      validationErrorCallback: async () => {await terminateLoadingStates(
          errorCallback,
          'FileType is not one of: ' + supportedExtensions.toString()
        )},
      clientErrorCallback: async () => {
        await terminateLoadingStates(errorCallback, 'Error uploading file')
      },
      serverErrorCallback: async () => {
        await terminateLoadingStates(errorCallback, 'Internal server error')
      }
    });
  }

  const handleUrlUpload = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    // Preemptively create new objects to map to components so that the upload is immediately reflected in the sidebar.
    resetLoadingStates();
    const closeModal = document.getElementById('closeModal');
    if (closeModal) {
      closeModal.click();
    }
    const metadata: FileModel = await props.updateFiletree({
      url: input,
      docName: input,
      chatId: props.chatId,
      updateFiles: props.updateFiles,
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
      <AddMediaButton isMobile={isMobile} directoryUpload={props.directoryUpload} setToolTipString={props.setToolTipString} />

      <input type="checkbox" id="my-modal-2" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative">
          <AddDataHeader isMobile={isMobile} />
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
              <AddUrl isMobile={isMobile} input={input} setInput={setInput} handleUrlUpload={handleUrlUpload} />
              {loading && <progress className="progress w-56"></progress>}
              {errorMessage && (
                <p className="text-sm" style={{ color: 'red' }}>
                  {errorMessage}
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
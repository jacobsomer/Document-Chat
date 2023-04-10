import { type NextPage } from 'next';
import Head from 'next/head';
import { useUser } from '@supabase/auth-helpers-react';
import { FiUpload } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import Login from '~/components/login';
import { v4 } from 'uuid';
import { supportedExtensions } from '~/utils/consts';
import { createClient } from '@supabase/supabase-js';
import { handleObjectUpload } from '~/utils/handleUpload';
import Router from 'next/router';

const baseStorageUrl =
  'https://gsaywynqkowtwhnyrehr.supabase.co/storage/v1/object/public/media/';

const Home: NextPage = () => {
  const user = useUser();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [input, setInput] = useState('');

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );

  useEffect(() => {
    if (user) {
      void Router.push({
        pathname: '/chat'
      });
    }
  }, [user]);

  const removeErrorMessageAfter2Seconds = () => {
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
        setErrorMessage('FileType Not Supported');
        // wait for 2 seconds and then remove error message
        removeErrorMessageAfter2Seconds();
        return;
      }
      // get file name
      const name = file.name.split('.').slice(0, -1).join('.');
      const chatId = v4();
      const { data, error } = await supabase.storage
        .from('media')
        .upload(`userFiles/${chatId}/${name}.${extension}`, file, {
          cacheControl: '3600',
          upsert: false
        });
      if (error) {
        setErrorMessage(error.message);
        // wait for 2 seconds and then remove error message
        removeErrorMessageAfter2Seconds();
        return;
      }
      let url = '';
      if (data) {
        url = baseStorageUrl + data.path;
      }

      const generatedDocId = v4();
      const { docId, error: uploadError } = await handleObjectUpload(
        url,
        generatedDocId
      );
      if (!docId) {
        setErrorMessage(uploadError);
        // wait for 2 seconds and then remove error message
        removeErrorMessageAfter2Seconds();
        return;
      }

      const { error: insertError } = await supabase.from('chats').insert({
        chatId: chatId,
        docId: docId
      });

      if (insertError) {
        setErrorMessage(insertError.message);
        // wait for 2 seconds and then remove error message
        removeErrorMessageAfter2Seconds();
        return;
      }

      void Router.push({
        pathname: '/chat/[chatId]',
        query: { chatId: chatId }
      });

      setLoading(false);
    }
  };

  const handleUrlUpload = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    setLoading(true);

    const url = input;
    const generatedDocId = v4();
    const chatId = v4();

    const { docId, error: uploadError } = await handleObjectUpload(
      url,
      generatedDocId
    );
    if (!docId) {
      setErrorMessage(uploadError);
      // wait for 2 seconds and then remove error message
      removeErrorMessageAfter2Seconds();
      return;
    }

    const { error: insertError } = await supabase.from('chats').insert({
      chatId: chatId,
      docId: docId
    });

    if (insertError) {
      setErrorMessage(insertError.message);
      // wait for 2 seconds and then remove error message
      removeErrorMessageAfter2Seconds();
      return;
    }

    void Router.push({
      pathname: '/chat/[chatId]',
      query: { chatId: chatId }
    });

    setLoading(false);
    return;
  };

  return (
    <>
      <Head>
        <title>DocuChat</title>
        <meta name="description" content="Chat with any data source" />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🧋</text></svg>"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <main
        data-theme="light"
        className="flex min-h-screen flex-col justify-center bg-base-content"
      >
        {!user && (
          <div className="absolute top-0 right-0 p-4">
            <Login />
          </div>
        )}
        <div className="absolute top-0 left-0 p-4">
          <h1 className="text-3xl font-bold text-white">DocuChat</h1>
        </div>
        <div className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
          <p className="mt-12 text-4xl text-white">
            Interact with
            <b className="display-inline font-bold text-primary"> PDFs</b>,{' '}
            <b className="display-inline font-bold text-primary">Videos</b>, and
            <b className="display-inline font-bold text-primary"> More</b>
          </p>
          <br />
          <br />
          <br />
          {!loading ? (
            <>
              <label
                style={{
                  width: '80%',
                  height: '90px',
                  maxWidth: '400px',
                  border: '2px dashed #fff',
                  borderRadius: '5px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: '#fff',
                  cursor: 'pointer'
                }}
                htmlFor="upload-input1"
              >
                <input
                  id="upload-input1"
                  className="height-0 relative top-0 right-0 w-0 text-9xl opacity-0"
                  type="file"
                  // eslint-disable-next-line @typescript-eslint/no-misused-promises
                  onChange={handleFileUpload}
                />
                <FiUpload
                  style={{
                    fontSize: '30px',
                    marginRight: '10px'
                  }}
                />
                Upload Files Here
              </label>
              <br />
              <div className="flex justify-center">
                <h6 className="text-lg font-bold text-white">Or</h6>
              </div>
              <form
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: 'relative',
                  marginTop: '20px'
                }}
              >
                <div className="flex gap-x-4">
                  <input
                    placeholder="Paste URL here: "
                    className="input-bordered input"
                    value={input}
                    onInput={(e) =>
                      setInput((e.target as HTMLTextAreaElement).value)
                    }
                  />
                  <button
                    type="submit"
                    className="btn-primary btn"
                    onClick={(e)=>{void handleUrlUpload(e)}}
                  >
                    Go
                  </button>
                </div>
              </form>
            </>
          ) : (
            <progress className="text-p progress w-56">
              Loading, Please Wait as this may take a few moments for your
              documents to load.
            </progress>
          )}
          {errorMessage && (
            <div className="toast-start toast-bottom toast">
              <div className="alert alert-info bg-error">
                <div>
                  <span>{errorMessage}</span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex h-20 w-full flex-col items-center justify-center bg-base-200">
          <div className="flex flex-row items-center justify-center gap-x-4">
            <a
              href="https://twitter.com/DocuChatApp"
              target="_blank"
              rel="noopener noreferrer"
              className="link-hover link-primary link"
            >
              Twitter
            </a>
            <a
              href="https://discord.gg/4Z8Q2Z8"
              target="_blank"
              rel="noopener noreferrer"
              className="link-hover link-primary link"
            >
              Discord
            </a>
            <a
              href="https://www.notion.so/DocuChat-Privacy-Policy-0e2e8e2e8e2e4e4e8e2e8e2e8e2e8e2e8"
              target="_blank"
              rel="noopener noreferrer"
              className="link-hover link-primary link"
            >
              Privacy Policy
            </a>
            <a
              href="https://www.notion.so/DocuChat-Disclaimer-0e2e8e2e8e2e4e4e8e2e8e2e8e2e8e2e"
              target="_blank"
              rel="noopener noreferrer"
              className="link-hover link-primary link"
            >
              Disclaimer
            </a>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

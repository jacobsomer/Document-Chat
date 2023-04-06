import { type NextPage } from 'next';
import Head from 'next/head';
import { useUser } from '@supabase/auth-helpers-react';
import { GettingStartedModal } from '~/components/gettingStartedModal';
import { FiUpload } from 'react-icons/fi';
import { useEffect } from 'react';
import Login from '~/components/login';

const Home: NextPage = () => {
  const user = useUser();

  useEffect(() => {
    if (user) {
      // redirect to chat page
      window.location.href = '/chat';
    }
  }, [user]);

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
          <div
            style={{
              width: '80%',
              height: '90px',
              maxWidth: '400px',
              border: '2px dashed #fff',
              borderRadius: '5px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#fff'
            }}
            onMouseEnter={() => {
              document.body.style.cursor = 'pointer';
            }}
            onMouseLeave={() => {
              document.body.style.cursor = 'default';
            }}
          >
            <FiUpload
              style={{
                fontSize: '30px',
                marginRight: '10px'
              }}
            />
            Upload Files Here
          </div>
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
              />
              <button type="submit" className="btn-primary btn">
                Go
              </button>
            </div>
          </form>
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

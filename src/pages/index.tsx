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

  return (
    <>
      <Head>
        <title>DC</title>
        <meta name="description" content="Chat with any data source" />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🧋</text></svg>"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <main
        data-theme="light"
        className="bg-gradient-radial flex min-h-screen flex-col justify-center from-primary via-base-100 to-accent"
      >
        {!user && (
          <div className="absolute right-0 top-0 p-4">
            <Login chatURL="/chat" />
          </div>
        )}

        <div className="absolute left-0 top-0 p-4">
          <h1 className="text-3xl font-bold text-base-content">DC</h1>
        </div>
        <div className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
          <p className="mt-12 text-4xl text-base-content">
            Interact with
            <b className="display-inline font-bold text-primary"> PDFs</b>,{' '}
            <b className="display-inline font-bold text-primary">Videos</b>, and
            <b className="display-inline font-bold text-primary"> More</b>
          </p>
          <br />
          <br />
          <br />
          <button
            type="button"
            className="btn-ghost btn bg-primary  text-primary-content hover:bg-primary-focus"
            onClick={() => {
              void Router.push('/chat');
            }}
          >
            Get Started
          </button>
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

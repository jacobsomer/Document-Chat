import { type NextPage } from 'next';
import Head from 'next/head';
import { useUser } from '@supabase/auth-helpers-react';
import Login from '~/components/utils/login';
import Image from 'next/image';
import { Mukta } from 'next/font/google';
import Router from 'next/router';
import { useRef } from 'react';

const mukta = Mukta({
  weight: '500',
  style: 'normal',
  subsets: ['latin']
});

const Home: NextPage = () => {
  const user = useUser();
  const myRef = useRef<null | HTMLDivElement>(null);
  const executeScroll = () => {
    if (myRef.current) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      myRef.current.scrollIntoView();
    }
  };
  return (
    <>
      <Head>
        <title>BobaChat</title>
        <meta name="description" content="Chat with any data source" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <main data-theme="light" style={mukta.style}>
        <div className="flex min-h-screen flex-col justify-center from-primary">
          {!user && (
            <div className="absolute right-0 top-0 flex flex-row p-4">
              <div
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  display: 'flex',
                  width: '100px',
                  cursor: 'pointer'
                }}
                onClick={executeScroll}
              >
                About
              </div>
              <div>
                <Login chatURL="" />
              </div>
            </div>
          )}
          <div
            className="absolute left-0 top-0 flex cursor-pointer flex-row items-center justify-center p-4"
            onClick={() => void Router.push('/')}
          >
            <Image
              src="/logo.svg"
              alt="Chat Boba Logo"
              width={67}
              height={67}
            />
            <h1 className="text-3xl font-bold text-base-content">ChatBoba</h1>
          </div>
          <div className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
            <p className="mt-12 text-4xl text-base-content">
              Interact with
              <b className="display-inline font-bold text-primary">
                {' '}
                PDFs
              </b>,{' '}
              <b className="display-inline font-bold text-primary">Videos</b>,
              and
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
        </div>
        <div>
          <div className="justify-top flex flex-col items-center p-10">
            <h2 className="mb-4 mb-[60px] text-4xl font-bold" ref={myRef}>
              How it Works
            </h2>
            <h3 className="mb-4 text-2xl font-bold">1. Add Media</h3>
            <Image
              src="/addMedia.svg"
              alt="Chat Boba Logo"
              width={400}
              height={400}
            />
            <h3 className="mb-4 text-2xl font-bold">2. Chat</h3>
            <Image
              src="/chatexample.svg"
              alt="Chat Boba Logo"
              width={400}
              height={400}
            />
          </div>
        </div>

        <div className="flex h-20 w-full flex-col items-center justify-center bg-base-200">
          <div className="flex flex-row items-center justify-center gap-x-4">
            <a
              href="https://twitter.com/jacob_somer_"
              target="_blank"
              rel="noopener noreferrer"
              className="link-hover link-primary link"
            >
              Twitter
            </a>
            <a
              href="https://discord.gg/X3zEHukSbJ"
              target="_blank"
              rel="noopener noreferrer"
              className="link-hover link-primary link"
            >
              Discord
            </a>
            <a
              href="https://bright-carnation-959.notion.site/Chat-Boba-6ff9807d9e0346599d6c1c9f8b695b1f"
              target="_blank"
              rel="noopener noreferrer"
              className="link-hover link-primary link"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

import { type NextPage } from 'next';
import { useEffect } from 'react';
import Head from 'next/head';
import { useUser } from '@supabase/auth-helpers-react';
import Login from '~/components/utils/login';
import Image from 'next/image';
import { Mukta } from 'next/font/google';
import Router from 'next/router';
import { useRef } from 'react';
import { isMobile } from 'react-device-detect';

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
      myRef.current.scrollIntoView();
    }
  };

  return (
    <>
      <Head>
        <title>ChatBoba</title>
        <meta
          name="description"
          content="ChatBoba - Chat with any Data Source!"
        />
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
          <div className="absolute right-0 top-0 flex flex-row p-4">
            <div
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                display: 'flex',
                width: '100px',
                cursor: 'pointer'
              }}
              className="btn-ghost btn rounded-md px-4 py-2 text-base-content hover:bg-base-content hover:bg-opacity-20"
              onClick={executeScroll}
            >
              About
            </div>
            {!user && (
              <div>
                <Login chatURL="/chat/" />
              </div>
            )}
          </div>

          <div
            className="absolute left-0 top-0 flex cursor-pointer flex-row items-center justify-center p-4"
            onClick={() => void Router.push('/')}
          >
            <Image
              src="/logo.svg"
              alt="Chat Boba Logo"
              width={50}
              height={50}
            />
            {isMobile ? (
              <h1 className="text-lg font-bold text-base-content">ChatBoba</h1>
            ) : (
              <h1 className="text-xl font-bold text-base-content">ChatBoba</h1>
            )}
          </div>
          <div className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
            <p className="mt-12 text-6xl text-base-content drop-shadow-[0_35px_35px_rgba(102,26,230,.5)]">
              Chat with{' '}
              <b className="display-inline bg-gradient-to-r from-primary to-secondary bg-clip-text font-extrabold text-transparent ">
                Docs,Youtube Videos, and More
              </b>
            </p>
            <p className="w-100 text-xl text-base-content">
              Create a chat room with any data source. Connect your data sources
              and 10x your writing productivity.
            </p>
            <br />
            {isMobile ? (
              <button
                type="button"
                className="btn-ghost btn h-[45px] w-3/4 rounded-full bg-primary text-4xl text-primary-content hover:bg-primary-focus"
                onClick={() => {
                  void Router.push('/chat');
                }}
              >
                {user?.id !== null
                  ? 'Start Chatting'
                  : 'Start Chatting For Free'}
              </button>
            ) : (
              <button
                type="button"
                className="btn-ghost btn w-1/2 rounded-full bg-primary text-primary-content hover:bg-primary-focus"
                onClick={() => {
                  void Router.push('/chat');
                }}
              >
                {user?.id !== null
                  ? 'Start Chatting'
                  : 'Start Chatting For Free'}
              </button>
            )}
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
              width={800}
              height={800}
            />
            <h3 className="mb-4 text-2xl font-bold">2. Chat</h3>
            <Image
              src="/chatexample.svg"
              alt="Chat Boba Logo"
              width={800}
              height={800}
            />
          </div>
        </div>
        <footer className="footer footer-center rounded bg-base-200 p-10 text-base-content">
          <div className="grid grid-flow-col gap-4">
            <a
              className="link-hover link"
              href="https://bright-carnation-959.notion.site/Chat-Boba-About-Us-437f33bb6a9743f1a7e7e0063efa6eae"
              target="_blank"
            >
              About Us
            </a>
            <a
              className="link-hover link"
              href="mailto:somerjacob@gmail.com"
              target="_blank"
            >
              Contact
            </a>
            <a
              className="link-hover link"
              href="https://bright-carnation-959.notion.site/Chat-Boba-6ff9807d9e0346599d6c1c9f8b695b1f"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>
          </div>
          <div>
            <div className="grid grid-flow-col gap-4">
              <a href="https://twitter.com/jacob_somer_" target="_blank">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="fill-current hover:fill-primary"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                </svg>
              </a>
              <a href="https://discord.gg/X3zEHukSbJ" target="_blank">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="38"
                  height="38"
                  viewBox="0 0 24 24"
                  className="fill-current hover:fill-primary"
                  target="_blank"
                >
                  <path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z" />
                </svg>
              </a>
            </div>
          </div>
          <div>
            <p>
              Made with ❤️ by{' '}
              <a
                className="link-hover"
                href="https://jacobsomer.com"
                target="_blank"
              >
                Jacob Somer
              </a>{' '}
              and{' '}
              <a
                className="link-hover"
                href="https://www.justinliang.me/"
                target="_blank"
              >
                Justin Liang
              </a>
            </p>
          </div>
        </footer>
      </main>
    </>
  );
};

export default Home;

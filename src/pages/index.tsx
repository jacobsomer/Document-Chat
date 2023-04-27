import { type NextPage } from 'next';
import Head from 'next/head';
import { useUser } from '@supabase/auth-helpers-react';
import Login from '~/components/utils/login';
import Router from 'next/router';
import Image from 'next/image';
import {  Mukta } from 'next/font/google'

const mukta = Mukta({
  weight:"500",
  style: 'normal',
  subsets: ['latin'],
})


const Home: NextPage = () => {
  const user = useUser();

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
                   fontFamily:"var(--inter-font)",
                }}
              >
                About
              </div>
              <div>
                <Login chatURL="" />
              </div>
            </div>
          )}
          <div className="absolute left-0 top-0 flex flex-row items-center justify-center p-4">
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
          <div></div>
        </div>
        <div>
          <div className="flex flex-col items-center justify-center p-10">
            <h2 className="mb-4 text-4xl font-bold">How it Works</h2>
            <div className="flex flex-col items-center justify-center md:flex-row">
              <div className="mb-8 flex w-full items-center justify-center bg-base-300 p-8 md:mb-0 md:mr-8 md:w-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 512"
                  className="h-48 w-48 text-primary"
                >
                  <path
                    fill="currentColor"
                    d="M256 224H32a32 32 0 0 0-32 32v192a32 32 0 0 0 32 32h224a32 32 0 0 0 32-32V256a32 32 0 0 0-32-32zm-32 160h-96v-96h96zm128 0h-96v-96h96zm128 0h-96v-96h96z"
                  ></path>
                </svg>
                <p className="ml-4">Upload your PDFs, DOCX, CSVs, Youtube URLs, News Sources, and More</p>
              </div>
              <div className="flex w-full items-center justify-center bg-base-300 p-8 md:ml-8 md:w-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 512"
                  className="h-48 w-48 text-primary"
                >
                  <path
                    fill="currentColor"
                    d="M615.06 152.28L448 20.14c-10.9-8.24-26.74-8.24-37.64 0L256 120.12 153.64 46.91c-10.9-8.24-26.74-8.24-37.64 0L24.94 152.28c-10.9 8.24-14.85 22.41-8.6 34.62L102 307.46v117.42c0 13.25 10.75 24 24 24h288c13.25 0 24-10.75 24-24V307.46l86.66-120.57c6.25-12.21 2.3-26.38-8.6-34.61zM448 71.55L509.74 128H386.26L448 71.55zm-168 360.9V304h64v128.45L280 432z"
                  ></path>
                </svg>
                <p className="ml-4">Ask GPT-3 to do anything with your files.</p>
              </div>
            </div>
          </div>
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

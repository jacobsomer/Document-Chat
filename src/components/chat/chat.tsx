import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum
} from 'openai';
import type { CompletionRequest, OaiModel } from '~/pages/api/stream';
import { BotMessage, UserMessage } from '~/components/chat/message';
import DrawerContent from '~/components/drawer/drawerContent';
import { type SearchResponse, type ChatProps } from '~/types/types';
import { MdOutlineDarkMode } from 'react-icons/md';
import { useRouter } from 'next/router';
import { useUser } from '@supabase/auth-helpers-react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { isMobile } from 'react-device-detect';
import { Mukta } from 'next/font/google';
import Image from 'next/image';
import Head from 'next/head';

const mukta = Mukta({
  weight: '500',
  style: 'normal',
  subsets: ['latin']
});

const model: OaiModel = 'gpt-3.5-turbo';

const initMessages: ChatCompletionRequestMessage[] = [
  {
    role: 'system',
    content: `You are a helpful assistant named ChatBoba powered by GPT-4, the newest model by OpenAI.`
  }
];

const scrollToBottom = (element: HTMLElement) => {
  element.scroll({
    behavior: 'auto',
    top: element.scrollHeight
  });
};

const createMessage = (
  content: string,
  role: ChatCompletionRequestMessageRoleEnum
): ChatCompletionRequestMessage => {
  return {
    content,
    role
  };
};

const Chat = (props: ChatProps) => {
  const ref = useRef<HTMLParagraphElement | null>(null);
  const [messages, setMessages] =
    useState<ChatCompletionRequestMessage[]>(initMessages);
  const [input, setInput] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark' | 'none'>('none');
  const [themeButtonIsHovered, setThemeButtonIsHovered] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [drawerIsOpened, setDrawerIsOpened] = useState(true);
  const router = useRouter();
  const user = useUser();
  const [count, setCount] = useState(0);

  const handleScroll = useCallback(() => {
    if (ref.current) {
      scrollToBottom(ref.current);
    }
  }, []);

  const getChat = useCallback(async () => {
    if (!user) {
      return;
    }

    if (count >= 1) {
      return;
    }
    setCount(count + 1);

    try {
      const res = await fetch(`/api/chats/getConversation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user.id,
          chatId: props.currentChat.chatId
        })
      });

      if (!res.ok) {
        const response = (await res.json()) as { message: string };
        console.error(response.message);
        return;
      }
      const new_chat = (await res.json()) as ChatCompletionRequestMessage[];
      if (new_chat === null) {
        return;
      }
      setMessages(new_chat);
    } catch (error) {
      console.error(error);
    }
  }, [count, props.currentChat.chatId, user]);

  const saveChat = useCallback(
    async (ret: ChatCompletionRequestMessage[]) => {
      if (!user) {
        return;
      }

      const conversation = JSON.stringify(ret);

      try {
        await fetch('/api/chats/save', {
          method: 'POST',
          body: JSON.stringify({
            userId: user.id,
            chatId: props.currentChat.chatId,
            conversation
          }),
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (error) {
        console.error(error);
      }
    },
    [user, props.currentChat.chatId]
  );

  const getAndUpdateTheme = useCallback(async () => {
    if (!user) {
      if (theme === 'none') {
        setTheme('light');
      }
      return;
    }

    const apiUrl = '/api/theme/getAndUpdateTheme';
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: user.id
      })
    });
    const resp = (await response.json()) as {
      message: string | undefined;
      theme: string | undefined;
    };

    if (resp.message) {
      console.log(resp.message);
      return;
    }
    if (resp.theme) {
      setTheme(resp.theme as 'light' | 'dark');
    }
  }, [user, theme]);

  useEffect(() => {
    handleScroll();
    void getAndUpdateTheme();
    void getChat();
    void saveChat(messages);
    if (isMobile && drawerIsOpened){
      setDrawerIsOpened(false);
    }
    return () => {
      void saveChat(messages);
    };
  }, [handleScroll, getChat, saveChat, messages, getAndUpdateTheme, drawerIsOpened]);

  const getDataSources = async (prompt: string): Promise<SearchResponse> => {
    // set chat to repeated loading state ...
    setLoadingText('Loading ...');

    const url =
      'https://docuchat-embeddings-search-fhpwesohfa-ue.a.run.app/searchChatRoom';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: prompt,
        chatId: props.currentChat.chatId
      })
    });
    if (!response.ok) {
      console.error(response.statusText);
    }
    const data = (await response.json()) as SearchResponse;
    return data;
  };

  const stream = async (input: string) => {
    const newUserMessage: ChatCompletionRequestMessage = {
      content: input,
      role: 'user'
    };

    let dataSources: string[] = [];
    if (props.files.length != 0) {
      dataSources = (await getDataSources(input)).body.slice(0, 3);
    }

    const completionRequestBody: CompletionRequest = {
      messages: messages.concat([newUserMessage]),
      dataSources: dataSources,
      model: model
    };

    console.log(completionRequestBody);

    const response = await fetch('/api/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(completionRequestBody)
    });

    if (!response.ok) {
      console.error(response.statusText);
    }
    setLoadingText('');

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      try {
        const jsns = chunkValue.trim().split('\n\n');
        for (const jsn of jsns) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          if (jsn.replace('data:', '').trim() === '[DONE]') {
            done = true;
            break;
          }

          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const data = JSON.parse(jsn.replace('data:', '').trim());

          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          if (!('content' in data.choices[0].delta)) {
            continue;
          }

          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          const text: string = data.choices[0].delta.content;

          setMessages((prevMessages) => {
            const last =
              prevMessages[prevMessages.length - 1] ||
              createMessage('', 'assistant');

            const ret = [
              ...prevMessages.slice(0, -1),
              { ...last, content: last.content + text }
            ];
            return ret;
          });
        }
        handleScroll();
      } catch (e) {
        console.log(e);
      }
    }
  };

  async function submit() {
    setMessages((prevMessages) => {
      const newMessages = [
        ...prevMessages,
        createMessage(input, 'user'),
        createMessage('', 'assistant')
      ];

      return newMessages;
    });

    // const textInput = input;
    setInput('');
    await stream(input);
    // if user, update messages for user chat room
  }
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void submit();
    }
  };

  function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    void submit();
  }

  function handleClearSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setMessages(initMessages);
  }

  const setUserTheme = async (theme: 'light' | 'dark') => {
    if (!user) {
      setTheme(theme);
      return;
    }

    const response = await fetch('/api/theme/setTheme', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: user.id,
        theme: theme
      })
    });
    if (!response.ok) {
      console.error(response.statusText);
    }

    setTheme(theme);
  };

  if (isMobile) {
    return (
      <>
        <Head>
          <Head>
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
            <link
              rel="mask-icon"
              href="/safari-pinned-tab.svg"
              color="#5bbad5"
            />
            <meta name="msapplication-TileColor" content="#da532c" />
            <meta name="theme-color" content="#ffffff" />
          </Head>
        </Head>
        {theme !== 'none' && (
          <main data-theme={theme} style={mukta.style}>
            <div className="z-0 flex flex-1 flex-row">
              {drawerIsOpened && (
                <DrawerContent
                  handleClearSubmit={handleClearSubmit}
                  files={props.files}
                  deleteFile={props.deleteFile}
                  updateFiles={props.updateFiles}
                  userChats={props.userChats}
                  currentChat={props.currentChat}
                  createNewChat={props.createNewChat}
                  deleteChat={props.deleteChat}
                  renameChat={props.renameChat}
                />
              )}

              <div className="flex h-[100vh] w-full flex-col gap-4 bg-base-100 p-8">
                <button
                  className="btn-ghostfixed btn-circle btn-lg btn bottom-4 right-4 z-50"
                  onClick={() => {
                    setDrawerIsOpened(!drawerIsOpened);
                  }}
                  id = "drawer-button"
                >
                  <GiHamburgerMenu />
                </button>
                <div className="flex items-center justify-center gap-x-2">
                  <div
                    className="flex cursor-pointer flex-row items-center justify-center p-4"
                    onClick={() => void router.push('/')}
                  >
                    <Image
                      src="/logo.svg"
                      alt="Chat Boba Logo"
                      width={67}
                      height={67}
                    />
                    <h1 className="text-3xl font-bold text-base-content">
                      ChatBoba
                    </h1>
                    <div className="text-5xl text-sm text-warning">
                      Beta Release
                    </div>
                  </div>
                </div>
                <div className="absolute right-12">
                  {theme === 'dark' ? (
                    <div className="tooltip" data-tip="Dark Mode">
                      {themeButtonIsHovered ? (
                        <MdOutlineDarkMode
                          className="h-16 w-16"
                          color="hsl(var(--b3))"
                          onMouseEnter={() => setThemeButtonIsHovered(true)}
                          onMouseLeave={() => setThemeButtonIsHovered(false)}
                          onClick={() => void setUserTheme('light')}
                        />
                      ) : (
                        <MdOutlineDarkMode
                          className="h-16 w-16"
                          color="hsl(var(--ps))"
                          onMouseEnter={() => setThemeButtonIsHovered(true)}
                          onMouseLeave={() => setThemeButtonIsHovered(false)}
                          onClick={() => void setUserTheme('light')}
                        />
                      )}
                    </div>
                  ) : (
                    <div className="tooltip" data-tip="Light Mode">
                      {themeButtonIsHovered ? (
                        <MdOutlineDarkMode
                          className="h-16 w-16"
                          color="hsl(var(--b3))"
                          onMouseEnter={() => setThemeButtonIsHovered(true)}
                          onMouseLeave={() => setThemeButtonIsHovered(false)}
                          onClick={() => void setUserTheme('dark')}
                        />
                      ) : (
                        <MdOutlineDarkMode
                          className="h-16 w-16"
                          color="hsl(var(--ps))"
                          onMouseEnter={() => setThemeButtonIsHovered(true)}
                          onMouseLeave={() => setThemeButtonIsHovered(false)}
                          onClick={() => void setUserTheme('dark')}
                        />
                      )}
                    </div>
                  )}
                </div>
                <div
                  className="w-full flex-grow overflow-y-scroll"
                  ref={ref}
                  style={{
                    width: '100%',
                    height: '100vh',
                    padding: '10px'
                  }}
                >
                  <ul>
                    {messages.map((msg, i) => {
                      switch (msg.role) {
                        case 'assistant':
                          return (
                            <li key={msg.role + i.toString()} className="py-2">
                              <BotMessage msg={msg} />
                            </li>
                          );
                        case 'user':
                          return (
                            <li key={msg.role + i.toString()} className="py-2">
                              <UserMessage msg={msg} />
                            </li>
                          );
                        case 'system':
                          return;
                      }
                    })}
                    {loadingText}
                  </ul>
                </div>
                <form className="mb-[60px] flex flex-row items-center gap-x-6">
                  <input
                    type="text"
                    placeholder="Type here"
                    className="input-bordered input h-[60px] w-full bg-base-100"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <button className="btn-primary btn-lg" onClick={handleSubmit}>
                    Send
                  </button>
                </form>
              </div>
            </div>
          </main>
        )}
      </>
    );
  }

  return (
    <>
      {theme !== 'none' && (
        <main data-theme={theme} style={mukta.style}>
          <div className="z-0 flex flex-1 flex-row">
            <DrawerContent
              handleClearSubmit={handleClearSubmit}
              files={props.files}
              deleteFile={props.deleteFile}
              updateFiles={props.updateFiles}
              userChats={props.userChats}
              currentChat={props.currentChat}
              createNewChat={props.createNewChat}
              deleteChat={props.deleteChat}
              renameChat={props.renameChat}
            />
            <div className="flex h-screen w-full flex-col gap-4 bg-base-100 p-8">
              <div className="flex items-center justify-center gap-x-2">
                <div
                  className="flex cursor-pointer flex-row items-center justify-center p-4"
                  onClick={() => void router.push('/')}
                >
                  <Image
                    src="/logo.svg"
                    alt="Chat Boba Logo"
                    width={67}
                    height={67}
                  />
                  <h1 className="text-3xl font-bold text-base-content">
                    ChatBoba
                  </h1>
                  <div className="text-sm text-warning">Beta Release</div>
                </div>
              </div>
              <div className="absolute right-12">
                {theme === 'dark' ? (
                  <div className="tooltip" data-tip="Dark Mode">
                    {themeButtonIsHovered ? (
                      <MdOutlineDarkMode
                        className="h-8 w-8"
                        color="hsl(var(--b3))"
                        onMouseEnter={() => setThemeButtonIsHovered(true)}
                        onMouseLeave={() => setThemeButtonIsHovered(false)}
                        onClick={() => void setUserTheme('light')}
                      />
                    ) : (
                      <MdOutlineDarkMode
                        className="h-8 w-8"
                        color="hsl(var(--ps))"
                        onMouseEnter={() => setThemeButtonIsHovered(true)}
                        onMouseLeave={() => setThemeButtonIsHovered(false)}
                        onClick={() => void setUserTheme('light')}
                      />
                    )}
                  </div>
                ) : (
                  <div className="tooltip" data-tip="Light Mode">
                    {themeButtonIsHovered ? (
                      <MdOutlineDarkMode
                        className="h-8 w-8"
                        color="hsl(var(--b3))"
                        onMouseEnter={() => setThemeButtonIsHovered(true)}
                        onMouseLeave={() => setThemeButtonIsHovered(false)}
                        onClick={() => void setUserTheme('dark')}
                      />
                    ) : (
                      <MdOutlineDarkMode
                        className="h-8 w-8"
                        color="hsl(var(--ps))"
                        onMouseEnter={() => setThemeButtonIsHovered(true)}
                        onMouseLeave={() => setThemeButtonIsHovered(false)}
                        onClick={() => void setUserTheme('dark')}
                      />
                    )}
                  </div>
                )}
              </div>
              <div
                className="w-full flex-grow overflow-y-scroll"
                ref={ref}
                style={{
                  width: '100%',
                  height: '100vh',
                  padding: '10px'
                }}
              >
                <ul>
                  {messages.map((msg, i) => {
                    switch (msg.role) {
                      case 'assistant':
                        return (
                          <li key={msg.role + i.toString()} className="py-2">
                            <BotMessage msg={msg} />
                          </li>
                        );
                      case 'user':
                        return (
                          <li key={msg.role + i.toString()} className="py-2">
                            <UserMessage msg={msg} />
                          </li>
                        );
                      case 'system':
                        return;
                    }
                  })}
                  {loadingText}
                </ul>
              </div>
              <form className="flex flex-row items-center gap-x-6">
                <input
                  type="text"
                  placeholder="Type here"
                  className="input-bordered input w-full bg-base-100"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                />

                <button className="btn-primary btn" onClick={handleSubmit}>
                  Send
                </button>
              </form>
            </div>
          </div>
        </main>
      )}
    </>
  );
};

export default Chat;

// import type { Message } from "@prisma/client";
import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum
} from 'openai';
import type { CompletionRequest, OaiModel } from '~/pages/api/stream';
import { BotMessage, UserMessage } from '~/components/message';
import DrawerContent from '~/components/drawerContent';
import { type SearchResponse, type ChatProps } from '~/types/types';
import { MdOutlineDarkMode } from 'react-icons/md';
import { useRouter } from 'next/router';

const model: OaiModel = 'gpt-3.5-turbo';

const initMessages: ChatCompletionRequestMessage[] = [
  {
    role: 'system',
    content: `You are a helpful assistant named DocuChat powered by GPT-4, the newest model by OpenAI.`
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
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [themeButtonIsHovered, setThemeButtonIsHovered] = useState(false);
  const router = useRouter();

  const handleScroll = useCallback(() => {
    if (ref.current) {
      scrollToBottom(ref.current);
    }
  }, []);

  useEffect(() => {
    handleScroll();
  }, [messages, handleScroll]);

  const stream = async (input: string) => {
    const newUserMessage: ChatCompletionRequestMessage = {
      content: input,
      role: 'user'
    };

    const getDataSources = async (prompt: string): Promise<SearchResponse> => {
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
        throw new Error(response.statusText);
      }
      const data = (await response.json()) as SearchResponse;
      return data;
    };

    const dataSources = await getDataSources(input);

    const completionRequestBody: CompletionRequest = {
      messages: messages.concat([newUserMessage]),
      dataSources: dataSources.body,
      model: model
    };

    const response = await fetch('/api/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(completionRequestBody)
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

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
            return [
              ...prevMessages.slice(0, -1),
              { ...last, content: last.content + text }
            ];
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

  return (
    <main data-theme={theme}>
      <div className="z-0 flex flex-1 flex-row">
        <DrawerContent
          handleClearSubmit={handleClearSubmit}
          supabase={props.supabase}
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
              className="cursor-pointer text-center text-3xl text-base-content"
              onClick={() => void router.push('/')}
            >
              DocuChat 📄
              <span className="text-sm text-warning">Beta Release</span>
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
                    onClick={() => setTheme('light')}
                  />
                ) : (
                  <MdOutlineDarkMode
                    className="h-8 w-8"
                    color="hsl(var(--ps))"
                    onMouseEnter={() => setThemeButtonIsHovered(true)}
                    onMouseLeave={() => setThemeButtonIsHovered(false)}
                    onClick={() => setTheme('light')}
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
                    onClick={() => setTheme('dark')}
                  />
                ) : (
                  <MdOutlineDarkMode
                    className="h-8 w-8"
                    color="hsl(var(--ps))"
                    onMouseEnter={() => setThemeButtonIsHovered(true)}
                    onMouseLeave={() => setThemeButtonIsHovered(false)}
                    onClick={() => setTheme('dark')}
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
  );
};

export default Chat;

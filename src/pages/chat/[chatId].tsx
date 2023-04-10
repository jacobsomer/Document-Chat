// import type { Message } from "@prisma/client";
import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum
} from 'openai';
import type { CompletionRequest, OaiModel } from '~/pages/api/stream';
import { BotMessage, UserMessage } from '~/components/message';
import DrawerContent from '~/components/drawerContent';

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

const Chat = () => {
  const ref = useRef<HTMLParagraphElement | null>(null);

  const handleScroll = useCallback(() => {
    if (ref.current) {
      scrollToBottom(ref.current);
    }
  }, []);

  const [messages, setMessages] =
    useState<ChatCompletionRequestMessage[]>(initMessages);
  const [input, setInput] = useState('');

  useEffect(() => {
    handleScroll();
  }, [messages, handleScroll]);

  const stream = async (input: string) => {
    const newUserMessage: ChatCompletionRequestMessage = {
      content: input,
      role: 'user'
    };

    const completionRequestBody: CompletionRequest = {
      messages: messages.concat([newUserMessage]),
      dataSources: [
        'Justin Liang likes tacos because they are really yummy [page 5, meow.pdf]',
        "Bob Smith likes boba cause it's chewy [3:23 - 4:34, Bob Smith's Vlog #32]"
      ],
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
    <div className="flex flex-1 flex-row">
      <div
        style={{
          width: '250px',
          height: '100vh',
          backgroundColor: 'var(--color-bg)',
          padding: '10px'
        }}
      >
        <DrawerContent handleClearSubmit={handleClearSubmit} />
      </div>
      <div className="flex h-screen w-full flex-col gap-4 bg-white p-8">
        <div className="flex items-center justify-center gap-x-2">
          <div className="flex-1 text-center text-3xl font-bold">DocuChat</div>
        </div>
        <div
          className="w-full flex-grow overflow-y-scroll"
          ref={ref}
          style={{
            width: '100%',
            height: '100vh',
            backgroundColor: 'var(--color-bg)',
            padding: '10px',
            overflow: 'hidden'
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
            className="input-bordered input w-full"
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
  );
};

export default Chat;

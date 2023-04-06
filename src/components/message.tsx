// import Image from "next/image"
// import avatar from "../../public/avatar.webp"
import type { ChatCompletionRequestMessage } from 'openai';
import { useEffect } from 'react';
import { useState } from 'react';
import { marked } from 'marked';
import hljs from 'highlight.js';
import Highlight from 'react-highlight';

function CodeSnippet({ value }: { value: string }) {
  const [html, setHtml] = useState('');

  useEffect(() => {
    let updatedHtml = '';
    let currCodeBlock = '';
    let openBlock = false;
    let language = '';

    const lines = value.split('\n');

    const createCodeBlock = (code: string, language: string) => {
      // Escape the code block < and >
      code = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return `<div class="bg-slate-800 pt-2 border-2 border-slate-500 flex flex-col space-y-2 my-2">
        <div class="font-light px-2 text-sm">${language}</div>
        <pre><code class="hljs language-${language} bg-black">${code}</code></pre>
      </div>`;
    };

    lines.forEach((line) => {
      if (openBlock) {
        // If we're in a code block, keep adding to it until we hit the end
        if (line.trim().startsWith('```')) {
          // If we hit the end of the code block, add it to the html
          updatedHtml += createCodeBlock(currCodeBlock, language);
          currCodeBlock = '';
          openBlock = false;
        } else {
          // Otherwise, keep adding to the code block, trim the line
          currCodeBlock += line + '\n';
        }
      } else {
        if (line.trim().startsWith('```')) {
          const languageSubstring = line.split('```')[1];
          if (languageSubstring) {
            language = languageSubstring.split(' ')[0] || '';
          }

          openBlock = true;
        } else {
          updatedHtml += `<div class="whitespace-pre-line font-sans leading-6">${marked(
            line.trim()
          )}</div>`;
        }
      }
    });

    if (currCodeBlock.length) {
      updatedHtml += createCodeBlock(currCodeBlock, language);
    }

    setHtml(updatedHtml);
  }, [value]);

  return <Highlight innerHTML={true}>{html}</Highlight>;
}

export const BotMessage = ({ msg }: { msg: { content: string } }) => {
  return (
    <div className="chat chat-start">
      <div className="chat-bubble max-w-lg">
        <CodeSnippet value={msg.content} />
      </div>
    </div>
  );
};

export const UserMessage = ({ msg }: { msg: { content: string } }) => {
  return (
    <div className="chat chat-end">
      {/* <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                    <Image src={avatar} alt="avatar" />
                </div>
            </div> */}
      <div className="chat-bubble chat-bubble-primary max-w-lg">
        <p>{msg.content}</p>
      </div>
    </div>
  );
};

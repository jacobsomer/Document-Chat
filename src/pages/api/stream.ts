import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import type { ChatCompletionRequestMessage } from 'openai';

export type OaiModel = 'gpt-3.5-turbo' | 'gpt-4';

export type CompletionRequest = {
  messages: ChatCompletionRequestMessage[];
  dataSources: string[];
  model: OaiModel;
};

function addDataSources(
  messages: ChatCompletionRequestMessage[],
  dataSources: string[]
) {
  if (messages[0] === undefined) {
    throw new Error('No messages');
  }
  if (messages[0].role !== 'system') {
    throw new Error('First message must be a system message');
  }

  messages[0].content = `You are a helpful assistant named BobaChat powered by GPT-4, the newest model by OpenAI.
  Here are your data sources: ${dataSources.join(', ')}\n\n`;
}

async function createStream(
  messages: ChatCompletionRequestMessage[],
  model: OaiModel
) {
  const oaiRes = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      messages: messages,
      model: model,
      stream: true
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ''}`
      },
      responseType: 'stream'
    }
  );
  return oaiRes;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body: unknown = req.body;
  if (!(typeof body === 'object' && body !== null)) {
    return;
  }
  const { messages, dataSources, model } = body as CompletionRequest;

  addDataSources(messages, dataSources);

  const oaiRes = await createStream(messages, model);

  const customReadable = oaiRes.data as ReadableStream
  
   return new Response(customReadable, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

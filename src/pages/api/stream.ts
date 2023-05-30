import type { ChatCompletionRequestMessage } from 'openai';
import { OpenAIStream, type OpenAIStreamPayload } from "~/utils/openAIStream";

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

  messages[0].content = `You are a helpful assistant named ChatBoba powered by GPT-4, the newest model by OpenAI.
  Here are your data sources: ${dataSources.join(', ')}\n\n`;
  console.log(messages);
}


export const config = {
  runtime: "edge",
};


export default async function POST(req: Request): Promise<Response> {
  const { messages, dataSources, model  } = (await req.json()) as CompletionRequest;

  addDataSources(messages, dataSources);

  const payload: OpenAIStreamPayload = {
    model: model,
    messages: messages,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 1000,
    stream: true,
    n: 1,
  };

  const stream = await OpenAIStream(payload);
  return new Response(stream);
}

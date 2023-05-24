import { type NextApiRequest, type NextApiResponse } from 'next';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { createClient } from '@supabase/supabase-js';

const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY // In Node.js defaults to process.env.OPENAI_API_KEY
});

async function fetchEmbeddingForObject(url: string) {
  console.log(url)
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url })
  };

  try {
    const response = await fetch(
      'https://docuchat-doc-to-txt-fhpwesohfa-uc.a.run.app/createEmbeddingForObject',
      options
    );
    const data = (await response.json()) as { text: string };
    return data.text;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {url, name, chatId, newDocId, isLocal} = req.body as {
    url:string,
    name:string,
    chatId:string,
    newDocId:string,
    isLocal:boolean
  };

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 4000,
    chunkOverlap: 200
  });

  const supabase = isLocal
    ? createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL_DEV || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_DEV || ''
      )
    : createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      );

  const text = await fetchEmbeddingForObject(url);
  if (text === null) {
    res.status(400).json({ message: 'Error' });
    return;
  }

  const docOutput = await splitter.createDocuments([text]);
  const arr: string[] = [];
  for (let i = 0; i < docOutput.length; i++) {
    const doc = docOutput[i];
    arr.push(`${doc?.pageContent ?? ''}`);
  }

  const docEmbeddings = await embeddings.embedDocuments(arr);

  const insertPromises = docEmbeddings.map(async (embedding, i) => {
    await supabase.from('userdocuments').insert({
      url: url,
      body: arr[i],
      embedding: embedding,
      docId: newDocId,
      docName: name
    });
  });
  await Promise.all(insertPromises);
  await supabase.from('chats').insert({
    chatId: chatId,
    docId: newDocId
  });
  res.status(200).json({ message: 'success' });
}

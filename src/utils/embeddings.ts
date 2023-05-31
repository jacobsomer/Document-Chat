import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { createClient } from '@supabase/supabase-js';

async function fetchEmbeddingForObject(url: string) {
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

export async function processRequest(
  url: string,
  name: string,
  chatId: string,
  newDocId: string,
  isLocal: boolean
) {
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY
  });

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
    throw new Error('Error');
  }

  const docOutput = await splitter.createDocuments([text]);
  const arr: string[] = [];
  for (let i = 0; i < docOutput.length; i++) {
    const doc = docOutput[i];
    arr.push(`${doc?.pageContent ?? ''}`);
  }

  const docEmbeddings = await embeddings.embedDocuments(arr);

  const insertPromises = docEmbeddings.map(async (embedding, i) => {
    const { error } = await supabase.from('userdocuments').insert({
      url: url,
      body: arr[i],
      embedding: embedding,
      docId: newDocId,
      docName: name
    });
    if (error) {
      console.log(error);
      throw new Error(error.message);
    }
  });
  await Promise.all(insertPromises);
  await supabase.from('chats').insert({
    chatId: chatId,
    docId: newDocId
  });
}
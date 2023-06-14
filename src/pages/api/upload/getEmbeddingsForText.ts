import { type NextApiRequest, type NextApiResponse } from 'next';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { supabase } from '~/lib/supabase';

const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY // In Node.js defaults to process.env.OPENAI_API_KEY
});

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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { url, name, chatId, newDocId } = req.body as {
    url: string;
    name: string;
    chatId: string;
    newDocId: string;
  };

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 4000,
    chunkOverlap: 200
  });

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
    const { error } = await supabase.from('userdocuments').insert({
      url: url,
      body: arr[i],
      embedding: embedding,
      docId: newDocId,
      docName: name
    });
    if (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  });
  await Promise.all(insertPromises);
  await supabase.from('chats').insert({
    chatId: chatId,
    docId: newDocId
  });
  res.status(200).json({ message: 'success' });
}

import { type NextApiRequest, type NextApiResponse } from 'next';
// you might want to use regular 'fs' and not a promise one
import { CSVLoader } from 'langchain/document_loaders/fs/csv';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { DocxLoader } from 'langchain/document_loaders/fs/docx';
import { v4 } from 'uuid';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { UnstructuredLoader } from 'langchain/document_loaders/fs/unstructured';
import { JSONLoader } from 'langchain/document_loaders/fs/json';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import fs from 'fs';
import { supportedExtensions } from '~/utils/consts';
import { processRequest } from '~/utils/embeddings';
import { supabase } from '~/lib/supabase';
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires
const get = require('async-get-file');

const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY // In Node.js defaults to process.env.OPENAI_API_KEY
});

type FileUploadBody = {
  chatId: string;
  name: string;
  extension: string;
  url: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(400).json({ message: 'Invalid method' });
    return;
  }

  const { url, chatId, name, extension } = req.body as FileUploadBody;
  if (!supportedExtensions.includes(extension)) {
    res.status(400).json({ message: 'Invalid file extension' });
    return;
  }

  
  if (
    extension === 'pptx' ||
    extension === 'ppt' ||
    extension === 'xls' ||
    extension === 'xlsx' ||
    extension === 'docx'
  ) {
    const newDocId = v4();
    try {
      await processRequest(url, chatId, name, newDocId);
      console.log('Hello');
      res.status(200).json({ message: 'File uploaded successfully' });
    } catch (err) {
      res.status(400).json({ message: 'File upload failed' });
    }
    return;
  }

  // download file from url
  const response = await fetch(url);
  if (!response.ok) {
    res.status(400).json({ message: 'File upload failed1' });
    return;
  }

  const options = {
    directory: './tmp/',
    filename: name + '.' + extension
  };
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  await get(url, options);

  const filePath = `./tmp/${name}.${extension}`;

  const newDocId = v4();
  let loader;
  try {
    if (extension === 'csv') {
      loader = new CSVLoader(filePath);
    } else if (extension === 'docx') {
      loader = new DocxLoader(filePath);
    } else if (extension === 'pdf') {
      loader = new PDFLoader(filePath);
    } else if (extension === 'txt') {
      loader = new TextLoader(filePath);
    } else if (extension === 'json') {
      loader = new JSONLoader(filePath);
    } else if (supportedExtensions.includes(extension)) {
      loader = new UnstructuredLoader(filePath);
    }
  } catch (err) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    // do nothing and test for loader
    // delete tmp
    fs.unlinkSync(filePath);
    res.status(400).json({ message: 'Loader Error' });
  }

  if (!loader) {
    // delete file
    fs.unlinkSync(filePath);
    res.status(400).json({ message: 'Invalid file extension' });
  } else {
    try {
      const docs = await loader.load();
      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 4000,
        chunkOverlap: 200
      });

      const docOutput = await splitter.splitDocuments(docs);
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
      fs.unlinkSync(filePath);
      res.status(200).json({ message: 'File uploaded successfully' });
    } catch (err) {
      res.status(400).json({
        message: JSON.stringify((err as { message: string }).message)
      });
    }
  }
}

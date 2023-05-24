import { type NextApiRequest, type NextApiResponse } from 'next';
import { IncomingForm } from 'formidable';
// you might want to use regular 'fs' and not a promise one
import { promises as fs } from 'fs';
import { CSVLoader } from 'langchain/document_loaders/fs/csv';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { DocxLoader } from 'langchain/document_loaders/fs/docx';
import { v4 } from 'uuid';
import type PersistentFile from 'formidable/PersistentFile';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { UnstructuredLoader } from 'langchain/document_loaders/fs/unstructured';
import { JSONLoader } from 'langchain/document_loaders/fs/json';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { SupabaseClient, createClient } from '@supabase/supabase-js';

const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY // In Node.js defaults to process.env.OPENAI_API_KEY
});

// first we need to disable the default body parser
export const config = {
  api: {
    bodyParser: false
  }
};

const allowedExtenstions = [
  'md',
  'py',
  'js',
  'html',
  'css',
  'java',
  'c',
  'cpp',
  'ts',
  'tsx',
  'jsx',
  'json',
  'xml',
  'yaml',
  'yml',
  'sql',
  'php',
  'rb',
  'go',
  'env',
  'sh',
  'swift',
  'kt',
  'ktm',
  'pptx',
  'ppt',
  'xls',
  'xlsx',
  'doc',
  'docx',
  'pdf',
  'txt'
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const chatId = req.query.chatId as string;
  const name = req.query.name as string;
  const extension = req.query.extension as string;

  if (!allowedExtenstions.includes(extension)) {
    res.status(400).json({ message: 'Invalid file extension' });
    return;
  }


  const isLocal = req.headers.host?.includes('localhost')
  console.log('isLocal', isLocal)
  const supabase = isLocal
    ? createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL_DEV || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_DEV || ''
      )
    : createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      );

  const data = await new Promise((resolve, reject) => {
    const form = new IncomingForm();

    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });

  const data1 = data as { files: any };

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const fileData = data1.files?.file[0] as PersistentFile;
  const filePath = fileData.toJSON().filepath;

  if (extension === 'pptx' || extension === 'ppt' || extension === 'xls' || extension === 'xlsx' ||  extension === 'docx' ) {
    // load file from filePath
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const file:File =  data1.files?.file[0]
    console.log(file.size)
    const { data, error } = await supabase.storage
      .from('media')
      .upload(`userFiles/${chatId}/${name}.${extension}`, file, {
        cacheControl: '3600',
        upsert: false
      });
    if (error && !error.message.includes('The resource already exists')) {
      console.log(error.message);
      res.status(400).json({ message: error.message});
      return;
    }
    let url = '';
    if (data) {
      url = data.path;
    } else {
      url = `userFiles/${chatId}/${name}.${extension}`;
    }
    const baseStorageUrl =
      'https://gsaywynqkowtwhnyrehr.supabase.co/storage/v1/object/public/media/';
    url = baseStorageUrl + url;
    const newDocId = v4();
    const apiURL = "http://localhost:3000/api/upload/getEmbeddingsForText/"
    const response = await fetch(apiURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: url,
        chatId: chatId,
        name: name,
        newDocId: newDocId,
        isLocal:  isLocal,
       })
    });
    if (!response.ok) {
      res.status(400).json({ message: 'File upload failed2' });
      return;
    }
    const resp = (await response.json()) as { message: string };
    if (resp.message === 'File uploaded successfully') {
      res.status(200).json({ message: 'File uploaded successfully' });
      return;
    } else {
      res.status(400).json({ message: 'File upload failed3' });
      return;
    }
  }

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
    } else if (allowedExtenstions.includes(extension)) {
      loader = new UnstructuredLoader(filePath);
    }
  } catch (err) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    // do nothing and test for loader
    res.status(400).json({ message: 'Loader Error' });
  }

  if (!loader) {
    res.status(400).json({ message: 'Invalid file extension' });
  } else {
    try {
      const url = `https://gsaywynqkowtwhnyrehr.supabase.co/storage/v1/object/public/media/userFiles/${chatId}/${name}.${extension}`;
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

      res.status(200).json({ message: 'File uploaded successfully' });
    } catch (err) {
      res.status(400).json({
        message: JSON.stringify((err as { message: string }).message)
      });
    }
  }
}

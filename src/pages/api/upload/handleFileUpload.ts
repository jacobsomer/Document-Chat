import { createClient } from '@supabase/supabase-js';
import { type NextApiRequest, type NextApiResponse } from 'next';
import { IncomingForm } from 'formidable';
// you might want to use regular 'fs' and not a promise one
import { promises as fs } from 'fs';
import { CSVLoader } from 'langchain/document_loaders/fs/csv';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { DocxLoader } from 'langchain/document_loaders/fs/docx';

// first we need to disable the default body parser
export const config = {
  api: {
    bodyParser: false
  }
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

type Query = {
  body: string;
  embedding: string;
  docId: string;
  docName: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data = await new Promise((resolve, reject) => {
    const form = new IncomingForm();

    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const filePath = data?.files?.nameOfTheInput.path;

  const newDocId = v4();
  let loader;
  if (extension === 'csv') {
    loader = new CSVLoader(filePath);
  } else if (extension === 'docx') {
    loader = new DocxLoader(filePath);
  } else if (extension === 'pdf') {
    loader = new PDFLoader(filePath);
  } else if (extension === 'txt') {
    loader = new TextLoader(filePath);
  }

  const docs = await loader.load();

  res.status(200).json({ message: 'File uploaded successfully' });

  // // upload embeddings
  // const { body, embedding, docId, docName } = req.body as Query;
  // const { error } = await supabase.from('userdocuments').insert({
  //   url: '',
  //   body: body,
  //   embedding: embedding,
  //   docId: docId,
  //   docName: docName
  // });
  // if (error) {
  //   console.log(error);
  //   return res.status(500).json({ message: 'Error uploading file' });
  // }
  // return res.status(200).json({ message: 'File uploaded successfully' });
}

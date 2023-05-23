import { type NextApiRequest, type NextApiResponse } from 'next';
import { CheerioWebBaseLoader } from 'langchain/document_loaders/web/cheerio';
import { PuppeteerWebBaseLoader } from 'langchain/document_loaders/web/puppeteer';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { v4 } from 'uuid';
import { createClient } from '@supabase/supabase-js';

const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY // In Node.js defaults to process.env.OPENAI_API_KEY
});

type UrlUploadBody = {
  chatId: string;
  url: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { chatId, url } = req.body as UrlUploadBody;

    const supabase = req.headers.host?.includes('localhost')
      ? createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL_DEV || '',
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_DEV || ''
        )
      : createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL || '',
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
        );

    const { data: userDocs, error: userDocsError } = await supabase
      .from('userdocuments')
      .select('*')
      .eq('url', url);

    if (!userDocsError && userDocs && userDocs.length > 0 && userDocs[0]) {
      const docId = userDocs[0].docId as string;
      const { error: insertError } = await supabase.from('chats').insert({
        chatId: chatId,
        docId: docId
      });
      if (insertError) {
        res.status(500).json({ error: insertError.message });
      } else {
        res.status(200).json({ message: 'Success' });
      }
    } else {
      const docArr: string[] = [];

      const cheerLoader = new CheerioWebBaseLoader(url);
      const docs = await cheerLoader.load();
      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 4000,
        chunkOverlap: 200
      });
      const docOutput = await splitter.splitDocuments(docs);
      if (docOutput.length == 0) {
        const puppeteerLoader = new PuppeteerWebBaseLoader(url);
        const puppeteer_docs = await puppeteerLoader.load();
        const puppeteer_splitter = new RecursiveCharacterTextSplitter({
          chunkSize: 4000,
          chunkOverlap: 200
        });
        const puppeteer_docOutput = await puppeteer_splitter.splitDocuments(
          puppeteer_docs
        );
        if (puppeteer_docOutput.length == 0) {
          res.status(500).json({ error: 'Nothing Found For URL: ' + url });
          return;
        }
        for (let i = 0; i < puppeteer_docOutput.length; i++) {
          const puppeteer_doc = puppeteer_docOutput[i];
          docArr.push(`${puppeteer_doc?.pageContent ?? ''}`);
        }
      } else {
        for (let i = 0; i < docOutput.length; i++) {
          const doc = docOutput[i];
          docArr.push(`${doc?.pageContent ?? ''}`);
        }
        const docEmbeddings = await embeddings.embedDocuments(docArr);
        const newDocId = v4();
        const insertPromises = docEmbeddings.map(async (embedding, i) => {
          await supabase.from('userdocuments').insert({
            url: url,
            body: docArr[i],
            embedding: embedding,
            docId: newDocId,
            docName: url
          });
        });
        await Promise.all(insertPromises);
        await supabase.from('chats').insert({
          chatId: chatId,
          docId: newDocId
        });

        res.status(200).json({ message: 'File uploaded successfully' });
      }
    }
  } catch (err) {
    res.status(400).json({
      message: JSON.stringify((err as { message: string }).message)
    });
  }
}

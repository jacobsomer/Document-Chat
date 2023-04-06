import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { createClient } from '@supabase/supabase-js'
import type { Database } from "~/types/supabase";
import { OpenAIApi, Configuration } from "openai";
import { type Chunk } from "~/types/types";

const supabaseUrl = 'https://gsaywynqkowtwhnyrehr.supabase.co'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
if (supabaseKey === undefined) {
    throw new Error("No supabase key")
}
const supabase = createClient<Database>(supabaseUrl, supabaseKey);

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const PDFtoText = async (url: string): Promise<Array<Array<number | string>>> => {
  const options = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: '{"url":"'+url+'"}'
  };

  try {
    const response = await fetch('https://chat-boba-extract-fhpwesohfa-ue.a.run.app/getTextForPDF', options);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data = await response.json();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const pdfText = data.pdfText;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return pdfText;
  } catch (error) {
    throw new Error("Failed to extract text from PDF");
  }
};

type Media = {
    name: string;
    extension: string;
    fileData: string;
    url: string;
}

export const addMediaRouter = createTRPCRouter({
  addMediaSource: publicProcedure
    .input(
      z.object({
        name: z.string(),
        extension: z.string(),
        fileData: z.string(),
        url: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { name, extension, fileData, url } = input as Media;

      let chunks: Chunk[] = [];
      const chunkCharLength = 2000;
      let text = "";

      if (extension === "pdf") {
        const pdfText: (string | number)[][] = await PDFtoText(url);
        for (const page of pdfText) {
          let pageText = "";
          let pageNumber = 0;
          for (const item of page) {
            if (typeof item === "string") {
              pageText += item + " ";
            }
            else {
              pageNumber = item;
            }
          }

          // append page number to end of text with a newline
          pageText += `
          Page ${pageNumber}
          `;
          text += pageText;
        }
      } else {
        text = fileData;
      }
      chunks = getChunks(text, chunkCharLength, chunks.length);
      const embeddings: number[][] = [];
      
      for (const chunk of chunks) {
        const response = await openai.createEmbedding({
          input: chunk.text,
          model: "text-embedding-ada-002",
        });
        const embedding = response.data.data[0]?.embedding;
        if (embedding === undefined) {
          console.log("embedding data undefined");
          continue;
        }
        embeddings.push(embedding);
      }

      const { data, error } = await supabase.from("DataSource").insert([
        {
          title: name,
          type: extension,
          url,
          embeddings: embeddings,
        },
      ]);

      if (error) {
        console.error(error);
        throw new Error("Failed to add media source");
      }
      return data;
    }),
});

const getChunks = (text: string, chunkCharLength: number, index: number): Chunk[] => {
  const chunks: Chunk[] = [];
  let currentChunk: Chunk = {
    text: "",
    start: index, // set start to the current index
    end: 0,
    embedding: [],
  };
  let currentText = "";
  for (const item of text.split(" ")) {
    if (currentText.length + item.length < chunkCharLength) {
      currentText += item + " ";
    } else {
      currentChunk.text = currentText;
      currentChunk.end = index;
      chunks.push(currentChunk);

      currentChunk = {
        text: "",
        start: index, // update start to the current index
        end: 0,
        embedding: [],
      };
      currentText = item + " ";
      index++;
    }
  }
  // add the last chunk
  currentChunk.text = currentText;
  currentChunk.end = index;
  chunks.push(currentChunk);
  return chunks;
};

export default addMediaRouter;
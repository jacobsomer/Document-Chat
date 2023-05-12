// api/getChat.ts
import { type NextApiRequest, type NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { type ChatCompletionRequestMessage } from 'openai';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

type Query = {
  userId: string;
  chatId: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId, chatId } = req.body as Query;

  try {
    const { data, error } = await supabase
      .from('userChats')
      .select('conversation')
      .eq('userId', userId)
      .eq('chatId', chatId);

    if (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: 'An error occurred while retrieving chat.' });
    }

    if (data.length === 0) {
      return res.status(404).json({ message: 'Chat not found.' });
    } else if (data.length === 1) {
      try {
        const new_chat = JSON.parse(
          data[0]?.conversation as string
        ) as ChatCompletionRequestMessage[];
        if (new_chat === null) {
          return res.status(200).json([]);
        }
        return res.status(200).json(new_chat);
      } catch (err) {
        console.error(err);
        return res
          .status(500)
          .json({ message: 'An error occurred while parsing chat data.' });
      }
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: 'An error occurred while retrieving chat.' });
  }
}

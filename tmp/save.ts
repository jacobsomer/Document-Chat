// pages/api/chats/saveChat.js

import { type NextApiRequest, type NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

type SaveChatBody = {
  userId: string;
  chatId: string;
  conversation: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId, chatId, conversation } = req.body as SaveChatBody;
  const supabase = req.headers.host?.includes('localhost')
    ? createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL_DEV || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_DEV || ''
      )
    : createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      );
  try {
    await supabase
      .from('userChats')
      .update({ conversation })
      .eq('userId', userId)
      .eq('chatId', chatId);

    return res.status(200).json({ message: 'Chat saved successfully.' });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: 'An error occurred while saving chat.' });
  }
}

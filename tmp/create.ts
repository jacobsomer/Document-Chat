import { createClient } from '@supabase/supabase-js';
import {
  type NextApiRequest,
  type NextApiHandler,
  type NextApiResponse
} from 'next';
import { v4 } from 'uuid';

type Query = {
  userId: string;
  chatId: string;
};

const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const supabase = req.headers.host?.includes('localhost')
    ? createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL_DEV || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_DEV || ''
      )
    : createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      );

  const { userId, chatId } = req.body as Query;

  // if the current chat is empty, do nothing
  const { data: data1, error: error2 } = await supabase
    .from('chats')
    .select('*')
    .eq('chatId', chatId);
  if (error2) {
    console.log(error2);
    res.status(500).json({ message: 'Failed to check current chat' });
    return;
  }
  if (data1?.length == 0) {
    res.status(400).json({ message: 'Current chat is empty' });
    return;
  }

  const { data, error } = await supabase
    .from('userChats')
    .select('*')
    .eq('userId', userId);
  if (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to fetch user chats' });
    return;
  }
  const names = data.map((chat) => chat.chatName as string);
  let chatName = 'New Chat';
  let i = 1;
  while (names.includes(chatName)) {
    chatName = 'New Chat ' + String(i);
    i++;
  }
  const newChatID = v4();

  const { error: error1 } = await supabase
    .from('userChats')
    .insert({ userId: userId, chatId: newChatID, chatName: chatName });

  if (error1) {
    console.log(error1);
    res.status(500).json({ message: 'Failed to create new chat' });
    return;
  }
  res.status(200).json({ newChatID: newChatID });
};

export default handler;

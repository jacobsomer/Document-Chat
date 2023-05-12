import { createClient } from '@supabase/supabase-js';
import { type NextApiRequest, type NextApiResponse } from 'next';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

type Query = {
  chatId: string;
};

export default async function deleteChatHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { chatId } = req.body as Query;

  const { error } = await supabase
    .from('userChats')
    .delete()
    .eq('chatId', chatId);

  if (error) {
    console.log(error);
    return res.status(500).json({ message: 'Failed to delete chat' });
  }

  // get the files in the chat
  const { data, error: error1 } = await supabase
    .from('chats')
    .select('*')
    .eq('chatId', chatId);

  if (error1) {
    console.log(error1);
    return res.status(500).json({ message: 'Failed to delete chat files' });
  }

  // delete the files in the chat
  for (const file of data) {
    const docId = file.docId as string;
    const { error } = await supabase.from('chats').delete().eq('docId', docId);

    if (error) {
      console.log(error);
      return res.status(500).json({ message: 'Failed to delete chat files' });
    }

    const { data, error: error2 } = await supabase
      .from('chats')
      .select('*')
      .eq('docId', docId);

    if (data?.length == 0) {
      const { error } = await supabase
        .from('userdocuments')
        .delete()
        .eq('docId', docId);

      if (error) {
        console.log(error);
        return res.status(500).json({ message: 'Failed to delete chat files' });
      }
    }

    if (error2) {
      console.log(error2);
      return res.status(500).json({ message: 'Failed to delete chat files' });
    }
  }

  // delete the chat
  const { error: error2 } = await supabase
    .from('chats')
    .delete()
    .eq('chatId', chatId);

  if (error2) {
    console.log(error2);
    return res.status(500).json({ message: 'Failed to delete chat' });
  }

  return res.status(200).json({ message: 'Chat deleted successfully' });
}

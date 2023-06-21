import { type NextApiRequest, type NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

type Query = {
  newName: string;
  chatId: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // rename
  const { newName, chatId } = req.body as Query;
  const supabase = req.headers.host?.includes('localhost')
    ? createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL_DEV || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_DEV || ''
      )
    : createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      );

  const { error } = await supabase
    .from('userChats')
    .update({ chatName: newName })
    .eq('chatId', chatId);

  if (error) {
    console.log(error.message);
    return;
  }

  return res.status(200).json({ message: 'Chat deleted successfully' });
}

import { createClient } from '@supabase/supabase-js';
import { type NextApiRequest, type NextApiResponse } from 'next';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

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

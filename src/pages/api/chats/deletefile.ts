import { createClient } from '@supabase/supabase-js';
import { type NextApiRequest, type NextApiResponse } from 'next';

type Query = {
  docId: string;
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const supabase = req.headers.host?.includes('localhost')
      ? createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL_DEV || '',
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_DEV || ''
        )
      : createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL || '',
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
        );

    const { docId } = req.body as Query;

    const { error: error1 } = await supabase
      .from('chats')
      .delete()
      .eq('docId', docId);

    if (error1) {
      console.log(error1);
      return res.status(500).json({ message: 'Error deleting chat file' });
    }

    const { data, error } = await supabase
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
        return res
          .status(500)
          .json({ message: 'Error deleting user document' });
      }
    }

    if (error) {
      console.log(error);
      return res.status(500).json({ message: 'Error retrieving chat file' });
    }

    return res.status(200).json({ message: 'Chat file deleted successfully' });
  }

  return res.status(405).json({ message: 'Method not allowed' });
}

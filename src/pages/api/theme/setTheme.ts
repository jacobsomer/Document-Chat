import { type NextApiRequest, type NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

type Query = {
  userId: string;
  theme: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId, theme } = req.body as Query;
  const supabase = req.url?.includes('localhost')
    ? createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL_DEV || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_DEV || ''
      )
    : createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      );
  if (!userId || !theme) {
    res.status(400).json({ message: 'Missing user or theme' });
    return;
  }

  const { error } = await supabase
    .from('userTheme')
    .update({ theme: theme })
    .eq('userId', userId);

  if (error) {
    res.status(500).json({ message: 'Error updating user theme' });
    return;
  }

  res.status(200).json({ message: 'User theme updated' });
}

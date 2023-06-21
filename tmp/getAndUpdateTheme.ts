import { type NextApiRequest, type NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

type Query = {
  userId: string;
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = req.body as Query;
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
    const { data, error } = await supabase
      .from('userTheme')
      .select('*')
      .eq('userId', userId);

    if (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: 'An error occurred while retrieving user theme.' });
    }

    if (data.length === 0) {
      await supabase.from('userTheme').insert({
        userId: userId,
        theme: 'light'
      });
      return res.status(200).json({ theme: 'light' });
    } else if (data.length === 1) {
      const theme = data[0] as { theme: 'light' | 'dark' };
      return res.status(200).json({ theme: theme.theme });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: 'An error occurred while updating user theme.' });
  }
}

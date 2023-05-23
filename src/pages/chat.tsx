/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useEffect, useCallback, useState } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { v4 } from 'uuid';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';

const MainChat = () => {
  const user = useUser();
  const router = useRouter();
  const [status, setStatus] = useState('loading');
  const origin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : '';
  // Create a single supabase client for interacting with your database
  const supabase = origin.includes('localhost')
    ? createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL_DEV || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_DEV || ''
      )
    : createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      );

  const createNewChat = useCallback(async () => {
    const chatID = v4();
    if (user) {
      const { data, error } = await supabase
        .from('userChats')
        .insert({ userId: user.id, chatId: chatID, chatName: 'New Chat' });
      if (error) {
        setStatus(error.message);
        return;
      }
      if (data) {
        setStatus('success');
        void router.push(`/chat/${chatID}`);
      }
    } else {
      void router.push(`/chat/${chatID}`);
    }
  }, [router, user]);

  const getUserChats = useCallback(async () => {
    if (user) {
      const userId = user?.id;
      const { data, error } = await supabase
        .from('userChats')
        .select('*')
        .eq('userId', userId);
      if (error) {
        setStatus(error.message);
      } else if (data && data.length > 0) {
        const chat_id: string = data[0]?.chatId;
        if (chat_id) {
          void router.push(`/chat/${chat_id}`);
        }
      } else if (data && data.length == 0) {
        void createNewChat();
      }
    } else {
      void createNewChat();
    }
  }, [createNewChat, router, user]);

  useEffect(() => {
    void getUserChats();
  }, [getUserChats]);

  return <div>{status}</div>;
};

export default MainChat;

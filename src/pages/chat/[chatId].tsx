import { useCallback, useEffect, useState } from 'react';
import Chat from '~/components/chat';
import { useUser } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';
import {type File } from '~/types/types';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

const ChatRoom = () => {
  const user = useUser();
  const [chatId, setChatId] = useState<string | null>(null);
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);

  const updateFiles = useCallback(async () => {
      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .eq('chatId', chatId);
      if (error) {
        console.log(error);
        return;
      }
    const files_: File[] = [];
     for (const file of data) {
      const chat = file as Chat; 
      const docId = chat.docId;
      const { data, error } = await supabase
        .from('userdocuments')
        .select('url, docId')
        .eq('docId', docId);
      if (error) {
        console.log(error);
        return;
      }
      for (const file1 of data) {
        const file2 = file1 as File;
        files_.push(file2)
      }
    }
    setFiles(files_);
  },[chatId]);


  useEffect(() => {
    const chat_id = window.location.pathname.split('/')[2];
    if (chat_id == undefined) {
      void router.push('/chat/');
      return;
    }
    setChatId(chat_id);
    void updateFiles();
    
  }, [chatId, router, updateFiles]);

  const deleteFile = async (docId: string) => {
    const {error} = await supabase.from("userdocuments").delete().eq("docId", docId)
    if (error) {
      console.log(error)
    }
    const {error: error1} = await supabase.from("chats").delete().eq("docId", docId)
    await updateFiles();
  };

  type Chat = {
    chatId: string,
    docId: string,
  }

  
  return (
    <>
      {chatId && (
        <Chat
          chatId={chatId}
          userId={user?.id}
          supabase={supabase}
          deleteFile={deleteFile}
          updateFiles={updateFiles}
          files={files}
        />
      )}
    </>
  );
};

export default ChatRoom;

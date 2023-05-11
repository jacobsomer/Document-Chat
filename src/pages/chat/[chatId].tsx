import { useCallback, useEffect, useState } from 'react';
import Chat from '~/components/chat/chat';
import { useUser } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';
import { type ChatFile, type UserChat, type File } from '~/types/types';
import { v4 } from 'uuid';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

const ChatRoom = () => {
  const user = useUser();
  const [currentChat, setCurrentChat] = useState<UserChat | null>(null);
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [userChats, setUserChats] = useState<UserChat[] | undefined>(undefined);
  const [finishedLoading, setFinishedLoading] = useState(false);

    type ChatRoomProps = {
      currentChat: UserChat,
      files: File[],
      userChats: UserChat[]
    }

  const updateChat = useCallback(
    async (chatId: string) => {
      setFinishedLoading(false);
      let userId: string | undefined;
      if (user) {
        userId = user.id;
      }
      const url = '/api/chats/get';
      const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          chatId: chatId,
          userId: userId
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      // if res.status is 200, then we have a chat
      if (res.status == 200) {  
        const data = await res.json() as ChatRoomProps;
        setCurrentChat(data.currentChat);
        setFiles(data.files);
        setUserChats(data.userChats);
        setFinishedLoading(true);
      }
      else{
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const data = await res.json();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (data.message=="Invalid userId"){
          void router.push('/chat/' + v4());
        }

      }
    },
    [router, user]
  );

  useEffect(() => {
    const chat_id = window.location.pathname.split('/')[2];
    if (!chat_id) {
      if (!user) {
        void router.push('/chat/' + v4());
      } else {
        void router.push('/chat/' + v4());
      }
    } else {
      void updateChat(chat_id);
    }
  }, [router, updateChat, user]);

  const deleteFile = async (docId: string) => {
  if (!currentChat) {
    return;
  }

  const response = await fetch(`/api/chats/deletefile?docId=${docId}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    const error = await response.json() as { message: string };
    console.log(error.message);
    return;
  }

  setFiles(files.filter((file) => file.docId != docId));
};

  const createNewChat = async () => {
  if (!user || !currentChat) {
    return;
  }

  const res = await fetch('/api/createNewChat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ user, currentChat })
  });
  if (!res.ok) {
    const error = await res.json() as { message: string };
    console.log(error.message);
    return;
  }
  const { chatId } = await res.json() as { chatId: string };
  await router.push('/chat/' + chatId);
};


  const deleteChat = async () => {
    if (!user || !userChats || !currentChat) {
      return;
    }
    if (userChats.length <= 1) {
      alert('You cannot delete your last chat');
      return;
    }
    const { error } = await supabase
      .from('userChats')
      .delete()
      .eq('chatId', currentChat.chatId);

    if (error) {
      console.log(error);
      return;
    }

    // get the files in the chat
    const { data, error: error1 } = await supabase
      .from('chats')
      .select('*')
      .eq('chatId', currentChat.chatId);

    if (error1) {
      console.log(error1);
      return;
    }

    // delete the files in the chat
    for (const file of data) {
      const docId = file.docId as string;
      await deleteFile(docId);
    }
    // delete the chat
    const { error: error2 } = await supabase
      .from('chats')
      .delete()
      .eq('chatId', currentChat.chatId);

    if (error2) {
      console.log(error2);
      return;
    }

    // redirect to another chat that is not the one being deleted
    const newChat = userChats.find((chat) => chat.chatId != currentChat.chatId);
    if (newChat) {
      void router.push('/chat/' + newChat.chatId);
    }
  };

  const renameChat = async (newName: string) => {
    if (!user || !currentChat) {
      return;
    }

    const { error } = await supabase
      .from('userChats')
      .update({ chatName: newName })
      .eq('chatId', currentChat.chatId);

    if (error) {
      console.log(error.message);
      return;
    }

    setCurrentChat({
      chatId: currentChat.chatId,
      chatName: newName
    });
  };

  return (
    <>
      {currentChat && files && finishedLoading ? (
        <Chat
          currentChat={currentChat}
          userId={user?.id}
          supabase={supabase}
          deleteFile={deleteFile}
          updateFiles={updateChat}
          files={files}
          createNewChat={createNewChat}
          userChats={userChats}
          deleteChat={deleteChat}
          renameChat={renameChat}
        />
      ) : (
        // is loading
        <h3 className="flex h-screen flex-col items-center justify-center">
          Loading...
        </h3>
      )}
    </>
  );
};

export default ChatRoom;

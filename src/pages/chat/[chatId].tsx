import { useCallback, useEffect, useState } from 'react';
import Chat from '~/components/chat';
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

  const updateFiles = useCallback(
    async (chatId: string) => {
      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .eq('chatId', chatId);
      if (error) {
        console.log(error);
        return;
      }

      // if length of data is 0, check if the user is logged in and already has a chat with a 0 length,
      //  that is not the current chat
      if (data.length == 0) {
        if (user) {
          const { data: data1, error: error1 } = await supabase
            .from('userChats')
            .select('chatId, name')
            .eq('userId', user.id);
          if (error1) {
            console.log(error1.message);
            return;
          }
          //  of the user chats, search the chats database to find the lenght of each chat
          // if we find a chat with length 0, redirect to that chat
          for (const chat of data1) {
            const { data: data2, error: error2 } = await supabase
              .from('chats')
              .select('*')
              .eq('chatId', chat.chatId);
            if (error2) {
              console.log(error2);
              return;
            }
            if (data2.length == 0 && chat.chatId != chatId) {
              // delete the current chat from the userChats table
              void deleteChat();
              // redirect to the chat with length 0
              void router.push(`/chat/${chat.chatId as string}`);
              return;
            }
          }
        }
      }

      const files_: File[] = [];
      let name = '';
      for (const file of data) {
        const chat = file as ChatFile;
        if (!currentChat) {
          if (name === '') {
            name = chat.name;
          }

          setCurrentChat({
            chatId: chatId,
            name: chat.name
          });
        }
        const docId = chat.docId;
        const { data, error } = await supabase
          .from('userdocuments')
          .select('url, docId, name, body, embedding')
          .eq('docId', docId);
        if (error) {
          console.log(error);
          return;
        }
        for (const file1 of data) {
          const file2 = file1 as File;
          if (files_.find((file) => file.docId == file2.docId)) {
            continue;
          }
          files_.push(file2);
        }
      }
      setFiles(files_);

      if (!user) {
        if (!currentChat)
          setCurrentChat({
            chatId: chatId,
            name: 'New Chat'
          });
        return;
      }
      // make sure the current chat is in the userChats
      const { data: data1, error: error1 } = await supabase
        .from('userChats')
        .select('*')
        .eq('chatId', chatId)
        .eq('userId', user.id);
      if (error1) {
        console.log(error1.message);
        return;
      }
      if (data1.length == 0) {
        const { error: error2 } = await supabase.from('userChats').upsert(
          {
            chatId: chatId,
            userId: user.id,
            name: name
          },
          {
            ignoreDuplicates: true
          }
        );
        if (error2) {
          console.log(error2.message);
          return;
        }
      }

      const { data: data2, error: error2 } = await supabase
        .from('userChats')
        .select('chatId, name')
        .eq('userId', user.id);
      if (error2) {
        console.log(error2.message);
        return;
      }
      if (!currentChat) {
        // filter data1 to find the chat with the chatId
        const chat = data2.find((chat) => chat.chatId == chatId);
        if (chat) {
          setCurrentChat(chat as UserChat);
        }
      }
      const chats: UserChat[] = [];
      for (const chat of data2) {
        chats.push(chat as UserChat);
      }
      setUserChats(chats);
    },
    [currentChat, user]
  );

  useEffect(() => {
    const chat_id = window.location.pathname.split('/')[2];
    if (chat_id == undefined) {
      void router.push('/chat/');
      return;
    }
    void updateFiles(chat_id);
  }, [router, updateFiles]);

  const deleteFile = async (docId: string) => {
    const { error: error1 } = await supabase
      .from('chats')
      .delete()
      .eq('chatId', currentChat?.chatId || '');

    if (error1) {
      console.log(error1);
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
      }
    }
    if (error) {
      console.log(error);
    }
    await updateFiles(currentChat?.chatId || '');
  };

  const createNewChat = async () => {
    if (!user) {
      return;
    }

    // if the current chat is empty, do nothing
    const { data: data1, error: error2 } = await supabase
      .from('chats')
      .select('*')
      .eq('chatId', currentChat?.chatId || '');
    if (error2) {
      console.log(error2);
      return;
    }
    if (data1?.length == 0) {
      return;
    }

    const { data, error } = await supabase
      .from('userChats')
      .select('*')
      .eq('userId', user.id);
    if (error) {
      console.log(error);
      return;
    }
    const names = [];
    let name = 'New Chat';
    let count = 1;
    if (data?.length > 0) {
      for (const chat of data) {
        names.push(chat.name);
        if (names.includes(name)) {
          name = 'New Chat ' + String(count);
          count++;
        }
      }
    }

    const newChatID = v4();

    const { error: error1 } = await supabase
      .from('userChats')
      .insert({ userId: user.id, chatId: newChatID, name: name });

    if (error1) {
      console.log(error1);
      return;
    }
    void router.push('/chat/' + newChatID);
  };

  const deleteChat = async () => {
    if (!user || !userChats) {
      return;
    }
    if (userChats.length <= 1) {
      return;
    }
    const { error } = await supabase
      .from('userChats')
      .delete()
      .eq('chatId', currentChat?.chatId || '');

    if (error) {
      console.log(error);
      return;
    }
    // redirect to another chat that is not the one being deleted
    const newChat = userChats.find(
      (chat) => chat.chatId != currentChat?.chatId
    );
    if (newChat) {
      void router.push('/chat/' + newChat.chatId);
    }
  };

  const renameChat = async (newName: string) => {
    if (!user) {
      return;
    }

    const { error } = await supabase
      .from('userChats')
      .update({ name: newName })
      .eq('chatId', currentChat?.chatId || '');

    if (error) {
      console.log(error.message);
      return;
    }

    setCurrentChat({
      chatId: currentChat?.chatId || '',
      name: newName
    });
  };

  return (
    <>
      {currentChat && (
        <Chat
          currentChat={currentChat}
          userId={user?.id}
          supabase={supabase}
          deleteFile={deleteFile}
          updateFiles={updateFiles}
          files={files}
          createNewChat={createNewChat}
          userChats={userChats}
          deleteChat={deleteChat}
          renameChat={renameChat}
        />
      )}
    </>
  );
};

export default ChatRoom;

import { useCallback, useEffect, useState } from 'react';
import Chat from '~/components/chat/chat';
import { useUser } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { type UserChat, type File } from '~/types/types';
import { v4 } from 'uuid';

const ChatRoom = () => {
  const user = useUser();
  const [currentChat, setCurrentChat] = useState<UserChat | null>(null);
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [userChats, setUserChats] = useState<UserChat[] | undefined>(undefined);
  const [finishedLoading, setFinishedLoading] = useState(false);

  type ChatRoomProps = {
    currentChat: UserChat;
    files: File[];
    userChats: UserChat[];
  };

  const updateFiles = useCallback(
    async (chatId: string) => {
      const url = '/api/chats/get';
      try {
        const res = await fetch(url, {
          method: 'POST',
          body: JSON.stringify({
            chatId: chatId,
            userId: user ? user.id : undefined
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (res.status == 200) {
          const data = (await res.json()) as ChatRoomProps;
          setFiles(data.files);
        } else {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const data = (await res.json()) as { message: string };
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          if (data.message == 'Invalid userId') {
            // void router.push('/chat/' + v4());
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
    [user]
  );

  const updateChat = useCallback(
    async (chatId: string) => {
      setFinishedLoading(false);
      const url = '/api/chats/get';
      try {
        const res = await fetch(url, {
          method: 'POST',
          body: JSON.stringify({
            chatId: chatId,
            userId: user ? user.id : undefined
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (res.status == 200) {
          const data = (await res.json()) as ChatRoomProps;
          setCurrentChat(data.currentChat);
          setFiles(data.files);
          setUserChats(data.userChats);
          setFinishedLoading(true);
        } else {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const data = (await res.json()) as { message: string };
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          if (data.message == 'Invalid userId') {
            // void router.push('/chat/' + v4());
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
    [user]
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

    const response = await fetch(`/api/chats/deletefile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ docId: docId })
    });

    if (!response.ok) {
      const error = (await response.json()) as { message: string };
      console.log(error.message);
      return;
    }

    setFiles(files.filter((file) => file.docId != docId));
  };

  const createNewChat = async () => {
    if (!user || !currentChat) {
      return;
    }

    const userId = user.id;
    const chatId = currentChat.chatId;

    const res = await fetch('/api/chats/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId, chatId })
    });
    if (!res.ok) {
      const error = (await res.json()) as { message: string };
      console.log(error.message);
      return;
    }
    const { newChatID } = (await res.json()) as { newChatID: string };
    await router.push('/chat/' + newChatID);
  };

  const deleteChat = async () => {
    if (!user || !userChats || !currentChat) {
      return;
    }
    if (userChats.length <= 1) {
      alert('You cannot delete your last chat');
      return;
    }

    const res = await fetch('/api/chats/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ chatId: currentChat.chatId })
    });

    if (!res.ok) {
      const error = (await res.json()) as { message: string };
      console.log(error.message);
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

    const res = await fetch('/api/chats/rename', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ chatId: currentChat.chatId, newName })
    });

    if (!res.ok) {
      setCurrentChat({
        chatId: currentChat.chatId,
        chatName: newName
      });
    }
    void updateChat(currentChat.chatId);
  };

  return (
    <>
      {currentChat && files && finishedLoading ? (
        <Chat
          currentChat={currentChat}
          userId={user?.id}
          deleteFile={deleteFile}
          updateFiles={updateFiles}
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

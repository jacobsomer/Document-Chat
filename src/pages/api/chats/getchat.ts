import { createClient } from '@supabase/supabase-js';
import { type NextApiRequest, type NextApiResponse } from 'next';
import { type ChatFile, type File, type UserChat } from '~/types/types';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// const [currentChat, setCurrentChat] = useState<UserChat | null>(null);
//  const [files, setFiles] = useState<File[]>([]);
//  const [userChats, setUserChats] = useState<UserChat[] | undefined>(undefined);
//  we need to get the chatId from the query params
//  we need to get the userId from the query params
//  we need to get the chat from the database
//  we need to get the userChats from the database
//  we need to get the files from the database for the given chatId

type Query = {
  chatId: string;
  userId: string | undefined;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { chatId, userId } = req.query as Query;

  if (!chatId || chatId.length !== 36) {
    res.status(400).json({ message: 'Invalid chatId' });
    return;
  }

  try {

    const { data: chatData, error: chatError } = await supabase
      .from('chats')
      .select('*')
      .eq('chatId', chatId);

    if (chatError) {
      throw chatError;
    }

    const files: File[] = [];
    let name = '';
    for (const file of chatData) {
      const chat = file as ChatFile;
      if (!name) {
        name = chat.docName;
      }
      const docId = chat.docId;
      const { data: docData, error: docError } = await supabase
        .from('userdocuments')
        .select('url, docId, docName, body, embedding')
        .eq('docId', docId);

      if (docError) {
        throw docError;
      }

      for (const file1 of docData) {
        const file2 = file1 as File;
        if (files.find((file) => file.docId === file2.docId)) {
          continue;
        }
        files.push(file2);
      }
    }

    let currentChat: UserChat;
    let userChats: UserChat[];
    if (userId) {
      const { data: userChatsData, error: userChatsError } = await supabase
        .from('userChats')
        .select('*')
        .eq('userId', userId);

      if (userChatsError) {
        throw userChatsError;
      }

      const chat = userChatsData.find((chat) => chat.chatId === chatId);

      if (chat) {
        currentChat = chat as UserChat;
      } else {
        const names = userChatsData.map((chat) => chat.chatName as string);
        let chatName = 'New Chat';
        let i = 1;
        while (names.includes(chatName)) {
          chatName = `New Chat ${i}`;
          i++;
        }

        currentChat = {
          chatId: chatId,
          chatName: chatName
        };

        const { error: upsertError } = await supabase.from('userChats').upsert({
          chatId: chatId,
          userId: userId,
          chatName: chatName
        });

        if (upsertError) {
          throw upsertError;
        }
      }
      userChats = userChatsData.map((chat) => chat as UserChat);
    } else {
      currentChat = {
        chatId: chatId,
        chatName: 'New Chat'
      };
      userChats = [currentChat];
    }

    res.status(200).json({
      currentChat: currentChat,
      files: files,
      userChats: userChats
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal  server error' });
  }
}

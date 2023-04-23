import { type SupabaseClient } from '@supabase/supabase-js';

export type File = {
  url: string;
  docId: string;
  docName: string;
};

export type SearchResponse = {
      index: number[];
      body: string[];
      docName: string[];
    };

export type UserChat = {
  chatId: string;
  chatName: string;
};

export  type ChatFile = {
    chatId: string;
    docId: string;
    docName: string;
  };

export type AddMediaProps = {
   chatId: string;
  updateFiles:  (chatId: string) => Promise<void>;
}
export type DrawerProps = {
  currentChat: UserChat;
  userChats: UserChat[] | undefined;
  supabase: SupabaseClient<any, 'public', any>;
  files: File[];
  handleClearSubmit: (e: React.MouseEvent<HTMLButtonElement>) => void;
  deleteFile: (docId: string) => Promise<void>;
  updateFiles: (chatId: string) => Promise<void>;
  createNewChat: () => Promise<void>;
  deleteChat: () => Promise<void>;
  renameChat: (newName: string) => Promise<void>;
};

export type ChatProps =  {
  currentChat: UserChat;
   userChats: UserChat[] | undefined;
  userId: string | undefined;
  supabase: SupabaseClient<any, 'public', any>;
  files: File[];
  deleteFile: (docId: string) => Promise<void>;
  updateFiles: (chatId: string) => Promise<void>;
  createNewChat: () => Promise<void>;
  deleteChat: () => Promise<void>;
  renameChat: (newName: string) => Promise<void>;
};

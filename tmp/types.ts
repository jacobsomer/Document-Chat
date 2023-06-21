import { type SupabaseClient } from '@supabase/supabase-js';
import { type Dispatch, type SetStateAction } from 'react';
import FileMetadata from '~/components/sidebar/fileDisplay/file/fileModel';

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

export type ChatFile = {
    chatId: string;
    docId: string;
    docName: string;
  };

export type AddMediaProps = {
  chatId: string;
  forceUpdateFiletree: () => void;
  updateFiles:  (chatId: string) => Promise<void>;
  updateFiletree: (file: File) => Promise<FileMetadata>;
  setToolTipString: Dispatch<SetStateAction<string>>;
  directoryUpload?: boolean;
}

export type DrawerProps = {
  currentChat: UserChat;
  userChats: UserChat[] | undefined;
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
  files: File[];
  deleteFile: (docId: string) => Promise<void>;
  updateFiles: (chatId: string) => Promise<void>;
  createNewChat: () => Promise<void>;
  deleteChat: () => Promise<void>;
  renameChat: (newName: string) => Promise<void>;
};

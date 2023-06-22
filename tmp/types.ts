import { type SupabaseClient } from '@supabase/supabase-js';
import { type Dispatch, type SetStateAction } from 'react';
import FileModel from '~/components/sidebar/fileDisplay/file/fileModel';

export type FileModelProps = {
  url: string;
  docId: string;
  docName: string;
  sourceFile?: File;
  chatId: string,
  updateFiles: (chatId: string) => Promise<void>;
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
  updateFiletree: (file: FileModelProps | UrlProps) => Promise<FileModel>;
  setToolTipString: Dispatch<SetStateAction<string>>;
  directoryUpload?: boolean;
}

export type DrawerProps = {
  currentChat: UserChat;
  userChats: UserChat[] | undefined;
  files: FileModelProps[];
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
  files: FileModelProps[];
  deleteFile: (docId: string) => Promise<void>;
  updateFiles: (chatId: string) => Promise<void>;
  createNewChat: () => Promise<void>;
  deleteChat: () => Promise<void>;
  renameChat: (newName: string) => Promise<void>;
};

import { type SupabaseClient } from '@supabase/supabase-js';

export type Chunk = {
  text: string;
  start: number;
  end: number;
  embedding: number[];
};

export type File = {
  url: string;
  docId: string;
};

export type DrawerProps = {
  chatId: string;
  handleClearSubmit: (e: React.MouseEvent<HTMLButtonElement>) => void;
  supabase: SupabaseClient<any, 'public', any>;
  files: File[];
  deleteFile: (docId: string) => Promise<void>;
  updateFiles: () => Promise<void>;
};

export type ChatProps =  {
  chatId: string;
  userId: string | undefined;
  supabase: SupabaseClient<any, 'public', any>;
  files: File[];
  deleteFile: (docId: string) => Promise<void>;
  updateFiles: () => Promise<void>;
};

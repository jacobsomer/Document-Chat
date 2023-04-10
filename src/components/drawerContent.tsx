/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useUser } from '@supabase/auth-helpers-react';
import Account from './account';
import AddMedia from './addMedia';
import Login from './login';
import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { AiFillFileAdd } from 'react-icons/ai';
import { BsFillTrashFill } from 'react-icons/bs';
import { useRouter } from 'next/router';
import styles from '~/styles/drawerStyles.module.css';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

const urlToFileName = (url: string) => {
  const split = url.split('/');
  return split[split.length - 1];
};

const FileComponent = (props: { url: string; deleteFile: any }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      key={urlToFileName(props.url)}
      className={styles.fileItem}
    >
      <AiFillFileAdd color="hsl(var(--p))" className={styles.fileIcon} />

      <div className={styles.fileName}>&nbsp; {urlToFileName(props.url)}</div>
      {isHovered && (
        <div className={styles.deleteIconContainer}>
          <div className="tooltip" data-tip="Delete">
            <BsFillTrashFill
              onClick={() => {
                props.deleteFile(props.url);
              }}
              color="hsl(var(--p))"
              className={styles.deleteIcon}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export const DrawerContent = (props: any) => {
  const user = useUser();
  const [files, setFiles] = useState<{ [x: string]: any }[]>([]);
  const router = useRouter();
  const [chatId, setChatId] = useState(router.asPath.split('=')[1]);

  const onFileUpload = useCallback(async () => {
    const { data, error } = await supabase
      .from('userdocuments')
      .select('*')
      .eq('userid', chatId);
    if (error) {
      console.log(error);
    }
    if (data) {
      setFiles(data);
      const tmpFiles: Array<any> = [];
      for (const file of data) {
        const url = file.url;
        if (!tmpFiles.find((f) => f.url === url)) {
          tmpFiles.push(file);
        }
      }
      setFiles(tmpFiles);
    }
  }, [user]);

  const deleteFile = useCallback(
    async (url: string) => {
      const userid = user?.id;
      const { data, error } = await supabase
        .from('userdocuments')
        .delete()
        .eq('userid', userid)
        .eq('url', url);
      if (error) {
        console.log(error);
      }
      if (data) {
        console.log(data);
      }
    },
    [user]
  );

  useEffect(() => {
    // if (user) {
    //   setChatId(user.id);
    // } else {
    //   const chatId = router.query.chatID || router.asPath.split('=')[1];
    //   if (chatId !== undefined && chatId !== '' && typeof chatId === 'string') {
    //     setChatId(chatId);
    //   } else {
    //     void router.push('/');
    //   }
    // }
    // void onFileUpload();
  }, [user]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div>
        <div className={styles.filesContainer}>
          <div>Files</div>
          {files.map((file) => (
            <FileComponent
              key={file.url}
              url={file.url}
              deleteFile={deleteFile}
            />
          ))}
        </div>
      </div>
      <div
        style={{
          height: '20vh',
          position: 'relative',
          display: 'flex',
          justifyContent: 'end',
          alignItems: 'end',
          padding: '10px'
        }}
      >
        <div className="flex flex-1 flex-col items-center justify-center ">
          {user ? (
            <>
              <AddMedia onFileUpload={onFileUpload} />
              <button
                onClick={props.handleClearSubmit}
                className="btn-ghost avatar btn text-neutral-content"
              >
                Clear Chat
              </button>
              <Account />
            </>
          ) : (
            <>
              <Login />
              <div className="h-10"></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DrawerContent;

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
import { MouseEventHandler, useCallback, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';
import { AiFillFileAdd } from 'react-icons/ai';
import { BsFillTrashFill } from 'react-icons/bs';
type File = {
  filename: string;
  url: string;
  type: string;
};

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
      style={{
        position: 'relative',
        width: '200px',
        color: 'hsl(var(--pc))',
        backgroundColor: 'hsl(var(--pc))',
        margin: '8px',
        borderRadius: '8px',
        padding: '8px',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <AiFillFileAdd color="hsl(var(--p))" />

      <div
        style={{
          position: 'relative',
          width: '100%',
          fontSize: '16px',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          left: '0px',
          color: 'hsl(var(--p))'
        }}
      >
        &nbsp; {urlToFileName(props.url)}
      </div>
      {isHovered && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            right: '4px',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div className="tooltip" data-tip="Delete">
            <BsFillTrashFill
              onClick={() => {
                props.deleteFile(props.url);
              }}
              color="hsl(var(--p))"
              style={{
                width: '20px',
                height: '20px'
              }}
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

  const onFileUpload = useCallback(async () => {
    const userid = user?.id || localStorage.getItem('userid');
    console.log(user?.id);
    const { data, error } = await supabase
      .from('userdocuments')
      .select('*')
      .eq('userid', userid);
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
      const userid = user?.id || localStorage.getItem('userid');
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
    if (user) {
      void onFileUpload();
    }
  }, [user]);

  return (
    <div>
      <div className="flex h-full w-full flex-col items-center justify-center">
        <div
          style={{
            width: '100%',
            height: '80vh',
            backgroundColor: 'var(--color-bg)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            overflow: 'scroll'
          }}
        >
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DrawerContent;

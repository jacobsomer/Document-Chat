import { useUser } from '@supabase/auth-helpers-react';
import Account from './account';
import AddMedia from './addMedia';
import Login from './login';
import { useState } from 'react';
import { AiFillFileAdd } from 'react-icons/ai';
import { BsFillTrashFill } from 'react-icons/bs';
import styles from '~/styles/drawerStyles.module.css';
import { type DrawerProps } from '~/types/types';

const urlToFileName = (url: string) => {
  const split = url.split('/');
  return split[split.length - 1];
};

const FileComponent = (props: {
  url: string;
  deleteFile: (url: string) => Promise<void>;
}) => {
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
                void props.deleteFile(props.url);
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

export const DrawerContent = (props: DrawerProps) => {
  const user = useUser();
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className={styles.filesContainer}>
        
        <select className="select w-full max-w-xs mb-5">
          <option value="DEFAULT">{props.chatId}</option>
          <option value="1">Tuna </option>
        </select>
        
        {props.files.map((file) => (
          <FileComponent
            key={file.url}
            url={file.url}
            deleteFile={() => props.deleteFile(file.docId)}
          />
        ))}
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
              <AddMedia updateFiles={props.updateFiles} chatId={props.chatId} />
              <button
                onClick={props.handleClearSubmit}
                className="btn-ghost avatar btn text-base-content"
              >
                Clear Chat
              </button>
              <Account />
            </>
          ) : (
            <>
              <Login chatURL={'/chat/' + props.chatId} />
              <div className="h-10"></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DrawerContent;

import { useUser } from '@supabase/auth-helpers-react';
import Account from './account';
import AddMedia from './addMedia';
import Login from './login';
import { useState } from 'react';
import { AiFillFileAdd } from 'react-icons/ai';
import { BsFillCloudDownloadFill, BsFillTrashFill } from 'react-icons/bs';
import styles from '~/styles/drawerStyles.module.css';
import { type DrawerProps } from '~/types/types';
import { useRouter } from 'next/router';
import ChatSettings from './chatSettings';

const FileComponent = (props: {
  name: string;
  url: string;
  deleteFile: (url: string) => Promise<void>;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      key={props.name}
      className={styles.fileItem}
    >
      <AiFillFileAdd color="hsl(var(--s))" className={styles.fileIcon} />
        <div className="relative w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-base text-base-content">
          &nbsp; {props.name}
        </div>

      {isHovered && (
        <>
          <div className="absolute right-12 top-1/2 z-50 flex -translate-y-1/2 transform items-center justify-center">
            {props.url.includes('supabase') ? (
              <div className="tooltip" data-tip="Download">
                <a href={props.url}>
                  <BsFillCloudDownloadFill
                    color="hsl(var(--s))"
                    className="w-10 bg-base-100"
                  />
                </a>
              </div>
            ) : (
              <div className="tooltip" data-tip="View">
                <a href={props.url} target="_blank">
                  <BsFillCloudDownloadFill
                    color="hsl(var(--s))"
                    className="w-10 bg-base-100"
                  />
                </a>
              </div>
            )}
          </div>
          <div className="absolute right-4 top-1/2 z-50 flex -translate-y-1/2 transform items-center justify-center">
            <div className="tooltip" data-tip="Delete">
              <BsFillTrashFill
                onClick={() => {
                  void props.deleteFile(props.url);
                }}
                color="hsl(var(--s))"
                className="w-10 cursor-pointer bg-base-100"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export const DrawerContent = (props: DrawerProps) => {
  const user = useUser();
  const router = useRouter();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className={styles.filesContainer}>
        <select
          className="select mb-5 w-full max-w-xs"
          onChange={(e) => {
            void router.push('/chat/' + e.target.value);
          }}
        >
          <option value={props.currentChat.chatId}>
            {props.currentChat.name}
          </option>
          {props.userChats?.map((chat) => {
            if (chat.chatId === props.currentChat.chatId) {
              return;
            }
            return (
              <option value={chat.chatId} key={chat.chatId}>
                {chat.name}
              </option>
            );
          })}
        </select>
        {props.files.map((file) => (
          <FileComponent
            key={file.docId}
            url={file.url}
            name={file.name}
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
              <AddMedia
                updateFiles={props.updateFiles}
                chatId={props.currentChat.chatId}
              />
              <ChatSettings
                handleClearSubmit={props.handleClearSubmit}
                createNewChat={props.createNewChat}
                deleteChat={props.deleteChat}
                renameChat={props.renameChat}
              />
              <Account />
            </>
          ) : (
            <>
              <AddMedia
                updateFiles={props.updateFiles}
                chatId={props.currentChat.chatId}
              />
              <Login chatURL={'/chat/' + props.currentChat.chatId} />
              <div className="h-10"></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DrawerContent;

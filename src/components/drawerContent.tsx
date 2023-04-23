import { useUser } from '@supabase/auth-helpers-react';
import Account from './account';
import AddMedia from './addMedia';
import Login from './login';
import { useEffect, useState } from 'react';
import { AiFillFileAdd } from 'react-icons/ai';
import { BsFillCloudDownloadFill, BsFillTrashFill } from 'react-icons/bs';
import styles from '~/styles/drawerStyles.module.css';
import { type DrawerProps } from '~/types/types';
import { useRouter } from 'next/router';
import ChatSettings from './chatSettings';
import { HiSelector } from 'react-icons/hi';

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

  const alternateChatLength = props.userChats?.map(
    (chat) => chat.chatId !== props.currentChat.chatId
  ).length;

  useEffect(() => {
    if (!user && props.files.length == 0) {
      // get element by id
      const introModal = document.getElementById('introModal');
      // if element exists, click it
      if (introModal) {
        introModal.click();
      }
    }
  }, [props.files.length, props.userChats, user]);

  return (
    <div className="relative flex h-[100vh] w-[250px] flex-col bg-[hsl(var(--b3))] text-[hsl(var(--bc))]">
      <div className="flex h-[100px] w-[250px] flex-col items-center justify-center">
        {user ? (
          <>
            <div className="flex w-[90%] items-center justify-between px-4">
              <div
                className={
                  'relative h-fit text-center text-xl text-base-content'
                }
              >
                {alternateChatLength && alternateChatLength > 1 && (
                  <div className="dropdown dropdown-bottom">
                    <label tabIndex={0} className="btn-ghost btn m-1">
                      <HiSelector /> {props.currentChat.chatName}
                    </label>
                    <ul
                      tabIndex={0}
                      className={
                        'dropdown-content menu rounded-box w-52 bg-base-100 p-2 shadow'
                      }
                    >
                      {props.userChats?.map((chat) => {
                        if (chat.chatId !== props.currentChat.chatId) {
                          return (
                            <li key={chat.chatId}>
                              <a
                                onClick={() => {
                                  void router.push('/chat/' + chat.chatId);
                                }}
                              >
                                {chat.chatName}
                              </a>
                            </li>
                          );
                        }
                      })}
                    </ul>
                  </div>
                )}
              </div>
              <ChatSettings
                handleClearSubmit={props.handleClearSubmit}
                createNewChat={props.createNewChat}
                deleteChat={props.deleteChat}
                renameChat={props.renameChat}
              />
            </div>
          </>
        ) : (
          <div className="text-xl text-base-content">
            {props.currentChat.chatName} Hello
          </div>
        )}
      </div>

      {
        // If user is not logged in, display intro modal
        !user && (
          <>
            <label
              id="introModal"
              htmlFor="IntroModal"
              className="btn invisible"
            />
            <input type="checkbox" id="IntroModal" className="modal-toggle" />
            <div className="modal">
              <div className="modal-box relative">
                <label
                  htmlFor="IntroModal"
                  className="btn-sm btn-circle btn absolute right-2 top-2"
                  id="introModalClose"
                >
                  ✕
                </label>
                <h3 className="text-lg font-bold">
                  👋 Hey there! Welcome to DocuChat!
                </h3>
                <p className="py-4">
                  Chat with anything! 🤩 From PDFs and DOCX files to CSVs and
                  news articles, Wikipedia, and YouTube videos, we&apos;ve got
                  you covered! 🙌 So come join the fun and create the most
                  amazing chat experience ever! 🚀
                </p>
              </div>
            </div>
          </>
        )
      }
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          overflowY: 'scroll',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
          color: 'hsl(var(--bc))',
          fontSize: 'large'
        }}
      >
        <div className="my-2 w-20 border-t-2 border-black"></div>

        {props.files.length === 0 ? (
          <>
            <div className="text-sm text-base-content">No files yet!</div>
          </>
        ) : (
          props.files.map((file) => (
            <FileComponent
              key={file.docId}
              url={file.url}
              name={file.docName}
              deleteFile={() => props.deleteFile(file.docId)}
            />
          ))
        )}
      </div>

      <div
        style={{
          height: '20%',
          minHeight: '150px',
          position: 'relative',
          display: 'flex',
          justifyContent: 'end',
          alignItems: 'end',
          padding: '10px'
        }}
      >
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flex: '1',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%'
          }}
        >
          {user ? (
            <>
              <div className="tooltip" data-tip="Click me to add files">
                <AddMedia
                  updateFiles={props.updateFiles}
                  chatId={props.currentChat.chatId}
                />
              </div>
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

import { useUser } from '@supabase/auth-helpers-react';
import Account from './account';
import AddMedia from '~/components/drawer/addMedia';
import Login from '../utils/login';
import { type MouseEvent, useEffect, useState } from 'react';
import { type DrawerProps } from '~/types/types';
import { useRouter } from 'next/router';
import ChatSettings from './chatSettings';
import { HiChevronRight, HiSelector } from 'react-icons/hi';
import FileComponent from './fileComponent';
import IntroModal from '../chat/introModal';
import { isMobile } from 'react-device-detect';

export const DrawerContent = (props: DrawerProps) => {
  const user = useUser();
  const router = useRouter();
  const [toolTipString, setToolTipString] = useState('');
  const [width, setWidth] = useState(250);
  const [isDragging, setIsDragging] = useState(false);

  const alternateChatLength = props.userChats?.map(
    (chat) => chat.chatId !== props.currentChat.chatId
  ).length;

  useEffect(() => {
    const handleMouseMove = (event: { clientX: number; clientY: number }) => {
      if (isDragging) {
        setWidth(Math.min(Math.max(event.clientX, 0), 800));
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, props.files.length, props.userChats, user, width]);

  if (isMobile) {
    return (
      <div className="relative flex h-[100vh] w-[250px] flex-col bg-[hsl(var(--b3))] text-[hsl(var(--bc))]">
        <div className="flex h-[100px] w-[250px] flex-col items-center justify-center">
          {user ? (
            <div className="flex w-[100%] items-center justify-center px-4">
              <div
                className={
                  'relative h-fit text-center text-5xl text-base-content'
                }
              >
                {alternateChatLength && alternateChatLength > 1 ? (
                  <div className="dropdown-right dropdown">
                    <label
                      tabIndex={0}
                      className="btn-ghost btn m-1 bg-base-100"
                    >
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
                ) : (
                  <div className="align-right relative flex h-fit text-4xl text-base-content">
                    {/* {props.currentChat.chatName} */}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="align-center relative flex h-fit text-4xl text-base-content">
              {props.currentChat.chatName}
            </div>
          )}
        </div>

        {
          // If user is not logged in, display intro modal
          !user && <IntroModal setToolTipString={setToolTipString} />
        }
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            overflowY: props.files.length > 3 ? 'scroll' : undefined,
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
            color: 'hsl(var(--bc))',
            fontSize: 'large'
          }}
        >
          <div className="my-2 w-20 border-t-2 border-black"></div>

          {props.files.length === 0 ? (
            <>
              <div className="text-3xl text-base-content">No files yet!</div>
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
              height: '100%',
              marginBottom: '140px'
            }}
          >
            {user ? (
              <>
                <ChatSettings
                  handleClearSubmit={props.handleClearSubmit}
                  createNewChat={props.createNewChat}
                  deleteChat={props.deleteChat}
                  renameChat={props.renameChat}
                />
                <AddMedia
                  updateFiles={props.updateFiles}
                  chatId={props.currentChat.chatId}
                  setToolTipString={setToolTipString}
                />

                <Account />
              </>
            ) : (
              <>
                <div
                  className={'tooltip' + toolTipString}
                  data-tip="Click me to add files"
                  id="tooltip1"
                >
                  <AddMedia
                    updateFiles={props.updateFiles}
                    chatId={props.currentChat.chatId}
                    setToolTipString={setToolTipString}
                  />
                </div>
                <div
                  className="tooltip"
                  data-tip="Login to save this files and chats"
                  id="tooltip1"
                >
                  <Login chatURL={'/chat/' + props.currentChat.chatId + '/'} />
                </div>
                <div className="h-10"></div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  const handleDrag = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    const newWidth = width + e.movementX;
    if (newWidth >= 0 && newWidth <= 800) {
      setWidth(newWidth);
      setIsDragging(true);
    }
  };

  return (
    <div
      className={
        'relative flex h-[100vh] flex-col bg-[hsl(var(--b3))] text-[hsl(var(--bc))]'
      }
      style={{
        width: width.toString() + 'px'
      }}
    >
      <div
        style={{
          zIndex: '1',
          marginLeft: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          left: width.toString() + 'px',
          cursor: 'ew-resize'
        }}
        onMouseMove={(e) => {
          if (e.buttons === 1) {
            handleDrag(e);
          }
        }}
        className={`absolute h-[80vh] w-[24px] bg-[${
          isDragging ? 'hsl(var(--b3))' : 'hsl(var(--b1))'
        }] rounded-full hover:bg-[hsl(var(--b3))]`}
      >
        <div
          className={
            'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform'
          }
        >
          <HiChevronRight className={'h-6 w-6 text-[hsl(var(--bc))]'} />
        </div>
      </div>
      <div
        style={{
          width: width.toString() + 'px',
          overflow: Number(width.toString()) < 150 ? 'hidden' : 'visible'
        }}
        className={'flex h-[100px] flex-col items-center justify-center'}
      >
        {user ? (
          <div className="flex w-[100%] items-center justify-center px-4">
            <div
              className={'relative h-fit text-center text-xl text-base-content'}
            >
              {alternateChatLength && alternateChatLength > 1 ? (
                <div className="dropdown-right dropdown">
                  <label tabIndex={0} className="btn-ghost btn m-1 bg-base-100">
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
              ) : (
                <div className="align-right relative flex h-fit text-xl text-base-content">
                  {props.currentChat.chatName}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="align-center relative flex h-fit text-xl text-base-content">
            {props.currentChat.chatName}
          </div>
        )}
      </div>

      {
        // If user is not logged in, display intro modal
        !user && <IntroModal setToolTipString={setToolTipString} />
      }
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          overflowY: props.files.length > 3 ? 'scroll' : undefined,
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
          color: 'hsl(var(--bc))',
          fontSize: 'large',
          maxWidth: width.toString() + 'px',
          overflow: 'hidden'
        }}
      >
        <div className="divider">My Files</div>
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
              <ChatSettings
                handleClearSubmit={props.handleClearSubmit}
                createNewChat={props.createNewChat}
                deleteChat={props.deleteChat}
                renameChat={props.renameChat}
              />
              <AddMedia
                updateFiles={props.updateFiles}
                chatId={props.currentChat.chatId}
                setToolTipString={setToolTipString}
              />

              <Account />
            </>
          ) : (
            <>
              <div
                className={'tooltip' + toolTipString}
                data-tip="Click me to add files"
                id="tooltip1"
              >
                <AddMedia
                  updateFiles={props.updateFiles}
                  chatId={props.currentChat.chatId}
                  setToolTipString={setToolTipString}
                />
              </div>
              <div
                className="tooltip"
                data-tip="Login to save this files and chats"
                id="tooltip1"
              >
                <Login chatURL={'/chat/' + props.currentChat.chatId + '/'} />
              </div>
              <div className="h-10"></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DrawerContent;

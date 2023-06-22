import { UserChat } from 'tmp/types';

import { HiSelector } from 'react-icons/hi';

export interface AltChatProps {
  currentChat: UserChat;
  userChats?: UserChat[];
  alternateChatLength?: number;
  router?: any;
}

export const AltChat = (props: AltChatProps) => {
  return (
    <div className="flex w-[100%] items-center justify-center px-4">
      <div className={'relative h-fit text-center text-5xl text-base-content'}>
        {props.alternateChatLength && props.alternateChatLength > 1 ? (
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
                          void props.router.push('/chat/' + chat.chatId);
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
  );
};

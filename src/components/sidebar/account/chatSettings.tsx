import { useUser } from '@supabase/auth-helpers-react';
import { useState } from 'react';
import { AiOutlineSetting, AiOutlineDelete } from 'react-icons/ai';
import { MdDriveFileRenameOutline } from 'react-icons/md';
import { RxReset } from 'react-icons/rx';
import { BiMessageSquareAdd } from 'react-icons/bi';
import { isMobile } from 'react-device-detect';

type AccountProps = {
  handleClearSubmit: (e: React.MouseEvent<HTMLButtonElement>) => void;
  createNewChat: () => Promise<void>;
  deleteChat: () => Promise<void>;
  renameChat: (newName: string) => Promise<void>;
};

export default function Account(props: AccountProps) {
  const user = useUser();
  const [newChatName, setNewChatName] = useState<string>('');

  if (isMobile) {
    return (
      <>
        {/* Rename chat modal */}
        <input type="checkbox" id="my-modal-rename" className="modal-toggle" />
        <label htmlFor="my-modal-rename" className="modal cursor-pointer">
          <label className="modal-box relative p-5" htmlFor="">
            <h3 className="mb-3 text-xl font-bold">Rename Chat</h3>
            <input
              type="text"
              placeholder="Enter new chat name"
              className="input-bordered input mb-3"
              maxLength={10}
              onChange={(e) => {
                setNewChatName(e.target.value);
              }}
            />
            <div className="btn-group">
              <button
                onClick={() => {
                  void props.renameChat(newChatName);
                  // close modal
                  const modal = document.getElementById('renameclose');
                  if (modal) {
                    modal.click();
                  }
                }}
                className="btn-primary btn"
              >
                Rename
              </button>
              <label
                htmlFor="my-modal-rename"
                className="btn-secondary btn"
                id="renameclose"
              >
                Cancel
              </label>
            </div>
          </label>
        </label>

        <input type="checkbox" id="my-modal-delete" className="modal-toggle" />
        <label htmlFor="my-modal-delete" className="modal cursor-pointer">
          <label className="modal-box relative p-5" htmlFor="">
            <h3 className="mb-3 text-xl font-bold">Delete Chat</h3>
            <p className="mb-5">Are you sure you want to delete this chat?</p>
            <div className="btn-group">
              <button
                onClick={() => {
                  void props.deleteChat();
                }}
                className="btn-primary btn"
              >
                Yes
              </button>
              <label htmlFor="my-modal-delete" className="btn-secondary btn">
                No
              </label>
            </div>
          </label>
        </label>
        <div
          style={{
            position: 'relative',
            left: '0px'
          }}
        >
          <div className="dropdown-right dropdown-end dropdown">
            <label
              tabIndex={0}
              className="btn-lg avatar btn btn mb-10 rounded-md px-4  py-2 text-2xl"
            >
              <AiOutlineSetting /> &nbsp;&nbsp; Settings
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu rounded-box w-52 bg-accent bg-base-100 p-2 shadow"
            >
              {user && (
                <>
                  <button
                    onClick={() => void props.createNewChat()}
                    className="btn-ghost avatar btn text-base-content"
                  >
                    <BiMessageSquareAdd />
                    &nbsp;&nbsp; New Chat
                  </button>
                  <label
                    htmlFor="my-modal-delete"
                    className="btn-ghost avatar btn text-base-content"
                  >
                    <AiOutlineDelete /> &nbsp;&nbsp;Delete Chat
                  </label>
                  <label
                    htmlFor="my-modal-rename"
                    className="btn-ghost avatar btn text-base-content"
                  >
                    <MdDriveFileRenameOutline />
                    &nbsp;&nbsp;Rename Chat
                  </label>
                </>
              )}
              <li>
                <button
                  onClick={props.handleClearSubmit}
                  className="btn-ghost avatar btn text-base-content"
                >
                  <RxReset />
                  &nbsp;&nbsp;Reset Chat
                </button>
              </li>
            </ul>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Rename chat modal */}
      <input type="checkbox" id="my-modal-rename" className="modal-toggle" />
      <label htmlFor="my-modal-rename" className="modal cursor-pointer">
        <label className="modal-box relative p-5" htmlFor="">
          <h3 className="mb-3 text-xl font-bold">Rename Chat</h3>
          <input
            type="text"
            placeholder="Enter new chat name"
            className="input-bordered input mb-3"
            maxLength={10}
            onChange={(e) => {
              setNewChatName(e.target.value);
            }}
          />
          <div className="btn-group">
            <button
              onClick={() => {
                void props.renameChat(newChatName);
              }}
              className="btn-primary btn"
            >
              Rename
            </button>
            <label htmlFor="my-modal-rename" className="btn-secondary btn">
              Cancel
            </label>
          </div>
        </label>
      </label>

      <input type="checkbox" id="my-modal-delete" className="modal-toggle" />
      <label htmlFor="my-modal-delete" className="modal cursor-pointer">
        <label className="modal-box relative p-5" htmlFor="">
          <h3 className="mb-3 text-xl font-bold">Delete Chat</h3>
          <p className="mb-5">Are you sure you want to delete this chat?</p>
          <div className="btn-group">
            <button
              onClick={() => {
                void props.deleteChat();
              }}
              className="btn-primary btn"
            >
              Yes
            </button>
            <label htmlFor="my-modal-delete" className="btn-secondary btn">
              No
            </label>
          </div>
        </label>
      </label>
      <div
        style={{
          position: 'relative',
          left: '0px'
        }}
      >
        <div className="dropdown-right dropdown-end dropdown">
          <label
            tabIndex={0}
            className="btn-ghost avatar btn  text-base-content"
          >
            <AiOutlineSetting /> &nbsp;&nbsp; Settings
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu rounded-box w-52 bg-accent bg-base-100 p-2 shadow"
          >
            {user && (
              <>
                <button
                  onClick={() => void props.createNewChat()}
                  className="btn-ghost avatar btn text-base-content"
                >
                  <BiMessageSquareAdd />
                  &nbsp;&nbsp; New Chat
                </button>
                <label
                  htmlFor="my-modal-delete"
                  className="btn-ghost avatar btn text-base-content"
                >
                  <AiOutlineDelete /> &nbsp;&nbsp;Delete Chat
                </label>
                <label
                  htmlFor="my-modal-rename"
                  className="btn-ghost avatar btn text-base-content"
                >
                  <MdDriveFileRenameOutline />
                  &nbsp;&nbsp;Rename Chat
                </label>
              </>
            )}
            <li>
              <button
                onClick={props.handleClearSubmit}
                className="btn-ghost avatar btn text-base-content"
              >
                <RxReset />
                &nbsp;&nbsp;Reset Chat
              </button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

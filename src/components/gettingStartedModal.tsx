/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useState } from 'react';
import AddData from './addMedia';
import UploadSquare from './uploadSquare';

export const GettingStartedModal = (props: any) => {
  const [isFinished, setIsFinished] = useState(false);

  const handleIsFinished = (event: any) => {
    setIsFinished(true);
  };

  return (
    <>
      {!isFinished && (
        <div>
          <input
            type="checkbox"
            id="about"
            className="modal-toggle"
            defaultChecked={true}
          />
          <div className="modal">
            <div className="modal-box">
              <>
                <h3 className="text-lg font-bold">Welcome to DocuChat 🧋</h3>
                <p className="pt-4">
                  DocuChat allows you to chat with{' '}
                  <span className="text-purple-500">GPT-4</span>!
                  <br />
                  <br />
                  Coming soon:
                  <br />
                  Chat with any documents: PDFs, PPTX, even YouTube videos!
                  <br />
                  <br />
                  Join our{' '}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://discord.gg/QXKDjbxevt"
                    className="link-hover link-primary link"
                  >
                    discord
                  </a>{' '}
                  to stay updated!
                </p>
                <div className="modal-action">
                  <label className="btn-primary btn" onClick={handleIsFinished}>
                    Get Started
                  </label>
                </div>
              </>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

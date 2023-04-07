/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useUser } from '@supabase/auth-helpers-react';
import Account from './account';
import AddMedia from './addMedia';
import Login from './login';
import { MouseEventHandler } from 'react';


export const DrawerContent = (props:any) => {
  const user = useUser();

  return (
    <div>
      <div className="flex h-full w-full flex-col items-center justify-center">
        <div
          style={{
            width: '80%',
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
        </div>
        {/* place at bottom of container */}
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
           
              <AddMedia />
               <button onClick={props.handleClearSubmit}  className="btn-ghost avatar btn text-neutral-content">
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

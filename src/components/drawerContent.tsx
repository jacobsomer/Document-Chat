import { useUser } from '@supabase/auth-helpers-react';
import Account from './account';
import AddMedia from './addMedia';
import Login from './login';

export const DrawerContent = () => {
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
          <div>
            Files
          </div>
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

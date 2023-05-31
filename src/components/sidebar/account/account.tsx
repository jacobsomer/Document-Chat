// Account Model, On Hover it should display the Account Component

import { useRouter } from 'next/router';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import Profile from './profile';
import { isMobile } from 'react-device-detect';

export default function Account() {
  const router = useRouter();
  const supabaseClient = useSupabaseClient();

  const handleLogout = async () => {
    await supabaseClient.auth.signOut();
    void router.push('/');
  };

  return (
    <div
      style={{
        position: 'relative',
        left: '0px'
      }}
    >
      <Profile />
      <div className="dropdown-right dropdown-end dropdown">
        {isMobile ? (
          <label
            tabIndex={0}
            className="btn-lg avatar btn btn mb-10 rounded-md px-4 py-2 text-2xl"
          >
            Account
          </label>
        ) : (
          <label
            tabIndex={0}
            className="btn-ghost avatar btn text-base-content"
          >
            Account
          </label>
        )}

        <ul
          tabIndex={0}
          className="dropdown-content menu rounded-box w-52 bg-accent bg-base-100 p-2 shadow"
        >
          <li className="disabled">
            <div>
              <span>API</span> <span className="text-warning">coming soon</span>
            </div>
          </li>
          <li>
            <label
              className="btn-ghost avatar btn text-base-content"
              htmlFor="profile-modal"
            >
              Profile
            </label>
          </li>
          <li>
            <label
              className="btn-ghost avatar btn text-base-content"
              onClick={() => void handleLogout()}
            >
              Logout
            </label>
          </li>
        </ul>
      </div>
    </div>
  );
}

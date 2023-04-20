/* eslint-disable @typescript-eslint/no-misused-promises */
// Account Model, On Hover it should display the Account Component

import { useRouter } from 'next/router';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

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
      <div className="dropdown-right dropdown-end dropdown">
        <label tabIndex={0} className="btn-ghost avatar btn text-base-content">
          Account
        </label>
        <ul
          tabIndex={0}
          className="dropdown-content menu rounded-box w-52 bg-accent bg-base-100 p-2 shadow"
        >
          <li>
            <a className="justify-between" href="" target="_blank">
              Discord
            </a>
          </li>
          <li>
            <a href="" target="_blank">
              Twitter
            </a>
          </li>
          <li>
            <a onClick={handleLogout}>Logout</a>
          </li>
        </ul>
      </div>
    </div>
  );
}

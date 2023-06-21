import { Auth } from '@supabase/auth-ui-react';
import { useUser } from '@supabase/auth-helpers-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { isMobile } from 'react-device-detect';
import { createClient } from '@supabase/supabase-js';

export default function Login(props: { chatURL: string }) {
  const origin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : '';

  const supabaseClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );

  const user = useUser();

  if (user) {
    return null;
  }
  return (
    <>
      {isMobile ? (
        <label
          htmlFor="my-modal"
          className="btn-ghost avatar btn rounded-md px-4 py-2 text-xl"
        >
          Login
        </label>
      ) : (
        <label
          htmlFor="my-modal"
          className="btn bg-[#1d1c1d] px-4 py-2 font-thin text-base-100"
        >
          Try ChatBoba Free
        </label>
      )}

      <input type="checkbox" id="my-modal" className="modal-toggle" />
      <label htmlFor="my-modal" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <h1>ChatBoba</h1>
          <Auth
            supabaseClient={supabaseClient}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: 'hsl(var(--p))',
                    brandAccent: 'hsl(var(--pf))'
                  }
                }
              }
            }}
            providers={['google']}
            redirectTo={
              origin !== 'http://localhost:3000'
                ? 'https://www.chatboba.com' + props.chatURL
                : 'http://localhost:3000' + props.chatURL
            }
          />
        </label>
      </label>
    </>
  );
}

import { Auth } from '@supabase/auth-ui-react';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useEffect } from 'react';
import { isMobile } from 'react-device-detect';

export default function Login(props: { chatURL: string }) {
  const supabaseClient = useSupabaseClient();
  const user = useUser();

  useEffect(() => {
    if (user) {
      window.location.href = '/chat';
    }
    console.log(props.chatURL);
  }, [props.chatURL, user]);

  return (
    <>
      {isMobile ? (
        <label
          htmlFor="my-modal"
          className="avatar btn rounded-md px-4 py-2  text-xl"
        >
          Login
        </label>
      ) : (
        <label
          htmlFor="my-modal"
          className="btn-ghost avatar btn rounded-md px-4 py-2 text-base-content"
        >
          Login
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
            redirectTo={props.chatURL || 'https://www.chatboba.com/chat/'}
          />
        </label>
      </label>
    </>
  );
}

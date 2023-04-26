import { Auth } from '@supabase/auth-ui-react';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useEffect } from 'react';

export default function Login(props: { chatURL: string }) {
  const supabaseClient = useSupabaseClient();
  const user = useUser();

  useEffect(() => {
    if (user) {
      window.location.href = '/chat';
    }
  }, [user]);

  return (
    <>
      <label
        htmlFor="my-modal"
        className="btn-ghost avatar btn rounded-md px-4 py-2 text-base-content"
      >
        Login
      </label>
      <input type="checkbox" id="my-modal" className="modal-toggle" />
      <label htmlFor="my-modal" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <h1>DocuChat</h1>
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
            redirectTo={props.chatURL || '/chat'}
          />
        </label>
      </label>
    </>
  );
}

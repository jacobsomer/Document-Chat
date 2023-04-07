import { Auth } from '@supabase/auth-ui-react';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useEffect } from 'react';

export default function Login() {
  const supabaseClient = useSupabaseClient();
  const user = useUser();

  useEffect(() => {
    if (user) {
      window.location.href = '/chat';
    }
  }, [user]);

  return (
    <>
      <label htmlFor="my-modal" className="btn rounded-md px-4 py-2 text-white">
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
                    brandAccent: 'hsl(var(--s))'
                  }
                }
              }
            }}
            providers={['google']}
            redirectTo="/chat"
          />
        </label>
      </label>
    </>
  );
}

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Auth Callback Route Handler
 *
 * Supabase sends users here after they click the email-verification link.
 * The URL contains a short-lived `code` query param (PKCE flow).
 * We exchange it for a full session, store the session cookies, then
 * redirect to the homepage (or a custom `next` destination).
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/';
  const origin = requestUrl.origin;

  if (code) {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options);
              });
            } catch {
              // `setAll` is called from a Server Component in some edge cases.
              // The middleware will keep the session fresh so this is safe to ignore.
            }
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Redirect to the homepage (or wherever `next` points) with the session
      // cookies already baked into the response.
      return NextResponse.redirect(`${origin}${next}`);
    }

    console.error('[auth/callback] exchangeCodeForSession error:', error.message);
  }

  // If there is no code or the exchange failed, redirect to the homepage.
  // The client-side AuthProvider will determine the actual auth state on load.
  return NextResponse.redirect(`${origin}/`);
}

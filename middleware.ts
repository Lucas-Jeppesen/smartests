import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from './app/utils/supabase/middleware'
import { createClient } from './app/utils/supabase/server'


export async function middleware(request: NextRequest) {

    const response = await updateSession(request);
    const supabase = await createClient();

    const { data: { user }, error } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (login page)
     * - signup (signup page) - add if you have one
     * - about (about page) - or any other public pages
     * - / (root path)
     * - auth/callback (Supabase auth callback) <--- ADD THIS
     * - auth/auth-code-error (Your error page) <--- ADD THIS TOO
     * - Any other public paths or API routes that shouldn't require auth
     * Also exclude specific file extensions.
     */
    '/((?!_next/static|_next/image|favicon.ico|login|signup|about|auth/callback|auth/auth-code-error|^/$|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

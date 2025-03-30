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
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|login|signup|about|$).*)',
  ],
}
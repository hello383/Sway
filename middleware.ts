import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function middleware(request: NextRequest) {
  // Only check /profile route
  if (request.nextUrl.pathname !== '/profile') {
    return NextResponse.next()
  }

  try {
    // Get session from cookies
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.next()
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
    })

    // Get auth token from cookies
    const token = request.cookies.get('sb-access-token')?.value || 
                  request.cookies.get('sb-refresh-token')?.value

    if (!token) {
      // No auth token, redirect to login
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Get user from session
    const authHeader = request.headers.get('authorization')
    if (authHeader) {
      const { data: { user } } = await supabase.auth.getUser(token)
      
      if (user?.email) {
        // Check profile visibility
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('profile_visibility')
          .eq('email', user.email.toLowerCase())
          .maybeSingle()

        if (profile) {
          const visibility = profile.profile_visibility?.toLowerCase()?.trim()
          if (visibility === 'campaign_only' || visibility === 'campaign only') {
            // Redirect campaign_only users to signup
            return NextResponse.redirect(new URL('/signup', request.url))
          }
        }
      }
    }
  } catch (error) {
    console.error('Middleware error:', error)
    // On error, allow through (don't block)
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/profile',
}


import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/signup'

  if (!code) {
    return NextResponse.redirect(new URL('/signup?error=no_code', requestUrl.origin))
  }

  // Exchange code for session
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
  })

  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('Error exchanging code for session:', error)
    return NextResponse.redirect(new URL(`/signup?error=${encodeURIComponent(error.message)}`, requestUrl.origin))
  }

  if (!data?.user) {
    return NextResponse.redirect(new URL('/signup?error=no_user', requestUrl.origin))
  }

  const userEmail = data.user.email
  if (!userEmail) {
    return NextResponse.redirect(new URL('/signup?error=no_email', requestUrl.origin))
  }

  // Check if user has a profile using service role key
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

  const { data: profile } = await supabaseAdmin
    .from('user_profiles')
    .select('id, profile_visibility')
    .eq('email', userEmail.toLowerCase())
    .maybeSingle()

  // Redirect based on profile status
  if (profile && profile.id) {
    // User has a profile - redirect to success page
    return NextResponse.redirect(
      new URL(`/success?visibility=${profile.profile_visibility || 'email'}&id=${profile.id}`, requestUrl.origin)
    )
  } else {
    // User doesn't have a profile - redirect to signup to complete profile
    // The session will be available client-side via Supabase
    return NextResponse.redirect(
      new URL(`/signup?oauth=success&email=${encodeURIComponent(userEmail)}`, requestUrl.origin)
    )
  }
}


'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams?.get('next') || '/signup'

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session from hash fragments (Supabase handles this automatically)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('Session error:', sessionError)
          router.push(`/signup?error=${encodeURIComponent(sessionError.message)}`)
          return
        }

        if (!session?.user) {
          router.push('/signup?error=no_session')
          return
        }

        const userEmail = session.user.email
        if (!userEmail) {
          router.push('/signup?error=no_email')
          return
        }

        // Check if user has a profile
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('id, profile_visibility')
          .eq('email', userEmail.toLowerCase())
          .maybeSingle()

        if (profileError) {
          console.error('Profile check error:', profileError)
        }

        // Redirect based on profile status
        // Only redirect to profile if they have a complete profile (visible or email), not campaign_only
        if (profile && profile.id && (profile.profile_visibility === 'visible' || profile.profile_visibility === 'email')) {
          // User has a complete profile - redirect to profile page
          router.push('/profile')
        } else {
          // User doesn't have a profile or has campaign_only - redirect to signup to complete profile
          router.push(`/signup?oauth=success&email=${encodeURIComponent(userEmail)}`)
        }
      } catch (error: any) {
        console.error('Auth callback error:', error)
        router.push(`/signup?error=${encodeURIComponent(error.message || 'Unknown error')}`)
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <main className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mb-4"></div>
        <p className="text-white/70">Completing sign in...</p>
      </div>
    </main>
  )
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mb-4"></div>
          <p className="text-white/70">Loading...</p>
        </div>
      </main>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
}


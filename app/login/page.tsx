'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isResetMode, setIsResetMode] = useState(false)

  // Check if user is already signed in
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          // User is already signed in - check if they have a profile
          const userEmail = session.user.email
          if (userEmail) {
            const { data: profile } = await supabase
              .from('user_profiles')
              .select('id, profile_visibility')
              .eq('email', userEmail.toLowerCase())
              .maybeSingle()

            // Only redirect to profile if they have a complete profile (visible or email), not campaign_only
            if (profile && profile.id && (profile.profile_visibility === 'visible' || profile.profile_visibility === 'email')) {
              // User has a complete profile - redirect to profile page
              router.push('/profile')
            } else {
              // User doesn't have a profile or has campaign_only - redirect to signup
              router.push('/signup?oauth=success&email=' + encodeURIComponent(userEmail))
            }
          }
        }
      } catch (error) {
        console.error('Error checking session:', error)
      }
    }

    checkSession()
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        // If user doesn't have a password set (old signup), offer password reset
        if (signInError.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Would you like to reset your password?')
          setIsResetMode(true)
        } else {
          setError(signInError.message)
        }
        setLoading(false)
        return
      }

      if (data.user) {
        // Check if user has a profile
        const userEmail = data.user.email
        if (userEmail) {
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('id, profile_visibility')
            .eq('email', userEmail.toLowerCase())
            .maybeSingle()

          // Only redirect to profile if they have a complete profile (visible or email), not campaign_only
          if (profile && profile.id && (profile.profile_visibility === 'visible' || profile.profile_visibility === 'email')) {
            // User has a complete profile - redirect to profile page
            router.push('/profile')
          } else {
            // User doesn't have a profile or has campaign_only - redirect to signup
            router.push('/signup')
          }
        } else {
          router.push('/signup')
        }
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
      setLoading(false)
    }
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (resetError) {
        setError(resetError.message)
        setLoading(false)
        return
      }

      setError('')
      alert('Password reset email sent! Check your inbox.')
      setIsResetMode(false)
      setLoading(false)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-950 py-12 px-4">
      <div className="max-w-md mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="glass-dark rounded-3xl p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-black mb-2">Sign In</h1>
          <p className="text-white/70 mb-6">
            Access your Sway profile
          </p>

          {/* Google Sign In */}
          {!isResetMode && (
            <div className="mb-6">
              <button
                type="button"
                onClick={async () => {
                  const { error: oauthError } = await supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: {
                      redirectTo: `${window.location.origin}/auth/callback?next=/`,
                      queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                      },
                    },
                  })
                  if (oauthError) {
                    setError(oauthError.message)
                  }
                  if (oauthError) {
                    setError(oauthError.message)
                  }
                }}
                className="w-full px-6 py-3 bg-white text-gray-900 rounded-xl font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-gray-950 text-white/50">Or continue with email</span>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={isResetMode ? handlePasswordReset : handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold mb-2">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-900 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="your@email.com"
              />
            </div>

            {!isResetMode && (
              <div>
                <label className="block text-sm font-bold mb-2">
                  Password <span className="text-red-400">*</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-900 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your password"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 gradient-primary rounded-xl font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                'Loading...'
              ) : isResetMode ? (
                'Send Reset Email'
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {!isResetMode && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setIsResetMode(true)}
                className="text-sm text-purple-400 hover:text-purple-300"
              >
                Forgot your password?
              </button>
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-white/10 text-center">
            <p className="text-white/50 text-sm mb-4">Don't have an account?</p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-bold"
            >
              Sign up for Sway
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}


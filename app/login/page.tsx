'use client'

import { useState } from 'react'
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
        // Redirect to profile or dashboard
        router.push('/profile')
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
          <p className="text-white/70 mb-8">
            Access your Sway profile
          </p>

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


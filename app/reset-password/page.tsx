'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { supabase } from '@/lib/supabase'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    // Check if we have the hash from the reset link
    const hash = window.location.hash
    if (hash) {
      // Supabase will handle the hash automatically
    }
  }, [])

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      })

      if (updateError) {
        setError(updateError.message)
        setLoading(false)
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
      setLoading(false)
    }
  }

  if (success) {
    return (
      <main className="min-h-screen bg-gray-950 py-12 px-4">
        <div className="max-w-md mx-auto">
          <div className="glass-dark rounded-3xl p-8 md:p-12 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-black mb-4">Password Updated!</h1>
            <p className="text-white/70 mb-6">Your password has been successfully updated.</p>
            <p className="text-white/50 text-sm">Redirecting to login...</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-950 py-12 px-4">
      <div className="max-w-md mx-auto">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>

        <div className="glass-dark rounded-3xl p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-black mb-2">Reset Password</h1>
          <p className="text-white/70 mb-8">
            Enter your new password
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleReset} className="space-y-6">
            <div>
              <label className="block text-sm font-bold mb-2">
                New Password <span className="text-red-400">*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 bg-gray-900 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="At least 6 characters"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">
                Confirm Password <span className="text-red-400">*</span>
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 bg-gray-900 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Confirm your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 gradient-primary rounded-xl font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating Password...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}

export default function ResetPassword() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gray-950 py-12 px-4">
        <div className="max-w-md mx-auto">
          <div className="glass-dark rounded-3xl p-8 md:p-12 text-center">
            <p className="text-white/70">Loading...</p>
          </div>
        </div>
      </main>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}

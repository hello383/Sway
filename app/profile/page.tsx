'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, Briefcase, Mail, Phone, Globe, LogOut, Edit } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Profile {
  id: string
  full_name: string
  email: string
  phone?: string
  location: string
  county: string
  town?: string
  role: string
  experience: string
  current_company?: string
  expected_salary?: string
  work_hours: string
  remote_retreats?: string
  work_environment?: string
  profile_visibility: string
  employment_status?: string
  linkedin_url?: string
  created_at: string
  updated_at: string
}

export default function Profile() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Get current user
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session?.user?.email) {
          router.push('/login')
          return
        }

        // Fetch profile by email
        const { data, error: fetchError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('email', session.user.email.toLowerCase())
          .maybeSingle()

        if (fetchError) {
          console.error('Error fetching profile:', fetchError)
          setError('Failed to load profile')
          setLoading(false)
          return
        }

        if (!data) {
          // No profile found - redirect to signup
          router.push('/signup')
          return
        }

        setProfile(data)
        setLoading(false)
      } catch (err: any) {
        console.error('Error:', err)
        setError(err.message || 'Something went wrong')
        setLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-950 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass-dark rounded-3xl p-8 md:p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mb-4"></div>
            <p className="text-white/70">Loading your profile...</p>
          </div>
        </div>
      </main>
    )
  }

  if (error || !profile) {
    return (
      <main className="min-h-screen bg-gray-950 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass-dark rounded-3xl p-8 md:p-12 text-center">
            <p className="text-red-400 mb-4">{error || 'Profile not found'}</p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-6 py-3 gradient-primary rounded-xl font-bold hover:scale-105 transition-transform"
            >
              Create Profile
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-950 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-4xl md:text-5xl font-black">My Profile</h1>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-bold transition-all"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Profile Card */}
        <div className="glass-dark rounded-3xl p-8 md:p-12 space-y-8">
          {/* Personal Information */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-white/50 mb-1 block">Full Name</label>
                <p className="text-lg font-bold">{profile.full_name}</p>
              </div>
              <div>
                <label className="text-sm text-white/50 mb-1 block">Email</label>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-white/50" />
                  <p className="text-lg">{profile.email}</p>
                </div>
              </div>
              {profile.phone && (
                <div>
                  <label className="text-sm text-white/50 mb-1 block">Phone</label>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-white/50" />
                    <p className="text-lg">{profile.phone}</p>
                  </div>
                </div>
              )}
              <div>
                <label className="text-sm text-white/50 mb-1 block">Location</label>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-white/50" />
                  <p className="text-lg">{profile.location}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Professional Background */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Professional Background</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-white/50 mb-1 block">Role</label>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-white/50" />
                  <p className="text-lg font-bold">{profile.role}</p>
                </div>
              </div>
              <div>
                <label className="text-sm text-white/50 mb-1 block">Experience</label>
                <p className="text-lg">{profile.experience}</p>
              </div>
              {profile.current_company && (
                <div>
                  <label className="text-sm text-white/50 mb-1 block">Current Company</label>
                  <p className="text-lg">{profile.current_company}</p>
                </div>
              )}
              {profile.employment_status && (
                <div>
                  <label className="text-sm text-white/50 mb-1 block">Employment Status</label>
                  <p className="text-lg">{profile.employment_status}</p>
                </div>
              )}
              {profile.linkedin_url && (
                <div className="md:col-span-2">
                  <label className="text-sm text-white/50 mb-1 block">LinkedIn Profile</label>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-white/50" />
                    <a
                      href={profile.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg text-purple-400 hover:text-purple-300 underline"
                    >
                      {profile.linkedin_url}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Work Preferences */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Work Preferences</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-white/50 mb-1 block">Work Hours</label>
                <p className="text-lg">{profile.work_hours}</p>
              </div>
              {profile.work_environment && (
                <div>
                  <label className="text-sm text-white/50 mb-1 block">Work Environment</label>
                  <p className="text-lg">{profile.work_environment}</p>
                </div>
              )}
              {profile.remote_retreats && (
                <div>
                  <label className="text-sm text-white/50 mb-1 block">Remote Retreats</label>
                  <p className="text-lg">{profile.remote_retreats}</p>
                </div>
              )}
            </div>
          </section>

          {/* Profile Settings */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-white/50 mb-1 block">Profile Visibility</label>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-xl">
                  {profile.profile_visibility === 'visible' && (
                    <span className="font-bold">Public Profile</span>
                  )}
                  {profile.profile_visibility === 'email' && (
                    <span className="font-bold">Private Profile (Email Only)</span>
                  )}
                  {profile.profile_visibility === 'campaign_only' && (
                    <span className="font-bold">Campaign Supporter</span>
                  )}
                </div>
              </div>
              <div className="text-sm text-white/50">
                <p>
                  {profile.profile_visibility === 'visible' && 'Your profile is visible to employers. They can search and contact you directly.'}
                  {profile.profile_visibility === 'email' && 'Your profile is private. You receive email notifications about matching opportunities.'}
                  {profile.profile_visibility === 'campaign_only' && 'You are supporting the campaign. Your profile is not stored in the database.'}
                </p>
              </div>
            </div>
          </section>

          {/* Metadata */}
          <div className="pt-6 border-t border-white/10 text-sm text-white/50">
            <p>Profile created: {new Date(profile.created_at).toLocaleDateString()}</p>
            {profile.updated_at !== profile.created_at && (
              <p>Last updated: {new Date(profile.updated_at).toLocaleDateString()}</p>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}


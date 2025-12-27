'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, Briefcase, Mail, Phone, Globe, LogOut, Edit, Save, X, Users } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import IrelandMap from '@/components/IrelandMap'

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

interface Stats {
  totalProfessionals: number
  visibleProfiles: number
  emailSubscribers: number
  citiesCovered: number
  locationStats: Record<string, number>
  countyStats?: Record<string, number>
  locationPins?: Array<{ town: string; county: string; count: number }>
}

export default function Profile() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [stats, setStats] = useState<Stats | null>(null)
  const [editForm, setEditForm] = useState<Partial<Profile>>({})
  const [shouldRedirect, setShouldRedirect] = useState(false)

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

        // If user has campaign_only profile, redirect them to signup to complete it
        // Check both exact match and lowercase to handle any case issues
        const visibility = data.profile_visibility?.toLowerCase()?.trim()
        console.log('Profile visibility check:', { 
          raw: data.profile_visibility, 
          normalized: visibility,
          isCampaignOnly: visibility === 'campaign_only' || visibility === 'campaign only'
        })
        if (visibility === 'campaign_only' || visibility === 'campaign only') {
          console.log('Redirecting campaign_only user to signup')
          setShouldRedirect(true)
          setLoading(false)
          // Use window.location for immediate redirect (router.push can be slow)
          // Don't set profile state - prevent any rendering
          window.location.href = '/signup'
          return
        }

        // Only set profile if it's not campaign_only
        setProfile(data)
        setEditForm(data)
        setLoading(false)
      } catch (err: any) {
        console.error('Error:', err)
        setError(err.message || 'Something went wrong')
        setLoading(false)
      }
    }

    fetchProfile()

    // Fetch campaign stats
    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats(data.data)
        }
      })
      .catch(console.error)
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const handleSave = async () => {
    if (!profile) return

    setSaving(true)
    setError('')

    try {
      const response = await fetch(`/api/profiles/${profile.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: editForm.full_name,
          phone: editForm.phone || '',
          currentCompany: editForm.current_company || '',
          expectedSalary: editForm.expected_salary || '',
          linkedinUrl: editForm.linkedin_url || '',
          workEnvironment: editForm.work_environment || '',
          remoteRetreats: editForm.remote_retreats || '',
        }),
      })

      const data = await response.json()

      if (data.success) {
        setProfile(data.data)
        setEditForm(data.data)
        setIsEditing(false)
      } else {
        setError(data.error || 'Failed to update profile')
      }
    } catch (err: any) {
      console.error('Error updating profile:', err)
      setError(err.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (profile) {
      setEditForm(profile)
    }
    setIsEditing(false)
    setError('')
  }

  if (loading || shouldRedirect) {
    return (
      <main className="min-h-screen bg-gray-950 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="glass-dark rounded-3xl p-8 md:p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mb-4"></div>
            <p className="text-white/70">{shouldRedirect ? 'Redirecting to complete your profile...' : 'Loading your profile...'}</p>
          </div>
        </div>
      </main>
    )
  }

  if (error && !profile) {
    return (
      <main className="min-h-screen bg-gray-950 py-12 px-4">
        <div className="max-w-6xl mx-auto">
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

  // Don't render if redirecting or if profile is campaign_only
  if (shouldRedirect) return null
  if (!profile) return null
  if (profile.profile_visibility?.toLowerCase()?.trim() === 'campaign_only' || 
      profile.profile_visibility?.toLowerCase()?.trim() === 'campaign only') {
    // Force redirect if somehow we got here
    window.location.href = '/signup'
    return null
  }

  return (
    <main className="min-h-screen bg-gray-950 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h1 className="text-4xl md:text-5xl font-black">My Profile</h1>
            <div className="flex items-center gap-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 rounded-xl font-bold transition-all"
                >
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCancel}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-bold transition-all"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-xl font-bold transition-all disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-bold transition-all"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Profile Card */}
        <div className="glass-dark rounded-3xl p-8 md:p-12 space-y-8 mb-12">
          {/* Personal Information */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-white/50 mb-1 block">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.full_name || ''}
                    onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                ) : (
                  <p className="text-lg font-bold">{profile.full_name}</p>
                )}
              </div>
              <div>
                <label className="text-sm text-white/50 mb-1 block">Email</label>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-white/50" />
                  <p className="text-lg">{profile.email}</p>
                </div>
                <p className="text-xs text-white/50 mt-1">Email cannot be changed</p>
              </div>
              <div>
                <label className="text-sm text-white/50 mb-1 block">Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editForm.phone || ''}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-white/50" />
                    <p className="text-lg">{profile.phone || 'Not provided'}</p>
                  </div>
                )}
              </div>
              <div>
                <label className="text-sm text-white/50 mb-1 block">Location</label>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-white/50" />
                  <p className="text-lg">{profile.location}</p>
                </div>
                <p className="text-xs text-white/50 mt-1">Location cannot be changed</p>
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
                <p className="text-xs text-white/50 mt-1">Role cannot be changed</p>
              </div>
              <div>
                <label className="text-sm text-white/50 mb-1 block">Experience</label>
                <p className="text-lg">{profile.experience}</p>
                <p className="text-xs text-white/50 mt-1">Experience cannot be changed</p>
              </div>
              <div>
                <label className="text-sm text-white/50 mb-1 block">Current Company</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.current_company || ''}
                    onChange={(e) => setEditForm({ ...editForm, current_company: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                ) : (
                  <p className="text-lg">{profile.current_company || 'Not provided'}</p>
                )}
              </div>
              <div>
                <label className="text-sm text-white/50 mb-1 block">Expected Salary</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.expected_salary || ''}
                    onChange={(e) => setEditForm({ ...editForm, expected_salary: e.target.value })}
                    placeholder="e.g., €50k-€70k"
                    className="w-full px-4 py-3 bg-gray-900 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                ) : (
                  <p className="text-lg">{profile.expected_salary || 'Not provided'}</p>
                )}
              </div>
              {profile.employment_status && (
                <div>
                  <label className="text-sm text-white/50 mb-1 block">Employment Status</label>
                  <p className="text-lg">{profile.employment_status}</p>
                </div>
              )}
              <div>
                <label className="text-sm text-white/50 mb-1 block">LinkedIn Profile</label>
                {isEditing ? (
                  <input
                    type="url"
                    value={editForm.linkedin_url || ''}
                    onChange={(e) => setEditForm({ ...editForm, linkedin_url: e.target.value })}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="w-full px-4 py-3 bg-gray-900 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                ) : profile.linkedin_url ? (
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
                ) : (
                  <p className="text-lg text-white/50">Not provided</p>
                )}
              </div>
            </div>
          </section>

          {/* Work Preferences */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Work Preferences</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-white/50 mb-1 block">Work Hours</label>
                <p className="text-lg">{profile.work_hours}</p>
                <p className="text-xs text-white/50 mt-1">Work hours cannot be changed</p>
              </div>
              <div>
                <label className="text-sm text-white/50 mb-1 block">Work Environment</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.work_environment || ''}
                    onChange={(e) => setEditForm({ ...editForm, work_environment: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                ) : (
                  <p className="text-lg">{profile.work_environment || 'Not provided'}</p>
                )}
              </div>
              <div>
                <label className="text-sm text-white/50 mb-1 block">Remote Retreats</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.remote_retreats || ''}
                    onChange={(e) => setEditForm({ ...editForm, remote_retreats: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                ) : (
                  <p className="text-lg">{profile.remote_retreats || 'Not provided'}</p>
                )}
              </div>
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

        {/* Campaign Stats Section */}
        {stats && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="glass-dark rounded-2xl p-6">
                <Users className="w-8 h-8 text-purple-400 mb-3" />
                <div className="text-3xl font-black mb-1">
                  {stats.totalProfessionals.toLocaleString()}
                </div>
                <div className="text-white/70 font-bold">Total Professionals</div>
              </div>

              <div className="glass-dark rounded-2xl p-6">
                <MapPin className="w-8 h-8 text-fuchsia-400 mb-3" />
                <div className="text-3xl font-black mb-1">{stats.citiesCovered}</div>
                <div className="text-white/70 font-bold">Cities Covered</div>
              </div>

              <div className="glass-dark rounded-2xl p-6">
                <Briefcase className="w-8 h-8 text-violet-400 mb-3" />
                <div className="text-3xl font-black mb-1">
                  {stats.visibleProfiles + stats.emailSubscribers}
                </div>
                <div className="text-white/70 font-bold">Network Members</div>
              </div>
            </div>

            {/* Ireland Map Visualization */}
            <div className="glass-dark rounded-3xl p-8 md:p-12">
              <h2 className="text-3xl font-black mb-6 text-center">
                Talent Distribution Across Ireland
              </h2>
              <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 min-h-[600px] overflow-hidden">
                <div className="[&_svg_rect]:hidden [&_svg_polygon]:hidden [&_svg_circle]:not([class*='pin']):hidden">
                  <IrelandMap 
                    countyStats={stats.countyStats} 
                    userCounty={profile.county}
                    locationPins={stats.locationPins}
                  />
                </div>

                {/* Legend */}
                <div className="mt-6 flex flex-wrap gap-4 justify-center text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500" />
                    <span className="text-white/70">Counties with talent</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-600 border border-white/50" />
                    <span className="text-white/70">Professional locations (anonymous)</span>
                  </div>
                  {profile.county && (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-fuchsia-500" />
                      <span className="text-white/70">Your county</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  )
}

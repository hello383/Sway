'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { MapPin, Users, Briefcase, ArrowRight, LogOut } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import IrelandMap from '@/components/IrelandMap'

interface LocationPin {
  town: string
  county: string
  count: number
}

interface Stats {
  totalProfessionals: number
  visibleProfiles: number
  emailSubscribers: number
  citiesCovered: number
  locationStats: Record<string, number>
  countyStats?: Record<string, number>
  locationPins?: LocationPin[]
}


function SuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const visibility = searchParams.get('visibility')
  const profileId = searchParams.get('id')

  const [stats, setStats] = useState<Stats | null>(null)
  const [userCounty, setUserCounty] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is logged in - if so, redirect to profile page
    const checkAndRedirect = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user?.email) {
          // User is logged in - check if they have a profile
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('id')
            .eq('email', session.user.email.toLowerCase())
            .maybeSingle()

          if (profile && profile.id) {
            // User has a profile - redirect to profile page
            router.push('/profile')
            return
          }
        }
      } catch (error) {
        console.error('Error checking session:', error)
      }
    }

    checkAndRedirect()
  }, [router])

  useEffect(() => {
    // Fetch stats
    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats(data.data)
        }
      })
      .catch(console.error)

    // Fetch user county if profile ID is available
    if (profileId) {
      fetch(`/api/profiles/${profileId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setUserCounty(data.data.county || data.data.location)
          }
        })
        .catch(console.error)
    }
  }, [profileId])

  const getMessage = () => {
    if (visibility === 'campaign_only') {
      return {
        title: 'Thank You for Joining the Campaign!',
        description:
          'Your support helps us advocate for remote work policies in Ireland. Together we\'re building a stronger remote workforce.',
      }
    } else if (visibility === 'visible') {
      return {
        title: 'Your Profile is Now Live!',
        description:
          'Employers can now discover your profile and reach out about remote opportunities. Make sure your profile stands out!',
      }
    } else {
      return {
        title: 'You\'re All Set!',
        description:
          'You\'ll receive email notifications about remote job opportunities that match your preferences. Check your inbox for updates!',
      }
    }
  }

  const message = getMessage()

  return (
    <main className="min-h-screen bg-gray-950 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="inline-block p-4 rounded-full bg-green-500/20 mb-6">
            <svg
              className="w-16 h-16 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-4">{message.title}</h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">{message.description}</p>
        </div>

        {/* Stats Cards */}
        {stats && (
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
        )}

        {/* Ireland Map Visualization */}
        {stats && (
          <div className="glass-dark rounded-3xl p-8 md:p-12 mb-12">
            <h2 className="text-3xl font-black mb-6 text-center">
              Talent Distribution Across Ireland
            </h2>
            <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 min-h-[600px] overflow-hidden">
              <div className="[&_svg_rect]:hidden [&_svg_polygon]:hidden [&_svg_circle]:not([class*='pin']):hidden">
                <IrelandMap 
                  countyStats={stats.countyStats} 
                  userCounty={userCounty}
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
                {userCounty && (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-fuchsia-500" />
                    <span className="text-white/70">Your county</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="text-center">
          <div className="flex gap-4 justify-center flex-wrap">
            {visibility !== 'campaign_only' && (
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-bold transition-all"
              >
                Sign In to Your Profile
              </Link>
            )}
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 px-8 py-4 gradient-primary rounded-2xl font-bold text-lg hover:scale-105 transition-transform"
            >
              Browse Remote Jobs
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button
              onClick={async () => {
                await supabase.auth.signOut()
                router.push('/')
                router.refresh()
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl font-bold transition-all"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function Success() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gray-950 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="glass-dark rounded-3xl p-8 md:p-12 text-center">
            <p className="text-white/70">Loading...</p>
          </div>
        </div>
      </main>
    }>
      <SuccessContent />
    </Suspense>
  )
}

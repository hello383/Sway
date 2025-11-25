'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { MapPin, Users, Briefcase, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface Stats {
  totalProfessionals: number
  visibleProfiles: number
  emailSubscribers: number
  citiesCovered: number
  locationStats: Record<string, number>
  countyStats?: Record<string, number>
}

// Simplified Ireland map coordinates for counties (approximate centers)
const COUNTY_COORDINATES: Record<string, { x: number; y: number }> = {
  Antrim: { x: 65, y: 15 },
  Armagh: { x: 60, y: 20 },
  Carlow: { x: 50, y: 60 },
  Cavan: { x: 45, y: 30 },
  Clare: { x: 25, y: 55 },
  Cork: { x: 30, y: 75 },
  Derry: { x: 55, y: 10 },
  Donegal: { x: 40, y: 10 },
  Down: { x: 70, y: 20 },
  Dublin: { x: 55, y: 35 },
  Fermanagh: { x: 50, y: 20 },
  Galway: { x: 20, y: 40 },
  Kerry: { x: 25, y: 70 },
  Kildare: { x: 50, y: 40 },
  Kilkenny: { x: 45, y: 60 },
  Laois: { x: 45, y: 50 },
  Leitrim: { x: 35, y: 30 },
  Limerick: { x: 30, y: 60 },
  Longford: { x: 40, y: 40 },
  Louth: { x: 60, y: 30 },
  Mayo: { x: 15, y: 30 },
  Meath: { x: 55, y: 35 },
  Monaghan: { x: 55, y: 25 },
  Offaly: { x: 42, y: 48 },
  Roscommon: { x: 30, y: 38 },
  Sligo: { x: 25, y: 25 },
  Tipperary: { x: 35, y: 58 },
  Tyrone: { x: 58, y: 18 },
  Waterford: { x: 40, y: 70 },
  Westmeath: { x: 42, y: 42 },
  Wexford: { x: 50, y: 70 },
  Wicklow: { x: 55, y: 45 },
}

export default function Success() {
  const searchParams = useSearchParams()
  const visibility = searchParams.get('visibility')
  const profileId = searchParams.get('id')

  const [stats, setStats] = useState<Stats | null>(null)
  const [userCounty, setUserCounty] = useState<string | null>(null)

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
    if (visibility === 'visible') {
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
            <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 min-h-[400px]">
              {/* Simplified Ireland Map SVG */}
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Simplified Ireland outline */}
                <path
                  d="M 10 20 L 20 15 L 30 18 L 40 20 L 50 25 L 60 30 L 70 35 L 75 40 L 80 50 L 75 60 L 70 70 L 65 75 L 60 80 L 50 85 L 40 82 L 30 80 L 20 75 L 15 70 L 12 60 L 10 50 L 8 40 L 10 30 Z"
                  fill="rgba(255,255,255,0.05)"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="0.5"
                />

                {/* County dots - use countyStats if available, otherwise fall back to locationStats */}
                {Object.entries(COUNTY_COORDINATES).map(([county, coords]) => {
                  const count = stats.countyStats?.[county] || 
                               Object.entries(stats.locationStats || {}).reduce((sum, [loc, cnt]) => {
                                 return sum + (loc.includes(county) ? cnt : 0)
                               }, 0)
                  const size = Math.max(2, Math.min(10, Math.sqrt(count) * 1.5))
                  const isUserCounty = userCounty === county

                  return (
                    <g key={county}>
                      <circle
                        cx={coords.x}
                        cy={coords.y}
                        r={size}
                        fill={isUserCounty ? '#d946ef' : count > 0 ? '#9333ea' : 'rgba(147, 51, 234, 0.3)'}
                        opacity={isUserCounty ? 1 : count > 0 ? 0.8 : 0.4}
                        className="hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <title>{`${county}: ${count} professional${count !== 1 ? 's' : ''}`}</title>
                      </circle>
                      {count > 0 && (
                        <text
                          x={coords.x}
                          y={coords.y + size + 2.5}
                          fontSize="2.5"
                          fill="rgba(255,255,255,0.9)"
                          textAnchor="middle"
                          className="pointer-events-none font-bold"
                        >
                          {county.substring(0, 4)}
                        </text>
                      )}
                    </g>
                  )
                })}
              </svg>

              {/* Legend */}
              <div className="mt-6 flex flex-wrap gap-4 justify-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500" />
                  <span className="text-white/70">Counties with talent</span>
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
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 px-8 py-4 gradient-primary rounded-2xl font-bold text-lg hover:scale-105 transition-transform"
          >
            Browse Remote Jobs
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </main>
  )
}


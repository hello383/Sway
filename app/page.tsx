'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, Users, MapPin, Briefcase, Zap } from 'lucide-react'
import Link from 'next/link'

interface Stats {
  totalProfessionals: number
  citiesCovered: number
  totalJobs: number
}

export default function Home() {
  const TARGET = 1500
  const [stats, setStats] = useState<Stats>({
    totalProfessionals: 0,
    citiesCovered: 0,
    totalJobs: 0,
  })
  const [activeTab, setActiveTab] = useState<'you' | 'movement'>('you')

  useEffect(() => {
    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats({
            totalProfessionals: data.data.totalProfessionals,
            citiesCovered: data.data.citiesCovered,
            totalJobs: data.data.totalJobs,
          })
        }
      })
      .catch(console.error)
  }, [])

  const progressPercent = Math.min(
    Math.round((stats.totalProfessionals / TARGET) * 100) || 0,
    100
  )

  const forYouFeatures = [
    {
      title: 'Direct Matching',
      description: 'Employers browse and contact aligned talent immediately.',
    },
    {
      title: 'Signal Your Preferences',
      description: 'Work hours, environment and communication style up front.',
    },
    {
      title: 'Stay Private or Visible',
      description: 'Choose public profiles or email-only notifications.',
    },
  ]

  const movementFeatures = [
    {
      title: 'Data for Government',
      description: 'Policy-ready dataset proving remote talent demand nationwide.',
    },
    {
      title: 'Regional Targets',
      description: 'County-level heat maps showing where infrastructure is needed.',
    },
    {
      title: 'Employer Accountability',
      description: 'Track companies supporting remote-first policies.',
    },
  ]

  return (
    <main className="min-h-screen bg-black text-white font-mono">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-3xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <span className="text-xl font-black tracking-tight">Sway</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="font-bold tabular-nums">
                {stats.totalProfessionals.toLocaleString()}
              </span>
              <span className="text-white/50 text-sm">/ {TARGET.toLocaleString()}</span>
            </div>
            <Link
              href="/login"
              className="px-6 py-2 text-white/80 hover:text-white font-bold text-sm transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-6 py-2 bg-white text-black rounded-full font-bold text-sm hover:scale-105 transition-transform"
            >
              Join Now
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-purple-600/30 rounded-full blur-[150px] animate-pulse" />
          <div
            className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-fuchsia-600/30 rounded-full blur-[150px] animate-pulse"
            style={{ animationDelay: '1s' }}
          />
        </div>
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="mb-12">
            <h1 className="text-7xl md:text-8xl font-black leading-[0.9] mb-4">
              Data for
              <br />
              change.
            </h1>
            <h2 className="text-7xl md:text-8xl font-black leading-[0.9] text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400">
              Jobs for you.
            </h2>
          </div>
          <Link
            href="/signup"
            className="group inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 px-12 py-5 rounded-full font-bold text-lg hover:scale-105 transition-all shadow-2xl hover:shadow-purple-500/50 mb-16"
          >
            Join Sway
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-center">
            <div>
              <div className="text-4xl font-black mb-1 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400">
                {stats.totalProfessionals.toLocaleString()}
              </div>
              <div className="text-xs text-white/50 uppercase tracking-widest">Signed Up</div>
            </div>
            <div className="hidden md:block w-px h-12 bg-white/20" />
            <div>
              <div className="text-4xl font-black mb-1">{TARGET.toLocaleString()}</div>
              <div className="text-xs text-white/50 uppercase tracking-widest">Target</div>
            </div>
            <div className="hidden md:block w-px h-12 bg-white/20" />
            <div>
              <div className="text-4xl font-black mb-1">{progressPercent}%</div>
              <div className="text-xs text-white/50 uppercase tracking-widest">Progress</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pill Toggle Section */}
      <section className="relative border-y border-white/10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 mb-12">
            {['you', 'movement'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as 'you' | 'movement')}
                className={`flex-1 px-10 py-4 rounded-full font-bold text-xl transition-all border-2 ${
                  activeTab === tab
                    ? 'bg-white text-black border-white'
                    : 'bg-transparent text-white/60 border-white/20 hover:text-white/80 hover:border-white/30'
                }`}
              >
                {tab === 'you' ? 'For You' : 'The Movement'}
              </button>
            ))}
          </div>

          <div className="min-h-[350px]">
            {activeTab === 'you' ? (
              <>
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <Briefcase className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black mb-1">For You</h3>
                    <p className="text-sm text-white/50">Immediate value</p>
                  </div>
                </div>
                <p className="text-lg text-white/70 mb-10 leading-relaxed">
                  Companies browse profiles. They reach out. You interview. You get hired.
                </p>
                <div className="grid md:grid-cols-3 gap-6">
                  {forYouFeatures.map((feature) => (
                    <div key={feature.title} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                      <h4 className="font-bold mb-2">{feature.title}</h4>
                      <p className="text-white/60 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-fuchsia-500 to-pink-500 rounded-2xl flex items-center justify-center">
                    <MapPin className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black mb-1">The Movement</h3>
                    <p className="text-sm text-white/50">Systems change</p>
                  </div>
                </div>
                <p className="text-lg text-white/70 mb-10 leading-relaxed">
                  Every profile proves demand for remote-first infrastructure across Ireland.
                </p>
                <div className="grid md:grid-cols-3 gap-6">
                  {movementFeatures.map((feature) => (
                    <div key={feature.title} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                      <h4 className="font-bold mb-2">{feature.title}</h4>
                      <p className="text-white/60 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Track the Movement */}
      <section className="relative py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-green-500/20 border border-green-500/30 rounded-full mb-6">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="font-bold text-xs uppercase tracking-widest">Live Campaign</span>
            </div>
            <h2 className="text-5xl font-black mb-3">Track the Movement</h2>
            <p className="text-base text-white/60 max-w-2xl mx-auto">
              Real-time progress toward government targets and policy change.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-10 mb-10">
            <div className="text-center">
              <div className="mb-6">
                <div className="text-7xl font-black tabular-nums mb-1">
                  {stats.totalProfessionals.toLocaleString()}
                </div>
                <div className="text-sm text-white/50">people signed up</div>
              </div>
              <div className="max-w-3xl mx-auto mb-6">
                <div className="relative h-4 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 transition-all duration-700 relative"
                    style={{ width: `${progressPercent}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  </div>
                </div>
                <div className="flex justify-between mt-2 text-xs text-white/50">
                  <span>0</span>
                  <span className="font-bold text-white/60">Target: {TARGET.toLocaleString()}</span>
                </div>
              </div>
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400 mb-2">
                {progressPercent}%
              </div>
              <p className="text-sm text-white/50">At {TARGET.toLocaleString()}: Dataset → Government → Database Opens</p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-black text-center mb-6">What We&apos;re Tracking</h3>
            <div className="grid md:grid-cols-3 gap-5">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black">
                      {stats.totalProfessionals.toLocaleString()}
                    </div>
                  </div>
                </div>
                <h4 className="font-bold mb-1.5">Platform Signups</h4>
                <p className="text-white/50 text-xs leading-relaxed">Proving demand for infrastructure.</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 bg-fuchsia-500/20 rounded-xl flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-fuchsia-400" />
                  </div>
                  <div className="text-3xl font-black">{stats.citiesCovered}</div>
                </div>
                <h4 className="font-bold mb-1.5">Counties Active</h4>
                <p className="text-white/50 text-xs leading-relaxed">Showing remote-ready towns nationwide.</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 bg-pink-500/20 rounded-xl flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-pink-400" />
                  </div>
                  <div className="text-3xl font-black">{stats.totalJobs.toLocaleString()}</div>
                </div>
                <h4 className="font-bold mb-1.5">Opportunities Logged</h4>
                <p className="text-white/50 text-xs leading-relaxed">Tracking which roles come fully remote.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}


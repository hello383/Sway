'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const IRISH_COUNTIES = [
  'Carlow', 'Cavan', 'Clare', 'Cork', 'Donegal', 'Dublin', 'Galway', 'Kerry',
  'Kildare', 'Kilkenny', 'Laois', 'Leitrim', 'Limerick', 'Longford', 'Louth',
  'Mayo', 'Meath', 'Monaghan', 'Offaly', 'Roscommon', 'Sligo', 'Tipperary',
  'Waterford', 'Westmeath', 'Wexford', 'Wicklow'
]

const SECTORS = [
  'Technology / IT',
  'Finance / Accounting',
  'Marketing / Communications',
  'Sales / Business Development',
  'Design / Creative',
  'HR / People Operations',
  'Legal',
  'Healthcare',
  'Education / Training',
  'Consulting / Professional Services',
  'Admin / Operations',
  'Customer Service / Support',
  'Engineering',
  'Other'
]

const TESTIMONIALS_ROW_1 = [
  {
    text: "Remote work let me move back to Donegal and still work for a tech company in London. My commute is now a walk on the beach.",
    initial: "D",
    role: "Design / Creative • Donegal"
  },
  {
    text: "We hired 12 people across 8 counties last year. The talent is everywhere—you just need to know where to look.",
    initial: "D",
    role: "CEO • Dublin"
  },
  {
    text: "After 15 years commuting to Dublin, I now work from my home office in Westport. I've gained back 3 hours every day.",
    initial: "M",
    role: "Technology / IT • Mayo"
  },
  {
    text: "Remote employment is the biggest opportunity for rural Ireland since the IDA. We need to treat it with the same strategic focus.",
    initial: "K",
    role: "Consulting / Professional Services • Kerry"
  },
  {
    text: "I was ready to emigrate. Then I found a fully remote role that let me stay in Galway. Best decision I never had to make.",
    initial: "G",
    role: "Marketing / Communications • Galway"
  }
]

const TESTIMONIALS_ROW_2 = [
  {
    text: "The housing crisis pushed us out of Dublin. Remote work meant we could buy a house in Sligo and keep our careers.",
    initial: "S",
    role: "Technology / IT • Sligo"
  },
  {
    text: "Our local hub went from empty to full in 18 months. Remote workers are revitalizing our main street.",
    initial: "T",
    role: "Admin / Operations • Tipperary"
  },
  {
    text: "As a carer, office-based work was impossible. Remote work gave me a career without sacrificing family responsibilities.",
    initial: "C",
    role: "Customer Service / Support • Cork"
  },
  {
    text: "100,000 remote jobs available monthly in Europe. Ireland should be competing for these like we compete for FDI.",
    initial: "G",
    role: "Founder • Galway"
  },
  {
    text: "My team is spread across 4 time zones. We're more productive than any office-based team I've ever managed.",
    initial: "L",
    role: "VP Engineering • Limerick"
  }
]

export default function Home() {
  const router = useRouter()
  const TARGET = 1500
  const [stats, setStats] = useState({ totalProfessionals: 0 })
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    county: '',
    sector: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [subscribeToMailer, setSubscribeToMailer] = useState(true)

  useEffect(() => {
    // Fetch stats
    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats({ totalProfessionals: data.data.totalProfessionals || 0 })
        }
      })
      .catch(console.error)

    // Check if user is logged in
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setIsLoggedIn(!!session)
    }
    checkSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Stats Calculator
  useEffect(() => {
    const slider = document.getElementById('targetSlider') as HTMLInputElement
    const percentDisplay = document.getElementById('percentDisplay')
    const jobsValue = document.getElementById('jobsValue')
    const taxValue = document.getElementById('taxValue')
    const gdpValue = document.getElementById('gdpValue')

    if (!slider || !percentDisplay || !jobsValue || !taxValue || !gdpValue) return

    const formatCurrency = (num: number) => {
      if (num >= 1000000000) return '€' + (num / 1000000000).toFixed(1) + 'B'
      if (num >= 1000000) return '€' + Math.round(num / 1000000) + 'M'
      return '€' + Math.round(num / 1000) + 'K'
    }

    const updateStats = () => {
      const percent = parseInt(slider.value)
      const jobs = Math.round((percent / 100) * 100000)
      const tax = jobs * 10800
      const gdp = jobs * 20000

      if (percentDisplay) {
        percentDisplay.textContent = percent + '%'
      }
      if (jobsValue) {
        jobsValue.textContent = jobs >= 10000 ? Math.round(jobs / 1000) + 'k' : (jobs / 1000).toFixed(1) + 'k'
      }
      if (taxValue) {
        taxValue.textContent = formatCurrency(tax)
      }
      if (gdpValue) {
        gdpValue.textContent = formatCurrency(gdp)
      }
    }

    slider.addEventListener('input', updateStats)
    updateStats() // Initial calculation

    return () => {
      slider.removeEventListener('input', updateStats)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    setSubmitting(true)

    try {
      const response = await fetch('/api/campaign-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        setShowSuccessModal(true)
        // Refresh stats
        fetch('/api/stats')
          .then((res) => res.json())
          .then((statsData) => {
            if (statsData.success) {
              setStats({ totalProfessionals: statsData.data.totalProfessionals || 0 })
            }
          })
          .catch(console.error)
        // Reset form
        setFormData({ name: '', email: '', county: '', sector: '' })
      } else {
        setFormError(data.error || 'Something went wrong')
      }
    } catch (error: any) {
      setFormError(error.message || 'Failed to submit. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const closeModal = () => {
    setShowSuccessModal(false)
  }

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
    }
    if (showSuccessModal) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [showSuccessModal])

  return (
    <>
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#09090b]/90 backdrop-blur-xl border-b border-[#27272a]">
        <div className="max-w-[1100px] mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 font-semibold text-lg">
            <div className="w-8 h-8 bg-gradient-to-br from-[#7c3aed] to-[#d946ef] rounded-lg"></div>
            <span>Sway</span>
          </Link>
          <div className="flex items-center gap-5">
            <span className="text-[13px] text-[#a1a1aa]">
              <strong className="text-[#d946ef]">{stats.totalProfessionals.toLocaleString()}</strong> of {TARGET.toLocaleString()} signed up
              </span>
            {isLoggedIn ? (
              <button
                onClick={async () => {
                  await supabase.auth.signOut()
                  router.push('/')
                  router.refresh()
                }}
                className="px-5 py-2.5 text-[#a1a1aa] hover:text-[#fafafa] text-sm font-medium transition-colors"
              >
                Sign Out
              </button>
            ) : (
            <Link
              href="/signup"
                className="px-5 py-2.5 bg-[#fafafa] text-[#09090b] rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
            >
                Join now
            </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-[140px] pb-20 text-center">
        <div className="max-w-[1100px] mx-auto px-6">
          <h1 className="text-[clamp(36px,6vw,56px)] font-bold leading-[1.15] mb-6 tracking-[-0.02em]">
            Data for change.<br />Jobs for you.
          </h1>
          <p className="text-lg text-[#a1a1aa] max-w-[560px] mx-auto mb-10">
            Sign up to the campaign for Ireland to set a national target for remote jobs, and get discovered by employers.
          </p>

          <form onSubmit={handleSubmit} className="max-w-[500px] mx-auto mb-4">
            <div className="grid grid-cols-2 gap-3 mb-3 max-[500px]:grid-cols-1">
              <input
                type="text"
                placeholder="Your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-[18px] py-3.5 bg-[#18181b] border border-[#27272a] rounded-lg text-[15px] text-[#fafafa] outline-none transition-colors focus:border-[#7c3aed] placeholder:text-[#a1a1aa]"
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-[18px] py-3.5 bg-[#18181b] border border-[#27272a] rounded-lg text-[15px] text-[#fafafa] outline-none transition-colors focus:border-[#7c3aed] placeholder:text-[#a1a1aa]"
              />
              <select
                value={formData.county}
                onChange={(e) => setFormData({ ...formData, county: e.target.value })}
                required
                className="w-full px-[18px] py-3.5 pr-10 bg-[#18181b] border border-[#27272a] rounded-lg text-[15px] text-[#fafafa] outline-none transition-colors focus:border-[#7c3aed] appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' fill=\'%23a1a1aa\' viewBox=\'0 0 16 16\'%3E%3Cpath d=\'M8 11L3 6h10l-5 5z\'/%3E%3C/svg%3E')] bg-no-repeat bg-[right_14px_center]"
              >
                <option value="" disabled>County</option>
                {IRISH_COUNTIES.map((county) => (
                  <option key={county} value={county.toLowerCase()}>{county}</option>
                ))}
              </select>
              <select
                value={formData.sector}
                onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                required
                className="w-full px-[18px] py-3.5 pr-10 bg-[#18181b] border border-[#27272a] rounded-lg text-[15px] text-[#fafafa] outline-none transition-colors focus:border-[#7c3aed] appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' fill=\'%23a1a1aa\' viewBox=\'0 0 16 16\'%3E%3Cpath d=\'M8 11L3 6h10l-5 5z\'/%3E%3C/svg%3E')] bg-no-repeat bg-[right_14px_center]"
              >
                <option value="" disabled>Sector</option>
                {SECTORS.map((sector) => (
                  <option key={sector} value={sector}>{sector}</option>
                ))}
              </select>
            </div>
            {formError && (
              <p className="text-sm text-red-400 mb-3 text-left">{formError}</p>
            )}
            <label className="flex items-center gap-2.5 text-[13px] text-[#a1a1aa] cursor-pointer mb-3">
              <input
                type="checkbox"
                checked={subscribeToMailer}
                onChange={(e) => setSubscribeToMailer(e.target.checked)}
                className="w-4 h-4 accent-[#7c3aed] cursor-pointer"
              />
              Subscribe to campaign updates
            </label>
            <button
              type="submit"
              disabled={submitting}
              className="w-full px-5 py-2.5 bg-gradient-to-br from-[#7c3aed] to-[#9333ea] text-white rounded-md text-sm font-medium hover:shadow-[0_8px_24px_rgba(124,58,237,0.3)] transition-all disabled:opacity-50"
            >
              {submitting ? 'Joining...' : 'Join the campaign'}
            </button>
          </form>
        </div>
      </section>

      {/* Scrolling Testimonials */}
      <section className="py-12 border-t border-b border-[#27272a] overflow-hidden">
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-[120px] bg-gradient-to-r from-[#09090b] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-[120px] bg-gradient-to-l from-[#09090b] to-transparent z-10 pointer-events-none"></div>
          
          {/* Row 1 */}
          <div className="flex gap-6 w-max animate-scroll hover:[animation-play-state:paused]">
            {[...TESTIMONIALS_ROW_1, ...TESTIMONIALS_ROW_1].map((testimonial, idx) => (
              <div key={`row1-${idx}`} className="flex-shrink-0 w-[340px] p-6 bg-[#18181b] border border-[#27272a] rounded-xl transition-all hover:border-[#7c3aed] hover:-translate-y-0.5">
                <p className="text-sm leading-[1.7] text-[#fafafa] mb-4">{testimonial.text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#d946ef] flex items-center justify-center font-semibold text-xs text-white">
                    {testimonial.initial}
                  </div>
                  <div className="text-[11px] text-[#a1a1aa]">{testimonial.role}</div>
                </div>
                    </div>
                  ))}
                </div>

          {/* Row 2 - Reverse */}
          <div className="flex gap-6 w-max mt-6 animate-scroll-reverse hover:[animation-play-state:paused]">
            {[...TESTIMONIALS_ROW_2, ...TESTIMONIALS_ROW_2].map((testimonial, idx) => (
              <div key={`row2-${idx}`} className="flex-shrink-0 w-[340px] p-6 bg-[#18181b] border border-[#27272a] rounded-xl transition-all hover:border-[#7c3aed] hover:-translate-y-0.5">
                <p className="text-sm leading-[1.7] text-[#fafafa] mb-4">{testimonial.text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#d946ef] flex items-center justify-center font-semibold text-xs text-white">
                    {testimonial.initial}
                  </div>
                  <div className="text-[11px] text-[#a1a1aa]">{testimonial.role}</div>
                </div>
                    </div>
                  ))}
          </div>
        </div>
      </section>

      {/* Stats Calculator */}
      <section className="py-20 border-b border-[#27272a]">
        <div className="max-w-[1100px] mx-auto px-6">
          {/* Slider */}
          <div className="max-w-[600px] mx-auto mb-12 text-center">
            <label className="block text-[22px] font-semibold mb-6 text-[#fafafa]">
              What if Ireland captured <span className="bg-gradient-to-br from-[#7c3aed] to-[#d946ef] bg-clip-text text-transparent text-[28px] font-bold" id="percentDisplay">1%</span> of remote jobs?
            </label>
            <input
              type="range"
              id="targetSlider"
              min="1"
              max="15"
              defaultValue="1"
              className="w-full h-2 rounded-md bg-[#18181b] outline-none appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-[#7c3aed] [&::-webkit-slider-thumb]:to-[#d946ef] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_4px_12px_rgba(124,58,237,0.4)] [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110 [&::-moz-range-thumb]:w-7 [&::-moz-range-thumb]:h-7 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:bg-gradient-to-br [&::-moz-range-thumb]:from-[#7c3aed] [&::-moz-range-thumb]:to-[#d946ef] [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-[0_4px_12px_rgba(124,58,237,0.4)]"
            />
            <div className="flex justify-between mt-3 text-[13px] text-[#a1a1aa]">
              <span>1%</span>
              <span>5%</span>
              <span>10%</span>
              <span>15%</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-8 text-center md:grid-cols-2">
            <div>
              <div className="text-4xl font-bold mb-1 bg-gradient-to-br from-[#7c3aed] to-[#d946ef] bg-clip-text text-transparent transition-all duration-300" id="jobsValue">1k</div>
              <div className="text-[13px] text-[#a1a1aa]">Remote jobs for Ireland</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-1 bg-gradient-to-br from-[#7c3aed] to-[#d946ef] bg-clip-text text-transparent transition-all duration-300" id="taxValue">€10.8M</div>
              <div className="text-[13px] text-[#a1a1aa]">Annual tax revenue</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-1 bg-gradient-to-br from-[#7c3aed] to-[#d946ef] bg-clip-text text-transparent transition-all duration-300" id="gdpValue">€20M</div>
              <div className="text-[13px] text-[#a1a1aa]">GDP contribution</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-1 bg-gradient-to-br from-[#7c3aed] to-[#d946ef] bg-clip-text text-transparent">80%</div>
              <div className="text-[13px] text-[#a1a1aa]">Gain extra time locally</div>
            </div>
          </div>

          <p className="text-center text-xs text-[#a1a1aa] mt-8">
            Based on 100,000+ remote jobs advertised monthly across Europe
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 border-b border-[#27272a]">
        <div className="max-w-[1100px] mx-auto px-6">
          <h2 className="text-[28px] font-bold text-center mb-14">How it works</h2>
          <div className="grid grid-cols-3 gap-12 md:grid-cols-1 md:gap-10">
            <div className="text-center">
              <div className="w-[72px] h-[72px] mx-auto mb-5 bg-gradient-to-br from-[#7c3aed] to-[#9333ea] rounded-2xl flex items-center justify-center text-[28px] font-bold text-white">1</div>
              <h3 className="text-lg font-semibold mb-2">Join the campaign</h3>
              <p className="text-sm text-[#a1a1aa] leading-[1.7]">Add your name to the campaign. Show Ireland there's demand for remote work in every county.</p>
                </div>
            <div className="text-center">
              <div className="w-[72px] h-[72px] mx-auto mb-5 bg-gradient-to-br from-[#7c3aed] to-[#9333ea] rounded-2xl flex items-center justify-center text-[28px] font-bold text-white">2</div>
              <h3 className="text-lg font-semibold mb-2">Share the link</h3>
              <p className="text-sm text-[#a1a1aa] leading-[1.7]">Support the campaign by spreading the word. Every signup strengthens the case for national action.</p>
              </div>
            <div className="text-center">
              <div className="w-[72px] h-[72px] mx-auto mb-5 bg-gradient-to-br from-[#7c3aed] to-[#9333ea] rounded-2xl flex items-center justify-center text-[28px] font-bold text-white">3</div>
              <h3 className="text-lg font-semibold mb-2">Join the database</h3>
              <p className="text-sm text-[#a1a1aa] leading-[1.7]">Sign up to become visible to remote employers actively hiring in Ireland.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Two purposes */}
      <section className="grid grid-cols-2 border-b border-[#27272a] md:grid-cols-1">
        <div className="p-20 md:p-16 border-r border-[#27272a] md:border-r-0 md:border-b">
          <div className="text-xs uppercase tracking-wider text-[#d946ef] mb-4">For Ireland</div>
          <h3 className="text-2xl font-semibold mb-4">Build the evidence</h3>
          <p className="text-[15px] text-[#a1a1aa] leading-[1.7] mb-6">Every signup adds to the data. We're proving that demand exists—in every county—and building the case for a national remote employment target.</p>
          <ul className="list-none space-y-2.5">
            <li className="flex items-start gap-2.5 text-sm text-[#a1a1aa]">
              <span className="text-[#7c3aed]">→</span>
              <span>Demonstrate geographic distribution of talent</span>
            </li>
            <li className="flex items-start gap-2.5 text-sm text-[#a1a1aa]">
              <span className="text-[#7c3aed]">→</span>
              <span>Show skills and salary data to policymakers</span>
            </li>
            <li className="flex items-start gap-2.5 text-sm text-[#a1a1aa]">
              <span className="text-[#7c3aed]">→</span>
              <span>Support the push for national investment</span>
            </li>
          </ul>
        </div>
        <div className="p-20 md:p-16">
          <div className="text-xs uppercase tracking-wider text-[#d946ef] mb-4">For you</div>
          <h3 className="text-2xl font-semibold mb-4">Get found by employers</h3>
          <ul className="list-none space-y-2.5">
            <li className="flex items-start gap-2.5 text-sm text-[#a1a1aa]">
              <span className="text-[#7c3aed]">→</span>
              <span>Simple less than 5 minute sign up</span>
            </li>
            <li className="flex items-start gap-2.5 text-sm text-[#a1a1aa]">
              <span className="text-[#7c3aed]">→</span>
              <span>Choose visibility: be searchable or get email alerts only</span>
            </li>
            <li className="flex items-start gap-2.5 text-sm text-[#a1a1aa]">
              <span className="text-[#7c3aed]">→</span>
              <span>Your data stays private until you choose to share</span>
            </li>
          </ul>
                    </div>
      </section>

      {/* Follow the Campaign */}
      <section className="py-24 text-center border-b border-[#27272a]">
        <div className="max-w-[1100px] mx-auto px-6">
          <h2 className="text-[32px] font-bold mb-4">Follow the campaign</h2>
          <p className="text-[17px] text-[#a1a1aa] mb-10 max-w-[560px] mx-auto">
            The national advocacy work is led by <a href="https://growremote.ie" target="_blank" rel="noopener noreferrer" className="text-[#7c3aed] hover:underline">Grow Remote</a>, Ireland's non-profit solving the problems of remote work.
          </p>
          <div className="grid grid-cols-2 gap-4 max-w-[600px] mx-auto md:grid-cols-1">
            <a
              href="https://www.irishtimes.com/business/work/2025/12/10/more-than-8000-submissions-made-on-right-to-request-remote-working/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-[#18181b] border border-[#27272a] rounded-xl text-[#fafafa] transition-all hover:border-[#7c3aed] hover:bg-[rgba(139,92,246,0.05)]"
            >
              <span className="text-xl">📊</span>
              <span className="text-sm font-medium">Compiling and publishing data</span>
            </a>
            <a
              href="https://growremote.ie/wp-content/uploads/2025/08/Grow-Remote-Pre-Budget-Submission-2026-1.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-[#18181b] border border-[#27272a] rounded-xl text-[#fafafa] transition-all hover:border-[#7c3aed] hover:bg-[rgba(139,92,246,0.05)]"
            >
              <span className="text-xl">🏛️</span>
              <span className="text-sm font-medium">Advocating for a national target</span>
            </a>
            <a
              href="https://growremote.ie/why-irelands-eu-presidency-should-champion-remote-employment/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-[#18181b] border border-[#27272a] rounded-xl text-[#fafafa] transition-all hover:border-[#7c3aed] hover:bg-[rgba(139,92,246,0.05)]"
            >
              <span className="text-xl">🇪🇺</span>
              <span className="text-sm font-medium">Advocating for EU change</span>
            </a>
            <a
              href="https://growremote.ie/blog/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-[#18181b] border border-[#27272a] rounded-xl text-[#fafafa] transition-all hover:border-[#7c3aed] hover:bg-[rgba(139,92,246,0.05)]"
            >
              <span className="text-xl">📰</span>
              <span className="text-sm font-medium">Keep up to date</span>
            </a>
                  </div>
                </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6">
          <div className="max-w-[1100px] mx-auto flex justify-between items-center flex-wrap gap-4 md:flex-col md:text-center">
          <Link href="/" className="flex items-center gap-2.5 font-semibold text-lg">
            <div className="w-8 h-8 bg-gradient-to-br from-[#7c3aed] to-[#d946ef] rounded-lg"></div>
            <span>Sway</span>
          </Link>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-[13px] text-[#a1a1aa] hover:text-[#fafafa] transition-colors">Privacy</Link>
            <Link href="/terms" className="text-[13px] text-[#a1a1aa] hover:text-[#fafafa] transition-colors">Terms</Link>
            <Link href="/contact" className="text-[13px] text-[#a1a1aa] hover:text-[#fafafa] transition-colors">Contact</Link>
              </div>
          <span className="text-xs text-[#a1a1aa]">© {new Date().getFullYear()} Sway</span>
                  </div>
      </footer>

      {/* Success Modal */}
      {showSuccessModal && (
        <div
          className="fixed inset-0 bg-black/80 z-[1000] flex items-center justify-center p-6"
          onClick={closeModal}
        >
          <div
            className="bg-[#18181b] border border-[#27272a] rounded-[20px] p-10 max-w-[440px] w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#7c3aed] to-[#d946ef] rounded-full flex items-center justify-center text-[28px] text-white">
              ✓
                </div>
            <h3 className="text-xl font-semibold mb-2">You're in!</h3>
            <p className="text-sm text-[#a1a1aa] mb-5">
              Thanks for joining the campaign. You're helping bring remote jobs to every corner of Ireland.
            </p>
            <p className="text-sm text-[#a1a1aa] mb-5">
              Want employers to find you directly? Complete your profile to become visible to remote-first companies.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="/signup"
                className="px-5 py-2.5 bg-gradient-to-br from-[#7c3aed] to-[#9333ea] text-white rounded-md text-sm font-medium hover:shadow-[0_8px_24px_rgba(124,58,237,0.3)] transition-all"
                onClick={closeModal}
              >
                Complete my profile
              </Link>
              <button
                onClick={closeModal}
                className="px-5 py-2.5 bg-transparent border border-[#27272a] text-[#fafafa] rounded-md text-sm font-medium hover:border-[#7c3aed] hover:bg-[rgba(124,58,237,0.1)] transition-all"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scroll-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-scroll {
          animation: scroll 50s linear infinite;
        }
        .animate-scroll-reverse {
          animation: scroll-reverse 55s linear infinite;
        }
      `}</style>
    </>
  )
}

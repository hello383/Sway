'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import Link from 'next/link'
import { searchTowns, getCountyForTown, TOWN_NAMES } from '@/lib/irishTowns'
import { searchRoles, getCategoryForRole, ALL_ROLES } from '@/lib/roles'

const IRISH_COUNTIES = [
  'Antrim',
  'Armagh',
  'Carlow',
  'Cavan',
  'Clare',
  'Cork',
  'Derry',
  'Donegal',
  'Down',
  'Dublin',
  'Fermanagh',
  'Galway',
  'Kerry',
  'Kildare',
  'Kilkenny',
  'Laois',
  'Leitrim',
  'Limerick',
  'Longford',
  'Louth',
  'Mayo',
  'Meath',
  'Monaghan',
  'Offaly',
  'Roscommon',
  'Sligo',
  'Tipperary',
  'Tyrone',
  'Waterford',
  'Westmeath',
  'Wexford',
  'Wicklow',
].sort()

// Roles are now imported from lib/roles.ts

const EXPERIENCE_LEVELS = [
  'Entry level',
  'Junior',
  'Mid-level',
  'Senior',
  'Lead',
  'Principal',
  'Staff',
  'Manager',
  'Senior Manager',
  'Director',
  'Senior Director',
  'VP',
  'Senior VP',
  'SVP',
  'C-Level',
  'Executive',
]

// Search experience levels
function searchExperience(query: string): string[] {
  if (!query.trim()) return []
  const lowerQuery = query.toLowerCase()
  return EXPERIENCE_LEVELS.filter(level => 
    level.toLowerCase().includes(lowerQuery)
  )
}

const WORK_HOURS = [
  '9-5 US timezone',
  '9-5 European timezone',
  'Flexible',
  'Part-time',
]

const EMPLOYMENT_STATUSES = [
  'Currently working remotely',
  'Currently employed, seeking remote role',
  'Unemployed, seeking remote role',
  'Career changer interested in remote work',
  'Returning to workforce',
  'Recent graduate',
]

const COMMUNICATION_STYLES = [
  'Async',
  'Daily',
  'Video calls',
  'Weekly',
  'Flexible',
]

const REMOTE_RETREATS = [
  'Love them',
  'Sometimes',
  'Maybe',
  'Not for me',
]

const WORK_ENVIRONMENTS = [
  'Local coworking space',
  'Dedicated home office space that you close the door on',
  'Other',
]

interface FormData {
  // Personal Information
  fullName: string
  email: string
  phone: string
  county: string
  town?: string
  location: string
  employmentStatus: string

  // Professional Background
  role: string
  experience: string
  currentCompany: string
  expectedSalary: string

  // Work Preferences
  workHours: string
  remoteRetreats: string
  workEnvironment: string

  // Profile Visibility
  profileVisibility: 'visible' | 'email' | 'campaign_only' | ''

  // Campaign
  governmentCampaign: boolean
  campaignReason: string
}

export default function SignUp() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [townSearch, setTownSearch] = useState('')
  const [townSuggestions, setTownSuggestions] = useState<string[]>([])
  const [showTownDropdown, setShowTownDropdown] = useState(false)
  const [countyAutoFilled, setCountyAutoFilled] = useState(false)
  const townInputRef = useRef<HTMLInputElement>(null)
  const townDropdownRef = useRef<HTMLDivElement>(null)
  
  // Role search state
  const [roleSearch, setRoleSearch] = useState('')
  const [roleSuggestions, setRoleSuggestions] = useState<string[]>([])
  const [showRoleDropdown, setShowRoleDropdown] = useState(false)
  const roleInputRef = useRef<HTMLInputElement>(null)
  const roleDropdownRef = useRef<HTMLDivElement>(null)
  
  // Experience search state
  const [experienceSearch, setExperienceSearch] = useState('')
  const [experienceSuggestions, setExperienceSuggestions] = useState<string[]>([])
  const [showExperienceDropdown, setShowExperienceDropdown] = useState(false)
  const experienceInputRef = useRef<HTMLInputElement>(null)
  const experienceDropdownRef = useRef<HTMLDivElement>(null)
  
  // Work hours search state
  const [workHoursSearch, setWorkHoursSearch] = useState('')
  const [workHoursSuggestions, setWorkHoursSuggestions] = useState<string[]>([])
  const [showWorkHoursDropdown, setShowWorkHoursDropdown] = useState(false)
  const workHoursInputRef = useRef<HTMLInputElement>(null)
  const workHoursDropdownRef = useRef<HTMLDivElement>(null)
  
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    county: '',
    town: '',
    location: '',
    employmentStatus: '',
    role: '',
    experience: '',
    currentCompany: '',
    expectedSalary: '',
    workHours: '',
    remoteRetreats: '',
    workEnvironment: '',
    profileVisibility: '',
    governmentCampaign: false,
    campaignReason: '',
  })

  const updateField = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Handle town search input
  const handleTownSearch = (value: string) => {
    setTownSearch(value)
    updateField('town', value) // Save whatever they type (even if not in list)
    updateField('location', value) // Update location field
    
    if (value.trim()) {
      const suggestions = searchTowns(value)
      setTownSuggestions(suggestions)
      setShowTownDropdown(suggestions.length > 0)
      
      // Check if the exact value matches a known town
      const exactMatch = getCountyForTown(value)
      if (exactMatch) {
        updateField('county', exactMatch)
        setCountyAutoFilled(true)
        const location = `${value}, ${exactMatch}`
        updateField('location', location)
      } else if (countyAutoFilled) {
        // If they're typing something new that doesn't match, clear auto-fill
        setCountyAutoFilled(false)
      }
    } else {
      setTownSuggestions([])
      setShowTownDropdown(false)
      setCountyAutoFilled(false)
      updateField('town', '')
      updateField('location', '')
    }
  }

  // Handle town selection from dropdown
  const selectTown = (town: string) => {
    setTownSearch(town)
    updateField('town', town)
    setShowTownDropdown(false)
    
    // Auto-populate county
    const county = getCountyForTown(town)
    if (county) {
      updateField('county', county)
      setCountyAutoFilled(true)
      // Update location field
      const location = `${town}, ${county}`
      updateField('location', location)
    } else {
      setCountyAutoFilled(false)
      updateField('location', town)
    }
  }


  // Handle role search input
  const handleRoleSearch = (value: string) => {
    setRoleSearch(value)
    updateField('role', value) // Save whatever they type
    
    if (value.trim()) {
      const suggestions = searchRoles(value)
      setRoleSuggestions(suggestions)
      setShowRoleDropdown(suggestions.length > 0)
    } else {
      setRoleSuggestions([])
      setShowRoleDropdown(false)
      updateField('role', '')
    }
  }

  // Handle role selection from dropdown
  const selectRole = (role: string) => {
    setRoleSearch(role)
    updateField('role', role)
    setShowRoleDropdown(false)
  }

  // Handle experience search input
  const handleExperienceSearch = (value: string) => {
    setExperienceSearch(value)
    updateField('experience', value) // Save whatever they type
    
    if (value.trim()) {
      const suggestions = searchExperience(value)
      setExperienceSuggestions(suggestions)
      setShowExperienceDropdown(suggestions.length > 0)
    } else {
      setExperienceSuggestions([])
      setShowExperienceDropdown(false)
      updateField('experience', '')
    }
  }

  // Handle experience selection from dropdown
  const selectExperience = (experience: string) => {
    setExperienceSearch(experience)
    updateField('experience', experience)
    setShowExperienceDropdown(false)
  }

  // Search work hours
  function searchWorkHours(query: string): string[] {
    if (!query.trim()) return []
    const lowerQuery = query.toLowerCase()
    return WORK_HOURS.filter(hours => 
      hours.toLowerCase().includes(lowerQuery)
    )
  }

  // Handle work hours search input
  const handleWorkHoursSearch = (value: string) => {
    setWorkHoursSearch(value)
    updateField('workHours', value) // Save whatever they type
    
    if (value.trim()) {
      const suggestions = searchWorkHours(value)
      setWorkHoursSuggestions(suggestions)
      setShowWorkHoursDropdown(suggestions.length > 0)
    } else {
      setWorkHoursSuggestions([])
      setShowWorkHoursDropdown(false)
      updateField('workHours', '')
    }
  }

  // Handle work hours selection from dropdown
  const selectWorkHours = (hours: string) => {
    setWorkHoursSearch(hours)
    updateField('workHours', hours)
    setShowWorkHoursDropdown(false)
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Town dropdown
      if (
        townDropdownRef.current &&
        !townDropdownRef.current.contains(event.target as Node) &&
        townInputRef.current &&
        !townInputRef.current.contains(event.target as Node)
      ) {
        setShowTownDropdown(false)
      }
      
      // Role dropdown
      if (
        roleDropdownRef.current &&
        !roleDropdownRef.current.contains(event.target as Node) &&
        roleInputRef.current &&
        !roleInputRef.current.contains(event.target as Node)
      ) {
        setShowRoleDropdown(false)
      }
      
      // Experience dropdown
      if (
        experienceDropdownRef.current &&
        !experienceDropdownRef.current.contains(event.target as Node) &&
        experienceInputRef.current &&
        !experienceInputRef.current.contains(event.target as Node)
      ) {
        setShowExperienceDropdown(false)
      }
      
      // Work hours dropdown
      if (
        workHoursDropdownRef.current &&
        !workHoursDropdownRef.current.contains(event.target as Node) &&
        workHoursInputRef.current &&
        !workHoursInputRef.current.contains(event.target as Node)
      ) {
        setShowWorkHoursDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const validateStep = (): boolean => {
    if (step === 1) {
      // Check location - use townSearch if location is empty (for typed values)
      const location = formData.location || townSearch
      return !!(
        formData.fullName?.trim() && 
        formData.email?.trim() && 
        location?.trim() && 
        formData.employmentStatus?.trim() && 
        formData.experience?.trim()
      )
    }
    if (step === 2) {
      // Check role - use roleSearch if role is empty (for typed values)
      const role = formData.role || roleSearch
      // Check work hours - use workHoursSearch if workHours is empty (for typed values)
      const workHours = formData.workHours || workHoursSearch
      return !!(role?.trim() && workHours?.trim())
    }
    if (step === 3) {
      return !!formData.profileVisibility
    }
    return true
  }

  const handleSubmit = async () => {
    if (!validateStep()) return

    setLoading(true)
    try {
      // If they chose "Don't include me in the database", don't save profile
      if (formData.profileVisibility === '' && !formData.governmentCampaign) {
        // Just redirect to success page without saving
        router.push(`/success?visibility=none`)
        return
      }

      // Use townSearch if a town was selected, otherwise use formData.town
      const townValue = townSearch && getCountyForTown(townSearch) ? townSearch : formData.town
      
      // Use roleSearch if a role was selected, otherwise use formData.role
      const roleValue = roleSearch && roleSearch.trim() ? roleSearch : formData.role
      
      // Combine county and town for location field (for backward compatibility)
      const profileData = {
        ...formData,
        town: townValue,
        role: roleValue,
        location: townValue ? `${townValue}, ${formData.county}` : formData.county,
      }

      const response = await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      })

      const data = await response.json()

      if (data.success) {
        const visibility = formData.profileVisibility || 'campaign_only'
        const profileId = data.data?.id ? `&id=${data.data.id}` : ''
        router.push(`/success?visibility=${visibility}${profileId}`)
      } else {
        alert(data.error || 'Something went wrong')
        setLoading(false)
      }
    } catch (error) {
      console.error(error)
      alert('Failed to submit. Please try again.')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-950 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="glass-dark rounded-3xl p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-black mb-2">Join Sway</h1>
          <p className="text-white/70 mb-8">
            Step {step} of 3
          </p>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex gap-2 mb-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`flex-1 h-2 rounded-full ${
                    s <= step ? 'bg-purple-600' : 'bg-white/10'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-2">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => updateField('fullName', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">
                  Where in Ireland are you based? <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    ref={townInputRef}
                    type="text"
                    value={townSearch || formData.location}
                    onChange={(e) => {
                      handleTownSearch(e.target.value)
                      updateField('location', e.target.value)
                    }}
                    onFocus={() => {
                      // Show all options when focused
                      if (!townSearch.trim()) {
                        setTownSuggestions(TOWN_NAMES.slice(0, 50)) // Show first 50 towns
                      }
                      setShowTownDropdown(true)
                    }}
                    placeholder="Select or type your location..."
                    className="w-full px-4 py-3 bg-gray-900 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                  {showTownDropdown && townSuggestions.length > 0 && (
                    <div
                      ref={townDropdownRef}
                      className="absolute z-50 w-full mt-1 bg-gray-900 border-2 border-purple-500/50 rounded-xl shadow-2xl max-h-60 overflow-auto"
                    >
                      {townSuggestions.map((town) => (
                        <button
                          key={town}
                          type="button"
                          onClick={() => {
                            selectTown(town)
                            const location = formData.town ? `${formData.town}, ${formData.county}` : formData.county
                            updateField('location', location)
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-purple-500/20 transition-colors border-b border-white/10 last:border-b-0"
                        >
                          <div className="font-bold">{town}</div>
                          <div className="text-xs text-white/60">{getCountyForTown(town)}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-xs text-white/50 mt-1">
                  This helps prove remote-ready talent exists across all of Ireland, not just Dublin
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">
                  Employment Status <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.employmentStatus}
                  onChange={(e) => updateField('employmentStatus', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Select an option</option>
                  {EMPLOYMENT_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">
                  Professional experience <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    ref={experienceInputRef}
                    type="text"
                    value={experienceSearch || formData.experience}
                    onChange={(e) => handleExperienceSearch(e.target.value)}
                    onFocus={() => {
                      // Show all options when focused
                      if (!experienceSearch.trim()) {
                        setExperienceSuggestions(EXPERIENCE_LEVELS)
                      }
                      setShowExperienceDropdown(true)
                    }}
                    placeholder="Select or type your experience level..."
                    className="w-full px-4 py-3 bg-gray-900 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                  {showExperienceDropdown && experienceSuggestions.length > 0 && (
                    <div
                      ref={experienceDropdownRef}
                      className="absolute z-50 w-full mt-1 bg-gray-900 border-2 border-purple-500/50 rounded-xl shadow-2xl max-h-60 overflow-auto"
                    >
                      {experienceSuggestions.map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => selectExperience(level)}
                          className="w-full text-left px-4 py-3 hover:bg-purple-500/20 transition-colors border-b border-white/10 last:border-b-0"
                        >
                          <div className="font-bold">{level}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-xs text-white/50 mt-1">
                  Select from options or enter your own
                </p>
              </div>

              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.governmentCampaign}
                    onChange={(e) => updateField('governmentCampaign', e.target.checked)}
                    className="mt-1 mr-3 w-5 h-5 rounded border-white/20 bg-gray-900 text-green-500 focus:ring-2 focus:ring-green-500"
                  />
                  <div>
                    <div className="font-bold mb-1">Yes, count me in for the campaign</div>
                    <p className="text-sm text-white/70">
                      I support Grow Remote's mission to get the Irish government to set a target for bringing remote jobs to Ireland. I'd like to receive occasional updates about the campaign and ways I can help.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Step 2: Professional Background & Work Preferences */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6">Professional Background</h2>

              <div>
                <label className="block text-sm font-bold mb-2">
                  Role <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    ref={roleInputRef}
                    type="text"
                    value={roleSearch || formData.role}
                    onChange={(e) => handleRoleSearch(e.target.value)}
                    onFocus={() => {
                      // Show all options when focused
                      if (!roleSearch.trim()) {
                        setRoleSuggestions(ALL_ROLES.slice(0, 50)) // Show first 50 roles
                      }
                      setShowRoleDropdown(true)
                    }}
                    placeholder="Select or type your role..."
                    className="w-full px-4 py-3 bg-gray-900 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                  {showRoleDropdown && roleSuggestions.length > 0 && (
                    <div
                      ref={roleDropdownRef}
                      className="absolute z-50 w-full mt-1 bg-gray-900 border-2 border-purple-500/50 rounded-xl shadow-2xl max-h-60 overflow-auto"
                    >
                      {roleSuggestions.map((role) => (
                        <button
                          key={role}
                          type="button"
                          onClick={() => selectRole(role)}
                          className="w-full text-left px-4 py-3 hover:bg-purple-500/20 transition-colors border-b border-white/10 last:border-b-0"
                        >
                          <div className="font-bold">{role}</div>
                          <div className="text-xs text-white/60">{getCategoryForRole(role)}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-xs text-white/50 mt-1">
                  Select from 200+ roles or enter your own
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Current/Recent Company</label>
                <input
                  type="text"
                  value={formData.currentCompany}
                  onChange={(e) => updateField('currentCompany', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">
                  Salary Range <span className="text-white/50 text-xs font-normal">(Not shared with employers)</span>
                </label>
                <input
                  type="text"
                  value={formData.expectedSalary}
                  onChange={(e) => updateField('expectedSalary', e.target.value)}
                  placeholder="e.g., €50k-€70k"
                  className="w-full px-4 py-3 bg-gray-900 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <h2 className="text-2xl font-bold mt-8 mb-6">Work Preferences</h2>

              <div>
                <label className="block text-sm font-bold mb-2">
                  Work Hours <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    ref={workHoursInputRef}
                    type="text"
                    value={workHoursSearch || formData.workHours}
                    onChange={(e) => handleWorkHoursSearch(e.target.value)}
                    onFocus={() => {
                      // Show all options when focused
                      if (!workHoursSearch.trim()) {
                        setWorkHoursSuggestions(WORK_HOURS)
                      }
                      setShowWorkHoursDropdown(true)
                    }}
                    placeholder="Select or type your work hours..."
                    className="w-full px-4 py-3 bg-gray-900 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                  {showWorkHoursDropdown && workHoursSuggestions.length > 0 && (
                    <div
                      ref={workHoursDropdownRef}
                      className="absolute z-50 w-full mt-1 bg-gray-900 border-2 border-purple-500/50 rounded-xl shadow-2xl max-h-60 overflow-auto"
                    >
                      {workHoursSuggestions.map((hours) => (
                        <button
                          key={hours}
                          type="button"
                          onClick={() => selectWorkHours(hours)}
                          className="w-full text-left px-4 py-3 hover:bg-purple-500/20 transition-colors border-b border-white/10 last:border-b-0"
                        >
                          <div className="font-bold">{hours}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-xs text-white/50 mt-1">
                  Select from options or enter your own
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Team Retreats</label>
                <select
                  value={formData.remoteRetreats}
                  onChange={(e) => updateField('remoteRetreats', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select preference</option>
                  {REMOTE_RETREATS.map((retreat) => (
                    <option key={retreat} value={retreat}>
                      {retreat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Work Setup</label>
                <select
                  value={formData.workEnvironment}
                  onChange={(e) => updateField('workEnvironment', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select work setup</option>
                  {WORK_ENVIRONMENTS.map((env) => (
                    <option key={env} value={env}>
                      {env}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Step 3: Profile Visibility */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6">Profile Visibility</h2>
              <p className="text-white/70 mb-6">
                Choose how you want to use Sway:
              </p>

              <div className="space-y-4">
                <label className="block">
                  <input
                    type="radio"
                    name="visibility"
                    value="visible"
                    checked={formData.profileVisibility === 'visible'}
                    onChange={(e) => updateField('profileVisibility', e.target.value)}
                    className="sr-only"
                  />
                  <div
                    className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                      formData.profileVisibility === 'visible'
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-white/20 bg-white/5 hover:border-white/40'
                    }`}
                    onClick={() => updateField('profileVisibility', 'visible')}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                          formData.profileVisibility === 'visible'
                            ? 'border-purple-500 bg-purple-500'
                            : 'border-white/40'
                        }`}
                      >
                        {formData.profileVisibility === 'visible' && (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-2">
                          Make my profile visible to employers
                        </h3>
                        <p className="text-white/70 text-sm">
                          Your profile will be searchable by employers. They can discover
                          your skills and contact you directly about opportunities.
                        </p>
                      </div>
                    </div>
                  </div>
                </label>

                <label className="block">
                  <input
                    type="radio"
                    name="visibility"
                    value="email"
                    checked={formData.profileVisibility === 'email'}
                    onChange={(e) => updateField('profileVisibility', e.target.value)}
                    className="sr-only"
                  />
                  <div
                    className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                      formData.profileVisibility === 'email'
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-white/20 bg-white/5 hover:border-white/40'
                    }`}
                    onClick={() => updateField('profileVisibility', 'email')}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                          formData.profileVisibility === 'email'
                            ? 'border-purple-500 bg-purple-500'
                            : 'border-white/40'
                        }`}
                      >
                        {formData.profileVisibility === 'email' && (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-2">
                          Email me about remote jobs
                        </h3>
                        <p className="text-white/70 text-sm">
                          Your profile stays private. You&apos;ll receive email notifications
                          about remote job opportunities that match your preferences.
                        </p>
                      </div>
                    </div>
                  </div>
                </label>

                <label className="block">
                  <input
                    type="radio"
                    name="visibility"
                    value="campaign_only"
                    checked={formData.profileVisibility === 'campaign_only'}
                    onChange={(e) => {
                      updateField('profileVisibility', 'campaign_only')
                      updateField('governmentCampaign', true)
                    }}
                    className="sr-only"
                  />
                  <div
                    className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                      formData.profileVisibility === 'campaign_only'
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-white/20 bg-white/5 hover:border-white/40'
                    }`}
                    onClick={() => {
                      updateField('profileVisibility', 'campaign_only')
                      updateField('governmentCampaign', true)
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                          formData.profileVisibility === 'campaign_only'
                            ? 'border-purple-500 bg-purple-500'
                            : 'border-white/40'
                        }`}
                      >
                        {formData.profileVisibility === 'campaign_only' && (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-2">
                          Join the campaign and don&apos;t include me in the database
                        </h3>
                        <p className="text-white/70 text-sm">
                          Support Grow Remote&apos;s mission to get the Irish government to set
                          a target for bringing remote jobs to Ireland. You&apos;ll receive
                          occasional updates about the campaign, but your profile won&apos;t be
                          stored in the database.
                        </p>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-colors"
              >
                Back
              </button>
            )}
            <div className="flex-1" />
            {step < 3 ? (
              <button
                onClick={() => {
                  if (validateStep()) {
                    setStep(step + 1)
                  } else {
                    alert('Please fill in all required fields')
                  }
                }}
                className="px-6 py-3 gradient-primary rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading || !validateStep()}
                className="px-6 py-3 gradient-primary rounded-xl font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? 'Submitting...' : 'Submit'}
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}


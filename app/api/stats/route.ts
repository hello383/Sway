import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Get all counts
    const [
      { count: totalProfessionals },
      { count: visibleProfiles },
      { count: emailSubscribers },
      { count: totalJobs },
    ] = await Promise.all([
      supabase.from('user_profiles').select('*', { count: 'exact', head: true }),
      supabase.from('user_profiles').select('*', { count: 'exact', head: true }).eq('profile_visibility', 'visible'),
      supabase.from('user_profiles').select('*', { count: 'exact', head: true }).eq('profile_visibility', 'email'),
      supabase.from('job_postings').select('*', { count: 'exact', head: true }),
    ])

    // Get location stats
    const { data: locationData } = await supabase
      .from('user_profiles')
      .select('location')

    const locationStats: Record<string, number> = {}
    locationData?.forEach((profile) => {
      const location = profile.location
      locationStats[location] = (locationStats[location] || 0) + 1
    })

    // Get county stats
    const { data: countyData } = await supabase
      .from('user_profiles')
      .select('county')

    const countyStats: Record<string, number> = {}
    countyData?.forEach((profile) => {
      const county = profile.county
      countyStats[county] = (countyStats[county] || 0) + 1
    })

    // Get anonymous location data for map pins (town, county, count)
    const { data: locationDataForPins } = await supabase
      .from('user_profiles')
      .select('town, county, location')

    // Aggregate by town/county for anonymous pinning
    const locationPins: Array<{ town: string; county: string; count: number }> = []
    const pinMap = new Map<string, number>()
    
    locationDataForPins?.forEach((profile) => {
      const town = profile.town || profile.location || ''
      const county = profile.county || ''
      const key = `${town}|${county}`
      pinMap.set(key, (pinMap.get(key) || 0) + 1)
    })

    // Convert to array format
    pinMap.forEach((count, key) => {
      const [town, county] = key.split('|')
      if (town && county) {
        locationPins.push({ town, county, count })
      }
    })

    const citiesCovered = Object.keys(locationStats).length

    return NextResponse.json({
      success: true,
      data: {
        totalProfessionals: totalProfessionals || 0,
        visibleProfiles: visibleProfiles || 0,
        emailSubscribers: emailSubscribers || 0,
        totalJobs: totalJobs || 0,
        citiesCovered,
        locationStats,
        countyStats,
        locationPins, // Anonymous location data for map pins
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

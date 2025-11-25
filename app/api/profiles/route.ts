import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Map form data to database columns (snake_case)
    const profileData = {
      full_name: body.fullName,
      email: body.email.toLowerCase().trim(),
      phone: body.phone || null,
      location: body.location,
      county: body.county,
      town: body.town || null,
      role: body.role,
      experience: body.experience,
      current_company: body.currentCompany || null,
      expected_salary: body.expectedSalary || null,
      work_hours: body.workHours,
      remote_retreats: body.remoteRetreats || null,
      work_environment: body.workEnvironment || null,
      profile_visibility: body.profileVisibility,
      employment_status: body.employmentStatus || null,
      government_campaign: body.governmentCampaign || false,
      campaign_reason: body.campaignReason || null,
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .insert(profileData)
      .select()
      .single()

    if (error) {
      // Handle unique constraint violation (duplicate email)
      if (error.code === '23505') {
        return NextResponse.json(
          { success: false, error: 'Email already registered' },
          { status: 400 }
        )
      }
      throw error
    }

    // Send welcome email based on visibility choice
    const { sendWelcomeEmail } = await import('@/lib/email')
    await sendWelcomeEmail(data.email, data.full_name, data.profile_visibility)

    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const visibility = searchParams.get('visibility')

    let query = supabase
      .from('user_profiles')
      .select('id, full_name, location, county, town, role, experience, current_company, work_hours, work_environment, profile_visibility, employment_status, created_at, updated_at')
      .order('created_at', { ascending: false })

    if (visibility === 'visible') {
      query = query.eq('profile_visibility', 'visible')
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

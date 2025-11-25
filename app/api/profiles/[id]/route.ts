import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id, full_name, location, county, town, role, experience, current_company, work_hours, work_environment, profile_visibility, employment_status, created_at, updated_at')
      .eq('id', params.id)
      .single()

    if (error || !data) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    // Map form data to database columns (snake_case)
    const updateData: any = {}
    if (body.fullName) updateData.full_name = body.fullName
    if (body.email) updateData.email = body.email.toLowerCase().trim()
    if (body.phone !== undefined) updateData.phone = body.phone || null
    if (body.location) updateData.location = body.location
    if (body.county) updateData.county = body.county
    if (body.town !== undefined) updateData.town = body.town || null
    if (body.role) updateData.role = body.role
    if (body.experience) updateData.experience = body.experience
    if (body.currentCompany !== undefined) updateData.current_company = body.currentCompany || null
    if (body.expectedSalary !== undefined) updateData.expected_salary = body.expectedSalary || null
    if (body.workHours) updateData.work_hours = body.workHours
    if (body.remoteRetreats !== undefined) updateData.remote_retreats = body.remoteRetreats || null
    if (body.workEnvironment !== undefined) updateData.work_environment = body.workEnvironment || null
    if (body.profileVisibility) updateData.profile_visibility = body.profileVisibility
    if (body.employmentStatus !== undefined) updateData.employment_status = body.employmentStatus || null
    if (body.governmentCampaign !== undefined) updateData.government_campaign = body.governmentCampaign
    if (body.campaignReason !== undefined) updateData.campaign_reason = body.campaignReason || null

    const { data, error } = await supabase
      .from('user_profiles')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error || !data) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    )
  }
}

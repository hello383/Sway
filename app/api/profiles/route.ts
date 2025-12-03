import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Skip if they chose "Don't include me in the database" or "campaign_only"
    if (body.profileVisibility === '' || body.profileVisibility === 'campaign_only') {
      // Still send welcome email for campaign support
      const { sendWelcomeEmail } = await import('@/lib/email')
      await sendWelcomeEmail(body.email, body.fullName, 'campaign_only')
      
      return NextResponse.json(
        { success: true, message: 'Thank you for supporting the campaign! Your profile was not saved to the database.' },
        { status: 200 }
      )
    }

    const email = body.email.toLowerCase().trim()

    // Create Supabase Auth user (only if they want to be in database - not for campaign_only)
    let authUserId = null
    if (body.profileVisibility === 'visible' || body.profileVisibility === 'email') {
      try {
        // Check if user already exists
        const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
        const existingUser = existingUsers?.users.find(u => u.email === email)
        
        if (existingUser) {
          authUserId = existingUser.id
        } else {
          // Create new auth user with provided password
          const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: email,
            email_confirm: true, // Auto-confirm email
            password: body.password, // Use user's chosen password
          })

          if (authError) {
            console.error('Auth creation error:', authError)
          }

          if (authData?.user) {
            authUserId = authData.user.id
          }
        }
      } catch (authErr) {
        // If auth creation fails, continue without auth user
        console.error('Auth user creation failed:', authErr)
      }
    }

    // Map form data to database columns (snake_case)
    const profileData: any = {
      full_name: body.fullName,
      email: email,
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
      profile_visibility: body.profileVisibility || 'campaign_only',
      employment_status: body.employmentStatus || null,
      government_campaign: body.governmentCampaign || false,
      campaign_reason: body.campaignReason || null,
    }

    // Only add auth_user_id if it exists and column exists in schema
    if (authUserId) {
      profileData.auth_user_id = authUserId
    }

    // Try to insert with auth_user_id, but handle case where column doesn't exist yet
    let { data, error } = await supabaseAdmin
      .from('user_profiles')
      .insert(profileData)
      .select()
      .single()

    // If error is about missing column, try again without auth_user_id
    if (error && error.message?.includes('auth_user_id')) {
      const { auth_user_id, ...profileDataWithoutAuth } = profileData
      const result = await supabaseAdmin
        .from('user_profiles')
        .insert(profileDataWithoutAuth)
        .select()
        .single()
      
      data = result.data
      error = result.error
    }

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

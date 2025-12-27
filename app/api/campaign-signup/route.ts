import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Simplified campaign signup endpoint for the homepage form
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, county, sector } = body

    if (!name || !email || !county || !sector) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      )
    }

    const emailLower = email.toLowerCase().trim()

    // Check if email already exists
    const { data: existing } = await supabaseAdmin
      .from('user_profiles')
      .select('id, email')
      .eq('email', emailLower)
      .maybeSingle()

    if (existing) {
      return NextResponse.json(
        { success: true, message: 'You\'re already signed up!', alreadyExists: true },
        { status: 200 }
      )
    }

    // Create a minimal profile entry for campaign signup
    // This can be completed later via the full signup form
    const profileData = {
      full_name: name,
      email: emailLower,
      county: county,
      location: county, // Use county as location for now
      role: sector, // Store sector as role for now
      experience: 'Not specified', // Default, can be updated later
      work_hours: 'Not specified', // Default, can be updated later
      profile_visibility: 'campaign_only', // Default to campaign only
      government_campaign: true,
    }

    const { data, error } = await supabaseAdmin
      .from('user_profiles')
      .insert(profileData)
      .select()
      .single()

    if (error) {
      // Handle unique constraint violation (duplicate email)
      if (error.code === '23505') {
        return NextResponse.json(
          { success: true, message: 'You\'re already signed up!', alreadyExists: true },
          { status: 200 }
        )
      }
      throw error
    }

    // Send welcome email for campaign support
    try {
      const { sendWelcomeEmail } = await import('@/lib/email')
      await sendWelcomeEmail(emailLower, name, 'campaign_only')
    } catch (emailError) {
      console.error('Email sending error:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({ 
      success: true, 
      data,
      message: 'Thanks for joining the campaign!'
    }, { status: 201 })
  } catch (error: any) {
    console.error('Campaign signup error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Something went wrong' },
      { status: 500 }
    )
  }
}


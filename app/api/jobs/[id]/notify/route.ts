import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendJobAlertEmail } from '@/lib/email'

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    
    // Get the job
    const { data: job, error: jobError } = await supabase
      .from('job_postings')
      .select('*')
      .eq('id', id)
      .single()

    if (jobError || !job) {
      return NextResponse.json(
        { success: false, error: 'Job not found' },
        { status: 404 }
      )
    }

    // Get all email subscribers
    const { data: subscribers, error: subscribersError } = await supabase
      .from('user_profiles')
      .select('email')
      .eq('profile_visibility', 'email')

    if (subscribersError) throw subscribersError

    // Send job alerts to all subscribers
    const emailPromises = (subscribers || []).map((subscriber) =>
      sendJobAlertEmail(subscriber.email, job.title, job.company)
    )

    await Promise.all(emailPromises)

    return NextResponse.json({
      success: true,
      message: `Job alert sent to ${subscribers?.length || 0} subscribers`,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

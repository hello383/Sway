import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const jobData = {
      title: body.title,
      company: body.company,
      description: body.description || null,
      location: body.location || null,
      remote_type: body.remoteType || null,
      salary_range: body.salaryRange || null,
      expires_at: body.expiresAt || null,
    }

    const { data, error } = await supabase
      .from('job_postings')
      .insert(jobData)
      .select()
      .single()

    if (error) throw error

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
    const limit = parseInt(searchParams.get('limit') || '50')
    const skip = parseInt(searchParams.get('skip') || '0')

    const { data, error } = await supabase
      .from('job_postings')
      .select('*')
      .order('posted_at', { ascending: false })
      .range(skip, skip + limit - 1)

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

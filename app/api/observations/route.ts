import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { shieldCheck } from '@/components/SovereignPromptShield'

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()

  // Sovereign Prompt Shield: strip PII from notes before storage
  const safeBody = {
    ...body,
    behavioral_notes: shieldCheck(body.behavioral_notes || ''),
    academic_notes: shieldCheck(body.academic_notes || ''),
    attendance_notes: shieldCheck(body.attendance_notes || ''),
  }

  const { data: eduUser } = await supabase
    .from('eduiq_users')
    .select('id')
    .eq('auth_id', user.id)
    .single()

  if (!eduUser) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const { data, error } = await supabase
    .from('eduiq_observations')
    .insert({ ...safeBody, observed_by: eduUser.id })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Audit log
  await supabase.from('eduiq_audit_log').insert({
    user_id: eduUser.id,
    action: 'create_observation',
    resource: 'eduiq_observations',
    resource_id: data.id,
  })

  // Auto-trigger alert if EWS score is low
  if (data.ews_score !== null && data.ews_score <= 4) {
    const level = data.ews_score <= 2 ? 'critical' : 'concern'
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/alerts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', cookie: req.headers.get('cookie') || '' },
      body: JSON.stringify({
        student_id: body.student_id,
        alert_level: level,
        message: `Early warning score of ${data.ews_score.toFixed(1)} detected on ${new Date().toLocaleDateString()}.`,
        triggered_by: eduUser.id,
      }),
    })
  }

  return NextResponse.json({ data })
}

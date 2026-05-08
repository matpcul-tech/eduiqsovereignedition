import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import twilio from 'twilio'

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { student_id, alert_level, message, triggered_by } = await req.json()

  // Insert alert record
  const { data: alert, error } = await supabase
    .from('eduiq_alerts')
    .insert({ student_id, alert_level, message, triggered_by, in_app_sent: true })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Get guardians with SMS enabled
  const { data: guardians } = await supabase
    .from('eduiq_student_guardians')
    .select('phone_number, eduiq_users(full_name)')
    .eq('student_id', student_id)
    .eq('sms_alerts_enabled', true)

  // Get student name
  const { data: student } = await supabase
    .from('eduiq_students')
    .select('full_name')
    .eq('id', student_id)
    .single()

  let smsSent = false
  if (guardians && guardians.length > 0) {
    for (const guardian of guardians) {
      if (guardian.phone_number) {
        try {
          await twilioClient.messages.create({
            body: `EduIQ Sovereign Alert [${alert_level.toUpperCase()}]: ${student?.full_name || 'Your student'} — ${message} Log in at ${process.env.NEXT_PUBLIC_APP_URL} for details.`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: guardian.phone_number,
          })
          smsSent = true
        } catch (e) {
          console.error('Twilio error:', e)
        }
      }
    }

    if (smsSent) {
      await supabase.from('eduiq_alerts').update({ sms_sent: true }).eq('id', alert.id)
    }
  }

  return NextResponse.json({ alert, smsSent })
}

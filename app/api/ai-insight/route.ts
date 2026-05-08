import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { shieldCheck } from '@/components/SovereignPromptShield'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { student_id, context } = await req.json()

  // Get last 10 observations
  const { data: observations } = await supabase
    .from('eduiq_observations')
    .select('behavioral_score, academic_score, attendance_score, ews_score, observed_date, behavioral_notes, academic_notes')
    .eq('student_id', student_id)
    .order('observed_date', { ascending: false })
    .limit(10)

  const sanitizedContext = shieldCheck(context || '')

  const prompt = `You are a child mental health early warning specialist working within a tribal school system. 
You have access to the following anonymized student observation data (no names or identifiers):

${JSON.stringify(observations, null, 2)}

Additional context from educator: ${sanitizedContext}

Provide:
1. A brief trend analysis (2-3 sentences)
2. Top 2 recommended interventions grounded in Indigenous culturally-responsive practices
3. A suggested escalation path if the pattern continues

Keep the response under 200 words. Do not include any personally identifiable information.`

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 400,
    messages: [{ role: 'user', content: prompt }],
  })

  const insight = message.content[0].type === 'text' ? message.content[0].text : ''

  return NextResponse.json({ insight })
}

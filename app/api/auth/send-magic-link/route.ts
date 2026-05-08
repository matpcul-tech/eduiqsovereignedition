import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const resendKey = process.env.RESEND_API_KEY
  const resendFrom = process.env.RESEND_FROM
  const appUrl = process.env.NEXT_PUBLIC_APP_URL
  if (!supabaseUrl || !serviceKey || !resendKey || !resendFrom || !appUrl) {
    return NextResponse.json({ error: 'Email auth is not configured on this server' }, { status: 500 })
  }

  const resend = new Resend(resendKey)
  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const redirectTo = `${appUrl}/auth/callback`

  const { data, error } = await admin.auth.admin.generateLink({
    type: 'magiclink',
    email,
    options: { redirectTo },
  })

  if (error || !data?.properties?.action_link) {
    console.error('[send-magic-link] generateLink failed:', error)
    return NextResponse.json({ error: error?.message || 'Could not generate link' }, { status: 500 })
  }

  const actionLink = data.properties.action_link

  const html = `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#0d1117;font-family:system-ui,-apple-system,sans-serif;color:#ffffff;">
    <div style="max-width:480px;margin:0 auto;padding:48px 24px;">
      <div style="background:#161b22;border:1px solid rgba(29,233,182,0.15);border-radius:12px;padding:40px;">
        <div style="text-align:center;margin-bottom:24px;">
          <div style="font-size:40px;line-height:1;margin-bottom:8px;">🎓</div>
          <div style="color:#ffffff;font-size:28px;font-weight:700;letter-spacing:-0.5px;">EduIQ Chikasha Sovereign Edition</div>
          <div style="color:#1de9b6;font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:600;margin-top:6px;">Student Mental Health Intelligence</div>
        </div>
        <p style="color:rgba(255,255,255,0.85);font-size:15px;line-height:1.6;margin:0 0 24px;">Click the button below to securely sign in to EduIQ Chikasha Sovereign Edition. This link expires in 1 hour.</p>
        <div style="text-align:center;margin-bottom:24px;">
          <a href="${actionLink}" style="display:inline-block;background:#1de9b6;color:#0d1117;font-weight:700;font-size:13px;letter-spacing:1px;text-transform:uppercase;text-decoration:none;padding:14px 28px;border-radius:8px;">Sign In to EduIQ</a>
        </div>
        <p style="color:rgba(255,255,255,0.5);font-size:12px;line-height:1.6;margin:0;">If the button doesn't work, copy and paste this URL into your browser:<br><a href="${actionLink}" style="color:#1de9b6;word-break:break-all;">${actionLink}</a></p>
        <div style="margin-top:32px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.08);text-align:center;">
          <span style="color:rgba(255,255,255,0.5);font-size:11px;letter-spacing:1px;">🛡 Sovereign Prompt Shield v2.0 · HIPAA aligned</span>
        </div>
      </div>
    </div>
  </body>
</html>`

  const { error: sendError } = await resend.emails.send({
    from: resendFrom,
    to: email,
    subject: 'Sign in to EduIQ Chikasha Sovereign Edition',
    html,
  })

  if (sendError) {
    console.error('[send-magic-link] Resend rejected the send:', sendError, '(from:', resendFrom, ')')
    return NextResponse.json({ error: sendError.message }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}

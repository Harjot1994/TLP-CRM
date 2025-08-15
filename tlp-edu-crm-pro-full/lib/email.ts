import { Resend } from 'resend'

export async function sendEmail(to: string, subject: string, html: string) {
  const key = process.env.RESEND_API_KEY
  if (!key) {
    console.log('[DEV] RESEND_API_KEY not set. Would send to', to, subject)
    return { ok: true }
  }
  const resend = new Resend(key)
  const from = process.env.RESEND_FROM || 'noreply@example.com'
  return await resend.emails.send({ from, to, subject, html })
}

import { Resend } from 'resend'

function getResend() {
  return new Resend(process.env.RESEND_API_KEY)
}

const FROM = process.env.RESEND_FROM || 'Deriva <hello@deriva.travel>'

function wrap(title, body) {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F5F0E8;font-family:system-ui,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F0E8;padding:40px 20px">
<tr><td align="center">
<table width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%">
<tr><td style="padding-bottom:24px">
<p style="font-family:Georgia,serif;font-size:14px;letter-spacing:0.3em;text-transform:uppercase;color:#1E1C18;margin:0">Deriva</p>
</td></tr>
<tr><td style="background:#FDFAF5;border:1px solid #D8CCBA;padding:32px">
<p style="font-family:Georgia,serif;font-size:18px;color:#1E1C18;margin:0 0 16px">${title}</p>
${body}
</td></tr>
<tr><td style="padding-top:20px">
<p style="font-size:11px;color:#C8B89A;letter-spacing:0.1em;text-transform:uppercase;margin:0">This is an automated message from Deriva Advisor.</p>
</td></tr>
</table>
</td></tr></table>
</body></html>`
}

export async function send2FACode(email, code) {
  const r = getResend()
  const result = await r.emails.send({
    from: FROM,
    to: email,
    subject: 'Your Deriva verification code',
    html: wrap('Verification Code', `
      <p style="font-size:14px;color:#3A3630;line-height:1.6;margin:0 0 20px">Enter this code to sign in to the Deriva Advisor dashboard.</p>
      <p style="font-family:Georgia,serif;font-size:36px;letter-spacing:0.2em;color:#B85C45;margin:0 0 20px;text-align:center">${code}</p>
      <p style="font-size:13px;color:#7A6E62;line-height:1.5;margin:0">This code expires in 10 minutes. If you did not request this, you can ignore this email.</p>
    `),
  })
  if (result.error) throw new Error(result.error.message || JSON.stringify(result.error))
  return result
}

export async function sendResetEmail(email, resetUrl) {
  const r = getResend()
  const result = await r.emails.send({
    from: FROM,
    to: email,
    subject: 'Reset your Deriva password',
    html: wrap('Password Reset', `
      <p style="font-size:14px;color:#3A3630;line-height:1.6;margin:0 0 20px">Click the link below to reset your Deriva Advisor password.</p>
      <p style="text-align:center;margin:0 0 20px"><a href="${resetUrl}" style="display:inline-block;font-size:13px;letter-spacing:0.15em;text-transform:uppercase;color:#FDFAF5;background:#B85C45;padding:12px 28px;text-decoration:none">Reset Password</a></p>
      <p style="font-size:13px;color:#7A6E62;line-height:1.5;margin:0">This link expires in 1 hour. If you did not request this, you can ignore this email.</p>
    `),
  })
  if (result.error) throw new Error(result.error.message || JSON.stringify(result.error))
  return result
}

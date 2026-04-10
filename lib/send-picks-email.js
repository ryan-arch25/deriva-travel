// Shared email-sending logic used by both api/send-picks.js (Vercel)
// and server.js (local dev). Plain, minimally styled HTML + text fallback.
import { Resend } from 'resend'

const FROM = process.env.RESEND_FROM || 'Deriva <onboarding@resend.dev>'
const SITE_URL = process.env.SITE_URL || 'https://deriva-travel.vercel.app'

const escapeHtml = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function buildText({ country, picks }) {
  const lines = []
  lines.push('DERIVA')
  lines.push('')
  lines.push("Here's what we put together for you.")
  lines.push('')
  if (picks.intro) { lines.push(picks.intro); lines.push('') }

  if (picks.restaurants?.length) {
    lines.push('WHERE TO EAT')
    lines.push('')
    for (const r of picks.restaurants) {
      lines.push(`${r.name} — ${r.priceTier}`)
      lines.push(`${r.neighborhood}, ${r.city}`)
      lines.push(r.note)
      lines.push('')
    }
  }

  if (picks.stays?.length) {
    lines.push('WHERE TO STAY')
    lines.push('')
    for (const s of picks.stays) {
      lines.push(`${s.name} — ${s.priceTier}`)
      lines.push(`${s.neighborhood}, ${s.city}`)
      lines.push(s.note)
      lines.push('')
    }
  }

  if (picks.oneThingNotToMiss) {
    lines.push('ONE THING NOT TO MISS')
    lines.push('')
    lines.push(picks.oneThingNotToMiss)
    lines.push('')
  }

  lines.push('---')
  lines.push('')
  lines.push("Planning this trip and want help putting it all together? That's what I do.")
  lines.push(`${SITE_URL}/work-with-me`)
  lines.push('')
  return lines.join('\n')
}

function buildHtml({ country, picks }) {
  const section = (label, body) => `
    <p style="font-family: -apple-system, system-ui, sans-serif; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #C8B89A; margin: 32px 0 12px;">${label}</p>
    ${body}
  `

  const spotBlock = (s) => `
    <div style="margin-bottom: 20px;">
      <p style="font-family: Georgia, serif; font-size: 16px; color: #1E1C18; margin: 0 0 4px;">
        ${escapeHtml(s.name)} <span style="font-family: -apple-system, system-ui, sans-serif; font-size: 12px; color: #9E8660;">${escapeHtml(s.priceTier || '')}</span>
      </p>
      <p style="font-family: -apple-system, system-ui, sans-serif; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: #C8B89A; margin: 0 0 6px;">${escapeHtml(s.neighborhood || '')}, ${escapeHtml(s.city || '')}</p>
      <p style="font-family: -apple-system, system-ui, sans-serif; font-size: 14px; color: #7A6E62; line-height: 1.65; margin: 0;">${escapeHtml(s.note || '')}</p>
    </div>
  `

  return `<!DOCTYPE html>
<html><body style="background-color: #F5F0E8; margin: 0; padding: 40px 20px;">
<div style="max-width: 560px; margin: 0 auto; background-color: #FDFAF5; padding: 40px 36px; border: 1px solid #D8CCBA;">

  <p style="font-family: Georgia, serif; font-size: 14px; letter-spacing: 0.35em; text-transform: uppercase; color: #1E1C18; margin: 0 0 32px;">DERIVA</p>

  <p style="font-family: Georgia, serif; font-size: 20px; color: #1E1C18; line-height: 1.4; margin: 0 0 8px;">Here's what we put together for you.</p>
  <p style="font-family: -apple-system, system-ui, sans-serif; font-size: 13px; color: #C8B89A; margin: 0 0 24px;">Your picks for ${escapeHtml(country)}</p>

  ${picks.intro ? `<p style="font-family: Georgia, serif; font-size: 15px; font-style: italic; color: #3A3630; line-height: 1.7; border-left: 2px solid #9E8660; padding-left: 16px; margin: 24px 0;">${escapeHtml(picks.intro)}</p>` : ''}

  ${picks.restaurants?.length ? section('Where to Eat', picks.restaurants.map(spotBlock).join('')) : ''}
  ${picks.stays?.length ? section('Where to Stay', picks.stays.map(spotBlock).join('')) : ''}

  ${picks.oneThingNotToMiss ? `
    <div style="margin-top: 32px; padding: 20px; border: 1px solid #9E8660;">
      <p style="font-family: -apple-system, system-ui, sans-serif; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #9E8660; margin: 0 0 10px;">One Thing Not To Miss</p>
      <p style="font-family: Georgia, serif; font-size: 15px; color: #1E1C18; line-height: 1.7; margin: 0;">${escapeHtml(picks.oneThingNotToMiss)}</p>
    </div>
  ` : ''}

  <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #D8CCBA;">
    <p style="font-family: -apple-system, system-ui, sans-serif; font-size: 14px; color: #7A6E62; line-height: 1.7; margin: 0 0 12px;">
      Planning this trip and want help putting it all together? That's what I do.
    </p>
    <a href="${SITE_URL}/work-with-me" style="font-family: -apple-system, system-ui, sans-serif; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #9E8660; text-decoration: none; border-bottom: 1px solid #9E8660; padding-bottom: 2px;">Work With Me</a>
  </div>

</div>
</body></html>`
}

export async function sendPicksEmail({ to, country, picks }) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY not set')
  }
  if (!to || !country || !picks) {
    throw new Error('Missing required fields')
  }
  const resend = new Resend(process.env.RESEND_API_KEY)
  const result = await resend.emails.send({
    from: FROM,
    to,
    subject: `Your Deriva picks for ${country}`,
    text: buildText({ country, picks }),
    html: buildHtml({ country, picks }),
  })
  if (result.error) throw new Error(result.error.message || 'Resend send failed')
  return result.data
}

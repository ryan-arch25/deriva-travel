import { getPortal, listPortals, createPortal, removePortal } from '../lib/portal-store.js'
import { Resend } from 'resend'

const ADVISOR_TOKEN = process.env.ADVISOR_AUTH_TOKEN || 'deriva2024'
const isAuthorized = (req) => req.headers['x-advisor-auth'] === ADVISOR_TOKEN

async function notifyClient({ clientName, clientEmail, tripName, slug, password }) {
  if (!clientEmail || !process.env.RESEND_API_KEY) return
  const resend = new Resend(process.env.RESEND_API_KEY)
  const url = `https://deriva.travel/trip/${slug}`
  const from = process.env.RESEND_FROM || 'Deriva <hello@deriva.travel>'
  const firstName = (clientName || '').split(' ')[0] || 'there'
  const html = `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f5f0e8;font-family:system-ui,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;padding:40px 20px">
<tr><td align="center">
<table width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%">
<tr><td style="padding-bottom:24px"><p style="font-family:Georgia,serif;font-size:14px;letter-spacing:0.3em;text-transform:uppercase;color:#1e1a16;margin:0">Deriva</p></td></tr>
<tr><td style="background:#fff;border:1px solid #e0d5bc;padding:36px">
<p style="font-family:Georgia,serif;font-size:22px;color:#1e1a16;margin:0 0 18px">Your trip portal is ready</p>
<p style="font-size:14px;color:#3a3028;line-height:1.65;margin:0 0 20px">Hi ${firstName}, your ${tripName || 'trip'} portal is live. Every stop, every booking, every advisor note in one place. Open it on your phone when you land — the maps are GPS-aware and the whole thing is built to use while you are actually on the trip.</p>
<p style="text-align:center;margin:24px 0 20px"><a href="${url}" style="display:inline-block;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:#fff;background:#c0614a;padding:14px 32px;text-decoration:none">Open Your Portal</a></p>
<p style="font-size:13px;color:#8c7b6b;line-height:1.65;margin:0 0 8px"><strong style="color:#1e1a16">Password:</strong> ${password}</p>
<p style="font-size:13px;color:#8c7b6b;line-height:1.65;margin:0">Save this email or bookmark the link. You can reply to this message any time if you need anything before you go.</p>
<p style="font-size:13px;color:#8c7b6b;line-height:1.65;margin:24px 0 0">Ryan</p>
</td></tr></table></td></tr></table></body></html>`
  try {
    await resend.emails.send({
      from, to: clientEmail,
      subject: `Your Deriva trip portal — ${tripName || 'Your itinerary'}`,
      html,
    })
  } catch (e) {
    console.error('Portal email failed:', e)
  }
}

export default async function handler(req, res) {
  try {
    // Public: GET /api/portal?slug=...&password=...
    if (req.method === 'GET' && req.query?.slug) {
      const slug = req.query.slug
      const password = req.query.password || ''
      const portal = await getPortal(slug)
      if (!portal) return res.status(404).json({ error: 'Portal not found' })
      if (portal.password !== password) return res.status(401).json({ error: 'Incorrect password' })
      const { password: _, clientEmail: __, ...safe } = portal
      return res.json({ portal: safe })
    }

    // Public: GET /api/portal?check=1&slug=... — just checks if portal exists (no data)
    if (req.method === 'GET' && req.query?.check) {
      const slug = req.query.slug
      const portal = await getPortal(slug)
      return res.json({ exists: !!portal })
    }

    // Admin: list all portals
    if (req.method === 'GET') {
      if (!isAuthorized(req)) return res.status(401).json({ error: 'Unauthorized' })
      const portals = await listPortals()
      return res.json({ portals })
    }

    // Admin: create portal
    if (req.method === 'POST') {
      if (!isAuthorized(req)) return res.status(401).json({ error: 'Unauthorized' })
      const body = req.body || {}
      if (!body.slug || !body.password) return res.status(400).json({ error: 'slug and password required' })
      const portal = await createPortal(body)
      if (body.sendEmail && body.clientEmail) {
        await notifyClient({
          clientName: body.clientName,
          clientEmail: body.clientEmail,
          tripName: body.tripName,
          slug: body.slug,
          password: body.password,
        })
      }
      return res.json({ ok: true, portal: { slug: portal.slug, password: portal.password } })
    }

    // Admin: delete portal
    if (req.method === 'DELETE') {
      if (!isAuthorized(req)) return res.status(401).json({ error: 'Unauthorized' })
      const slug = req.query?.slug || req.body?.slug
      if (!slug) return res.status(400).json({ error: 'slug required' })
      await removePortal(slug)
      return res.json({ ok: true })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

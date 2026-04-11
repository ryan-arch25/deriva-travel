// Fetches and parses RSS 2.0 / Atom feeds server-side to bypass CORS.
function decodeEntities(s) {
  if (!s) return ''
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
}

function stripTags(s) {
  if (!s) return ''
  return decodeEntities(
    s
      .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
  ).trim()
}

function innerText(xml, tagName) {
  const re = new RegExp(`<${tagName}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tagName}>`, 'i')
  const m = xml.match(re)
  if (!m) return ''
  let raw = m[1]
  const cdata = raw.match(/<!\[CDATA\[([\s\S]*?)\]\]>/)
  if (cdata) raw = cdata[1]
  return decodeEntities(raw.replace(/<[^>]+>/g, '').trim())
}

function extractAttr(chunk, tagName, attrName) {
  const re = new RegExp(`<${tagName}[^>]*\\s${attrName}="([^"]+)"`, 'i')
  const m = chunk.match(re)
  return m ? m[1] : ''
}

function parseFeed(xml) {
  const preSplit = xml.split(/<item[\s>]|<entry[\s>]/i)[0] || xml
  const feedTitle = innerText(preSplit, 'title')

  const items = []
  const itemRe = /<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/gi
  let m
  while ((m = itemRe.exec(xml)) !== null) {
    const chunk = m[1]
    const title = innerText(chunk, 'title')
    const linkInner = innerText(chunk, 'link')
    const link = linkInner || extractAttr(`<link ${chunk}`, 'link', 'href')
    const pubDate =
      innerText(chunk, 'pubDate') ||
      innerText(chunk, 'dc:date') ||
      innerText(chunk, 'published') ||
      innerText(chunk, 'updated')
    const rawDesc =
      innerText(chunk, 'content:encoded') ||
      innerText(chunk, 'description') ||
      innerText(chunk, 'summary')
    const description = stripTags(rawDesc).slice(0, 400)
    if (title && link) items.push({ title, link, pubDate, description })
  }

  if (items.length === 0) {
    const entryRe = /<entry(?:\s[^>]*)?>([\s\S]*?)<\/entry>/gi
    while ((m = entryRe.exec(xml)) !== null) {
      const chunk = m[1]
      const title = innerText(chunk, 'title')
      const linkMatch = chunk.match(/<link[^>]*\shref="([^"]+)"/i)
      const link = linkMatch ? linkMatch[1] : ''
      const pubDate = innerText(chunk, 'updated') || innerText(chunk, 'published')
      const rawDesc = innerText(chunk, 'summary') || innerText(chunk, 'content')
      const description = stripTags(rawDesc).slice(0, 400)
      if (title && link) items.push({ title, link, pubDate, description })
    }
  }

  return { feedTitle, items }
}

async function fetchFeed(url, tag) {
  try {
    const r = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; DerivaResearch/1.0)' },
      signal: AbortSignal.timeout(8000),
    })
    if (!r.ok) return { url, tag, items: [], error: `HTTP ${r.status}` }
    const xml = await r.text()
    const { feedTitle, items } = parseFeed(xml)
    return {
      url,
      tag,
      feedTitle,
      items: items.map((it) => ({ ...it, feedTitle, sourceUrl: url, tag })),
    }
  } catch (err) {
    return { url, tag, items: [], error: err.message || 'fetch failed' }
  }
}

export default async function handler(req, res) {
  let sources = []
  if (req.method === 'POST') {
    sources = req.body?.sources || []
  } else if (req.method === 'GET') {
    const u = req.query?.url
    if (u) sources = [{ url: u, tag: req.query?.tag || '' }]
  } else {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  if (!sources.length) return res.status(400).json({ error: 'sources required' })

  const results = await Promise.all(sources.map((s) => fetchFeed(s.url, s.tag || '')))
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600')
  res.json({ feeds: results })
}

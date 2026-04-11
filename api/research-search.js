export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  const { query } = req.body || {}
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'query required' })
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        system: `You are a well traveled, knowledgeable friend answering questions for a professional travel advisor who specializes in Italy, Portugal, Spain, and Iceland. Use web search to gather current information, then answer conversationally and specifically. Write the way a friend with deep local intel would share a tip, not like a listicle or a travel magazine. Be concrete with names, neighborhoods, prices, and reasons. Skip filler and clichés. If you reference a source, name it inline in parentheses. Do not use em dashes or double dashes anywhere in your response. Use commas, periods, and parentheses instead.`,
        messages: [{ role: 'user', content: query }],
        tools: [
          {
            type: 'web_search_20250305',
            name: 'web_search',
            max_uses: 5,
          },
        ],
      }),
    })

    const data = await response.json()
    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'API error' })
    }

    const textParts = []
    const citationsMap = new Map()
    for (const block of data.content || []) {
      if (block.type === 'text') {
        textParts.push(block.text)
        if (Array.isArray(block.citations)) {
          for (const c of block.citations) {
            const url = c.url
            if (url && !citationsMap.has(url)) {
              citationsMap.set(url, { url, title: c.title || url })
            }
          }
        }
      }
    }

    res.json({
      text: textParts.join('\n\n').trim(),
      citations: Array.from(citationsMap.values()),
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

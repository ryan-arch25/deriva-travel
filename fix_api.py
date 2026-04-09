import os, sys

base = os.path.dirname(os.path.abspath(__file__)) if '__file__' in dir() else os.path.expanduser('~/deriva')

def patch(path, old, new):
    with open(path) as f: c = f.read()
    if old not in c:
        print('  skipped (already applied):', path)
        return
    with open(path, 'w') as f: f.write(c.replace(old, new, 1))
    print('  patched:', path)

# ── AdvisorDashboard.jsx ──────────────────────────────────────────────────────

patch(
    os.path.join(base, 'src/advisor/AdvisorDashboard.jsx'),
    "import Anthropic from '@anthropic-ai/sdk'\n",
    ""
)

patch(
    os.path.join(base, 'src/advisor/AdvisorDashboard.jsx'),
    """function getClient() {
  return new Anthropic({ apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY, dangerouslyAllowBrowser: true, baseURL: window.location.origin + '/api/anthropic' })
}""",
    """async function callAI({ system, messages, maxTokens = 1024 }) {
  const res = await fetch('/api/anthropic/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      system,
      messages,
    }),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(`${res.status}: ${body.error?.message || res.statusText}`)
  }
  const data = await res.json()
  return data.content[0].text
}"""
)

patch(
    os.path.join(base, 'src/advisor/AdvisorDashboard.jsx'),
    """      const res = await getClient().messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        system: `You are a research assistant for a professional travel advisor. Generate a concise working brief for a client trip. Use plain text with ## section headers. Include: Key Questions to Clarify (follow-ups for the client), Destination Notes (what matters about each place for this trip type), Neighborhoods to Focus On, Must-Book Items (restaurants, experiences, stays that need advance reservation), Logistics to Handle, and Seasonal Considerations. Be specific. Write for an experienced advisor, not a tourist. No filler.`,
        messages: [{ role: 'user', content: `Client: ${form.name}\\nDestinations: ${form.destinations}\\nTravel dates: ${form.dates}\\nTrip length: ${form.length}\\nParty: ${form.party}\\nBudget: ${form.budget}\\nNotes: ${form.notes || 'none'}` }],
      })
      setBrief(res.content[0].text)
    } catch {
      setError('API error. Check your VITE_ANTHROPIC_API_KEY in .env.')""",
    """      const text = await callAI({
        system: `You are a research assistant for a professional travel advisor. Generate a concise working brief for a client trip. Use plain text with ## section headers. Include: Key Questions to Clarify (follow-ups for the client), Destination Notes (what matters about each place for this trip type), Neighborhoods to Focus On, Must-Book Items (restaurants, experiences, stays that need advance reservation), Logistics to Handle, and Seasonal Considerations. Be specific. Write for an experienced advisor, not a tourist. No filler.`,
        messages: [{ role: 'user', content: `Client: ${form.name}\\nDestinations: ${form.destinations}\\nTravel dates: ${form.dates}\\nTrip length: ${form.length}\\nParty: ${form.party}\\nBudget: ${form.budget}\\nNotes: ${form.notes || 'none'}` }],
        maxTokens: 2048,
      })
      setBrief(text)
    } catch (err) {
      setError(`API error: ${err.message}`)"""
)

patch(
    os.path.join(base, 'src/advisor/AdvisorDashboard.jsx'),
    """      const res = await getClient().messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: `You are a research assistant for a professional travel advisor. Answer questions about European destinations, restaurants, hotels, logistics, and trip planning. Be specific and direct. Write for an experienced advisor. No filler, no tourism clichés.`,
        messages: updated,
      })
      setMessages([...updated, { role: 'assistant', content: res.content[0].text }])
    } catch {
      setMessages([...updated, { role: 'assistant', content: 'API error. Check your VITE_ANTHROPIC_API_KEY in .env.' }])""",
    """      const text = await callAI({
        system: `You are a research assistant for a professional travel advisor. Answer questions about European destinations, restaurants, hotels, logistics, and trip planning. Be specific and direct. Write for an experienced advisor. No filler, no tourism clichés.`,
        messages: updated,
      })
      setMessages([...updated, { role: 'assistant', content: text }])
    } catch (err) {
      setMessages([...updated, { role: 'assistant', content: `API error: ${err.message}` }])"""
)

# ── RecommendationEngine.jsx ──────────────────────────────────────────────────

patch(
    os.path.join(base, 'src/components/RecommendationEngine.jsx'),
    "import Anthropic from '@anthropic-ai/sdk'\n",
    ""
)

patch(
    os.path.join(base, 'src/components/RecommendationEngine.jsx'),
    """    try {
      const client = new Anthropic({
        apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
        dangerouslyAllowBrowser: true,
        baseURL: window.location.origin + '/api/anthropic',
      })

      const message = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userMessage }],
      })

      const text = message.content[0].text.trim()
      const json = JSON.parse(text)
      setResults(json)
    } catch (err) {
      console.error(err)
      setError('Something went wrong. Check that your API key is set in .env and try again.')
    }""",
    """    try {
      const res = await fetch('/api/anthropic/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: userMessage }],
        }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(`${res.status}: ${body.error?.message || res.statusText}`)
      }
      const data = await res.json()
      const text = data.content[0].text.trim()
      const json = JSON.parse(text)
      setResults(json)
    } catch (err) {
      console.error(err)
      setError(`Something went wrong: ${err.message}`)
    }"""
)

# ── QuizResult.jsx ────────────────────────────────────────────────────────────

patch(
    os.path.join(base, 'src/pages/QuizResult.jsx'),
    "import Anthropic from '@anthropic-ai/sdk'\n",
    ""
)

patch(
    os.path.join(base, 'src/pages/QuizResult.jsx'),
    """    try {
      const client = new Anthropic({
        apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
        dangerouslyAllowBrowser: true,
        baseURL: window.location.origin + '/api/anthropic',
      })

      const message = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 256,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: prompt }],
      })

      const text = message.content[0].text.trim()
      const json = JSON.parse(text)
      setResult(json)
    } catch (err) {
      console.error(err)
      setError('Could not get your match. Check your API key and try again.')
    }""",
    """    try {
      const res = await fetch('/api/anthropic/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 256,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: prompt }],
        }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(`${res.status}: ${body.error?.message || res.statusText}`)
      }
      const data = await res.json()
      const text = data.content[0].text.trim()
      const json = JSON.parse(text)
      setResult(json)
    } catch (err) {
      console.error(err)
      setError(`Could not get your match: ${err.message}`)
    }"""
)

print('Done.')

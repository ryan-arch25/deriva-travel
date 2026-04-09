import os, re
path = os.path.expanduser('~/deriva/src/advisor/AdvisorDashboard.jsx')
with open(path) as f: c = f.read()
new_fn = """async function callAI({ system, messages, maxTokens = 1024 }) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ system, messages, maxTokens }),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(`${res.status}: ${body.error || res.statusText}`)
  }
  const data = await res.json()
  return data.text
}"""
result = re.sub(r'async function callAI\(.*?\n\}', new_fn, c, flags=re.DOTALL)
with open(path, 'w') as f: f.write(result)
print('Done')
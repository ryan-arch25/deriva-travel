#!/usr/bin/env python3
import re, os

path = os.path.expanduser('~/deriva/src/pages/Home.jsx')
src = open(path).read()

# ── Fix 1: Hero buttons — remove Find Your Destination, make Work With Me gold ──
# Strategy: replace the entire two-button <div> with a single-button version.
# We match from the outer flex div through both </Link> tags.

hero_pattern = re.compile(
    r'(<div style=\{\{ display: .flex., gap: .1rem., flexWrap: .wrap. \}\}>)'
    r'.*?'
    r'Find Your Destination'
    r'.*?'
    r'Work With Me'
    r'.*?'
    r'(</div>)',
    re.DOTALL
)

hero_replacement = (
    "        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>\n"
    "          <Link\n"
    "            to=\"/work-with-me\"\n"
    "            style={{\n"
    "              fontFamily: 'system-ui, sans-serif',\n"
    "              fontSize: '0.7rem',\n"
    "              letterSpacing: '0.18em',\n"
    "              textTransform: 'uppercase',\n"
    "              color: colors.white,\n"
    "              backgroundColor: colors.gold,\n"
    "              padding: '1rem 2rem',\n"
    "              textDecoration: 'none',\n"
    "              border: `1px solid ${colors.gold}`,\n"
    "            }}\n"
    "          >\n"
    "            Work With Me\n"
    "          </Link>\n"
    "        </div>"
)

result, n = hero_pattern.subn(hero_replacement, src)
if n:
    print(f'✓ Hero buttons patched ({n} replacement)')
    src = result
else:
    print('✗ Hero buttons — pattern not found, check manually')

# ── Fix 2: How It Works — remove "Take the Quiz" CTA block ───────────────────
# Match from the opening <div style={{ marginTop: '3rem' }}> through </div>
# that contains to="/quiz" and Take the Quiz

quiz_cta_pattern = re.compile(
    r'\s*<div style=\{\{ marginTop: .3rem. \}\}>\s*'
    r'<Link[^>]*to="/quiz".*?Take the Quiz.*?</Link>\s*'
    r'</div>',
    re.DOTALL
)

result, n = quiz_cta_pattern.subn('', src)
if n:
    print(f'✓ Take the Quiz CTA removed ({n} replacement)')
    src = result
else:
    print('✗ Take the Quiz CTA — pattern not found, check manually')

open(path, 'w').write(src)
print('\nDone.')

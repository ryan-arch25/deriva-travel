#!/usr/bin/env python3
import os, re

BASE = os.path.expanduser('~/deriva/src')

# ── 1. Delete quiz pages ──────────────────────────────────────────────────────
for f in ['pages/Quiz.jsx', 'pages/QuizResult.jsx']:
    path = os.path.join(BASE, f)
    if os.path.exists(path):
        os.remove(path)
        print(f'Deleted {f}')
    else:
        print(f'Already gone: {f}')

# ── 2. Patch App.jsx ──────────────────────────────────────────────────────────
app_path = os.path.join(BASE, 'App.jsx')
app = open(app_path).read()

app = re.sub(r"import Quiz from './pages/Quiz'\n", '', app)
app = re.sub(r"import QuizResult from './pages/QuizResult'\n", '', app)
app = re.sub(r"\s*<Route path=\"/quiz\" element=\{<Quiz />\} />\n", '', app)
app = re.sub(r"\s*<Route path=\"/quiz/result\" element=\{<QuizResult />\} />\n", '', app)

open(app_path, 'w').write(app)
print('Patched App.jsx')

# ── 3. Patch Home.jsx ─────────────────────────────────────────────────────────
home_path = os.path.join(BASE, 'pages/Home.jsx')
home = open(home_path).read()

# Hero: replace two-button block with single gold Work With Me button
hero_old = '''        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link
            to="/quiz"
            style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '0.7rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: colors.white,
              backgroundColor: colors.gold,
              padding: '1rem 2rem',
              textDecoration: 'none',
              border: `1px solid ${colors.gold}`,
            }}
          >
            Find Your Destination
          </Link>
          <Link
            to="/work-with-me"
            style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '0.7rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: colors.ink,
              backgroundColor: 'transparent',
              padding: '1rem 2rem',
              textDecoration: 'none',
              border: `1px solid ${colors.sand}`,
            }}
          >
            Work With Me
          </Link>
        </div>'''

hero_new = '''        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link
            to="/work-with-me"
            style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '0.7rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: colors.white,
              backgroundColor: colors.gold,
              padding: '1rem 2rem',
              textDecoration: 'none',
              border: `1px solid ${colors.gold}`,
            }}
          >
            Work With Me
          </Link>
        </div>'''

if hero_old in home:
    home = home.replace(hero_old, hero_new)
    print('Patched Home.jsx hero')
else:
    print('WARNING: hero block not found in Home.jsx — check manually')

# How It Works: remove Take the Quiz CTA block
quiz_cta_old = '''        <div style={{ marginTop: '3rem' }}>
          <Link
            to="/quiz"
            style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '0.7rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: colors.white,
              backgroundColor: colors.gold,
              padding: '0.9rem 2rem',
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            Take the Quiz
          </Link>
        </div>'''

if quiz_cta_old in home:
    home = home.replace(quiz_cta_old, '')
    print('Patched Home.jsx How It Works CTA')
else:
    print('WARNING: Take the Quiz block not found in Home.jsx — check manually')

open(home_path, 'w').write(home)

print('\nDone.')

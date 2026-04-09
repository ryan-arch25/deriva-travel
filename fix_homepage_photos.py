#!/usr/bin/env python3
"""fix_homepage_photos.py
Apply photo heroes + terracotta accents to Deriva.
Run from anywhere: python3 fix_homepage_photos.py
Targets: ~/deriva/src/
"""
import re, os

BASE = os.path.expanduser('~/deriva/src')

def patch(path, old, new, flags=re.DOTALL):
    with open(path, 'r') as f:
        src = f.read()
    result, n = re.subn(old, new, src, flags=flags)
    if n == 0:
        print(f'WARNING: pattern not found in {path}')
        return
    with open(path, 'w') as f:
        f.write(result)
    print(f'OK: {path}')

# ── Nav.jsx ───────────────────────────────────────────────────────────────────
NAV = os.path.join(BASE, 'components/Nav.jsx')
patch(NAV,
    r'(  const navStyle = \{)',
    r"\1\n    borderTop: '3px solid #B85C45',")

# ── Home.jsx ──────────────────────────────────────────────────────────────────
HOME = os.path.join(BASE, 'pages/Home.jsx')

# 1. Add terracotta to colors
patch(HOME,
    r"(  white: '#FDFAF5',\n)",
    r"\1  terracotta: '#B85C45',\n")

# 2. DERIVA eyebrow → terracotta
patch(HOME,
    r"(<p style=\{sectionLabelStyle\}>Deriva</p>)",
    r"<p style={{ ...sectionLabelStyle, color: colors.terracotta }}>Deriva</p>")

# 3. Hero h1 → terracotta left border
patch(HOME,
    r"(          lineHeight: '1\.1',\n          marginBottom: '1\.5rem',\n          maxWidth: '700px',)",
    r"\1\n          borderLeft: `3px solid ${colors.terracotta}`,\n          paddingLeft: '1.5rem',")

# 4. Scroll container padding → 0 (photo cards fill edge-to-edge)
patch(HOME,
    r"(          display: 'flex',\n          overflowX: 'auto',\n          gap: '0',\n)          padding: '1rem 2rem',",
    r"\1          padding: '0',")

# 5. Replace plain destination cards with photo cards
OLD_CARDS = (
    r'\{destinations\.map\(\(d, i\) => \('
    r'[\s\S]*?'
    r'\)\)\}'
)
NEW_CARDS = """{destinations.map((d, i) => (
            <div
              key={d.slug}
              style={{
                minWidth: '280px',
                flex: '1',
                borderRight: i < destinations.length - 1 ? `1px solid ${colors.sand}` : 'none',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ position: 'relative', height: '340px', overflow: 'hidden' }}>
                <img
                  src={`https://source.unsplash.com/featured/800x600?${d.slug},landscape`}
                  alt={d.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(30,28,24,0.8) 0%, rgba(30,28,24,0.25) 60%, transparent 100%)',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: '1.5rem',
                }}>
                  <h3 style={{
                    fontFamily: 'Georgia, serif',
                    fontSize: '1.6rem',
                    fontWeight: '400',
                    letterSpacing: '0.05em',
                    color: '#FDFAF5',
                    margin: 0,
                  }}>
                    {d.name}
                  </h3>
                </div>
              </div>
              <div style={{ padding: '1.5rem 2rem 2rem' }}>
                <p style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '0.85rem',
                  fontWeight: '300',
                  color: colors.mid,
                  lineHeight: '1.6',
                  marginBottom: '1.25rem',
                }}>
                  {d.tagline}
                </p>
                <Link
                  to={`/destinations/${d.slug}`}
                  style={{
                    fontFamily: 'system-ui, sans-serif',
                    fontSize: '0.65rem',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: colors.gold,
                    textDecoration: 'none',
                    borderBottom: `1px solid ${colors.gold}`,
                    paddingBottom: '2px',
                  }}
                >
                  Explore
                </Link>
              </div>
            </div>
          ))}"""
patch(HOME, OLD_CARDS, NEW_CARDS)

# ── Destination pages ─────────────────────────────────────────────────────────

def dest_hero(slug, country, subheadline):
    return (
        "<div style={{ position: 'relative', height: '70vh', minHeight: '520px', overflow: 'hidden' }}>\n"
        f"          <img\n"
        f"            src=\"https://source.unsplash.com/featured/1600x900?{slug},landscape\"\n"
        f"            alt=\"{country}\"\n"
        "            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}\n"
        "          />\n"
        "          <div style={{\n"
        "            position: 'absolute',\n"
        "            inset: 0,\n"
        "            background: 'linear-gradient(to top, rgba(20,18,14,0.85) 0%, rgba(20,18,14,0.4) 55%, rgba(20,18,14,0.1) 100%)',\n"
        "            display: 'flex',\n"
        "            alignItems: 'flex-end',\n"
        "            padding: '4rem 2rem',\n"
        "          }}>\n"
        "            <div style={{ maxWidth: '1100px', width: '100%', margin: '0 auto' }}>\n"
        "              <p style={{\n"
        "                fontFamily: 'system-ui, sans-serif',\n"
        "                fontSize: '0.65rem',\n"
        "                letterSpacing: '0.2em',\n"
        "                textTransform: 'uppercase',\n"
        "                color: 'rgba(253,250,245,0.6)',\n"
        "                marginBottom: '1rem',\n"
        "              }}>\n"
        "                Destinations\n"
        "              </p>\n"
        "              <h1 style={{\n"
        "                fontFamily: 'Georgia, serif',\n"
        "                fontSize: 'clamp(2.5rem, 6vw, 5rem)',\n"
        "                fontWeight: '400',\n"
        "                color: '#FDFAF5',\n"
        "                letterSpacing: '0.04em',\n"
        "                marginBottom: '1rem',\n"
        "                lineHeight: '1',\n"
        "              }}>\n"
        f"                {country}\n"
        "              </h1>\n"
        "              <p style={{\n"
        "                fontFamily: 'system-ui, sans-serif',\n"
        "                fontSize: '1rem',\n"
        "                fontWeight: '300',\n"
        "                color: 'rgba(253,250,245,0.8)',\n"
        "                maxWidth: '520px',\n"
        "                lineHeight: '1.7',\n"
        "              }}>\n"
        f"                {subheadline}\n"
        "              </p>\n"
        "            </div>\n"
        "          </div>\n"
        "        </div>"
    )

def patch_dest(filename, slug, country, tagline, subheadline):
    path = os.path.join(BASE, 'pages', filename)
    # Remove paddingTop from wrapper
    patch(path, r"<div style=\{\{ paddingTop: '60px' \}\}>", "<div>")
    # Replace parchment header — anchor on unique end phrase
    escaped = re.escape(subheadline)
    old = (
        r'<div\s+style=\{\{[\s\S]*?backgroundColor: colors\.parchment[\s\S]*?'
        + escaped
        + r'[\s\S]*?</p>\s*</div>\s*</div>'
    )
    patch(path, old, dest_hero(slug, country, subheadline))

patch_dest('Portugal.jsx', 'portugal', 'Portugal', None,
    'It moves at its own pace. The food is honest. The wine is good and cheap. Go in spring or fall and you will wonder why you waited this long.')

patch_dest('Italy.jsx', 'italy', 'Italy', None,
    'Skip the lines. Go south. Eat lunch like it matters. The Italy worth finding is not the Italy everyone is photographing.')

patch_dest('Iceland.jsx', 'iceland', 'Iceland', None,
    'The further you get from the tourist loop, the better it becomes. Pack for rain regardless of the forecast. Drive yourself.')

patch_dest('Spain.jsx', 'spain', 'Spain', None,
    'Eat late. Walk more. The best meals are in places without English menus outside. Extremadura is worth the detour.')

print('\nDone. Run: npm run dev')

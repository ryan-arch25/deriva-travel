import os

OUT = '/home/user/deriva-travel/setup.sh'

def w(path, content):
    d = os.path.dirname(path)
    if d: os.makedirs(d, exist_ok=True)
    with open(path, 'w') as f:
        f.write(content)

lines = []

def emit(s):
    lines.append(s)

emit(r"""#!/bin/bash
set -e

echo ""
echo "  DERIVA SETUP"
echo "  Building your travel advisory site..."
echo ""

# ── Homebrew ────────────────────────────────────────────────────────────────
if ! command -v brew &>/dev/null; then
  echo "Installing Homebrew (you may be prompted for your password)..."
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi
if [[ -f /opt/homebrew/bin/brew ]]; then
  eval "$(/opt/homebrew/bin/brew shellenv)"
elif [[ -f /usr/local/bin/brew ]]; then
  eval "$(/usr/local/bin/brew shellenv)"
fi

# ── Node.js ──────────────────────────────────────────────────────────────────
if ! command -v node &>/dev/null; then
  echo "Installing Node.js..."
  brew install node
fi
echo "Node $(node --version) ready."

# ── Project directory ────────────────────────────────────────────────────────
mkdir -p ~/deriva
cd ~/deriva
mkdir -p src/pages src/advisor src/components src/data src/utils
echo "Project folder: ~/deriva"
echo ""

# ── Write all files via Python ───────────────────────────────────────────────
python3 << 'PYEOF'
import os

def w(path, content):
    d = os.path.dirname(path)
    if d: os.makedirs(d, exist_ok=True)
    with open(path, 'w') as f:
        f.write(content)
    print("  " + path)
""")

# ──────────────────────────────────────────────────────────────────────────────
# index.html
# ──────────────────────────────────────────────────────────────────────────────
emit("""w('index.html', r\"\"\"<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Deriva -- Travel with Intent</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { background: #F5F0E8; color: #3A3630; }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
\"\"\")""")

# ──────────────────────────────────────────────────────────────────────────────
# package.json
# ──────────────────────────────────────────────────────────────────────────────
emit("""w('package.json', r\"\"\"
{
  "name": "deriva",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@anthropic-ai/sdk": "^0.39.0",
    "jspdf": "^2.5.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.1.0"
  }
}
\"\"\")""")

# ──────────────────────────────────────────────────────────────────────────────
# vite.config.js
# ──────────────────────────────────────────────────────────────────────────────
emit("""w('vite.config.js', r\"\"\"import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({ plugins: [react()] })
\"\"\")""")

# ──────────────────────────────────────────────────────────────────────────────
# .env
# ──────────────────────────────────────────────────────────────────────────────
emit("""w('.env', r\"\"\"VITE_ANTHROPIC_API_KEY=your_api_key_here
VITE_GOOGLE_PLACES_KEY=your_google_places_key_here
\"\"\")""")

# ──────────────────────────────────────────────────────────────────────────────
# src/main.jsx
# ──────────────────────────────────────────────────────────────────────────────
emit("""w('src/main.jsx', r\"\"\"import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode><App /></StrictMode>
)
\"\"\")""")

w(OUT, '\n'.join(lines))
print("Wrote part 1 ok")

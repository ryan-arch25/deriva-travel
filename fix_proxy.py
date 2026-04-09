import os

def w(path, content):
    with open(path, 'w') as f: f.write(content)
    print('  wrote:', path)

def patch(path, old, new):
    with open(path) as f: c = f.read()
    with open(path, 'w') as f: f.write(c.replace(old, new, 1))
    print('  patched:', path)

w('vite.config.js', """import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/anthropic': {
        target: 'https://api.anthropic.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\\/api\\/anthropic/, ''),
        secure: true,
      },
    },
  },
})
""")

patch('src/advisor/AdvisorDashboard.jsx',
    'dangerouslyAllowBrowser: true })',
    "dangerouslyAllowBrowser: true, baseURL: window.location.origin + '/api/anthropic' })")

print('Done.')
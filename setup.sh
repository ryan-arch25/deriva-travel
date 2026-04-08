#!/bin/bash
set -e

echo ""
echo "  DERIVA SETUP"
echo ""

if ! command -v brew &>/dev/null; then
  echo "Installing Homebrew..."
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi
if [[ -f /opt/homebrew/bin/brew ]]; then eval "$(/opt/homebrew/bin/brew shellenv)"
elif [[ -f /usr/local/bin/brew ]]; then eval "$(/usr/local/bin/brew shellenv)"
fi

if ! command -v node &>/dev/null; then
  echo "Installing Node.js..."
  brew install node
fi
echo "Node $(node --version) ready."

mkdir -p ~/deriva
cd ~/deriva
mkdir -p src/pages src/advisor src/components src/data src/utils

python3 << 'PYEOF'
import os

def w(path, content):
    d = os.path.dirname(path)
    if d: os.makedirs(d, exist_ok=True)
    with open(path, 'w') as f:
        f.write(content)
    print("  " + path)

print("Writing project files...")

w('index.html', r"""<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Deriva -- Travel with Intent</title>
    <style>* { margin: 0; padding: 0; box-sizing: border-box; } body { background: #F5F0E8; color: #3A3630; }</style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
""")

w('package.json', r"""{
  "name": "deriva",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": { "dev": "vite", "build": "vite build", "preview": "vite preview" },
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
""")

w('vite.config.js', r"""import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({ plugins: [react()] })
""")

w('.env', r"""VITE_ANTHROPIC_API_KEY=your_api_key_here
VITE_GOOGLE_PLACES_KEY=your_google_places_key_here
""")

w('src/main.jsx', r"""import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode><App /></StrictMode>
)
""")

w('src/App.jsx', r"""import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Destinations from './pages/Destinations'
import Portugal from './pages/Portugal'
import Italy from './pages/Italy'
import Iceland from './pages/Iceland'
import Spain from './pages/Spain'
import Quiz from './pages/Quiz'
import QuizResult from './pages/QuizResult'
import WorkWithMe from './pages/WorkWithMe'
import AdvisorLogin from './advisor/AdvisorLogin'
import AdvisorDashboard from './advisor/AdvisorDashboard'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/destinations" element={<Destinations />} />
        <Route path="/destinations/portugal" element={<Portugal />} />
        <Route path="/destinations/italy" element={<Italy />} />
        <Route path="/destinations/iceland" element={<Iceland />} />
        <Route path="/destinations/spain" element={<Spain />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/quiz/result" element={<QuizResult />} />
        <Route path="/work-with-me" element={<WorkWithMe />} />
        <Route path="/advisor" element={<AdvisorLogin />} />
        <Route path="/advisor/dashboard" element={<AdvisorDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}
""")

w('src/components/Nav.jsx', r"""import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
const C = { cream:'#F5F0E8', sand:'#D8CCBA', gold:'#9E8660', charcoal:'#3A3630', ink:'#1E1C18' }
export default function Nav() {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])
  useEffect(() => { setMenuOpen(false) }, [location])
  const nav = { position:'fixed', top:0, left:0, right:0, zIndex:100, height:'60px',
    display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 2rem',
    backgroundColor: scrolled ? C.cream : 'transparent',
    borderBottom: scrolled ? `1px solid ${C.sand}` : '1px solid transparent',
    transition:'background-color 0.3s ease, border-color 0.3s ease' }
  const wm = { fontFamily:'Georgia, serif', fontSize:'1.1rem', letterSpacing:'0.35em',
    fontWeight:'400', color:C.ink, textDecoration:'none', textTransform:'uppercase' }
  const lk = { fontFamily:'system-ui, sans-serif', fontSize:'0.7rem', letterSpacing:'0.18em',
    fontWeight:'400', color:C.charcoal, textDecoration:'none', textTransform:'uppercase' }
  return (
    <>
      <nav style={nav}>
        <Link to="/" style={wm}>Deriva</Link>
        <div style={{ display:'flex', gap:'2.5rem', alignItems:'center' }} className="nav-desktop">
          <Link to="/destinations" style={lk}>Destinations</Link>
          <Link to="/#how-it-works" style={lk}>How It Works</Link>
          <Link to="/work-with-me" style={lk}>Work With Me</Link>
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)}
          style={{ display:'none', background:'none', border:'none', cursor:'pointer',
            padding:'4px', flexDirection:'column', gap:'5px' }}
          className="nav-hamburger" aria-label="Toggle menu">
          {[0,1,2].map(i => <span key={i} style={{ display:'block', width:'22px',
            height:'1px', backgroundColor:C.ink }} />)}
        </button>
      </nav>
      {menuOpen && (
        <div style={{ position:'fixed', top:'60px', left:0, right:0, zIndex:99,
          backgroundColor:C.cream, borderBottom:`1px solid ${C.sand}`,
          padding:'1.5rem 2rem', display:'flex', flexDirection:'column', gap:'1.5rem' }}>
          <Link to="/destinations" style={lk}>Destinations</Link>
          <Link to="/#how-it-works" style={lk}>How It Works</Link>
          <Link to="/work-with-me" style={lk}>Work With Me</Link>
        </div>
      )}
      <style>{`
        @media (max-width: 640px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
      `}</style>
    </>
  )
}
""")

w('src/components/Footer.jsx', r"""import { Link } from 'react-router-dom'
const C = { bark:'#2A2520', tan:'#C8B89A', mid:'#7A6E62' }
export default function Footer() {
  const lk = { fontFamily:'system-ui, sans-serif', fontSize:'0.7rem', letterSpacing:'0.15em',
    color:C.mid, textDecoration:'none', textTransform:'uppercase', display:'block', marginBottom:'0.75rem' }
  return (
    <footer style={{ backgroundColor:C.bark, padding:'3rem 2rem', marginTop:'6rem' }}>
      <div style={{ maxWidth:'1100px', margin:'0 auto', display:'flex', flexDirection:'column', gap:'2rem' }}>
        <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'2rem' }}>
          <div>
            <Link to="/" style={{ fontFamily:'Georgia, serif', fontSize:'1rem', letterSpacing:'0.35em',
              color:C.tan, textDecoration:'none', textTransform:'uppercase' }}>Deriva</Link>
            <p style={{ fontFamily:'system-ui, sans-serif', fontSize:'0.7rem', letterSpacing:'0.15em',
              color:C.mid, textTransform:'uppercase', marginTop:'0.5rem' }}>Travel with Intent</p>
          </div>
          <div>
            <Link to="/destinations" style={lk}>Destinations</Link>
            <Link to="/work-with-me" style={lk}>Work With Me</Link>
            <a href="https://instagram.com" style={lk} target="_blank" rel="noopener noreferrer">Instagram</a>
          </div>
        </div>
        <div style={{ borderTop:'1px solid #3A3630', paddingTop:'1.5rem', display:'flex',
          justifyContent:'space-between', flexWrap:'wrap', gap:'1rem' }}>
          <p style={{ fontFamily:'system-ui, sans-serif', fontSize:'0.65rem', letterSpacing:'0.1em',
            color:C.mid, textTransform:'uppercase' }}>&copy; {new Date().getFullYear()} Deriva. All rights reserved.</p>
          <Link to="/advisor" style={{ fontFamily:'system-ui, sans-serif', fontSize:'0.6rem',
            letterSpacing:'0.1em', color:'#3A3630', textDecoration:'none', textTransform:'uppercase' }}>Advisor</Link>
        </div>
      </div>
    </footer>
  )
}
""")

w('src/components/RecommendationEngine.jsx', r"""import { useState } from 'react'
import Anthropic from '@anthropic-ai/sdk'
const C = { cream:'#F5F0E8', parchment:'#EDE6D8', sand:'#D8CCBA', tan:'#C8B89A',
  gold:'#9E8660', mid:'#7A6E62', charcoal:'#3A3630', ink:'#1E1C18', white:'#FDFAF5' }
const SYS = `You are Deriva's travel curator. Editorial, knowledgeable, direct.
Never say "hidden gem." Never say "off the beaten path." Never sound like TripAdvisor.
Sound like a well-traveled friend who actually went. Short sentences. No filler.
Never use em dashes.`
export default function RecommendationEngine({ destination, restaurants, stays }) {
  const [vibe, setVibe] = useState('')
  const [party, setParty] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)
  const lbl = { fontFamily:'system-ui, sans-serif', fontSize:'0.65rem', letterSpacing:'0.18em',
    textTransform:'uppercase', color:C.tan, display:'block', marginBottom:'0.5rem' }
  const inp = { width:'100%', fontFamily:'system-ui, sans-serif', fontSize:'0.9rem', fontWeight:'300',
    color:C.ink, backgroundColor:C.white, border:`1px solid ${C.sand}`, padding:'0.75rem 1rem',
    outline:'none', appearance:'none' }
  const sel = { ...inp, cursor:'pointer',
    backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%239E8660' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,
    backgroundRepeat:'no-repeat', backgroundPosition:'right 1rem center', paddingRight:'2.5rem' }
  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError(null); setResults(null)
    const rData = restaurants.map(r => `${r.name} (${r.city}, ${r.neighborhood}) -- ${r.priceTier} -- ${r.note}`).join('\n')
    const sData = stays.map(s => `${s.name} (${s.city}, ${s.neighborhood}) -- ${s.priceTier} -- ${s.note}`).join('\n')
    const msg = `A traveler is planning a trip to ${destination}.\nVibe: ${vibe}\nParty: ${party}\nNotes: ${notes||'none'}\n\nRESTAURANTS:\n${rData}\n\nSTAYS:\n${sData}\n\nReturn JSON only:\n{"intro":"2 sentences max","restaurants":[{"name":"","city":"","neighborhood":"","priceTier":"","note":""}],"stays":[{"name":"","city":"","neighborhood":"","priceTier":"","note":""}]}\nPick 3-4 restaurants and 2-3 stays from the provided data only.`
    try {
      const client = new Anthropic({ apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY, dangerouslyAllowBrowser: true })
      const res = await client.messages.create({ model:'claude-sonnet-4-20250514', max_tokens:1024,
        system:SYS, messages:[{ role:'user', content:msg }] })
      setResults(JSON.parse(res.content[0].text.trim()))
    } catch(err) { setError('Check your API key in .env and try again.') }
    finally { setLoading(false) }
  }
  return (
    <div style={{ paddingTop:'3rem', borderTop:`1px solid ${C.sand}`, marginTop:'3rem' }}>
      <p style={{ fontFamily:'system-ui, sans-serif', fontSize:'0.65rem', letterSpacing:'0.2em',
        textTransform:'uppercase', color:C.tan, marginBottom:'0.75rem' }}>Get Picks For Your Trip</p>
      <h2 style={{ fontFamily:'Georgia, serif', fontSize:'1.6rem', fontWeight:'400', color:C.ink, marginBottom:'0.5rem' }}>Tell me about the trip.</h2>
      <p style={{ fontFamily:'system-ui, sans-serif', fontSize:'0.9rem', fontWeight:'300', color:C.mid,
        lineHeight:'1.6', marginBottom:'2rem', maxWidth:'480px' }}>Three questions. I will filter the picks to match.</p>
      <form onSubmit={handleSubmit} style={{ maxWidth:'560px' }}>
        <div style={{ marginBottom:'1.5rem' }}>
          <label style={lbl} htmlFor="rec-vibe">What is the vibe?</label>
          <select id="rec-vibe" value={vibe} onChange={e=>setVibe(e.target.value)} required style={sel}>
            <option value="">Select...</option>
            <option value="relaxed and slow">Relaxed and slow</option>
            <option value="food-focused">Food-focused</option>
            <option value="cultural and exploratory">Cultural and exploratory</option>
            <option value="active and outdoor">Active and outdoor</option>
            <option value="romantic">Romantic</option>
            <option value="mix of everything">Mix of everything</option>
          </select>
        </div>
        <div style={{ marginBottom:'1.5rem' }}>
          <label style={lbl} htmlFor="rec-party">Who is coming?</label>
          <select id="rec-party" value={party} onChange={e=>setParty(e.target.value)} required style={sel}>
            <option value="">Select...</option>
            <option value="solo">Solo</option>
            <option value="couple">Partner / couple</option>
            <option value="friends">Friends</option>
            <option value="family with kids">Family with kids</option>
            <option value="group">Group</option>
          </select>
        </div>
        <div style={{ marginBottom:'2rem' }}>
          <label style={lbl} htmlFor="rec-notes">Anything specific? (optional)</label>
          <textarea id="rec-notes" value={notes} onChange={e=>setNotes(e.target.value)}
            placeholder="Budget range, dietary needs, things to avoid..." rows={3}
            style={{ ...inp, resize:'vertical', fontFamily:'system-ui, sans-serif' }} />
        </div>
        <button type="submit" disabled={loading} style={{ fontFamily:'system-ui, sans-serif',
          fontSize:'0.7rem', letterSpacing:'0.18em', textTransform:'uppercase', color:C.white,
          backgroundColor: loading ? C.tan : C.gold, border:'none', padding:'1rem 2rem',
          cursor: loading ? 'not-allowed' : 'pointer', width:'100%' }}>
          {loading ? 'Getting your picks...' : 'Get My Picks'}
        </button>
      </form>
      {error && <div style={{ marginTop:'1.5rem', padding:'1rem', border:`1px solid ${C.tan}`,
        fontFamily:'system-ui, sans-serif', fontSize:'0.85rem', color:C.charcoal }}>{error}</div>}
      {results && (
        <div style={{ marginTop:'3rem', maxWidth:'720px' }}>
          <p style={{ fontFamily:'Georgia, serif', fontSize:'1.05rem', fontStyle:'italic', color:C.charcoal,
            lineHeight:'1.7', marginBottom:'2.5rem', borderLeft:`2px solid ${C.gold}`, paddingLeft:'1.25rem' }}>
            {results.intro}</p>
          {results.restaurants?.length > 0 && <div style={{ marginBottom:'2.5rem' }}>
            <p style={{ fontFamily:'system-ui, sans-serif', fontSize:'0.65rem', letterSpacing:'0.18em',
              textTransform:'uppercase', color:C.tan, marginBottom:'1rem' }}>Where to Eat</p>
            {results.restaurants.map((r,i) => <SpotCard key={i} spot={r} />)}
          </div>}
          {results.stays?.length > 0 && <div>
            <p style={{ fontFamily:'system-ui, sans-serif', fontSize:'0.65rem', letterSpacing:'0.18em',
              textTransform:'uppercase', color:C.tan, marginBottom:'1rem' }}>Where to Stay</p>
            {results.stays.map((s,i) => <SpotCard key={i} spot={s} />)}
          </div>}
        </div>
      )}
    </div>
  )
}
function SpotCard({ spot }) {
  const C = { sand:'#D8CCBA', tan:'#C8B89A', gold:'#9E8660', mid:'#7A6E62', ink:'#1E1C18' }
  return (
    <div style={{ padding:'1.25rem', borderBottom:`1px solid ${C.sand}`, display:'flex',
      justifyContent:'space-between', gap:'1rem' }}>
      <div style={{ flex:1 }}>
        <div style={{ display:'flex', alignItems:'baseline', gap:'0.75rem', marginBottom:'0.25rem' }}>
          <h4 style={{ fontFamily:'Georgia, serif', fontSize:'1rem', fontWeight:'400', color:C.ink }}>{spot.name}</h4>
          <span style={{ fontFamily:'system-ui, sans-serif', fontSize:'0.65rem', letterSpacing:'0.1em', color:C.gold }}>{spot.priceTier}</span>
        </div>
        <p style={{ fontFamily:'system-ui, sans-serif', fontSize:'0.75rem', color:C.tan, marginBottom:'0.5rem',
          textTransform:'uppercase', letterSpacing:'0.08em' }}>{spot.neighborhood}, {spot.city}</p>
        <p style={{ fontFamily:'system-ui, sans-serif', fontSize:'0.875rem', fontWeight:'300', color:C.mid, lineHeight:'1.6' }}>{spot.note}</p>
      </div>
    </div>
  )
}
""")

w('src/data/portugal.js', r"""export const regions = [
  { name:'Lisbon', description:'The capital moves slower than its reputation suggests. Base yourself in Mouraria or Intendente, not Bairro Alto. The best meals happen at lunch.', goodFor:['solo','partner','friends'], vibe:['city','culture','food'] },
  { name:'Porto', description:'Grittier, more honest than Lisbon. The Douro riverbank is worth the walk. Eat at a tasca, not a restaurant with an English menu outside.', goodFor:['solo','partner','friends'], vibe:['city','culture','food'] },
  { name:'Alentejo', description:'Flat plains, cork oaks, and very good wine. You come here to slow down. A car is essential. The villages do not perform for tourists.', goodFor:['partner','friends'], vibe:['countryside','food','relaxed'] },
  { name:'Algarve (off-season)', description:'September through October is when it makes sense. The cliffs are real. The summer crowds are gone. Stay inland and drive to the water.', goodFor:['partner','friends','family'], vibe:['coastal','outdoor'] },
  { name:'Azores', description:'Nine islands, mostly empty. Sao Miguel is the entry point. Flores is the reason to come back. Bring waterproof gear and low expectations for weather.', goodFor:['solo','partner','friends'], vibe:['outdoor','adventure','coastal'] },
]
export const restaurants = [
  { name:'Taberna da Rua das Flores', city:'Lisbon', neighborhood:'Chiado', priceTier:'$$', vibe:['local','low-key','natural wine'], goodFor:['solo','partner','friends'], note:'Petiscos done properly. Small plates, long lunches. No reservations, arrive early.', category:'Restaurant', isAdvisorPick:false },
  { name:'Cantina Ze Avillez', city:'Lisbon', neighborhood:'Chiado', priceTier:'$$', vibe:['stylish','local'], goodFor:['partner','friends'], note:'Casual side of the Avillez empire. Better value than the main restaurant and the food is nearly as good.', category:'Restaurant', isAdvisorPick:false },
  { name:'Solar dos Presuntos', city:'Lisbon', neighborhood:'Avenida', priceTier:'$$$', vibe:['local','group-friendly'], goodFor:['partner','friends','family'], note:'Old-school Portuguese dining room. Order the suckling pig. Book ahead.', category:'Restaurant', isAdvisorPick:false },
  { name:'Adega Santiago', city:'Porto', neighborhood:'Boavista', priceTier:'$', vibe:['local','low-key','cash only'], goodFor:['solo','partner','friends'], note:'No website, no frills, no problem. The best francesinha in the city. Arrive hungry.', category:'Restaurant', isAdvisorPick:false },
  { name:'DOP', city:'Porto', neighborhood:'Ribeira', priceTier:'$$$', vibe:['stylish','reservations needed'], goodFor:['partner','friends'], note:'Rui Paula runs a tight room. Seasonal menu focused on northern Portuguese ingredients. Worth the splurge.', category:'Restaurant', isAdvisorPick:false },
  { name:'O Alcaide', city:'Monsaraz', neighborhood:'Old Town', priceTier:'$$', vibe:['local','outdoor seating'], goodFor:['partner','friends'], note:'Inside the walled village. Alentejo classics: black pork, migas, a carafe of local red.', category:'Restaurant', isAdvisorPick:false },
]
export const stays = [
  { name:'Bairro Alto Hotel', city:'Lisbon', neighborhood:'Bairro Alto', priceTier:'$$$$', vibe:['stylish','central'], goodFor:['partner','friends'], note:'The rooftop alone is worth it. Beautifully restored 18th-century building. Service is serious.', category:'Stay', isAdvisorPick:false },
  { name:'Pensao Amor', city:'Lisbon', neighborhood:'Cais do Sodre', priceTier:'$$', vibe:['stylish','local'], goodFor:['solo','partner','friends'], note:'Former brothel, now a boutique guesthouse. Every room is different. Noisy neighborhood, light sleepers should know.', category:'Stay', isAdvisorPick:false },
  { name:'The Yeatman', city:'Porto', neighborhood:'Vila Nova de Gaia', priceTier:'$$$$', vibe:['stylish','romantic'], goodFor:['partner'], note:'Views of Porto from across the Douro. Wine-focused hotel with a serious cellar. The infinity pool overlooks the city.', category:'Stay', isAdvisorPick:false },
  { name:'Casa de Terena', city:'Terena', neighborhood:'Alentejo', priceTier:'$$', vibe:['low-key','rural','outdoor seating'], goodFor:['partner','friends'], note:'A converted farmhouse in a village most people drive past. Quiet in the best way. Good breakfasts.', category:'Stay', isAdvisorPick:false },
  { name:'Areias do Seixo', city:'Lourinha', neighborhood:'Silver Coast', priceTier:'$$$$', vibe:['stylish','outdoor seating','coastal'], goodFor:['partner'], note:'Dune-side eco resort, north of Lisbon. Feels genuinely remote. The kind of place people extend their stays.', category:'Stay', isAdvisorPick:false },
]
export const logistics = {
  bestTime:'May through June, or September through October. July and August are crowded and hot in Lisbon. The Azores are unpredictable year-round.',
  gettingAround:'Lisbon and Porto are walkable. For Alentejo and Algarve, rent a car. Trains connect the main cities reliably. Avoid buses for long hauls.',
  bookAhead:['Restaurants on weekends in Lisbon and Porto','The Yeatman and Bairro Alto Hotel fill fast in high season','Azores flights from mainland Portugal','Car rental in peak summer'],
  visaNotes:'EU citizens: no visa. US, UK, Canada: 90-day visa-free under the Schengen agreement. Check ETIAS requirements post-2025.',
}
""")

w('src/data/italy.js', r"""export const regions = [
  { name:'Puglia', description:'The heel of the boot. Whitewashed towns, excellent burrata, olive groves that go on forever. Lecce is the base. Ostuni is prettier but busier.', goodFor:['partner','friends','family'], vibe:['coastal','food','culture'] },
  { name:'Sicily', description:'Too big for one trip. Focus on Palermo and the west, or the southeast around Noto and Ragusa. The food is unlike anywhere else in Italy.', goodFor:['solo','partner','friends'], vibe:['culture','food','city'] },
  { name:'The Dolomites', description:'Mountain scenery that earns the word dramatic. Hike in summer, ski in winter. The villages of Alta Badia are quieter than Cortina.', goodFor:['solo','partner','friends','family'], vibe:['mountains','outdoor','adventure'] },
  { name:'Lake Como', description:"Earned its reputation. Bellagio is worth the ferry. Varenna is where to actually stay. Avoid it in August unless you enjoy traffic.", goodFor:['partner','friends'], vibe:['coastal','relaxed','romantic'] },
  { name:'Tuscany (off the tourist trail)', description:"Forget Florence in summer. Siena is better. The Val d'Orcia in May looks like a painting. Montalcino is a good base if you drink Brunello.", goodFor:['partner','friends'], vibe:['countryside','food','culture'] },
]
export const restaurants = [
  { name:'Osteria del Caffe Italiano', city:'Florence', neighborhood:'Santa Croce', priceTier:'$$', vibe:['local','low-key'], goodFor:['solo','partner','friends'], note:"Lunch only. Standing at the bar or a table if you're lucky. Best bistecca in the city at lunch prices.", category:'Restaurant', isAdvisorPick:false },
  { name:"Buca dell'Orafo", city:'Florence', neighborhood:'Ponte Vecchio', priceTier:'$$$', vibe:['romantic','reservations needed'], goodFor:['partner'], note:'Old Florence institution. Ask for a table with Arno views. The ribollita is the right order.', category:'Restaurant', isAdvisorPick:false },
  { name:'Osteria Il Carroccio', city:'Siena', neighborhood:'Centro Storico', priceTier:'$$', vibe:['local','low-key'], goodFor:['solo','partner','friends'], note:'Order the pici cacio e pepe. Small room, serious pasta. Locals eat here, which is the whole point.', category:'Restaurant', isAdvisorPick:false },
  { name:'Trattoria da Nino', city:'Palermo', neighborhood:'Capo Market', priceTier:'$', vibe:['local','cash only','group-friendly'], goodFor:['solo','friends','family'], note:'Next to the market, priced for locals. Order whatever they tell you is good. No English menu.', category:'Restaurant', isAdvisorPick:false },
  { name:'Il Frantoio', city:'Ostuni', neighborhood:'Countryside', priceTier:'$$$', vibe:['romantic','outdoor seating','reservations needed'], goodFor:['partner','friends'], note:'Agriturismo dinner on a working olive farm. The antipasti alone run to twelve dishes. Book weeks ahead.', category:'Restaurant', isAdvisorPick:false },
  { name:'Ristorante La Botte', city:'Corvara', neighborhood:'Alta Badia', priceTier:'$$', vibe:['local','group-friendly'], goodFor:['friends','family'], note:'Proper Tyrolean cooking after a day in the mountains. The canederli (bread dumplings) are the move.', category:'Restaurant', isAdvisorPick:false },
]
export const stays = [
  { name:'Hotel Palazzo Manfredi', city:'Rome', neighborhood:'Celio', priceTier:'$$$$', vibe:['stylish','romantic'], goodFor:['partner'], note:"Rooftop views of the Colosseum. One of Rome's best views from a hotel. Worth the price for one night.", category:'Stay', isAdvisorPick:false },
  { name:'Masseria Torre Coccaro', city:'Fasano', neighborhood:'Puglia', priceTier:'$$$$', vibe:['stylish','romantic','outdoor seating'], goodFor:['partner'], note:'A fortified farmhouse in the Puglian countryside. Pool, olive groves, an excellent restaurant. Honeymoon territory.', category:'Stay', isAdvisorPick:false },
  { name:'Hotel Villa Cipriani', city:'Asolo', neighborhood:'Veneto', priceTier:'$$$', vibe:['stylish','romantic','low-key'], goodFor:['partner'], note:'In a hilltop town most people skip. Garden views, quiet rooms, unhurried pace. The Dolomites are close.', category:'Stay', isAdvisorPick:false },
  { name:'Varenna apartment rental', city:'Varenna', neighborhood:'Lake Como', priceTier:'$$', vibe:['low-key','local'], goodFor:['partner','friends','family'], note:'Skip the hotels in Bellagio. Rent an apartment in Varenna. Quieter, cheaper, better access to the ferry.', category:'Stay', isAdvisorPick:false },
  { name:'La Bandita Townhouse', city:'Pienza', neighborhood:"Val d'Orcia", priceTier:'$$$', vibe:['stylish','low-key','romantic'], goodFor:['partner','friends'], note:"Small hotel in a Val d'Orcia village. Excellent design, no fuss. Good base for the Tuscany countryside.", category:'Stay', isAdvisorPick:false },
]
export const logistics = {
  bestTime:'May through June, or September through October. August is brutal in cities. Sicily is best in spring. The Dolomites peak in July and August for hiking.',
  gettingAround:'Trains between major cities are excellent. For Puglia, Sicily, and Tuscany countryside, rent a car. Rome, Florence, Venice are walkable. Avoid driving in city centers.',
  bookAhead:['Uffizi and Accademia in Florence (months ahead in summer)','Vatican Museums','Il Frantoio agriturismo','Masseria Torre Coccaro in high season','Regional trains on Italian holidays'],
  visaNotes:'EU citizens: no visa. US, UK, Canada: 90-day visa-free under the Schengen agreement. Italy is a Schengen member.',
}
""")

w('src/data/iceland.js', r"""export const regions = [
  { name:'Reykjavik', description:'Small enough to cover in a day, interesting enough to stay three. The food scene has caught up with the rest of Europe. Skip the tourist traps near Hallgrimskirkja.', goodFor:['solo','partner','friends'], vibe:['city','culture','food'] },
  { name:'Golden Circle', description:'Overvisited but legitimately impressive. Do it on a weekday, leave early. Gullfoss, Geysir, and Thingvellir in one loop. Skip the tourist buses.', goodFor:['partner','friends','family'], vibe:['outdoor','adventure'] },
  { name:'Westfjords', description:'The real Iceland. Dramatic fjords, almost no people, roads that take twice as long as the map suggests. Dynjandi waterfall is worth any detour.', goodFor:['solo','partner','friends'], vibe:['outdoor','adventure','coastal'] },
  { name:'South Coast', description:'Black sand beaches, glacier lagoons, waterfalls you can walk behind. Skogafoss and Seljalandsfoss are crowded at noon. Go at dawn.', goodFor:['partner','friends','family'], vibe:['outdoor','coastal'] },
  { name:'Highlands', description:'Only accessible in summer, only by 4WD. The interior is lunar and empty. Landmannalaugar is the entry point. Nothing else looks like it.', goodFor:['solo','friends'], vibe:['adventure','outdoor'] },
]
export const restaurants = [
  { name:'Matur og Drykkur', city:'Reykjavik', neighborhood:'Grandi', priceTier:'$$$', vibe:['stylish','reservations needed'], goodFor:['partner','friends'], note:'Traditional Icelandic ingredients done with real skill. The tasting menu reads like a history lesson. Book ahead.', category:'Restaurant', isAdvisorPick:false },
  { name:'Grillmarkadurinn', city:'Reykjavik', neighborhood:'City Centre', priceTier:'$$$', vibe:['stylish','group-friendly'], goodFor:['partner','friends'], note:'Icelandic lamb and fish, cooked over lava rock. The bar is worth a stop even if you skip dinner.', category:'Restaurant', isAdvisorPick:false },
  { name:'Cafe Loki', city:'Reykjavik', neighborhood:'Hallgrimstorg', priceTier:'$', vibe:['local','low-key'], goodFor:['solo','partner','friends','family'], note:'Traditional Icelandic lunch. Try the fish stew and rye bread. It looks like a tourist spot but the food is real.', category:'Restaurant', isAdvisorPick:false },
  { name:'Slippurinn', city:'Vestmannaeyjar', neighborhood:'Westman Islands', priceTier:'$$$', vibe:['local','outdoor seating','reservations needed'], goodFor:['partner','friends'], note:"On the Westman Islands, worth the ferry. One of Iceland's best restaurants, outside Reykjavik entirely.", category:'Restaurant', isAdvisorPick:false },
]
export const stays = [
  { name:'Hotel Borg', city:'Reykjavik', neighborhood:'Austurvollur', priceTier:'$$$', vibe:['stylish','central'], goodFor:['partner','friends'], note:'1930s art deco hotel on the main square. More character than the newer options. Central without being loud.', category:'Stay', isAdvisorPick:false },
  { name:'Hotel Husafell', city:'Husafell', neighborhood:'West Iceland', priceTier:'$$$', vibe:['outdoor seating','low-key'], goodFor:['partner','friends','family'], note:'Good base for the Snaefellsnes Peninsula and western Iceland. Geothermal pool on site.', category:'Stay', isAdvisorPick:false },
  { name:'Fosshotel Glacier Lagoon', city:'Jokulsarlon', neighborhood:'South Coast', priceTier:'$$$', vibe:['outdoor seating','low-key'], goodFor:['partner','friends'], note:'Steps from the glacier lagoon. Book the sunrise tour. The location is the whole reason to stay here.', category:'Stay', isAdvisorPick:false },
]
export const logistics = {
  bestTime:'June through August for daylight and access to the Highlands. February through March for northern lights without full winter conditions.',
  gettingAround:'Rent a car. Full stop. A 4WD is required for the Highlands and F-roads. The Ring Road is manageable in a regular car. Gas stations are sparse in rural areas.',
  bookAhead:['Hotels anywhere in summer (they fill fast)','Northern lights tours in winter','Highland F-road 4WD rental','Blue Lagoon if you want to go (book weeks ahead)','Westfjords accommodation in peak season'],
  visaNotes:'Iceland is part of Schengen but not the EU. US, UK, Canada: 90-day visa-free. Check ETIAS requirements post-2025.',
}
""")

w('src/data/spain.js', r"""export const regions = [
  { name:'Basque Country', description:'San Sebastian for pintxos and the beach. Bilbao for the Guggenheim and a quieter city. The two are 90 minutes apart. Most people pick one. You can do both.', goodFor:['solo','partner','friends'], vibe:['food','city','coastal'] },
  { name:'Andalusia', description:'Granada for the Alhambra. Seville for the energy. Cadiz for the coast. Avoid all three in August. The interior gets hot enough to matter.', goodFor:['solo','partner','friends','family'], vibe:['culture','city','food'] },
  { name:'Extremadura', description:'Almost nobody goes here. Caceres is a medieval city with almost no tourists. Merida has better Roman ruins than most of Italy. The jamon is better here than anywhere.', goodFor:['solo','partner','friends'], vibe:['culture','countryside'] },
  { name:'Menorca', description:'The quieter Balearic. No mega clubs, no package tourists. Clean water, good seafood, actual villages. May and June before it fills up.', goodFor:['partner','friends','family'], vibe:['coastal','relaxed'] },
]
export const restaurants = [
  { name:'Bar Txepetxa', city:'San Sebastian', neighborhood:'Parte Vieja', priceTier:'$', vibe:['local','low-key','cash only'], goodFor:['solo','partner','friends'], note:'Anchovy specialists in the old town. One thing done perfectly. Stand at the bar, order the house pintxo.', category:'Restaurant', isAdvisorPick:false },
  { name:'Asador Etxebarri', city:'Axpe', neighborhood:'Basque Country', priceTier:'$$$$', vibe:['stylish','reservations needed'], goodFor:['partner','friends'], note:'Grilled over wood and charcoal in a village no one can find. One of the best meals in Europe. Book months ahead.', category:'Restaurant', isAdvisorPick:false },
  { name:'El Rinconcillo', city:'Seville', neighborhood:'Barrio Macarena', priceTier:'$', vibe:['local','cash only','low-key'], goodFor:['solo','partner','friends'], note:'Oldest bar in Seville. Order the spinach with chickpeas and whatever is written on the chalkboard.', category:'Restaurant', isAdvisorPick:false },
  { name:'Ultramarinos Quintin', city:'Caceres', neighborhood:'City Centre', priceTier:'$', vibe:['local','low-key'], goodFor:['solo','partner','friends'], note:'Deli and bar. Excellent jamon iberico by the plate. The locals know this place and that is the entire review.', category:'Restaurant', isAdvisorPick:false },
  { name:'Es Cranc', city:'Fornells', neighborhood:'Menorca', priceTier:'$$$', vibe:['local','outdoor seating','reservations needed'], goodFor:['partner','friends','family'], note:'Famous for the lobster stew, caldereta de llagosta. Order it for two. It is worth the price.', category:'Restaurant', isAdvisorPick:false },
]
export const stays = [
  { name:'Hotel Maria Cristina', city:'San Sebastian', neighborhood:'Centro', priceTier:'$$$$', vibe:['stylish','central'], goodFor:['partner','friends'], note:'Grand belle epoque hotel on the river. The address in San Sebastian. Service matches the building.', category:'Stay', isAdvisorPick:false },
  { name:'Parador de Caceres', city:'Caceres', neighborhood:'Old Town', priceTier:'$$$', vibe:['stylish','local'], goodFor:['partner','friends'], note:"Stay inside the medieval walls. The Paradores network is one of Spain's best-kept secrets. This one is excellent.", category:'Stay', isAdvisorPick:false },
  { name:'Son Granot', city:'Es Castell', neighborhood:'Menorca', priceTier:'$$$', vibe:['stylish','romantic','outdoor seating'], goodFor:['partner'], note:'Georgian farmhouse, pool, garden, quiet. Menorca done properly. Minimum stay in high season.', category:'Stay', isAdvisorPick:false },
  { name:'EME Catedral Hotel', city:'Seville', neighborhood:'Santa Cruz', priceTier:'$$$', vibe:['stylish','central'], goodFor:['partner','friends'], note:'Rooftop pool with views of the Giralda. Location cannot be beat. Book a room with cathedral view.', category:'Stay', isAdvisorPick:false },
]
export const logistics = {
  bestTime:'March through May, or October through November. August is peak heat everywhere. San Sebastian is good in July. Menorca is best in May through June.',
  gettingAround:"Spain's high-speed rail (AVE) is excellent and connects Madrid to most major cities fast. Rent a car for Extremadura and Menorca. Cities are walkable.",
  bookAhead:['Alhambra tickets in Granada (weeks ahead minimum)','Asador Etxebarri (months ahead)','Paradores in popular locations','Ferry to Menorca in high season','AVE trains on Spanish holidays'],
  visaNotes:'EU citizens: no visa. US, UK, Canada: 90-day visa-free under the Schengen agreement. Spain is a Schengen member.',
}
""")

w('src/pages/Home.jsx', r"""import { Link } from 'react-router-dom'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
const C = { cream:'#F5F0E8', parchment:'#EDE6D8', sand:'#D8CCBA', tan:'#C8B89A',
  gold:'#9E8660', mid:'#7A6E62', charcoal:'#3A3630', ink:'#1E1C18', white:'#FDFAF5' }
const dests = [
  { name:'Portugal', slug:'portugal', tagline:'Lisbon, Porto, Alentejo, and the edges worth finding.' },
  { name:'Italy', slug:'italy', tagline:'The south, the mountains, the places Tuscany forgot.' },
  { name:'Iceland', slug:'iceland', tagline:'Westfjords, the Highlands, and everything past the tourist loop.' },
  { name:'Spain', slug:'spain', tagline:'Basque Country, Andalusia, and the parts no one bothers with.' },
]
const steps = [
  { num:'01', title:'Tell me how you travel', body:'A seven-question quiz that cuts through preferences and gets to what kind of experience you actually want.' },
  { num:'02', title:'Get a destination match', body:'Curated restaurant picks, the right neighborhoods, and practical guidance -- all filtered for how you said you travel.' },
  { num:'03', title:'Hire me to plan the whole thing', body:'A custom day-by-day itinerary built from scratch. Not a template. Not an algorithm. A plan that fits.' },
]
const lbl = { fontFamily:'system-ui, sans-serif', fontSize:'0.65rem', letterSpacing:'0.2em', textTransform:'uppercase', color:C.tan, marginBottom:'1rem' }
const ctaPrimary = { fontFamily:'system-ui, sans-serif', fontSize:'0.7rem', letterSpacing:'0.18em', textTransform:'uppercase', color:C.white, backgroundColor:C.gold, padding:'1rem 2rem', textDecoration:'none', border:`1px solid ${C.gold}` }
const ctaSecondary = { fontFamily:'system-ui, sans-serif', fontSize:'0.7rem', letterSpacing:'0.18em', textTransform:'uppercase', color:C.ink, backgroundColor:'transparent', padding:'1rem 2rem', textDecoration:'none', border:`1px solid ${C.sand}` }
export default function Home() {
  return (
    <div style={{ backgroundColor:C.cream, minHeight:'100vh' }}>
      <Nav />
      <section style={{ minHeight:'100vh', display:'flex', flexDirection:'column', justifyContent:'center', padding:'8rem 2rem 6rem', maxWidth:'900px', margin:'0 auto' }}>
        <p style={lbl}>Deriva</p>
        <h1 style={{ fontFamily:'Georgia, serif', fontSize:'clamp(2.8rem, 6vw, 5.5rem)', fontWeight:'400', letterSpacing:'0.05em', color:C.ink, lineHeight:'1.1', marginBottom:'1.5rem', maxWidth:'700px' }}>Europe,<br />Done Right.</h1>
        <p style={{ fontFamily:'system-ui, sans-serif', fontSize:'clamp(1rem, 2vw, 1.2rem)', fontWeight:'300', color:C.mid, lineHeight:'1.6', maxWidth:'480px', marginBottom:'2.5rem' }}>Custom trip planning for people who travel with intention.</p>
        <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap' }}>
          <Link to="/quiz" style={ctaPrimary}>Find Your Destination</Link>
          <Link to="/work-with-me" style={ctaSecondary}>Work With Me</Link>
        </div>
      </section>
      <section style={{ padding:'5rem 0', borderTop:`1px solid ${C.sand}`, borderBottom:`1px solid ${C.sand}`, backgroundColor:C.parchment }}>
        <div style={{ padding:'0 2rem', maxWidth:'1100px', margin:'0 auto' }}><p style={lbl}>Destinations</p></div>
        <div style={{ display:'flex', overflowX:'auto', padding:'1rem 2rem', maxWidth:'1100px', margin:'0 auto', scrollbarWidth:'none' }}>
          {dests.map((d,i) => (
            <div key={d.slug} style={{ minWidth:'260px', flex:'1', padding:'2rem', borderRight: i < dests.length-1 ? `1px solid ${C.sand}` : 'none' }}>
              <h3 style={{ fontFamily:'Georgia, serif', fontSize:'1.4rem', fontWeight:'400', letterSpacing:'0.05em', color:C.ink, marginBottom:'0.75rem' }}>{d.name}</h3>
              <p style={{ fontFamily:'system-ui, sans-serif', fontSize:'0.85rem', fontWeight:'300', color:C.mid, lineHeight:'1.6', marginBottom:'1.5rem' }}>{d.tagline}</p>
              <Link to={`/destinations/${d.slug}`} style={{ fontFamily:'system-ui, sans-serif', fontSize:'0.65rem', letterSpacing:'0.18em', textTransform:'uppercase', color:C.gold, textDecoration:'none', borderBottom:`1px solid ${C.gold}`, paddingBottom:'2px' }}>Explore</Link>
            </div>
          ))}
        </div>
      </section>
      <section id="how-it-works" style={{ padding:'6rem 2rem', maxWidth:'1100px', margin:'0 auto' }}>
        <p style={lbl}>How It Works</p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))', gap:'3rem 4rem', marginTop:'2rem' }}>
          {steps.map(s => (
            <div key={s.num}>
              <p style={{ fontFamily:'Georgia, serif', fontSize:'2rem', color:C.sand, marginBottom:'1rem', letterSpacing:'0.05em' }}>{s.num}</p>
              <h3 style={{ fontFamily:'Georgia, serif', fontSize:'1.1rem', fontWeight:'400', color:C.ink, marginBottom:'0.75rem' }}>{s.title}</h3>
              <p style={{ fontFamily:'system-ui, sans-serif', fontSize:'0.9rem', fontWeight:'300', color:C.mid, lineHeight:'1.7' }}>{s.body}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop:'3rem' }}>
          <Link to="/quiz" style={{ ...ctaPrimary, display:'inline-block' }}>Take the Quiz</Link>
        </div>
      </section>
      <section style={{ backgroundColor:C.parchment, borderTop:`1px solid ${C.sand}`, borderBottom:`1px solid ${C.sand}`, padding:'6rem 2rem' }}>
        <div style={{ maxWidth:'620px', margin:'0 auto' }}>
          <p style={lbl}>About Deriva</p>
          <p style={{ fontFamily:'Georgia, serif', fontSize:'clamp(1.1rem, 2.5vw, 1.4rem)', fontWeight:'400', color:C.ink, lineHeight:'1.75', marginBottom:'1.5rem' }}>Deriva exists for people who are tired of going somewhere and feeling like they went nowhere.</p>
          <p style={{ fontFamily:'system-ui, sans-serif', fontSize:'0.95rem', fontWeight:'300', color:C.mid, lineHeight:'1.8', marginBottom:'1rem' }}>Every recommendation is personal. Every itinerary is built from scratch. The goal is not to show you Europe -- it is to show you a version of Europe that actually fits how you travel.</p>
          <p style={{ fontFamily:'system-ui, sans-serif', fontSize:'0.95rem', fontWeight:'300', color:C.mid, lineHeight:'1.8' }}>No templates. No aggregated reviews. No lists of the same twelve restaurants. Just good judgment, applied to your trip.</p>
          <div style={{ marginTop:'2.5rem' }}>
            <Link to="/work-with-me" style={{ fontFamily:'system-ui, sans-serif', fontSize:'0.65rem', letterSpacing:'0.18em', textTransform:'uppercase', color:C.gold, textDecoration:'none', borderBottom:`1px solid ${C.gold}`, paddingBottom:'2px' }}>Work With Me</Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
""")

w('src/pages/Destinations.jsx', r"""import { Link } from 'react-router-dom'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
const C = { cream:'#F5F0E8', parchment:'#EDE6D8', sand:'#D8CCBA', tan:'#C8B89A', gold:'#9E8660', mid:'#7A6E62', charcoal:'#3A3630', ink:'#1E1C18', white:'#FDFAF5' }
const dests = [
  { name:'Portugal', slug:'portugal', tagline:'Slower than it looks. Better than you expect.', regions:'Lisbon, Porto, Alentejo, Algarve, Azores', editorial:'Portugal does not need to perform for you. That is why it works.' },
  { name:'Italy', slug:'italy', tagline:'Go south. Skip August. Order the daily special.', regions:'Puglia, Sicily, Dolomites, Lake Como, Tuscany', editorial:'Italy is best when you ignore the itinerary everyone else is running.' },
  { name:'Iceland', slug:'iceland', tagline:'Take the long road. The detour is the point.', regions:'Reykjavik, Golden Circle, Westfjords, South Coast, Highlands', editorial:'The further from Reykjavik you get, the better it becomes.' },
  { name:'Spain', slug:'spain', tagline:'Eat late. Walk more. Book ahead for the ones that matter.', regions:'Basque Country, Andalusia, Extremadura, Menorca', editorial:'Spain rewards the people who go somewhere no one told them to go.' },
]
export default function Destinations() {
  return (
    <div style={{ backgroundColor:C.cream, minHeight:'100vh' }}>
      <Nav />
      <div style={{ paddingTop:'60px' }}>
        <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'5rem 2rem' }}>
          <p style={{ fontFamily:'system-ui, sans-serif', fontSize:'0.65rem', letterSpacing:'0.2em', textTransform:'uppercase', color:C.tan, marginBottom:'1rem' }}>Destinations</p>
          <h1 style={{ fontFamily:'Georgia, serif', fontSize:'clamp(2rem, 4vw, 3rem)', fontWeight:'400', color:C.ink, letterSpacing:'0.03em', marginBottom:'1rem' }}>Four countries.<br />None of the usual itineraries.</h1>
          <p style={{ fontFamily:'system-ui, sans-serif', fontSize:'1rem', fontWeight:'300', color:C.mid, marginBottom:'4rem', maxWidth:'480px', lineHeight:'1.7' }}>Each guide is built around regions, restaurants, and places that hold up when you actually go.</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', border:`1px solid ${C.sand}` }}>
            {dests.map((d,i) => (
              <div key={d.slug} style={{ padding:'2.5rem', borderRight: i%2===0 ? `1px solid ${C.sand}` : 'none', borderBottom: i<2 ? `1px solid ${C.sand}` : 'none', backgroundColor:C.white }}>
                <h2 style={{ fontFamily:'Georgia, serif', fontSize:'1.6rem', fontWeight:'400', color:C.ink, letterSpacing:'0.03em', marginBottom:'0.5rem' }}>{d.name}</h2>
                <p style={{ fontFamily:'system-ui, sans-serif', fontSize:'0.75rem', fontWeight:'300', color:C.tan, letterSpacing:'0.08em', marginBottom:'1rem', textTransform:'uppercase' }}>{d.regions}</p>
                <p style={{ fontFamily:'system-ui, sans-serif', fontSize:'0.9rem', fontWeight:'300', color:C.mid, lineHeight:'1.65', marginBottom:'0.75rem' }}>{d.tagline}</p>
                <p style={{ fontFamily:'Georgia, serif', fontSize:'0.9rem', fontStyle:'italic', color:C.charcoal, lineHeight:'1.65', marginBottom:'2rem' }}>"{d.editorial}"</p>
                <Link to={`/destinations/${d.slug}`} style={{ fontFamily:'system-ui, sans-serif', fontSize:'0.65rem', letterSpacing:'0.18em', textTransform:'uppercase', color:C.gold, textDecoration:'none', borderBottom:`1px solid ${C.gold}`, paddingBottom:'2px' }}>Open Guide</Link>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
""")

DEST_PAGE = r"""import { useState } from 'react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import RecommendationEngine from '../components/RecommendationEngine'
import { regions, restaurants, stays, logistics } from '../data/SLUG'
const C = { cream:'#F5F0E8', parchment:'#EDE6D8', sand:'#D8CCBA', tan:'#C8B89A', gold:'#9E8660', mid:'#7A6E62', charcoal:'#3A3630', ink:'#1E1C18', white:'#FDFAF5' }
const TABS = ['Explore','Eat','Stay','Logistics']
export default function COMPONENT() {
  const [tab, setTab] = useState('Explore')
  const ts = (t) => ({ fontFamily:'system-ui, sans-serif', fontSize:'0.7rem', letterSpacing:'0.15em', textTransform:'uppercase',
    color: tab===t ? C.ink : C.tan, backgroundColor:'transparent', border:'none',
    borderBottom: tab===t ? `2px solid ${C.gold}` : '2px solid transparent',
    padding:'1rem 1.5rem', cursor:'pointer', marginBottom:'-1px' })
  return (
    <div style={{ backgroundColor:C.cream, minHeight:'100vh' }}>
      <Nav />
      <div style={{ paddingTop:'60px' }}>
        <div style={{ backgroundColor:C.parchment, borderBottom:`1px solid ${C.sand}`, padding:'5rem 2rem 4rem' }}>
          <div style={{ maxWidth:'1100px', margin:'0 auto' }}>
            <p style={{ fontFamily:'system-ui, sans-serif', fontSize:'0.65rem', letterSpacing:'0.2em', textTransform:'uppercase', color:C.tan, marginBottom:'1rem' }}>Destinations</p>
            <h1 style={{ fontFamily:'Georgia, serif', fontSize:'clamp(2.5rem, 6vw, 5rem)', fontWeight:'400', color:C.ink, letterSpacing:'0.04em', marginBottom:'1rem', lineHeight:'1' }}>TITLE</h1>
            <p style={{ fontFamily:'system-ui, sans-serif', fontSize:'1rem', fontWeight:'300', color:C.mid, maxWidth:'520px', lineHeight:'1.7' }}>SUBTITLE</p>
          </div>
        </div>
        <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'3rem 2rem' }}>
          <div style={{ display:'flex', borderBottom:`1px solid ${C.sand}`, marginBottom:'3rem' }}>
            {TABS.map(t => <button key={t} style={ts(t)} onClick={()=>setTab(t)}>{t}</button>)}
          </div>
          {tab==='Explore' && (
            <div>
              <p style={{ fontFamily:'system-ui, sans-serif', fontSize:'0.65rem', letterSpacing:'0.2em', textTransform:'uppercase', color:C.tan, marginBottom:'2rem' }}>Regions to Know</p>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:'2rem' }}>
                {regions.map(r => (
                  <div key={r.name} style={{ borderTop:`1px solid ${C.sand}`, paddingTop:'1.5rem' }}>
                    <h3 style={{ fontFamily:'Georgia, serif', fontSize:'1.2rem', fontWeight:'400', color:C.ink, marginBottom:'0.75rem' }}>{r.name}</h3>
                    <p style={{ fontFamily:'system-ui, sans-serif', fontSize:'0.875rem', fontWeight:'300', color:C.mid, lineHeight:'1.7', marginBottom:'1rem' }}>{r.description}</p>
                    <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
                      {r.vibe.map(v => <span key={v} style={{ fontFamily:'system-ui, sans-serif', fontSize:'0.6rem', letterSpacing:'0.12em', textTransform:'uppercase', color:C.tan, border:`1px solid ${C.sand}`, padding:'0.25rem 0.6rem' }}>{v}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {tab==='Eat' && (
            <div>
              <p style={{ fontFamily:'system-ui, sans-serif', fontSize:'0.65rem', letterSpacing:'0.2em', textTransform:'uppercase', color:C.tan, marginBottom:'0.5rem' }}>Curated Restaurants</p>
              <p style={{ fontFamily:'system-ui, sans-serif', fontSize:'0.85rem', fontWeight:'300', color:C.mid, marginBottom:'2rem', lineHeight:'1.6' }}>Every place on this list was chosen for a reason. Read the note.</p>
              {restaurants.map(r => <SpotRow key={r.name} spot={r} />)}
            </div>
          )}
          {tab==='Stay' && (
            <div>
              <p style={{ fontFamily:'system-ui, sans-serif', fontSize:'0.65rem', letterSpacing:'0.2em', textTransform:'uppercase', color:C.tan, marginBottom:'0.5rem' }}>Where to Stay</p>
              <p style={{ fontFamily:'system-ui, sans-serif', fontSize:'0.85rem', fontWeight:'300', color:C.mid, marginBottom:'2rem', lineHeight:'1.6' }}>Chosen for character and location. Not for the number of stars on the listing.</p>
              {stays.map(s => <SpotRow key={s.name} spot={s} />)}
            </div>
          )}
          {tab==='Logistics' && (
            <div style={{ maxWidth:'700px' }}>
              {[['Best Time to Visit',logistics.bestTime],['Getting Around',logistics.gettingAround],['Visa Notes',logistics.visaNotes]].map(([label,text],i) => (
                <div key={label} style={{ marginBottom:'2.5rem', borderTop: i>0 ? `1px solid ${C.sand}` : 'none', paddingTop: i>0 ? '2rem' : '0' }}>
                  <p style={{ fontFamily:'system-ui, sans-serif', fontSize:'0.65rem', letterSpacing:'0.18em', textTransform:'uppercase', color:C.tan, marginBottom:'0.75rem' }}>{label}</p>
                  <p style={{ fontFamily:'system-ui, sans-serif', fontSize:'0.9rem', fontWeight:'300', color:C.charcoal, lineHeight:'1.7' }}>{text}</p>
                </div>
              ))}
              <div style={{ borderTop:`1px solid ${C.sand}`, paddingTop:'2rem' }}>
                <p style={{ fontFamily:'system-ui, sans-serif', fontSize:'0.65rem', letterSpacing:'0.18em', textTransform:'uppercase', color:C.tan, marginBottom:'0.75rem' }}>Book Ahead</p>
                <ul style={{ listStyle:'none', padding:0 }}>
                  {logistics.bookAhead.map((item,i) => (
                    <li key={i} style={{ fontFamily:'system-ui, sans-serif', fontSize:'0.9rem', fontWeight:'300', color:C.charcoal, lineHeight:'1.7', paddingLeft:'1rem', position:'relative', marginBottom:'0.35rem' }}>
                      <span style={{ position:'absolute', left:0, color:C.gold }}>&mdash;</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          <RecommendationEngine destination="TITLE" restaurants={restaurants} stays={stays} />
        </div>
      </div>
      <Footer />
    </div>
  )
}
function SpotRow({ spot }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:'1rem', borderBottom:`1px solid ${C.sand}`, padding:'1.5rem 0', alignItems:'start' }}>
      <div>
        <div style={{ display:'flex', alignItems:'baseline', gap:'0.75rem', marginBottom:'0.25rem' }}>
          <h3 style={{ fontFamily:'Georgia, serif', fontSize:'1.05rem', fontWeight:'400', color:C.ink }}>{spot.name}</h3>
          {spot.isAdvisorPick && <span style={{ fontFamily:'system-ui, sans-serif', fontSize:'0.55rem', letterSpacing:'0.12em', textTransform:'uppercase', color:C.gold, border:`1px solid ${C.gold}`, padding:'0.15rem 0.4rem' }}>Advisor Pick</span>}
        </div>
        <p style={{ fontFamily:'system-ui, sans-serif', fontSize:'0.7rem', color:C.tan, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'0.6rem' }}>{spot.neighborhood} &middot; {spot.city}</p>
        <p style={{ fontFamily:'system-ui, sans-serif', fontSize:'0.875rem', fontWeight:'300', color:C.mid, lineHeight:'1.65' }}>{spot.note}</p>
        <div style={{ display:'flex', gap:'0.4rem', marginTop:'0.6rem', flexWrap:'wrap' }}>
          {spot.vibe?.map(t => <span key={t} style={{ fontFamily:'system-ui, sans-serif', fontSize:'0.6rem', letterSpacing:'0.1em', textTransform:'uppercase', color:C.tan, border:`1px solid ${C.sand}`, padding:'0.2rem 0.5rem' }}>{t}</span>)}
        </div>
      </div>
      <span style={{ fontFamily:'system-ui, sans-serif', fontSize:'0.8rem', color:C.gold, whiteSpace:'nowrap' }}>{spot.priceTier}</span>
    </div>
  )
}
"""

for slug, comp, title, subtitle in [
  ('portugal','Portugal','Portugal','It moves at its own pace. The food is honest. The wine is good and cheap. Go in spring or fall and you will wonder why you waited this long.'),
  ('italy','Italy','Italy','Skip the lines. Go south. Eat lunch like it matters. The Italy worth finding is not the Italy everyone is photographing.'),
  ('iceland','Iceland','Iceland','The further you get from the tourist loop, the better it becomes. Pack for rain regardless of the forecast. Drive yourself.'),
  ('spain','Spain','Spain','Eat late. Walk more. The best meals are in places without English menus outside. Extremadura is worth the detour.'),
]:
  page = DEST_PAGE.replace('SLUG', slug).replace('COMPONENT', comp).replace('TITLE', title).replace('SUBTITLE', subtitle)
  w(f'src/pages/{comp}.jsx', page)


QUIZ = r"""
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Nav from '../components/Nav'

const colors = {
  cream: '#F5F0E8', parchment: '#EDE6D8', sand: '#D8CCBA', tan: '#C8B89A',
  gold: '#9E8660', mid: '#7A6E62', charcoal: '#3A3630', ink: '#1E1C18', white: '#FDFAF5',
}

const questions = [
  { id: 'pull', question: "What's pulling you toward a trip?", options: [{ value: 'escape', label: 'Escape' }, { value: 'culture', label: 'Culture' }, { value: 'food', label: 'Food' }, { value: 'adventure', label: 'Adventure' }] },
  { id: 'party', question: "Who's coming with you?", options: [{ value: 'solo', label: 'Solo' }, { value: 'partner', label: 'Partner' }, { value: 'friends', label: 'Friends' }, { value: 'family', label: 'Family' }] },
  { id: 'length', question: "How long are you going?", options: [{ value: 'weekend', label: 'Weekend' }, { value: 'one week', label: 'One week' }, { value: 'two weeks', label: 'Two weeks' }, { value: 'open-ended', label: 'Open-ended' }] },
  { id: 'budget', question: "What's your budget vibe?", options: [{ value: 'budget', label: 'Budget' }, { value: 'mid-range', label: 'Mid-range' }, { value: 'splurge', label: 'Splurge' }, { value: 'flexible', label: 'Flexible' }] },
  { id: 'pace', question: "What's your pace?", options: [{ value: 'slow and deep', label: 'Slow and deep' }, { value: 'balanced', label: 'Balanced' }, { value: 'packed', label: 'Packed' }, { value: 'spontaneous', label: 'Spontaneous' }] },
  { id: 'place', question: "What kind of place draws you?", options: [{ value: 'coastal', label: 'Coastal' }, { value: 'city', label: 'City' }, { value: 'mountains', label: 'Mountains' }, { value: 'countryside', label: 'Countryside' }] },
  { id: 'feel', question: "What do you want to feel?", options: [{ value: 'inspired', label: 'Inspired' }, { value: 'rested', label: 'Rested' }, { value: 'connected', label: 'Connected' }, { value: 'challenged', label: 'Challenged' }] },
]

export default function Quiz() {
  const navigate = useNavigate()
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})
  const [selected, setSelected] = useState(null)

  const q = questions[current]
  const progress = (current / questions.length) * 100

  const handleNext = () => {
    if (!selected) return
    const newAnswers = { ...answers, [q.id]: selected }
    setAnswers(newAnswers)
    if (current < questions.length - 1) { setCurrent(current + 1); setSelected(null) }
    else navigate('/quiz/result', { state: { answers: newAnswers } })
  }

  const isLast = current === questions.length - 1

  return (
    <div style={{ backgroundColor: colors.cream, minHeight: '100vh' }}>
      <Nav />
      <div style={{ paddingTop: '60px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ height: '2px', backgroundColor: colors.sand }}>
          <div style={{ height: '100%', width: `${progress}%`, backgroundColor: colors.gold, transition: 'width 0.4s ease' }} />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '4rem 2rem', maxWidth: '620px', margin: '0 auto', width: '100%' }}>
          <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: colors.tan, marginBottom: '0.75rem' }}>
            {current + 1} of {questions.length}
          </p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontWeight: '400', color: colors.ink, lineHeight: '1.3', marginBottom: '2.5rem' }}>
            {q.question}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '3rem' }}>
            {q.options.map(opt => (
              <button key={opt.value} onClick={() => setSelected(opt.value)} style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.9rem', fontWeight: '300', color: selected === opt.value ? colors.white : colors.charcoal, backgroundColor: selected === opt.value ? colors.gold : colors.white, border: `1px solid ${selected === opt.value ? colors.gold : colors.sand}`, padding: '1rem 1.5rem', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s ease' }}>
                {opt.label}
              </button>
            ))}
          </div>
          <button onClick={handleNext} disabled={!selected} style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: colors.white, backgroundColor: selected ? colors.gold : colors.sand, border: 'none', padding: '1rem 2rem', cursor: selected ? 'pointer' : 'not-allowed', alignSelf: 'flex-start', transition: 'background-color 0.15s ease' }}>
            {isLast ? 'See My Match' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}
"""

QUIZ_RESULT = r"""
import { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import Anthropic from '@anthropic-ai/sdk'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

const colors = {
  cream: '#F5F0E8', parchment: '#EDE6D8', sand: '#D8CCBA', tan: '#C8B89A',
  gold: '#9E8660', mid: '#7A6E62', charcoal: '#3A3630', ink: '#1E1C18', white: '#FDFAF5',
}

const DESTINATIONS = [
  { name: 'Portugal', slug: 'portugal' },
  { name: 'Italy', slug: 'italy' },
  { name: 'Iceland', slug: 'iceland' },
  { name: 'Spain', slug: 'spain' },
]

const SYSTEM_PROMPT = `You are Deriva's travel curator. You are editorial, knowledgeable, and direct.
You recommend places most people overlook. You never say "hidden gem."
You never say "off the beaten path." You never sound like TripAdvisor.
Sound like a well-traveled friend who actually went.
Short sentences. No filler. Occasionally opinionated.
Never use em dashes. Use commas or periods instead.`

export default function QuizResult() {
  const location = useLocation()
  const answers = location.state?.answers || {}
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!Object.keys(answers).length) { setError('No quiz answers found. Please take the quiz first.'); setLoading(false); return }
    getMatch()
  }, [])

  const getMatch = async () => {
    const prompt = `A traveler has answered a destination matching quiz. Based on their answers, recommend the single best destination from this list: Portugal, Italy, Iceland, Spain.

Their answers:
- What's pulling them: ${answers.pull}
- Travel party: ${answers.party}
- Trip length: ${answers.length}
- Budget: ${answers.budget}
- Pace: ${answers.pace}
- Preferred setting: ${answers.place}
- What they want to feel: ${answers.feel}

Return a JSON object with this exact structure:
{
  "destination": "Portugal" or "Italy" or "Iceland" or "Spain",
  "explanation": "2-3 sentences max. Direct. Confident. Explain why this destination fits them specifically. Reference their answers. No filler. No generic travel-guide language."
}

Return valid JSON only. No markdown, no explanation outside the JSON.`

    try {
      const client = new Anthropic({ apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY, dangerouslyAllowBrowser: true })
      const message = await client.messages.create({ model: 'claude-sonnet-4-20250514', max_tokens: 256, system: SYSTEM_PROMPT, messages: [{ role: 'user', content: prompt }] })
      const text = message.content[0].text.trim()
      const json = JSON.parse(text)
      setResult(json)
    } catch (err) {
      console.error(err)
      setError('Could not get your match. Check your API key and try again.')
    } finally {
      setLoading(false)
    }
  }

  const matchedDest = result ? DESTINATIONS.find(d => d.name.toLowerCase() === result.destination.toLowerCase()) : null

  return (
    <div style={{ backgroundColor: colors.cream, minHeight: '100vh' }}>
      <Nav />
      <div style={{ paddingTop: '60px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '6rem 2rem', minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {loading && (
            <div>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: colors.tan, marginBottom: '1rem' }}>Finding your match</p>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', color: colors.ink, fontWeight: '400' }}>Reading your answers...</p>
            </div>
          )}
          {error && (
            <div>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.9rem', color: colors.mid, marginBottom: '1.5rem' }}>{error}</p>
              <Link to="/quiz" style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: colors.white, backgroundColor: colors.gold, padding: '0.9rem 2rem', textDecoration: 'none', display: 'inline-block' }}>Retake Quiz</Link>
            </div>
          )}
          {result && matchedDest && (
            <div>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: colors.tan, marginBottom: '1rem' }}>Your Match</p>
              <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: '400', color: colors.ink, letterSpacing: '0.04em', lineHeight: '1', marginBottom: '2rem' }}>{result.destination}</h1>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '1rem', fontWeight: '300', color: colors.charcoal, lineHeight: '1.75', maxWidth: '520px', marginBottom: '3rem', borderLeft: `2px solid ${colors.gold}`, paddingLeft: '1.25rem' }}>{result.explanation}</p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to={`/destinations/${matchedDest.slug}`} style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: colors.white, backgroundColor: colors.gold, padding: '1rem 2rem', textDecoration: 'none' }}>Explore {result.destination}</Link>
                <Link to="/work-with-me" style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: colors.ink, backgroundColor: 'transparent', padding: '1rem 2rem', textDecoration: 'none', border: `1px solid ${colors.sand}` }}>Work With Me</Link>
              </div>
              <div style={{ marginTop: '3rem' }}>
                <Link to="/quiz" style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: colors.tan, textDecoration: 'none', borderBottom: `1px solid ${colors.sand}`, paddingBottom: '2px' }}>Retake Quiz</Link>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
"""

w('src/pages/Quiz.jsx', QUIZ)
w('src/pages/QuizResult.jsx', QUIZ_RESULT)

WORK_WITH_ME = r"""
import { useState } from 'react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

const colors = {
  cream: '#F5F0E8', parchment: '#EDE6D8', sand: '#D8CCBA', tan: '#C8B89A',
  gold: '#9E8660', mid: '#7A6E62', charcoal: '#3A3630', ink: '#1E1C18', white: '#FDFAF5',
}

const WHAT_I_OFFER = [
  'Custom Europe itineraries built around how you actually travel',
  'Curated restaurant and hotel picks -- no tourist traps',
  'Day by day planning with logistics handled',
  'One round of revisions included',
]

const HOW_IT_WORKS = [
  { num: '01', text: 'Fill out the intake form below' },
  { num: '02', text: 'Ryan reviews and follows up within 48 hours' },
  { num: '03', text: 'Receive your custom itinerary as a clean PDF' },
]

const initialForm = { name: '', email: '', destinations: '', dates: '', length: '', party: '', budget: '', notes: '', avoid: '' }

export default function WorkWithMe() {
  const [form, setForm] = useState(initialForm)
  const [submitted, setSubmitted] = useState(false)

  const labelStyle = { fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: colors.tan, display: 'block', marginBottom: '0.5rem' }
  const inputStyle = { width: '100%', fontFamily: 'system-ui, sans-serif', fontSize: '0.9rem', fontWeight: '300', color: colors.ink, backgroundColor: colors.white, border: `1px solid ${colors.sand}`, padding: '0.75rem 1rem', outline: 'none', marginBottom: '1.5rem', appearance: 'none' }
  const selectStyle = { ...inputStyle, cursor: 'pointer', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%239E8660' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', paddingRight: '2.5rem' }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const handleSubmit = (e) => { e.preventDefault(); setSubmitted(true) }

  if (submitted) {
    return (
      <div style={{ backgroundColor: colors.cream, minHeight: '100vh' }}>
        <Nav />
        <div style={{ maxWidth: '620px', margin: '0 auto', padding: '8rem 2rem', minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: colors.tan, marginBottom: '1rem' }}>Received</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', fontWeight: '400', color: colors.ink, marginBottom: '1.5rem' }}>Got it. I'll be in touch.</h2>
          <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.95rem', fontWeight: '300', color: colors.mid, lineHeight: '1.7' }}>
            I review every brief personally. Expect a response within 48 hours. If the trip sounds like something I can do well, I'll say so.
          </p>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: colors.cream, minHeight: '100vh' }}>
      <Nav />
      <div style={{ paddingTop: '60px' }}>
        <div style={{ backgroundColor: colors.parchment, borderBottom: `1px solid ${colors.sand}`, padding: '5rem 2rem 4rem' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: colors.tan, marginBottom: '1rem' }}>Work With Me</p>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: '400', color: colors.ink, letterSpacing: '0.03em', marginBottom: '1rem', lineHeight: '1.1' }}>Custom trip planning,<br />built from scratch.</h1>
            <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '1rem', fontWeight: '300', color: colors.mid, maxWidth: '520px', lineHeight: '1.7' }}>Not a template. Not an algorithm. A plan that fits how you actually travel.</p>
          </div>
        </div>

        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '4rem 2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', marginBottom: '5rem' }}>
            <div>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: colors.tan, marginBottom: '1.5rem' }}>What I Offer</p>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {WHAT_I_OFFER.map((item, i) => (
                  <li key={i} style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.9rem', fontWeight: '300', color: colors.charcoal, lineHeight: '1.7', paddingLeft: '1.25rem', position: 'relative', marginBottom: '0.75rem' }}>
                    <span style={{ position: 'absolute', left: 0, color: colors.gold }}>+</span>{item}
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: '2rem', padding: '1.25rem', border: `1px solid ${colors.sand}`, backgroundColor: colors.white }}>
                <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: colors.tan, marginBottom: '0.5rem' }}>Pricing</p>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: colors.ink }}>Custom itineraries starting at $150</p>
                <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.8rem', fontWeight: '300', color: colors.mid, marginTop: '0.35rem' }}>Final pricing depends on trip complexity. I'll confirm before we begin.</p>
              </div>
            </div>
            <div>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: colors.tan, marginBottom: '1.5rem' }}>How It Works</p>
              {HOW_IT_WORKS.map((step, i) => (
                <div key={step.num} style={{ display: 'flex', gap: '1.25rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: i < HOW_IT_WORKS.length - 1 ? `1px solid ${colors.sand}` : 'none' }}>
                  <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.2rem', color: colors.sand, flexShrink: 0 }}>{step.num}</span>
                  <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.9rem', fontWeight: '300', color: colors.charcoal, lineHeight: '1.6' }}>{step.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ borderTop: `1px solid ${colors.sand}`, paddingTop: '4rem' }}>
            <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: colors.tan, marginBottom: '0.75rem' }}>Start Here</p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', fontWeight: '400', color: colors.ink, marginBottom: '0.5rem' }}>Tell me about your trip.</h2>
            <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.875rem', fontWeight: '300', color: colors.mid, marginBottom: '2.5rem', lineHeight: '1.6' }}>The more specific you are, the better the plan.</p>

            <form onSubmit={handleSubmit} style={{ maxWidth: '620px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>
                <div><label style={labelStyle} htmlFor="name">Name</label><input id="name" name="name" type="text" required value={form.name} onChange={handleChange} style={inputStyle} placeholder="Your name" /></div>
                <div><label style={labelStyle} htmlFor="email">Email</label><input id="email" name="email" type="email" required value={form.email} onChange={handleChange} style={inputStyle} placeholder="your@email.com" /></div>
              </div>
              <label style={labelStyle} htmlFor="destinations">Destination(s) you're interested in</label>
              <input id="destinations" name="destinations" type="text" required value={form.destinations} onChange={handleChange} style={inputStyle} placeholder="Portugal, Italy, both..." />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>
                <div><label style={labelStyle} htmlFor="dates">Travel dates</label><input id="dates" name="dates" type="text" value={form.dates} onChange={handleChange} style={inputStyle} placeholder="June 2025, flexible..." /></div>
                <div><label style={labelStyle} htmlFor="length">Trip length</label><input id="length" name="length" type="text" value={form.length} onChange={handleChange} style={inputStyle} placeholder="10 days, 2 weeks..." /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>
                <div>
                  <label style={labelStyle} htmlFor="party">Travel party</label>
                  <select id="party" name="party" value={form.party} onChange={handleChange} style={selectStyle}>
                    <option value="">Select...</option>
                    <option value="solo">Solo</option>
                    <option value="couple">Couple</option>
                    <option value="friends">Friends</option>
                    <option value="family">Family</option>
                    <option value="group">Group</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle} htmlFor="budget">Budget tier</label>
                  <select id="budget" name="budget" value={form.budget} onChange={handleChange} style={selectStyle}>
                    <option value="">Select...</option>
                    <option value="budget">Budget</option>
                    <option value="mid-range">Mid-range</option>
                    <option value="splurge">Splurge</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>
              </div>
              <label style={labelStyle} htmlFor="notes">Vibe and pace notes</label>
              <textarea id="notes" name="notes" rows={3} value={form.notes} onChange={handleChange} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'system-ui, sans-serif' }} placeholder="Slow and food-focused. Prefer smaller towns. Love markets and local wine bars..." />
              <label style={labelStyle} htmlFor="avoid">Anything specific you want or want to avoid</label>
              <textarea id="avoid" name="avoid" rows={3} value={form.avoid} onChange={handleChange} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'system-ui, sans-serif' }} placeholder="No big tourist sites, needs AC, vegetarian, allergies..." />
              <button type="submit" style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: colors.white, backgroundColor: colors.gold, border: 'none', padding: '1rem 2.5rem', cursor: 'pointer', marginTop: '0.5rem' }}>Send My Brief</button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
"""

w('src/pages/WorkWithMe.jsx', WORK_WITH_ME)

ADVISOR_LOGIN = r"""
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const colors = {
  cream: '#F5F0E8', sand: '#D8CCBA', tan: '#C8B89A', gold: '#9E8660',
  mid: '#7A6E62', ink: '#1E1C18', white: '#FDFAF5',
}

const PASSPHRASE = 'deriva2024'

export default function AdvisorLogin() {
  const navigate = useNavigate()
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (value === PASSPHRASE) { sessionStorage.setItem('deriva_advisor', 'true'); navigate('/advisor/dashboard') }
    else { setError(true); setValue('') }
  }

  return (
    <div style={{ backgroundColor: colors.cream, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ maxWidth: '360px', width: '100%' }}>
        <p style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: colors.ink, marginBottom: '2.5rem' }}>Deriva</p>
        <form onSubmit={handleSubmit}>
          <label style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: colors.tan, display: 'block', marginBottom: '0.5rem' }}>Passphrase</label>
          <input
            type="password"
            value={value}
            onChange={e => { setValue(e.target.value); setError(false) }}
            autoFocus
            style={{ width: '100%', fontFamily: 'system-ui, sans-serif', fontSize: '1rem', color: colors.ink, backgroundColor: colors.white, border: `1px solid ${error ? '#9E6060' : colors.sand}`, padding: '0.75rem 1rem', outline: 'none', marginBottom: '1rem' }}
          />
          {error && <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.75rem', color: '#9E6060', marginBottom: '1rem' }}>Incorrect passphrase.</p>}
          <button type="submit" style={{ width: '100%', fontFamily: 'system-ui, sans-serif', fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: colors.white, backgroundColor: colors.gold, border: 'none', padding: '0.9rem', cursor: 'pointer' }}>Enter</button>
        </form>
      </div>
    </div>
  )
}
"""

ADVISOR_DASHBOARD = r"""
import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const colors = {
  cream: '#F5F0E8', parchment: '#EDE6D8', sand: '#D8CCBA', tan: '#C8B89A',
  gold: '#9E8660', mid: '#7A6E62', charcoal: '#3A3630', ink: '#1E1C18', white: '#FDFAF5', bark: '#2A2520',
}

const sections = [
  { label: 'New Client Brief', desc: 'Enter client details and generate a full research brief.' },
  { label: 'My Spots', desc: 'Upload and manage your personally vetted places.' },
  { label: 'Research Tool', desc: 'Freeform AI research assistant for destination questions.' },
  { label: 'Client Notes', desc: 'Lightweight notes and status tracker per client.' },
]

export default function AdvisorDashboard() {
  const navigate = useNavigate()

  useEffect(() => {
    if (!sessionStorage.getItem('deriva_advisor')) navigate('/advisor')
  }, [])

  const handleLogout = () => { sessionStorage.removeItem('deriva_advisor'); navigate('/advisor') }

  return (
    <div style={{ backgroundColor: colors.cream, minHeight: '100vh' }}>
      <div style={{ borderBottom: `1px solid ${colors.sand}`, padding: '0 2rem', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.cream }}>
        <p style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: colors.ink }}>Deriva Advisor</p>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link to="/" style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: colors.tan, textDecoration: 'none' }}>Public Site</Link>
          <button onClick={handleLogout} style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: colors.mid, background: 'none', border: 'none', cursor: 'pointer' }}>Sign Out</button>
        </div>
      </div>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '4rem 2rem' }}>
        <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: colors.tan, marginBottom: '0.75rem' }}>Advisor Platform</p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', fontWeight: '400', color: colors.ink, marginBottom: '3rem' }}>Dashboard</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0', border: `1px solid ${colors.sand}` }}>
          {sections.map((s, i) => (
            <div key={s.label} style={{ padding: '2rem', borderRight: i % 2 === 0 ? `1px solid ${colors.sand}` : 'none', borderBottom: i < 2 ? `1px solid ${colors.sand}` : 'none', backgroundColor: colors.white }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', fontWeight: '400', color: colors.ink, marginBottom: '0.5rem' }}>{s.label}</h2>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.85rem', fontWeight: '300', color: colors.mid, lineHeight: '1.6', marginBottom: '1.5rem' }}>{s.desc}</p>
              <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: colors.tan, border: `1px solid ${colors.sand}`, padding: '0.25rem 0.6rem' }}>Coming in Phase 2</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
"""

w('src/advisor/AdvisorLogin.jsx', ADVISOR_LOGIN)
w('src/advisor/AdvisorDashboard.jsx', ADVISOR_DASHBOARD)

print('\nAll files written successfully.')
print(f'Project created at: {BASE}')
PYEOF

# ── Install dependencies ──────────────────────────────────────────
echo ""
echo "Installing dependencies..."
cd ~/deriva
npm install

# ── Done ─────────────────────────────────────────────────────────
echo ""
echo "================================================================"
echo "  Deriva is ready."
echo ""
echo "  Add your Anthropic API key:"
echo "  open ~/deriva/.env"
echo ""
echo "  Then start the dev server:"
echo "  cd ~/deriva && npm run dev"
echo ""
echo "  App will be at: http://localhost:5173"
echo "================================================================"
echo ""
echo "Starting dev server now..."
cd ~/deriva
open http://localhost:5173
npm run dev

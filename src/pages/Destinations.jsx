import { Link } from 'react-router-dom'
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

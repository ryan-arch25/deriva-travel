import { useState } from 'react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import DestinationFooter from '../components/DestinationFooter'
import { regions, restaurants, stays, logistics } from '../data/spain'

const colors = {
  cream: '#F5F0E8',
  parchment: '#EDE6D8',
  sand: '#D8CCBA',
  tan: '#C8B89A',
  gold: '#9E8660',
  mid: '#7A6E62',
  charcoal: '#3A3630',
  ink: '#1E1C18',
  white: '#FDFAF5',
}

const TABS = ['Explore', 'Eat', 'Stay', 'Logistics']

export default function Spain() {
  const [activeTab, setActiveTab] = useState('Explore')

  const tabStyle = (tab) => ({
    fontFamily: 'system-ui, sans-serif',
    fontSize: '0.7rem',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: activeTab === tab ? colors.ink : colors.tan,
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: activeTab === tab ? `2px solid ${colors.gold}` : '2px solid transparent',
    padding: '1rem 1.5rem',
    cursor: 'pointer',
    marginBottom: '-1px',
  })

  return (
    <div style={{ backgroundColor: colors.cream, minHeight: '100vh' }}>
      <Nav />
      <div>
        <div style={{ position: 'relative', height: '70vh', minHeight: '520px', overflow: 'hidden' }}>
          <img
            src="/images/spain.jpg"
            alt="Spain"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(20,18,14,0.85) 0%, rgba(20,18,14,0.4) 55%, rgba(20,18,14,0.1) 100%)',
            display: 'flex',
            alignItems: 'flex-end',
            padding: '4rem 2rem',
          }}>
            <div style={{ maxWidth: '1100px', width: '100%', margin: '0 auto' }}>
              <p style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '0.65rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(253,250,245,0.6)',
                marginBottom: '1rem',
              }}>
                Destinations
              </p>
              <h1 style={{
                fontFamily: 'Georgia, serif',
                fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                fontWeight: '400',
                color: '#FDFAF5',
                letterSpacing: '0.04em',
                marginBottom: '1rem',
                lineHeight: '1',
              }}>
                Spain
              </h1>
              <p style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '1rem',
                fontWeight: '300',
                color: 'rgba(253,250,245,0.8)',
                maxWidth: '520px',
                lineHeight: '1.7',
              }}>
                Eat late. Walk more. The best meals are in places without English menus outside. Extremadura is worth the detour.
              </p>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 2rem' }}>
          <div style={{ display: 'flex', borderBottom: `1px solid ${colors.sand}`, marginBottom: '3rem' }}>
            {TABS.map(tab => <button key={tab} style={tabStyle(tab)} onClick={() => setActiveTab(tab)}>{tab}</button>)}
          </div>

          {activeTab === 'Explore' && (
            <div>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: colors.tan, marginBottom: '2rem' }}>Regions to Know</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                {regions.map(region => (
                  <div key={region.name} style={{ borderTop: `1px solid ${colors.sand}`, paddingTop: '1.5rem' }}>
                    <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.2rem', fontWeight: '400', color: colors.ink, marginBottom: '0.75rem' }}>{region.name}</h3>
                    <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.875rem', fontWeight: '300', color: colors.mid, lineHeight: '1.7', marginBottom: '1rem' }}>{region.description}</p>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {region.vibe.map(tag => (
                        <span key={tag} style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: colors.tan, border: `1px solid ${colors.sand}`, padding: '0.25rem 0.6rem' }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Eat' && (
            <div>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: colors.tan, marginBottom: '0.5rem' }}>Curated Restaurants</p>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.85rem', fontWeight: '300', color: colors.mid, marginBottom: '2rem', lineHeight: '1.6' }}>Spain's food culture rewards the patient and the curious. These places do.</p>
              {restaurants.map(r => <SpotRow key={r.name} spot={r} />)}
            </div>
          )}

          {activeTab === 'Stay' && (
            <div>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: colors.tan, marginBottom: '0.5rem' }}>Where to Stay</p>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.85rem', fontWeight: '300', color: colors.mid, marginBottom: '2rem', lineHeight: '1.6' }}>Spain's Paradores network alone is worth knowing about. These picks go beyond them.</p>
              {stays.map(s => <SpotRow key={s.name} spot={s} />)}
            </div>
          )}

          {activeTab === 'Logistics' && <LogisticsTab />}

          <DestinationFooter
            country="Spain"
            whyCopy="Spain has more regional variety than most people realize. Madrid, the Basque Country, the Costa Brava, and Andalusia are four completely different trips. Best for people who want food, culture, and late nights in equal measure."
          />
        </div>
      </div>
      <Footer />
    </div>
  )
}

function LogisticsTab() {
  return (
    <div style={{ maxWidth: '700px' }}>
      {[
        { label: 'Best Time to Visit', content: logistics.bestTime },
        { label: 'Getting Around', content: logistics.gettingAround },
        { label: 'Visa Notes', content: logistics.visaNotes },
      ].map((item, i) => (
        <div key={item.label} style={{ marginBottom: '2.5rem', borderTop: i > 0 ? `1px solid ${colors.sand}` : 'none', paddingTop: i > 0 ? '2rem' : '0' }}>
          <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: colors.tan, marginBottom: '0.75rem' }}>{item.label}</p>
          <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.9rem', fontWeight: '300', color: colors.charcoal, lineHeight: '1.7' }}>{item.content}</p>
        </div>
      ))}
      <div style={{ borderTop: `1px solid ${colors.sand}`, paddingTop: '2rem' }}>
        <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: colors.tan, marginBottom: '0.75rem' }}>Book Ahead</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {logistics.bookAhead.map((item, i) => (
            <li key={i} style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.9rem', fontWeight: '300', color: colors.charcoal, lineHeight: '1.7', paddingLeft: '1rem', position: 'relative', marginBottom: '0.35rem' }}>
              <span style={{ position: 'absolute', left: 0, color: colors.gold }}>&mdash;</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function SpotRow({ spot }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', borderBottom: `1px solid ${colors.sand}`, padding: '1.5rem 0', alignItems: 'start' }}>
      <div>
        <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.05rem', fontWeight: '400', color: colors.ink, marginBottom: '0.25rem' }}>{spot.name}</h3>
        <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.7rem', color: colors.tan, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: spot.address ? '0.25rem' : '0.6rem' }}>{spot.neighborhood ? <>{spot.neighborhood} &middot; {spot.city}</> : spot.city}</p>
        {spot.address && <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.75rem', fontWeight: '300', color: colors.tan, marginBottom: '0.6rem' }}>{spot.address}</p>}
        <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.875rem', fontWeight: '300', color: colors.mid, lineHeight: '1.65' }}>{spot.note}</p>
        <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.6rem', flexWrap: 'wrap' }}>
          {spot.vibe?.map(tag => (
            <span key={tag} style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.tan, border: `1px solid ${colors.sand}`, padding: '0.2rem 0.5rem' }}>{tag}</span>
          ))}
        </div>
      </div>
      {spot.priceTier && <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.8rem', color: colors.gold, whiteSpace: 'nowrap' }}>{spot.priceTier}</span>}
    </div>
  )
}

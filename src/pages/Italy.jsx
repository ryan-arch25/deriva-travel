import { useState } from 'react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import RecommendationEngine from '../components/RecommendationEngine'
import { regions, restaurants, stays, logistics } from '../data/italy'

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

export default function Italy() {
  const [activeTab, setActiveTab] = useState('Explore')

  const tabBarStyle = {
    display: 'flex',
    gap: '0',
    borderBottom: `1px solid ${colors.sand}`,
    marginBottom: '3rem',
  }

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
            src="/images/italy.jpg"
            alt="Italy"
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
                Italy
              </h1>
              <p style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '1rem',
                fontWeight: '300',
                color: 'rgba(253,250,245,0.8)',
                maxWidth: '520px',
                lineHeight: '1.7',
              }}>
                Skip the lines. Go south. Eat lunch like it matters. The Italy worth finding is not the Italy everyone is photographing.
              </p>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 2rem' }}>
          <div style={tabBarStyle}>
            {TABS.map(tab => (
              <button key={tab} style={tabStyle(tab)} onClick={() => setActiveTab(tab)}>
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'Explore' && <ExploreTab />}
          {activeTab === 'Eat' && <EatTab />}
          {activeTab === 'Stay' && <StayTab />}
          {activeTab === 'Logistics' && <LogisticsTab />}

          <RecommendationEngine
            destination="Italy"
            restaurants={restaurants}
            stays={stays}
          />
        </div>
      </div>
      <Footer />
    </div>
  )
}

function ExploreTab() {
  return (
    <div>
      <p style={{
        fontFamily: 'system-ui, sans-serif',
        fontSize: '0.65rem',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: colors.tan,
        marginBottom: '2rem',
      }}>
        Regions to Know
      </p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem',
      }}>
        {regions.map(region => (
          <div key={region.name} style={{
            borderTop: `1px solid ${colors.sand}`,
            paddingTop: '1.5rem',
          }}>
            <h3 style={{
              fontFamily: 'Georgia, serif',
              fontSize: '1.2rem',
              fontWeight: '400',
              color: colors.ink,
              marginBottom: '0.75rem',
            }}>
              {region.name}
            </h3>
            <p style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '0.875rem',
              fontWeight: '300',
              color: colors.mid,
              lineHeight: '1.7',
              marginBottom: '1rem',
            }}>
              {region.description}
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {region.vibe.map(tag => (
                <span key={tag} style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '0.6rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: colors.tan,
                  border: `1px solid ${colors.sand}`,
                  padding: '0.25rem 0.6rem',
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function EatTab() {
  return (
    <div>
      <p style={{
        fontFamily: 'system-ui, sans-serif',
        fontSize: '0.65rem',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: colors.tan,
        marginBottom: '0.5rem',
      }}>
        Curated Restaurants
      </p>
      <p style={{
        fontFamily: 'system-ui, sans-serif',
        fontSize: '0.85rem',
        fontWeight: '300',
        color: colors.mid,
        marginBottom: '2rem',
        lineHeight: '1.6',
      }}>
        Every place on this list was chosen for a reason. Read the note.
      </p>
      {restaurants.map(r => (
        <SpotRow key={r.name} spot={r} />
      ))}
    </div>
  )
}

function StayTab() {
  return (
    <div>
      <p style={{
        fontFamily: 'system-ui, sans-serif',
        fontSize: '0.65rem',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: colors.tan,
        marginBottom: '0.5rem',
      }}>
        Where to Stay
      </p>
      <p style={{
        fontFamily: 'system-ui, sans-serif',
        fontSize: '0.85rem',
        fontWeight: '300',
        color: colors.mid,
        marginBottom: '2rem',
        lineHeight: '1.6',
      }}>
        Chosen for character and location. Not for the number of stars on the listing.
      </p>
      {stays.map(s => (
        <SpotRow key={s.name} spot={s} />
      ))}
    </div>
  )
}

function LogisticsTab() {
  return (
    <div style={{ maxWidth: '700px' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: '0.65rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: colors.tan,
          marginBottom: '0.75rem',
        }}>
          Best Time to Visit
        </p>
        <p style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: '0.9rem',
          fontWeight: '300',
          color: colors.charcoal,
          lineHeight: '1.7',
        }}>
          {logistics.bestTime}
        </p>
      </div>

      <div style={{ marginBottom: '2.5rem', borderTop: `1px solid ${colors.sand}`, paddingTop: '2rem' }}>
        <p style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: '0.65rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: colors.tan,
          marginBottom: '0.75rem',
        }}>
          Getting Around
        </p>
        <p style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: '0.9rem',
          fontWeight: '300',
          color: colors.charcoal,
          lineHeight: '1.7',
        }}>
          {logistics.gettingAround}
        </p>
      </div>

      <div style={{ marginBottom: '2.5rem', borderTop: `1px solid ${colors.sand}`, paddingTop: '2rem' }}>
        <p style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: '0.65rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: colors.tan,
          marginBottom: '0.75rem',
        }}>
          Book Ahead
        </p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {logistics.bookAhead.map((item, i) => (
            <li key={i} style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '0.9rem',
              fontWeight: '300',
              color: colors.charcoal,
              lineHeight: '1.7',
              paddingLeft: '1rem',
              position: 'relative',
              marginBottom: '0.35rem',
            }}>
              <span style={{ position: 'absolute', left: 0, color: colors.gold }}>&mdash;</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ borderTop: `1px solid ${colors.sand}`, paddingTop: '2rem' }}>
        <p style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: '0.65rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: colors.tan,
          marginBottom: '0.75rem',
        }}>
          Visa Notes
        </p>
        <p style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: '0.9rem',
          fontWeight: '300',
          color: colors.charcoal,
          lineHeight: '1.7',
        }}>
          {logistics.visaNotes}
        </p>
      </div>
    </div>
  )
}

function SpotRow({ spot }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      gap: '1rem',
      borderBottom: `1px solid ${colors.sand}`,
      padding: '1.5rem 0',
      alignItems: 'start',
    }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.25rem' }}>
          <h3 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '1.05rem',
            fontWeight: '400',
            color: colors.ink,
          }}>
            {spot.name}
          </h3>
          {spot.isAdvisorPick && (
            <span style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '0.55rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: colors.gold,
              border: `1px solid ${colors.gold}`,
              padding: '0.15rem 0.4rem',
            }}>
              Advisor Pick
            </span>
          )}
        </div>
        <p style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: '0.7rem',
          color: colors.tan,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '0.6rem',
        }}>
          {spot.neighborhood} &middot; {spot.city}
        </p>
        <p style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: '0.875rem',
          fontWeight: '300',
          color: colors.mid,
          lineHeight: '1.65',
        }}>
          {spot.note}
        </p>
        <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.6rem', flexWrap: 'wrap' }}>
          {spot.vibe?.map(tag => (
            <span key={tag} style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '0.6rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: colors.tan,
              border: `1px solid ${colors.sand}`,
              padding: '0.2rem 0.5rem',
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
      <span style={{
        fontFamily: 'system-ui, sans-serif',
        fontSize: '0.8rem',
        color: colors.gold,
        whiteSpace: 'nowrap',
      }}>
        {spot.priceTier}
      </span>
    </div>
  )
}

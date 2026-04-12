import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || ''

const SECTIONS = [
  { id: 'como', label: 'Como' },
  { id: 'bellagio', label: 'Bellagio' },
  { id: 'varenna', label: 'Varenna' },
  { id: 'lugano', label: 'Lugano' },
]

const CATEGORY_COLORS = {
  restaurant: '#c0614a',
  hotel: '#b8963e',
  experience: '#2c4a6e',
}

const LAKE_STOPS = [
  // Restaurants
  { name: 'Giulietta al Lago', lat: 45.814, lng: 9.082, category: 'restaurant', note: 'Lakefront promenade. Campari spritz. The ritual.' },
  { name: 'Ristorante Gatto Nero', lat: 45.841, lng: 9.063, category: 'restaurant', note: 'Hillside views over the lake. Classic northern Italian.' },
  { name: 'Figli dei Fiori Osteria', lat: 45.820, lng: 9.087, category: 'restaurant', note: 'The best dinner in Como proper.' },
  { name: 'Trattoria San Giacomo', lat: 45.986, lng: 9.259, category: 'restaurant', note: 'Risotto and lake fish in Bellagio. Locals eat here.' },
  { name: 'Federico Cernobbio', lat: 45.844, lng: 9.062, category: 'restaurant', note: 'Modern northern Italian, beautiful room.' },
  { name: 'Il Cavatappi', lat: 46.016, lng: 9.287, category: 'restaurant', note: 'Lakefront terrace in Varenna. Best meal of the trip.' },
  { name: 'Hostaria Cernobbio', lat: 45.839, lng: 9.061, category: 'restaurant', note: 'Outdoor seating, traditional northern Italian.' },
  { name: 'Grotto della Salute', lat: 46.011, lng: 8.963, category: 'restaurant', note: 'The Swiss-Italian version of a trattoria. This one is real.' },
  // Hotels
  { name: 'Palace Hotel Como', lat: 45.811, lng: 9.085, category: 'hotel', note: 'Right on the lake. Ask for a lake-facing room.' },
  // Experiences
  { name: 'Vaporina Boat Tour', lat: 45.811, lng: 9.085, category: 'experience', note: 'Private wooden motorboat. Two hours. Non-negotiable. Pickup in Como.' },
  { name: 'Villa Melzi Gardens', lat: 45.981, lng: 9.259, category: 'experience', note: 'Lakeside gardens at water level. Bellagio.' },
  { name: 'Villa Monastero', lat: 46.014, lng: 9.287, category: 'experience', note: 'Gardens running along the lake edge. Varenna.' },
  { name: 'Piazza della Riforma', lat: 46.004, lng: 8.951, category: 'experience', note: 'Coffee in Switzerland. Completely different energy.' },
]

let mapboxLoadPromise = null
function loadMapbox() {
  if (mapboxLoadPromise) return mapboxLoadPromise
  mapboxLoadPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined') { resolve(null); return }
    if (window.mapboxgl) { resolve(window.mapboxgl); return }

    // Load CSS from official Mapbox CDN and wait for it to finish parsing
    // before resolving. Without the CSS applied, the internal canvas renders
    // 0x0 inside the container and the map appears blank.
    const cssHref = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css'
    const existing = Array.from(document.head.querySelectorAll('link[rel="stylesheet"]')).find((l) => l.href === cssHref)
    let cssReady
    if (existing) {
      cssReady = Promise.resolve()
    } else {
      cssReady = new Promise((res) => {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = cssHref
        link.onload = () => res()
        link.onerror = () => res() // still try to render
        document.head.appendChild(link)
      })
    }

    const jsReady = new Promise((res, rej) => {
      const script = document.createElement('script')
      script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js'
      script.onload = () => res(window.mapboxgl)
      script.onerror = () => rej(new Error('Failed to load mapbox-gl script'))
      document.head.appendChild(script)
    })

    Promise.all([cssReady, jsReady])
      .then(([, mapboxgl]) => resolve(mapboxgl))
      .catch(reject)
  })
  return mapboxLoadPromise
}

function StaticLakeMap() {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const [tokenError, setTokenError] = useState(false)

  const validToken = MAPBOX_TOKEN && MAPBOX_TOKEN.startsWith('pk.') && !MAPBOX_TOKEN.includes('PLACEHOLDER')

  useEffect(() => {
    let cancelled = false
    // Diagnostic log so we can verify the token is available at mount time
    if (typeof window !== 'undefined') {
      const tokenPreview = MAPBOX_TOKEN ? `${MAPBOX_TOKEN.slice(0, 8)}...${MAPBOX_TOKEN.slice(-4)} (len ${MAPBOX_TOKEN.length})` : '(missing)'
      // eslint-disable-next-line no-console
      console.log('[Deriva LakeComo map] VITE_MAPBOX_TOKEN:', tokenPreview, 'validToken:', validToken)
    }
    if (!validToken) return

    loadMapbox().then((mapboxgl) => {
      if (cancelled || !containerRef.current || !mapboxgl) return

      // Set token BEFORE creating the map
      mapboxgl.accessToken = MAPBOX_TOKEN

      // Sanity check: ensure container has measurable dimensions
      const rect = containerRef.current.getBoundingClientRect()
      // eslint-disable-next-line no-console
      console.log('[Deriva LakeComo map] container size:', rect.width, 'x', rect.height)

      const map = new mapboxgl.Map({
        container: containerRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [9.18, 45.93],
        zoom: 9.5,
        interactive: true,
        scrollZoom: false,
        dragRotate: false,
        pitchWithRotate: false,
        touchZoomRotate: false,
        attributionControl: false,
      })
      mapRef.current = map

      // Re-enable touch zoom but without rotation
      try {
        map.touchZoomRotate.enable()
        map.touchZoomRotate.disableRotation()
      } catch {}

      // Add zoom control buttons in top right
      try {
        map.addControl(new mapboxgl.NavigationControl({ showCompass: false, showZoom: true, visualizePitch: false }), 'top-right')
      } catch {}

      // Enable scroll zoom only after the user clicks the map once
      const enableScrollOnce = () => {
        try { map.scrollZoom.enable() } catch {}
      }
      map.once('click', enableScrollOnce)

      map.on('error', (e) => {
        // eslint-disable-next-line no-console
        console.warn('[Deriva LakeComo map] mapbox error:', e?.error?.status, e?.error?.message)
        if (e?.error?.status === 401 || e?.error?.status === 403) {
          setTokenError(true)
        }
      })

      // Force a resize after first paint in case the container grew after init
      map.on('style.load', () => {
        setTimeout(() => { try { map.resize() } catch {} }, 0)
      })

      map.on('load', () => {
        // Custom category-colored markers with clickable popups. No route lines.
        LAKE_STOPS.forEach((stop) => {
          const color = CATEGORY_COLORS[stop.category] || '#c0614a'
          const wrap = document.createElement('div')
          wrap.style.cssText = 'display:flex;flex-direction:column;align-items:center;cursor:pointer;'
          const pin = document.createElement('div')
          pin.style.cssText = `width:16px;height:16px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.28);`
          wrap.appendChild(pin)
          const label = document.createElement('span')
          label.textContent = stop.name
          label.style.cssText = `font-family:'Jost',sans-serif;font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:${color};background:rgba(245,240,232,0.94);padding:2px 7px;margin-top:4px;border-radius:2px;white-space:nowrap;font-weight:500;`
          wrap.appendChild(label)

          const popupHtml = `
            <div class="deriva-popup">
              <div class="deriva-popup-name">${stop.name}</div>
              <div class="deriva-popup-note">"${stop.note}"</div>
            </div>
          `

          const popup = new mapboxgl.Popup({
            offset: 26,
            closeButton: true,
            closeOnClick: true,
            className: 'deriva-popup-wrap',
            maxWidth: '260px',
          }).setHTML(popupHtml)

          new mapboxgl.Marker({ element: wrap, anchor: 'top' })
            .setLngLat([stop.lng, stop.lat])
            .setPopup(popup)
            .addTo(map)
        })

        // Tint the water layer to a clean Deriva-matching blue.
        try {
          map.setPaintProperty('water', 'fill-color', '#a8c8d8')
        } catch (err) {
          // eslint-disable-next-line no-console
          console.warn('[Deriva LakeComo map] setPaintProperty failed:', err)
        }

        // Dynamically fit the view to every pin. This is the only call
        // that determines the final center/zoom, so the constructor
        // center/zoom are just a placeholder until this runs.
        try {
          const bounds = new mapboxgl.LngLatBounds()
          LAKE_STOPS.forEach((s) => bounds.extend([s.lng, s.lat]))
          map.fitBounds(bounds, { padding: 60, animate: false, maxZoom: 11 })
        } catch (err) {
          // eslint-disable-next-line no-console
          console.warn('[Deriva LakeComo map] fitBounds failed:', err)
        }
      })
    }).catch(() => { if (!cancelled) setTokenError(true) })

    return () => {
      cancelled = true
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null }
    }
  }, [validToken])

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 640
  const mapHeight = isMobile ? 260 : 380

  return (
    <div className="lake-map-section">
      <div
        ref={containerRef}
        className="lake-map-canvas"
        style={{ width: '100%', height: `${mapHeight}px`, position: 'relative' }}
      >
        {(!validToken || tokenError) && (
          <div className="lake-map-fallback">
            <p>Map preview unavailable. Add a valid Mapbox token to Vercel env (VITE_MAPBOX_TOKEN) and redeploy.</p>
          </div>
        )}
        {validToken && !tokenError && (
          <div className="lake-map-legend">
            <div className="lake-legend-row">
              <span className="lake-legend-dot" style={{ background: '#c0614a' }} />
              <span>Restaurants</span>
            </div>
            <div className="lake-legend-row">
              <span className="lake-legend-dot" style={{ background: '#b8963e' }} />
              <span>Hotels</span>
            </div>
            <div className="lake-legend-row">
              <span className="lake-legend-dot" style={{ background: '#2c4a6e' }} />
              <span>Experiences</span>
            </div>
          </div>
        )}
      </div>
      <p className="lake-map-caption">
        Your portal includes this map for every day of your trip, each stop tappable and GPS-aware on your phone.{' '}
        <Link to="/work-with-me">Interactive version</Link>
        {' '}available to every client.
      </p>
    </div>
  )
}

function DayCard({ number, date, theme, badge, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen)
  const toggle = () => setOpen((prev) => !prev)
  const onKey = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggle()
    }
  }
  return (
    <div className="day-card" data-open={open}>
      <div
        role="button"
        tabIndex={0}
        className="day-header"
        onClick={toggle}
        onKeyDown={onKey}
        aria-expanded={open}
      >
        <div className="day-num-col">
          <span className="day-number">{number}</span>
          <span className="day-num-label">Day</span>
        </div>
        <div className="day-info">
          <div className="day-date">{date}</div>
          <div className="day-theme">{theme}</div>
        </div>
        <span className="day-badge">{badge}</span>
        <span className="day-toggle" aria-hidden="true">{open ? '–' : '+'}</span>
      </div>
      {open && <div className="day-body">{children}</div>}
    </div>
  )
}

function Transport({ title, detail }) {
  return (
    <div className="transport">
      <div className="transport-detail">
        <strong>{title}</strong>
        <span>{detail}</span>
      </div>
    </div>
  )
}

function Meal({ type, label, name, note, children }) {
  return (
    <div className={`meal-block ${type}`}>
      <div>
        <span className="meal-label">{label}</span>
        <span className="meal-name">{name || children}</span>
        {note && <span className="meal-note">{note}</span>}
      </div>
    </div>
  )
}

function AdvisorNote({ label = 'Advisor Note', children }) {
  return (
    <div className="advisor-note">
      <span className="advisor-note-label">{label}</span>
      <p>{children}</p>
    </div>
  )
}

function HotelCallout({ label = "Where You're Staying", name, detail, href }) {
  return (
    <div className="hotel-callout">
      <div>
        <span className="hotel-callout-label">{label}</span>
        <span className="hotel-callout-name">
          {href ? <a href={href} target="_blank" rel="noopener noreferrer">{name}</a> : name}
        </span>
        <span className="hotel-callout-detail">{detail}</span>
      </div>
    </div>
  )
}

function LockedBlock({ title, sub, items }) {
  return (
    <div className="locked-block">
      <div className="locked-header">
        <span className="locked-tag">Full Client Version</span>
        <span className="locked-title">{title}</span>
      </div>
      {sub && <p className="locked-sub">{sub}</p>}
      <ul className="locked-items">
        {items.map((it, i) => <li key={i}>{it}</li>)}
      </ul>
    </div>
  )
}

function ActivityList({ items }) {
  return (
    <ul className="activity-list">
      {items.map((it, i) => <li key={i}>{it}</li>)}
    </ul>
  )
}

export default function LakeComo() {
  const [activeSection, setActiveSection] = useState('como')
  const sectionRefs = useRef({})

  useEffect(() => {
    document.title = 'Five Days on the Lake — A Deriva Itinerary'
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    )
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const handleNavClick = (e, id) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 120
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  return (
    <div className="sample-itinerary lake-como">
      <Nav />

      <style>{`
        .sample-itinerary { --cream: #f5f0e8; --parchment: #ede5d0; --parchment-dark: #e0d5bc; --terracotta: #c0614a; --terracotta-light: rgba(192,97,74,0.1); --olive: #6b7a45; --stone: #8c7b6b; --dark: #1e1a16; --ink: #3a3028; --gold: #b8963e; --gold-light: rgba(184,150,62,0.12); --white: #fff; --lake: #4a7fa0; --lake-light: rgba(74,127,160,0.12); background: var(--cream); color: var(--ink); font-family: 'Jost', sans-serif; font-weight: 300; line-height: 1.75; }

        .sample-itinerary .hero { background: var(--dark); color: var(--cream); min-height: 92vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 80px 24px 64px; position: relative; overflow: hidden; }
        .sample-itinerary .hero::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at 20% 80%, rgba(74,127,160,0.22) 0%, transparent 55%), radial-gradient(ellipse at 80% 20%, rgba(107,122,69,0.14) 0%, transparent 50%), radial-gradient(ellipse at 55% 55%, rgba(184,150,62,0.06) 0%, transparent 60%); }
        .sample-itinerary .hero-content { position: relative; z-index: 1; max-width: 760px; }
        .sample-itinerary .hero-badges { display: flex; justify-content: center; gap: 10px; margin-bottom: 32px; flex-wrap: wrap; }
        .sample-itinerary .hero-badge { font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--gold); border: 1px solid rgba(184,150,62,0.4); padding: 6px 14px; border-radius: 2px; font-weight: 400; }
        .sample-itinerary .hero h1 { font-family: 'Cormorant Garamond', serif; font-size: clamp(60px, 11vw, 112px); font-weight: 300; line-height: 0.92; letter-spacing: -0.02em; }
        .sample-itinerary .hero h1 em { font-style: italic; color: var(--lake); display: block; }
        .sample-itinerary .hero-route { font-size: 12px; letter-spacing: 0.25em; color: rgba(245,240,232,0.45); margin-top: 22px; text-transform: uppercase; }
        .sample-itinerary .hero-divider { width: 1px; height: 48px; background: rgba(74,127,160,0.4); margin: 40px auto; }
        .sample-itinerary .hero-stats { display: flex; justify-content: center; gap: 56px; flex-wrap: wrap; }
        .sample-itinerary .stat-item { text-align: center; }
        .sample-itinerary .stat-label { font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--gold); display: block; margin-bottom: 6px; }
        .sample-itinerary .stat-value { font-family: 'Cormorant Garamond', serif; font-size: 26px; font-weight: 400; line-height: 1; }
        .sample-itinerary .hero-scroll-hint { position: absolute; bottom: 32px; left: 50%; transform: translateX(-50%); font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(245,240,232,0.3); z-index: 1; }
        .sample-itinerary .hero-scroll-hint::after { content: ''; display: block; width: 1px; height: 28px; background: rgba(245,240,232,0.2); margin: 10px auto 0; animation: lcPulse 2s ease-in-out infinite; }
        @keyframes lcPulse { 0%,100%{opacity:0.2} 50%{opacity:0.7} }

        .sample-itinerary .intro-strip { background: var(--parchment); border-top: 1px solid var(--parchment-dark); border-bottom: 1px solid var(--parchment-dark); padding: 48px 24px 36px; text-align: center; }
        .sample-itinerary .intro-strip p.quote { max-width: 640px; margin: 0 auto; font-family: 'Cormorant Garamond', serif; font-size: clamp(18px, 2.5vw, 22px); font-style: italic; font-weight: 300; color: var(--ink); line-height: 1.6; }
        .sample-itinerary .intro-strip .advisor-sig { margin-top: 20px; font-family: 'Jost', sans-serif; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--terracotta); font-style: normal; display: block; }
        .sample-itinerary .preview-note { max-width: 560px; margin: 24px auto 0; font-size: 12px; color: var(--stone); line-height: 1.65; font-style: italic; padding: 14px 20px; border: 1px solid var(--parchment-dark); background: rgba(255,255,255,0.4); }

        .sample-itinerary .section-nav { position: sticky; top: 60px; z-index: 50; background: var(--cream); border-bottom: 1px solid var(--parchment-dark); padding: 14px 24px; display: flex; justify-content: center; gap: 32px; flex-wrap: wrap; backdrop-filter: blur(8px); }
        .sample-itinerary .section-nav a { font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--stone); text-decoration: none; padding: 4px 0; border-bottom: 2px solid transparent; transition: color 0.2s, border-color 0.2s; font-weight: 400; }
        .sample-itinerary .section-nav a.active { color: var(--lake); border-bottom-color: var(--lake); }
        .sample-itinerary .section-nav a:hover { color: var(--lake); }

        .sample-itinerary main { max-width: 900px; margin: 0 auto; padding: 0 24px 100px; }

        .sample-itinerary .lake-map-section { margin: 48px 0 0; }
        .sample-itinerary .lake-map-canvas { position: relative; width: 100%; height: 380px; border-radius: 3px; overflow: hidden; border: 1px solid var(--parchment-dark); background: var(--parchment); }
        .sample-itinerary .lake-map-fallback { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; padding: 24px; text-align: center; color: var(--stone); font-size: 12px; font-style: italic; }
        .sample-itinerary .lake-map-caption { max-width: 560px; margin: 14px auto 0; font-size: 12px; color: var(--stone); line-height: 1.65; font-style: italic; text-align: center; font-family: 'Jost', sans-serif; }
        .sample-itinerary .lake-map-caption a { color: var(--terracotta); text-decoration: none; border-bottom: 1px solid rgba(192,97,74,0.35); font-style: italic; }
        .sample-itinerary .lake-map-caption a:hover { color: #a84f3a; border-color: #a84f3a; }
        .sample-itinerary .lake-map-legend { position: absolute; left: 12px; bottom: 12px; background: rgba(30,26,22,0.78); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); border-radius: 3px; padding: 10px 12px; z-index: 5; pointer-events: none; }
        .sample-itinerary .lake-legend-row { display: flex; align-items: center; gap: 8px; font-family: 'Jost', sans-serif; font-size: 9px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--cream); font-weight: 400; margin-bottom: 6px; }
        .sample-itinerary .lake-legend-row:last-child { margin-bottom: 0; }
        .sample-itinerary .lake-legend-dot { width: 8px; height: 8px; border-radius: 50%; border: 1px solid #fff; flex-shrink: 0; }

        /* Mapbox NavigationControl override to match Deriva */
        .sample-itinerary .lake-map-canvas .mapboxgl-ctrl-top-right { top: 10px; right: 10px; }
        .sample-itinerary .lake-map-canvas .mapboxgl-ctrl-group { background: transparent; box-shadow: none; border-radius: 3px; overflow: hidden; border: 1px solid rgba(245,240,232,0.15); }
        .sample-itinerary .lake-map-canvas .mapboxgl-ctrl-group button { background-color: #1e1a16; width: 32px; height: 32px; border: none; border-bottom: 1px solid rgba(245,240,232,0.12); box-shadow: 0 2px 8px rgba(30,26,22,0.2); }
        .sample-itinerary .lake-map-canvas .mapboxgl-ctrl-group button:last-child { border-bottom: none; }
        .sample-itinerary .lake-map-canvas .mapboxgl-ctrl-group button:hover { background-color: #2a2520; }
        .sample-itinerary .lake-map-canvas .mapboxgl-ctrl-group button:focus:not(:focus-visible) { box-shadow: 0 2px 8px rgba(30,26,22,0.2); }
        .sample-itinerary .lake-map-canvas .mapboxgl-ctrl-group button .mapboxgl-ctrl-icon { filter: invert(95%) sepia(10%) saturate(155%) hue-rotate(350deg) brightness(99%) contrast(91%); }

        /* Override default Mapbox popup chrome to match Deriva */
        .mapboxgl-popup.deriva-popup-wrap .mapboxgl-popup-tip { display: none; }
        .mapboxgl-popup.deriva-popup-wrap .mapboxgl-popup-content { background: #fff; border: 1px solid rgba(140,123,107,0.2); border-radius: 3px; padding: 12px 14px 10px; box-shadow: 0 6px 20px rgba(30,26,22,0.12); font-family: 'Jost', sans-serif; max-width: 240px; }
        .mapboxgl-popup.deriva-popup-wrap .mapboxgl-popup-close-button { color: #c0614a; font-size: 20px; padding: 2px 8px 4px; font-family: 'Jost', sans-serif; line-height: 1; background: none; border: none; right: 4px; top: 4px; }
        .mapboxgl-popup.deriva-popup-wrap .mapboxgl-popup-close-button:hover { color: #a84f3a; background: none; }
        .deriva-popup-name { font-family: 'Jost', sans-serif; font-size: 12px; font-weight: 500; letter-spacing: 0.04em; color: #1e1a16; margin-bottom: 6px; padding-right: 14px; }
        .deriva-popup-note { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 13px; font-style: italic; color: #3a3028; line-height: 1.55; padding-left: 10px; border-left: 2px solid #c0614a; }

        .sample-itinerary .cta-banner { background: var(--dark); color: var(--cream); border-radius: 4px; padding: 32px 40px; margin: 56px 0 0; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
        .sample-itinerary .cta-banner-text p { font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--gold); margin-bottom: 6px; }
        .sample-itinerary .cta-banner-text h3 { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 300; line-height: 1.2; }
        .sample-itinerary .cta-btn { background: var(--terracotta); color: white; text-decoration: none; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; padding: 14px 28px; white-space: nowrap; border-radius: 2px; transition: background 0.2s; flex-shrink: 0; }
        .sample-itinerary .cta-btn:hover { background: #a84f3a; }

        .sample-itinerary .base-camp { background: var(--parchment); border: 1px solid var(--parchment-dark); border-radius: 4px; padding: 24px 28px; margin-top: 32px; }
        .sample-itinerary .base-camp-label { font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--lake); display: block; margin-bottom: 10px; font-weight: 500; }
        .sample-itinerary .base-camp-name { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 400; color: var(--dark); line-height: 1.1; display: block; margin-bottom: 10px; }
        .sample-itinerary .base-camp-detail { font-size: 13px; color: var(--stone); line-height: 1.7; }

        .sample-itinerary .city-section { margin-top: 72px; scroll-margin-top: 120px; }
        .sample-itinerary .city-header { display: flex; align-items: center; gap: 20px; margin-bottom: 10px; }
        .sample-itinerary .city-tag { font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--terracotta); background: var(--terracotta-light); padding: 5px 14px; border-radius: 2px; white-space: nowrap; flex-shrink: 0; }
        .sample-itinerary .city-name { font-family: 'Cormorant Garamond', serif; font-size: clamp(36px, 5vw, 54px); font-weight: 300; line-height: 1; color: var(--dark); }
        .sample-itinerary .city-rule { flex: 1; height: 1px; background: var(--parchment-dark); border: none; }
        .sample-itinerary .city-intro { font-size: 14px; color: var(--stone); line-height: 1.7; max-width: 680px; margin-bottom: 28px; font-style: italic; }

        .sample-itinerary .day-card { background: var(--white); border: 1px solid rgba(140,123,107,0.16); border-radius: 4px; margin-bottom: 16px; overflow: hidden; transition: box-shadow 0.25s; }
        .sample-itinerary .day-card:hover { box-shadow: 0 10px 40px rgba(30,26,22,0.07); }
        .sample-itinerary .day-header { display: grid; grid-template-columns: 64px 1fr auto auto; align-items: center; gap: 0; background: var(--parchment); border: none; border-bottom: 1px solid rgba(140,123,107,0.14); padding: 0; overflow: hidden; width: 100%; cursor: pointer; text-align: left; font-family: inherit; }
        .sample-itinerary .day-card[data-open="false"] .day-header { border-bottom: none; }
        .sample-itinerary .day-num-col { padding: 18px 0; text-align: center; border-right: 1px solid rgba(140,123,107,0.14); }
        .sample-itinerary .day-number { font-family: 'Cormorant Garamond', serif; font-size: 38px; font-weight: 300; color: var(--stone); line-height: 1; display: block; }
        .sample-itinerary .day-num-label { font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--stone); opacity: 0.6; }
        .sample-itinerary .day-info { padding: 14px 20px; }
        .sample-itinerary .day-date { font-size: 13px; font-weight: 500; letter-spacing: 0.04em; color: var(--dark); }
        .sample-itinerary .day-theme { font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--stone); margin-top: 2px; }
        .sample-itinerary .day-badge { margin: 0 16px; font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--olive); border: 1px solid rgba(107,122,69,0.35); padding: 4px 10px; border-radius: 2px; white-space: nowrap; }
        .sample-itinerary .day-toggle { padding: 0 18px 0 8px; font-family: 'Cormorant Garamond', serif; font-size: 24px; color: var(--stone); font-weight: 300; line-height: 1; }
        .sample-itinerary .day-body { padding: 22px 24px 26px; }

        .sample-itinerary .transport { padding: 12px 16px; background: rgba(30,26,22,0.03); border-radius: 3px; margin: 12px 0; border-left: 3px solid var(--parchment-dark); }
        .sample-itinerary .transport-detail { font-size: 13px; }
        .sample-itinerary .transport-detail strong { font-weight: 500; display: block; color: var(--dark); margin-bottom: 2px; }
        .sample-itinerary .transport-detail span { color: var(--stone); font-size: 12px; }

        .sample-itinerary .meal-block { padding: 12px 16px; border-radius: 3px; margin: 14px 0 6px; }
        .sample-itinerary .meal-block.breakfast { background: rgba(107,122,69,0.07); border-left: 3px solid var(--olive); }
        .sample-itinerary .meal-block.lunch { background: var(--gold-light); border-left: 3px solid var(--gold); }
        .sample-itinerary .meal-block.dinner { background: var(--terracotta-light); border-left: 3px solid var(--terracotta); }
        .sample-itinerary .meal-block.aperitivo { background: var(--lake-light); border-left: 3px solid var(--lake); }
        .sample-itinerary .meal-label { font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--stone); display: block; margin-bottom: 2px; }
        .sample-itinerary .meal-name { font-size: 14px; font-weight: 400; color: var(--dark); line-height: 1.4; display: block; }
        .sample-itinerary .meal-name a { color: inherit; text-decoration: none; border-bottom: 1px solid rgba(192,97,74,0.3); transition: border-color 0.15s, color 0.15s; }
        .sample-itinerary .meal-name a:hover { color: var(--terracotta); border-color: var(--terracotta); }
        .sample-itinerary .meal-note { font-size: 12px; color: var(--stone); margin-top: 3px; display: block; line-height: 1.65; }

        .sample-itinerary .activity-list { list-style: none; margin: 10px 0; padding: 0; }
        .sample-itinerary .activity-list li { font-size: 14px; padding: 6px 0 6px 22px; position: relative; color: var(--ink); border-bottom: 1px solid rgba(140,123,107,0.08); line-height: 1.65; }
        .sample-itinerary .activity-list li:last-child { border-bottom: none; }
        .sample-itinerary .activity-list li::before { content: ''; position: absolute; left: 6px; top: 14px; width: 4px; height: 4px; border-radius: 50%; background: var(--stone); opacity: 0.45; }
        .sample-itinerary .activity-list li a { color: var(--ink); text-decoration: none; border-bottom: 1px solid rgba(192,97,74,0.25); transition: all 0.15s; }
        .sample-itinerary .activity-list li a:hover { color: var(--terracotta); border-color: var(--terracotta); }

        .sample-itinerary .note { font-size: 12px; color: var(--stone); background: var(--cream); border-radius: 3px; padding: 10px 14px; margin-top: 14px; line-height: 1.6; border-left: 2px solid var(--parchment-dark); }
        .sample-itinerary .note strong { color: var(--ink); font-weight: 500; }

        .sample-itinerary .hotel-callout { padding: 16px 18px; background: var(--parchment); border-radius: 3px; margin: 14px 0; border: 1px solid var(--parchment-dark); }
        .sample-itinerary .hotel-callout-label { font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--gold); display: block; margin-bottom: 3px; }
        .sample-itinerary .hotel-callout-name { font-size: 15px; font-weight: 400; color: var(--dark); display: block; }
        .sample-itinerary .hotel-callout-name a { color: inherit; text-decoration: none; border-bottom: 1px solid rgba(192,97,74,0.3); }
        .sample-itinerary .hotel-callout-name a:hover { color: var(--terracotta); border-color: var(--terracotta); }
        .sample-itinerary .hotel-callout-detail { font-size: 12px; color: var(--stone); margin-top: 3px; display: block; line-height: 1.65; }

        .sample-itinerary .advisor-note { background: var(--white); border: 1px solid var(--parchment-dark); border-left: 4px solid var(--terracotta); border-radius: 3px; padding: 16px 20px; margin: 14px 0; }
        .sample-itinerary .advisor-note-label { font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--terracotta); margin-bottom: 6px; display: block; font-weight: 500; }
        .sample-itinerary .advisor-note p { font-size: 13px; line-height: 1.7; color: var(--ink); }

        .sample-itinerary .locked-block { background: var(--dark); color: var(--cream); border-radius: 4px; padding: 22px 24px; margin: 18px 0; border-left: 4px solid var(--terracotta); position: relative; }
        .sample-itinerary .locked-header { display: flex; align-items: center; gap: 14px; margin-bottom: 10px; flex-wrap: wrap; }
        .sample-itinerary .locked-tag { font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--terracotta); border: 1px solid rgba(192,97,74,0.6); padding: 4px 10px; border-radius: 2px; font-weight: 500; }
        .sample-itinerary .locked-title { font-family: 'Cormorant Garamond', serif; font-size: 19px; font-weight: 400; color: var(--cream); }
        .sample-itinerary .locked-sub { font-size: 12px; color: rgba(245,240,232,0.65); line-height: 1.65; margin-bottom: 12px; }
        .sample-itinerary .locked-items { list-style: none; padding: 0; margin: 0; }
        .sample-itinerary .locked-items li { font-size: 12px; color: rgba(245,240,232,0.8); padding: 6px 0 6px 18px; position: relative; line-height: 1.6; border-top: 1px solid rgba(245,240,232,0.08); }
        .sample-itinerary .locked-items li:first-child { border-top: none; }
        .sample-itinerary .locked-items li::before { content: ''; position: absolute; left: 4px; top: 14px; width: 6px; height: 1px; background: var(--terracotta); }

        .sample-itinerary .base-camp-block { background: var(--dark); color: var(--cream); border-radius: 4px; padding: 28px 32px; margin-top: 32px; }
        .sample-itinerary .base-camp-block .bc-label { font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--lake); display: block; margin-bottom: 12px; font-weight: 500; }
        .sample-itinerary .base-camp-block .bc-name { font-family: 'Cormorant Garamond', serif; font-size: 30px; font-weight: 400; color: var(--cream); line-height: 1.1; display: block; margin-bottom: 10px; }
        .sample-itinerary .base-camp-block .bc-name a { color: var(--terracotta); text-decoration: none; border-bottom: 1px solid rgba(192,97,74,0.4); transition: border-color 0.15s, color 0.15s; }
        .sample-itinerary .base-camp-block .bc-name a:hover { color: #d97a5f; border-color: #d97a5f; }
        .sample-itinerary .base-camp-block .bc-detail { font-size: 13px; color: rgba(245,240,232,0.72); line-height: 1.7; }
        .sample-itinerary .base-camp-block .bc-detail a { color: var(--terracotta); text-decoration: none; border-bottom: 1px solid rgba(192,97,74,0.4); }

        .sample-itinerary .section-rule { border: none; border-top: 1px solid var(--parchment-dark); margin: 56px 0; }

        .sample-itinerary .footer-cta { background: var(--parchment); border-top: 1px solid var(--parchment-dark); text-align: center; padding: 72px 24px; }
        .sample-itinerary .footer-cta-eyebrow { font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--terracotta); margin-bottom: 16px; display: block; }
        .sample-itinerary .footer-cta h2 { font-family: 'Cormorant Garamond', serif; font-size: clamp(32px, 5vw, 52px); font-weight: 300; color: var(--dark); line-height: 1.15; margin-bottom: 16px; }
        .sample-itinerary .footer-cta h2 em { font-style: italic; color: var(--lake); }
        .sample-itinerary .footer-cta p { font-size: 14px; color: var(--stone); max-width: 420px; margin: 0 auto 32px; line-height: 1.7; }
        .sample-itinerary .footer-cta-btn { display: inline-block; background: var(--terracotta); color: white; text-decoration: none; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; padding: 16px 36px; border-radius: 2px; transition: background 0.2s; }
        .sample-itinerary .footer-cta-btn:hover { background: #a84f3a; }

        @media (max-width: 640px) {
          .sample-itinerary .hero { min-height: 85vh; padding: 100px 20px 56px; }
          .sample-itinerary .hero-stats { gap: 24px; }
          .sample-itinerary .hero-badges { gap: 6px; margin-bottom: 24px; }
          .sample-itinerary .section-nav { gap: 18px; padding: 12px 16px; overflow-x: auto; flex-wrap: nowrap; justify-content: flex-start; }
          .sample-itinerary .day-header { grid-template-columns: 52px 1fr auto; }
          .sample-itinerary .day-badge { display: none; }
          .sample-itinerary .day-toggle { padding: 0 14px; }
          .sample-itinerary .lake-map-canvas { height: 260px; }
          .sample-itinerary .cta-banner { flex-direction: column; padding: 28px 24px; text-align: center; }
          .sample-itinerary .hero-scroll-hint { display: none; }
          .sample-itinerary .base-camp-block { padding: 22px 20px; }
        }
      `}</style>

      <header className="hero">
        <div className="hero-content">
          <div className="hero-badges">
            <span className="hero-badge">Sample Itinerary</span>
            <span className="hero-badge">Lake Como</span>
            <span className="hero-badge">Standard Tier</span>
          </div>
          <h1>Five Days<br /><em>on the Lake</em></h1>
          <p className="hero-route">Como &nbsp;&middot;&nbsp; Bellagio &nbsp;&middot;&nbsp; Varenna &nbsp;&middot;&nbsp; Lugano</p>
          <div className="hero-divider"></div>
          <div className="hero-stats">
            <div className="stat-item"><span className="stat-label">Cities</span><span className="stat-value">4</span></div>
            <div className="stat-item"><span className="stat-label">Nights</span><span className="stat-value">5</span></div>
            <div className="stat-item"><span className="stat-label">When</span><span className="stat-value" style={{ fontSize: '18px', marginTop: '3px' }}>May 1 — May 6</span></div>
          </div>
        </div>
        <span className="hero-scroll-hint">Scroll</span>
      </header>

      <div className="intro-strip">
        <p className="quote">"Lake Como is the kind of place people assume they can figure out on their own. Most do it wrong. They spend two days in Bellagio with everyone else and leave thinking they saw the lake. This itinerary goes further, a village most guides skip, a boat on private water, and a day in Switzerland most people never think to add."</p>
        <span className="advisor-sig">Ryan &nbsp;&middot;&nbsp; Deriva Travel Advisory</span>
        <div className="preview-note">This is an edited preview. The full client version includes booking instructions, reservation timing, operator links, and pre-trip notes delivered before departure.</div>
      </div>

      <nav className="section-nav">
        {SECTIONS.map(({ id, label }) => (
          <a
            key={id}
            href={`#${id}`}
            className={activeSection === id ? 'active' : ''}
            onClick={(e) => handleNavClick(e, id)}
          >
            {label}
          </a>
        ))}
      </nav>

      <main>
        <StaticLakeMap />
        <div className="cta-banner">
          <div className="cta-banner-text">
            <p>Want a trip like this?</p>
            <h3>Your itinerary, built around you.</h3>
          </div>
          <a href="/work-with-me" className="cta-btn">Start Here</a>
        </div>

        <div className="base-camp-block">
          <span className="bc-label">Base Camp — All Five Nights</span>
          <span className="bc-name"><a href="https://www.palacehotel.it/" target="_blank" rel="noopener noreferrer">Palace Hotel Como</a></span>
          <p className="bc-detail">Right on the lake, outdoor pool with views straight across the water. Ask for a lake-facing room. This is the one everyone photographs from the water, staying here is a different experience from staying in the town.</p>
        </div>

        {/* COMO */}
        <section className="city-section" id="como">
          <div className="city-header">
            <span className="city-tag">Days 1 – 2</span>
            <h2 className="city-name">Como</h2>
            <hr className="city-rule" />
          </div>
          <p className="city-intro">Two full days based in Como sets the rhythm for the lake. You arrive, settle in, and spend a full day on the water. The town is the hub it was always meant to be.</p>

          <DayCard number="1" date="Friday, May 1" theme="Fly into Milan · Train to Como · First evening on the lake" badge="Arrival">
            <Transport title="Milan Malpensa → Como San Giovanni — about 1 hour" detail="Train via Milan Centrale. Buy tickets in advance." />
            <div className="note">A private car service from Malpensa to Como is worth it on arrival, about an hour, no connections, door to door. Your driver meets you at arrivals. Significantly easier than the train when you have luggage. Ask me for the operator I recommend.</div>
            <AdvisorNote>
              The drive from Como into the city feels like nothing until you catch the first glimpse of the lake between the buildings. Let that moment happen. Check in, walk the promenade, do nothing structured for the first few hours. The lake rewards that kind of arrival.
            </AdvisorNote>
            <Meal
              type="aperitivo"
              label="Aperitivo"
              name={<a href="https://www.giuliettaallago.it" target="_blank" rel="noopener noreferrer">Giulietta al Lago</a>}
              note="Lakefront promenade, outdoor seating directly on the water. Order a Campari spritz and watch the light change. No reservations needed for the bar. This is where the trip starts properly."
            />
            <Meal
              type="dinner"
              label="Dinner"
              name="Ristorante Gatto Nero"
              note="Cernobbio, on the hillside above the lake with panoramic views. Classic northern Italian cooking. One of the best views from any restaurant on Como. Book well ahead."
            />
          </DayCard>

          <DayCard number="2" date="Saturday, May 2" theme="Private boat tour · Slow morning · Figli dei Fiori" badge="On the Water">
            <AdvisorNote>
              This is the one non-negotiable on the whole trip. A vintage wooden motorboat, completely private, two hours on the lake. You stop at Villa del Balbianello, you have seen the photos, it is better in person. Nothing else on this trip comes close. If you do one thing I tell you to do, make it this one.
            </AdvisorNote>
            <Meal
              type="lunch"
              label="Lunch"
              name="Bar Giuliani"
              note="Como town center. Keep it light. You have the boat this afternoon."
            />
            <ActivityList items={[
              'Private Vaporina boat tour — two hours, book via Lake Como Travel, bring a jacket even in May',
            ]} />
            <LockedBlock
              title="The Boat Tour — Full Details"
              sub="Boat tour operator link, booking instructions, and what the route covers on the water"
              items={[
                'Private boat operator link with specific tour recommendation and what stops to request',
                'Exact timing and what to bring on the water in early May',
                'Notes on Villa del Balbianello — what to look for and how long to spend',
              ]}
            />
            <Meal
              type="dinner"
              label="Dinner"
              name={<a href="https://figlideifiorirestaurants.com/osteria/" target="_blank" rel="noopener noreferrer">Figli dei Fiori Osteria</a>}
              note="Via Volta, Como. The best dinner in Como proper. Beautifully designed room, excellent wine list, completely unpretentious. Book ahead. This is the one you will talk about."
            />
            <Meal
              type="aperitivo"
              label="Drinks After"
              name={<a href="https://www.giuliettaallago.it" target="_blank" rel="noopener noreferrer">Giulietta al Lago</a>}
              note="By this point it becomes the ritual. Same spot, different light."
            />
          </DayCard>

        </section>

        <hr className="section-rule" />

        {/* BELLAGIO */}
        <section className="city-section" id="bellagio">
          <div className="city-header">
            <span className="city-tag">Day 3</span>
            <h2 className="city-name">Bellagio</h2>
            <hr className="city-rule" />
          </div>
          <p className="city-intro">The postcard version of Lake Como, and it earns it. Cross the lake, walk Villa Melzi at water level, get one street back from the main strip where the steep lanes above town are quieter and more interesting than anything on the waterfront.</p>

          <DayCard number="3" date="Sunday, May 3" theme="Ferry across · Villa Melzi · Federico Cernobbio" badge="Bellagio">
            <AdvisorNote>
              Bellagio is the postcard version of Lake Como and it earns it. Take the ferry over in the morning. Walk the Villa Melzi gardens at lake level, most people rush past them. Go one street back from the main strip, the steep lanes above town are quieter and more interesting than anything on the waterfront.
            </AdvisorNote>
            <Transport title="Aliscafo ferry from Como to Bellagio — about 45 minutes" detail="Buy round-trip at the Navigazione Laghi office near the hotel." />
            <ActivityList items={[
              <><a href="https://www.giardinidivillamelzi.it" target="_blank" rel="noopener noreferrer">Villa Melzi Gardens</a> — lakeside gardens, Japanese garden section, views that justify the crossing. Tickets at the gate.</>,
              'Walk the lanes above the main strip — steeper, quieter, better',
            ]} />
            <Meal
              type="lunch"
              label="Lunch in Bellagio"
              name="Trattoria San Giacomo"
              note="Steps from the main square. Risotto and lake fish. Locals eat here. Go early."
            />
            <ActivityList items={[ 'Ferry back to Como mid-afternoon' ]} />
            <Meal
              type="dinner"
              label="Dinner"
              name={<a href="https://www.federicocernobbio.it/" target="_blank" rel="noopener noreferrer">Federico Cernobbio</a>}
              note="Cernobbio. Modern northern Italian, beautiful room, excellent pasta. Reserve ahead."
            />
          </DayCard>
        </section>

        <hr className="section-rule" />

        {/* VARENNA */}
        <section className="city-section" id="varenna">
          <div className="city-header">
            <span className="city-tag">Day 4</span>
            <h2 className="city-name">Varenna</h2>
            <hr className="city-rule" />
          </div>
          <p className="city-intro">Twenty minutes by ferry from Como and a completely different experience from Bellagio. Smaller, steeper, fewer tour groups. Villa Monastero has gardens that run directly along the waterfront, you walk through them at lake level. This is the kind of place that makes someone feel like they found something.</p>

          <DayCard number="4" date="Monday, May 4" theme="The village most people skip · Villa Monastero · Back for sunset" badge="Varenna">
            <AdvisorNote>
              Most Como itineraries send you to Bellagio and call it done. Varenna is the one that separates a good trip from a great one. The gardens are extraordinary in early May. Lunch at Il Cavatappi is the best meal of the trip for a lot of people. Go on a weekday if you can, the weekends are busier now.
            </AdvisorNote>
            <Transport title="Ferry from Como to Varenna — about 45 minutes" detail="Check the Navigazione Laghi schedule, ferries run regularly." />
            <ActivityList items={[
              'Villa Monastero gardens — the gardens run right along the lake edge, unlike anything at Bellagio. Buy tickets at the entrance.',
              'Walk the village — steep lanes, the castle ruins above town, the small harbor',
            ]} />
            <Meal
              type="lunch"
              label="Lunch"
              name="Ristorante Il Cavatappi"
              note="Via XX Settembre, Varenna. Lakefront terrace, local crowd, not on most tourist radars. Order the lake fish. This is the meal most people on standard Como trips never have. Book ahead, it fills up even on weekdays."
            />
            <ActivityList items={[ 'Ferry back to Como, arrive late afternoon' ]} />
            <Meal
              type="aperitivo"
              label="Aperitivo"
              name={<a href="https://www.giuliettaallago.it" target="_blank" rel="noopener noreferrer">Giulietta al Lago</a>}
              note="Last Como evening. Same ritual, final time."
            />
            <Meal
              type="dinner"
              label="Dinner"
              name="Hostaria Cernobbio"
              note="Cernobbio. Outdoor seating, traditional northern Italian, good wine list. The right pace for a penultimate night."
            />
            <LockedBlock
              title="Varenna Logistics"
              sub="Varenna ferry timing, Villa Monastero booking, and what to order at Il Cavatappi"
              items={[
                'Exact ferry schedule from Como to Varenna and which service to take',
                'Villa Monastero advance booking link — it sells out in high season',
                'Il Cavatappi reservation instructions and specific dish recommendations',
              ]}
            />
          </DayCard>
        </section>

        <hr className="section-rule" />

        {/* LUGANO */}
        <section className="city-section" id="lugano">
          <div className="city-header">
            <span className="city-tag">Days 5 – 6</span>
            <h2 className="city-name">Lugano</h2>
            <hr className="city-rule" />
          </div>
          <p className="city-intro">An hour from Como by train and a completely different world. Italian language, Swiss precision, immaculate streets, chocolate shops that take their job seriously. Most people on a Como trip never think to add it. That is a mistake.</p>

          <DayCard number="5" date="Tuesday, May 5" theme="Day trip to Lugano · Last night in Como" badge="Switzerland">
            <AdvisorNote>
              Lugano is small enough to cover in a day without rushing. Start at Piazza della Riforma, coffee, sit, feel how different the energy is from Italy. Then walk toward the lake. The funicular up Monte San Salvatore is worth 20 minutes if the sky is clear.
            </AdvisorNote>
            <Transport title="Como San Giovanni → Lugano — about 1 hour" detail="Regional train, runs frequently. Bring your passport, you are crossing into Switzerland." />
            <ActivityList items={[
              'Piazza della Riforma — coffee, feel the Swiss-Italian mix',
              'Parco Ciani along the lake — beautiful gardens, free',
              'Cattedrale di San Lorenzo — the facade alone is worth the detour',
              'Funicular up Monte San Salvatore — panoramic views over the lake and Alps on a clear day',
              'Chocolate shops on Via Nassa — this is Switzerland. Take it seriously.',
            ]} />
            <Meal
              type="lunch"
              label="Lunch"
              name="Grotto della Salute"
              note="Stone walls, simple menu, good wine. A grotto is the Swiss-Italian version of a trattoria. This one is the real thing. Book ahead."
            />
            <Transport title="Train back to Como — late afternoon" detail="Back in time for a final dinner." />
            <Meal
              type="dinner"
              label="Dinner — Last Night"
              name="Le Rive"
              note="Lakefront restaurant in Como for the final night. Clean, modern, excellent wine list. The right note to end on."
            />
            <div className="note"><strong>Pack tonight.</strong> Train to Milan Malpensa tomorrow morning. Confirm your transfer 24 hours in advance.</div>
          </DayCard>

          <DayCard number="6" date="Wednesday, May 6" theme="Final morning · Train to Milan · Fly home" badge="Departure">
            <AdvisorNote>
              Do not go straight to the airport. You have the morning. Walk the promenade one last time, get a coffee on the water. The lake looks different when you know you are leaving.
            </AdvisorNote>
            <Transport title="Como San Giovanni → Milan Centrale → Malpensa — allow 2 hours total" detail="Including the Malpensa Express from Milan. Book all legs in advance." />
            <div className="note">Car service back to Malpensa is the right call on departure too. Book a return with the same operator.</div>
          </DayCard>
        </section>
      </main>

      <div className="footer-cta">
        <span className="footer-cta-eyebrow">This is one version of what Deriva builds</span>
        <h2>Your lake looks<br /><em>different.</em></h2>
        <p>Tell me where you want to go and what matters to you. I'll take it from there.</p>
        <a href="/work-with-me" className="footer-cta-btn">Work With Me</a>
      </div>

      <Footer />
    </div>
  )
}

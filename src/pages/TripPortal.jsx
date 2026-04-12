import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoiZGVyaXZhLWRlbW8iLCJhIjoiY2x6ZGVtb2RlbW8ifQ.placeholder'

// Fallback demo data so the portal works out of the box
const DEMO_PORTAL = {
  slug: 'sarah-como-2026',
  clientName: 'Sarah',
  tripName: 'Five Days on Lake Como',
  startDate: '2026-05-01',
  endDate: '2026-05-06',
  password: 'como2026',
  days: [
    {
      dayNumber: 1, date: 'Friday, May 1', theme: 'Arrive Como', badge: 'Arrival',
      mapCenter: { lat: 45.8108, lng: 9.0851 }, zoom: 13,
      stops: [
        { name: 'Palace Hotel Como', type: 'Check In', coordinates: { lat: 45.8108, lng: 9.0851 }, note: 'Ask for a lake-facing room. The pool is open in May.', status: 'Confirmed' },
        { name: 'Giulietta al Lago', type: 'Aperitivo', coordinates: { lat: 45.8142, lng: 9.0798 }, note: 'Lakefront promenade. Order a Campari spritz and watch the light change. This is where the trip starts properly.', status: 'Confirmed' },
        { name: 'Ristorante Gatto Nero', type: 'Dinner', coordinates: { lat: 45.8388, lng: 9.0711 }, note: 'On the hillside above the lake with panoramic views. Classic northern Italian. One of the best views from any restaurant on Como. Book well ahead.', status: 'Confirmed' },
      ],
    },
    {
      dayNumber: 2, date: 'Saturday, May 2', theme: 'On the Water', badge: 'On the Water',
      mapCenter: { lat: 46.0021, lng: 9.2154 }, zoom: 11,
      stops: [
        { name: 'Bar Giuliani', type: 'Lunch', coordinates: { lat: 45.8108, lng: 9.0851 }, note: 'Keep it light. You have the boat this afternoon.', status: 'Confirmed' },
        { name: 'Vaporina Boat Tour', type: 'Experience · 2:00 PM', coordinates: { lat: 46.0021, lng: 9.2154 }, note: 'A vintage wooden motorboat, completely private, two hours on the lake. Stopped at Balbianello. Nothing else on this trip comes close. If you do one thing I tell you to do, make it this one.', status: 'Confirmed' },
        { name: 'Figli dei Fiori Osteria', type: 'Dinner', coordinates: { lat: 45.8198, lng: 9.0867 }, note: 'Via Volta, Como. The best dinner in Como proper. Beautifully designed, excellent wine list, completely unpretentious.', status: 'Confirmed' },
      ],
    },
    {
      dayNumber: 3, date: 'Sunday, May 3', theme: 'Bellagio', badge: 'Bellagio',
      mapCenter: { lat: 45.9862, lng: 9.2618 }, zoom: 13,
      stops: [
        { name: 'Aliscafo Ferry Dock', type: 'Ferry Departure', coordinates: { lat: 45.8142, lng: 9.0834 }, note: 'Buy round-trip at Navigazione Laghi near the hotel. About 45 minutes.', status: 'Confirmed' },
        { name: 'Villa Melzi Gardens', type: 'Gardens', coordinates: { lat: 45.9812, lng: 9.2594 }, note: 'Lakeside gardens at water level. Unlike anything at Bellagio town.', status: 'Confirmed' },
        { name: 'Trattoria San Giacomo', type: 'Lunch', coordinates: { lat: 45.9867, lng: 9.2622 }, note: 'Steps from the main square. Risotto and lake fish. Go early.', status: 'Confirmed' },
        { name: 'Federico Cernobbio', type: 'Dinner', coordinates: { lat: 45.8438, lng: 9.0698 }, note: 'Modern northern Italian, beautiful room, excellent pasta. Reserve ahead.', status: 'Confirmed' },
      ],
    },
    {
      dayNumber: 4, date: 'Monday, May 4', theme: 'Varenna', badge: 'Varenna',
      mapCenter: { lat: 46.0153, lng: 9.2873 }, zoom: 13,
      stops: [
        { name: 'Villa Monastero', type: 'Gardens', coordinates: { lat: 46.0142, lng: 9.2881 }, note: 'The gardens run right along the lake edge. Unlike anything at Bellagio.', status: 'Confirmed' },
        { name: 'Il Cavatappi', type: 'Lunch', coordinates: { lat: 46.0158, lng: 9.2868 }, note: 'Lakefront terrace, local crowd, not on most tourist radars. Best meal of the trip for a lot of people.', status: 'Pending' },
        { name: 'Giulietta al Lago', type: 'Aperitivo', coordinates: { lat: 45.8142, lng: 9.0798 }, note: 'Back on the promenade. Same spot, different light. It becomes the ritual.', status: 'Confirmed' },
        { name: 'Hostaria Cernobbio', type: 'Dinner', coordinates: { lat: 45.8438, lng: 9.0698 }, note: 'Outdoor seating, traditional northern Italian, good wine. The right pace for a penultimate night.', status: 'Pending' },
      ],
    },
    {
      dayNumber: 5, date: 'Tuesday, May 5', theme: 'Lugano', badge: 'Switzerland',
      mapCenter: { lat: 46.0037, lng: 8.9511 }, zoom: 13,
      stops: [
        { name: 'Como Train Station', type: 'Train Departure', coordinates: { lat: 45.8092, lng: 9.0842 }, note: 'Regional train to Lugano, about 1 hour. Bring your passport, you are crossing into Switzerland.', status: 'Confirmed' },
        { name: 'Piazza della Riforma', type: 'Morning', coordinates: { lat: 46.0037, lng: 8.9511 }, note: 'Coffee. Sit. Feel how different the energy is from Italy. This is the whole point of adding Lugano.', status: null },
        { name: 'Grotto della Salute', type: 'Lunch', coordinates: { lat: 46.0112, lng: 8.9634 }, note: 'Stone walls, simple menu, good wine. This one is the real thing.', status: 'Confirmed' },
        { name: 'Hostaria Cernobbio', type: 'Dinner', coordinates: { lat: 45.8438, lng: 9.0698 }, note: 'Last night. Outdoor seating, good wine, right pace.', status: 'Pending' },
      ],
    },
    {
      dayNumber: 6, date: 'Wednesday, May 6', theme: 'Depart', badge: 'Departure',
      mapCenter: { lat: 45.8108, lng: 9.0851 }, zoom: 12,
      stops: [
        { name: 'Como Lakefront Promenade', type: 'Final Morning', coordinates: { lat: 45.8142, lng: 9.0798 }, note: 'Do not go straight to the airport. Walk the promenade one last time, get a coffee on the water. The lake looks different when you know you are leaving.', status: null },
        { name: 'Malpensa Departure', type: 'Departure', coordinates: { lat: 45.6301, lng: 8.7231 }, note: 'Car service to Malpensa. Allow 2 hours total. Book return with the same operator as arrival.', status: 'Confirmed' },
      ],
    },
  ],
}

let mapboxLoadPromise = null
function loadMapbox() {
  if (mapboxLoadPromise) return mapboxLoadPromise
  mapboxLoadPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined') { resolve(null); return }
    if (window.mapboxgl) { resolve(window.mapboxgl); return }

    // Load CSS from the official Mapbox CDN and wait for it to finish
    // parsing before resolving. Without the CSS applied, the internal
    // canvas renders 0x0 inside the container and the map appears blank.
    const cssHref = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css'
    const existing = Array.from(document.head.querySelectorAll('link[rel="stylesheet"]')).find((l) => l.href === cssHref)
    const cssReady = existing
      ? Promise.resolve()
      : new Promise((res) => {
          const link = document.createElement('link')
          link.rel = 'stylesheet'
          link.href = cssHref
          link.onload = () => res()
          link.onerror = () => res()
          document.head.appendChild(link)
        })

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

function PasswordGate({ onSubmit, error }) {
  const [value, setValue] = useState('')
  const handle = (e) => { e.preventDefault(); onSubmit(value) }
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#1e1a16', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px' }}>
      <div style={{ maxWidth: '360px', width: '100%', textAlign: 'center' }}>
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '14px', letterSpacing: '0.35em', textTransform: 'uppercase', color: '#f5f0e8', marginBottom: '48px', fontWeight: 400 }}>Deriva</p>
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '24px', color: '#f5f0e8', marginBottom: '28px', fontWeight: 300 }}>Your trip portal</p>
        <form onSubmit={handle}>
          <input
            type="password"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Password"
            autoFocus
            style={{
              width: '100%', fontFamily: "'Jost', system-ui, sans-serif", fontSize: '16px',
              color: '#f5f0e8', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(245,240,232,0.25)',
              padding: '14px 18px', outline: 'none', marginBottom: '16px', boxSizing: 'border-box', borderRadius: '2px',
            }}
          />
          {error && <p style={{ fontFamily: "'Jost', sans-serif", fontSize: '13px', color: '#d97a5f', marginBottom: '14px' }}>{error}</p>}
          <button type="submit" style={{ width: '100%', fontFamily: "'Jost', sans-serif", fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fff', backgroundColor: '#c0614a', border: 'none', padding: '16px', cursor: 'pointer', borderRadius: '2px' }}>Enter</button>
        </form>
      </div>
    </div>
  )
}

function normalizeStatus(s) {
  if (!s) return ''
  return String(s).trim().toLowerCase()
}

function StatusBadge({ status }) {
  if (!status) return null
  const normalized = normalizeStatus(status)
  const isConfirmed = normalized === 'confirmed'
  const isPending = normalized === 'pending'
  if (!isConfirmed && !isPending && !/confirmed|pending/.test(normalized)) {
    // Unrecognized status string, render as-is in muted style
  }
  const color = isConfirmed ? '#6b7a45' : '#b8963e'
  const bg = isConfirmed ? 'rgba(107,122,69,0.12)' : 'rgba(184,150,62,0.14)'
  const label = /confirmed|pending/.test(normalized) ? status : status
  return (
    <span style={{ fontFamily: "'Jost', sans-serif", fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color, backgroundColor: bg, padding: '4px 10px', border: `1px solid ${color}33`, borderRadius: '2px', whiteSpace: 'nowrap' }}>
      {label}
    </span>
  )
}

function PortalMap({ stops, center, zoom, height = 320 }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const validToken = MAPBOX_TOKEN && MAPBOX_TOKEN.startsWith('pk.') && !MAPBOX_TOKEN.includes('PLACEHOLDER')

  useEffect(() => {
    let cancelled = false
    if (!validToken) return

    loadMapbox().then((mapboxgl) => {
      if (cancelled || !containerRef.current || !mapboxgl) return

      // Set token BEFORE creating the map
      mapboxgl.accessToken = MAPBOX_TOKEN

      if (mapRef.current) { mapRef.current.remove() }
      const map = new mapboxgl.Map({
        container: containerRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [center.lng, center.lat],
        zoom,
        attributionControl: false,
      })
      mapRef.current = map

      map.on('error', (e) => {
        // eslint-disable-next-line no-console
        console.warn('[Deriva TripPortal map] mapbox error:', e?.error?.status, e?.error?.message)
      })

      map.on('style.load', () => {
        setTimeout(() => { try { map.resize() } catch {} }, 0)
      })

      map.on('load', () => {
        // Tint the water layer to the Deriva-matching blue
        try {
          map.setPaintProperty('water', 'fill-color', '#a8c8d8')
        } catch {}

        // Detect airport stops by name so they can be styled to match the
        // advisor Maps design system (muted purple square pin).
        const isAirport = (stop) => /airport|malpensa|fiumicino|linate|keflavik|peretola|marco polo/i.test(stop.name || '')

        // Custom markers with clickable popups
        stops.forEach((stop, i) => {
          const wrap = document.createElement('div')
          wrap.style.cssText = 'display:flex;flex-direction:column;align-items:center;cursor:pointer;'
          const pin = document.createElement('div')
          if (isAirport(stop)) {
            // Square rotated pin in muted purple to match /advisor/maps
            pin.style.cssText = 'width:20px;height:20px;background:#6a5a7a;border:1.5px solid #fff;transform:rotate(45deg);box-shadow:0 2px 6px rgba(0,0,0,0.28);'
          } else {
            pin.style.cssText = 'width:20px;height:20px;border-radius:50%;background:#c0614a;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.25);display:flex;align-items:center;justify-content:center;'
            const dot = document.createElement('div')
            dot.style.cssText = 'width:6px;height:6px;border-radius:50%;background:#fff;'
            pin.appendChild(dot)
          }
          wrap.appendChild(pin)
          const label = document.createElement('span')
          label.textContent = `${i + 1}. ${stop.name}`
          label.style.cssText = "font-family:'Jost',sans-serif;font-size:9px;letter-spacing:0.08em;text-transform:uppercase;color:#1e1a16;background:rgba(245,240,232,0.92);padding:2px 6px;margin-top:4px;border-radius:2px;white-space:nowrap;"
          wrap.appendChild(label)
          new mapboxgl.Marker({ element: wrap, anchor: 'top' })
            .setLngLat([stop.coordinates.lng, stop.coordinates.lat])
            .addTo(map)
        })

        // Dynamically fit to pin bounds. Single stop handled with
        // a small synthetic bounding box so fitBounds still runs.
        try {
          const bounds = new mapboxgl.LngLatBounds()
          stops.forEach((s) => bounds.extend([s.coordinates.lng, s.coordinates.lat]))
          if (stops.length === 1) {
            const s = stops[0].coordinates
            const pad = 0.005
            bounds.extend([s.lng - pad, s.lat - pad])
            bounds.extend([s.lng + pad, s.lat + pad])
          }
          map.fitBounds(bounds, { padding: 60, maxZoom: 13, animate: false })
        } catch (err) {
          // eslint-disable-next-line no-console
          console.warn('[Deriva TripPortal map] fitBounds failed:', err)
        }
      })
    }).catch((e) => {
      // eslint-disable-next-line no-console
      console.warn('[Deriva TripPortal map] load failed:', e)
    })

    return () => {
      cancelled = true
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null }
    }
  }, [stops, center.lat, center.lng, zoom, validToken])

  return <div ref={containerRef} style={{ width: '100%', height: `${height}px`, borderRadius: '3px', overflow: 'hidden', border: '1px solid rgba(140,123,107,0.15)', position: 'relative' }} />
}

function OverviewTab({ portal }) {
  const allStops = portal.days.flatMap((d, di) => d.stops.map((s) => ({ ...s, dayNumber: d.dayNumber })))
  const confirmedCount = allStops.filter((s) => normalizeStatus(s.status) === 'confirmed').length
  const totalStops = allStops.length
  const cities = new Set()
  portal.days.forEach((d) => { if (d.theme) cities.add(d.theme) })
  const cityCount = 4
  const center = { lat: 45.95, lng: 9.15 }

  const [mapHeight, setMapHeight] = useState(typeof window !== 'undefined' && window.innerWidth < 640 ? 240 : 320)
  useEffect(() => {
    const onR = () => setMapHeight(window.innerWidth < 640 ? 240 : 320)
    window.addEventListener('resize', onR)
    return () => window.removeEventListener('resize', onR)
  }, [])

  return (
    <div>
      <PortalMap stops={allStops} center={center} zoom={10} height={mapHeight} />

      <div className="tp-stats">
        <div className="tp-stat"><span className="tp-stat-label">Days</span><span className="tp-stat-value">{portal.days.length}</span></div>
        <div className="tp-stat"><span className="tp-stat-label">Cities</span><span className="tp-stat-value">{cityCount}</span></div>
        <div className="tp-stat"><span className="tp-stat-label">Stops</span><span className="tp-stat-value">{totalStops}</span></div>
        <div className="tp-stat"><span className="tp-stat-label">Confirmed</span><span className="tp-stat-value" style={{ color: '#6b7a45' }}>{confirmedCount}/{totalStops}</span></div>
      </div>

      <div className="tp-section-label">Trip Timeline</div>
      <div className="tp-timeline">
        {portal.days.map((d) => {
          const conf = d.stops.filter((s) => normalizeStatus(s.status) === 'confirmed').length
          const pend = d.stops.filter((s) => normalizeStatus(s.status) === 'pending').length
          return (
            <div key={d.dayNumber} className="tp-timeline-row">
              <div className="tp-timeline-num">{d.dayNumber}</div>
              <div className="tp-timeline-info">
                <div className="tp-timeline-date">{d.date}</div>
                <div className="tp-timeline-theme">{d.theme}</div>
              </div>
              <div className="tp-timeline-chips">
                {conf > 0 && <StatusBadge status={`${conf} Confirmed`} />}
                {pend > 0 && <StatusBadge status={`${pend} Pending`} />}
              </div>
            </div>
          )
        })}
      </div>

      <div className="tp-section-label">Booking Status</div>
      <div className="tp-progress-wrap">
        <div className="tp-progress-label">{confirmedCount} of {totalStops} confirmed</div>
        <div className="tp-progress-bar">
          <div className="tp-progress-fill" style={{ width: `${(confirmedCount / totalStops) * 100}%` }} />
        </div>
      </div>
    </div>
  )
}

function DayTab({ day }) {
  const [mapHeight, setMapHeight] = useState(typeof window !== 'undefined' && window.innerWidth < 640 ? 240 : 320)
  useEffect(() => {
    const onR = () => setMapHeight(window.innerWidth < 640 ? 240 : 320)
    window.addEventListener('resize', onR)
    return () => window.removeEventListener('resize', onR)
  }, [])

  return (
    <div>
      <div className="tp-day-header">
        <div>
          <div className="tp-day-label">Day {day.dayNumber}</div>
          <div className="tp-day-date">{day.date}</div>
        </div>
        <span className="tp-day-badge">{day.badge}</span>
      </div>

      <PortalMap stops={day.stops} center={day.mapCenter} zoom={day.zoom} height={mapHeight} />

      <div className="tp-stops">
        {day.stops.map((stop, i) => (
          <div key={i} className="tp-stop">
            <div className="tp-stop-head">
              <div>
                <div className="tp-stop-type">{stop.type}</div>
                <div className="tp-stop-name">{stop.name}</div>
              </div>
              <StatusBadge status={stop.status} />
            </div>
            <p className="tp-stop-note">"{stop.note}"</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function TripPortal() {
  const { slug } = useParams()
  const [authed, setAuthed] = useState(false)
  const [portal, setPortal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tab, setTab] = useState('overview')

  const storageKey = `deriva_trip_${slug}`

  useEffect(() => {
    document.title = 'Your Deriva Trip'
    const saved = sessionStorage.getItem(storageKey)
    if (saved) {
      tryAuth(saved, true)
    } else {
      setLoading(false)
    }
  }, [slug])

  const tryAuth = async (password, silent = false) => {
    setError('')
    try {
      const res = await fetch(`/api/portal?slug=${encodeURIComponent(slug)}&password=${encodeURIComponent(password)}`)
      if (res.ok) {
        const data = await res.json()
        setPortal(data.portal)
        setAuthed(true)
        sessionStorage.setItem(storageKey, password)
      } else {
        // Fall back to demo portal if slug matches
        if (slug === DEMO_PORTAL.slug && password === DEMO_PORTAL.password) {
          setPortal(DEMO_PORTAL)
          setAuthed(true)
          sessionStorage.setItem(storageKey, password)
        } else if (!silent) {
          const body = await res.json().catch(() => ({}))
          setError(body.error || 'Incorrect password')
          sessionStorage.removeItem(storageKey)
        } else {
          sessionStorage.removeItem(storageKey)
        }
      }
    } catch {
      if (slug === DEMO_PORTAL.slug && password === DEMO_PORTAL.password) {
        setPortal(DEMO_PORTAL)
        setAuthed(true)
      } else if (!silent) {
        setError('Something went wrong')
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div style={{ position: 'fixed', inset: 0, background: '#1e1a16' }} />
  }

  if (!authed) {
    return <PasswordGate onSubmit={tryAuth} error={error} />
  }

  if (!portal) {
    return <PasswordGate onSubmit={tryAuth} error="Portal not found" />
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    ...portal.days.map((d) => ({ id: `day-${d.dayNumber}`, label: `Day ${d.dayNumber}` })),
  ]
  const currentDay = portal.days.find((d) => `day-${d.dayNumber}` === tab)

  const dates = `${portal.startDate || ''} — ${portal.endDate || ''}`

  return (
    <div className="trip-portal">
      <style>{`
        .trip-portal { background: #f5f0e8; color: #3a3028; font-family: 'Jost', system-ui, sans-serif; font-weight: 300; min-height: 100vh; }
        .trip-portal * { box-sizing: border-box; }
        .tp-header { position: fixed; top: 0; left: 0; right: 0; z-index: 50; background: #1e1a16; color: #f5f0e8; padding: 14px 20px; display: flex; align-items: center; justify-content: space-between; gap: 12px; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .tp-brand { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 13px; letter-spacing: 0.3em; text-transform: uppercase; color: #f5f0e8; text-decoration: none; font-weight: 400; flex-shrink: 0; }
        .tp-header-center { flex: 1; text-align: center; min-width: 0; padding: 0 8px; }
        .tp-client-name { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 15px; color: #f5f0e8; font-weight: 400; line-height: 1.2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .tp-trip-dates { font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(245,240,232,0.55); margin-top: 2px; }
        .tp-message-btn { font-family: 'Jost', sans-serif; font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: #fff; background: #c0614a; padding: 9px 14px; text-decoration: none; border-radius: 2px; white-space: nowrap; flex-shrink: 0; min-height: 36px; display: inline-flex; align-items: center; }
        .tp-tabs { position: fixed; top: 60px; left: 0; right: 0; z-index: 49; background: #f5f0e8; border-bottom: 1px solid #e0d5bc; display: flex; gap: 8px; padding: 0 20px; overflow-x: auto; -webkit-overflow-scrolling: touch; white-space: nowrap; }
        .tp-tabs::-webkit-scrollbar { display: none; }
        .tp-tab { font-family: 'Jost', sans-serif; font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase; color: #8c7b6b; background: none; border: none; padding: 16px 12px 14px; cursor: pointer; border-bottom: 2px solid transparent; flex-shrink: 0; min-height: 48px; }
        .tp-tab.active { color: #1e1a16; border-bottom-color: #b8963e; font-weight: 400; }
        .tp-main { max-width: 900px; margin: 0 auto; padding: 128px 20px 60px; }

        .tp-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 20px; }
        .tp-stat { background: #fff; border: 1px solid rgba(140,123,107,0.15); border-radius: 3px; padding: 14px 12px; text-align: center; }
        .tp-stat-label { font-family: 'Jost', sans-serif; font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; color: #8c7b6b; display: block; margin-bottom: 6px; }
        .tp-stat-value { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 22px; color: #1e1a16; font-weight: 400; display: block; line-height: 1; }

        .tp-section-label { font-family: 'Jost', sans-serif; font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase; color: #b8963e; margin: 32px 0 12px; }
        .tp-timeline { background: #fff; border: 1px solid rgba(140,123,107,0.15); border-radius: 3px; overflow: hidden; }
        .tp-timeline-row { display: grid; grid-template-columns: 48px 1fr auto; align-items: center; gap: 12px; padding: 14px 16px; border-bottom: 1px solid rgba(140,123,107,0.1); }
        .tp-timeline-row:last-child { border-bottom: none; }
        .tp-timeline-num { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 28px; color: #8c7b6b; font-weight: 300; line-height: 1; text-align: center; }
        .tp-timeline-info { min-width: 0; }
        .tp-timeline-date { font-size: 13px; font-weight: 500; color: #1e1a16; }
        .tp-timeline-theme { font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #8c7b6b; margin-top: 2px; }
        .tp-timeline-chips { display: flex; gap: 6px; flex-wrap: wrap; justify-content: flex-end; }

        .tp-progress-wrap { background: #fff; border: 1px solid rgba(140,123,107,0.15); border-radius: 3px; padding: 16px 18px; }
        .tp-progress-label { font-size: 12px; color: #3a3028; margin-bottom: 10px; }
        .tp-progress-bar { height: 8px; background: #ede5d0; border-radius: 4px; overflow: hidden; }
        .tp-progress-fill { height: 100%; background: #c0614a; border-radius: 4px; transition: width 0.3s; }

        .tp-day-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }
        .tp-day-label { font-family: 'Jost', sans-serif; font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase; color: #b8963e; }
        .tp-day-date { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 24px; color: #1e1a16; font-weight: 400; margin-top: 4px; line-height: 1.1; }
        .tp-day-badge { font-family: 'Jost', sans-serif; font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: #6b7a45; border: 1px solid rgba(107,122,69,0.35); padding: 6px 12px; border-radius: 2px; }

        .tp-stops { margin-top: 24px; display: flex; flex-direction: column; gap: 12px; }
        .tp-stop { background: #fff; border: 1px solid rgba(140,123,107,0.15); border-radius: 3px; padding: 16px 18px; }
        .tp-stop-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 10px; }
        .tp-stop-type { font-family: 'Jost', sans-serif; font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: #8c7b6b; margin-bottom: 3px; }
        .tp-stop-name { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 20px; color: #1e1a16; font-weight: 400; line-height: 1.2; }
        .tp-stop-note { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 14px; font-style: italic; color: #3a3028; line-height: 1.65; padding: 8px 0 2px 14px; border-left: 3px solid #c0614a; margin: 10px 0 0; }

        @media (max-width: 640px) {
          .tp-header { padding: 12px 16px; }
          .tp-brand { font-size: 11px; letter-spacing: 0.25em; }
          .tp-client-name { font-size: 13px; }
          .tp-trip-dates { font-size: 9px; }
          .tp-message-btn { font-size: 9px; padding: 9px 11px; }
          .tp-tabs { padding: 0 16px; top: 56px; }
          .tp-tab { font-size: 11px; padding: 14px 10px 12px; }
          .tp-main { padding: 120px 16px 60px; }
          .tp-stats { grid-template-columns: repeat(2, 1fr); }
          .tp-timeline-row { grid-template-columns: 40px 1fr; gap: 10px; padding: 12px 14px; }
          .tp-timeline-chips { grid-column: 2; justify-content: flex-start; margin-top: 4px; }
          .tp-timeline-num { font-size: 22px; }
          .tp-day-date { font-size: 20px; }
          .tp-stop { padding: 14px 16px; }
          .tp-stop-name { font-size: 17px; }
          .tp-stop-note { font-size: 13px; }
        }
      `}</style>

      <div className="tp-header">
        <span className="tp-brand">Deriva</span>
        <div className="tp-header-center">
          <div className="tp-client-name">{portal.clientName || 'Welcome'} · {portal.tripName || 'Your trip'}</div>
          <div className="tp-trip-dates">{dates}</div>
        </div>
        <a href="mailto:hello@deriva.travel" className="tp-message-btn">Message Ryan</a>
      </div>

      <nav className="tp-tabs" aria-label="Trip sections">
        {tabs.map((t) => (
          <button
            key={t.id}
            className={`tp-tab${tab === t.id ? ' active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <main className="tp-main">
        {tab === 'overview' && <OverviewTab portal={portal} />}
        {currentDay && <DayTab day={currentDay} />}
      </main>
    </div>
  )
}

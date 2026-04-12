import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import * as italyData from '../data/italy'
import * as portugalData from '../data/portugal'
import * as spainData from '../data/spain'
import * as icelandData from '../data/iceland'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || ''

const C = {
  cream: '#F5F0E8', parchment: '#EDE6D8', sand: '#D8CCBA', tan: '#C8B89A',
  gold: '#9E8660', mid: '#7A6E62', charcoal: '#3A3630', ink: '#1E1C18',
  white: '#FDFAF5', terracotta: '#B85C45',
}

const CATEGORY_COLORS = {
  Restaurant: '#c0614a',
  Hotel: '#b8963e',
  Experience: '#6b7a45',
  'Cafe & Bar': '#2c4a6e',
  Airport: '#6a5a7a',
}

const CATEGORY_FILTERS = ['All', 'Restaurants', 'Hotels', 'Experiences', 'Cafes & Bars', 'Airports']
const CATEGORY_MAP = {
  Restaurants: 'Restaurant',
  Hotels: 'Hotel',
  Experiences: 'Experience',
  'Cafes & Bars': 'Cafe & Bar',
  Airports: 'Airport',
}

const COUNTRIES = [
  { id: 'italy', name: 'Italy', center: [12.5, 42.5], zoom: 5.5 },
  { id: 'portugal', name: 'Portugal', center: [-8.0, 39.5], zoom: 6 },
  { id: 'spain', name: 'Spain', center: [-3.5, 40.0], zoom: 5.5 },
  { id: 'iceland', name: 'Iceland', center: [-18.5, 64.9], zoom: 6 },
]

const CITY_FILTERS = {
  italy: [
    { id: 'all', label: 'All', center: [12.5, 42.5], zoom: 5.5 },
    { id: 'rome', label: 'Rome', center: [12.4964, 41.9028], zoom: 11, match: ['Rome'] },
    { id: 'florence', label: 'Florence', center: [11.2558, 43.7696], zoom: 11, match: ['Florence'] },
    { id: 'como', label: 'Lake Como', center: [9.18, 45.95], zoom: 10, match: ['Como', 'Cernobbio', 'Bellagio', 'Varenna', 'Menaggio', 'Lenno'] },
  ],
  portugal: [
    { id: 'all', label: 'All', center: [-8.0, 39.5], zoom: 6 },
    { id: 'lisbon', label: 'Lisbon', center: [-9.1393, 38.7223], zoom: 11, match: ['Lisbon', 'Lisboa', 'Sintra', 'Cascais'] },
    { id: 'porto', label: 'Porto', center: [-8.6291, 41.1579], zoom: 11, match: ['Porto', 'Oporto'] },
    { id: 'algarve', label: 'Algarve', center: [-8.0, 37.1], zoom: 9, match: ['Lagos', 'Faro', 'Tavira', 'Albufeira', 'Portimao', 'Algarve'] },
  ],
  spain: [
    { id: 'all', label: 'All', center: [-3.5, 40.0], zoom: 5.5 },
    { id: 'madrid', label: 'Madrid', center: [-3.7038, 40.4168], zoom: 11, match: ['Madrid'] },
    { id: 'barcelona', label: 'Barcelona', center: [2.1734, 41.3851], zoom: 11, match: ['Barcelona'] },
    { id: 'sansebastian', label: 'San Sebastian', center: [-1.9812, 43.3183], zoom: 12, match: ['San Sebastian', 'Donostia', 'San Sebastián'] },
  ],
  iceland: [
    { id: 'all', label: 'All', center: [-18.5, 64.9], zoom: 6 },
    { id: 'reykjavik', label: 'Reykjavik', center: [-21.9426, 64.1466], zoom: 12, match: ['Reykjavik', 'Reykjavík'] },
    { id: 'south', label: 'South Coast', center: [-19.5, 63.7], zoom: 8, match: ['Vik', 'Vík', 'Selfoss', 'Hvolsvöllur', 'Skogar'] },
    { id: 'snaefellsnes', label: 'Snæfellsnes', center: [-23.3, 64.9], zoom: 9, match: ['Stykkishólmur', 'Arnarstapi', 'Hellnar', 'Snaefellsnes', 'Snæfellsnes'] },
  ],
}

const AIRPORTS = {
  italy: [
    { name: 'Rome Fiumicino', iata: 'FCO', lat: 41.8003, lng: 12.2389, serves: 'Rome and central Italy', note: 'Primary airport for Rome and central Italy' },
    { name: 'Rome Ciampino', iata: 'CIA', lat: 41.7994, lng: 12.5949, serves: 'Rome budget carriers', note: 'Budget airlines serving Rome' },
    { name: 'Milan Malpensa', iata: 'MXP', lat: 45.6301, lng: 8.7231, serves: 'Lake Como, Milan, northern Italy', note: 'Primary airport for Lake Como, Milan, and northern Italy' },
    { name: 'Milan Linate', iata: 'LIN', lat: 45.4455, lng: 9.2768, serves: 'Milan city airport', note: 'City airport for Milan, closer to the center' },
    { name: 'Florence Peretola', iata: 'FLR', lat: 43.8099, lng: 11.2051, serves: 'Florence and Tuscany', note: 'Serves Florence and Tuscany' },
    { name: 'Venice Marco Polo', iata: 'VCE', lat: 45.5053, lng: 12.3519, serves: 'Venice and the Veneto', note: 'Serves Venice and the Veneto' },
    { name: 'Naples', iata: 'NAP', lat: 40.8860, lng: 14.2908, serves: 'Naples and the Amalfi Coast', note: 'Serves Naples and the Amalfi Coast' },
  ],
  portugal: [
    { name: 'Lisbon', iata: 'LIS', lat: 38.7756, lng: -9.1354, serves: 'Lisbon and central Portugal', note: 'Primary airport for Lisbon and central Portugal' },
    { name: 'Porto', iata: 'OPO', lat: 41.2481, lng: -8.6814, serves: 'Porto and northern Portugal', note: 'Serves Porto and northern Portugal' },
    { name: 'Faro', iata: 'FAO', lat: 37.0144, lng: -7.9659, serves: 'The Algarve', note: 'Serves the Algarve' },
  ],
  spain: [
    { name: 'Madrid Barajas', iata: 'MAD', lat: 40.4983, lng: -3.5676, serves: 'Madrid and central Spain', note: 'Primary airport for Madrid and central Spain' },
    { name: 'Barcelona El Prat', iata: 'BCN', lat: 41.2971, lng: 2.0785, serves: 'Barcelona and Catalonia', note: 'Serves Barcelona and Catalonia' },
    { name: 'Seville', iata: 'SVQ', lat: 37.4180, lng: -5.8931, serves: 'Seville and Andalusia', note: 'Serves Seville and Andalusia' },
    { name: 'Bilbao', iata: 'BIO', lat: 43.3011, lng: -2.9106, serves: 'Bilbao and the Basque Country', note: 'Serves Bilbao and the Basque Country' },
    { name: 'Malaga', iata: 'AGP', lat: 36.6749, lng: -4.4991, serves: 'Malaga and the Costa del Sol', note: 'Serves Malaga and the Costa del Sol' },
  ],
  iceland: [
    { name: 'Keflavik', iata: 'KEF', lat: 63.9850, lng: -22.6056, serves: 'International, 45 min from Reykjavik', note: 'Main international airport, 45 minutes from Reykjavik' },
    { name: 'Reykjavik Domestic', iata: 'RVK', lat: 64.1300, lng: -21.9406, serves: 'Domestic flights to Akureyri and the highlands', note: 'Domestic flights to Akureyri and the highlands' },
    { name: 'Akureyri', iata: 'AEY', lat: 65.6600, lng: -18.0727, serves: 'Northern Iceland', note: 'Serves northern Iceland' },
  ],
}

// ── Mapbox loader (same pattern as LakeComo/TripPortal) ──────────────────
let mapboxLoadPromise = null
function loadMapbox() {
  if (mapboxLoadPromise) return mapboxLoadPromise
  mapboxLoadPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined') { resolve(null); return }
    if (window.mapboxgl) { resolve(window.mapboxgl); return }
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
      script.onerror = () => rej(new Error('Failed to load mapbox-gl'))
      document.head.appendChild(script)
    })
    Promise.all([cssReady, jsReady]).then(([, mb]) => resolve(mb)).catch(reject)
  })
  return mapboxLoadPromise
}

// ── Spot source: bundled curated data + localStorage custom spots ────────
function getAllSpotsForCountry(countryId) {
  const sources = { italy: italyData, portugal: portugalData, spain: spainData, iceland: icelandData }
  const src = sources[countryId]
  const countryName = countryId.charAt(0).toUpperCase() + countryId.slice(1)
  const restaurants = (src.restaurants || []).map((s) => ({ ...s, country: countryName, category: s.category || 'Restaurant' }))
  const stays = (src.stays || []).map((s) => ({ ...s, country: countryName, category: 'Hotel' }))
  let custom = []
  try {
    const raw = JSON.parse(localStorage.getItem('deriva_spots') || '[]')
    custom = (Array.isArray(raw) ? raw : [])
      .map((s) => ({ ...s, category: s.category || 'Restaurant' }))
      .filter((s) => (s.country || '').toLowerCase() === countryId)
  } catch {}
  return [...restaurants, ...stays, ...custom].map((s, i) => ({
    ...s,
    id: s.id || `${countryId}_${s.name}_${i}`.replace(/\s+/g, '_'),
  }))
}

// ── Geocode cache (client-side localStorage) ─────────────────────────────
const GEOCODE_KEY = 'deriva_geocode_cache'
function getGeocodeCache() {
  try { return JSON.parse(localStorage.getItem(GEOCODE_KEY) || '{}') } catch { return {} }
}
function saveGeocodeCache(cache) {
  try { localStorage.setItem(GEOCODE_KEY, JSON.stringify(cache)) } catch {}
}
function spotCacheKey(spot) {
  return `${(spot.name || '').toLowerCase()}|${(spot.city || '').toLowerCase()}|${(spot.country || '').toLowerCase()}`
}

async function geocodeOne(spot) {
  if (!MAPBOX_TOKEN) return null
  const parts = [spot.name, spot.address, spot.city, spot.country].filter(Boolean).join(', ')
  const q = encodeURIComponent(parts)
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${q}.json?access_token=${MAPBOX_TOKEN}&limit=1`
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const data = await res.json()
    const feat = data.features?.[0]
    if (!feat?.center) return null
    const [lng, lat] = feat.center
    return { lat, lng }
  } catch {
    return null
  }
}

// Throttled batch: geocodes up to `concurrency` spots at a time, caches each result.
async function geocodeAll(spots, onProgress, concurrency = 4) {
  const cache = getGeocodeCache()
  const todo = spots.filter((s) => !cache[spotCacheKey(s)])
  const done = spots.filter((s) => cache[spotCacheKey(s)]).map((s) => ({ ...s, ...cache[spotCacheKey(s)] }))
  onProgress(done)

  let idx = 0
  async function worker() {
    while (idx < todo.length) {
      const my = idx++
      const spot = todo[my]
      const coords = await geocodeOne(spot)
      if (coords) {
        cache[spotCacheKey(spot)] = coords
        saveGeocodeCache(cache)
        done.push({ ...spot, ...coords })
        onProgress([...done])
      }
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker))
  return done
}

// ── Maps component ───────────────────────────────────────────────────────
function normalizeCityMatch(spot, matchList) {
  if (!matchList) return true
  const city = (spot.city || '').toLowerCase()
  return matchList.some((m) => city.includes(m.toLowerCase()))
}

export default function Maps() {
  const [countryId, setCountryId] = useState('italy')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [cityFilter, setCityFilter] = useState('all')
  const [geocodedSpots, setGeocodedSpots] = useState([])
  const [loadingSpots, setLoadingSpots] = useState(true)
  const [toast, setToast] = useState('')
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef([])

  const validToken = MAPBOX_TOKEN && MAPBOX_TOKEN.startsWith('pk.') && !MAPBOX_TOKEN.includes('PLACEHOLDER')

  const country = COUNTRIES.find((c) => c.id === countryId) || COUNTRIES[0]
  const cities = CITY_FILTERS[countryId] || []
  const activeCity = cities.find((c) => c.id === cityFilter) || cities[0]
  const airports = AIRPORTS[countryId] || []

  // Reset city filter when country changes
  useEffect(() => { setCityFilter('all') }, [countryId])

  // Geocode spots whenever country changes
  useEffect(() => {
    let cancelled = false
    setLoadingSpots(true)
    setGeocodedSpots([])
    const spots = getAllSpotsForCountry(countryId)
    // eslint-disable-next-line no-console
    console.log(`[Deriva Maps] ${country.name}: ${spots.length} spots to process`)
    geocodeAll(spots, (progress) => {
      if (!cancelled) setGeocodedSpots(progress)
    }).then((final) => {
      if (!cancelled) {
        setLoadingSpots(false)
        // eslint-disable-next-line no-console
        console.log(`[Deriva Maps] ${country.name}: ${final.length} spots geocoded and rendered`)
      }
    })
    return () => { cancelled = true }
  }, [countryId])

  // Initialize / rebuild the map when country changes
  useEffect(() => {
    if (!validToken) return
    let cancelled = false
    loadMapbox().then((mapboxgl) => {
      if (cancelled || !containerRef.current || !mapboxgl) return
      mapboxgl.accessToken = MAPBOX_TOKEN
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null }
      const map = new mapboxgl.Map({
        container: containerRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: country.center,
        zoom: country.zoom,
        attributionControl: false,
      })
      mapRef.current = map

      map.on('style.load', () => { setTimeout(() => { try { map.resize() } catch {} }, 0) })
      map.on('load', () => {
        try { map.setPaintProperty('water', 'fill-color', '#a8c8d8') } catch {}
      })
      map.on('error', (e) => {
        // eslint-disable-next-line no-console
        console.warn('[Deriva Maps] mapbox error:', e?.error?.status, e?.error?.message)
      })

      try {
        map.addControl(new mapboxgl.NavigationControl({ showCompass: false, showZoom: true }), 'top-right')
      } catch {}
    })
    return () => {
      cancelled = true
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null }
    }
  }, [countryId, validToken])

  // Fly to a city filter when it changes
  useEffect(() => {
    if (!mapRef.current || !activeCity) return
    const map = mapRef.current
    const go = () => {
      try { map.flyTo({ center: activeCity.center, zoom: activeCity.zoom, duration: 800 }) } catch {}
    }
    if (map.loaded()) go(); else map.once('load', go)
  }, [cityFilter, countryId])

  // Filter visible pins
  const visibleSpots = useMemo(() => {
    let arr = geocodedSpots
    if (categoryFilter !== 'All' && categoryFilter !== 'Airports') {
      const want = CATEGORY_MAP[categoryFilter]
      arr = arr.filter((s) => (s.category || 'Restaurant') === want)
    }
    if (categoryFilter === 'Airports') arr = []
    if (cityFilter !== 'all' && activeCity?.match) {
      arr = arr.filter((s) => normalizeCityMatch(s, activeCity.match))
    }
    return arr
  }, [geocodedSpots, categoryFilter, cityFilter, activeCity])

  const showAirports = categoryFilter === 'All' || categoryFilter === 'Airports'
  const visibleAirports = useMemo(() => (showAirports ? airports : []), [showAirports, airports])

  // Render markers whenever visible set changes
  useEffect(() => {
    const map = mapRef.current
    if (!map || !window.mapboxgl) return
    const render = () => {
      // Clear old markers
      markersRef.current.forEach((m) => m.remove())
      markersRef.current = []

      const makeSpotPin = (color) => {
        const wrap = document.createElement('div')
        wrap.style.cssText = 'display:flex;flex-direction:column;align-items:center;cursor:pointer;pointer-events:auto;'
        const pin = document.createElement('div')
        pin.style.cssText = `width:16px;height:16px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.28);`
        wrap.appendChild(pin)
        return wrap
      }
      const makeLabel = (text, color) => {
        const label = document.createElement('span')
        label.textContent = text
        label.style.cssText = `font-family:'Jost',sans-serif;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:${color};background:rgba(245,240,232,0.94);padding:2px 7px;margin-top:4px;border-radius:2px;white-space:nowrap;font-weight:500;pointer-events:none;`
        return label
      }
      const makeAirportPin = (iata) => {
        const wrap = document.createElement('div')
        wrap.style.cssText = 'display:flex;flex-direction:column;align-items:center;cursor:pointer;'
        const pin = document.createElement('div')
        pin.style.cssText = `width:22px;height:22px;background:${CATEGORY_COLORS.Airport};border:1.5px solid #fff;transform:rotate(45deg);box-shadow:0 2px 6px rgba(0,0,0,0.28);display:flex;align-items:center;justify-content:center;`
        const code = document.createElement('span')
        code.textContent = iata
        code.style.cssText = "transform:rotate(-45deg);font-family:'Jost',sans-serif;font-size:7px;font-weight:500;color:#fff;letter-spacing:0.05em;"
        pin.appendChild(code)
        wrap.appendChild(pin)
        return wrap
      }

      const mapboxgl = window.mapboxgl

      visibleSpots.forEach((spot) => {
        if (typeof spot.lat !== 'number' || typeof spot.lng !== 'number') return
        const cat = spot.category || 'Restaurant'
        const color = CATEGORY_COLORS[cat] || CATEGORY_COLORS.Restaurant
        const wrap = makeSpotPin(color)
        wrap.appendChild(makeLabel(spot.name, color))

        const popupHtml = `
          <div class="deriva-map-popup">
            <div class="dm-name">${escapeHtml(spot.name)}</div>
            ${spot.neighborhood ? `<div class="dm-neighborhood">${escapeHtml(spot.neighborhood)}${spot.city ? ' · ' + escapeHtml(spot.city) : ''}</div>` : (spot.city ? `<div class="dm-neighborhood">${escapeHtml(spot.city)}</div>` : '')}
            ${spot.note ? `<div class="dm-note">"${escapeHtml(spot.note)}"</div>` : ''}
            <button class="dm-add-btn" data-spot-id="${escapeHtml(spot.id)}">Add to Itinerary</button>
          </div>
        `
        const popup = new mapboxgl.Popup({ offset: 22, closeButton: true, className: 'deriva-popup-wrap', maxWidth: '280px' }).setHTML(popupHtml)
        popup.on('open', () => {
          const btn = document.querySelector(`.dm-add-btn[data-spot-id="${cssEscape(spot.id)}"]`)
          if (btn) btn.addEventListener('click', () => handleAddToItinerary(spot), { once: true })
        })
        const marker = new mapboxgl.Marker({ element: wrap, anchor: 'top' })
          .setLngLat([spot.lng, spot.lat])
          .setPopup(popup)
          .addTo(map)
        markersRef.current.push(marker)
      })

      visibleAirports.forEach((a) => {
        const wrap = makeAirportPin(a.iata)
        const popupHtml = `
          <div class="deriva-map-popup">
            <div class="dm-name">${escapeHtml(a.name)} <span class="dm-iata">${escapeHtml(a.iata)}</span></div>
            <div class="dm-neighborhood">${escapeHtml(a.serves)}</div>
            <div class="dm-note">"${escapeHtml(a.note)}"</div>
          </div>
        `
        const popup = new mapboxgl.Popup({ offset: 18, closeButton: true, className: 'deriva-popup-wrap', maxWidth: '280px' }).setHTML(popupHtml)
        const marker = new mapboxgl.Marker({ element: wrap, anchor: 'center' })
          .setLngLat([a.lng, a.lat])
          .setPopup(popup)
          .addTo(map)
        markersRef.current.push(marker)
      })
    }

    if (map.loaded()) render(); else map.once('load', render)
    return () => {
      markersRef.current.forEach((m) => m.remove())
      markersRef.current = []
    }
  }, [visibleSpots, visibleAirports])

  const handleAddToItinerary = useCallback((spot) => {
    try {
      sessionStorage.setItem('deriva_itinerary_pending_add', JSON.stringify({ spot, at: Date.now() }))
    } catch {}
    setToast('Open the Itinerary Builder to add spots.')
    setTimeout(() => setToast(''), 3000)
  }, [])

  const totalShown = visibleSpots.length + visibleAirports.length

  const pillBase = {
    fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.12em',
    textTransform: 'uppercase', cursor: 'pointer', padding: '0.5rem 0.95rem',
    border: `1px solid ${C.sand}`, backgroundColor: C.white, color: C.mid,
    borderRadius: '2px', whiteSpace: 'nowrap', marginRight: '0.4rem', marginBottom: '0.4rem',
  }
  const activePillBase = { ...pillBase, backgroundColor: C.terracotta, color: '#fff', borderColor: C.terracotta }

  return (
    <div className="deriva-maps" style={{ margin: '-2.5rem -3rem', display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 60px)' }}>
      <style>{`
        .deriva-maps { background: ${C.cream}; }
        .deriva-map-canvas { position: relative; flex: 1; min-height: 520px; }

        /* Popups shared with other pages but scoped here in case */
        .mapboxgl-popup.deriva-popup-wrap .mapboxgl-popup-tip { display: none; }
        .mapboxgl-popup.deriva-popup-wrap .mapboxgl-popup-content { background: #fff; border: 1px solid rgba(140,123,107,0.2); border-radius: 3px; padding: 14px 16px 12px; box-shadow: 0 6px 20px rgba(30,26,22,0.12); font-family: 'Jost', sans-serif; max-width: 260px; }
        .mapboxgl-popup.deriva-popup-wrap .mapboxgl-popup-close-button { color: #c0614a; font-size: 20px; padding: 2px 8px 4px; font-family: 'Jost', sans-serif; line-height: 1; background: none; border: none; right: 4px; top: 4px; }
        .mapboxgl-popup.deriva-popup-wrap .mapboxgl-popup-close-button:hover { color: #a84f3a; }
        .deriva-map-popup .dm-name { font-family: 'Jost', sans-serif; font-size: 14px; font-weight: 500; color: #1e1a16; margin-bottom: 4px; padding-right: 14px; }
        .deriva-map-popup .dm-iata { font-family: 'Jost', sans-serif; font-size: 10px; font-weight: 500; letter-spacing: 0.12em; color: #6a5a7a; margin-left: 4px; }
        .deriva-map-popup .dm-neighborhood { font-family: 'Jost', sans-serif; font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: #8c7b6b; margin-bottom: 8px; }
        .deriva-map-popup .dm-note { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 13px; font-style: italic; color: #3a3028; line-height: 1.55; padding-left: 10px; border-left: 2px solid #c0614a; margin-bottom: 10px; }
        .deriva-map-popup .dm-add-btn { display: block; width: 100%; font-family: 'Jost', sans-serif; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: #fff; background: #c0614a; border: none; padding: 9px 12px; cursor: pointer; border-radius: 2px; }
        .deriva-map-popup .dm-add-btn:hover { background: #a84f3a; }

        /* Deriva-styled nav control override */
        .deriva-map-canvas .mapboxgl-ctrl-group { background: transparent; box-shadow: none; border: 1px solid rgba(30,26,22,0.2); }
        .deriva-map-canvas .mapboxgl-ctrl-group button { background: #1e1a16; width: 32px; height: 32px; border: none; border-bottom: 1px solid rgba(245,240,232,0.12); }
        .deriva-map-canvas .mapboxgl-ctrl-group button:last-child { border-bottom: none; }
        .deriva-map-canvas .mapboxgl-ctrl-group button:hover { background: #2a2520; }
        .deriva-map-canvas .mapboxgl-ctrl-group button .mapboxgl-ctrl-icon { filter: invert(95%) sepia(10%) saturate(155%) hue-rotate(350deg) brightness(99%) contrast(91%); }

        @media (max-width: 768px) {
          .deriva-maps { margin: -1.5rem -1rem !important; }
        }
      `}</style>

      {/* Country tabs */}
      <div style={{ display: 'flex', gap: '0', borderBottom: `1px solid ${C.sand}`, backgroundColor: C.cream, padding: '0 1.5rem', overflowX: 'auto' }}>
        {COUNTRIES.map((c) => {
          const active = countryId === c.id
          return (
            <button
              key={c.id}
              onClick={() => setCountryId(c.id)}
              style={{
                fontFamily: 'Georgia, serif', fontSize: '0.9rem', letterSpacing: '0.04em',
                color: active ? C.ink : C.tan,
                backgroundColor: 'transparent', border: 'none',
                borderBottom: active ? `2px solid ${C.terracotta}` : '2px solid transparent',
                padding: '1.1rem 1.25rem', cursor: 'pointer', whiteSpace: 'nowrap',
              }}
            >
              {c.name}
            </button>
          )
        })}
      </div>

      {/* Filter bar */}
      <div style={{ padding: '0.9rem 1.5rem 0.6rem', backgroundColor: C.cream, borderBottom: `1px solid ${C.sand}` }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', marginBottom: '0.4rem' }}>
          {CATEGORY_FILTERS.map((cat) => {
            const active = categoryFilter === cat
            return (
              <button key={cat} onClick={() => setCategoryFilter(cat)} style={active ? activePillBase : pillBase}>
                {cat}
              </button>
            )
          })}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
          {cities.map((city) => {
            const active = cityFilter === city.id
            return (
              <button
                key={city.id}
                onClick={() => setCityFilter(city.id)}
                style={{
                  ...(active ? activePillBase : pillBase),
                  fontSize: '0.6rem',
                  padding: '0.4rem 0.8rem',
                }}
              >
                {city.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Map */}
      <div className="deriva-map-canvas" style={{ position: 'relative' }}>
        <div ref={containerRef} style={{ position: 'absolute', inset: 0 }} />

        {!validToken && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.parchment, color: C.mid, fontSize: '0.85rem', fontStyle: 'italic', padding: '1rem', textAlign: 'center' }}>
            Map preview unavailable. Add a valid Mapbox token to VITE_MAPBOX_TOKEN in Vercel env and redeploy.
          </div>
        )}

        {/* Spot count overlay, top-left */}
        <div style={{
          position: 'absolute', top: '14px', left: '14px', zIndex: 2,
          background: 'rgba(30,26,22,0.82)', color: C.cream,
          fontFamily: 'system-ui, sans-serif', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase',
          padding: '0.55rem 0.9rem', borderRadius: '3px',
          backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
        }}>
          {country.name} · {totalShown} {totalShown === 1 ? 'pin' : 'pins'}{loadingSpots ? ' · loading' : ''}
        </div>

        {/* Legend, bottom-left */}
        <div style={{
          position: 'absolute', bottom: '14px', left: '14px', zIndex: 2,
          background: 'rgba(30,26,22,0.82)', color: C.cream,
          padding: '0.65rem 0.85rem', borderRadius: '3px',
          backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
        }}>
          {[
            { key: 'Restaurants', label: 'Restaurants', color: CATEGORY_COLORS.Restaurant, shape: 'circle' },
            { key: 'Hotels', label: 'Hotels', color: CATEGORY_COLORS.Hotel, shape: 'circle' },
            { key: 'Experiences', label: 'Experiences', color: CATEGORY_COLORS.Experience, shape: 'circle' },
            { key: 'Cafes & Bars', label: 'Cafes & Bars', color: CATEGORY_COLORS['Cafe & Bar'], shape: 'circle' },
            { key: 'Airports', label: 'Airports', color: CATEGORY_COLORS.Airport, shape: 'diamond' },
          ].map((row) => {
            const active = categoryFilter === 'All' || categoryFilter === row.key
            return (
              <div key={row.key} style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: active ? 1 : 0.35, marginBottom: '4px', fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                <span style={{
                  width: '9px', height: '9px',
                  background: row.color,
                  border: '1px solid #fff',
                  borderRadius: row.shape === 'circle' ? '50%' : '0',
                  transform: row.shape === 'diamond' ? 'rotate(45deg)' : 'none',
                  display: 'inline-block', flexShrink: 0,
                }} />
                <span>{row.label}</span>
              </div>
            )
          })}
        </div>

        {/* Toast */}
        {toast && (
          <div style={{
            position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
            zIndex: 10, background: C.ink, color: C.cream,
            fontFamily: 'system-ui, sans-serif', fontSize: '0.75rem',
            padding: '0.8rem 1.2rem', borderRadius: '3px',
            boxShadow: '0 6px 20px rgba(30,26,22,0.25)',
          }}>
            {toast}
          </div>
        )}
      </div>
    </div>
  )
}

// Safe HTML escape helpers
function escapeHtml(str) {
  if (str == null) return ''
  return String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
}
function cssEscape(str) {
  if (str == null) return ''
  return String(str).replace(/"/g, '\\"')
}

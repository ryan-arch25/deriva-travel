import { useState, useEffect, useMemo } from 'react'
import { SEASONAL_DATA } from '../data/seasonal'
import { REGIONS } from '../data/regions'

const C = {
  cream: '#F5F0E8', parchment: '#EDE6D8', sand: '#D8CCBA', tan: '#C8B89A',
  gold: '#9E8660', mid: '#7A6E62', charcoal: '#3A3630', ink: '#1E1C18',
  white: '#FDFAF5', terracotta: '#B85C45',
}

const lbl = {
  fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.18em',
  textTransform: 'uppercase', color: C.tan, display: 'block', marginBottom: '0.5rem',
}
const inp = {
  width: '100%', fontFamily: 'system-ui, sans-serif', fontSize: '0.9rem', fontWeight: '300',
  color: C.ink, backgroundColor: C.white, border: `1px solid ${C.sand}`, padding: '0.75rem 1rem',
  outline: 'none', appearance: 'none', boxSizing: 'border-box',
}
const primaryBtn = {
  fontFamily: 'system-ui, sans-serif', fontSize: '0.7rem', letterSpacing: '0.18em',
  textTransform: 'uppercase', color: C.white, backgroundColor: C.terracotta, border: 'none',
  padding: '0.7rem 1.3rem', cursor: 'pointer',
}
const ghostBtn = {
  ...primaryBtn, backgroundColor: 'transparent', color: C.terracotta,
  border: `1px solid ${C.terracotta}`,
}
const softBtn = {
  fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.15em',
  textTransform: 'uppercase', color: C.mid, backgroundColor: 'transparent',
  border: `1px solid ${C.sand}`, padding: '0.5rem 0.9rem', cursor: 'pointer',
}

const DESTS = ['All', 'Italy', 'Portugal', 'Spain', 'Iceland']
const ADD_DEST_TAGS = ['Italy', 'Portugal', 'Spain', 'Iceland', 'General', 'Hotels', 'Food']

const gnews = (q) =>
  `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=en-US&gl=US&ceid=US:en`

// Each source has: url, name, tag (destination or General), category, and an
// optional `unfiltered` flag. Unfiltered sources skip the keyword relevance
// filter (because they're already destination or topic specific).
const SOURCE_REGISTRY = [
  // Travel and Culture
  { url: 'https://www.eater.com/rss/index.xml', name: 'Eater', tag: 'General', category: 'Food and Drink' },
  { url: 'https://www.theguardian.com/travel/rss', name: 'Guardian Travel', tag: 'General', category: 'Culture' },
  { url: 'https://www.cntraveler.com/feed/rss', name: 'Condé Nast Traveler', tag: 'General', category: 'Culture' },
  { url: 'https://www.afar.com/feeds/afar-magazine-rss-feed', name: 'Afar', tag: 'General', category: 'Culture' },
  { url: 'https://feeds.bbci.co.uk/travel/rss.xml', name: 'BBC Travel', tag: 'General', category: 'Culture' },
  { url: 'https://www.atlasobscura.com/feeds/latest', name: 'Atlas Obscura', tag: 'General', category: 'Culture' },
  { url: 'https://www.nationalgeographic.com/travel/rss-feeds/', name: 'National Geographic Travel', tag: 'General', category: 'Culture' },
  { url: 'https://skift.com/feed/', name: 'Skift', tag: 'General', category: 'Travel Trends' },
  { url: 'https://theculturetrip.com/europe/feed', name: 'Culture Trip Europe', tag: 'General', category: 'Culture' },
  { url: 'https://www.spottedbylocals.com/feed', name: 'Spotted by Locals', tag: 'General', category: 'Culture' },
  { url: 'https://www.wallpaper.com/travel/rss', name: 'Wallpaper Travel', tag: 'General', category: 'Culture' },
  { url: 'https://www.architecturaldigest.com/travel/rss', name: 'Architectural Digest Travel', tag: 'General', category: 'Culture' },
  { url: 'https://www.phocuswire.com/rss', name: 'Phocuswire', tag: 'General', category: 'Travel Trends' },
  { url: 'https://www.viator.com/blog/feed', name: 'Viator Travel Blog', tag: 'General', category: 'Travel Trends' },
  { url: 'https://news.airbnb.com/feed/', name: 'Airbnb Newsroom', tag: 'General', category: 'Travel Trends' },
  { url: 'https://www.getyourguide.com/blog/feed', name: 'GetYourGuide Newsroom', tag: 'General', category: 'Travel Trends' },
  { url: 'https://explodingtopics.com/blog/rss.xml', name: 'Exploding Topics', tag: 'General', category: 'Travel Trends' },

  // Food and Drink
  { url: 'https://culinarybackstreets.com/feed', name: 'Culinary Backstreets', tag: 'General', category: 'Food and Drink' },
  { url: 'https://punchdrink.com/feed', name: 'Punch', tag: 'General', category: 'Food and Drink' },
  { url: 'https://www.saveur.com/feed', name: 'Saveur', tag: 'General', category: 'Food and Drink' },
  { url: 'https://vinepair.com/feed', name: 'VinePair', tag: 'General', category: 'Food and Drink' },
  { url: 'https://www.decanter.com/feed', name: 'Decanter', tag: 'General', category: 'Food and Drink' },
  { url: 'https://www.bonappetit.com/feed/rss', name: 'Bon Appétit', tag: 'General', category: 'Food and Drink' },
  { url: 'https://www.foodandwine.com/rss', name: 'Food & Wine', tag: 'General', category: 'Food and Drink' },
  { url: 'https://www.theinfatuation.com/rss', name: 'The Infatuation', tag: 'General', category: 'Food and Drink' },
  { url: 'https://www.winemag.com/feed/', name: 'Wine Enthusiast', tag: 'General', category: 'Food and Drink' },
  { url: 'https://winefolly.com/feed/', name: 'Wine Folly', tag: 'General', category: 'Food and Drink' },
  { url: 'https://www.jancisrobinson.com/rss', name: 'Jancis Robinson', tag: 'General', category: 'Food and Drink' },

  // Hotels and Design
  { url: 'https://www.mrandmrssmith.com/feed', name: 'Mr & Mrs Smith', tag: 'General', category: 'Hotels' },
  { url: 'https://www.tablethotels.com/blog/feed', name: 'Tablet Hotels', tag: 'General', category: 'Hotels' },
  { url: 'https://www.hideawayreport.com/feed', name: 'Hideaway Report', tag: 'General', category: 'Hotels' },
  { url: 'https://www.secretescapes.com/editorial/feed', name: 'Secret Escapes', tag: 'General', category: 'Hotels' },

  // Italy destination-specific
  { url: 'https://www.theflorentine.net/feed', name: 'The Florentine', tag: 'Italy', category: 'Culture', unfiltered: true },
  { url: 'https://www.romerevealed.com/feed', name: 'Revealed Rome', tag: 'Italy', category: 'Culture', unfiltered: true },
  { url: 'https://www.wantedinrome.com/rss', name: 'Wanted in Rome', tag: 'Italy', category: 'Culture', unfiltered: true },
  { url: 'https://www.timeout.com/rome/rss', name: 'Time Out Rome', tag: 'Italy', category: 'Culture', unfiltered: true },
  { url: 'https://www.thelocal.it/rss.php', name: 'The Local Italy', tag: 'Italy', category: 'Culture', unfiltered: true },
  { url: 'https://devourtours.com/blog/feed/?cat=rome', name: 'Devour Rome', tag: 'Italy', category: 'Food and Drink', unfiltered: true },
  { url: 'https://devourtours.com/blog/feed/?cat=florence', name: 'Devour Florence', tag: 'Italy', category: 'Food and Drink', unfiltered: true },

  // Portugal destination-specific
  { url: 'https://www.insidelisbon.com/feed', name: 'Inside Lisbon', tag: 'Portugal', category: 'Culture', unfiltered: true },
  { url: 'https://www.timeout.com/lisbon/rss', name: 'Time Out Lisbon', tag: 'Portugal', category: 'Culture', unfiltered: true },
  { url: 'https://www.thelocal.pt/rss.php', name: 'The Local Portugal', tag: 'Portugal', category: 'Culture', unfiltered: true },
  { url: 'https://devourtours.com/blog/feed/?cat=lisbon', name: 'Devour Lisbon', tag: 'Portugal', category: 'Food and Drink', unfiltered: true },

  // Spain destination-specific
  { url: 'https://www.timeout.com/barcelona/rss', name: 'Time Out Barcelona', tag: 'Spain', category: 'Culture', unfiltered: true },
  { url: 'https://www.timeout.com/madrid/rss', name: 'Time Out Madrid', tag: 'Spain', category: 'Culture', unfiltered: true },
  { url: 'https://www.thelocal.es/rss.php', name: 'The Local Spain', tag: 'Spain', category: 'Culture', unfiltered: true },
  { url: 'https://devourtours.com/blog/feed/?cat=madrid', name: 'Devour Madrid', tag: 'Spain', category: 'Food and Drink', unfiltered: true },
  { url: 'https://devourtours.com/blog/feed/?cat=barcelona', name: 'Devour Barcelona', tag: 'Spain', category: 'Food and Drink', unfiltered: true },

  // Iceland destination-specific
  { url: 'https://icelandmag.is/feed', name: 'Iceland Magazine', tag: 'Iceland', category: 'Culture', unfiltered: true },
  { url: 'https://www.whatson.is/feed', name: "What's On in Reykjavik", tag: 'Iceland', category: 'Culture', unfiltered: true },

  // Substacks and personal blogs (also seeded into Following tab)
  { url: 'https://hotelsaboveparweekly.substack.com/feed', name: 'Hotels Above Par', tag: 'General', category: 'Hotels', unfiltered: true },
  { url: 'https://katieparla.substack.com/feed', name: 'Katie Parla', tag: 'Italy', category: 'Food and Drink', unfiltered: true },
  { url: 'https://elizabethminchilli.substack.com/feed', name: 'Elizabeth Minchilli', tag: 'Italy', category: 'Food and Drink', unfiltered: true },
  { url: 'https://www.portugalist.com/feed', name: 'Portugalist', tag: 'Portugal', category: 'Culture', unfiltered: true },
  { url: 'https://grantourismotravels.com/feed', name: 'Grantourismo', tag: 'General', category: 'Culture', unfiltered: true },
  { url: 'https://davidlebovitz.substack.com/feed', name: 'David Lebovitz', tag: 'General', category: 'Food and Drink', unfiltered: true },
  { url: 'https://emikodavies.substack.com/feed', name: 'Emiko Davies', tag: 'Italy', category: 'Food and Drink', unfiltered: true },
  { url: 'https://rolfpotts.substack.com/feed', name: 'Rolf Potts', tag: 'General', category: 'Culture', unfiltered: true },
  { url: 'https://vittles.substack.com/feed', name: 'Vittles', tag: 'General', category: 'Food and Drink', unfiltered: true },
  { url: 'https://culinarybackstreets.substack.com/feed', name: 'Culinary Backstreets Newsletter', tag: 'General', category: 'Food and Drink', unfiltered: true },
  { url: 'https://fathomaway.com/feed', name: 'Fathom', tag: 'General', category: 'Culture', unfiltered: true },
  { url: 'https://rachelroddy.substack.com/feed', name: 'Rachel Roddy', tag: 'Italy', category: 'Food and Drink', unfiltered: true },
  { url: 'https://jessicanabongo.substack.com/feed', name: 'Jessica Nabongo', tag: 'General', category: 'Culture', unfiltered: true },
  { url: 'https://oneika.substack.com/feed', name: 'Oneika the Traveller', tag: 'General', category: 'Culture', unfiltered: true },
  { url: 'https://thebrowser.com/rss', name: 'The Browser', tag: 'General', category: 'Culture', unfiltered: true },
]

// Google News destination queries. These are already topic-specific, so they
// bypass the keyword filter. Each query has its own destination + category.
const GNEWS_QUERIES = [
  { q: 'Rome restaurant opening 2026', tag: 'Italy', category: 'Food and Drink' },
  { q: 'Florence food scene 2026', tag: 'Italy', category: 'Food and Drink' },
  { q: 'Sicily travel guide', tag: 'Italy', category: 'Culture' },
  { q: 'Lake Como hotel', tag: 'Italy', category: 'Hotels' },
  { q: 'Amalfi coast restaurants', tag: 'Italy', category: 'Food and Drink' },
  { q: 'Rome neighborhood guide', tag: 'Italy', category: 'Culture' },
  { q: 'Milan design food culture', tag: 'Italy', category: 'Culture' },
  { q: 'Puglia travel', tag: 'Italy', category: 'Culture' },
  { q: 'Lisbon restaurant opening 2026', tag: 'Portugal', category: 'Food and Drink' },
  { q: 'Porto food scene', tag: 'Portugal', category: 'Food and Drink' },
  { q: 'Portugal boutique hotel', tag: 'Portugal', category: 'Hotels' },
  { q: 'Lisbon neighborhood guide', tag: 'Portugal', category: 'Culture' },
  { q: 'Algarve travel 2026', tag: 'Portugal', category: 'Culture' },
  { q: 'Alentejo wine food', tag: 'Portugal', category: 'Food and Drink' },
  { q: 'Barcelona restaurant 2026', tag: 'Spain', category: 'Food and Drink' },
  { q: 'Madrid food scene', tag: 'Spain', category: 'Food and Drink' },
  { q: 'San Sebastian gastronomy', tag: 'Spain', category: 'Food and Drink' },
  { q: 'Spain boutique hotel', tag: 'Spain', category: 'Hotels' },
  { q: 'Seville travel guide', tag: 'Spain', category: 'Culture' },
  { q: 'Reykjavik restaurant 2026', tag: 'Iceland', category: 'Food and Drink' },
  { q: 'Iceland travel guide', tag: 'Iceland', category: 'Culture' },
  { q: 'Iceland boutique hotel', tag: 'Iceland', category: 'Hotels' },
  { q: 'Iceland food culture', tag: 'Iceland', category: 'Food and Drink' },
]

const ALL_FEED_SOURCES = [
  ...SOURCE_REGISTRY,
  ...GNEWS_QUERIES.map((g) => ({
    url: gnews(g.q),
    name: `Google News · ${g.q}`,
    tag: g.tag,
    category: g.category,
    unfiltered: true,
  })),
]

const DESTINATION_KEYWORDS = [
  'rome', 'lisbon', 'barcelona', 'madrid', 'florence', 'sicily', 'porto',
  'reykjavik', 'iceland', 'italy', 'portugal', 'spain', 'tuscany', 'amalfi',
  'venice', 'puglia', 'algarve', 'alentejo', 'lake como', 'seville',
  'san sebastian', 'bilbao', 'sardinia', 'naples', 'bologna', 'sintra',
  'cascais', 'douro', 'girona', 'malaga', 'granada', 'ibiza', 'mallorca',
  'westfjords', 'akureyri', 'european', 'europe',
]

const ADVISORY_PHRASES = [
  'travel advisory', 'entry requirements', 'visa requirements',
  'travel restriction', 'passport requirement', 'tourist tax',
  'entry fee', 'travel documents', 'health requirement', 'border crossing',
]

const matchesAny = (text, list) => {
  const t = text.toLowerCase()
  return list.some((kw) => t.includes(kw))
}

// Returns { keep, isAdvisory }. Advisory items always pass; unfiltered sources
// always pass; everything else needs at least one destination keyword hit.
function classifyItem(item, source) {
  const text = `${item.title || ''} ${item.description || ''}`
  const isAdvisory = matchesAny(text, ADVISORY_PHRASES)
  if (isAdvisory) return { keep: true, isAdvisory: true }
  if (source.unfiltered) return { keep: true, isAdvisory: false }
  if (matchesAny(text, DESTINATION_KEYWORDS)) return { keep: true, isAdvisory: false }
  return { keep: false, isAdvisory: false }
}

const TOPIC_CATEGORIES = ['All Topics', 'Food and Drink', 'Hotels', 'Culture', 'Travel Trends', 'Advisory']

const DEFAULT_FOLLOWING = [
  // Existing
  { id: 'f1', name: 'Hotels Above Par', url: 'https://hotelsaboveparweekly.substack.com/feed', tag: 'Hotels' },
  { id: 'f2', name: 'Katie Parla', url: 'https://katieparla.substack.com/feed', tag: 'Italy' },
  { id: 'f3', name: 'Elizabeth Minchilli', url: 'https://elizabethminchilli.substack.com/feed', tag: 'Italy' },
  { id: 'f4', name: 'Portugalist', url: 'https://www.portugalist.com/feed', tag: 'Portugal' },
  { id: 'f5', name: 'Grantourismo', url: 'https://grantourismotravels.com/feed', tag: 'General' },
  { id: 'f6', name: 'David Lebovitz', url: 'https://davidlebovitz.substack.com/feed', tag: 'General' },
  { id: 'f7', name: 'Emiko Davies', url: 'https://emikodavies.substack.com/feed', tag: 'Italy' },
  { id: 'f8', name: 'Rolf Potts', url: 'https://rolfpotts.substack.com/feed', tag: 'General' },
  { id: 'f9', name: 'Vittles', url: 'https://vittles.substack.com/feed', tag: 'General' },
  { id: 'f10', name: 'Culinary Backstreets Newsletter', url: 'https://culinarybackstreets.substack.com/feed', tag: 'General' },
  { id: 'f11', name: 'Fathom', url: 'https://fathomaway.com/feed', tag: 'General' },
  { id: 'f12', name: 'Rachel Roddy', url: 'https://rachelroddy.substack.com/feed', tag: 'Italy' },
  { id: 'f13', name: 'Jessica Nabongo', url: 'https://jessicanabongo.substack.com/feed', tag: 'General' },
  { id: 'f14', name: 'Oneika the Traveller', url: 'https://oneika.substack.com/feed', tag: 'General' },
  { id: 'f15', name: 'The Browser', url: 'https://thebrowser.com/rss', tag: 'General' },
  // Italy
  { id: 'f16', name: "Danielle Oteri's Italy", url: 'https://danielleoteri.substack.com/feed', tag: 'Italy' },
  { id: 'f17', name: 'Love to Visit Italy', url: 'https://lovetovisititaly.substack.com/feed', tag: 'Italy' },
  { id: 'f18', name: 'Delicious Italy', url: 'https://deliciousitaly.substack.com/feed', tag: 'Italy' },
  { id: 'f19', name: 'Crystal King', url: 'https://thecrystalking.substack.com/feed', tag: 'Italy' },
  { id: 'f20', name: 'Paradise of Exiles', url: 'https://paradiseofexiles.substack.com/feed', tag: 'Italy' },
  { id: 'f21', name: 'Dream of Italy', url: 'https://dreamofitaly.com/feed', tag: 'Italy' },
  { id: 'f22', name: 'MilanoStyle', url: 'https://milanostyle.com/feed', tag: 'Italy' },
  { id: 'f23', name: 'Life in Italy', url: 'https://lifeinitaly.com/feed', tag: 'Italy' },
  { id: 'f24', name: 'Italy Magazine', url: 'https://italymagazine.com/feed', tag: 'Italy' },
  { id: 'f25', name: 'Our Escape Clause Italy', url: 'https://www.ourescapeclause.com/feed', tag: 'Italy' },
  { id: 'f26', name: 'Judy Witts Francini Divina Cucina', url: 'https://divinavucina.substack.com/feed', tag: 'Italy' },
  { id: 'f27', name: 'Claudia Vannucci Florence', url: 'https://claudiavannucci.substack.com/feed', tag: 'Italy' },
  // Portugal
  { id: 'f28', name: 'Emily in Lisbon', url: 'https://emilyinlisbon.substack.com/feed', tag: 'Portugal' },
  { id: 'f29', name: 'Dan Flying Solo', url: 'https://danflyingsolo.substack.com/feed', tag: 'Portugal' },
  { id: 'f30', name: 'Food From Portugal', url: 'https://www.foodfromportugal.com/feed', tag: 'Portugal' },
  // Spain
  { id: 'f31', name: 'The New Paris Dispatch', url: 'https://newparisdispatch.substack.com/feed', tag: 'General' },
  { id: 'f32', name: 'Shortlisted by Rebekah Peppler', url: 'https://shortlisted.substack.com/feed', tag: 'General' },
  { id: 'f33', name: 'Spain Food Sherpas', url: 'https://www.spainfoodsherpas.com/feed', tag: 'Spain' },
  // Iceland
  { id: 'f34', name: 'Iceland With a View', url: 'https://icelandwithaview.substack.com/feed', tag: 'Iceland' },
  { id: 'f35', name: 'Guide to Iceland Blog', url: 'https://guidetoiceland.is/feed', tag: 'Iceland' },
  { id: 'f36', name: 'Arctic Adventures Blog', url: 'https://adventures.is/blog/feed', tag: 'Iceland' },
  // General European Travel
  { id: 'f37', name: 'The Contender', url: 'https://thecontender.substack.com/feed', tag: 'General' },
  { id: 'f38', name: 'Departure', url: 'https://departure.substack.com/feed', tag: 'General' },
  { id: 'f39', name: 'Talking Travel Writing', url: 'https://talkingtravel.substack.com/feed', tag: 'General' },
  { id: 'f40', name: 'Travelogue Newsletter', url: 'https://travelogue.substack.com/feed', tag: 'General' },
  { id: 'f41', name: 'The Venetian Pantry', url: 'https://venetianpantry.substack.com/feed', tag: 'Italy' },
  { id: 'f42', name: 'Professional Traveler', url: 'https://professionaltraveler.substack.com/feed', tag: 'General' },
  { id: 'f43', name: 'Rebecca Holland', url: 'https://rebeccaholland.substack.com/feed', tag: 'General' },
  // Wine and Drink
  { id: 'f44', name: 'Decanter', url: 'https://www.decanter.com/feed', tag: 'General' },
  { id: 'f45', name: 'VinePair', url: 'https://vinepair.com/feed', tag: 'General' },
  { id: 'f46', name: 'Wine Folly', url: 'https://winefolly.com/feed', tag: 'General' },
  { id: 'f47', name: 'Jancis Robinson', url: 'https://www.jancisrobinson.com/rss', tag: 'General' },
  // Hotels
  { id: 'f48', name: 'Tablet Hotels', url: 'https://www.tablethotels.com/blog/feed', tag: 'Hotels' },
  { id: 'f49', name: 'Mr & Mrs Smith', url: 'https://www.mrandmrssmith.com/feed', tag: 'Hotels' },
  { id: 'f50', name: 'Hideaway Report', url: 'https://www.hideawayreport.com/feed', tag: 'Hotels' },
  { id: 'f51', name: 'Secret Escapes', url: 'https://www.secretescapes.com/editorial/feed', tag: 'Hotels' },
  // Lifestyle and Culture
  { id: 'f52', name: 'Kinfolk', url: 'https://www.kinfolk.com/feed', tag: 'General' },
  { id: 'f53', name: 'Cereal Magazine', url: 'https://readcereal.com/feed', tag: 'General' },
  { id: 'f54', name: 'Roads and Kingdoms', url: 'https://roadsandkingdoms.com/feed', tag: 'General' },
  { id: 'f55', name: 'Skift', url: 'https://skift.com/feed', tag: 'General' },
]

const DEFAULT_INSTAGRAM = [
  // Existing
  { id: 'ig1', handle: 'italytravel', tag: 'Italy', notes: '' },
  { id: 'ig2', handle: 'rome.guide', tag: 'Italy', notes: '' },
  { id: 'ig3', handle: 'florenceitaly', tag: 'Italy', notes: '' },
  { id: 'ig4', handle: 'visitportugal', tag: 'Portugal', notes: '' },
  { id: 'ig5', handle: 'lisbonlovers', tag: 'Portugal', notes: '' },
  { id: 'ig6', handle: 'spain', tag: 'Spain', notes: '' },
  { id: 'ig7', handle: 'madrid_food', tag: 'Spain', notes: '' },
  { id: 'ig8', handle: 'icelandair', tag: 'Iceland', notes: '' },
  { id: 'ig9', handle: 'visiticeland', tag: 'Iceland', notes: '' },
  { id: 'ig10', handle: 'hotelsabovepar', tag: 'Hotels', notes: '' },
  { id: 'ig11', handle: 'tablethotels', tag: 'Hotels', notes: '' },
  { id: 'ig12', handle: 'eater', tag: 'Food', notes: '' },
  { id: 'ig13', handle: 'bonappetit', tag: 'Food', notes: '' },
  // Italy
  { id: 'ig14', handle: 'elizabethminchilli', tag: 'Italy', notes: '' },
  { id: 'ig15', handle: 'katieparla', tag: 'Italy', notes: '' },
  { id: 'ig16', handle: 'benkielesinski', tag: 'Italy', notes: '' },
  { id: 'ig17', handle: 'julskitchen', tag: 'Italy', notes: '' },
  { id: 'ig18', handle: 'milanostyle', tag: 'Italy', notes: '' },
  { id: 'ig19', handle: 'chefstable', tag: 'Italy', notes: '' },
  { id: 'ig20', handle: 'divinavucina', tag: 'Italy', notes: '' },
  // Portugal
  { id: 'ig21', handle: 'danflyingsolo', tag: 'Portugal', notes: '' },
  { id: 'ig22', handle: 'diogo.carrilho', tag: 'Portugal', notes: '' },
  { id: 'ig23', handle: 'insidelisbon', tag: 'Portugal', notes: '' },
  { id: 'ig24', handle: 'portugalist', tag: 'Portugal', notes: '' },
  // Spain
  { id: 'ig25', handle: 'devourspain', tag: 'Spain', notes: '' },
  { id: 'ig26', handle: 'barcelonafoodexperience', tag: 'Spain', notes: '' },
  { id: 'ig27', handle: 'eatmadrid', tag: 'Spain', notes: '' },
  // Iceland
  { id: 'ig28', handle: 'asasteinars', tag: 'Iceland', notes: '' },
  { id: 'ig29', handle: 'chrisburkard', tag: 'Iceland', notes: '' },
  { id: 'ig30', handle: 'lebackpacker', tag: 'Iceland', notes: '' },
  { id: 'ig31', handle: 'icelandwithaview', tag: 'Iceland', notes: '' },
  { id: 'ig32', handle: 'gislimatt', tag: 'Iceland', notes: '' },
  // Wine and Drink
  { id: 'ig33', handle: 'decanter', tag: 'General', notes: '' },
  { id: 'ig34', handle: 'vinepair', tag: 'General', notes: '' },
  { id: 'ig35', handle: 'winefolly', tag: 'General', notes: '' },
  { id: 'ig36', handle: 'jancisrobinson', tag: 'General', notes: '' },
  // Hotels
  { id: 'ig37', handle: 'mrandmrssmith', tag: 'Hotels', notes: '' },
  { id: 'ig38', handle: 'secretescapes', tag: 'Hotels', notes: '' },
  // General
  { id: 'ig39', handle: 'professionaltraveler', tag: 'General', notes: '' },
  { id: 'ig40', handle: 'culinarybackstreets', tag: 'General', notes: '' },
  { id: 'ig41', handle: 'theinfatuation', tag: 'General', notes: '' },
  { id: 'ig42', handle: 'cntraveler', tag: 'General', notes: '' },
  { id: 'ig43', handle: 'afar', tag: 'General', notes: '' },
  { id: 'ig44', handle: 'kinfolk', tag: 'General', notes: '' },
  { id: 'ig45', handle: 'roadsandkingdoms', tag: 'General', notes: '' },
  { id: 'ig46', handle: 'oneikathetraveller', tag: 'General', notes: '' },
  { id: 'ig47', handle: 'jessicanabongo', tag: 'General', notes: '' },
]

const DESTINATIONS_INFO = [
  {
    id: 'italy',
    name: 'Italy',
    overview: [
      "Italy is not one country, it is a stack of regions that happen to share a passport. The north and the south can feel like different worlds, with different food, different rhythms, and different relationships to time. A trip that treats Florence and Palermo as variations on a theme will miss almost everything that matters. The first thing to internalize is that local and seasonal are not buzzwords here, they are how the entire culture organizes its day. If a restaurant in Bologna is serving the same menu it served in July, something is wrong.",
      "Rome and Florence pull a lot of the same clients but they reward completely different approaches. Rome is layered, scrappy, and best when you let it set the pace. Florence is compact and precise, and the trick there is staying long enough to leave the historical center for a real meal. Both cities have a heavy daytripper problem and both punish people who try to hit the highlights in two days.",
      "Lake Como is a specific kind of luxury that does not translate well to people who think luxury means a five star buffet. The point is the proportion, the lemons, the slow boat from Bellagio, and a long lunch on a terrace where nothing is rushing you. Sicily and Puglia are the regions to send curious clients who already know Italy and want something that feels less performed.",
    ],
    keyThings: [
      'Tipping is not expected. Rounding up the bill or leaving a euro or two for excellent service is plenty. Coperto on the bill is a cover charge, not a tip.',
      'Lunch is the main meal in many regions, especially Sunday lunch. Dinner can be lighter and later, often starting at 8pm or 9pm.',
      'Aperitivo is a real cultural ritual between roughly 6pm and 8pm, not just a marketing term. In Milan it can replace dinner if you commit to it.',
      'Avoid restaurants with photo menus, multilingual chalkboards, and hosts pulling people in off the street, especially within 200 meters of a major landmark.',
      'August is when Italians leave the cities for the coast. Many of the best restaurants close for two or three weeks. Plan around it.',
      'Churches enforce dress codes. Shoulders and knees covered, no exceptions at the Vatican or the Duomo.',
      'On regional trains you must validate paper tickets in the green or yellow machines on the platform before boarding. Fines for skipping this are real.',
    ],
  },
  {
    id: 'portugal',
    name: 'Portugal',
    overview: [
      "Portugal punches well above its weight, and Lisbon is the clearest example. It is a small capital with the food scene of a city three times its size, an architecture and tile tradition that rewards walking with no plan, and a music tradition (fado) that holds the city's emotional center. The melancholy people talk about is real, and so is the warmth that sits right next to it. The country is gentler than Spain and slower than Italy, and that is the feature, not the bug.",
      "Porto is consistently underrated. It feels more honest than Lisbon, more compact, and the food and wine are doing more interesting things than most visitors realize. The Douro Valley is one of the great wine regions in Europe and almost no one outside the trade treats it that way. Send curious eaters and drinkers there with two or three nights at minimum.",
      "The Alentejo is the quiet choice for serious travelers. Wide open landscape, ancient hilltop towns, very good wine, and almost no crowds. It rewards people who want to slow down and read the room. The Algarve is its own thing, beach-driven and seasonal, best in shoulder months when the heat and the crowds back off.",
    ],
    keyThings: [
      'Tipping is not mandatory but 5 to 10 percent is appreciated for good service. Round up at cafes.',
      'Dinner starts late by Northern European standards, usually 8pm or after. Make reservations the day of for anywhere serious.',
      'Lisbon is built on hills and the cobblestones are slick when wet. Bring shoes with grip.',
      'Uber and Bolt both work well in Lisbon and Porto. Cheaper and easier than taxis.',
      'The Time Out Market is fine for a beer and a snack. Do not make it your primary food experience in Lisbon.',
      'Many of the best small restaurants do not take reservations and fill up by 8pm. Show up early or be ready to wait.',
      'Pastel de nata is famous for a reason but the food culture goes much deeper. Seafood, bifana, ameijoas, the cheeses from the Serra da Estrela. Push past the obvious.',
    ],
  },
  {
    id: 'spain',
    name: 'Spain',
    overview: [
      "Spain is regional in a way most American travelers underestimate. Barcelona and Madrid are not two flavors of the same city, they are genuinely different places with different languages, different politics, different food, and different ideas about how to be a city. The same is true comparing Andalusia to the Basque Country or Galicia to Catalonia. A trip that treats Spain as a single country will miss the point.",
      "San Sebastian is one of the world's great food destinations and it earns the reputation. The pintxos bars in the Parte Vieja are the obvious starting point but the real story is the density of serious restaurants in and around the city. People plan entire trips around it and they are right to. Madrid does not get the credit it deserves for its food scene either, especially the markets and the older taverns.",
      "Spanish meal culture is intense and on its own clock. Lunch is long and serious, dinner is late and social, and the spaces between are filled with coffee, wine, and small bites. Trying to force the day into a North American or even Northern European rhythm is the single fastest way to have a bad time. Spain is also routinely underplanned, especially Andalusia in spring and the Basque Country in summer.",
    ],
    keyThings: [
      'Lunch runs roughly 2pm to 4pm. Dinner starts at 9pm and a 10pm or 11pm reservation is normal. Adjust the day around it.',
      'Tipping is not expected. A euro or two on a coffee or beer, a few euros on a nice dinner is generous.',
      'Pintxos is the Basque word and the format is small bites on bread, often with a toothpick. Tapas is the southern format and is broader. They are not interchangeable.',
      'Siesta is real outside the big cities. Many shops and small restaurants close from roughly 2pm to 5pm. Plan errands and museums around it.',
      'Barcelona pickpocketing is real, especially on La Rambla, the metro, and around Sagrada Familia. Front pockets, no phone on the table at outdoor cafes.',
      'San Sebastian restaurants book months out, especially the three star tier and the well known mid range spots. Reserve before booking flights for serious food trips.',
      'In Andalusia in July and August the heat is no joke. Mornings, late evenings, and indoor lunches are how locals do it.',
    ],
  },
  {
    id: 'iceland',
    name: 'Iceland',
    overview: [
      "Iceland operates at a scale that is hard to grasp from photos. The landscape is bigger and emptier than first time visitors expect, and that is the entire point. People come for waterfalls and glaciers and end up most affected by the long stretches of nothing in between. The country rewards travelers who let the landscape do the work and resist the urge to overschedule.",
      "The Ring Road is a great trip if you have at least eight to ten days. For shorter visits it is overrated and turns into a driving marathon that misses the actual experience. A more honest plan for a four to seven day trip is to base out of Reykjavik and the south coast, or to fly to Akureyri and explore the north. Reykjavik itself is smaller than people imagine, more like a creative neighborhood than a capital, and that is part of the charm.",
      "The seasons here are not metaphors. Winter is dark and dramatic and the right call for Northern Lights and ice caves. Summer is bright around the clock and the right call for hiking, puffins, and the highlands. Choosing the wrong season for the wrong reason is the most common mistake. Iceland rewards curiosity over itinerary, and the best moments are usually the unscheduled ones.",
    ],
    keyThings: [
      'Tipping is not customary anywhere. Service is included and rounding up is the most you would do.',
      'Everything is expensive. Budget accordingly, especially restaurants and alcohol. A nice dinner for two can easily run 200 dollars or more.',
      'Weather changes fast and often. Dress in layers, always have a waterproof shell, and check road and weather conditions daily on vedur.is and road.is.',
      'Northern Lights tours and ice cave tours book up. Reserve before the trip if either is a priority.',
      'A rental car is strongly recommended outside Reykjavik. Tour buses are an option but limit you. A 4x4 is needed for any F road or the highlands in summer.',
      'Tap water is among the best in the world. Skip the bottled water entirely.',
      'In June and July the sun barely sets. Blackout curtains, a sleep mask, and a flexible idea of bedtime matter more than people expect.',
    ],
  },
]

const EXAMPLE_PROMPTS = [
  'Best new restaurants in Lisbon opening in 2026',
  'Is Trastevere still worth staying in or too touristy?',
  'Boutique hotels in Sicily under $300 per night',
  'What neighborhoods are locals eating in Florence right now',
  'Best skip the line tours for the Vatican',
  'What is trending in Reykjavik for travelers right now',
]

function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      if (raw == null) return initial
      return JSON.parse(raw)
    } catch {
      return initial
    }
  })
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
  }, [key, value])
  return [value, setValue]
}

function formatDate(raw) {
  if (!raw) return ''
  const d = new Date(raw)
  if (isNaN(d.getTime())) return ''
  const now = Date.now()
  const diff = now - d.getTime()
  const day = 24 * 60 * 60 * 1000
  if (diff < 60 * 60 * 1000) return `${Math.max(1, Math.round(diff / 60000))}m ago`
  if (diff < day) return `${Math.round(diff / (60 * 60 * 1000))}h ago`
  if (diff < 7 * day) return `${Math.round(diff / day)}d ago`
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

function cleanAnswerText(raw) {
  if (!raw) return ['']
  let text = raw
    .replace(/\r\n/g, '\n')
    .replace(/^\s*[.,;:]\s*$/gm, '')
  const blocks = text.split(/\n{2,}/)
  const paragraphs = []
  for (const block of blocks) {
    const cleaned = block
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .join(' ')
      .replace(/\s{2,}/g, ' ')
      .trim()
    if (cleaned) paragraphs.push(cleaned)
  }
  if (paragraphs.length === 0) {
    const fallback = text.replace(/\n/g, ' ').replace(/\s{2,}/g, ' ').trim()
    return fallback ? [fallback] : ['']
  }
  return paragraphs
}

function cleanHost(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}

function SectionHeader({ label, title }) {
  return (
    <div style={{ marginBottom: '1.75rem' }}>
      <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.tan, marginBottom: '0.25rem' }}>{label}</p>
      <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', fontWeight: '400', color: C.ink, margin: 0 }}>{title}</h2>
    </div>
  )
}

function DestinationFilter({ value, onChange, options = DESTS }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
      {options.map((d) => {
        const active = value === d
        return (
          <button
            key={d}
            onClick={() => onChange(d)}
            style={{
              fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', letterSpacing: '0.15em',
              textTransform: 'uppercase', cursor: 'pointer',
              color: active ? C.white : C.mid,
              backgroundColor: active ? C.terracotta : 'transparent',
              border: `1px solid ${active ? C.terracotta : C.sand}`,
              padding: '0.45rem 0.95rem',
            }}
          >
            {d}
          </button>
        )
      })}
    </div>
  )
}

function ArticleCard({ item, onSave, saved }) {
  return (
    <div style={{ borderBottom: `1px solid ${C.sand}`, padding: '1rem 0' }}>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
        <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.gold }}>
          {item.feedTitle || cleanHost(item.sourceUrl || item.link)}
        </span>
        {item.tag && (
          <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.tan }}>
            · {item.tag}
          </span>
        )}
        {item.category && (
          <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.tan }}>
            · {item.category}
          </span>
        )}
        {item.isAdvisory && (
          <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.terracotta }}>
            · Advisory
          </span>
        )}
        {item.pubDate && (
          <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.tan }}>
            · {formatDate(item.pubDate)}
          </span>
        )}
      </div>
      <a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        style={{ fontFamily: 'Georgia, serif', fontSize: '1.05rem', fontWeight: '400', color: C.ink, textDecoration: 'none', lineHeight: '1.4', display: 'block', marginBottom: '0.5rem' }}
      >
        {item.title}
      </a>
      {item.description && (
        <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.85rem', fontWeight: '300', color: C.charcoal, lineHeight: '1.6', marginBottom: '0.6rem' }}>
          {item.description}
        </p>
      )}
      {onSave && (
        <button
          onClick={() => onSave(item)}
          style={{
            ...softBtn,
            color: saved ? C.terracotta : C.mid,
            borderColor: saved ? C.terracotta : C.sand,
          }}
        >
          {saved ? 'Saved' : 'Save'}
        </button>
      )}
    </div>
  )
}

// ── FEED TAB ────────────────────────────────────────────────────────────────
function FeedTab({ savedItems, setSavedItems }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [dest, setDest] = useState('All')
  const [topic, setTopic] = useState('All Topics')
  const [lastRefreshed, setLastRefreshed] = useState(null)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/rss', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sources: ALL_FEED_SOURCES.map((s) => ({ url: s.url, tag: s.tag })),
        }),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Feed fetch failed')
      const data = await res.json()
      const merged = (data.feeds || []).flatMap((f, idx) => {
        const source = ALL_FEED_SOURCES[idx]
        if (!source) return []
        return (f.items || [])
          .map((it) => {
            const cls = classifyItem(it, source)
            if (!cls.keep) return null
            return {
              ...it,
              tag: source.tag,
              category: source.category,
              feedTitle: source.name,
              sourceUrl: source.url,
              isAdvisory: cls.isAdvisory,
            }
          })
          .filter(Boolean)
      })
      merged.sort((a, b) => {
        const da = new Date(a.pubDate).getTime() || 0
        const db = new Date(b.pubDate).getTime() || 0
        return db - da
      })
      setItems(merged)
      setLastRefreshed(new Date())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    let arr = items
    if (dest !== 'All') arr = arr.filter((it) => it.tag === dest)
    if (topic === 'Advisory') arr = arr.filter((it) => it.isAdvisory)
    else if (topic !== 'All Topics') arr = arr.filter((it) => it.category === topic)
    return arr.slice(0, 120)
  }, [items, dest, topic])

  const isSaved = (it) => savedItems.some((s) => s.link === it.link)
  const toggleSave = (it) => {
    if (isSaved(it)) {
      setSavedItems(savedItems.filter((s) => s.link !== it.link))
    } else {
      setSavedItems([
        { id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, savedAt: new Date().toISOString(), notes: '', source: 'feed', ...it },
        ...savedItems,
      ])
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
        <SectionHeader label="Feed" title="Latest travel news." />
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {lastRefreshed && (
            <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', color: C.tan, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Updated {formatDate(lastRefreshed.toISOString())}
            </span>
          )}
          <button onClick={load} disabled={loading} style={{ ...primaryBtn, opacity: loading ? 0.6 : 1 }}>
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>
      <DestinationFilter value={dest} onChange={setDest} />
      <DestinationFilter value={topic} onChange={setTopic} options={TOPIC_CATEGORIES} />
      {error && <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.8rem', color: '#9E6060', marginBottom: '1rem' }}>{error}</p>}
      {loading && items.length === 0 && (
        <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.85rem', color: C.tan }}>Pulling feeds from a lot of sources. This takes a few seconds.</p>
      )}
      {!loading && filtered.length === 0 && !error && (
        <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.85rem', color: C.tan }}>No articles yet.</p>
      )}
      <div>
        {filtered.map((it, i) => (
          <ArticleCard key={`${it.link}_${i}`} item={it} onSave={toggleSave} saved={isSaved(it)} />
        ))}
      </div>
    </div>
  )
}

// ── FOLLOWING TAB ───────────────────────────────────────────────────────────
function FollowingTab({ savedItems, setSavedItems }) {
  const [sources, setSources] = useLocalStorage('deriva_research_following_v3', DEFAULT_FOLLOWING)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [dest, setDest] = useState('All')
  const [adding, setAdding] = useState(false)
  const [newUrl, setNewUrl] = useState('')
  const [newName, setNewName] = useState('')
  const [newTag, setNewTag] = useState('General')

  const load = async () => {
    if (!sources.length) { setItems([]); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/rss', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sources: sources.map((s) => ({ url: s.url, tag: s.tag })) }),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Feed fetch failed')
      const data = await res.json()
      const merged = (data.feeds || []).flatMap((f, idx) => {
        const src = sources[idx]
        return (f.items || []).slice(0, 5).map((it) => ({
          ...it,
          tag: src?.tag || 'General',
          feedTitle: src?.name || f.feedTitle || cleanHost(src?.url || ''),
          sourceId: src?.id,
        }))
      })
      merged.sort((a, b) => (new Date(b.pubDate).getTime() || 0) - (new Date(a.pubDate).getTime() || 0))
      setItems(merged)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [sources.length])

  const addSource = () => {
    const url = newUrl.trim()
    const name = newName.trim() || cleanHost(url) || 'New source'
    if (!url) return
    setSources([{ id: `f_${Date.now()}`, name, url, tag: newTag }, ...sources])
    setNewUrl(''); setNewName(''); setNewTag('General'); setAdding(false)
  }

  const removeSource = (id) => setSources(sources.filter((s) => s.id !== id))

  const filteredItems = useMemo(() => {
    if (dest === 'All') return items
    return items.filter((it) => it.tag === dest)
  }, [items, dest])

  const filteredSources = useMemo(() => {
    if (dest === 'All') return sources
    return sources.filter((s) => s.tag === dest)
  }, [sources, dest])

  const isSaved = (it) => savedItems.some((s) => s.link === it.link)
  const toggleSave = (it) => {
    if (isSaved(it)) setSavedItems(savedItems.filter((s) => s.link !== it.link))
    else setSavedItems([{ id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, savedAt: new Date().toISOString(), notes: '', source: 'following', ...it }, ...savedItems])
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
        <SectionHeader label="Following" title="Your curated sources." />
        <button onClick={() => setAdding(!adding)} style={primaryBtn}>{adding ? 'Cancel' : 'Add Source'}</button>
      </div>

      {adding && (
        <div style={{ backgroundColor: C.parchment, border: `1px solid ${C.sand}`, padding: '1.25rem', marginBottom: '1.25rem' }}>
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={lbl}>RSS feed URL or Substack URL</label>
            <input value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="https://example.substack.com/feed" style={inp} />
          </div>
          <div className="stack-mobile" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={lbl}>Name</label>
              <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Publication name" style={inp} />
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={lbl}>Tag</label>
              <select value={newTag} onChange={(e) => setNewTag(e.target.value)} style={inp}>
                {ADD_DEST_TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <button onClick={addSource} style={primaryBtn}>Add</button>
        </div>
      )}

      <DestinationFilter value={dest} onChange={setDest} />

      <div style={{ marginBottom: '1.5rem' }}>
        <p style={lbl}>Sources ({filteredSources.length})</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {filteredSources.map((s) => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: `1px solid ${C.sand}`, padding: '0.4rem 0.75rem', backgroundColor: C.white }}>
              <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.75rem', color: C.charcoal }}>{s.name}</span>
              <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem', color: C.tan, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{s.tag}</span>
              <button onClick={() => removeSource(s.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.tan, fontSize: '0.9rem', padding: 0, lineHeight: 1 }}>×</button>
            </div>
          ))}
        </div>
      </div>

      {loading && <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.85rem', color: C.tan }}>Loading latest posts...</p>}
      {error && <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.8rem', color: '#9E6060' }}>{error}</p>}

      <div>
        {filteredItems.map((it, i) => (
          <ArticleCard key={`${it.link}_${i}`} item={it} onSave={toggleSave} saved={isSaved(it)} />
        ))}
      </div>
    </div>
  )
}

// ── RESEARCH TAB ────────────────────────────────────────────────────────────
function ResearchSearchTab({ savedItems, setSavedItems }) {
  const [history, setHistory] = useLocalStorage('deriva_research_history', [])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const runQuery = async (text) => {
    const q = text.trim()
    if (!q || loading) return
    setLoading(true)
    setError('')
    setQuery('')
    try {
      const res = await fetch('/api/research-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Search failed')
      const data = await res.json()
      const entry = {
        id: `r_${Date.now()}`,
        query: q,
        answer: data.text,
        citations: data.citations || [],
        at: new Date().toISOString(),
      }
      setHistory([entry, ...history])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const saveResult = (entry) => {
    const alreadySaved = savedItems.some((s) => s.researchId === entry.id)
    if (alreadySaved) {
      setSavedItems(savedItems.filter((s) => s.researchId !== entry.id))
      return
    }
    setSavedItems([
      {
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        researchId: entry.id,
        title: entry.query,
        description: entry.answer,
        citations: entry.citations,
        source: 'research',
        savedAt: new Date().toISOString(),
        notes: '',
        tag: 'General',
      },
      ...savedItems,
    ])
  }

  const isEntrySaved = (entry) => savedItems.some((s) => s.researchId === entry.id)

  return (
    <div>
      <SectionHeader label="Research" title="Ask anything about your destinations." />
      <form
        onSubmit={(e) => { e.preventDefault(); runQuery(query) }}
        style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask anything about your destinations..."
          style={{ ...inp, flex: 1 }}
          disabled={loading}
        />
        <button type="submit" disabled={loading || !query.trim()} style={{ ...primaryBtn, opacity: loading || !query.trim() ? 0.6 : 1 }}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {history.length === 0 && !loading && (
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ ...lbl, marginBottom: '0.75rem' }}>Try asking</p>
          {EXAMPLE_PROMPTS.map((q) => (
            <button
              key={q}
              onClick={() => runQuery(q)}
              style={{ display: 'block', fontFamily: 'system-ui, sans-serif', fontSize: '0.85rem', fontWeight: '300', color: C.charcoal, background: C.white, border: `1px solid ${C.sand}`, padding: '0.7rem 1rem', cursor: 'pointer', marginBottom: '0.5rem', textAlign: 'left', width: '100%' }}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div style={{ border: `1px solid ${C.sand}`, backgroundColor: C.parchment, padding: '1.5rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {[100, 95, 80, 100, 60].map((w, i) => (
              <div key={i} style={{ height: '0.75rem', width: `${w}%`, backgroundColor: C.sand, borderRadius: '3px', animation: 'shimmer 1.5s ease-in-out infinite', opacity: 0.6 }} />
            ))}
          </div>
          <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.75rem', color: C.tan, marginTop: '1rem', margin: 0, marginTop: '1rem' }}>Searching the web and thinking this through...</p>
          <style>{`@keyframes shimmer { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.7; } }`}</style>
        </div>
      )}
      {error && <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.8rem', color: '#9E6060', marginBottom: '1rem' }}>{error}</p>}

      {history.map((entry) => {
        const paragraphs = cleanAnswerText(entry.answer)
        return (
          <div key={entry.id} style={{ marginBottom: '1.75rem', border: `1px solid ${C.sand}`, backgroundColor: C.white, padding: '1.25rem 1.5rem' }}>
            <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: C.gold, marginBottom: '0.4rem' }}>Question</p>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.05rem', color: C.ink, marginBottom: '1rem', lineHeight: '1.5' }}>{entry.query}</p>
            <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: C.gold, marginBottom: '0.6rem' }}>Answer</p>
            <div style={{ marginBottom: '1rem' }}>
              {paragraphs.map((p, i) => (
                <p key={i} style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.9rem', fontWeight: '300', color: C.charcoal, lineHeight: '1.8', marginBottom: '0.85rem', margin: 0, marginBottom: i < paragraphs.length - 1 ? '0.85rem' : 0 }}>
                  {p}
                </p>
              ))}
            </div>
            {entry.citations?.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ ...lbl, marginBottom: '0.5rem' }}>Sources</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {entry.citations.map((c, i) => (
                    <a key={i} href={c.url} target="_blank" rel="noopener noreferrer" style={{
                      fontFamily: 'system-ui, sans-serif', fontSize: '0.7rem', color: C.terracotta,
                      textDecoration: 'none', border: `1px solid ${C.sand}`, padding: '0.3rem 0.65rem',
                      backgroundColor: C.parchment, display: 'inline-block',
                    }}>
                      {c.title || cleanHost(c.url)}
                    </a>
                  ))}
                </div>
              </div>
            )}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => saveResult(entry)} style={{ ...softBtn, color: isEntrySaved(entry) ? C.terracotta : C.mid, borderColor: isEntrySaved(entry) ? C.terracotta : C.sand }}>
                {isEntrySaved(entry) ? 'Saved' : 'Save'}
              </button>
              <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.65rem', color: C.tan, alignSelf: 'center' }}>
                {formatDate(entry.at)}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── INSTAGRAM TAB ───────────────────────────────────────────────────────────
function InstagramTab() {
  const [accounts, setAccounts] = useLocalStorage('deriva_research_instagram_v2', DEFAULT_INSTAGRAM)
  const [dest, setDest] = useState('All')
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ handle: '', tag: 'Italy', notes: '' })
  const [editingNotes, setEditingNotes] = useState(null)

  const filtered = dest === 'All' ? accounts : accounts.filter((a) => a.tag === dest)
  const igOptions = ['All', 'Italy', 'Portugal', 'Spain', 'Iceland', 'Hotels', 'Food']

  const add = () => {
    const handle = form.handle.trim().replace(/^@/, '')
    if (!handle) return
    setAccounts([{ id: `ig_${Date.now()}`, handle, tag: form.tag, notes: form.notes.trim() }, ...accounts])
    setForm({ handle: '', tag: 'Italy', notes: '' })
    setAdding(false)
  }

  const remove = (id) => setAccounts(accounts.filter((a) => a.id !== id))
  const updateNotes = (id, notes) => setAccounts(accounts.map((a) => (a.id === id ? { ...a, notes } : a)))

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
        <SectionHeader label="Instagram" title="Accounts to watch." />
        <button onClick={() => setAdding(!adding)} style={primaryBtn}>{adding ? 'Cancel' : 'Add Account'}</button>
      </div>

      {adding && (
        <div style={{ backgroundColor: C.parchment, border: `1px solid ${C.sand}`, padding: '1.25rem', marginBottom: '1.25rem' }}>
          <div className="stack-mobile" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={lbl}>Handle</label>
              <input value={form.handle} onChange={(e) => setForm({ ...form, handle: e.target.value })} placeholder="@account" style={inp} />
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={lbl}>Destination</label>
              <select value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} style={inp}>
                {['Italy', 'Portugal', 'Spain', 'Iceland', 'Hotels', 'Food'].map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={lbl}>Notes</label>
            <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="What to watch for" style={inp} />
          </div>
          <button onClick={add} style={primaryBtn}>Add</button>
        </div>
      )}

      <DestinationFilter value={dest} onChange={setDest} options={igOptions} />

      <div className="stack-mobile" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.75rem' }}>
        {filtered.map((a) => (
          <div key={a.id} style={{ border: `1px solid ${C.sand}`, backgroundColor: C.white, padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
              <a
                href={`https://instagram.com/${a.handle}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', color: C.ink, textDecoration: 'none' }}
              >
                @{a.handle}
              </a>
              <button onClick={() => remove(a.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.tan, fontSize: '1rem', padding: 0, lineHeight: 1 }}>×</button>
            </div>
            <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.gold, marginBottom: '0.5rem' }}>{a.tag}</p>
            {editingNotes === a.id ? (
              <input
                value={a.notes}
                onChange={(e) => updateNotes(a.id, e.target.value)}
                onBlur={() => setEditingNotes(null)}
                onKeyDown={(e) => { if (e.key === 'Enter') setEditingNotes(null) }}
                autoFocus
                style={{ ...inp, fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}
              />
            ) : (
              <p
                onClick={() => setEditingNotes(a.id)}
                style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.8rem', color: a.notes ? C.charcoal : C.tan, cursor: 'text', minHeight: '1.2em', margin: 0, fontStyle: a.notes ? 'normal' : 'italic' }}
              >
                {a.notes || 'Add notes'}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── SAVED TAB ───────────────────────────────────────────────────────────────
function SavedTab({ savedItems, setSavedItems }) {
  const [dest, setDest] = useState('All')
  const [editingId, setEditingId] = useState(null)
  const savedOptions = ['All', 'Italy', 'Portugal', 'Spain', 'Iceland', 'General']

  const filtered = dest === 'All' ? savedItems : savedItems.filter((s) => s.tag === dest)

  const remove = (id) => setSavedItems(savedItems.filter((s) => s.id !== id))
  const updateItem = (id, patch) => setSavedItems(savedItems.map((s) => (s.id === id ? { ...s, ...patch } : s)))

  return (
    <div>
      <SectionHeader label="Saved" title="Your personal library." />
      <DestinationFilter value={dest} onChange={setDest} options={savedOptions} />
      {filtered.length === 0 && (
        <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.85rem', color: C.tan }}>
          Nothing saved yet. Save articles from the Feed and Following tabs, or research results from the Research tab.
        </p>
      )}
      {filtered.map((item) => (
        <div key={item.id} style={{ border: `1px solid ${C.sand}`, backgroundColor: C.white, padding: '1.25rem 1.5rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.gold }}>
              {item.source === 'research' ? 'Research' : item.feedTitle || cleanHost(item.link)}
            </span>
            <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.tan }}>
              · {formatDate(item.savedAt)}
            </span>
          </div>
          {item.link ? (
            <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'Georgia, serif', fontSize: '1.05rem', color: C.ink, textDecoration: 'none', display: 'block', marginBottom: '0.5rem' }}>
              {item.title}
            </a>
          ) : (
            <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.05rem', color: C.ink, marginBottom: '0.5rem' }}>{item.title}</p>
          )}
          {item.description && (
            <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.85rem', color: C.charcoal, lineHeight: '1.7', marginBottom: '0.75rem', whiteSpace: 'pre-wrap' }}>
              {item.source === 'research' ? item.description : item.description}
            </p>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.75rem', alignItems: 'center' }}>
            <select
              value={item.tag || 'General'}
              onChange={(e) => updateItem(item.id, { tag: e.target.value })}
              style={{ ...inp, width: 'auto', padding: '0.4rem 0.6rem', fontSize: '0.75rem' }}
            >
              {['Italy', 'Portugal', 'Spain', 'Iceland', 'General', 'Hotels', 'Food'].map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <button onClick={() => setEditingId(editingId === item.id ? null : item.id)} style={softBtn}>
              {editingId === item.id ? 'Done' : 'Notes'}
            </button>
            <button onClick={() => remove(item.id)} style={{ ...softBtn, color: C.terracotta, borderColor: C.terracotta }}>
              Delete
            </button>
          </div>
          {editingId === item.id && (
            <textarea
              value={item.notes || ''}
              onChange={(e) => updateItem(item.id, { notes: e.target.value })}
              placeholder="good rec for Lake Como clients, verify still open, etc."
              rows={2}
              style={{ ...inp, resize: 'vertical', fontSize: '0.85rem' }}
            />
          )}
          {item.notes && editingId !== item.id && (
            <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.8rem', color: C.mid, fontStyle: 'italic', backgroundColor: C.parchment, padding: '0.6rem 0.8rem', borderLeft: `2px solid ${C.gold}` }}>
              {item.notes}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}

// ── WHEN TO GO ─────────────────────────────────────────────────────────────
const SEASON_STYLES = {
  peak: { label: 'Peak', color: '#fff', bg: C.terracotta },
  shoulder: { label: 'Shoulder', color: '#fff', bg: C.gold },
  off: { label: 'Off Season', color: '#fff', bg: C.mid },
}

const pillStyle = {
  display: 'inline-block', fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem',
  letterSpacing: '0.08em', padding: '0.2rem 0.55rem', marginRight: '0.35rem',
  marginBottom: '0.35rem', border: `1px solid ${C.sand}`, color: C.charcoal,
  backgroundColor: C.parchment, lineHeight: '1.5',
}

const levelColors = { Low: C.mid, Medium: C.gold, High: C.terracotta, 'Very High': '#9E4040', 'Medium-High': C.gold }
function LevelBadge({ label, value }) {
  return (
    <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: levelColors[value] || C.mid }}>
      {label}: {value}
    </span>
  )
}

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const WTG_CATEGORIES = ['Food and Wine', 'Nature and Wildlife', 'Culture and Festivals', 'Beaches and Coast', 'Skiing and Snow', 'Music and Nightlife', 'Shoulder Season Value', 'Avoid Crowds']
const WTG_SEASONS = ['Peak', 'Shoulder', 'Off Season']
const SEASON_MAP = { Peak: 'peak', Shoulder: 'shoulder', 'Off Season': 'off' }

const CATEGORY_KEYWORDS = {
  'Food and Wine': ['restaurant', 'food', 'wine', 'truffle', 'harvest', 'gastronomy', 'culinary', 'eat', 'dining', 'chef', 'olive', 'sardine', 'pistachio', 'chestnut', 'artichoke', 'asparagus', 'produce', 'cheese', 'grape', 'vendemmia', 'pintxo', 'tapa', 'sherry', 'port', 'fado', 'market'],
  'Nature and Wildlife': ['northern lights', 'aurora', 'puffin', 'whale', 'wildflower', 'blossom', 'almond', 'cherry', 'lupine', 'firefly', 'bird', 'meteor', 'eclipse', 'midnight sun', 'ice cave', 'glacier', 'snow', 'geothermal', 'hot spring', 'reindeer', 'surf', 'wave', 'acqua alta'],
  'Culture and Festivals': ['carnival', 'festival', 'procession', 'holy week', 'semana santa', 'easter', 'christmas', 'opera', 'biennale', 'film', 'art', 'museum', 'palio', 'feria', 'calcio', 'tradition', 'heritage', 'saint', 'patron', 'pilgrimage', 'yule', 'viking', 'independence', 'revolution', 'national day'],
  'Beaches and Coast': ['beach', 'coast', 'sea', 'swim', 'mediterranean', 'atlantic', 'island', 'sardinia', 'algarve', 'balearic', 'mallorca', 'ibiza', 'canary', 'azores', 'madeira'],
  'Skiing and Snow': ['ski', 'snow', 'dolomite', 'alps', 'sierra nevada', 'pyrenees'],
  'Music and Nightlife': ['jazz', 'music', 'concert', 'sonar', 'primavera', 'alive', 'rock', 'airwaves', 'pride', 'nightlife', 'drum'],
  'Shoulder Season Value': [],
  'Avoid Crowds': [],
}

function matchesCategory(m, category) {
  if (category === 'Shoulder Season Value') return m.season === 'shoulder'
  if (category === 'Avoid Crowds') return m.crowds === 'Low' || m.crowds === 'Low to Medium'
  const kws = CATEGORY_KEYWORDS[category] || []
  if (kws.length === 0) return true
  const haystack = [...(m.phenomena || []), ...(m.events || []), m.weather || '', m.bestFor || ''].join(' ').toLowerCase()
  return kws.some((kw) => haystack.includes(kw))
}

function toggleSet(set, val) {
  const next = new Set(set)
  if (next.has(val)) next.delete(val); else next.add(val)
  return next
}

function FilterButton({ label, active, onClick, small }) {
  return (
    <button onClick={onClick} style={{
      fontFamily: 'system-ui, sans-serif', fontSize: small ? '0.55rem' : '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase',
      color: active ? '#fff' : C.mid, backgroundColor: active ? C.terracotta : 'transparent',
      border: `1px solid ${active ? C.terracotta : C.sand}`, padding: small ? '0.3rem 0.6rem' : '0.4rem 0.75rem', cursor: 'pointer', marginRight: '0.3rem', marginBottom: '0.3rem',
    }}>{label}</button>
  )
}

const WTG_COUNTRIES = [
  { id: 'italy', name: 'Italy' },
  { id: 'portugal', name: 'Portugal' },
  { id: 'spain', name: 'Spain' },
  { id: 'iceland', name: 'Iceland' },
]

function CountrySection({ destId, destName }) {
  const [region, setRegion] = useState(null)
  const [month, setMonth] = useState('All Months')
  const [cats, setCats] = useState(new Set())
  const [season, setSeason] = useState('All Seasons')
  const [showInfo, setShowInfo] = useState(false)

  const data = SEASONAL_DATA[destId]
  const regions = REGIONS[destId] || []
  const hasFilters = region || month !== 'All Months' || cats.size > 0 || season !== 'All Seasons'
  const clearAll = () => { setRegion(null); setMonth('All Months'); setCats(new Set()); setSeason('All Seasons') }

  const results = useMemo(() => {
    if (!hasFilters || !data) return []
    const out = []
    for (const m of data.months) {
      if (month !== 'All Months' && m.name !== month) continue
      if (season !== 'All Seasons' && m.season !== SEASON_MAP[season]) continue
      if (cats.size > 0 && ![...cats].some((cat) => matchesCategory(m, cat))) continue
      const monthNum = MONTH_NAMES.indexOf(m.name) + 1
      const matchingRegions = region
        ? regions.filter((r) => r.id === region)
        : regions
      const regionTags = matchingRegions
        .filter((r) => r.peak.includes(monthNum) || r.shoulder.includes(monthNum) || r.off.includes(monthNum) || r.bestMonths.includes(monthNum))
        .map((r) => r.name)
      if (region && regionTags.length === 0) continue
      out.push({ ...m, destName, destId, regionTags })
    }
    return out
  }, [region, month, cats, season, hasFilters, data, regions, destId, destName])

  const activeRegion = region ? regions.find((r) => r.id === region) : null
  const filterLbl = { fontFamily: 'system-ui, sans-serif', fontSize: '0.55rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: C.tan, marginBottom: '0.3rem', marginTop: '0.6rem' }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: C.ink }}>{destName}</span>
        <button onClick={() => setShowInfo(!showInfo)} style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem', color: C.mid, background: 'none', border: `1px solid ${C.sand}`, padding: '0.2rem 0.5rem', cursor: 'pointer', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>i</button>
      </div>

      {showInfo && data && (
        <div style={{ backgroundColor: C.parchment, border: `1px solid ${C.sand}`, padding: '1rem', marginBottom: '1rem' }}>
          <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: C.gold, marginBottom: '0.5rem' }}>Pricing Overview</p>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', marginBottom: '0.75rem' }}>
            {[['Cheapest', data.pricing.cheapest], ['Most expensive', data.pricing.expensive], ['Book ahead for', data.pricing.bookAhead], ['Shoulder sweet spot', data.pricing.shoulder]].map(([l, v]) => (
              <li key={l} style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.8rem', fontWeight: '300', color: C.charcoal, lineHeight: '1.6', marginBottom: '0.35rem', paddingLeft: '0.75rem', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0, color: C.terracotta }}>·</span>
                <strong style={{ fontWeight: '400', color: C.ink }}>{l}:</strong> {v}
              </li>
            ))}
          </ul>
          <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.8rem', fontWeight: '300', color: C.charcoal, lineHeight: '1.7', marginBottom: '0.75rem' }}>{data.shoulderSummary}</p>
          {data.pricing.valueNote && (
            <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.8rem', fontWeight: '300', color: C.charcoal, lineHeight: '1.6', marginBottom: '0.75rem', paddingLeft: '0.75rem', borderLeft: `2px solid ${C.gold}` }}>{data.pricing.valueNote}</p>
          )}
          {data.overtourismNote && (
            <div style={{ backgroundColor: C.white, border: `1px solid ${C.sand}`, borderLeft: `3px solid ${C.terracotta}`, padding: '0.75rem 1rem' }}>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.8rem', fontWeight: '300', color: C.charcoal, lineHeight: '1.7', margin: 0 }}>{data.overtourismNote}</p>
            </div>
          )}
        </div>
      )}

      <div style={{ backgroundColor: C.parchment, border: `1px solid ${C.sand}`, padding: '0.75rem', marginBottom: '0.75rem' }}>
        <p style={filterLbl}>Region</p>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          <FilterButton small label="All Regions" active={!region} onClick={() => setRegion(null)} />
          {regions.map((r) => <FilterButton small key={r.id} label={r.name} active={region === r.id} onClick={() => setRegion(region === r.id ? null : r.id)} />)}
        </div>

        <p style={filterLbl}>Month</p>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          <FilterButton small label="All" active={month === 'All Months'} onClick={() => setMonth('All Months')} />
          {MONTH_NAMES.map((m) => <FilterButton small key={m} label={m.slice(0, 3)} active={month === m} onClick={() => setMonth(month === m ? 'All Months' : m)} />)}
        </div>

        <p style={filterLbl}>Category</p>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {WTG_CATEGORIES.map((c) => <FilterButton small key={c} label={c} active={cats.has(c)} onClick={() => setCats(toggleSet(cats, c))} />)}
        </div>

        <p style={filterLbl}>Season</p>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          <FilterButton small label="All" active={season === 'All Seasons'} onClick={() => setSeason('All Seasons')} />
          {WTG_SEASONS.map((s) => <FilterButton small key={s} label={s} active={season === s} onClick={() => setSeason(season === s ? 'All Seasons' : s)} />)}
        </div>

        {hasFilters && (
          <div style={{ marginTop: '0.5rem' }}>
            <button onClick={clearAll} style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.55rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.terracotta, background: 'none', border: `1px solid ${C.terracotta}`, padding: '0.3rem 0.6rem', cursor: 'pointer' }}>Clear Filters</button>
          </div>
        )}
      </div>

      {activeRegion && (
        <div style={{ border: `1px solid ${C.sand}`, backgroundColor: C.white, padding: '0.75rem 1rem', marginBottom: '0.75rem' }}>
          <p style={{ fontFamily: 'Georgia, serif', fontSize: '0.95rem', color: C.ink, marginBottom: '0.4rem' }}>{activeRegion.name}</p>
          {activeRegion.sweetSpot && <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.8rem', fontWeight: '300', color: C.charcoal, lineHeight: '1.6', marginBottom: '0.4rem' }}>{activeRegion.sweetSpot}</p>}
          {activeRegion.currentReality && (
            <div style={{ backgroundColor: '#FDF6F0', borderLeft: `2px solid ${C.terracotta}`, padding: '0.4rem 0.65rem', marginBottom: '0.4rem' }}>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.75rem', fontWeight: '300', color: C.charcoal, lineHeight: '1.6', margin: 0 }}>{activeRegion.currentReality}</p>
            </div>
          )}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', fontSize: '0.7rem', fontFamily: 'system-ui, sans-serif', color: C.mid }}>
            {activeRegion.bestMonths?.length > 0 && <span><strong style={{ color: C.ink, fontWeight: '400' }}>Best:</strong> {activeRegion.bestMonths.map((n) => MONTH_NAMES[n - 1]?.slice(0, 3)).join(', ')}</span>}
            {activeRegion.avoid && <span><strong style={{ color: C.terracotta, fontWeight: '400' }}>Avoid:</strong> {activeRegion.avoid}</span>}
          </div>
          {activeRegion.notes && <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.75rem', fontWeight: '300', color: C.mid, lineHeight: '1.5', marginTop: '0.4rem', margin: 0, marginTop: '0.4rem' }}>{activeRegion.notes}</p>}
        </div>
      )}

      {!hasFilters && (
        <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.8rem', fontWeight: '300', color: C.tan }}>
          Select a region or month to explore when to go.
        </p>
      )}

      {hasFilters && results.length === 0 && (
        <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.8rem', fontWeight: '300', color: C.tan }}>No results match these filters.</p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '0.75rem' }}>
        {results.map((m) => {
          const ss = SEASON_STYLES[m.season] || SEASON_STYLES.off
          const isEclipse = m.bookAhead === 'eclipse'
          const showBookAhead = !!m.bookAhead
          return (
            <div key={`${m.destId}_${m.name}`} style={{ border: `1px solid ${C.sand}`, backgroundColor: C.white, padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <span style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', color: C.ink }}>{m.name}</span>
                <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.55rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: ss.color, backgroundColor: ss.bg, padding: '0.2rem 0.6rem' }}>
                  {ss.label}
                </span>
              </div>
              {m.regionTags?.length > 0 && !region && (
                <div style={{ marginBottom: '0.4rem' }}>
                  {m.regionTags.map((rt) => (
                    <span key={rt} style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.55rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: C.gold, marginRight: '0.5rem' }}>{rt}</span>
                  ))}
                </div>
              )}

              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.8rem', fontWeight: '300', color: C.charcoal, lineHeight: '1.6', marginBottom: '0.5rem' }}>{m.weather}</p>

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                <LevelBadge label="Crowds" value={m.crowds} />
                <LevelBadge label="Price" value={m.price} />
              </div>

              {showBookAhead && (
                <div style={{ display: 'inline-block', fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#fff', backgroundColor: isEclipse ? '#B03030' : C.terracotta, padding: '0.25rem 0.65rem', marginBottom: '0.5rem', fontWeight: isEclipse ? '600' : '400' }}>
                  {isEclipse ? 'Book Immediately' : 'Book Ahead'}
                </div>
              )}

              {m.phenomena?.length > 0 && (
                <div style={{ marginBottom: '0.5rem' }}>
                  <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.55rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.tan, marginBottom: '0.25rem' }}>Natural Phenomena</p>
                  {m.phenomena.map((p, i) => <span key={i} style={pillStyle}>{p}</span>)}
                </div>
              )}

              {m.events?.length > 0 && (
                <div style={{ marginBottom: '0.5rem' }}>
                  <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.55rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.tan, marginBottom: '0.25rem' }}>Events</p>
                  {m.events.map((e, i) => <span key={i} style={{ ...pillStyle, backgroundColor: C.white }}>{e}</span>)}
                </div>
              )}

              {m.note && (
                <div style={{ backgroundColor: '#FDF6F0', borderLeft: `2px solid ${C.terracotta}`, padding: '0.5rem 0.75rem', marginBottom: '0.5rem' }}>
                  <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.75rem', fontWeight: '300', color: C.charcoal, lineHeight: '1.6', margin: 0 }}>{m.note}</p>
                </div>
              )}

              <div style={{ borderTop: `1px solid ${C.sand}`, paddingTop: '0.5rem', marginTop: '0.25rem' }}>
                <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.55rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.tan, marginBottom: '0.15rem' }}>Best For</p>
                <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.8rem', fontWeight: '300', color: C.charcoal, lineHeight: '1.5', margin: 0 }}>{m.bestFor}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function WhenToGo() {
  const [openCountries, setOpenCountries] = useState({})
  const toggle = (id) => setOpenCountries({ ...openCountries, [id]: !openCountries[id] })

  return (
    <div style={{ marginTop: '2rem' }}>
      <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.gold, marginBottom: '0.75rem' }}>
        When to Go
      </p>
      {WTG_COUNTRIES.map((c) => {
        const isOpen = openCountries[c.id]
        return (
          <div key={c.id} style={{ border: `1px solid ${C.sand}`, backgroundColor: C.white, marginBottom: '0.5rem' }}>
            <button
              onClick={() => toggle(c.id)}
              style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: '0.9rem 1.25rem', borderBottom: isOpen ? `1px solid ${C.sand}` : 'none' }}
            >
              <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.15rem', color: C.ink }}>{c.name}</span>
              <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.75rem', color: C.tan }}>{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen && (
              <div style={{ padding: '1rem 1.25rem' }}>
                <CountrySection destId={c.id} destName={c.name} />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── DESTINATIONS TAB ────────────────────────────────────────────────────────
function DestinationsTab() {
  const [notes, setNotes] = useLocalStorage('deriva_research_destination_notes', {})
  const [open, setOpen] = useState(() => ({ italy: true, portugal: false, spain: false, iceland: false }))

  const toggle = (id) => setOpen({ ...open, [id]: !open[id] })
  const updateNote = (id, value) => setNotes({ ...notes, [id]: value })

  return (
    <div>
      <SectionHeader label="Destinations" title="Knowledge reference for the four." />
      <WhenToGo />
      {DESTINATIONS_INFO.map((d) => {
        const isOpen = open[d.id]
        return (
          <div key={d.id} style={{ border: `1px solid ${C.sand}`, backgroundColor: C.white, marginBottom: '1rem' }}>
            <button
              onClick={() => toggle(d.id)}
              style={{
                width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                padding: '1.1rem 1.5rem',
                borderBottom: isOpen ? `1px solid ${C.sand}` : 'none',
              }}
            >
              <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', color: C.ink }}>{d.name}</span>
              <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.75rem', color: C.tan, letterSpacing: '0.1em' }}>
                {isOpen ? '−' : '+'}
              </span>
            </button>
            {isOpen && (
              <div style={{ padding: '1.5rem' }}>
                <div style={{ marginBottom: '2rem' }}>
                  <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.gold, marginBottom: '0.75rem' }}>
                    Overview
                  </p>
                  {d.overview.map((para, i) => (
                    <p key={i} style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.9rem', fontWeight: '300', color: C.charcoal, lineHeight: '1.85', marginBottom: '1rem' }}>
                      {para}
                    </p>
                  ))}
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.gold, marginBottom: '0.75rem' }}>
                    Key Things to Know
                  </p>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                    {d.keyThings.map((item, i) => (
                      <li
                        key={i}
                        style={{
                          fontFamily: 'system-ui, sans-serif', fontSize: '0.875rem', fontWeight: '300',
                          color: C.charcoal, lineHeight: '1.7', marginBottom: '0.7rem',
                          paddingLeft: '1rem', position: 'relative',
                        }}
                      >
                        <span style={{ position: 'absolute', left: 0, color: C.terracotta }}>·</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.gold, marginBottom: '0.75rem' }}>
                    Your Notes
                  </p>
                  <textarea
                    value={notes[d.id] || ''}
                    onChange={(e) => updateNote(d.id, e.target.value)}
                    placeholder="Add your own notes, observations, and things you have learned about this destination..."
                    rows={6}
                    style={{ ...inp, resize: 'vertical', lineHeight: '1.7' }}
                  />
                </div>

              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── ROOT ────────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'feed', label: 'Feed' },
  { id: 'following', label: 'Following' },
  { id: 'destinations', label: 'Destinations' },
  { id: 'research', label: 'Research' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'saved', label: 'Saved' },
]

export default function Research() {
  const [tab, setTab] = useState('feed')
  const [savedItems, setSavedItems] = useLocalStorage('deriva_research_saved', [])

  return (
    <div>
      <div className="research-tabs" style={{ display: 'flex', gap: '0.25rem', borderBottom: `1px solid ${C.sand}`, marginBottom: '2rem', flexWrap: 'wrap' }}>
        {TABS.map((t) => {
          const active = tab === t.id
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                fontFamily: 'system-ui, sans-serif', fontSize: '0.7rem', letterSpacing: '0.18em',
                textTransform: 'uppercase', cursor: 'pointer',
                color: active ? C.ink : C.tan,
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: active ? `2px solid ${C.terracotta}` : '2px solid transparent',
                padding: '0.9rem 1.1rem', marginBottom: '-1px',
              }}
            >
              {t.label}
            </button>
          )
        })}
      </div>

      {tab === 'feed' && <FeedTab savedItems={savedItems} setSavedItems={setSavedItems} />}
      {tab === 'following' && <FollowingTab savedItems={savedItems} setSavedItems={setSavedItems} />}
      {tab === 'destinations' && <DestinationsTab />}
      {tab === 'research' && <ResearchSearchTab savedItems={savedItems} setSavedItems={setSavedItems} />}
      {tab === 'instagram' && <InstagramTab />}
      {tab === 'saved' && <SavedTab savedItems={savedItems} setSavedItems={setSavedItems} />}
    </div>
  )
}

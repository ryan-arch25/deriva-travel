import { useEffect } from 'react'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'

export default function ItalySample() {
  useEffect(() => { document.title = 'Italy in Ten Days — A Deriva Itinerary' }, [])

  return (
    <div className="sample-itinerary">
      <Nav />

      <style>{`
        .sample-itinerary { --cream: #f5f0e8; --parchment: #ede5d0; --parchment-dark: #e0d5bc; --terracotta: #c0614a; --terracotta-light: rgba(192,97,74,0.1); --olive: #6b7a45; --stone: #8c7b6b; --dark: #1e1a16; --ink: #3a3028; --gold: #b8963e; --gold-light: rgba(184,150,62,0.12); --white: #fff; background: var(--cream); color: var(--ink); font-family: 'Jost', sans-serif; font-weight: 300; line-height: 1.75; }
        .sample-itinerary html { scroll-behavior: smooth; }

        .sample-itinerary .hero { background: var(--dark); color: var(--cream); min-height: 92vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 80px 24px 64px; position: relative; overflow: hidden; }
        .sample-itinerary .hero::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at 20% 80%, rgba(192,97,74,0.22) 0%, transparent 55%), radial-gradient(ellipse at 80% 20%, rgba(107,122,69,0.16) 0%, transparent 50%), radial-gradient(ellipse at 55% 55%, rgba(184,150,62,0.08) 0%, transparent 60%); }
        .sample-itinerary .hero-content { position: relative; z-index: 1; max-width: 760px; }
        .sample-itinerary .hero-eyebrow { font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; color: var(--gold); font-weight: 400; margin-bottom: 28px; display: block; }
        .sample-itinerary .hero h1 { font-family: 'Cormorant Garamond', serif; font-size: clamp(64px, 12vw, 120px); font-weight: 300; line-height: 0.9; letter-spacing: -0.02em; }
        .sample-itinerary .hero h1 em { font-style: italic; color: var(--terracotta); display: block; }
        .sample-itinerary .hero-route { font-size: 12px; letter-spacing: 0.25em; color: rgba(245,240,232,0.45); margin-top: 22px; text-transform: uppercase; }
        .sample-itinerary .hero-divider { width: 1px; height: 48px; background: rgba(184,150,62,0.4); margin: 40px auto; }
        .sample-itinerary .hero-stats { display: flex; justify-content: center; gap: 56px; }
        .sample-itinerary .stat-item { text-align: center; }
        .sample-itinerary .stat-label { font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--gold); display: block; margin-bottom: 6px; }
        .sample-itinerary .stat-value { font-family: 'Cormorant Garamond', serif; font-size: 26px; font-weight: 400; line-height: 1; }
        .sample-itinerary .hero-scroll-hint { position: absolute; bottom: 32px; left: 50%; transform: translateX(-50%); font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(245,240,232,0.3); z-index: 1; }
        .sample-itinerary .hero-scroll-hint::after { content: ''; display: block; width: 1px; height: 28px; background: rgba(245,240,232,0.2); margin: 10px auto 0; animation: derivaPulse 2s ease-in-out infinite; }
        @keyframes derivaPulse { 0%,100%{opacity:0.2} 50%{opacity:0.7} }

        .sample-itinerary .intro-strip { background: var(--parchment); border-top: 1px solid var(--parchment-dark); border-bottom: 1px solid var(--parchment-dark); padding: 48px 24px; text-align: center; }
        .sample-itinerary .intro-strip p { max-width: 600px; margin: 0 auto; font-family: 'Cormorant Garamond', serif; font-size: clamp(18px, 2.5vw, 22px); font-style: italic; font-weight: 300; color: var(--ink); line-height: 1.6; }
        .sample-itinerary .intro-strip .advisor-sig { margin-top: 20px; font-family: 'Jost', sans-serif; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--terracotta); font-style: normal; display: block; }

        .sample-itinerary main { max-width: 900px; margin: 0 auto; padding: 0 24px 100px; }

        .sample-itinerary .cta-banner { background: var(--dark); color: var(--cream); border-radius: 4px; padding: 32px 40px; margin: 56px 0 0; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
        .sample-itinerary .cta-banner-text p { font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--gold); margin-bottom: 6px; }
        .sample-itinerary .cta-banner-text h3 { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 300; line-height: 1.2; }
        .sample-itinerary .cta-btn { background: var(--terracotta); color: white; text-decoration: none; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; padding: 14px 28px; white-space: nowrap; border-radius: 2px; transition: background 0.2s; flex-shrink: 0; }
        .sample-itinerary .cta-btn:hover { background: #a84f3a; }

        .sample-itinerary .city-section { margin-top: 72px; }
        .sample-itinerary .city-header { display: flex; align-items: center; gap: 20px; margin-bottom: 10px; }
        .sample-itinerary .city-tag { font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--terracotta); background: var(--terracotta-light); padding: 5px 14px; border-radius: 2px; white-space: nowrap; flex-shrink: 0; }
        .sample-itinerary .city-name { font-family: 'Cormorant Garamond', serif; font-size: clamp(36px, 5vw, 54px); font-weight: 300; line-height: 1; color: var(--dark); }
        .sample-itinerary .city-rule { flex:1; height:1px; background: var(--parchment-dark); border:none; }
        .sample-itinerary .city-intro { font-size: 14px; color: var(--stone); line-height: 1.7; max-width: 680px; margin-bottom: 28px; font-style: italic; }

        .sample-itinerary .day-card { background: var(--white); border: 1px solid rgba(140,123,107,0.16); border-radius: 4px; margin-bottom: 16px; overflow: hidden; transition: box-shadow 0.25s; }
        .sample-itinerary .day-card:hover { box-shadow: 0 10px 40px rgba(30,26,22,0.07); }
        .sample-itinerary .day-header { display: grid; grid-template-columns: 64px 1fr auto; align-items: center; gap: 0; background: var(--parchment); border-bottom: 1px solid rgba(140,123,107,0.14); padding: 0; overflow: hidden; }
        .sample-itinerary .day-num-col { padding: 18px 0; text-align: center; border-right: 1px solid rgba(140,123,107,0.14); }
        .sample-itinerary .day-number { font-family: 'Cormorant Garamond', serif; font-size: 38px; font-weight: 300; color: var(--stone); line-height: 1; display: block; }
        .sample-itinerary .day-num-label { font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--stone); opacity: 0.6; }
        .sample-itinerary .day-info { padding: 14px 20px; }
        .sample-itinerary .day-date { font-size: 13px; font-weight: 500; letter-spacing: 0.04em; color: var(--dark); }
        .sample-itinerary .day-theme { font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--stone); margin-top: 2px; }
        .sample-itinerary .day-badge { margin: 0 20px; font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--olive); border: 1px solid rgba(107,122,69,0.35); padding: 4px 10px; border-radius: 2px; white-space: nowrap; }
        .sample-itinerary .day-body { padding: 22px 24px 26px; }

        .sample-itinerary .transport { display: flex; align-items: center; gap: 14px; padding: 12px 16px; background: rgba(30,26,22,0.03); border-radius: 3px; margin: 12px 0; border-left: 3px solid var(--parchment-dark); }
        .sample-itinerary .transport-icon { font-size: 18px; flex-shrink: 0; }
        .sample-itinerary .transport-detail { font-size: 13px; }
        .sample-itinerary .transport-detail strong { font-weight: 500; display: block; color: var(--dark); }
        .sample-itinerary .transport-detail span { color: var(--stone); font-size: 12px; }
        .sample-itinerary .transport-detail a { color: var(--ink); text-decoration: none; border-bottom: 1px solid rgba(192,97,74,0.3); }
        .sample-itinerary .transport-detail a:hover { border-color: var(--terracotta); color: var(--terracotta); }

        .sample-itinerary .meal-block { display: flex; gap: 12px; align-items: flex-start; padding: 12px 16px; border-radius: 3px; margin: 14px 0 6px; }
        .sample-itinerary .meal-block.breakfast { background: rgba(107,122,69,0.07); border-left: 3px solid var(--olive); }
        .sample-itinerary .meal-block.lunch { background: var(--gold-light); border-left: 3px solid var(--gold); }
        .sample-itinerary .meal-block.dinner { background: var(--terracotta-light); border-left: 3px solid var(--terracotta); }
        .sample-itinerary .meal-icon { font-size: 17px; margin-top: 1px; flex-shrink: 0; }
        .sample-itinerary .meal-label { font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--stone); display: block; margin-bottom: 2px; }
        .sample-itinerary .meal-name { font-size: 14px; font-weight: 400; color: var(--dark); line-height: 1.4; display: block; }
        .sample-itinerary .meal-name a { color: inherit; text-decoration: none; border-bottom: 1px solid rgba(192,97,74,0.3); transition: border-color 0.15s, color 0.15s; }
        .sample-itinerary .meal-name a:hover { color: var(--terracotta); border-color: var(--terracotta); }
        .sample-itinerary .meal-note { font-size: 12px; color: var(--stone); margin-top: 3px; display: block; }

        .sample-itinerary .activity-list { list-style: none; margin: 10px 0; padding: 0; }
        .sample-itinerary .activity-list li { font-size: 14px; padding: 6px 0 6px 22px; position: relative; color: var(--ink); border-bottom: 1px solid rgba(140,123,107,0.08); }
        .sample-itinerary .activity-list li:last-child { border-bottom: none; }
        .sample-itinerary .activity-list li::before { content: ''; position: absolute; left: 6px; top: 50%; transform: translateY(-50%); width: 4px; height: 4px; border-radius: 50%; background: var(--stone); opacity: 0.45; }
        .sample-itinerary .activity-list li a { color: var(--ink); text-decoration: none; border-bottom: 1px solid rgba(192,97,74,0.25); transition: all 0.15s; }
        .sample-itinerary .activity-list li a:hover { color: var(--terracotta); border-color: var(--terracotta); }
        .sample-itinerary .activity-list li .time { font-size: 11px; color: var(--stone); margin-right: 6px; font-variant-numeric: tabular-nums; }

        .sample-itinerary .note { font-size: 12px; color: var(--stone); background: var(--cream); border-radius: 3px; padding: 10px 14px; margin-top: 14px; line-height: 1.6; border-left: 2px solid var(--parchment-dark); }
        .sample-itinerary .note strong { color: var(--ink); font-weight: 500; }

        .sample-itinerary .hotel-callout { display: flex; gap: 16px; align-items: flex-start; padding: 16px 18px; background: var(--parchment); border-radius: 3px; margin: 14px 0; border: 1px solid var(--parchment-dark); }
        .sample-itinerary .hotel-callout-icon { font-size: 20px; flex-shrink: 0; margin-top: 1px; }
        .sample-itinerary .hotel-callout-label { font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--gold); display: block; margin-bottom: 3px; }
        .sample-itinerary .hotel-callout-name { font-size: 15px; font-weight: 400; color: var(--dark); display: block; }
        .sample-itinerary .hotel-callout-name a { color: inherit; text-decoration: none; border-bottom: 1px solid rgba(192,97,74,0.3); }
        .sample-itinerary .hotel-callout-name a:hover { color: var(--terracotta); border-color: var(--terracotta); }
        .sample-itinerary .hotel-callout-detail { font-size: 12px; color: var(--stone); margin-top: 3px; display: block; }

        .sample-itinerary .highlight-box { background: var(--dark); color: var(--cream); border-radius: 4px; padding: 20px 22px; margin: 14px 0; }
        .sample-itinerary .highlight-box-label { font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--gold); margin-bottom: 6px; display: block; }
        .sample-itinerary .highlight-box p { font-size: 13px; line-height: 1.65; color: rgba(245,240,232,0.85); }
        .sample-itinerary .highlight-box a { color: var(--gold); border-bottom: 1px solid rgba(184,150,62,0.4); text-decoration: none; }

        .sample-itinerary .section-rule { border: none; border-top: 1px solid var(--parchment-dark); margin: 56px 0; }

        .sample-itinerary .footer-cta { background: var(--parchment); border-top: 1px solid var(--parchment-dark); text-align: center; padding: 72px 24px; }
        .sample-itinerary .footer-cta-eyebrow { font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--terracotta); margin-bottom: 16px; display: block; }
        .sample-itinerary .footer-cta h2 { font-family: 'Cormorant Garamond', serif; font-size: clamp(32px, 5vw, 52px); font-weight: 300; color: var(--dark); line-height: 1.15; margin-bottom: 16px; }
        .sample-itinerary .footer-cta p { font-size: 14px; color: var(--stone); max-width: 420px; margin: 0 auto 32px; line-height: 1.7; }
        .sample-itinerary .footer-cta-btn { display: inline-block; background: var(--terracotta); color: white; text-decoration: none; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; padding: 16px 36px; border-radius: 2px; transition: background 0.2s; }
        .sample-itinerary .footer-cta-btn:hover { background: #a84f3a; }

        @media (max-width: 640px) {
          .sample-itinerary .hero { min-height: 85vh; padding: 100px 20px 56px; }
          .sample-itinerary .hero-stats { gap: 28px; }
          .sample-itinerary .day-header { grid-template-columns: 52px 1fr; }
          .sample-itinerary .day-badge { display: none; }
          .sample-itinerary .cta-banner { flex-direction: column; padding: 28px 24px; }
          .sample-itinerary .hero-scroll-hint { display: none; }
        }
      `}</style>

      <header className="hero">
        <div className="hero-content">
          <span className="hero-eyebrow">Sample Itinerary &nbsp;·&nbsp; A Deriva Build</span>
          <h1>Ten Days<br /><em>in Italy</em></h1>
          <p className="hero-route">Rome &nbsp;&middot;&nbsp; Florence &nbsp;&middot;&nbsp; Lake Como &nbsp;&middot;&nbsp; Lugano</p>
          <div className="hero-divider"></div>
          <div className="hero-stats">
            <div className="stat-item"><span className="stat-label">Cities</span><span className="stat-value">4</span></div>
            <div className="stat-item"><span className="stat-label">Nights</span><span className="stat-value">10</span></div>
            <div className="stat-item"><span className="stat-label">Tier</span><span className="stat-value" style={{ fontSize: '18px', marginTop: '3px' }}>Standard</span></div>
          </div>
        </div>
        <span className="hero-scroll-hint">Scroll</span>
      </header>

      <div className="intro-strip">
        <p>"Italy rewards the unhurried. This itinerary gives you a real feel for three very different places, the layered chaos of Rome, the intimate scale of Florence, and the stillness of Como, without making the trip feel like a checklist."</p>
        <span className="advisor-sig">Ryan &nbsp;&middot;&nbsp; Deriva Travel Advisory</span>
      </div>

      <main>
        <div className="cta-banner">
          <div className="cta-banner-text">
            <p>Want a trip like this?</p>
            <h3>Your itinerary, built around you.</h3>
          </div>
          <a href="/work-with-me" className="cta-btn">Start Here</a>
        </div>

        {/* ROME */}
        <section className="city-section">
          <div className="city-header">
            <span className="city-tag">Days 1 – 3</span>
            <h2 className="city-name">Roma</h2>
            <hr className="city-rule" />
          </div>
          <p className="city-intro">Three days is the minimum to do Rome without feeling rushed. You get the big icons, but the real gift is having enough time to get lost in a neighborhood on no particular agenda.</p>

          <div className="day-card">
            <div className="day-header">
              <div className="day-num-col"><span className="day-number">1</span><span className="day-num-label">Day</span></div>
              <div className="day-info"><div className="day-date">Sunday, March 29 — Arrival Day</div><div className="day-theme">Land, settle, and get your bearings</div></div>
              <span className="day-badge">Rome</span>
            </div>
            <div className="day-body">
              <div className="transport">
                <span className="transport-icon">🛬</span>
                <div className="transport-detail">
                  <strong>Arrive FCO — private transfer to hotel</strong>
                  <span>Skip the taxi queue. Pre-book your transfer. You've been on a plane for 9 hours.</span>
                </div>
              </div>
              <div className="hotel-callout">
                <span className="hotel-callout-icon">🏨</span>
                <div>
                  <span className="hotel-callout-label">Where You're Staying</span>
                  <span className="hotel-callout-name"><a href="https://www.fortysevenhotel.com/?lang=en" target="_blank" rel="noopener noreferrer">47 Boutique Hotel</a></span>
                  <span className="hotel-callout-detail">Via Luigi Petroselli 47 &nbsp;&middot;&nbsp; Steps from the Circus Maximus, five themed floors, rooftop with views over the Forum Boarium. Rome's only Green Globe certified boutique hotel. This is not a chain.</span>
                </div>
              </div>
              <div className="highlight-box">
                <span className="highlight-box-label">Advisor Note</span>
                <p>Day one is not a sightseeing day. Check in, have a long lunch somewhere nearby, walk to the Circus Maximus, and let yourself feel the city without a plan. You'll be sharper for it tomorrow.</p>
              </div>
              <div className="meal-block lunch">
                <span className="meal-icon">🍽️</span>
                <div>
                  <span className="meal-label">Lunch</span>
                  <span className="meal-name">Hostaria Farnese</span>
                  <span className="meal-note">Via dei Baullari 109, Campo de' Fiori &nbsp;&middot;&nbsp; Family-run, been here for generations. Check the chalkboard for daily specials. Romans eat here. The bruschetta with burrata is a good start. No fuss, no performance, just good Roman food.</span>
                </div>
              </div>
              <ul className="activity-list">
                <li>Trevi Fountain — go late afternoon, the crowds thin</li>
                <li>Pantheon — book tickets in advance (€5, skip the line completely)</li>
                <li>Giolitti for gelato after</li>
              </ul>
              <div className="meal-block dinner">
                <span className="meal-icon">🍷</span>
                <div>
                  <span className="meal-label">Dinner</span>
                  <span className="meal-name"><a href="https://www.rugantino.com" target="_blank" rel="noopener noreferrer">Rugantino</a></span>
                  <span className="meal-note">Piazza di Santa Maria in Trastevere &nbsp;&middot;&nbsp; Classic Roman trattoria, outdoor tables in the square. Order the oxtail if it's on the menu. Book ahead.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="day-card">
            <div className="day-header">
              <div className="day-num-col"><span className="day-number">2</span><span className="day-num-label">Day</span></div>
              <div className="day-info"><div className="day-date">Monday, March 30 — Vatican Day</div><div className="day-theme">The Vatican, then decompress in Trastevere</div></div>
              <span className="day-badge">Rome</span>
            </div>
            <div className="day-body">
              <div className="meal-block breakfast">
                <span className="meal-icon">☕</span>
                <div>
                  <span className="meal-label">Breakfast</span>
                  <span className="meal-name">Hotel or grab a cornetto and espresso standing at a bar nearby — do it the Roman way</span>
                </div>
              </div>
              <div className="highlight-box">
                <span className="highlight-box-label">Book This In Advance</span>
                <p>The Vatican without a tour is a waste of time. The queues are brutal and without context, most of it means nothing. Book a skip-the-line guided tour that covers the Museums, Sistine Chapel, and St. Peter's. Three hours, go early morning.</p>
              </div>
              <ul className="activity-list">
                <li><span className="time">Morning</span>Vatican Museums and Sistine Chapel — skip-the-line guided tour</li>
                <li><span className="time">After</span>St. Peter's Basilica and the climb up the dome for views over Rome</li>
                <li><span className="time">Afternoon</span>Cross the river into Trastevere and just walk — no agenda</li>
              </ul>
              <div className="meal-block lunch">
                <span className="meal-icon">🍽️</span>
                <div>
                  <span className="meal-label">Lunch</span>
                  <span className="meal-name">Emma Pizza</span>
                  <span className="meal-note">Via del Monte della Farina 28 &nbsp;&middot;&nbsp; Some of the best pizza in Rome. Thin crust, proper Roman style. Go before 1pm to avoid a wait.</span>
                </div>
              </div>
              <div className="meal-block dinner">
                <span className="meal-icon">🍷</span>
                <div>
                  <span className="meal-label">Dinner</span>
                  <span className="meal-name"><a href="https://www.ristoranteal34.it" target="_blank" rel="noopener noreferrer">Ristorante al 34</a></span>
                  <span className="meal-note">Via Mario de' Fiori 34, near the Spanish Steps &nbsp;&middot;&nbsp; Old-school Roman, been here since 1968. Fixed price menu is excellent value. Very local crowd. Reserve ahead.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="day-card">
            <div className="day-header">
              <div className="day-num-col"><span className="day-number">3</span><span className="day-num-label">Day</span></div>
              <div className="day-info"><div className="day-date">Tuesday, March 31 — Ancient Rome</div><div className="day-theme">Colosseum, the Forum, then slow the day down</div></div>
              <span className="day-badge">Rome</span>
            </div>
            <div className="day-body">
              <div className="meal-block breakfast">
                <span className="meal-icon">☕</span>
                <div><span className="meal-label">Breakfast</span><span className="meal-name">Hotel</span></div>
              </div>
              <ul className="activity-list">
                <li><span className="time">Morning</span>Colosseum tour — book timed entry well in advance, they sell out weeks ahead</li>
                <li>Roman Forum and Palatine Hill are included with the Colosseum ticket — allow 3 hours total</li>
                <li>Spanish Steps and the streets around Via Condotti for a walk and window shopping</li>
              </ul>
              <div className="meal-block lunch">
                <span className="meal-icon">🍽️</span>
                <div>
                  <span className="meal-label">Lunch</span>
                  <span className="meal-name">Pane e Salame — or any spot near the Forum that doesn't have a laminated picture menu</span>
                  <span className="meal-note">Simple rule: avoid any restaurant with photos on the menu near a major monument.</span>
                </div>
              </div>
              <div className="note"><strong>Tonight:</strong> Pack light for Florence. The train is early.</div>
            </div>
          </div>
        </section>

        <hr className="section-rule" />

        {/* FLORENCE */}
        <section className="city-section">
          <div className="city-header">
            <span className="city-tag">Days 4 – 7</span>
            <h2 className="city-name">Firenze</h2>
            <hr className="city-rule" />
          </div>
          <p className="city-intro">Florence is best understood as a walking city. The historic center is small enough that nearly everything is within 20 minutes on foot. Don't rush it. The Arno at sunset is worth standing still for.</p>

          <div className="day-card">
            <div className="day-header">
              <div className="day-num-col"><span className="day-number">4</span><span className="day-num-label">Day</span></div>
              <div className="day-info"><div className="day-date">Wednesday, April 1 — Train to Florence</div><div className="day-theme">Arrive, cross the river, disappear into Oltrarno</div></div>
              <span className="day-badge">Florence</span>
            </div>
            <div className="day-body">
              <div className="transport">
                <span className="transport-icon">🚆</span>
                <div className="transport-detail">
                  <strong>Rome Termini → Firenze S.M.N. — about 1.5 hours</strong>
                  <span>Trenitalia high-speed. Book in advance. Direct trains run all day.</span>
                </div>
              </div>
              <div className="hotel-callout">
                <span className="hotel-callout-icon">🏨</span>
                <div>
                  <span className="hotel-callout-label">Where You're Staying</span>
                  <span className="hotel-callout-name">Grand Hotel Minerva</span>
                  <span className="hotel-callout-detail">Piazza di Santa Maria Novella 16 &nbsp;&middot;&nbsp; Right on the piazza, steps from the train station, rooftop pool. Ask for a room facing the piazza.</span>
                </div>
              </div>
              <div className="highlight-box">
                <span className="highlight-box-label">Where to Spend Your First Afternoon</span>
                <p>Most people spend their entire time in Florence on the same side of the river. Cross the Ponte Vecchio and walk south into Oltrarno. This is where the real Florence is. The streets are quieter, the restaurants exist because the neighborhood eats there, and the artisan workshops that have been here since the Medici era are still running. You will not feel like a tourist here. Give it the whole afternoon.</p>
              </div>
              <ul className="activity-list">
                <li>Drop bags at the hotel, then head straight across the Arno — don't wait until later</li>
                <li><a href="https://maps.apple.com/place?address=Piazza%20Santo%20Spirito,%2050125%20Florence,%20Italy" target="_blank" rel="noopener noreferrer">Piazza Santo Spirito</a> — the heart of Oltrarno, leafy square where locals actually sit. Sunday mornings there's a market. Any other day it's the best people-watching in Florence.</li>
                <li>Wander the backstreets around Via Maggio and Borgo San Frediano — bookbinders, leather ateliers, no tour groups</li>
                <li><a href="https://maps.apple.com/place?address=Piazzale%20Michelangelo,%2050125%20Firenze" target="_blank" rel="noopener noreferrer">Piazzale Michelangelo</a> for sunset — walk up or take a cab. The view over the city from here is the one everyone tries to recreate. It earns it.</li>
              </ul>
              <div className="meal-block lunch">
                <span className="meal-icon">🍕</span>
                <div>
                  <span className="meal-label">Lunch</span>
                  <span className="meal-name"><a href="https://maps.apple.com/place?address=Via%20Maggio%2046R,%2050125%20Florence,%20Italy" target="_blank" rel="noopener noreferrer">Gusta Pizza</a></span>
                  <span className="meal-note">Via Maggio, Oltrarno &nbsp;&middot;&nbsp; Arguably the best pizza in Florence. Tiny room, wood-fired oven, cash only, queue outside most days. Take it to go and eat it in the piazza around the corner.</span>
                </div>
              </div>
              <div className="meal-block dinner">
                <span className="meal-icon">🍷</span>
                <div>
                  <span className="meal-label">Dinner</span>
                  <span className="meal-name"><a href="https://maps.apple.com/place?address=Borgo%20San%20Iacopo%2043R,%2050125%20Florence,%20Italy" target="_blank" rel="noopener noreferrer">Osteria Del Cinghiale Bianco</a></span>
                  <span className="meal-note">Borgo San Jacopo, Oltrarno &nbsp;&middot;&nbsp; Wild boar ragu, hand-cut pasta, stone walls. My favorite restaurant in Florence. Book a week ahead, this one fills up.</span>
                </div>
              </div>
              <ul className="activity-list">
                <li>Gelato at <a href="https://maps.apple.com/place?address=Via%20De%E2%80%99%20Serragli%2032%20R,%2050124%20Florence,%20Italy" target="_blank" rel="noopener noreferrer">Sbrino</a> before bed — best gelato in Florence, also in Oltrarno. The neighborhood delivers.</li>
              </ul>
            </div>
          </div>

          <div className="day-card">
            <div className="day-header">
              <div className="day-num-col"><span className="day-number">5</span><span className="day-num-label">Day</span></div>
              <div className="day-info"><div className="day-date">Thursday, April 2 — Wine Tour Day</div><div className="day-theme">Chianti wine tour, good sandwiches, late dinner in Oltrarno</div></div>
              <span className="day-badge">Florence</span>
            </div>
            <div className="day-body">
              <div className="highlight-box">
                <span className="highlight-box-label">Worth Knowing</span>
                <p>A half-day Chianti wine tour is one of the best things you can do out of Florence. Most leave early afternoon, visit two or three estates with proper tastings, and get you back by 7pm. Book via Viator or GetYourGuide. You do not need to know anything about wine to enjoy this.</p>
              </div>
              <ul className="activity-list">
                <li><span className="time">Morning</span>Free morning — explore Oltrarno at your own pace, or walk along the Arno</li>
                <li>Signum near the Uffizi for souvenirs if you need them — better selection than the market stalls</li>
              </ul>
              <div className="meal-block lunch">
                <span className="meal-icon">🍽️</span>
                <div>
                  <span className="meal-label">Lunch</span>
                  <span className="meal-name">I' Girone de' Ghiotti</span>
                  <span className="meal-note">Via dei Neri area &nbsp;&middot;&nbsp; Better than the tourist sandwich spots. A proper sit-down lunch before the wine tour, good Tuscan cooking at honest prices. Get here before the afternoon rush.</span>
                </div>
              </div>
              <ul className="activity-list">
                <li><span className="time">2:30 PM</span>Half-day Chianti wine tour — book via Viator or GetYourGuide. Visits two or three estates with tastings and usually includes lunch or antipasto. Back in Florence by 7pm.</li>
              </ul>
              <div className="meal-block dinner">
                <span className="meal-icon">🍷</span>
                <div>
                  <span className="meal-label">Dinner</span>
                  <span className="meal-name"><a href="https://maps.apple.com/place?address=Via%20dell'Orto%2035/A,%2050124%20Florence,%20Italy" target="_blank" rel="noopener noreferrer">Trattoria dell'Orto</a></span>
                  <span className="meal-note">Oltrarno &nbsp;&middot;&nbsp; Neighborhood trattoria in the truest sense. No English menu, rotating specials, no tourists. This is the real one.</span>
                </div>
              </div>
              <ul className="activity-list">
                <li>Drinks after at <a href="https://maps.apple.com/place?address=Via%20Sant'Agostino%2014%20R,%2050125%20Florence,%20Italy" target="_blank" rel="noopener noreferrer">Spirituum</a> — one of the best cocktail bars in Florence, small and serious</li>
              </ul>
            </div>
          </div>

          <div className="day-card">
            <div className="day-header">
              <div className="day-num-col"><span className="day-number">6</span><span className="day-num-label">Day</span></div>
              <div className="day-info"><div className="day-date">Friday, April 3 — Duomo and Pasta</div><div className="day-theme">Climb the dome, make pasta, rooftop aperitivo</div></div>
              <span className="day-badge">Florence</span>
            </div>
            <div className="day-body">
              <div className="highlight-box">
                <span className="highlight-box-label">Advisor Note</span>
                <p>A pasta making class sounds like a tourist activity. It is, and it's one of the best things you can do in Florence. Two hours, you eat what you make, and you leave actually knowing how to do it. Book via GetYourGuide for a small group class with a local.</p>
              </div>
              <ul className="activity-list">
                <li><span className="time">Morning</span>Free morning — go back to Oltrarno, browse the leather shops on Via de' Serragli, or take your time over a coffee in Piazza Santo Spirito. Not every morning needs a plan.</li>
                <li><span className="time">12:30 PM</span><a href="https://tickets.duomo.firenze.it/en/" target="_blank" rel="noopener noreferrer">Duomo — climb the dome</a>. Buy timed tickets in advance. Climbing Brunelleschi's dome costs a few euros and earns every one. Allow 90 minutes.</li>
                <li>Piazza della Signoria after — coffee at Rivoire, look at the outdoor sculpture, no ticket required</li>
              </ul>
              <div className="meal-block lunch">
                <span className="meal-icon">🍝</span>
                <div>
                  <span className="meal-label">Cooking Class — Lunch Included</span>
                  <span className="meal-name">Pasta Making Class — book small group via GetYourGuide</span>
                  <span className="meal-note">About 2.5 hours. Usually tagliatelle and a second shape. You eat what you make with wine. Ends around 5pm.</span>
                </div>
              </div>
              <ul className="activity-list">
                <li><span className="time">6:00 PM</span>Aperitivo at <a href="https://maps.apple.com/place?address=Via%20De'Medici%206,%2050123%20Florence,%20Italy" target="_blank" rel="noopener noreferrer">View on Art Rooftop Bar</a> — the view over the city at golden hour is exceptional</li>
                <li>Leather shopping: <a href="https://maps.apple.com/place?address=Lungarno%20degli%20Acciaiuoli%2042%20R,%2050123%20Florence,%20Italy" target="_blank" rel="noopener noreferrer">Bottega del Giglio</a> near the Arno — real Florentine leather, not the market stall stuff</li>
              </ul>
              <div className="meal-block dinner">
                <span className="meal-icon">🍕</span>
                <div>
                  <span className="meal-label">Dinner (light)</span>
                  <span className="meal-name"><a href="https://maps.apple.com/place?address=Via%20Maggio%2046R,%2050125%20Florence,%20Italy" target="_blank" rel="noopener noreferrer">Gusta Pizza</a></span>
                  <span className="meal-note">If you're still hungry after the pasta class, this is Florence's best pizza. Tiny, cash only, always a short wait.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <hr className="section-rule" />

        {/* LAKE COMO */}
        <section className="city-section">
          <div className="city-header">
            <span className="city-tag">Days 8 – 10</span>
            <h2 className="city-name">Lago di Como</h2>
            <hr className="city-rule" />
          </div>
          <p className="city-intro">Lake Como is the exhale. After Rome and Florence you are ready for slow mornings, water, and views. Three days here is perfect — enough time to see Bellagio without rushing, go on the water, and eat somewhere special.</p>

          <div className="day-card">
            <div className="day-header">
              <div className="day-num-col"><span className="day-number">7</span><span className="day-num-label">Day</span></div>
              <div className="day-info"><div className="day-date">Friday, April 4 — Travel to Como</div><div className="day-theme">Florence to the lake, first evening on the water</div></div>
              <span className="day-badge">Travel Day</span>
            </div>
            <div className="day-body">
              <div className="transport">
                <span className="transport-icon">🚆</span>
                <div className="transport-detail">
                  <strong>Florence → Milan → Como — about 3 hours total</strong>
                  <span>High-speed to Milan Centrale, then regional train to Como San Giovanni. Buy tickets in advance.</span>
                </div>
              </div>
              <div className="hotel-callout">
                <span className="hotel-callout-icon">🏨</span>
                <div>
                  <span className="hotel-callout-label">Where You're Staying</span>
                  <span className="hotel-callout-name"><a href="https://www.palacehotel.it/" target="_blank" rel="noopener noreferrer">Palace Hotel Como</a></span>
                  <span className="hotel-callout-detail">Right on the lake &nbsp;&middot;&nbsp; Outdoor pool, views straight across the water. This is the one everyone photographs. Worth it.</span>
                </div>
              </div>
              <div className="meal-block dinner">
                <span className="meal-icon">🍷</span>
                <div>
                  <span className="meal-label">Dinner</span>
                  <span className="meal-name">Ristorante Gatto Nero — Cernobbio</span>
                  <span className="meal-note">On the hillside above the lake with panoramic views. Classic northern Italian cooking. One of the best views from any restaurant on the lake. Book well ahead.</span>
                </div>
              </div>
              <ul className="activity-list">
                <li>Drinks after at Grand Hotel Tremezzo — beautiful bar terrace right on the water. Non-guests welcome.</li>
              </ul>
            </div>
          </div>

          <div className="day-card">
            <div className="day-header">
              <div className="day-num-col"><span className="day-number">8</span><span className="day-num-label">Day</span></div>
              <div className="day-info"><div className="day-date">Saturday, April 5 — Bellagio Day Trip</div><div className="day-theme">Ferry across the lake, Villa Melzi gardens, lunch in town</div></div>
              <span className="day-badge">Bellagio</span>
            </div>
            <div className="day-body">
              <div className="transport">
                <span className="transport-icon">⛴️</span>
                <div className="transport-detail">
                  <strong>Aliscafo ferry from Como to Bellagio — about 45 minutes</strong>
                  <span>Buy round-trip tickets at the Navigazione Laghi office near the hotel. Cash or card. Go mid-morning to beat the day-tripper coaches.</span>
                </div>
              </div>
              <ul className="activity-list">
                <li><a href="https://www.giardinidivillamelzi.it" target="_blank" rel="noopener noreferrer">Villa Melzi Gardens</a> — lakeside gardens with statues, a Japanese garden, and absurd views. Buy tickets at the gate.</li>
                <li>Walk the main strip but also go one street back — the steep lanes above town are quieter and more interesting</li>
                <li>Ferry back to Como mid-afternoon</li>
              </ul>
              <div className="meal-block breakfast">
                <span className="meal-icon">🍹</span>
                <div>
                  <span className="meal-label">Aperitivo</span>
                  <span className="meal-name"><a href="https://www.giuliettaallago.it" target="_blank" rel="noopener noreferrer">Giulietta al Lago</a></span>
                  <span className="meal-note">Lakefront promenade, Como &nbsp;&middot;&nbsp; Outdoor seating directly on the water. Cocktail bar open all afternoon, no reservations needed for the bar. A Campari spritz watching the light change on the lake is the move.</span>
                </div>
              </div>
              <div className="meal-block lunch">
                <span className="meal-icon">🍽️</span>
                <div>
                  <span className="meal-label">Lunch in Bellagio</span>
                  <span className="meal-name">Trattoria San Giacomo</span>
                  <span className="meal-note">Steps down from the main square &nbsp;&middot;&nbsp; Risotto and lake fish. This is not a tourist trap, locals eat here too. No reservations needed for lunch, go early.</span>
                </div>
              </div>
              <div className="meal-block dinner">
                <span className="meal-icon">🍷</span>
                <div>
                  <span className="meal-label">Dinner</span>
                  <span className="meal-name"><a href="https://www.federicocernobbio.it/" target="_blank" rel="noopener noreferrer">Federico Cernobbio</a></span>
                  <span className="meal-note">Cernobbio &nbsp;&middot;&nbsp; Modern northern Italian, beautiful room, excellent pasta. A step up from last night. Reserve well ahead.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="day-card">
            <div className="day-header">
              <div className="day-num-col"><span className="day-number">9</span><span className="day-num-label">Day</span></div>
              <div className="day-info"><div className="day-date">Sunday, April 6 — Easter on the Lake</div><div className="day-theme">Private boat tour, slow morning, memorable dinner</div></div>
              <span className="day-badge">Lake Como</span>
            </div>
            <div className="day-body">
              <div className="highlight-box">
                <span className="highlight-box-label">The One Non-Negotiable</span>
                <p>The private boat tour is the best thing you can do on Lake Como. A vintage wooden motorboat, two hours on the water, stops at Villa del Balbianello and Villa Carlotta. Nothing on land compares to seeing the lake from the middle of it. Book via <a href="https://lakecomotravel.com/product/romance-vaporina/" target="_blank" rel="noopener noreferrer">Lake Como Travel</a> — ask for the Vaporina.</p>
              </div>
              <div className="meal-block lunch">
                <span className="meal-icon">🍽️</span>
                <div>
                  <span className="meal-label">Lunch</span>
                  <span className="meal-name">Bar Giuliani or Ristorante Sociale — Como town center</span>
                  <span className="meal-note">Keep it simple today. You're saving room for dinner.</span>
                </div>
              </div>
              <ul className="activity-list">
                <li><span className="time">2:00 PM</span>Private Vaporina boat tour — 2 hours on the lake, bring a jacket even in spring</li>
                <li>Evening walk along the lakefront promenade in Como as the light drops</li>
              </ul>
              <div className="meal-block dinner">
                <span className="meal-icon">🍷</span>
                <div>
                  <span className="meal-label">Dinner</span>
                  <span className="meal-name"><a href="https://figlideifiorirestaurants.com/osteria/" target="_blank" rel="noopener noreferrer">Figli dei Fiori Osteria</a></span>
                  <span className="meal-note">Via Volta, Como &nbsp;&middot;&nbsp; The best dinner spot in Como proper. Beautifully designed, very good wine list, unpretentious. Book ahead. This is the one you'll talk about.</span>
                </div>
              </div>
              <ul className="activity-list">
                <li>Drinks again at <a href="https://www.grandhoteltremezzo.com" target="_blank" rel="noopener noreferrer">Grand Hotel Tremezzo</a> — make it a tradition</li>
              </ul>
            </div>
          </div>
        </section>

        <hr className="section-rule" />

        {/* LUGANO */}
        <section className="city-section">
          <div className="city-header">
            <span className="city-tag">Day 10</span>
            <h2 className="city-name">Lugano</h2>
            <hr className="city-rule" />
          </div>
          <p className="city-intro">One day in Switzerland. Lugano is an hour from Como by train and a completely different world, Italian language, Swiss money, immaculate streets, chocolate shops, and a lake that looks almost identical to Como but somehow even calmer. Worth the day.</p>

          <div className="day-card">
            <div className="day-header">
              <div className="day-num-col"><span className="day-number">10</span><span className="day-num-label">Day</span></div>
              <div className="day-info"><div className="day-date">Monday, April 7 — Day Trip to Lugano</div><div className="day-theme">Train across the border, lake views, Swiss chocolate, back for dinner</div></div>
              <span className="day-badge">Switzerland</span>
            </div>
            <div className="day-body">
              <div className="transport">
                <span className="transport-icon">🚆</span>
                <div className="transport-detail">
                  <strong>Como San Giovanni → Lugano — about 1 hour</strong>
                  <span>Regional train, runs frequently. Buy tickets at the station. You'll cross the border, bring your passport.</span>
                </div>
              </div>
              <div className="highlight-box">
                <span className="highlight-box-label">Advisor Note</span>
                <p>Lugano is small enough to cover in a day without rushing. Piazza della Riforma is the main square, coffee there first, then wander. The funicular up to Monte San Salvatore is worth the 20 minutes if the weather is clear.</p>
              </div>
              <ul className="activity-list">
                <li>Piazza della Riforma — coffee, sit for a bit, feel the different energy</li>
                <li>Parco Ciani along the lake — beautiful gardens, free, walk as far as you want</li>
                <li>Cattedrale di San Lorenzo — 10 minutes, genuinely impressive facade</li>
                <li>Funicular up Monte San Salvatore or Monte Bre for panoramic views over the lake and Alps on a clear day</li>
                <li>Chocolate shops on Via Nassa — this is Switzerland, take it seriously</li>
              </ul>
              <div className="meal-block lunch">
                <span className="meal-icon">🍽️</span>
                <div>
                  <span className="meal-label">Lunch</span>
                  <span className="meal-name">Grotto della Salute</span>
                  <span className="meal-note">A grotto is the Swiss-Italian version of a trattoria, stone walls, simple menu, good wine. This one is the real thing. Book ahead for lunch.</span>
                </div>
              </div>
              <div className="transport">
                <span className="transport-icon">🚆</span>
                <div className="transport-detail">
                  <strong>Train back to Como — late afternoon</strong>
                  <span>Last useful train is around 6pm. Back in Como in time for dinner.</span>
                </div>
              </div>
              <div className="meal-block dinner">
                <span className="meal-icon">🍷</span>
                <div>
                  <span className="meal-label">Dinner — Last Night</span>
                  <span className="meal-name">Hostaria Cernobbio</span>
                  <span className="meal-note">Cernobbio &nbsp;&middot;&nbsp; Outdoor seating, traditional northern Italian cooking, good wine list. A relaxed way to end the trip. Pack tonight.</span>
                </div>
              </div>
              <div className="note"><strong>Pack tonight</strong>, car to Milan airport tomorrow morning. Confirm your transfer 24 hours in advance.</div>
            </div>
          </div>
        </section>
      </main>

      <div className="footer-cta">
        <span className="footer-cta-eyebrow">This is what a Deriva itinerary looks like</span>
        <h2>Ready to build<br />your version?</h2>
        <p>Tell me where you want to go and what matters to you. I'll take it from there.</p>
        <a href="/work-with-me" className="footer-cta-btn">Work With Me</a>
      </div>

      <Footer />
    </div>
  )
}

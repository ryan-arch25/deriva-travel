import { Link } from 'react-router-dom'
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

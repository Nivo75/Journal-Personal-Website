import { NavLink } from 'react-router-dom'

export default function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-12 py-5"
      style={{
        background: 'rgba(28,36,30,0.82)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(196,98,45,0.25)',
      }}>

      {/* Brand — clicks to home */}
      <NavLink to="/" style={{ textDecoration: 'none' }}>
        <div className="flex flex-col gap-0.5">
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 700, color: '#EDE4D0', letterSpacing: '0.02em', lineHeight: 1 }}>
            Life Not Lived
          </span>
          <span style={{ fontFamily: "'Lora', serif", fontSize: '0.6rem', color: '#A89070', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Peakbagging Chronicles
          </span>
        </div>
      </NavLink>

      {/* Links */}
      <ul className="flex gap-10 list-none">
        {[
          { to: '/',           label: 'Home'       },
          { to: '/map',        label: 'Map'        },
          { to: '/adventures', label: 'Adventures' },
          { to: '/stats',      label: 'Stats'      },
          { to: '/gallery',    label: 'Gallery'    },
        ].map(({ to, label }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === '/'}
              style={({ isActive }) => ({
                fontFamily: "'Lora', serif",
                fontSize: '0.78rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: isActive ? '#EDE4D0' : '#D4C9A8',
                textDecoration: 'none',
                borderBottom: isActive ? '1px solid #C4622D' : '1px solid transparent',
                paddingBottom: '2px',
                transition: 'color 0.2s',
              })}>
              {label}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Coords */}
      <span style={{ fontFamily: "'Lora', serif", fontSize: '0.7rem', color: '#A89070', fontStyle: 'italic' }}>
        48°N · 121°W
      </span>
    </nav>
  )
}

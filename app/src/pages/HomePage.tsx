import HeroCanvas from '../components/hero/HeroCanvas'

export default function HomePage() {
  return (
    <div style={{ background: '#F5EFE0' }}>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', height: '100vh', minHeight: '600px', overflow: 'hidden' }}>

        <HeroCanvas />

        {/* Vignette */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2,
          background: `
            radial-gradient(ellipse at center, transparent 35%, rgba(26,35,24,0.55) 100%),
            linear-gradient(to bottom, rgba(26,35,24,0.5) 0%, transparent 20%, transparent 70%, rgba(26,35,24,0.8) 100%)
          `,
        }} />

        {/* Hero text */}
        <div style={{
          position: 'absolute', zIndex: 3,
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          pointerEvents: 'none',
          animation: 'heroFade 1.2s ease forwards',
        }}>
          <div style={{
            fontFamily: "'Lora', serif",
            fontSize: '0.72rem',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: '#D4784A',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.8rem',
          }}>
            <span style={{ display: 'block', height: '1px', width: '40px', background: '#C4622D', opacity: 0.7 }} />
            122 summits · 16 states · 7 countries
            <span style={{ display: 'block', height: '1px', width: '40px', background: '#C4622D', opacity: 0.7 }} />
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(3.5rem, 8vw, 7rem)',
            fontWeight: 900,
            color: '#EDE4D0',
            lineHeight: 0.92,
            letterSpacing: '-0.02em',
            textShadow: '0 4px 40px rgba(0,0,0,0.6)',
            margin: 0,
          }}>
            Life Not<br />
            <em style={{ fontStyle: 'italic', color: '#D4C9A8', fontWeight: 400 }}>Lived</em>
          </h1>

          <p style={{
            fontFamily: "'Lora', serif",
            fontSize: '1.05rem',
            color: '#D4C9A8',
            fontStyle: 'italic',
            opacity: 0.85,
            marginTop: '1.2rem',
            letterSpacing: '0.03em',
          }}>
            A peakbagger's record of vertical obsession
          </p>
        </div>

        {/* Scroll hint */}
        <div style={{
          position: 'absolute', bottom: '32px', left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 4,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
          color: '#D4C9A8', opacity: 0.7,
          animation: 'scrollBounce 2s infinite',
        }}>
          <span style={{ fontFamily: "'Lora', serif", fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Explore
          </span>
          <div style={{ width: '1px', height: '28px', background: 'linear-gradient(to bottom, #D4C9A8, transparent)' }} />
        </div>
      </section>

      {/* ── STATS BAND ── */}
      <div style={{
        background: '#2C3A2E',
        borderTop: '3px solid #C4622D',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
      }}>
        {[
          { num: '122', unit: 'peaks', label: 'Summits Reached',    sub: 'across 7 mountain ranges'      },
          { num: '193', unit: 'k ft',  label: 'Total Elevation',     sub: '≈ 6.5× Everest from sea level' },
          { num: '686', unit: 'mi',    label: 'Distance Covered',    sub: 'Los Angeles → Seattle'          },
          { num: '14',  unit: 'k ft',  label: 'Highest Summit',      sub: 'Mount Rainier, WA'              },
        ].map(({ num, unit, label, sub }, i) => (
          <div key={i} style={{
            padding: '3.5rem 2rem',
            borderRight: i < 3 ? '1px solid rgba(139,115,85,0.25)' : 'none',
            display: 'flex', flexDirection: 'column', gap: '0.4rem',
          }}>
            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(2.2rem, 3.5vw, 3.2rem)',
              fontWeight: 900,
              color: '#EDE4D0',
              lineHeight: 1,
              letterSpacing: '-0.02em',
            }}>
              {num}
              <span style={{ fontSize: '0.55em', fontWeight: 400, color: '#D4784A', fontStyle: 'italic' }}>
                {' '}{unit}
              </span>
            </div>
            <div style={{ fontFamily: "'Lora', serif", fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#A89070' }}>
              {label}
            </div>
            <div style={{ fontFamily: "'Lora', serif", fontSize: '0.75rem', color: '#8B7355', fontStyle: 'italic', marginTop: '0.2rem' }}>
              {sub}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes heroFade {
          from { opacity: 0; transform: translate(-50%, calc(-50% + 16px)); }
          to   { opacity: 1; transform: translate(-50%, -50%); }
        }
        @keyframes scrollBounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50%       { transform: translateX(-50%) translateY(5px); }
        }
      `}</style>
    </div>
  )
}

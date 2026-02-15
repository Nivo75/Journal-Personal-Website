import { Mountain } from 'lucide-react';

const LifeNotLivedClassical = () => {
  const theme = {
    bg: '#F5F2ED',
    text: '#3B3531',
    accent: '#8B7355',
    accent2: '#A0634A', // warm terracotta
    accent3: '#D4A574', // soft gold
    border: '#C9BCA8',
    cardBg: '#FDFCFA',
    headerFont: '"Playfair Display", serif',
    bodyFont: '"Crimson Text", serif',
    shadow: '0 2px 4px rgba(0,0,0,0.06)'
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: theme.bg,
      color: theme.text,
      fontFamily: theme.bodyFont
    }}>
      {/* Header */}
      <header style={{
        borderBottom: `1px solid ${theme.border}`,
        padding: '24px 0'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <Mountain size={24} color={theme.accent2} />
            <div style={{ position: 'relative' }}>
              <h1 style={{
                margin: 0,
                fontSize: '32px',
                fontFamily: theme.headerFont,
                fontWeight: '400',
                letterSpacing: '0.5px'
              }}>
                LifeNotLived
              </h1>
              <div style={{
                position: 'absolute',
                bottom: '-4px',
                left: 0,
                width: '60%',
                height: '2px',
                background: `linear-gradient(90deg, ${theme.accent3}, transparent)`,
                opacity: 0.6
              }} />
            </div>
          </div>
          
          <nav>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              gap: '24px',
              fontSize: '14px',
              letterSpacing: '0.5px'
            }}>
              {['Overview', 'Journal', 'Adventures', 'Projects', 'Stats+Map', 'Gallery'].map(item => (
                <li key={item}>
                  <a href="#" style={{
                    color: theme.text,
                    textDecoration: 'none',
                    fontWeight: '400',
                    borderBottom: item === 'Overview' ? `2px solid ${theme.accent}` : 'none',
                    paddingBottom: '4px',
                    transition: 'border-color 0.2s'
                  }}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 40px' }}>
        
        {/* Hero Section */}
        <section style={{
          marginBottom: '80px',
          padding: '32px',
          background: 'linear-gradient(135deg, rgba(212,165,116,0.08), rgba(160,99,74,0.05))',
          border: `1px solid ${theme.border}`,
          borderLeft: `4px solid ${theme.accent2}`,
          borderRadius: '4px',
          boxShadow: theme.shadow,
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '60px',
            height: '60px',
            border: `2px solid ${theme.accent3}`,
            borderRadius: '50%',
            opacity: 0.2
          }} />
          <div style={{
            fontSize: '11px',
            color: theme.accent2,
            marginBottom: '16px',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            fontWeight: '400'
          }}>
            Navion Man
          </div>
          <p style={{
            fontSize: '18px',
            lineHeight: '1.8',
            margin: 0,
            fontStyle: 'italic',
            color: theme.text,
            opacity: 0.9
          }}>
            You are what you do
          </p>
        </section>

        {/* Update Section */}
        <section style={{ marginBottom: '60px' }}>
          <h2 style={{
            fontSize: '28px',
            fontFamily: theme.headerFont,
            fontWeight: '400',
            marginBottom: '24px',
            letterSpacing: '0.5px',
            color: theme.text,
            paddingBottom: '12px',
            borderBottom: `2px solid ${theme.accent3}`,
            display: 'inline-block'
          }}>
            What I've Been Up To
          </h2>
          <div style={{
            padding: '28px',
            background: theme.cardBg,
            border: `1px solid ${theme.border}`,
            borderLeft: `4px solid ${theme.accent2}`,
            borderRadius: '4px',
            boxShadow: theme.shadow
          }}>
            <p style={{
              fontSize: '15px',
              lineHeight: '1.8',
              margin: 0,
              color: theme.text,
              opacity: 0.85
            }}>
              I'm rebuilding this personal site into a cleaner v2 experience focused on journals, adventures, and projects. Fresh entries, media, and map-backed milestones will be published here soon.
            </p>
          </div>
        </section>

        {/* Latest Entries Grid */}
        <section style={{ marginBottom: '60px' }}>
          <h2 style={{
            fontSize: '28px',
            fontFamily: theme.headerFont,
            fontWeight: '400',
            marginBottom: '32px',
            letterSpacing: '0.5px',
            color: theme.text
          }}>
            Latest Entries
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            {[
              { type: 'Journal', title: 'First entry coming soon', desc: 'Notes and updates will appear here.', color: theme.accent },
              { type: 'Adventure', title: 'Adventure log placeholder', desc: 'Upcoming outings will be tracked here.', color: theme.accent2 },
              { type: 'Project', title: 'Project update placeholder', desc: 'Active builds and progress notes coming soon.', color: theme.accent3 }
            ].map((entry, idx) => (
              <div key={idx} style={{
                padding: '24px',
                background: theme.cardBg,
                border: `1px solid ${theme.border}`,
                borderTop: `3px solid ${entry.color}`,
                borderRadius: '4px',
                boxShadow: theme.shadow,
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  width: '8px',
                  height: '8px',
                  background: entry.color,
                  borderRadius: '50%',
                  opacity: 0.4
                }} />
                <div style={{
                  fontSize: '10px',
                  color: entry.color,
                  marginBottom: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  fontWeight: '400'
                }}>
                  {entry.type}
                </div>
                <h3 style={{
                  fontSize: '18px',
                  fontFamily: theme.headerFont,
                  fontWeight: '400',
                  marginBottom: '12px',
                  color: theme.text
                }}>
                  {entry.title}
                </h3>
                <p style={{
                  fontSize: '14px',
                  lineHeight: '1.6',
                  color: theme.text,
                  opacity: 0.7,
                  margin: 0
                }}>
                  {entry.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section>
          <h2 style={{
            fontSize: '28px',
            fontFamily: theme.headerFont,
            fontWeight: '400',
            marginBottom: '32px',
            letterSpacing: '0.5px',
            color: theme.text
          }}>
            Stats
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            {['Elevation', 'Prominence', 'Major List', 'Minor List'].map((stat, idx) => (
              <div key={idx} style={{
                padding: '20px',
                background: theme.cardBg,
                border: `1px solid ${theme.border}`,
                borderRadius: '4px',
                boxShadow: theme.shadow,
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '10px',
                  color: theme.accent,
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  fontWeight: '400'
                }}>
                  {stat}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: `1px solid ${theme.border}`,
        padding: '32px 40px',
        marginTop: '80px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Mountain size={18} color={theme.accent} />
            <span style={{ fontSize: '13px', color: theme.accent }}>LifeNotLived</span>
          </div>
          <p style={{
            fontSize: '13px',
            color: theme.text,
            opacity: 0.6,
            margin: 0,
            fontStyle: 'italic'
          }}>
            You are what you do.
          </p>
          <p style={{
            fontSize: '11px',
            color: theme.text,
            opacity: 0.4,
            margin: '12px 0 0 0'
          }}>
            © 2026 LifeNotLived
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LifeNotLivedClassical;

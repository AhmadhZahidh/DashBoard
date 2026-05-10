import React, { useEffect, useState } from 'react';

export default function PageLoader({ onComplete }) {
  const [phase, setPhase] = useState(0);
  // phase 0 = logo typing, 1 = bar fill, 2 = fade out

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1400);
    const t2 = setTimeout(() => setPhase(2), 2600);
    const t3 = setTimeout(() => onComplete?.(), 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999,
      background: '#05050d',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      opacity: phase === 2 ? 0 : 1,
      transition: 'opacity 0.6s ease',
      pointerEvents: phase === 2 ? 'none' : 'all'
    }}>
      {/* Grid bg */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: 'linear-gradient(rgba(124,58,237,1) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,1) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />

      {/* Radial glow */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 500, height: 500, background: 'radial-gradient(circle,rgba(124,58,237,0.15) 0%,transparent 70%)', pointerEvents: 'none' }} />

      {/* Logo */}
      <div style={{ position: 'relative', marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Icon */}
          <div style={{
            width: 64, height: 64, borderRadius: 18,
            background: 'linear-gradient(135deg,#7c3aed,#10b981)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 30, boxShadow: '0 0 40px rgba(124,58,237,0.6)',
            animation: 'float 2s ease-in-out infinite'
          }}>🎮</div>

          {/* Text with typing effect */}
          <div>
            <div className="font-gaming" style={{
              fontSize: 'clamp(28px,5vw,48px)', fontWeight: 900, letterSpacing: 4,
              background: 'linear-gradient(135deg,#a855f7,#10b981)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: 'none',
              animation: 'neonPulse 2s ease-in-out infinite'
            }}>
              PRRX
              <span style={{
                display: 'inline-block', width: 3, height: '0.9em',
                background: '#a855f7', marginLeft: 4, verticalAlign: 'middle',
                animation: 'blink 0.8s step-end infinite'
              }} />
            </div>
            <div style={{ color: '#505070', fontSize: 12, letterSpacing: 3, fontFamily: 'Orbitron,monospace', marginTop: 4 }}>
              GAMING RESELLER PANEL
            </div>
          </div>
        </div>
      </div>

      {/* Triple ring spinner */}
      <div style={{ position: 'relative', width: 80, height: 80, marginBottom: 32 }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '3px solid transparent', borderTopColor: '#7c3aed', borderRightColor: '#7c3aed', animation: 'spin 1s linear infinite' }} />
        <div style={{ position: 'absolute', inset: 10, borderRadius: '50%', border: '2px solid transparent', borderBottomColor: '#10b981', borderLeftColor: '#10b981', animation: 'spin 0.7s linear infinite reverse' }} />
        <div style={{ position: 'absolute', inset: 20, borderRadius: '50%', border: '2px solid transparent', borderTopColor: '#f59e0b', animation: 'spin 0.5s linear infinite' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#10b981)', boxShadow: '0 0 20px rgba(124,58,237,0.8)' }} />
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ width: 240, height: 3, background: 'rgba(124,58,237,0.15)', borderRadius: 2, overflow: 'hidden', marginBottom: 16 }}>
        <div style={{
          height: '100%', borderRadius: 2,
          background: 'linear-gradient(90deg,#7c3aed,#10b981)',
          width: phase >= 1 ? '100%' : '30%',
          transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)',
          boxShadow: '0 0 10px rgba(124,58,237,0.6)'
        }} />
      </div>

      {/* Status text */}
      <div className="font-gaming" style={{ fontSize: 11, color: '#505070', letterSpacing: 3, animation: 'neonPulse 1.5s infinite' }}>
        {phase === 0 ? 'INITIALIZING...' : phase === 1 ? 'LOADING ASSETS...' : 'READY'}
      </div>

      {/* Floating dots */}
      <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
        {[0,1,2,3,4].map(i => (
          <div key={i} style={{
            width: 6, height: 6, borderRadius: '50%',
            background: i % 2 === 0 ? '#7c3aed' : '#10b981',
            animation: `float ${0.8 + i * 0.15}s ease-in-out infinite`,
            boxShadow: `0 0 8px ${i % 2 === 0 ? '#7c3aed' : '#10b981'}`
          }} />
        ))}
      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes neonPulse { 0%,100%{opacity:1} 50%{opacity:0.6} }
      `}</style>
    </div>
  );
}

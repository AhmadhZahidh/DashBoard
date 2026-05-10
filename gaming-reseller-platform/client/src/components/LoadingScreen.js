import React from 'react';

export default function LoadingScreen({ text = 'LOADING' }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#05050d',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999
    }}>
      {/* Outer ring */}
      <div style={{ position: 'relative', width: 100, height: 100, marginBottom: 32 }}>
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          border: '3px solid transparent',
          borderTopColor: '#7c3aed', borderRightColor: '#7c3aed',
          animation: 'spin 1s linear infinite'
        }} />
        <div style={{
          position: 'absolute', inset: 8, borderRadius: '50%',
          border: '3px solid transparent',
          borderBottomColor: '#10b981', borderLeftColor: '#10b981',
          animation: 'spin 0.7s linear infinite reverse'
        }} />
        <div style={{
          position: 'absolute', inset: 18, borderRadius: '50%',
          border: '2px solid transparent',
          borderTopColor: '#f59e0b',
          animation: 'spin 0.5s linear infinite'
        }} />
        {/* Center dot */}
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#10b981)', boxShadow: '0 0 20px rgba(124,58,237,0.8)' }} />
        </div>
      </div>

      {/* Text */}
      <div className="font-gaming" style={{ fontSize: 14, letterSpacing: 6, color: '#7c3aed', marginBottom: 12, animation: 'neonPulse 1.5s ease-in-out infinite' }}>
        {text}
      </div>

      {/* Dots */}
      <div style={{ display: 'flex', gap: 6 }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{
            width: 6, height: 6, borderRadius: '50%',
            background: i % 2 === 0 ? '#7c3aed' : '#10b981',
            animation: `float 1s ease-in-out ${i * 0.2}s infinite`
          }} />
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ width: 200, height: 2, background: 'rgba(124,58,237,0.2)', borderRadius: 2, marginTop: 24, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: '40%',
          background: 'linear-gradient(90deg,#7c3aed,#10b981)',
          borderRadius: 2,
          animation: 'loadingBar 1.5s ease-in-out infinite'
        }} />
      </div>

      <style>{`
        @keyframes loadingBar {
          0% { transform: translateX(-100%); width: 40%; }
          50% { width: 60%; }
          100% { transform: translateX(350%); width: 40%; }
        }
        @keyframes neonPulse {
          0%,100% { opacity:1; text-shadow: 0 0 10px rgba(124,58,237,0.8); }
          50% { opacity:0.6; text-shadow: 0 0 20px rgba(124,58,237,1); }
        }
      `}</style>
    </div>
  );
}

// Inline spinner for buttons/sections
export function Spinner({ size = 20, color = '#7c3aed' }) {
  return (
    <div style={{
      width: size, height: size,
      border: `2px solid ${color}30`,
      borderTopColor: color,
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
      flexShrink: 0
    }} />
  );
}

// Card skeleton
export function SkeletonCard({ height = 120 }) {
  return (
    <div style={{
      height, borderRadius: 14,
      background: 'linear-gradient(90deg,#0e0e1f 25%,#141428 50%,#0e0e1f 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite'
    }} />
  );
}

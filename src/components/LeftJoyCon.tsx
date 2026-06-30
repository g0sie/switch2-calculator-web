export function LeftJoyCon() {
  return (
    <div
      style={{
        background: 'linear-gradient(165deg, #C20030, #960020)',
        width: '62px',
        flexShrink: 0,
        padding: '14px 9px 18px',
        gap: '16px',
      }}
      className="hidden md:flex flex-col items-center"
    >
      {/* Minus button */}
      <div style={{ position: 'relative', width: '22px', height: '22px', flexShrink: 0 }}>
        <div style={{ position: 'absolute', top: '8px', left: 0, width: '22px', height: '6px', background: '#820018', borderRadius: '3px' }} />
      </div>

      {/* Analog stick */}
      <div style={{ width: '26px', height: '26px', background: '#820018', borderRadius: '50%', flexShrink: 0, boxShadow: 'inset 0 2px 3px #00000055' }} />

      {/* D-pad */}
      <div style={{ position: 'relative', width: '44px', height: '44px', flexShrink: 0 }}>
        <div style={{ position: 'absolute', width: '14px', height: '14px', borderRadius: '50%', background: '#720015', top: 0, left: '15px' }} />
        <div style={{ position: 'absolute', width: '14px', height: '14px', borderRadius: '50%', background: '#720015', bottom: 0, left: '15px' }} />
        <div style={{ position: 'absolute', width: '14px', height: '14px', borderRadius: '50%', background: '#720015', left: 0, top: '15px' }} />
        <div style={{ position: 'absolute', width: '14px', height: '14px', borderRadius: '50%', background: '#720015', right: 0, top: '15px' }} />
      </div>
    </div>
  )
}

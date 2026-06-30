export function RightJoyCon() {
  return (
    <div
      style={{
        background: 'linear-gradient(165deg, #0038CC, #002299)',
        width: '62px',
        flexShrink: 0,
        padding: '14px 9px 18px',
        gap: '16px',
      }}
      className="hidden md:flex flex-col items-center"
    >
      {/* Plus button */}
      <div style={{ position: 'relative', width: '22px', height: '22px', flexShrink: 0 }}>
        <div style={{ position: 'absolute', top: '8px', left: 0, width: '22px', height: '6px', background: '#001C88', borderRadius: '3px' }} />
        <div style={{ position: 'absolute', top: 0, left: '8px', width: '6px', height: '22px', background: '#001C88', borderRadius: '3px' }} />
      </div>

      {/* ABXY buttons */}
      <div style={{ position: 'relative', width: '44px', height: '44px', flexShrink: 0 }}>
        <div style={{ position: 'absolute', width: '14px', height: '14px', borderRadius: '50%', background: '#1A55CC', top: 0, left: '15px', boxShadow: 'inset 0 1px 2px #00000044' }} />
        <div style={{ position: 'absolute', width: '14px', height: '14px', borderRadius: '50%', background: '#BBAA00', bottom: 0, left: '15px', boxShadow: 'inset 0 1px 2px #00000044' }} />
        <div style={{ position: 'absolute', width: '14px', height: '14px', borderRadius: '50%', background: '#009933', left: 0, top: '15px', boxShadow: 'inset 0 1px 2px #00000044' }} />
        <div style={{ position: 'absolute', width: '14px', height: '14px', borderRadius: '50%', background: '#CC1122', right: 0, top: '15px', boxShadow: 'inset 0 1px 2px #00000044' }} />
      </div>

      {/* Analog stick */}
      <div style={{ width: '26px', height: '26px', background: '#001C88', borderRadius: '50%', flexShrink: 0, boxShadow: 'inset 0 2px 3px #00000055' }} />
    </div>
  )
}

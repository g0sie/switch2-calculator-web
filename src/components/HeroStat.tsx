interface HeroStatProps {
  costPerHour: number | null
  totalSpent: number
  totalHours: number
}

export function HeroStat({ costPerHour, totalSpent, totalHours }: HeroStatProps) {
  const formatted = costPerHour != null
    ? costPerHour.toFixed(2).replace('.', ',')
    : '—'

  return (
    <div style={{ padding: '20px 20px 12px', flexShrink: 0 }}>
      <div
        className="bg-[#0E0E1E] rounded-[10px]"
        style={{ border: '1px solid rgba(51,102,255,0.45)', padding: '16px 18px 16px' }}
      >
        <div className="text-[11px] uppercase tracking-[0.12em]" style={{ marginBottom: '8px', color: '#AABBDD' }}>
          Koszt za godzinę grania
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '14px' }}>
          <span className="text-[40px] font-bold leading-none tracking-[-1.5px]" style={{ color: '#F0F0F8' }}>
            {formatted}
          </span>
          <span className="text-[15px] font-medium" style={{ marginLeft: '10px', color: '#F0F0F8' }}>PLN/h</span>
        </div>
        <div
          style={{
            display: 'flex',
            borderTop: '1px solid rgba(51,102,255,0.35)',
            paddingTop: '12px',
            paddingBottom: '4px',
          }}
        >
          <div style={{ flex: 1 }}>
            <div className="text-[11px] uppercase tracking-[0.1em]" style={{ marginBottom: '4px', color: '#AABBDD' }}>
              Wydano łącznie
            </div>
            <div className="text-[15px] font-semibold" style={{ color: '#C8C8E8' }}>
              {totalSpent.toLocaleString('pl-PL')}{' '}
              <span className="text-[10px] font-normal" style={{ color: '#6677AA' }}>PLN</span>
            </div>
          </div>
          <div style={{ width: '1px', background: 'rgba(51,102,255,0.2)', margin: '0 16px' }} />
          <div style={{ flex: 1 }}>
            <div className="text-[11px] uppercase tracking-[0.1em]" style={{ marginBottom: '4px', color: '#AABBDD' }}>
              Zagrane godziny
            </div>
            <div className="text-[15px] font-semibold" style={{ color: '#C8C8E8' }}>
              {Math.floor(totalHours)}{' '}
              <span className="text-[10px] font-normal" style={{ color: '#6677AA' }}>h</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

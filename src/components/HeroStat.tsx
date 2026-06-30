interface HeroStatProps {
  costPerHour: number | null
  totalSpent: number
  totalHours: number
  hasUncountedGames: boolean
}

export function HeroStat({ costPerHour, totalSpent, totalHours, hasUncountedGames }: HeroStatProps) {
  const formatted = costPerHour != null
    ? costPerHour.toFixed(2).replace('.', ',')
    : '—'

  return (
    <div style={{ padding: '12px 20px 8px', flexShrink: 0 }}>
      <div
        className="bg-[#0A0A12] rounded-[10px]"
        style={{ border: '1px solid rgba(255,255,255,0.16)', padding: '16px 18px 14px' }}
      >
        <div className="text-[#6677AA] text-[9px] uppercase tracking-[0.12em] mb-2">
          Koszt za godzinę grania
        </div>
        <div className="flex items-baseline mb-[14px]">
          <span className="text-[#F0F0F8] text-[40px] font-bold leading-none tracking-[-1.5px]">
            {formatted}
          </span>
          <span className="text-[#6677AA] text-[15px] font-medium ml-2">PLN/h</span>
        </div>
        <div
          className="flex pt-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="flex-1">
            <div className="text-[#6677AA] text-[9px] uppercase tracking-[0.1em] mb-[3px]">
              Wydano łącznie
            </div>
            <div className="text-[#C8C8E8] text-[15px] font-semibold">
              {totalSpent.toLocaleString('pl-PL')}{' '}
              <span className="text-[10px] text-[#6677AA] font-normal">PLN</span>
            </div>
          </div>
          <div className="w-px mx-4" style={{ background: 'rgba(255,255,255,0.07)' }} />
          <div className="flex-1">
            <div className="text-[#6677AA] text-[9px] uppercase tracking-[0.1em] mb-[3px]">
              Zagrane godziny
            </div>
            <div className="text-[#C8C8E8] text-[15px] font-semibold">
              {totalHours}{' '}
              <span className="text-[10px] text-[#6677AA] font-normal">
                h{hasUncountedGames ? ' (+ ?)' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
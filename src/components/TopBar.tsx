import { IconDeviceGamepad2, IconCash, IconWifi, IconBattery2, IconUser } from '@tabler/icons-react'

type Tab = 'games' | 'expenses'

interface TopBarProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

export function TopBar({ activeTab, onTabChange }: TopBarProps) {
  return (
    <div
      style={{ background: '#0B0B18', borderBottom: '1px solid #141428', padding: '0 14px', display: 'flex', alignItems: 'flex-end', flexShrink: 0 }}
    >
      {/* Left: navigation tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
        <NavItem
          icon={<IconDeviceGamepad2 size={15} />}
          label="Gry"
          active={activeTab === 'games'}
          onClick={() => onTabChange('games')}
        />
        <NavItem
          icon={<IconCash size={15} />}
          label="Wydatki"
          active={activeTab === 'expenses'}
          dotLeft
          onClick={() => onTabChange('expenses')}
        />
      </div>

      {/* Right: status icons + login (self-centered since parent is items-end) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', alignSelf: 'center' }}>
        <IconWifi size={14} style={{ color: '#6677AA' }} />
        <IconBattery2 size={14} style={{ color: '#6677AA' }} />
        <div style={{ width: '1px', height: '14px', background: '#1A1A30' }} />
        <button
          style={{ width: '26px', height: '26px', border: '1px solid #2E2E52', color: '#6677AA', borderRadius: '50%', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          aria-label="Zaloguj się"
        >
          <IconUser size={15} />
        </button>
      </div>
    </div>
  )
}

interface NavItemProps {
  icon: React.ReactNode
  label: string
  active: boolean
  dotLeft?: boolean
  onClick: () => void
}

function NavItem({ icon, label, active, dotLeft = false, onClick }: NavItemProps) {
  const dot = active && (
    <div style={{ width: '4px', height: '4px', background: '#EEEEF8', borderRadius: '50%' }} />
  )

  return (
    <button
      onClick={onClick}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        cursor: 'pointer',
        padding: '10px 2px',
        marginBottom: '-1px',
        background: 'none',
        border: 'none',
        borderBottom: active ? '2px solid #EEEEF8' : '2px solid transparent',
        color: active ? '#EEEEF8' : '#6677AA',
        fontFamily: 'Space Grotesk, sans-serif',
      }}
    >
      {dotLeft && dot}
      {icon}
      <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.03em' }}>
        {label}
      </span>
      {!dotLeft && dot}
    </button>
  )
}

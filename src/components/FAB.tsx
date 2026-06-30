import { useState } from 'react'
import { IconPlus, IconX, IconDeviceGamepad2, IconCash } from '@tabler/icons-react'

export function FAB() {
  const [open, setOpen] = useState(false)
  const [closing, setClosing] = useState(false)

  const handleToggle = () => {
    if (open) {
      setClosing(true)
      setTimeout(() => {
        setOpen(false)
        setClosing(false)
      }, 150)
    } else {
      setOpen(true)
    }
  }

  return (
    <div className="absolute bottom-[14px] right-[14px] flex flex-col-reverse items-end gap-[7px] z-10">
      {(open || closing) && (
        <div className="flex flex-col gap-[6px] items-end">
          <FabAction icon={<IconDeviceGamepad2 size={15} className="text-white" />} label="Dodaj grę" closing={closing} />
          <FabAction icon={<IconCash size={15} className="text-white" />} label="Dodaj wydatek" closing={closing} />
        </div>
      )}
      <button
        onClick={handleToggle}
        aria-label="Dodaj nowy wpis"
        className="w-[40px] h-[40px] rounded-full flex items-center justify-center text-white cursor-pointer border-none transition-colors duration-150"
        style={{ background: open ? '#AA0022' : '#003EBB' }}
      >
        <span key={String(open)} className="fab-icon">
          {open ? <IconX size={18} /> : <IconPlus size={18} />}
        </span>
      </button>
    </div>
  )
}

function FabAction({ icon, label, closing }: { icon: React.ReactNode; label: string; closing: boolean }) {
  return (
    <button
      className={`${closing ? 'fab-action-closing' : 'fab-action'} rounded-[20px] flex items-center gap-2 text-white text-[14px] whitespace-nowrap cursor-pointer`}
      style={{ padding: '10px 18px 10px 14px', background: '#003EBB', border: '1px solid #1A55DD' }}
    >
      {icon}
      {label}
    </button>
  )
}

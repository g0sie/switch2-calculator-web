import { useState } from 'react'
import { IconPlus, IconX, IconDeviceGamepad2, IconCash } from '@tabler/icons-react'

export function FAB() {
  const [open, setOpen] = useState(false)

  return (
    <div className="absolute bottom-[14px] right-[14px] flex flex-col-reverse items-end gap-[7px] z-10">
      {open && (
        <div className="flex flex-col gap-[6px] items-end">
          <FabAction icon={<IconDeviceGamepad2 size={15} className="text-[#4488FF]" />} label="Dodaj grę" />
          <FabAction icon={<IconCash size={15} className="text-[#4488FF]" />} label="Dodaj wydatek" />
        </div>
      )}
      <button
        onClick={() => setOpen(prev => !prev)}
        aria-label="Dodaj nowy wpis"
        className="w-[40px] h-[40px] rounded-full flex items-center justify-center text-white cursor-pointer border-none transition-colors duration-150"
        style={{ background: open ? '#001F99' : '#003EBB' }}
      >
        {open ? <IconX size={18} /> : <IconPlus size={18} />}
      </button>
    </div>
  )
}

function FabAction({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="bg-[#0E0E1C] border border-[#1C1C36] rounded-[20px] py-[7px] pl-[10px] pr-[14px] flex items-center gap-2 text-[#B0C8FF] text-[12px] whitespace-nowrap cursor-pointer hover:bg-[#171730]">
      {icon}
      {label}
    </button>
  )
}

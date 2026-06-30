import { useState } from 'react'
import { IconPencil, IconCheck, IconX } from '@tabler/icons-react'

export interface Game {
  id: string
  title: string
  hoursPlayed: number | null
  coverColor: string
  coverInitials: string
}

interface GamesListProps {
  games: Game[]
}

export function GamesList({ games }: GamesListProps) {
  const counted = games.filter(g => g.hoursPlayed !== null)
  const uncounted = games.filter(g => g.hoursPlayed === null)

  return (
    <div style={{ padding: '0 20px 80px', display: 'flex', flexDirection: 'column', gap: '5px', overflowY: 'auto' }}>
      <SepLabel>Biblioteka gier</SepLabel>
      {counted.map(game => (
        <GameRow key={game.id} game={game} />
      ))}
      {uncounted.length > 0 && (
        <>
          <SepLabel className="mt-1">niezliczone</SepLabel>
          {uncounted.map(game => (
            <GameRow key={game.id} game={game} />
          ))}
        </>
      )}
    </div>
  )
}

function SepLabel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`text-[#5A5A88] text-[9px] uppercase tracking-[0.12em] flex items-center gap-2 py-1 px-[2px] ${className}`}>
      {children}
      <div className="flex-1 h-px bg-[#1E1E36]" />
    </div>
  )
}

function GameRow({ game }: { game: Game }) {
  const [editing, setEditing] = useState(false)
  const [inputVal, setInputVal] = useState(game.hoursPlayed?.toString() ?? '')

  const handleSave = () => {
    setEditing(false)
  }

  return (
    <div className="group flex items-center gap-[10px] px-3 py-[9px] bg-[#0D0D1A] rounded-[7px]">
      <div
        className="w-[30px] h-[30px] rounded-[5px] flex items-center justify-center text-[9px] font-bold shrink-0"
        style={{ background: game.coverColor, color: '#fff' }}
      >
        {game.coverInitials}
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-[#E8E8F8] text-[12px] font-medium truncate">{game.title}</div>
        {game.hoursPlayed === null && (
          <div className="text-[#5A5A88] text-[10px]">godziny nieznane</div>
        )}
      </div>

      {editing ? (
        <div className="flex items-center gap-1">
          <input
            type="number"
            min={0}
            step={0.5}
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            placeholder="?"
            autoFocus
            className="w-[56px] h-6 bg-[#10101C] border border-[#2244AA88] rounded text-[#F0F0F8] text-[12px] px-[6px] outline-none focus:border-[#4488FF]"
          />
          <button
            onClick={handleSave}
            aria-label="Zapisz"
            className="p-[3px] rounded text-[#226633] hover:text-[#00AA44] cursor-pointer bg-transparent border-none"
          >
            <IconCheck size={14} />
          </button>
          <button
            onClick={() => setEditing(false)}
            aria-label="Anuluj"
            className="p-[3px] rounded text-[#662222] hover:text-[#CC2222] cursor-pointer bg-transparent border-none"
          >
            <IconX size={14} />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-[5px]">
          {game.hoursPlayed !== null ? (
            <span className="text-[#8899BB] text-[12px]">{game.hoursPlayed}h</span>
          ) : (
            <span className="text-[#444466] text-[14px] font-bold">?</span>
          )}
          <button
            onClick={() => setEditing(true)}
            aria-label="Edytuj godziny"
            className="p-[3px] rounded text-[#4A5577] hover:text-[#8899BB] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer bg-transparent border-none"
          >
            <IconPencil size={13} />
          </button>
        </div>
      )}
    </div>
  )
}

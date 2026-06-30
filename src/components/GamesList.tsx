import { useState } from "react";
import { IconCheck, IconX } from "@tabler/icons-react";

export interface Game {
  id: string;
  title: string;
  hoursPlayed: number | null;
  coverColor: string;
  coverInitials: string;
}

interface GamesListProps {
  games: Game[];
}

function toHHMM(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}:${m.toString().padStart(2, "0")}`;
}


export function GamesList({ games }: GamesListProps) {
  const counted = games.filter((g) => g.hoursPlayed !== null);
  const uncounted = games.filter((g) => g.hoursPlayed === null);

  return (
    <div
      style={{
        padding: "0 20px 80px",
        display: "flex",
        flexDirection: "column",
        gap: "5px",
        overflowY: "auto",
        flex: 1,
        minHeight: 0,
      }}
    >
      <SepLabel>Biblioteka gier</SepLabel>
      {counted.map((game) => (
        <GameRow key={game.id} game={game} />
      ))}
      {uncounted.length > 0 && (
        <>
          <SepLabel style={{ marginTop: "12px" }}>niezliczone</SepLabel>
          {uncounted.map((game) => (
            <GameRow key={game.id} game={game} />
          ))}
        </>
      )}
    </div>
  );
}

function SepLabel({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className="text-[#AABBDD] text-[11px] uppercase tracking-[0.12em] flex items-center gap-2 py-1 px-[2px]"
      style={style}
    >
      {children}
      <div
        className="flex-1 h-px"
        style={{ background: "rgba(255,255,255,0.08)" }}
      />
    </div>
  );
}

function GameRow({ game }: { game: Game }) {
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState(
    game.hoursPlayed != null ? toHHMM(game.hoursPlayed) : ""
  );

  const handleSave = () => setEditing(false);

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditing(false);
  };

  const handleRowClick = () => {
    if (!editing) setEditing(true);
  };

  return (
    <div
      className="group flex items-center gap-[10px] bg-[#111122] rounded-[7px]"
      style={{ padding: "13px 12px", cursor: editing ? "default" : "pointer" }}
      onClick={handleRowClick}
    >
      <div
        className="w-[30px] h-[30px] rounded-[5px] flex items-center justify-center text-[10px] font-bold shrink-0"
        style={{ background: game.coverColor, color: "#fff" }}
      >
        {game.coverInitials}
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-[#E8E8F8] text-[13px] font-medium truncate">
          {game.title}
        </div>
        {game.hoursPlayed === null && !editing && (
          <div className="text-[#AABBDD] text-[11px]">godziny nieznane</div>
        )}
      </div>

      {editing ? (
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="0:00"
            autoFocus
            className="w-[64px] h-6 bg-[#10101C] border border-[#2244AA88] rounded text-[#F0F0F8] text-[12px] px-[6px] outline-none focus:border-[#4488FF]"
          />
          <button
            onClick={handleSave}
            aria-label="Zapisz"
            className="p-[3px] rounded text-[#226633] hover:text-[#00AA44] cursor-pointer bg-transparent border-none"
          >
            <IconCheck size={14} />
          </button>
          <button
            onClick={handleCancel}
            aria-label="Anuluj"
            className="p-[3px] rounded text-[#662222] hover:text-[#CC2222] cursor-pointer bg-transparent border-none"
          >
            <IconX size={14} />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-[5px]">
          {game.hoursPlayed !== null ? (
            <span className="text-[#AABBDD] text-[13px] font-medium">
              {toHHMM(game.hoursPlayed)}
            </span>
          ) : (
            <span className="text-[#6677AA] text-[14px] font-bold">?</span>
          )}
        </div>
      )}
    </div>
  );
}

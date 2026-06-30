import { useState, useRef, useEffect } from "react";
import { IconCheck, IconX } from "@tabler/icons-react";
import { HexColorPicker } from "react-colorful";
import { updateGame } from "../lib/firestore";

function getContrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#000000' : '#ffffff'
}

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
  const played = games.filter((g) => g.hoursPlayed !== null && g.hoursPlayed > 0);
  const notStarted = games.filter((g) => !g.hoursPlayed);

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
      {played.map((game) => (
        <GameRow key={game.id} game={game} />
      ))}
      {notStarted.length > 0 && (
        <>
          <SepLabel style={{ marginTop: "12px" }}>nierozpoczęte</SepLabel>
          {notStarted.map((game) => (
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
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [pendingColor, setPendingColor] = useState(game.coverColor);
  const colorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!colorPickerOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (colorRef.current && !colorRef.current.contains(e.target as Node)) {
        setColorPickerOpen(false);
        setPendingColor(game.coverColor);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [colorPickerOpen, game.coverColor]);

  const handleSaveColor = async () => {
    await updateGame(game.id, { coverColor: pendingColor });
    setColorPickerOpen(false);
  };

  const handleCancelColor = () => {
    setPendingColor(game.coverColor);
    setColorPickerOpen(false);
  };

  const handleSave = async () => {
    const trimmed = inputVal.trim()
    if (trimmed === '') {
      await updateGame(game.id, { hoursPlayed: null })
    } else {
      let hours: number
      if (trimmed.includes(':')) {
        const [h, m] = trimmed.split(':').map(Number)
        hours = h + m / 60
      } else {
        hours = parseFloat(trimmed.replace(',', '.'))
      }
      if (!isNaN(hours) && hours >= 0) await updateGame(game.id, { hoursPlayed: hours })
    }
    setEditing(false)
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditing(false);
  };

  const handleRowClick = () => {
    if (!editing && !colorPickerOpen) setEditing(true);
  };

  return (
    <div
      className="group flex items-center gap-[10px] bg-[#111122] rounded-[7px]"
      style={{ padding: "13px 12px", cursor: editing ? "default" : "pointer", position: "relative" }}
      onClick={handleRowClick}
    >
      {/* Cover z popoverem */}
      <div ref={colorRef} style={{ position: "relative", flexShrink: 0 }} onClick={e => e.stopPropagation()}>
        <div
          className="w-[30px] h-[30px] rounded-[5px] flex items-center justify-center text-[10px] font-bold"
          style={{ background: game.coverColor, color: getContrastColor(game.coverColor), cursor: "pointer" }}
          onClick={() => setColorPickerOpen(o => !o)}
          title="Zmień kolor okładki"
        >
          {game.coverInitials}
        </div>
        {colorPickerOpen && (
          <div style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            zIndex: 40,
            background: "#0F0F1E",
            border: "1px solid #2233AA",
            borderRadius: "10px",
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}>
            <HexColorPicker color={pendingColor} onChange={setPendingColor} style={{ width: "160px", height: "120px" }} />
            <input
              value={pendingColor}
              onChange={e => setPendingColor(e.target.value)}
              maxLength={7}
              style={{ background: "#10101C", border: "1px solid #2244AA88", borderRadius: "6px", color: "#F0F0F8", fontSize: "12px", padding: "5px 8px", outline: "none", fontFamily: "monospace" }}
            />
            <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
              <button onClick={handleCancelColor} style={smallBtn}>
                <IconX size={12} />
              </button>
              <button onClick={handleSaveColor} style={{ ...smallBtn, background: "#003EBB", borderColor: "#1A55DD" }}>
                <IconCheck size={12} />
              </button>
            </div>
          </div>
        )}
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

const smallBtn: React.CSSProperties = {
  background: "#14142A",
  border: "1px solid #2E2E52",
  borderRadius: "6px",
  color: "#AABBDD",
  cursor: "pointer",
  padding: "4px 8px",
  display: "flex",
  alignItems: "center",
}

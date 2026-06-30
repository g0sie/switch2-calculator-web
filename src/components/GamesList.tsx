import { HexColorPicker } from "react-colorful";

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
  onEditGame: (game: Game) => void;
}

function toHHMM(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}:${m.toString().padStart(2, "0")}`;
}

export function GamesList({ games, onEditGame }: GamesListProps) {
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
        <GameRow key={game.id} game={game} onEdit={() => onEditGame(game)} />
      ))}
      {notStarted.length > 0 && (
        <>
          <SepLabel style={{ marginTop: "12px" }}>nierozpoczęte</SepLabel>
          {notStarted.map((game) => (
            <GameRow key={game.id} game={game} onEdit={() => onEditGame(game)} />
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

function GameRow({ game, onEdit }: { game: Game; onEdit: () => void }) {
  return (
    <div
      className="flex items-center gap-[10px] bg-[#111122] rounded-[7px] cursor-pointer hover:bg-[#16162A] transition-colors"
      style={{ padding: "13px 12px" }}
      onClick={onEdit}
    >
      <div
        className="w-[30px] h-[30px] rounded-[5px] flex items-center justify-center text-[10px] font-bold shrink-0"
        style={{ background: game.coverColor, color: getContrastColor(game.coverColor) }}
      >
        {game.coverInitials}
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-[#E8E8F8] text-[13px] font-medium truncate">
          {game.title}
        </div>
      </div>

      <div className="flex items-center">
        {game.hoursPlayed !== null && game.hoursPlayed > 0 ? (
          <span className="text-[#AABBDD] text-[13px] font-medium">
            {toHHMM(game.hoursPlayed)}
          </span>
        ) : (
          <span className="text-[#AABBDD] text-[13px] font-medium">0:00</span>
        )}
      </div>
    </div>
  );
}

// kept for potential future use
export { HexColorPicker };

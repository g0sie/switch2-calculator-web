import { HexColorPicker } from "react-colorful";
import type { Expense } from "./ExpensesList";

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
  expenses: Expense[];
  onEditGame: (game: Game) => void;
  isOwner: boolean;
}

function calcGameCost(gameId: string, expenses: Expense[]): number {
  return expenses
    .filter(e => e.linkedGameIds && e.linkedGameIds.includes(gameId))
    .reduce((sum, e) => sum + e.amount / (e.linkedGameIds!.length), 0)
}

function toHHMM(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}:${m.toString().padStart(2, "0")}`;
}

export function GamesList({ games, expenses, onEditGame, isOwner }: GamesListProps) {
  const played = games
    .filter((g) => g.hoursPlayed !== null && g.hoursPlayed > 0)
    .sort((a, b) => {
      const costA = calcGameCost(a.id, expenses)
      const costB = calcGameCost(b.id, expenses)
      const cphA = costA > 0 && a.hoursPlayed ? costA / a.hoursPlayed : -1
      const cphB = costB > 0 && b.hoursPlayed ? costB / b.hoursPlayed : -1
      return cphB - cphA
    });
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
        <GameRow key={game.id} game={game} expenses={expenses} onEdit={() => onEditGame(game)} isOwner={isOwner} />
      ))}
      {notStarted.length > 0 && (
        <>
          <SepLabel style={{ marginTop: "12px" }}>nierozpoczęte</SepLabel>
          {notStarted.map((game) => (
            <GameRow key={game.id} game={game} expenses={expenses} onEdit={() => onEditGame(game)} isOwner={isOwner} />
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

function GameRow({ game, expenses, onEdit, isOwner }: { game: Game; expenses: Expense[]; onEdit: () => void; isOwner: boolean }) {
  const gameCost = calcGameCost(game.id, expenses)
  const costPerHour = gameCost > 0 && game.hoursPlayed && game.hoursPlayed > 0
    ? gameCost / game.hoursPlayed
    : null

  return (
    <div
      className={`flex items-center gap-[10px] bg-[#111122] rounded-[7px] transition-colors ${isOwner ? 'cursor-pointer hover:bg-[#16162A]' : ''}`}
      style={{ padding: "13px 12px" }}
      onClick={isOwner ? onEdit : undefined}
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

      <div className="flex items-center gap-[10px]">
        <span className="text-[12px] font-medium text-right" style={{ color: '#5577BB', width: '88px' }}>
          {costPerHour !== null ? `${costPerHour.toFixed(2)} PLN/h` : ''}
        </span>
        <span className="text-[#AABBDD] text-[13px] font-medium text-right" style={{ width: '40px' }}>
          {game.hoursPlayed && game.hoursPlayed > 0 ? toHHMM(game.hoursPlayed) : '0:00'}
        </span>
      </div>
    </div>
  );
}

// kept for potential future use
export { HexColorPicker };

import { useState } from 'react'
import { LeftJoyCon } from './components/LeftJoyCon'
import { RightJoyCon } from './components/RightJoyCon'
import { TopBar } from './components/TopBar'
import { HeroStat } from './components/HeroStat'
import { GamesList, type Game } from './components/GamesList'
import { ExpensesList, type Expense } from './components/ExpensesList'
import { FAB } from './components/FAB'

type Tab = 'games' | 'expenses'

const MOCK_GAMES: Game[] = [
  { id: '1', title: 'Mario Kart World', hoursPlayed: 42, coverColor: '#C20030', coverInitials: 'MK' },
  { id: '2', title: 'Zelda: Echoes of Wisdom', hoursPlayed: 31, coverColor: '#004499', coverInitials: 'ZL' },
  { id: '3', title: 'Pokémon Legends: Z-A', hoursPlayed: 14, coverColor: '#3D3000', coverInitials: 'PK' },
  { id: '4', title: "Let's Go Pikachu", hoursPlayed: 8, coverColor: '#664400', coverInitials: 'LGP' },
  { id: '5', title: 'Minecraft', hoursPlayed: null, coverColor: '#2A4A10', coverInitials: 'MC' },
]

const MOCK_EXPENSES: Expense[] = [
  { id: '1', title: 'Nintendo Switch 2', amount: 1681, type: 'console', date: new Date(2025, 3, 1), isGift: false },
  { id: '2', title: 'Mario Kart World', amount: 299, type: 'game', date: new Date(2025, 3, 1), isGift: false },
  { id: '3', title: 'Pakiet 3 gier', amount: 499, type: 'bundle', date: new Date(2025, 3, 1), isGift: false },
  { id: '4', title: "Let's Go Pikachu", amount: 0, type: 'gift', date: new Date(2024, 11, 25), isGift: true },
]

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('games')

  const totalSpent = MOCK_EXPENSES
    .filter(e => !e.isGift)
    .reduce((sum, e) => sum + e.amount, 0)

  const totalHours = MOCK_GAMES
    .filter(g => g.hoursPlayed !== null)
    .reduce((sum, g) => sum + (g.hoursPlayed ?? 0), 0)

  const costPerHour = totalHours > 0 ? totalSpent / totalHours : null
  const hasUncountedGames = MOCK_GAMES.some(g => g.hoursPlayed === null)

  return (
    <div className="min-h-screen bg-[#1A1A22] flex items-center justify-center p-3">
      <div className="bg-[#1A1A22] rounded-xl p-3 w-full max-w-7xl">
        <div
          className="flex items-stretch rounded-[20px] overflow-hidden"
          style={{ outline: '2px solid #2C2C3E', outlineOffset: '-1px' }}
        >
          <LeftJoyCon />

          <div className="flex-1 bg-[#07070E] flex flex-col relative min-h-135">
            <TopBar activeTab={activeTab} onTabChange={setActiveTab} />
            <HeroStat
              costPerHour={costPerHour}
              totalSpent={totalSpent}
              totalHours={totalHours}
              hasUncountedGames={hasUncountedGames}
            />
            <div className="flex-1 overflow-hidden flex flex-col">
              {activeTab === 'games' ? (
                <GamesList games={MOCK_GAMES} />
              ) : (
                <ExpensesList expenses={MOCK_EXPENSES} />
              )}
            </div>
            <FAB />
          </div>

          <RightJoyCon />
        </div>
      </div>
    </div>
  )
}

export default App

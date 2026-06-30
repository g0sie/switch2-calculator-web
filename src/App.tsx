import { useState, useEffect } from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { auth } from './lib/firebase'
import { subscribeToGames, subscribeToExpenses } from './lib/firestore'
import { LeftJoyCon } from './components/LeftJoyCon'
import { RightJoyCon } from './components/RightJoyCon'
import { TopBar } from './components/TopBar'
import { HeroStat } from './components/HeroStat'
import { GamesList, type Game } from './components/GamesList'
import { ExpensesList, type Expense } from './components/ExpensesList'
import { FAB } from './components/FAB'

type Tab = 'games' | 'expenses'

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('games')
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [games, setGames] = useState<Game[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, setCurrentUser)
    return unsubscribeAuth
  }, [])

  useEffect(() => {
    const unsubGames = subscribeToGames(setGames)
    const unsubExpenses = subscribeToExpenses(setExpenses)
    return () => {
      unsubGames()
      unsubExpenses()
    }
  }, [])

  const totalSpent = expenses
    .filter(e => !e.isGift)
    .reduce((sum, e) => sum + e.amount, 0)

  const totalHours = games
    .filter(g => g.hoursPlayed !== null)
    .reduce((sum, g) => sum + (g.hoursPlayed ?? 0), 0)

  const costPerHour = totalHours > 0 ? totalSpent / totalHours : null
  const hasUncountedGames = games.some(g => g.hoursPlayed === null)

  return (
    <div className="min-h-screen bg-[#1A1A22] flex items-center justify-center p-3">
      <div className="bg-[#1A1A22] rounded-xl p-3 w-full max-w-7xl">
        <div
          className="flex items-stretch rounded-[20px] overflow-hidden"
          style={{ outline: '2px solid #2C2C3E', outlineOffset: '-1px' }}
        >
          <LeftJoyCon />

          <div className="flex-1 bg-[#07070E] flex flex-col relative" style={{ height: '700px' }}>
            <TopBar activeTab={activeTab} onTabChange={setActiveTab} isOwner={currentUser?.email === import.meta.env.VITE_OWNER_EMAIL} />
            <HeroStat
              costPerHour={costPerHour}
              totalSpent={totalSpent}
              totalHours={totalHours}
              hasUncountedGames={hasUncountedGames}
            />
            <div className="flex-1 overflow-hidden flex flex-col">
              {activeTab === 'games' ? (
                <GamesList games={games} />
              ) : (
                <ExpensesList expenses={expenses} />
              )}
            </div>
            {currentUser?.email === import.meta.env.VITE_OWNER_EMAIL && <FAB />}
          </div>

          <RightJoyCon />
        </div>
      </div>
    </div>
  )
}

export default App

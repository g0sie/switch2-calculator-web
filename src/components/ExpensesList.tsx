export interface Expense {
  id: string
  title: string
  amount: number
  type: 'console' | 'game' | 'bundle' | 'accessory' | 'gift'
  date: Date
  isGift: boolean
}

const TYPE_LABELS: Record<Expense['type'], string> = {
  console: 'konsola',
  game: 'gra',
  bundle: 'pakiet',
  accessory: 'akcesorium',
  gift: 'gratis',
}

const MONTH_NAMES = [
  'styczeń', 'luty', 'marzec', 'kwiecień', 'maj', 'czerwiec',
  'lipiec', 'sierpień', 'wrzesień', 'październik', 'listopad', 'grudzień',
]

function formatDate(date: Date) {
  return `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`
}

interface ExpensesListProps {
  expenses: Expense[]
  onEditExpense: (expense: Expense) => void
  isOwner: boolean
}

export function ExpensesList({ expenses, onEditExpense, isOwner }: ExpensesListProps) {
  return (
    <div style={{ padding: '0 20px 80px', display: 'flex', flexDirection: 'column', gap: '5px', overflowY: 'auto', flex: 1, minHeight: 0 }}>
      <div className="text-[#AABBDD] text-[11px] uppercase tracking-[0.12em] flex items-center gap-2 py-1 px-[2px]">
        Historia wydatków
        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
      </div>
      {expenses.map(expense => (
        <ExpenseRow key={expense.id} expense={expense} onEdit={() => onEditExpense(expense)} isOwner={isOwner} />
      ))}
    </div>
  )
}

function ExpenseRow({ expense, onEdit, isOwner }: { expense: Expense; onEdit: () => void; isOwner: boolean }) {
  const label = TYPE_LABELS[expense.type]
  const isGift = expense.isGift
  const formatted = expense.amount.toLocaleString('pl-PL')

  return (
    <div
      className={`flex justify-between items-center bg-[#111122] rounded-[7px] transition-colors ${isOwner ? 'cursor-pointer hover:bg-[#16162A]' : ''}`}
      style={{ padding: '13px 12px', opacity: isGift ? 0.45 : 1 }}
      onClick={isOwner ? onEdit : undefined}
    >
      <div>
        <div className="text-[#E8E8F8] text-[13px] font-medium">{expense.title}</div>
        <div className="text-[#AABBDD] text-[11px]">
          {isGift ? `prezent • nie wliczane • ` : ''}{formatDate(expense.date)}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span
          className="text-[11px] rounded-[10px] font-medium bg-[#14142A]"
          style={{ padding: '4px 10px', color: isGift ? '#448844' : '#7788CC' }}
        >
          {label}
        </span>
        <span className="text-[14px] font-semibold" style={{ color: isGift ? '#8899BB' : '#EEEEF8' }}>
          {formatted}
          <span style={{ color: isGift ? '#556677' : '#6677AA' }}> PLN</span>
        </span>
      </div>
    </div>
  )
}

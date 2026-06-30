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
}

export function ExpensesList({ expenses }: ExpensesListProps) {
  return (
    <div style={{ padding: '0 20px 80px', display: 'flex', flexDirection: 'column', gap: '5px', overflowY: 'auto' }}>
      <div className="text-[#5A5A88] text-[9px] uppercase tracking-[0.12em] flex items-center gap-2 py-1 px-[2px]">
        Historia wydatków
        <div className="flex-1 h-px bg-[#1E1E36]" />
      </div>
      {expenses.map(expense => (
        <ExpenseRow key={expense.id} expense={expense} />
      ))}
    </div>
  )
}

function ExpenseRow({ expense }: { expense: Expense }) {
  const label = TYPE_LABELS[expense.type]
  const isGift = expense.isGift

  return (
    <div
      className="flex justify-between items-center px-3 py-[10px] bg-[#0D0D1A] rounded-[7px]"
      style={{ opacity: isGift ? 0.45 : 1 }}
    >
      <div>
        <div className="text-[#E8E8F8] text-[12px] font-medium">{expense.title}</div>
        <div className="text-[#5A5A88] text-[10px]">
          {isGift ? `prezent • nie wliczane • ` : ''}{formatDate(expense.date)}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span
          className="text-[9px] px-[7px] py-[2px] rounded-[10px] font-medium bg-[#14142A]"
          style={{ color: isGift ? '#336633' : '#5566AA' }}
        >
          {label}
        </span>
        <span
          className="text-[13px] font-semibold"
          style={{ color: isGift ? '#5A5A88' : '#EEEEF8' }}
        >
          {expense.amount.toLocaleString('pl-PL')} PLN
        </span>
      </div>
    </div>
  )
}

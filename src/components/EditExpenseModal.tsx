import { useState, useRef, useEffect } from 'react'
import { IconX, IconChevronDown } from '@tabler/icons-react'
import { updateExpense } from '../lib/firestore'
import type { Expense } from './ExpensesList'
import type { Game } from './GamesList'

interface EditExpenseModalProps {
  expense: Expense
  onClose: () => void
  games: Game[]
}

const TYPE_LABELS: Record<Expense['type'], string> = {
  console: 'konsola',
  game: 'gra',
  bundle: 'pakiet',
  accessory: 'akcesorium',
  gift: 'gratis',
}

const TYPES = Object.keys(TYPE_LABELS) as Expense['type'][]

const MONTH_NAMES = [
  'styczeń', 'luty', 'marzec', 'kwiecień', 'maj', 'czerwiec',
  'lipiec', 'sierpień', 'wrzesień', 'październik', 'listopad', 'grudzień',
]

const currentYear = new Date().getFullYear()
const YEARS = Array.from({ length: 6 }, (_, i) => currentYear - 5 + i + 1).reverse()

export function EditExpenseModal({ expense, onClose, games }: EditExpenseModalProps) {
  const [title, setTitle] = useState(expense.title)
  const [amountInput, setAmountInput] = useState(String(expense.amount).replace('.', ','))
  const [type, setType] = useState<Expense['type']>(expense.type)
  const [selectedMonth, setSelectedMonth] = useState(expense.date.getMonth())
  const [selectedYear, setSelectedYear] = useState(expense.date.getFullYear())
  const [isGift, setIsGift] = useState(expense.isGift)
  const [linkedGameIds, setLinkedGameIds] = useState<string[]>(expense.linkedGameIds ?? [])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleTypeChange = (t: Expense['type']) => {
    setType(t)
    setIsGift(t === 'gift')
    if (t !== 'game' && t !== 'bundle') setLinkedGameIds([])
  }

  const toggleGame = (id: string) => {
    setLinkedGameIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const handleSave = async () => {
    if (!title.trim()) { setError('Tytuł jest wymagany'); return }
    const amount = parseFloat(amountInput.replace(',', '.'))
    if (isNaN(amount) || amount < 0) { setError('Podaj prawidłową kwotę'); return }
    setError('')
    setSaving(true)
    await updateExpense(expense.id, {
      title: title.trim(),
      amount,
      type,
      date: new Date(selectedYear, selectedMonth, 1),
      isGift,
      linkedGameIds,
    })
    setSaving(false)
    onClose()
  }

  const showGamePicker = type === 'game' || type === 'bundle'

  return (
    <div
      style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20 }}
      onClick={onClose}
    >
      <div
        style={{ background: '#0F0F1E', border: '1px solid #2233AA', borderRadius: '12px', padding: '20px', width: '280px', display: 'flex', flexDirection: 'column', gap: '14px' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: '#E8E8F8', fontSize: '14px', fontWeight: 600 }}>Edytuj wydatek</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#6677AA', cursor: 'pointer', display: 'flex', padding: 0 }}>
            <IconX size={16} />
          </button>
        </div>

        <Field label="Tytuł">
          <input
            autoFocus
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={inputStyle}
          />
        </Field>

        <Field label="Kwota (PLN)">
          <input
            value={amountInput}
            onChange={e => setAmountInput(e.target.value)}
            style={{ ...inputStyle, width: '120px' }}
          />
        </Field>

        <Field label="Typ">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {TYPES.map(t => (
              <button
                key={t}
                onClick={() => handleTypeChange(t)}
                style={{
                  padding: '5px 11px',
                  borderRadius: '10px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'Space Grotesk, sans-serif',
                  background: type === t ? '#1A3A88' : '#14142A',
                  border: type === t ? '1px solid #4466CC' : '1px solid transparent',
                  color: type === t ? '#AABBFF' : '#6677AA',
                }}
              >
                {TYPE_LABELS[t]}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Miesiąc i rok">
          <div style={{ display: 'flex', gap: '8px' }}>
            <CustomSelect
              value={selectedMonth}
              onChange={setSelectedMonth}
              options={MONTH_NAMES.map((name, i) => ({ value: i, label: name }))}
              style={{ flex: 1 }}
            />
            <CustomSelect
              value={selectedYear}
              onChange={setSelectedYear}
              options={YEARS.map(y => ({ value: y, label: String(y) }))}
              style={{ width: '80px' }}
            />
          </div>
        </Field>

        <Field label="To był prezent?">
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setIsGift(false)}
              style={{ ...pillStyle, background: !isGift ? '#1A3A88' : '#14142A', border: !isGift ? '1px solid #4466CC' : '1px solid transparent', color: !isGift ? '#AABBFF' : '#6677AA' }}
            >
              nie
            </button>
            <button
              onClick={() => setIsGift(true)}
              style={{ ...pillStyle, background: isGift ? '#1A3A88' : '#14142A', border: isGift ? '1px solid #4466CC' : '1px solid transparent', color: isGift ? '#AABBFF' : '#6677AA' }}
            >
              tak (nie wliczaj do sumy)
            </button>
          </div>
        </Field>

        {showGamePicker && (
          <Field label="Powiąż z grą">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '120px', overflowY: 'auto' }}>
              {games.map(g => {
                const selected = linkedGameIds.includes(g.id)
                return (
                  <button
                    key={g.id}
                    onClick={() => toggleGame(g.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      background: selected ? '#1A3A88' : '#14142A',
                      border: selected ? '1px solid #4466CC' : '1px solid transparent',
                      borderRadius: '7px', padding: '6px 10px', cursor: 'pointer',
                      fontFamily: 'Space Grotesk, sans-serif', textAlign: 'left',
                    }}
                  >
                    <div style={{ width: '18px', height: '18px', borderRadius: '4px', background: g.coverColor, flexShrink: 0 }} />
                    <span style={{ color: selected ? '#AABBFF' : '#C8C8E8', fontSize: '12px' }}>{g.title}</span>
                  </button>
                )
              })}
            </div>
          </Field>
        )}

        {error && <span style={{ color: '#CC3333', fontSize: '11px' }}>{error}</span>}

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ ...btnStyle, background: 'transparent', border: '1px solid #2E2E52', color: '#6677AA' }}>
            Anuluj
          </button>
          <button onClick={handleSave} disabled={saving} style={{ ...btnStyle, background: '#003EBB', border: '1px solid #1A55DD', color: '#fff', opacity: saving ? 0.6 : 1 }}>
            {saving ? 'Zapisuję...' : 'Zapisz'}
          </button>
        </div>
      </div>
    </div>
  )
}

interface CustomSelectProps {
  value: number
  onChange: (val: number) => void
  options: { value: number; label: string }[]
  style?: React.CSSProperties
}

function CustomSelect({ value, onChange, options, style }: CustomSelectProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const selectedLabel = options.find(o => o.value === value)?.label ?? ''

  useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <div ref={ref} style={{ position: 'relative', ...style }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: '100%', background: '#10101C', border: open ? '1px solid #4466CC' : '1px solid #2244AA88', borderRadius: '6px', color: '#F0F0F8', fontSize: '13px', padding: '7px 10px', fontFamily: 'Space Grotesk, sans-serif', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedLabel}</span>
        <IconChevronDown size={12} style={{ color: '#6677AA', flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
      </button>
      {open && (
        <div style={{ position: 'absolute', bottom: 'calc(100% + 4px)', left: 0, right: 0, background: '#0F0F1E', border: '1px solid #2244AA88', borderRadius: '6px', zIndex: 30, maxHeight: '160px', overflowY: 'auto', padding: '4px' }}>
          {options.map(o => (
            <button
              key={o.value}
              onClick={() => { onChange(o.value); setOpen(false) }}
              style={{ width: '100%', background: o.value === value ? '#1A3A88' : 'transparent', border: 'none', borderRadius: '4px', color: o.value === value ? '#AABBFF' : '#C8C8E8', fontSize: '12px', padding: '6px 8px', textAlign: 'left', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif' }}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <label style={{ color: '#AABBDD', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</label>
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  background: '#10101C', border: '1px solid #2244AA88', borderRadius: '6px', color: '#F0F0F8', fontSize: '13px', padding: '7px 10px', outline: 'none', fontFamily: 'Space Grotesk, sans-serif', width: '100%', boxSizing: 'border-box',
}

const pillStyle: React.CSSProperties = {
  padding: '5px 11px', borderRadius: '10px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif',
}

const btnStyle: React.CSSProperties = {
  borderRadius: '8px', padding: '7px 14px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif',
}

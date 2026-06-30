import { useState } from 'react'
import { IconX } from '@tabler/icons-react'
import { HexColorPicker } from 'react-colorful'
import { addGame } from '../lib/firestore'

function getContrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#000000' : '#ffffff'
}

interface AddGameModalProps {
  onClose: () => void
}


function getInitials(title: string): string {
  const words = title.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return ''
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return words.slice(0, 3).map(w => w[0]).join('').toUpperCase()
}

export function AddGameModal({ onClose }: AddGameModalProps) {
  const [title, setTitle] = useState('')
  const [hoursInput, setHoursInput] = useState('')
  const [coverColor, setCoverColor] = useState('#003EBB')
  const [coverInitials, setCoverInitials] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleTitleChange = (val: string) => {
    setTitle(val)
    setCoverInitials(getInitials(val))
  }

  const parseHours = (input: string): number | null => {
    if (!input.trim()) return null
    if (input.includes(':')) {
      const [h, m] = input.split(':').map(Number)
      if (isNaN(h) || isNaN(m)) return undefined as unknown as null
      return h + m / 60
    }
    const n = parseFloat(input.replace(',', '.'))
    return isNaN(n) ? undefined as unknown as null : n
  }

  const handleSave = async () => {
    if (!title.trim()) { setError('Tytuł jest wymagany'); return }
    const hours = parseHours(hoursInput)
    if (hoursInput.trim() && hours === null) { setError('Nieprawidłowy format godzin (np. 1:30)'); return }
    setError('')
    setSaving(true)
    await addGame({
      title: title.trim(),
      hoursPlayed: hoursInput.trim() ? hours : null,
      coverColor,
      coverInitials: coverInitials || getInitials(title) || '?',
    })
    setSaving(false)
    onClose()
  }

  return (
    <div
      style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20 }}
      onClick={onClose}
    >
      <div
        style={{ background: '#0F0F1E', border: '1px solid #2233AA', borderRadius: '12px', padding: '20px', width: '280px', display: 'flex', flexDirection: 'column', gap: '14px' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: '#E8E8F8', fontSize: '14px', fontWeight: 600 }}>Dodaj grę</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#6677AA', cursor: 'pointer', display: 'flex', padding: 0 }}>
            <IconX size={16} />
          </button>
        </div>

        {/* Preview */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: coverColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: getContrastColor(coverColor), flexShrink: 0 }}>
            {coverInitials || '?'}
          </div>
          <span style={{ color: '#AABBDD', fontSize: '12px' }}>{title || 'Tytuł gry'}</span>
        </div>

        {/* Tytuł */}
        <Field label="Tytuł">
          <input
            autoFocus
            value={title}
            onChange={e => handleTitleChange(e.target.value)}
            placeholder="np. Mario Kart World"
            style={inputStyle}
          />
        </Field>

        {/* Inicjały */}
        <Field label="Inicjały na okładce">
          <input
            value={coverInitials}
            onChange={e => setCoverInitials(e.target.value.toUpperCase().slice(0, 3))}
            placeholder="np. MK"
            maxLength={3}
            style={{ ...inputStyle, width: '60px' }}
          />
        </Field>

        {/* Kolor */}
        <Field label="Kolor okładki">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <HexColorPicker color={coverColor} onChange={setCoverColor} style={{ width: '100%', height: '120px' }} />
            <input
              value={coverColor}
              onChange={e => setCoverColor(e.target.value)}
              maxLength={7}
              style={{ ...inputStyle, width: '100px', fontFamily: 'monospace' }}
            />
          </div>
        </Field>

        {/* Godziny */}
        <Field label="Godziny (opcjonalnie)">
          <input
            value={hoursInput}
            onChange={e => setHoursInput(e.target.value)}
            placeholder="np. 1:30"
            style={{ ...inputStyle, width: '80px' }}
          />
        </Field>

        {error && <span style={{ color: '#CC3333', fontSize: '11px' }}>{error}</span>}

        {/* Przyciski */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ ...btnStyle, background: 'transparent', border: '1px solid #2E2E52', color: '#6677AA' }}>
            Anuluj
          </button>
          <button onClick={handleSave} disabled={saving} style={{ ...btnStyle, background: '#003EBB', border: '1px solid #1A55DD', color: '#fff', opacity: saving ? 0.6 : 1 }}>
            {saving ? 'Zapisuję...' : 'Dodaj'}
          </button>
        </div>
      </div>
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
  background: '#10101C',
  border: '1px solid #2244AA88',
  borderRadius: '6px',
  color: '#F0F0F8',
  fontSize: '13px',
  padding: '7px 10px',
  outline: 'none',
  fontFamily: 'Space Grotesk, sans-serif',
  width: '100%',
  boxSizing: 'border-box',
}

const btnStyle: React.CSSProperties = {
  borderRadius: '8px',
  padding: '7px 14px',
  fontSize: '12px',
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'Space Grotesk, sans-serif',
}

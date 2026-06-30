# SwitchCalc — plan projektu

## Cel

Osobista aplikacja webowa do liczenia kosztu godziny grania na Nintendo Switch 2.
Pokazuje statystyki właścicielki — jeden użytkownik, logowanie Google (Firebase).

---

## Stack

- React + Vite + TypeScript
- Tailwind CSS v4 (`@tailwindcss/vite`) — **ważna uwaga poniżej**
- `@tabler/icons-react` — ikony
- `react-colorful` — color picker
- Firebase (Authentication + Firestore)
- Hosting: Netlify

### ⚠️ Uwaga — Tailwind v4

Klasy z dziesiętnyymi wartościami sugerowane przez VS Code (np. `w-15.5`, `px-2.25`, `gap-1.25`) **nie generują się poprawnie**. Zamiast nich używać:
- `style={}` inline styles dla precyzyjnych wartości pikselowych
- standardowych Tailwind klas bez dziesiętnych (np. `gap-3`, `py-2`, `mt-4`)

Spacing-sensitive elementy (HeroStat, FAB, listy) działają w całości na inline styles — trzymać ten wzorzec.

---

## Struktura plików (src/)

```
src/
  components/
    LeftJoyCon.tsx          ✅ gotowe
    RightJoyCon.tsx         ✅ gotowe
    TopBar.tsx              ✅ gotowe (logowanie Google, wylogowanie)
    HeroStat.tsx            ✅ gotowe (koszt/h, suma wydatków, godziny hh:mm)
    GamesList.tsx           ✅ gotowe (3 sekcje: biblioteka / nierozpoczęte, klik = edycja)
    ExpensesList.tsx        ✅ gotowe (sortowanie malejące, klik = edycja)
    FAB.tsx                 ✅ gotowe (widoczny tylko dla właścicielki)
    AddGameModal.tsx        ✅ gotowe (color picker react-colorful)
    AddExpenseModal.tsx     ✅ gotowe (custom dropdowns, typ/data/prezent)
    EditGameModal.tsx       ✅ gotowe (tytuł, inicjały, kolor, godziny)
    EditExpenseModal.tsx    ✅ gotowe (wszystkie pola)
  lib/
    firebase.ts             ✅ gotowe (inicjalizacja z .env)
    firestore.ts            ✅ gotowe (CRUD + real-time listeners)
  App.tsx                   ✅ gotowe (auth, real-time data, routing, modale)
  index.css                 ✅ Tailwind v4 + Space Grotesk + scrollbar + FAB animacje
main.tsx
```

---

## Model danych Firestore

**Kolekcja `games`:**
```
id, title, hoursPlayed (number | null), coverColor, coverInitials, createdAt
```

**Kolekcja `expenses`:**
```
id, title, amount (number, obsługuje ułamki), type ('console'|'game'|'bundle'|'accessory'|'gift'), date, isGift (boolean)
```

Logika:
- `Wydano łącznie` = suma `amount` gdzie `isGift === false`
- `Zagrane godziny` = suma `hoursPlayed` (wyświetlane jako `hh:mm`)
- `Koszt/h` = Wydano / Zagrane godziny
- Gry: `hoursPlayed > 0` → biblioteka, `hoursPlayed === 0 || null` → nierozpoczęte

---

## Bezpieczeństwo

Reguły Firestore: wszyscy mogą czytać, tylko właścicielka (`VITE_OWNER_EMAIL`) może pisać.
Email właścicielki porównywany przez `request.auth.token.email` w Firestore i `import.meta.env.VITE_OWNER_EMAIL` w aplikacji.

---

## Zmienne środowiskowe (.env)

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_FIREBASE_MEASUREMENT_ID
VITE_OWNER_EMAIL
```

Wszystkie muszą być ustawione też w Netlify (Site settings → Environment variables).

---

## Etap obecny — Deploy

1. Ustawić zmienne środowiskowe w Netlify
2. Połączyć repo GitHub z Netlify i zdeployować

---

## Potencjalne przyszłe dodatki

- Usuwanie gier i wydatków
- Łączenie gier z pakietów/wydatków z kolekcją gier

---

## Gałęzie git

- `main` — stabilna, produkcyjna
- `feat/firebase` — aktywna gałąź (gotowa do merge)

---

## Kluczowe pliki referencyjne

- `brief.md` — pełna specyfikacja projektu
- `design-prototyp.html` — docelowy wygląd (HTML/CSS mockup)

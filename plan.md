# SwitchCalc — plan projektu

## Cel

Osobista aplikacja webowa do liczenia kosztu godziny grania na Nintendo Switch 2.
Pokazuje statystyki właścicielki — jeden użytkownik, logowanie Google (Firebase).

---

## Stack

- React + Vite + TypeScript
- Tailwind CSS v4 (`@tailwindcss/vite`) — **ważna uwaga poniżej**
- `@tabler/icons-react` — ikony
- Firebase (Authentication + Firestore) — zainstalowane, jeszcze niepodłączone
- Hosting: Netlify (jeszcze nie skonfigurowane)

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
    LeftJoyCon.tsx     ✅ gotowe (inline styles)
    RightJoyCon.tsx    ✅ gotowe (inline styles)
    TopBar.tsx         ✅ gotowe (inline styles)
    HeroStat.tsx       ✅ gotowe (inline styles, akcenty kolorystyczne)
    GamesList.tsx      ✅ gotowe (scroll, format hh:mm, klik w rząd = edycja)
    ExpensesList.tsx   ✅ gotowe (scroll, tagi, formatowanie kwot)
    FAB.tsx            ✅ gotowe (animacje otwarcia/zamknięcia, slide-in/out)
  App.tsx              ✅ mock data, routing tabs, obliczenia
  index.css            ✅ Tailwind v4 + Space Grotesk + scrollbar + FAB animacje
main.tsx
```

---

## Etap obecny — UI (feat/ui-foundation)

### Co działa

- **Console Frame** — lewy Joy-Con czerwony + ekran + prawy Joy-Con niebieski, `height: 700px`
- **Joy-Cony** — pełna wysokość z gradientem, przyciski z odstępami, ukryte na mobile (`hidden md:flex`)
- **TopBar** — zakładki Gry/Wydatki z aktywnym podkreśleniem i kropką (po prawej dla Gry, po lewej dla Wydatki), ikony wifi/bateria/login
- **HeroStat** — karta z niebieskim borderem; koszt/h biały duży, labele `#AABBDD`, liczby statystyk `#C8C8E8`; separator poziomy niebieski
- **GamesList** — lista z awatarami, separatory „Biblioteka gier" / „niezliczone", godziny w formacie `hh:mm`, klik w rząd otwiera inline edit, scroll wewnętrzny
- **ExpensesList** — lista wydatków z datą, badge z typem (padding, niebieski kolor), kwota z przyciemnionym ` PLN`, wyszarzenie prezentów, scroll wewnętrzny
- **FAB** — niebieski `+` / czerwony `X`, menu „Dodaj grę" / „Dodaj wydatek" w niebieskim stylu; animacje: slide-in ze staggerem przy otwieraniu, synchroniczny slide-out przy zamykaniu, animowana ikona X
- **Scrollbar** — globalny, subtelny (3px, kolor dopasowany do palety)
- **Obliczenia** — koszt/h, suma wydatków (bez prezentów), suma godzin z mock data; kwoty obsługują ułamki

### Pozostałe do zrobienia przed merge → main

1. **FAB** — widoczny tylko dla zalogowanej właścicielki (po podłączeniu Firebase)
2. **Przycisk logowania** w TopBar — dekoracyjny, do podłączenia do Firebase Auth
3. Usunąć `src/components/.keep` (plik stworzony przez pomyłkę)

---

## Kolejne etapy (po UI)

### Etap 2 — Firebase + dane (osobny branch, np. `feat/firebase`)

1. Stworzyć projekt Firebase (jeśli nie istnieje) i skopiować config do pliku `.env`
2. Plik `src/lib/firebase.ts` — inicjalizacja Firebase
3. Plik `src/lib/firestore.ts` — funkcje CRUD:
   - `getGames()`, `addGame()`, `updateGame()`, `deleteGame()`
   - `getExpenses()`, `addExpense()`, `updateExpense()`, `deleteExpense()`
4. Zastąpić mock data w `App.tsx` danymi z Firestore (real-time listeners `onSnapshot`)
5. Logowanie Google (`signInWithPopup`) podłączone do przycisku w TopBar
6. Context lub state dla `currentUser` — warunkowe pokazywanie FAB i edycji

### Model danych Firestore

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
- `Zagrane godziny` = suma `hoursPlayed` gdzie `hoursPlayed !== null`
- `Koszt/h` = Wydano / Zagrane godziny
- Godziny przechowywane jako liczba dziesiętna (np. 1.5 = 1:30), wyświetlane jako `hh:mm`

### Etap 3 — Formularze CRUD

Po kliknięciu FAB → „Dodaj grę" / „Dodaj wydatek":
- Modal lub panel z formularzem
- Walidacja: tytuł wymagany, kwota ≥ 0, kwota przyjmuje przecinek dziesiętny
- Zapis do Firestore, real-time odświeżenie listy

Edycja istniejących wpisów:
- Gry: inline edit godzin (format `hh:mm`) po kliknięciu w rząd. Dodać edycję tytułu/koloru (modal).
- Wydatki: klik w rząd → modal z edycją.

### Etap 4 — Deploy

- Konfiguracja Netlify (podłączenie repo GitHub)
- Zmienne środowiskowe Firebase w Netlify
- Reguły Firestore (tylko właścicielka może pisać, wszyscy mogą czytać)

---

## Gałęzie git

- `main` — stabilna baza (aktualnie: init + brief + design-prototyp.html)
- `feat/ui-foundation` — **aktywna gałąź** — cała praca nad UI (prawie gotowa do merge)

---

## Kluczowe pliki referencyjne

- `brief.md` — pełna specyfikacja projektu
- `design-prototyp.html` — docelowy wygląd (HTML/CSS mockup) — otworzyć w przeglądarce żeby porównać

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

Joy-Cony i TopBar już działają na inline styles — trzymać ten wzorzec.

---

## Struktura plików (src/)

```
src/
  components/
    LeftJoyCon.tsx     ✅ gotowe (inline styles)
    RightJoyCon.tsx    ✅ gotowe (inline styles)
    TopBar.tsx         ✅ gotowe (inline styles)
    HeroStat.tsx       ✅ struktura gotowa
    GamesList.tsx      ✅ struktura + inline edit UI
    ExpensesList.tsx   ✅ struktura
    FAB.tsx            ✅ animacja otwarcia/zamknięcia
  App.tsx              ✅ mock data, routing tabs, obliczenia
  index.css            ✅ Tailwind v4 + Space Grotesk font
main.tsx
```

---

## Etap obecny — UI (feat/ui-foundation)

### Co działa

- Console Frame (lewy Joy-Con czerwony + ekran + prawy Joy-Con niebieski)
- Joy-Cony: pełna wysokość z gradientem, przyciski (minus/plus, analog stick, D-pad/ABXY) z odstępami
- TopBar: nawigacja Gry/Wydatki po lewej z aktywnym podkreśleniem na borderze, ikonki wifi/bateria/login po prawej
- HeroStat: karta z kosztem/h, wydano łącznie, zagrane godziny
- GamesList: lista gier z awatarami, separatory „Biblioteka gier" / „Niezliczone", inline edit godzin (hover → ołówek → pole + zapisz/anuluj)
- ExpensesList: lista wydatków z datą, badge typem, kwotą, wyszarzenie dla prezentów
- FAB: niebieski przycisk + który rozwija „Dodaj grę" i „Dodaj wydatek"
- Responsywność: Joy-Cony ukryte na mobile (`hidden md:flex`)
- Obliczenia: koszt/h, suma wydatków, suma godzin liczone z mock data

### Do poprawienia w UI (zanim merge feat/ui-foundation → main)

1. **Padding ekranu** — zawartość screena (HeroStat, listy) ma za mały padding od krawędzi przy szerokim layoucie (1280px). Padding zmieniany na 20px inline, ale do weryfikacji po ostatnich zmianach.
2. **SepLabel w GamesList** — separator „Biblioteka gier" / „Niezliczone" używa Tailwind klas które mogą nie działać. Zamienić na inline styles.
3. **FAB** — na razie zawsze widoczny. Docelowo: widoczny tylko dla zalogowanej właścicielki.
4. **Przycisk logowania** w TopBar — na razie dekoracyjny. Podłączyć do Firebase Auth.
5. Ogólny polish i dopasowanie do `design-prototyp.html`.

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
id, title, amount, type ('console'|'game'|'bundle'|'accessory'|'gift'), date, isGift (boolean)
```

Logika:
- `Wydano łącznie` = suma `amount` gdzie `isGift === false`
- `Zagrane godziny` = suma `hoursPlayed` gdzie `hoursPlayed !== null`
- `Koszt/h` = Wydano / Zagrane godziny

### Etap 3 — Formularze CRUD

Po kliknięciu FAB → „Dodaj grę" / „Dodaj wydatek":
- Modal lub panel z formularzem
- Walidacja: tytuł wymagany, kwota ≥ 0 itd.
- Zapis do Firestore, real-time odświeżenie listy

Edycja istniejących wpisów:
- Gry: inline edit godzin już jest. Dodać edycję tytułu/koloru (modal).
- Wydatki: ikona edycji na hover → modal z edycją.

### Etap 4 — Deploy

- Konfiguracja Netlify (podłączenie repo GitHub)
- Zmienne środowiskowe Firebase w Netlify
- Reguły Firestore (tylko właścicielka może pisać, wszyscy mogą czytać)

---

## Gałęzie git

- `main` — stabilna baza (aktualnie: init + brief + design-prototyp.html)
- `feat/ui-foundation` — **aktywna gałąź** — cała praca nad UI (gotowa do merge po drobnych poprawkach)

---

## Kluczowe pliki referencyjne

- `brief.md` — pełna specyfikacja projektu
- `design-prototyp.html` — docelowy wygląd (HTML/CSS mockup) — otworzyć w przeglądarce żeby porównać

# SwitchCalc — brief projektu

## Cel

Osobista aplikacja webowa do liczenia kosztu godziny grania na Nintendo Switch 2. Pokazuje statystyki jednej osoby (właścicielki) — to NIE jest multi-user platforma, nikt inny nie zakłada kont.

## Stack technologiczny

- React + Vite + TypeScript + Tailwind CSS
- Firebase (Authentication + Firestore) — jeden właściciel, logowanie Google
- Hosting: Netlify

## Model dostępu

- **Niezalogowany użytkownik**: widzi wszystkie dane (read-only) — to jest publiczny widok statystyk właścicielki. Brak przycisków edycji, brak FAB.
- **Zalogowana właścicielka**: pełna edycja — dodawanie/edycja gier, wydatków, godzin.
- Nie ma rejestracji dla innych użytkowników. Logowanie tylko dla jednego konta (właścicielki).

## Model danych (Firestore)

### Kolekcja `games`

```
{
  id: string
  title: string
  hoursPlayed: number | null   // null = "niezliczone" (np. Minecraft, Pokopia)
  coverColor: string           // kolor/inicjały do awatara gry
  expenseId: string | null     // opcjonalne powiązanie z wydatkiem (patrz niżej)
  createdAt: timestamp
}
```

### Kolekcja `expenses`

```
{
  id: string
  title: string                // np. "Nintendo Switch 2", "Pakiet 3 gier"
  amount: number                // w PLN, może być 0 (prezent)
  type: "console" | "game" | "bundle" | "accessory" | "gift"
  date: timestamp
  linkedGameIds: string[]       // 0, 1 lub więcej gier (pakiet = wiele gier do jednego wydatku)
  isGift: boolean                // true = nie wliczane do sumy wydatków
}
```

**Ważne:** gry i wydatki są od siebie niezależne. Gra może nie mieć żadnego powiązanego wydatku (był w pakiecie z konsolą — koszt już wliczony w wydatek "konsola"), a wydatek może nie być grą (np. sama konsola, akcesoria).

## Logika obliczeń

- `Wydano łącznie` = suma `amount` ze wszystkich `expenses` gdzie `isGift === false`
- `Zagrane godziny` = suma `hoursPlayed` ze wszystkich `games` gdzie `hoursPlayed !== null`
- `Koszt / godzina` = `Wydano łącznie / Zagrane godziny`
- Gry z `hoursPlayed === null` (np. Pokopia, Minecraft) pokazują `?` zamiast liczby godzin, są wylistowane w osobnej sekcji "niezliczone", i NIE wchodzą do żadnego z powyższych wyliczeń godzinowych (ale ich koszt, jeśli miały wydatek, nadal wlicza się do "Wydano łącznie").

## Design — "Console Frame"

Cały interfejs na dużych ekranach (desktop/laptop) wygląda jak fizyczny Nintendo Switch 2 widziany od przodu:

- **Lewy Joy-Con** (czerwony gradient `#C20030` → `#960020`): od góry — przycisk minus (22×22 kontener, pigułka 22×6), analog stick (26×26 koło), D-pad (kontener 44×44, cztery kółka 14×14 w układzie góra/dół/lewo/prawo)
- **Prawy Joy-Con** (niebieski gradient `#0038CC` → `#002299`): od góry — przycisk plus (22×22 kontener, krzyż), przyciski ABXY (kontener 44×44 identyczny jak D-pad — X niebieski góra, B żółty dół, Y zielony lewo, A czerwony prawo), analog stick
- Oba Joy-Cony mają identyczną geometrię kontenerów (44×44 dla D-pad/ABXY) — różnią się tylko kolorem.
- **Ekran** (środek, tło `#07070E`) zawiera całą treść aplikacji.

### Top bar (wewnątrz ekranu)

- Po lewej: nawigacja tekst+ikona "Gry" / "Wydatki", aktywna zakładka ma podkreślenie + kropkę, kolor `#EEEEF8`; nieaktywna `#444A72`
- Po prawej: ikony wifi i baterii (dekoracyjne, kolor `#3A3A5A`), separator, kółko z ikoną użytkownika (logowanie) `#444A72`

### Hero stat (góra ekranu, poniżej top bar)

Karta z białą półprzezroczystą obramówką (`rgba(255,255,255,0.16)`), tło `#0A0A12`:

- Duży napis "Koszt grania przez godzinę" — 40px, bold, kolor `#F0F0F8`, jednostka PLN/h obok mniejszą czcionką
- Pod spodem, oddzielone cienką linią: dwie kolumny "Wydano łącznie" i "Zagrane godziny"
  To jest najważniejszy element wizualny — pierwsze co rzuca się w oczy.

### Lista gier

Każdy wiersz: kwadratowy awatar z inicjałami gry, tytuł, liczba godzin + ołówek (pojawia się po hover, otwiera inline edit z polem liczbowym + przyciski zapisz/anuluj). Gry z nieznanymi godzinami w osobnej sekcji "niezliczone" z `?` zamiast liczby.

### Lista wydatków

Wiersz: tytuł, data, badge z typem (konsola/gra/pakiet/gratis), kwota. Prezenty wyszarzone (opacity ~0.45).

### FAB (floating action button)

Prawy dolny róg ekranu. Niebieskie kółko z `+`, po kliknięciu rozwija dwie opcje: "Dodaj grę" i "Dodaj wydatek". Widoczny tylko dla zalogowanej właścicielki.

### Wersja mobilna

Joy-Cony znikają całkowicie — zostaje tylko "ekran" (top bar, hero stat, listy, FAB) w pełnej szerokości. Brak miejsca na dekoracje, liczy się czytelność.

### Paleta kolorów

- Tło ekranu: `#07070E`, karty: `#0D0D1A` / `#0A0A12`
- Tekst główny: `#E8E8F8` / `#F0F0F8`, tekst pomocniczy: `#6677AA` / `#8899BB` (zadbać o kontrast — wcześniejsze wersje miały za ciemne szarości)
- Akcent czerwony (lewy Joy-Con): `#C20030`
- Akcent niebieski (prawy Joy-Con): `#0038CC`
- Font: Space Grotesk

## Funkcje do zaimplementowania (MVP)

1. Logowanie właścicielki (Firebase Auth — google)
2. Widok publiczny (niezalogowany) — read-only, te same dane
3. CRUD gier (tytuł, godziny lub "nieznane", powiązanie z wydatkiem)
4. CRUD wydatków (tytuł, kwota, typ, data, opcjonalne powiązanie z grami, flaga "prezent")
5. Automatyczne przeliczanie hero stat po każdej zmianie
6. Responsywność: Console Frame na desktopie, uproszczony widok na mobile
7. Routing/tabs: Gry / Wydatki

## Co NIE wchodzi w zakres

- Rejestracja innych użytkowników
- "Sesje grania" (tylko zbiorcza liczba godzin per gra, edytowana ręcznie)
- Płatności, integracje zewnętrzne

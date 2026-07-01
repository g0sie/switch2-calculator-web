# SwitchCalc

Osobista aplikacja webowa do liczenia kosztu godziny grania na Nintendo Switch 2.

**[switch-calculator.netlify.app](https://switch-calculator.netlify.app/)**

---

## Co robi

Śledzi wydatki na konsolę i gry oraz czas grania, żeby wyliczyć ile kosztuje jedna godzina zabawy. Jeden użytkownik, logowanie Google.

## Stack

React + TypeScript + Vite · Tailwind CSS v4 · Firebase (Auth + Firestore) · Netlify

---

## Etapy

- [x] **UI foundation** — console frame, HeroStat, listy gier i wydatków, FAB z animacjami
- [x] **Firebase** — auth Google (tylko właścicielka), Firestore real-time sync, reguły bezpieczeństwa
- [x] **Formularze CRUD** — dodawanie i edycja gier/wydatków przez modal, color picker
- [x] **Deploy** — Netlify + zmienne środowiskowe
- [x] **Koszt per gra** — powiązanie wydatków z grami, obliczanie PLN/h per tytuł (podział kosztu dla pakietów), sortowanie biblioteki po PLN/h
- [ ] **Responsywność (RWD)** — działa desktop, mobile wymaga poprawek

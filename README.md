# SwitchCalc

Osobista aplikacja webowa do liczenia kosztu godziny grania na Nintendo Switch 2.

**[switch-calculator.netlify.app](https://switch-calculator.netlify.app/)**

---

## Co robi

Śledzi wydatki na konsolę i gry oraz czas grania, żeby wyliczyć ile kosztuje jedna godzina zabawy. Jeden użytkownik, logowanie Google.

## Stack

React + TypeScript + Vite · Tailwind CSS v4 · Firebase · Netlify

---

## Etapy

- [x] **UI foundation** — console frame, HeroStat, listy gier i wydatków, FAB z animacjami
- [ ] **Firebase** — auth Google, Firestore (gry + wydatki), real-time sync ← _tu jesteśmy_
- [ ] **Formularze CRUD** — dodawanie i edycja gier/wydatków przez modal
- [ ] **Deploy** — Netlify + zmienne środowiskowe + reguły Firestore

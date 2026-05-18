# IDLE HABITS

> A gamified habit tracker with RPG-style progression, a reward store, and persistent local state.

![Version](https://img.shields.io/badge/version-0.1.0-D4AF37?style=flat-square)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-0055FF?style=flat-square&logo=framer&logoColor=white)

---

## Features

- **Habit tracking** — daily, weekly, and monthly habits with 5 difficulty tiers
- **RPG progression** — earn XP and level up by completing habits
- **Coin rewards** — each habit completion grants coins based on difficulty
- **Reward store** — spend coins on custom real-life rewards (e.g. movie night, day off)
- **Store management** — create, edit, and delete your own rewards via the config panel
- **Monthly stock resets** — store stock resets automatically on the 1st of each month
- **Persistent state** — all data saved to `localStorage`; no backend required

---

## Tech Stack

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Sass](https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=sass&logoColor=white)

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Architecture

```
src/
├── features/
│   ├── habits/          # Habit domain, logic, storage, hook
│   ├── player/          # Player state, level calculation, context
│   └── store/           # Reward store domain, context, components
├── components/
│   ├── habits/          # HabitForm, HabitList, HabitItem
│   └── player/          # PlayerSettingsPanel
├── pages/
│   └── MainPage.tsx     # Main view composition
└── styles/
    └── retro-theme.css  # Global design system (CSS variables)
```

All state is managed via React Context + `localStorage`. No external state library required.

---

## Difficulty Tiers

| Tier        | XP  | Coins |
|-------------|-----|-------|
| Easy        | 15  | 5     |
| Easy-Medium | 30  | 10    |
| Medium      | 60  | 15    |
| Medium-Hard | 125 | 20    |
| Hard        | 250 | 25    |

---

*Built with React 19 + TypeScript + Vite*

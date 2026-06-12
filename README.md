# Chess Analysis

A chess game analyzer built with Next.js and Stockfish 18. Load games from Chess.com or Lichess, get deep engine analysis, move-by-move classifications, and an interactive evaluation graph — all running locally in the browser.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)
![Stockfish](https://img.shields.io/badge/Stockfish-18-green)

## Features

- **Engine analysis** — Stockfish 18 runs as a Web Worker (WASM).
- **Game import** — Load your latest games directly from Chess.com or Lichess by username
- **Move classification** — Every move is rated: Best, Excellent, Good, Inaccuracy, Mistake, Blunder, Forced, or Opening.
- **Evaluation graph** — Interactive SVG graph showing advantage swing throughout the game.
- **Custom moves** — Make your own moves on top of any loaded game to explore alternatives; the engine analyses them in real time
- **Opening recognition** — Identifies the opening and variation name from a built-in ECO database
- **Adjustable depth** — Engine search depth is configurable (default 12, up to 20)
- **Dark/light theme** — System-aware with manual toggle
- **Responsive** — Works on both desktop and mobile

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 |
| Language | TypeScript |
| Styling | Tailwind CSS |
| State | Redux Toolkit + redux-persist |
| Chess logic | chess.js |
| Board UI | react-chessboard |
| Engine | Stockfish 18 |
| UI components | custom & shadcn |
| Icons | fontawesome |

## Getting Started

### Prerequisites

- Node.js 20.9+
- Stockfish 18 WASM engine files in `public/engines/`

The engine files are not included in the repository due to size. Download them from the [Stockfish releases](https://github.com/official-stockfish/Stockfish/releases) and place them at:

```
public/
  engines/
    stockfish-18.js
    stockfish-18.wasm
    stockfish-18-single.js
    stockfish-18-single.wasm
    stockfish-18-lite.js
    stockfish-18-lite.wasm
    stockfish-18-lite-single.js
    stockfish-18-lite-single.wasm
    stockfish-18-asm.js        ← fallback for browsers without WASM
```

### Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for production

```bash
npm run build
npm start
```

## Third-Party Notices

See [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md) for attributions and licenses for icons, the Stockfish engine, and other bundled assets.


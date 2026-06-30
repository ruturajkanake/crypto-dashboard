# Crypto Dashboard

A Remix + React cryptocurrency dashboard that displays live exchange rates from the [Coinbase API](https://docs.cdp.coinbase.com/exchange/rest-api/requests), with filtering, drag-and-drop reordering, and optional auto-refresh.

## Features

- Responsive card layout for 12 cryptocurrencies (BTC, ETH, SOL, and more)
- USD and BTC spot prices fetched on page load
- Manual refresh and optional 60-second auto-refresh
- Drag-and-drop card reordering with order persisted in `localStorage`
- Filter by cryptocurrency name or symbol
- Light/dark theme toggle
- Loading and error states
- Unit tests for core list utilities

## Prerequisites

- Node.js 20+
- npm

## Setup

```bash
git clone https://github.com/ruturajkanake/crypto-dashboard.git
cd crypto-dashboard
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run typecheck` | Run TypeScript checks |
| `npm test` | Run unit tests |

## Architecture & Decisions

### Data fetching

Exchange rates are loaded in a Remix `loader` on the server using Coinbase spot price endpoints (`/v2/prices/{PAIR}/spot`). This keeps API calls off the client, improves first paint with SSR, and centralizes error handling.

Rates are fetched in parallel for all configured symbols. BTC’s BTC rate is shown as `1 BTC` instead of calling the API for a redundant pair.

### Client state

- **Order**: Managed with `@dnd-kit` and persisted to `localStorage` so reordering survives refreshes.
- **Filter**: Local React state; filtering is applied after ordering so drag order stays stable.
- **Theme / auto-refresh**: Stored in `localStorage` and applied on the client.

### Styling

Plain CSS with CSS variables powers the light/dark theme without adding a component library. Layout uses a responsive CSS grid (`auto-fill`, `minmax(260px, 1fr)`).

### Tradeoffs

- **Coinbase spot API** is public and simple, but rate limits apply; auto-refresh defaults to 60s to reduce load.
- **No authentication** — not required for this exercise; all data is public market data.
- **Remix v2 + Vite** — current maintenance-mode Remix stack, chosen to match the exercise requirements and provide idiomatic loaders/actions.

## Project Structure

```
app/
├── components/     # UI components (cards, controls, theme toggle)
├── hooks/          # Client hooks (order persistence, theme)
├── lib/            # Shared utilities and Coinbase server fetcher
└── routes/         # Remix routes
```

## Testing

Unit tests cover filtering, ordering, and merge logic in `app/lib/crypto.test.ts`.

```bash
npm test
```

## Error Handling

- Loader failures return a 502/503 response with a user-friendly message.
- A global `ErrorBoundary` in `app/root.tsx` renders a recovery screen.
- Empty filter results show an inline empty state instead of a blank page.

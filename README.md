# NPTEL Score Checker

A fast, clean web app to calculate your NPTEL assignment component accurately using top-score selection rules for 4, 8, and 12 week courses.

## Demo Screenshots

<p align="center">
  <img src="docs/screenshots/home-demo.png" alt="NPTEL Score Checker - Home" width="880" />
</p>

<p align="center">
  <img src="docs/screenshots/history-demo.png" alt="NPTEL Score Checker - History" width="880" />
</p>

## Features

- Supports all common NPTEL assignment patterns:
  - 4-week course: best 3 of 4
  - 8-week course: best 6 of 8
  - 12-week course: best 8 of 12
- Instant assignment score calculation (out of 25)
- Pass/fail indicator based on assignment threshold
- Save calculations to local history
- Re-open and review saved attempts
- Export saved records to CSV
- Responsive UI with smooth interactions

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Wouter
- Express (production static server)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
npm install
```

### Run in Development

```bash
npm run dev
```

Open the app at the local URL printed in your terminal.

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm run start
```

## How Calculation Works

The assignment component is computed out of **25**.

- 4-week: best 3 assignments are selected
- 8-week: best 6 assignments are selected
- 12-week: best 8 assignments are selected

Formula:

```text
Assignment Score = (Sum of selected best scores / Maximum possible selected score) × 25
```

Example (8-week): if best 6 assignment scores sum to 510,

```text
(510 / 600) × 25 = 21.25
```

## Project Structure

```text
client/                 Frontend app (React + Vite)
server/                 Express server for production static serving
shared/                 Shared constants/utilities
docs/screenshots/       README demo images
```

## Available Scripts

- `npm run dev` - Start Vite dev server
- `npm run build` - Build frontend and bundle server
- `npm run start` - Start production server
- `npm run preview` - Preview production frontend build
- `npm run check` - TypeScript type check
- `npm run format` - Format codebase with Prettier

## Notes

- History is stored in browser local storage.
- This tool is for planning/reference; always verify official course rules on your NPTEL course page.

## License

MIT

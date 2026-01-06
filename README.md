# ReceiptFlash

AI-powered bookkeeping assistant that lets you classify expenses by flipping through receipts like flashcards.

## Overview

ReceiptFlash transforms tedious bookkeeping into a quick, game-like experience:

1. **Upload** - Drop all your receipts at once (photos, PDFs, bank statements)
2. **Classify** - Flip through them like flashcards, speaking or typing what each one is
3. **Sync** - AI handles the accounting details and posts to QuickBooks automatically

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: PostgreSQL with Prisma ORM
- **Font**: Inter (Google Fonts)

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd receiptflash
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your database URL and API keys.

4. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
receiptflash/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with Inter font
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles & design tokens
├── components/             # Reusable UI components
│   └── ui/                 # shadcn/ui components
├── lib/                    # Utility functions
│   └── utils.ts            # cn() helper for classNames
├── prisma/                 # Database schema
│   └── schema.prisma       # Prisma schema definition
└── docs/                   # Documentation
    └── SPECIFICATION.md    # Full app specification
```

## Design System

- **Primary Color**: Navy Blue (`#1e3a5f`)
- **Background**: White with subtle grays
- **Typography**: Inter font family
- **Style**: Minimal, clean, inspired by Linear and Notion

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Documentation

See [docs/SPECIFICATION.md](docs/SPECIFICATION.md) for the complete application specification.

## License

Private - All rights reserved.

# ReceiptFlash

**Project manual:** [Read the manual](docs/MANUAL.md) · [Release notes](docs/RELEASES.md) · [Contributor instructions](AGENTS.md)

A proposed AI-powered receipt-classification app for small business bookkeeping.

**Current status: specification only.** This repository has no application source or package manifest yet. The features and stack below describe the intended product.

## What is this?

ReceiptFlash turns receipt chaos into organized bookkeeping using a flashcard-style interface. Upload receipts, flip through them, speak or type what each expense is, and sync to QuickBooks.

## Proposed Tech Stack

- Next.js 14 (React framework)
- TypeScript
- Tailwind CSS
- shadcn/ui components
- PostgreSQL + Prisma
- Google Cloud Vision (OCR)
- OpenAI API (classification)
- QuickBooks Online API

## Getting Started

See the full specification in `docs/SPECIFICATION.md`

## Development

Start with [the specification](docs/SPECIFICATION.md) and [the project manual](docs/MANUAL.md). A runnable scaffold, installation command and development server still need to be implemented. There is no working `npm install` or `npm run dev` workflow in this repository yet.

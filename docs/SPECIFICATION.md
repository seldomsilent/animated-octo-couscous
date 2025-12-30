# ReceiptFlash: AI Bookkeeping Assistant
## Complete Application Specification (Plain Language)

**Version:** 1.0  
**Created:** December 30, 2025  
**Author:** Rex Putney / Claude  
**Purpose:** A complete specification document for building an AI-powered bookkeeping application that processes receipts through a flashcard-style interface with voice/text input.

---

# PART 1: THE BIG PICTURE

## What This App Does

ReceiptFlash lets small business owners classify expenses by flipping through receipts like flashcards and speaking (or typing) what each one is. The AI handles the accounting details — tax codes, account categories, posting to QuickBooks — while the human just describes the purchase in plain language.

## The Core Problem We're Solving

Bookkeeping is simple decision-making trapped in terrible software. Business owners know instantly that a receipt from Lordco is vehicle parts, but they spend 2 minutes clicking through dropdowns and menus to record it. Multiply that by hundreds of transactions per month and bookkeeping becomes a hated chore that gets postponed.

## The Solution

1. Upload all your receipts at once (photos, PDFs, bank statements)
2. Flip through them like flashcards
3. Say or type what each one is in plain language
4. AI translates your words into proper accounting entries
5. Everything posts to QuickBooks automatically

## Who This Is For

- Small business owners who do their own bookkeeping
- Owner-operators who collect receipts but hate processing them
- Businesses using QuickBooks Online (initially)
- People who would rather talk than click

---

# PART 2: USER EXPERIENCE FLOW

## Step 1: Upload

### What the User Sees
A simple upload screen with a large drop zone. "Drop your receipts here or click to upload."

### What They Can Upload
- Photos of receipts (JPG, PNG, HEIC)
- PDF receipts or statements
- Screenshots
- Bank statement exports (CSV, QBO format)
- Multiple files at once (drag a whole folder)

### What Happens Behind the Scenes
1. Each file is stored securely
2. Images and PDFs are sent through OCR (optical character recognition) to extract text
3. The AI does a first-pass analysis to identify:
   - Vendor name
   - Date
   - Total amount
   - Tax amounts (if visible)
   - Any line items
4. Bank statement files are parsed to extract individual transactions
5. All items go into the "To Review" queue

### The User Experience
Upload happens in the background. User sees a progress bar: "Processing 47 receipts..." Then: "Ready! 47 items to review."

---

## Step 2: The Flashcard Game

### The Main Screen Layout

```
┌─────────────────────────────────────────────────────────┐
│  [Receipt Image]                                        │
│                                                         │
│  Lordco Auto Parts                                      │
│  $247.32                                                │
│  Dec 15, 2025                                           │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  AI: "Lordco Auto Parts — what was this purchase for?"  │
│                                                         │
│  [Voice Input Button]  [Text Input Field]               │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  Progress: ████████░░░░░░░░ 23/47                       │
│  Streak: 🔥 12                                          │
│  [Skip] [Uncertain] [Back]                              │
└─────────────────────────────────────────────────────────┘
```

### The Conversation Flow

**Scenario A: AI is confident, user confirms**
```
AI: "Esso Cardlock, $187.50 — looks like fuel. Classify as Vehicle Fuel, GST 5%?"
User: "Yes" (or just clicks checkmark)
AI: "Got it." [Next card]
```

**Scenario B: AI needs more information**
```
AI: "Western Machine, $412.00 — what was this for?"
User: "Hydraulic hose repair on the excavator"
AI: "Equipment repair — GST/PST 12%, Repairs & Maintenance. Sound right?"
User: "Yep"
AI: "Done." [Next card]
```

**Scenario C: AI needs clarification**
```
AI: "E-transfer to Colin MacKenzie, $1,200 — what's this?"
User: "His last paycheque"
AI: "Final wages — Out of Scope. Is Colin set up as a vendor in QuickBooks?"
User: "Should be"
AI: "Found him. Posted to Payroll Expenses: Wages." [Next card]
```

**Scenario D: User doesn't know**
```
AI: "ABC Services Inc, $89.00 — what was this for?"
User: "No idea, skip it"
AI: "Moved to Uncertain pile." [Next card]
```

**Scenario E: Personal expense mixed in**
```
AI: "Amazon, $45.67 — what was this purchase?"
User: "That's personal, not business"
AI: "Marked as personal — won't post to books." [Next card]
```

### Input Methods

**Voice Input (Primary)**
- User taps microphone button or uses hotkey
- Speaks naturally: "Parts for the service truck"
- Speech-to-text converts to text
- AI processes and responds
- Works hands-free if user enables always-listening mode

**Text Input (Alternative)**
- Standard text field for typing
- Autocomplete suggests common descriptions
- Can paste notes if needed

**Quick Actions (Speed Mode)**
- Swipe right = Confirm AI suggestion
- Swipe left = Skip to Uncertain pile
- Swipe up = Mark as personal
- Keyboard shortcuts: Y for yes, N for no, S for skip

---

## Step 3: Review and Confirm

### Before Posting to QuickBooks

After all flashcards are processed, user sees a summary screen:

```
┌─────────────────────────────────────────────────────────┐
│  Ready to Post: 42 transactions                         │
│                                                         │
│  By Category:                                           │
│  ├── Vehicle Expenses: Fuel (8)          $1,247.50     │
│  ├── Vehicle Expenses: R&M (5)           $892.33       │
│  ├── Equipment Rental (3)                $3,400.00     │
│  ├── Office Supplies (4)                 $234.77       │
│  └── ... more                                          │
│                                                         │
│  Uncertain Pile: 3 items                               │
│  Personal (excluded): 2 items                          │
│                                                         │
│  [Review List]  [Post to QuickBooks]                   │
└─────────────────────────────────────────────────────────┘
```

### Review List View

Table showing all transactions with ability to edit before posting:
- Date
- Vendor
- Amount  
- Description (what user said)
- Account Category
- Tax Code
- [Edit] button on each row

### Uncertain Pile

Separate screen for items that were skipped:
- Can revisit and classify
- Can add notes: "Ask accountant about this"
- Can export list to send to accountant

---

## Step 4: Post to QuickBooks

### The Sync Process

1. User clicks "Post to QuickBooks"
2. App connects to QBO via API
3. Each transaction is created as an Expense
4. Receipt images are attached to transactions
5. Progress bar shows posting status
6. Confirmation screen shows success/failures

### Handling Errors

If any transactions fail to post:
- Show which ones failed and why
- Common issues: vendor doesn't exist, account not found
- Allow retry or manual fix
- Never lose data — failed items stay in queue

---

# PART 3: THE AI BRAIN

## How Classification Works

### The Knowledge Base

The app contains a classification rules database (based on the expense classification spreadsheet we built). This includes:

**Vendor Recognition**
```
Vendor patterns → Likely category
"Esso", "Petro", "Shell", "Cardlock" → Fuel
"Lordco", "NAPA", "UAP" → Vehicle Parts
"WCB", "WorkSafe" → WCB Premiums
"ICBC" → Vehicle Insurance
"Telus", "Rogers", "Bell" → Telephone/Internet
```

**Keyword Recognition**
```
User description → Category
"fuel", "gas", "diesel" → Vehicle Fuel
"parts", "filter", "brake" → Vehicle Parts
"repair", "fixed", "maintenance" → Repairs & Maintenance
"wages", "pay", "salary" → Payroll
"insurance" → Insurance Expense
```

**Tax Code Rules**
```
Category → Tax Code
Vehicle Fuel → GST 5%
Vehicle Parts → GST/PST 12%
Vehicle Repairs → GST/PST 12%
Insurance → Exempt
Bank Fees → Exempt
Wages → Out of Scope
Legal Fees → GST/PST 12%
Accounting Fees → GST 5%
```

### The AI Processing Pipeline

**Step 1: OCR Extraction**
- Receipt image → Extract all text
- Identify: vendor name, date, amounts, tax lines

**Step 2: Vendor Matching**
- Compare extracted vendor to known vendor list
- Check user's QuickBooks for existing vendor matches
- Calculate confidence score

**Step 3: Pre-Classification**
- If vendor is recognized with high confidence, suggest category
- If not, wait for user input

**Step 4: User Input Processing**
- Take user's plain language description
- Extract keywords and intent
- Match to category rules
- Determine tax code

**Step 5: Validation**
- Does the amount make sense for this category?
- Does the tax shown on receipt match expected tax code?
- Any red flags? (duplicate transaction, unusual amount)

**Step 6: Confidence Scoring**
```
High confidence (85%+): "Classify as X — confirm?"
Medium confidence (60-85%): "Looks like X, is that right?"
Low confidence (<60%): "What was this purchase for?"
```

### Learning Over Time

The AI gets smarter by learning from user patterns:

**User-Specific Rules**
- "User always classifies Western Machine as equipment repair"
- "User puts all Amazon purchases under Office Supplies unless stated otherwise"
- Save these preferences per user

**Correction Learning**
- If user frequently corrects a suggestion, reduce confidence for that pattern
- If user always confirms a suggestion, increase confidence

**New Vendor Memory**
- First time seeing "Joe's Hydraulics"
- User classifies as Equipment Repair
- Next time: "Joe's Hydraulics — Equipment Repair again?"

---

# PART 4: TECHNICAL ARCHITECTURE

## Overview (Plain Language)

The app has four main parts:

1. **The Frontend** — What users see and interact with (web app and/or mobile app)
2. **The Backend** — The server that processes everything
3. **The AI Services** — OCR and language processing
4. **QuickBooks Connection** — Integration with QBO

## The Frontend

### Web App
- Works in any modern browser (Chrome, Safari, Firefox, Edge)
- Responsive design — works on desktop, tablet, phone
- Can be installed as a "Progressive Web App" for app-like experience

### Mobile App (Future)
- iOS and Android versions
- Camera integration for snapping receipts
- Voice input optimized for mobile
- Offline mode — capture receipts now, process later

### Key Screens
1. Login / Sign Up
2. Dashboard (overview of pending items, recent activity)
3. Upload Screen
4. Flashcard Game Screen
5. Review / Edit Screen
6. Settings (QBO connection, categories, preferences)
7. History / Search past transactions

## The Backend

### What It Does
- Stores user data securely
- Manages receipt files
- Processes classification logic
- Handles QuickBooks API communication
- Manages user accounts and authentication

### Database Needs
- User accounts
- Receipt images and extracted data
- Transaction records
- Classification rules (global and per-user)
- Vendor mappings
- Sync history with QuickBooks

### API Endpoints Needed
```
POST /upload — Upload receipt files
GET /queue — Get pending items for flashcard view
POST /classify — Submit user classification
PUT /transaction/{id} — Edit a transaction
POST /sync — Post transactions to QuickBooks
GET /history — Search past transactions
GET /uncertain — Get items in uncertain pile
POST /vendor — Create new vendor mapping
GET /categories — Get available categories and tax codes
```

## AI Services

### OCR (Reading Receipts)
**What it does:** Converts receipt images into text

**Options to use:**
- Google Cloud Vision API
- AWS Textract
- Azure Computer Vision
- Open source: Tesseract (less accurate but free)

**What to extract:**
- All text on receipt
- Structured data if possible (vendor, date, line items, totals, taxes)

### Language Understanding (Processing User Input)
**What it does:** Understands what the user said and maps to categories

**Options:**
- OpenAI API (GPT-4)
- Anthropic API (Claude)
- Build fine-tuned model on classification data

**How it works:**
1. User says: "Parts for the F-550"
2. AI extracts: category = vehicle parts, asset = F-550 (a truck)
3. AI returns: Account = Vehicle Expenses: Parts, Tax = GST/PST 12%

### Speech-to-Text (Voice Input)
**What it does:** Converts spoken words to text

**Options:**
- Browser built-in (Web Speech API) — free, decent quality
- Deepgram — fast, accurate, affordable
- OpenAI Whisper — very accurate
- Google Speech-to-Text

## QuickBooks Integration

### Connection Method
- OAuth 2.0 authentication
- User logs into their QBO account
- App gets permission to read/write data
- Token stored securely, refreshed as needed

### What We Read from QBO
- Chart of Accounts (to match categories)
- Vendor list (to match/create vendors)
- Tax codes (to verify our codes match theirs)
- Existing transactions (to avoid duplicates)

### What We Write to QBO
- Expense transactions
- New vendors (if needed)
- Attached receipt images

### API Calls Needed
```
GET /company/{id}/account — Get chart of accounts
GET /company/{id}/vendor — Get vendor list
GET /company/{id}/taxcode — Get tax codes
POST /company/{id}/purchase — Create expense transaction
POST /company/{id}/vendor — Create new vendor
POST /company/{id}/upload — Attach receipt image
```

---

# PART 5: DATA MODELS

## User
```
User:
  - id
  - email
  - password (hashed)
  - company_name
  - qbo_connected (yes/no)
  - qbo_company_id
  - qbo_access_token (encrypted)
  - qbo_refresh_token (encrypted)
  - preferences (JSON — voice settings, default accounts, etc.)
  - created_at
  - last_login
```

## Receipt
```
Receipt:
  - id
  - user_id
  - file_url (where the image is stored)
  - file_type (jpg, pdf, etc.)
  - ocr_text (raw extracted text)
  - ocr_data (structured data from OCR)
  - status (pending, classified, posted, uncertain, personal)
  - uploaded_at
```

## Transaction
```
Transaction:
  - id
  - user_id
  - receipt_id (link to receipt)
  - vendor_name
  - date
  - amount
  - description (what user said)
  - account_category
  - tax_code
  - qbo_transaction_id (after posting)
  - ai_confidence_score
  - user_confirmed (yes/no)
  - posted_at
  - created_at
  - updated_at
```

## Vendor Mapping
```
VendorMapping:
  - id
  - user_id
  - vendor_pattern (e.g., "ESSO", "Esso Cardlock")
  - default_category
  - default_tax_code
  - times_used (for confidence building)
```

## Classification Rule
```
ClassificationRule:
  - id
  - user_id (null for global rules)
  - keyword_pattern
  - category
  - tax_code
  - priority (for rule ordering)
```

---

# PART 6: BUSINESS LOGIC RULES

## Tax Code Assignment

### BC Tax Rules (Built-in Defaults)
```
Category → Tax Code → GST Rate → PST Rate

Vehicle Fuel → GST 5% → 5% → 0%
Vehicle Parts → GST/PST 12% → 5% → 7%
Vehicle Repairs → GST/PST 12% → 5% → 7%
Equipment Purchase → GST/PST 12% → 5% → 7%
Equipment Repairs (portable) → GST/PST 12% → 5% → 7%
Equipment Rental → GST/PST 12% → 5% → 7%
Fuel (equipment) → GST 5% → 5% → 0%
Legal Fees → GST/PST 12% → 5% → 7%
Accounting Fees → GST 5% → 5% → 0%
Consulting → GST 5% → 5% → 0%
Insurance → Exempt → 0% → 0%
Bank Fees → Exempt → 0% → 0%
Interest → Exempt → 0% → 0%
Wages/Payroll → Out of Scope → N/A → N/A
Owner Draw → Out of Scope → N/A → N/A
Donations → Out of Scope → N/A → N/A
WCB Premiums → Exempt → 0% → 0%
Cell Phone → GST/PST 12% → 5% → 7%
Internet → GST/PST 12% → 5% → 7%
Software/Subscriptions → GST/PST 12% → 5% → 7%
Office Supplies → GST/PST 12% → 5% → 7%
Postage/Courier → GST 5% → 5% → 0%
Advertising → GST 5% → 5% → 0%
Meals & Entertainment → GST 2.5% → 2.5% → 0%
Travel - Flights → GST 5% → 5% → 0%
Travel - Hotels → GST 5% + PST 8% → 5% → 8%
Commercial Rent → GST 5% → 5% → 0%
Electricity → GST 5% + PST 3.5% → 5% → 3.5%
```

## Duplicate Detection

Before posting, check for duplicates:
- Same vendor + same amount + same date = likely duplicate
- Same vendor + same amount + date within 3 days = possible duplicate
- Flag for user review, don't auto-reject

## Amount Validation

Flag unusual amounts for review:
- Negative amounts (could be refund — ask user)
- Amounts over $10,000 (just double-check)
- Amounts that don't match receipt OCR

## Personal vs Business

Keywords that suggest personal:
- User explicitly says "personal"
- Vendor is clearly personal (Netflix, Spotify, etc. unless user has business account)
- Store receipts with only personal items visible

Always ask if uncertain — never auto-exclude.

---

# PART 7: USER SETTINGS & PREFERENCES

## QuickBooks Connection
- Connect/disconnect QBO account
- Select which QBO company (if multiple)
- View sync status and history

## Default Categories
- Set preferred account for common expense types
- Map categories to specific QBO accounts
- Create custom category rules

## Tax Code Preferences
- Confirm jurisdiction (BC, AB, etc.)
- Override default tax codes if accountant prefers different setup
- Handle multi-province situations

## Voice Settings
- Enable/disable voice input
- Choose speech recognition service
- Set microphone sensitivity
- Enable always-listening mode (hands-free)

## Game Settings
- Enable/disable streak counter
- Sound effects on/off
- Auto-advance timing (how long to show "Done" before next card)
- Review mode vs Speed mode

## Notification Preferences
- Email when batch is ready to process
- Reminders for unprocessed receipts
- Weekly/monthly summary reports

---

# PART 8: GAMIFICATION ELEMENTS

## Why Gamify?

Bookkeeping is boring. Adding game elements makes it:
- More engaging (dopamine hits keep you going)
- Faster (competition against yourself)
- Habit-forming (streaks encourage daily use)

## Streak Counter

**How it works:**
- Each correct classification adds to streak
- Streak breaks if you skip or go back to edit
- Streak shows as 🔥 12 on screen

**Rewards:**
- 10 streak: "Nice! You're on fire"
- 25 streak: "Quarter century! Keep going"
- 50 streak: "Bookkeeping boss!"
- 100 streak: Achievement badge unlocked

## Speed Bonus

Track average time per receipt:
- Display: "Avg: 4.2 seconds per receipt"
- Challenge: "Can you beat your best of 3.8 seconds?"

## Progress Visualization

- Progress bar fills as you complete receipts
- Satisfying animation when reaching 100%
- Celebrate completion: "All done! 47 receipts in 8 minutes"

## Achievements (Optional)

Unlock badges for milestones:
- 🎯 First 100 receipts classified
- ⚡ Processed 50 receipts in under 10 minutes
- 📅 7-day classification streak
- 🏆 1,000 lifetime receipts

## Leaderboard (Optional, Multi-User)

If company has multiple users:
- Weekly leaderboard by receipts processed
- Monthly totals
- Keep it friendly, not punitive

---

# PART 9: EDGE CASES & ERROR HANDLING

## OCR Failures

**Problem:** Image too blurry to read
**Solution:** 
- Flag receipt as "Unreadable"
- Ask user to describe it manually or re-upload
- Still allow manual entry

## Unknown Vendors

**Problem:** Never seen this vendor before
**Solution:**
- Ask user what the business is
- Create vendor mapping for future
- Optionally create vendor in QBO

## Multi-Line Receipts

**Problem:** One receipt has multiple expense types (e.g., Walmart with office supplies AND snacks)
**Solution:**
- AI should detect multiple categories
- Offer to split: "This looks like office supplies ($45) and meals ($12). Split it?"
- Allow manual splitting

## Foreign Currency

**Problem:** Receipt is in USD or other currency
**Solution:**
- Detect currency from receipt
- Ask for exchange rate or pull from API
- Convert and record in CAD
- Store original currency and rate

## Missing Date

**Problem:** Can't determine date from receipt
**Solution:**
- Ask user
- Default to upload date if user says "I don't know"

## Duplicate Receipts

**Problem:** User uploaded same receipt twice
**Solution:**
- Hash images to detect exact duplicates
- Flag similar amounts/vendors on same day
- "This looks like a duplicate of [previous receipt]. Skip it?"

## QBO Sync Failures

**Problem:** Transaction fails to post to QuickBooks
**Solution:**
- Show clear error message
- Common fixes: vendor doesn't exist, account inactive
- Offer to retry or create missing items
- Never lose the transaction — keep in local queue

## Refunds and Credits

**Problem:** Negative amounts or credit notes
**Solution:**
- Ask user: "This is a credit/refund. Apply it to [original category]?"
- Handle as negative expense or separate credit memo
- Match to original transaction if possible

## HST Provinces

**Problem:** User operates in Ontario or other HST province
**Solution:**
- Detect from user profile / QBO company address
- Load appropriate tax rules for that province
- Allow multi-province if business operates in several

---

# PART 10: SECURITY & COMPLIANCE

## Data Security

### Receipt Storage
- All images encrypted at rest
- Stored in secure cloud storage (AWS S3 or similar)
- User can delete all their data at any time
- Automatic deletion after X years (configurable)

### Credentials
- Passwords hashed with bcrypt
- QBO tokens encrypted, never stored in plain text
- All API communication over HTTPS

### Access Control
- Users can only see their own data
- Optional: team roles (admin, bookkeeper, viewer)

## Privacy

### What We Collect
- Email address
- Company name
- Receipt images and extracted data
- Classification history

### What We DON'T Do
- Sell user data
- Use receipt data for advertising
- Share with third parties (except QBO for sync)

### PIPEDA Compliance (Canadian Privacy Law)
- Clear privacy policy
- User consent for data collection
- Right to access and delete data
- Data breach notification procedures

## Financial Data Security

- No credit card numbers stored (use Stripe or similar for billing)
- No bank credentials ever stored
- QBO connection uses OAuth (we never see their QBO password)

---

# PART 11: MONETIZATION OPTIONS

## Pricing Models to Consider

### Freemium
- Free: 50 receipts/month
- Paid: Unlimited receipts
- Good for building user base

### Subscription
- $15-30/month for small business
- $50+/month for multiple users
- Annual discount (2 months free)

### Per-Transaction
- $0.10-0.25 per receipt processed
- Pay as you go
- Good for irregular users

### One-Time Purchase
- Lifetime license (higher upfront)
- Appeals to some small business owners
- Harder to sustain development

## Recommended Approach

**Tiered Subscription:**
- **Starter ($15/month):** 100 receipts/month, 1 user, basic features
- **Business ($30/month):** 500 receipts/month, voice input, priority support
- **Team ($50/month):** Unlimited receipts, multiple users, API access

**14-day free trial** with full features to let users experience the value.

---

# PART 12: DEVELOPMENT PHASES

## Phase 1: Minimum Viable Product (MVP)

**Goal:** Prove the concept works

**Features:**
- User signup/login
- Upload receipts (images only)
- Basic OCR extraction
- Flashcard interface (text input only)
- Simple classification rules (hardcoded)
- Export to CSV (no QBO integration yet)

**Timeline:** 4-6 weeks

**Success Metric:** Can a user classify 50 receipts faster than doing it manually in QBO?

---

## Phase 2: Core Product

**Goal:** Full usable product for early adopters

**Features:**
- QuickBooks Online integration
- Voice input
- Improved AI classification with learning
- Vendor memory
- Uncertain pile workflow
- Duplicate detection
- Basic gamification (streak counter)

**Timeline:** 6-8 weeks after MVP

**Success Metric:** Users successfully syncing to QBO and returning weekly

---

## Phase 3: Polish & Scale

**Goal:** Production-ready for paying customers

**Features:**
- Mobile app (or excellent mobile web)
- Bank statement import
- Split transactions
- Multi-user / team features
- Comprehensive settings
- Billing and subscription management
- Help documentation and onboarding

**Timeline:** 8-12 weeks after Phase 2

**Success Metric:** Paying customers, low churn, positive reviews

---

## Phase 4: Growth Features

**Goal:** Expand market and capabilities

**Features:**
- Support for other accounting software (Xero, Wave, FreshBooks)
- Support for other provinces/countries
- Receipt email forwarding (send receipts to receipts@yourcompany.receiptflash.com)
- API for integrations
- Accountant portal (view client books)
- Advanced reporting

**Timeline:** Ongoing after launch

---

# PART 13: DESIGN PRINCIPLES

## The Look and Feel

ReceiptFlash should feel like a premium product — the kind of app where people say "wow, this is nice" the first time they open it.

### Design Direction Phrases (Use These in AI Prompts)

When generating UI with v0, Cursor, or any AI tool, include these phrases:

- "Minimal, clean interface with lots of white space"
- "Subtle animations and micro-interactions"
- "Use shadcn/ui components"
- "Inspired by Linear, Notion, or Stripe's dashboard"
- "High contrast, crisp typography"
- "Smooth transitions between screens"
- "Modern SaaS aesthetic"
- "Mobile-first responsive design"

### Specific UI Guidelines

**Colors:**
- Primary background: White or very light gray (#FAFAFA)
- Cards/containers: White with subtle shadow
- Accent color: One bold color for buttons and highlights (blue, green, or purple)
- Text: Near-black (#111) for headings, dark gray (#444) for body

**Typography:**
- Clean sans-serif font (Inter, SF Pro, or similar)
- Large, readable text on flashcard screens
- Clear hierarchy: big numbers for amounts, medium for vendors, small for metadata

**Spacing:**
- Generous padding everywhere
- Don't cram elements together
- Let the interface breathe

**Animations:**
- Cards should slide or fade smoothly between transitions
- Subtle bounce or scale on button press
- Progress bar should animate smoothly, not jump
- Success states should feel satisfying (checkmark animation, confetti for streaks)

**The Flashcard Screen Specifically:**
- Receipt image should be large and crisp
- The key info (vendor, amount) should be immediately scannable
- Voice input button should be prominent and inviting
- Progress indicator should be visible but not distracting

### What to Avoid

- Cluttered screens with too many options
- Tiny text or cramped layouts
- Harsh colors or busy patterns
- Dated UI patterns (beveled buttons, heavy gradients)
- Loading spinners that feel slow — use skeleton loaders instead

---

# PART 14: TECHNICAL STACK RECOMMENDATIONS

## For Building with AI Assistance

These are modern, well-documented technologies that AI coding assistants work well with:

### Frontend
- **React** or **Next.js** — Popular, lots of examples, AI knows it well
- **Tailwind CSS** — Fast styling, AI generates it easily
- **Zustand** or **Redux** — State management

### Backend
- **Node.js with Express** — Simple, fast to build
- OR **Python with FastAPI** — Great if doing more AI/ML work
- **PostgreSQL** — Reliable database
- **Prisma** — Database toolkit that works great with AI coding

### AI Services
- **OpenAI API** — For language understanding and classification
- **Google Cloud Vision** — For OCR (or AWS Textract)
- **Deepgram** — For speech-to-text (or OpenAI Whisper)

### Infrastructure
- **Vercel** — Easy deployment for Next.js
- **Railway** or **Render** — Easy backend hosting
- **AWS S3** or **Cloudflare R2** — File storage
- **Stripe** — Payments

### QuickBooks
- **Intuit QuickBooks API** — Official API with OAuth 2.0
- Use their sandbox for development

---

# PART 15: BUILDING WITH CURSOR

## Why Cursor

Cursor is an AI-powered code editor built on VS Code. It uses Claude to help you write code through natural conversation. You describe what you want, it writes the code, you review and iterate.

For ReceiptFlash, Cursor gives you:
- Full control over the UI (pixel-perfect)
- Clean integrations with QBO, OCR, voice APIs
- Real code you own and can deploy anywhere
- No platform fees or vendor lock-in

## Getting Started

### Step 1: Install Cursor
Download from cursor.com and install. It looks like VS Code.

### Step 2: Create a New Project
Open Cursor and tell it:

```
Create a new Next.js 14 project with TypeScript, Tailwind CSS, and shadcn/ui components. Set up the folder structure for a SaaS application with pages for: dashboard, upload, classify (the flashcard game), review, and settings. Initialize a PostgreSQL database with Prisma ORM.
```

### Step 3: Give Cursor the Full Context
Copy the entire ReceiptFlash spec (this document) and paste it into Cursor's chat. Say:

```
This is the complete specification for an app called ReceiptFlash. I'll be asking you to build it piece by piece. Read through this and confirm you understand the app before we start.
```

---

## Build Sequence

Build in this order. Each step produces something testable before moving on.

### Phase 1: Static UI (Week 1)

**Prompt 1.1 — Project Setup**
```
Set up a Next.js 14 project with TypeScript, Tailwind CSS, and shadcn/ui. Create a clean folder structure with /app for pages, /components for reusable UI, /lib for utilities, and /prisma for database. Add Inter font from Google Fonts. Set up a minimal, clean design system with navy blue (#1e3a5f) as the accent color on white backgrounds.
```

**Prompt 1.2 — Layout and Navigation**
```
Create a main layout with a minimal sidebar navigation. Links for: Dashboard, Upload, Classify, Review, Settings. The sidebar should be clean and minimal — just icons with labels, no clutter. Include a header with the app name "ReceiptFlash" and user avatar. Use shadcn/ui components. Lots of white space, inspired by Linear and Notion.
```

**Prompt 1.3 — Dashboard Page**
```
Build the dashboard page. Show three stat cards at the top: "Pending Receipts" (count), "Processed This Month" (count), and "Synced to QuickBooks" (count). Below that, a "Recent Activity" list showing the last 5 processed receipts with vendor, amount, and category. Include a prominent "Upload Receipts" button. Clean, minimal design with subtle shadows on cards.
```

**Prompt 1.4 — Upload Page**
```
Build the upload page. Large drag-and-drop zone in the center that accepts images (jpg, png, heic) and PDFs. Show upload progress for each file. When complete, show a success message with count of files uploaded and a "Start Classifying" button. Minimal design, the drop zone should have a dashed border that highlights on hover.
```

**Prompt 1.5 — Flashcard/Classify Page (This is the core)**
```
Build the flashcard classification screen. This is the heart of the app.

Layout:
- Large receipt image on the left (or top on mobile)
- Right side shows: Vendor name (large), Amount (large), Date
- Below that: AI's question or suggestion (e.g., "Lordco Auto Parts — what was this for?")
- Text input field for typing response
- Microphone button for voice input (just UI for now)
- Bottom: Progress bar showing "23 of 47", streak counter "🔥 12"
- Three small buttons: Skip, Uncertain, Back

Style: Clean, minimal, lots of white space. The receipt image should be prominent. Navy blue accent on buttons. Smooth transitions between cards. Inspired by flashcard apps and Duolingo.
```

**Prompt 1.6 — Review Page**
```
Build the review page showing all classified transactions before posting to QuickBooks.

- Summary section at top: total transactions, total amount, grouped by category
- Table listing each transaction: Date, Vendor, Amount, Description, Category, Tax Code, Edit button
- Filter tabs: All, Ready to Post, Uncertain, Personal
- Bottom: "Post to QuickBooks" button (prominent) and "Export CSV" button (secondary)

Clean table design with alternating row colors. Minimal, professional look.
```

**Prompt 1.7 — Settings Page**
```
Build the settings page with these sections:

1. QuickBooks Connection — Status indicator, Connect/Disconnect button
2. Default Categories — List of expense types with dropdown to set default account
3. Tax Rules — Show current jurisdiction (BC), option to change
4. Voice Input — Toggle to enable, microphone test button
5. Notifications — Email preferences toggles

Organize in clean white cards with subtle shadows. Section headers in navy blue.
```

---

### Phase 2: Database and State (Week 2)

**Prompt 2.1 — Database Schema**
```
Set up Prisma with PostgreSQL. Create these models based on the ReceiptFlash spec:

- User (id, email, passwordHash, companyName, qboConnected, qboAccessToken, qboRefreshToken, preferences JSON, createdAt)
- Receipt (id, userId, fileUrl, fileType, ocrText, ocrData JSON, status enum [pending/classified/posted/uncertain/personal], uploadedAt)
- Transaction (id, userId, receiptId, vendorName, date, amount, description, accountCategory, taxCode, qboTransactionId, confidenceScore, userConfirmed, postedAt, createdAt)
- VendorMapping (id, userId, vendorPattern, defaultCategory, defaultTaxCode, timesUsed)
- ClassificationRule (id, userId nullable, keywordPattern, category, taxCode, priority)

Add appropriate indexes and relations.
```

**Prompt 2.2 — API Routes**
```
Create Next.js API routes for:

POST /api/upload — Accept file uploads, store in local filesystem (we'll add cloud storage later), create Receipt records
GET /api/receipts/pending — Get all receipts with status 'pending' for current user
POST /api/classify — Accept receipt ID and classification data, create Transaction record
PUT /api/transaction/[id] — Update a transaction
GET /api/transactions — Get all transactions with filters (status, date range)
POST /api/sync — Placeholder for QuickBooks sync (just mark as posted for now)

Use proper error handling and return appropriate status codes.
```

**Prompt 2.3 — Wire Up the UI**
```
Connect the static UI to the API routes:

1. Upload page should actually upload files and create Receipt records
2. Classify page should fetch pending receipts and cycle through them
3. When user submits classification, create Transaction and move to next receipt
4. Review page should show real transactions from database
5. Add loading states and error handling throughout

Use React hooks for state management. Show skeleton loaders while data loads.
```

---

### Phase 3: AI Features (Week 3)

**Prompt 3.1 — OCR Integration**
```
Add Google Cloud Vision OCR integration:

1. When a receipt is uploaded, send the image to Google Cloud Vision API
2. Extract text and structured data (vendor, date, amounts)
3. Store raw OCR text and parsed data in the Receipt record
4. If parsing fails, flag for manual entry but don't block the flow

Create a /lib/ocr.ts utility for this. Handle API errors gracefully.
```

**Prompt 3.2 — Classification Engine**
```
Build the classification engine based on the ReceiptFlash spec:

1. Create /lib/classifier.ts with the BC tax rules table from the spec
2. When user describes an expense, use OpenAI API to:
   - Extract keywords and intent
   - Match to expense category
   - Determine tax code
   - Return confidence score
3. If vendor has been seen before (VendorMapping), boost confidence and suggest same category
4. Return: { category, taxCode, confidence, needsClarification, clarifyingQuestion }

Include the full tax rules from the spec document.
```

**Prompt 3.3 — Voice Input**
```
Add voice input using the Web Speech API:

1. When user clicks microphone, start speech recognition
2. Show visual feedback that we're listening (pulsing mic icon)
3. When speech ends, convert to text and put in input field
4. Auto-submit after a short pause, or let user edit first

Add a setting to enable "always listening" mode for hands-free operation.
Browser Speech API is free and works well for this use case.
```

**Prompt 3.4 — Smart Suggestions**
```
Make the flashcard screen intelligent:

1. After OCR, pre-analyze the receipt and generate a suggestion
2. If confidence > 85%: Show "Esso Cardlock — Fuel, GST 5%. Confirm?" with Yes/No buttons
3. If confidence 60-85%: Show "This looks like fuel. Is that right?"
4. If confidence < 60%: Just ask "What was this purchase for?"

When user confirms or corrects, update VendorMapping to learn for next time.
```

---

### Phase 4: QuickBooks Integration (Week 4)

**Prompt 4.1 — QBO OAuth Setup**
```
Set up QuickBooks Online OAuth 2.0 authentication:

1. Create Intuit developer account credentials (I'll provide these)
2. Build /api/auth/qbo/connect — Redirects to Intuit authorization
3. Build /api/auth/qbo/callback — Handles OAuth callback, stores tokens
4. Store access_token and refresh_token encrypted in User record
5. Build token refresh logic for when access_token expires

Use the official intuit-oauth library. Handle all error states.
```

**Prompt 4.2 — Fetch QBO Data**
```
After QBO is connected, sync reference data:

1. GET chart of accounts — Store account IDs mapped to our categories
2. GET vendor list — Store for matching
3. GET tax codes — Verify our codes match theirs

Store this mapping in the database. Refresh periodically or on-demand.
```

**Prompt 4.3 — Post Transactions**
```
Build the sync-to-QuickBooks functionality:

1. When user clicks "Post to QuickBooks" on Review page
2. For each transaction with status 'classified':
   - Create QBO Purchase/Expense entry via API
   - Attach receipt image if possible
   - Store QBO transaction ID in our record
   - Update status to 'posted'
3. Show progress during sync
4. Handle errors gracefully — don't lose data, allow retry

If vendor doesn't exist in QBO, create it automatically.
```

---

### Phase 5: Polish and Deploy (Week 5)

**Prompt 5.1 — Animations and Micro-interactions**
```
Add polish to the UI:

1. Flashcard transitions — smooth slide/fade between receipts
2. Success feedback — checkmark animation when classified
3. Streak counter — flame animation when streak increases
4. Progress bar — smooth animation, not jumpy
5. Button feedback — subtle scale on press
6. Loading states — skeleton loaders instead of spinners
7. Toast notifications for success/error messages

Use Framer Motion for animations. Keep it subtle and professional.
```

**Prompt 5.2 — Mobile Responsiveness**
```
Make sure all pages work perfectly on mobile:

1. Flashcard screen — stack image above details on narrow screens
2. Sidebar — collapse to bottom navigation on mobile
3. Tables — horizontal scroll or card view on mobile
4. Touch targets — all buttons at least 44px
5. Voice input — prominent mic button for thumb access

Test at 375px width (iPhone SE) and 390px (iPhone 14).
```

**Prompt 5.3 — Error Handling and Edge Cases**
```
Harden the app for real-world use:

1. Handle network failures gracefully
2. Retry logic for API calls
3. Offline detection — show banner when offline
4. Duplicate receipt detection (hash images)
5. Input validation on all forms
6. Rate limiting on API routes
7. Proper error messages users can understand
```

**Prompt 5.4 — Deployment**
```
Deploy the app:

1. Set up Vercel project connected to Git repo
2. Configure environment variables for all API keys
3. Set up PostgreSQL on Railway or Supabase
4. Configure file storage on Cloudflare R2 or AWS S3
5. Set up proper CORS and security headers
6. Add basic analytics (Vercel Analytics or Plausible)

Provide a deployment checklist and environment variable template.
```

---

## Cursor Tips

**How to work with Cursor effectively:**

1. **Give context first** — Paste this whole spec at the start of your session
2. **One feature at a time** — Don't ask for too much in one prompt
3. **Review the code** — Cursor is good but not perfect, sanity check what it writes
4. **Iterate** — If output isn't right, say "That's not quite right, instead..." and explain
5. **Use Cmd+K** — Highlight code and press Cmd+K to ask Cursor to modify just that section
6. **Save working states** — Commit to Git frequently so you can roll back

**If Cursor gets confused:**
- Start a new chat
- Re-paste the spec for context
- Be more specific about what you want

---

When you're ready to build this with an AI assistant, here are the prompts to use:

## Getting Started
```
"I want to build a web app called ReceiptFlash. It's an AI bookkeeping tool that lets users upload receipts, flip through them like flashcards, and classify them by speaking or typing. The classifications then sync to QuickBooks Online. Let's start with the MVP. I want to use Next.js for the frontend and Node.js/Express for the backend with PostgreSQL. Set up the initial project structure."
```

## Building the Upload Feature
```
"Build the receipt upload feature for ReceiptFlash. Users should be able to drag and drop multiple image files (jpg, png, pdf). Files should be stored in AWS S3. After upload, send each image to Google Cloud Vision API for OCR and store the extracted text in the database. Show the user a progress bar and confirmation when complete."
```

## Building the Flashcard Interface
```
"Build the flashcard game interface for ReceiptFlash. The screen should show: the receipt image, vendor name, amount, and date extracted from OCR. Below that, show the AI's question or suggestion. Include a text input field and a microphone button for voice input. Add a progress bar showing current item out of total. Include buttons for Skip, Uncertain, and Back."
```

## Building Classification Logic
```
"Build the classification engine for ReceiptFlash. When a user describes an expense (e.g., 'parts for the truck'), the AI should determine: 1) The expense account category, 2) The tax code based on BC tax rules. Use this tax rules table: [paste the tax rules]. Return confidence score. If confidence is high, suggest the classification. If low, ask clarifying questions."
```

## Building QuickBooks Integration
```
"Add QuickBooks Online integration to ReceiptFlash. Implement OAuth 2.0 flow so users can connect their QBO account. After connection, fetch their chart of accounts and vendor list. When user posts transactions, create Expense entries in QBO via the API and attach the receipt images."
```

---

# PART 16: TESTING CHECKLIST

## Before Launch, Verify:

### Upload
- [ ] Can upload single image
- [ ] Can upload multiple images at once
- [ ] Can upload PDF
- [ ] Progress bar works
- [ ] OCR extracts text correctly
- [ ] Handles blurry/poor images gracefully

### Flashcard Interface
- [ ] Shows receipt image clearly
- [ ] Displays extracted vendor, amount, date
- [ ] Text input works
- [ ] Voice input works
- [ ] Can navigate forward and back
- [ ] Can skip to uncertain pile
- [ ] Progress bar accurate

### Classification
- [ ] AI suggests correct categories for common vendors
- [ ] User descriptions map to correct categories
- [ ] Tax codes are accurate for BC
- [ ] Confidence scoring works
- [ ] Low confidence triggers clarifying questions
- [ ] Vendor memory works (remembers past classifications)

### QuickBooks Integration
- [ ] OAuth connection works
- [ ] Fetches chart of accounts
- [ ] Fetches vendor list
- [ ] Creates expense transactions
- [ ] Attaches receipt images
- [ ] Handles errors gracefully
- [ ] Refresh token works (connection doesn't expire)

### Edge Cases
- [ ] Handles duplicate receipts
- [ ] Handles refunds/negative amounts
- [ ] Handles unknown vendors
- [ ] Handles missing dates
- [ ] Split transactions work

### Performance
- [ ] Upload of 50 images completes in reasonable time
- [ ] Flashcard transitions are smooth
- [ ] Voice recognition responds quickly
- [ ] QBO sync handles 100 transactions

---

# APPENDIX A: SAMPLE CONVERSATIONS

## Example Full Session

**User uploads 5 receipts, starts flashcard game:**

---

**[Card 1]**
*[Shows Esso receipt, $87.50]*

AI: "Esso Cardlock, $87.50 — Fuel for vehicle, GST 5%. Confirm?"

User: "Yes"

AI: "Got it."

---

**[Card 2]**
*[Shows Lordco receipt, $342.18]*

AI: "Lordco Auto Parts, $342.18 — Vehicle parts?"

User: "Yeah, brake pads for the F-550"

AI: "Vehicle Parts, GST/PST 12%. Done."

---

**[Card 3]**
*[Shows handwritten receipt, hard to read]*

AI: "I'm having trouble reading this one. Amount looks like $125. Who is this from and what was it for?"

User: "That's Joe's Welding, they fixed the bucket on the skid steer"

AI: "Equipment repair — GST/PST 12%. Vendor is Joe's Welding, $125. Sound right?"

User: "Yep"

AI: "Got it. I'll remember Joe's Welding for next time."

---

**[Card 4]**
*[Shows Amazon receipt, $67.89]*

AI: "Amazon, $67.89 — What did you buy?"

User: "Printer paper and toner"

AI: "Office Supplies, GST/PST 12%. Done."

---

**[Card 5]**
*[Shows e-transfer confirmation]*

AI: "E-transfer to Sarah Chen, $450 — What's this for?"

User: "That's her wages for last week"

AI: "Payroll, Out of Scope. Posting to Payroll Expenses: Wages."

---

**[Complete]**

AI: "All done! 5 receipts in 47 seconds. Ready to post to QuickBooks?"

User: "Yes"

AI: "Posted successfully. Great work! 🔥"

---

# APPENDIX B: GLOSSARY

**Chart of Accounts:** The list of all accounts in QuickBooks (expense categories, income categories, assets, etc.)

**Classification:** Determining which expense account and tax code applies to a transaction

**GST:** Goods and Services Tax (5% federal tax in Canada)

**ITC:** Input Tax Credit — the ability to recover GST paid on business expenses

**OCR:** Optical Character Recognition — technology that reads text from images

**OAuth:** A secure way to connect apps without sharing passwords

**PST:** Provincial Sales Tax (7% in BC)

**QBO:** QuickBooks Online

**Tax Code:** The code that determines how much GST/PST applies (e.g., "GST 5%", "GST/PST 12%", "Exempt")

**Vendor:** The business or person you bought something from

---

# APPENDIX C: RESOURCES

## QuickBooks API
- Documentation: https://developer.intuit.com/
- API Explorer: https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/account
- OAuth Guide: https://developer.intuit.com/app/developer/qbo/docs/develop/authentication-and-authorization

## OCR Services
- Google Cloud Vision: https://cloud.google.com/vision/docs/ocr
- AWS Textract: https://aws.amazon.com/textract/

## Speech-to-Text
- Deepgram: https://deepgram.com/
- OpenAI Whisper: https://openai.com/research/whisper

## AI/LLM
- OpenAI API: https://platform.openai.com/
- Anthropic Claude: https://www.anthropic.com/api

---

**END OF SPECIFICATION**

*This document provides everything needed to build ReceiptFlash. Start with Phase 1 (MVP) and iterate from there. Good luck!*

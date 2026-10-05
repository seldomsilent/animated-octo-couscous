# ReceiptFlash project manual

**Last updated:** October 5, 2026

ReceiptFlash is currently a **specification-only project**. This repository contains a README, an environment-variable example, ignore rules and a detailed application specification. It does not contain application source, a package manifest, a database or a deployable service. Uploading receipts, talking to an assistant and posting to QuickBooks are proposed features, not available functions.

## 1. Understand the project

**Where:** [README](../README.md) and [Complete Application Specification](SPECIFICATION.md).

**Who can use it:** Anyone with access to this repository; product owners, designers and future developers.

### What it's for

The specification describes an AI-assisted bookkeeping workflow: upload receipts, classify them through a flashcard conversation, review uncertain transactions, and confirm posting to QuickBooks Online. It also proposes settings, tax rules, integrations, gamification and development phases.

### How to read the plan

1. Read Parts 1–2 for the intended audience and end-to-end experience.
2. Use Parts 3–6 for the proposed classification process, architecture, data models and business rules.
3. Use Parts 7–10 for proposed settings, gamification, error handling and security requirements.
4. Review Parts 11–14 for pricing ideas, phases, design direction and suggested technology choices.
5. Use Parts 15–16 as an implementation outline and acceptance checklist. Appendix A contains sample conversations; Appendix B defines terminology; Appendix C lists external resources.

### Good to know

The specification is a design document, not evidence that a feature or control exists. Its schedule, provider recommendations, tax assumptions, pricing ideas and compliance statements need review when implementation begins. The suggested stack in the README is also a proposal. No account registration, login or user roles are implemented here.

## 2. Review the proposed receipt workflow

**Where:** Specification Part 2, supported by Parts 3, 6 and 9.

**Who can use it:** People reviewing requirements and acceptance criteria.

### What it's for

This walkthrough helps reviewers assess whether the plan covers real bookkeeping work before software is built.

### How to walk through an example

1. Choose a fictional receipt and read **Step 1: Upload**. Check the proposed input types and extraction flow.
2. Follow **Step 2: The Flashcard Game** and the sample conversations. Review how a person would correct a vendor, amount, category or tax treatment.
3. Follow **Step 3: Review and Confirm**, including the review list and uncertain pile. Identify what must be resolved before posting.
4. Read **Step 4: Post to QuickBooks**, including the proposed failure handling. Record which action requires a person's confirmation.
5. Walk through duplicate receipts, unreadable text, missing dates, foreign currency, refunds and sync failures in Part 9. Treat the expected results as future acceptance criteria.

### Good to know

There is no upload destination or QuickBooks connection in this repository. Keep review examples fictional; a specification review does not require real receipts, financial records, passwords or API keys. Proposed tax classification and privacy controls must be validated before they are relied on in a working product.

## 3. Prepare an implementation change

**Where:** Specification Parts 12, 15 and 16; root project files.

**Who can use it:** A developer working with the project owner.

### What it's for

An implementation change turns a defined part of the plan into verified behaviour. The first change must establish the actual project structure and runnable commands.

### How to start

1. Select a bounded feature from the development phases and agree its acceptance criteria.
2. Inspect the repository before choosing a framework or command. At this edition there is no `package.json`, so the README's `npm install` and `npm run dev` instructions cannot run this project.
3. When adding a scaffold, document its real prerequisites, installation command, start command, local address and configuration variables. Treat `.env.example` as a template only; do not commit secrets.
4. Add and verify the feature, recording implemented behaviour separately from future plans. Do not describe an integration as connected until it has been verified.
5. Update this manual and [Releases](RELEASES.md) in the same commit as the code. Follow [AGENTS.md](../AGENTS.md).

### Good to know

There are currently no build, test, deployment or publishing commands to run. The checklist in Part 16 is a plan, not a report of passing tests. Keep proposed and completed work clearly labelled as the project grows.

## 4. Maintain the documents

**Where:** This manual, the specification and [Releases](RELEASES.md).

**Who can use it:** Repository contributors and reviewers.

### How to keep them useful

Update the specification when requirements change, and update this manual when the actual state or usage changes. Verify relative links in the repository preview. Review examples for private data. Include the sections changed and checks performed in the pull request. When a code change leaves usage unchanged, add a concise maintenance record saying what was checked.

## Glossary

| Term | Meaning in this project |
|---|---|
| Specification | The proposed product design and implementation outline. |
| OCR | The proposed process for extracting text from receipt images. |
| Flashcard | The proposed one-transaction-at-a-time classification interface. |
| Uncertain pile | The proposed queue for transactions needing further review. |
| QBO | QuickBooks Online, a planned integration. |
| MVP | The minimum first working version proposed in the development phases. |

## Maintenance record

- **October 5, 2026:** Created this manual from the repository contents and specification. Confirmed the project has no runnable implementation and distinguished proposed workflows from available functionality.

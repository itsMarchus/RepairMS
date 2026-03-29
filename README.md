# ToyexFix Repair Management System (RMS)

## System Overview

ToyexFix RMS is a web-based repair operations platform for managing customer device repairs from intake to release.  
It combines an internal staff dashboard with a public customer tracking portal, so both teams and customers can follow repair progress in real time.

The system is built with Next.js App Router and Supabase (database, auth, RPC, and storage), with a status-driven workflow designed for daily repair shop operations.

## Core Capabilities

- **Staff Authentication and Access Control**
  - Secure sign-in for staff users
  - Protected internal routes with middleware/session checks
  - Public access allowed only for customer tracking routes

- **Ticket Lifecycle Management**
  - Create new repair tickets with customer and device details
  - Manage statuses (`queued`, `diagnosing`, `waiting-for-parts`, `repairing`, `pickup`, `completed`)
  - Edit technician notes, estimated completion, and payment fields
  - Checkout flow for payment completion and final release

- **Daily Digest Dashboard**
  - KPI cards and pipeline summaries
  - Urgent ticket highlights (due soon/overdue)
  - Operational activity snapshot for the day

- **Customer Portal**
  - Public ticket tracking by ticket number
  - Controlled, read-only ticket visibility for customers
  - Dedicated not-found and fallback states for invalid tracking links

- **Settings and Preferences**
  - Account/store information display and updates
  - Theme and UI preference controls
  - Secure sign-out

## Data Model (High-Level)

- **`customers`**
  - Customer identity and contact info (`name`, `phone_number`, `email`)
- **`tickets`**
  - Links to customer records
  - Device details, issue description, technician notes
  - Status and estimated repair timeline
  - Payment fields (`repair_cost`, `parts_cost`, `paid`) and generated `total_cost`
  - System-generated unique `ticket_number`

## Tech Stack

- **Frontend/App:** Next.js (App Router), React, TypeScript
- **Backend/Data:** Supabase PostgreSQL + RPC functions
- **Auth/Session:** Supabase Auth + SSR cookie-based client handling
- **UI:** Reusable component system with dark mode support
- **Validation/Actions:** Server actions, structured error handling, and route-level fallbacks

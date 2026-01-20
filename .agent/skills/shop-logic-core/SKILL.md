---
name: shop-logic-core
description: "Manages business rules, database integrity, and scheduling logic. Use whenever modifying the Prisma schema, API routes, or booking logic."
---

# BOSS: The Shop Logic Core

**Mission:** Ensure data integrity and business rule enforcement. No double bookings. No lost money.
**Database:** Postgres (Supabase) via Prisma.

## 1. Canonical Models (The Source of Truth)
- **User:** The admin/shop owner.
- **Client:** The car owner. (Must have `name`, `phone`).
- **Vehicle:** Linked to Client. (Must have `vin`, `model`, `year`).
- **Job:** Current work order. Linked to Vehicle. Statuses: `PENDING`, `IN_PROGRESS`, `WAITING_PARTS`, `COMPLETED`.
- **Appointment:** Calendar event. Linked to Job or Client.

## 2. Critical Business Rules

### Scheduling
1.  **Bay Capacity:** We have X bays. We cannot boom Y appointments at the same time if Y > X.
2.  **Hours:** Shop open 8am - 6pm. No bookings outside this.
3.  **Blockouts:** Weekends and Holidays are blocked unless overridden by Admin.

### Financials
1.  **Estimates:** Must be approved (status `APPROVED`) before a Job becomes `IN_PROGRESS`.
2.  **Invoicing:** Every Job must have a final Invoice.

## 3. Implementation Guidelines
- **Validation:** Use `Zod` for all API inputs. Fail loud if `client_id` is missing.
- **Transactions:** When booking an appointment AND creating a job, usage `prisma.$transaction`. Both happen or neither happens.
- **Error Handling:** Return structured JSON errors (e.g., `{ error: "BAY_FULL", message: "No availability at 2pm" }`).

## 4. Monetization Strategy Implementation
- **Value Reporting:** Tracks how much time "Alex" saved (e.g., 5 mins per call diverted).
- **Upsell Prompts:** Logic to suggest "Add ceramic coating?" based on vehicle type (e.g., if vehicle is < 3 years old).


# NextGen Customs V2 - Master Testing Plan

## 1. Objective
Ensure the application is demo-ready by verifying:
1.  **Voice Agent Intelligence**: Distinction between Admin and Customer contexts.
2.  **Voice Agent Tools**: Accurate execution of schedule/revenue/status queries.
3.  **Application Core**: Appointments, Job Management, and Dashboard rendering.

## 2. Voice Agent Testing Protocol (Manual)

### Test A: Admin/Owner Context (Dashboard)
*Goal: Verify Alex treats you as the boss.*
1.  **Trigger**: Click Microphone on Dashboard.
2.  **Say**: "How is the shop looking today?"
3.  **Expected**: "We have [N] active jobs. [X] are in Paint..." (Precise, Data-driven).
4.  **Fail Condition**: "Welcome to NextGen Customs! How can I help you with your vehicle?" (Receptionist Persona).
5.  **Say**: "Reschedule the Civic for Friday at 3 PM."
6.  **Expected**: "Appointment rescheduled to Friday at 3:00 PM."
7.  **Verify**: Check Database/Email for confirmation.

### Test B: Customer Context (Simulation)
*Goal: Verify Alex treats a 'caller' as a customer.*
*Note: Since we use the same widget for the demo, we simulate this by using 'Customer phrasing'.*
1.  **Trigger**: Click Microphone.
2.  **Say**: "Hi, I need to get an estimate for my Tesla."
3.  **Expected**: "I can help with that. Are you looking for a drop-off inspection?" (Receptionist Persona).

## 3. Application Functional Testing (Manual Checklist)

| Feature | Action | Expected Result | Pass/Fail |
| :--- | :--- | :--- | :--- |
| **Auth** | Login with `admin@nextgen.com` | Redirect to Dashboard | |
| **Dashboard** | Load Home Page | Charts render, recent jobs listed | |
| **Schedule** | View Calendar | Appointments visible | |
| **New Job** | Click 'New Job' > Submit | Job appears in 'Active Jobs' | |
| **Voice** | "Check Revenue" | Voice responds with $ figure | |

## 4. Automated Testing Plan (Future Implementation)
To speed up future regressions, we will implement:
1.  **Cypress E2E Tests**:
    - `admin_login.cy.ts`: Verifies login flow.
    - `create_job.cy.ts`: Creating a job via UI.
    - `voice_widget_render.cy.ts`: Ensures widget appears.

## 5. Deployment Checks
1.  **Environment Variables**: Ensure `ELEVENLABS_API_KEY`, `DATABASE_URL`, `RESEND_API_KEY` are set in Vercel.
2.  **Build**: Run `npm run build` locally to catch type errors.

## 6. Execution Strategy
1.  **Right Now**: Developer (You) performs "Test A" immediately on localhost.
2.  **If A Passes**: Move to "Application Functional Testing".
3.  **If A Fails**: We tweak the prompt further or implement a `dynamic_variable` injection in `VoiceWidget.tsx`.

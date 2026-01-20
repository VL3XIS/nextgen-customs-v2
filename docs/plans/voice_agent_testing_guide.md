# Voice Agent Testing Guide (Alex)

This guide provides step-by-step instructions to test the "Alex" voice agent integration, specifically checking the new tools and mock data.

## 1. Environment Setup

Ensure your local development environment is running:

1.  **Backend**: Running on `http://localhost:3001`
2.  **Frontend**: Running on `http://localhost:5173` (or similar)
3.  **ElevenLabs**: Ensure your Agent ID is configured in `.env`.

## 2. Testing Scenarios

Use the frontend microphone widget to ask the following questions.

### 🚗 Scenario A: Shop Status & Jobs
**Intent:** Test `list_active_jobs` tool.

*   **User:** "What jobs are active right now?"
*   **User:** "How is the shop looking today?"
*   **User:** "Show me all jobs waiting for parts."
    *   *Expected Response:* Should list the mock jobs (Ford F-150, Tesla Model 3, etc.).
    *   *Mock Data:* 
        *   JOB-101: Ford F-150 (In Progress)
        *   JOB-102: Tesla Model 3 (Waiting Parts)
        *   JOB-103: Honda Civic (Ready for Pickup)

### 💰 Scenario B: Financial Analysis
**Intent:** Test `analyze_revenue` tool.

*   **User:** "How much money did we make today?"
*   **User:** "What's the revenue for this week?"
*   **User:** "Give me the monthly financial breakdown."
    *   *Expected Response:* Should give specific mock dollar amounts.
    *   *Mock Data:*
        *   Today: $1,250 (Trending Up)
        *   Week: $15,400

### 👤 Scenario C: Customer History
**Intent:** Test `search_customer_history` tool.

*   **User:** "Do we have a history for John Doe?"
*   **User:** "Look up John Doe."
    *   *Expected Response:* Should find John Doe with LTV $4,500 and past brake service.
*   **User:** "Look up a customer named 'Unknown Person'."
    *   *Expected Response:* Should say no history found.

### 📅 Scenario D: Scheduling
**Intent:** Test `check_availability` and `book_appointment`.

*   **User:** "When is the next opening for a drop-off?"
    *   *Expected Response:* Should offer 30-min slots starting from 9 AM.
*   **User:** "Book an appointment for John Smith tomorrow at 10 AM for an oil change."
    *   *Expected Response:* Confirmation message with an appointment ID.

### 📊 Scenario E: Business Reports
**Intent:** Test `generate_report` tool.

*   **User:** "Generate a daily report."
    *   *Expected Response:* Summary of active jobs (4) and staff on duty (5).

## 3. Troubleshooting

If the agent says "I can't do that" or falls back to general knowledge:
1.  Check the **Server Console** locally. You should see logs like `Agent: List Active Jobs` when the tool is triggered.
2.  If you don't see logs, the tool might not be defined in your ElevenLabs agent configuration yet.

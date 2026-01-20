# ALEX - 11Labs "Client Tool" Configuration Guide

**IMPORTANT:** For every tool below, ensure you select **"Client Tool"** (not Webhook) when creating it in the ElevenLabs dashboard.

---

### Tool 1: list_active_jobs
*   **Name:** `list_active_jobs`
*   **Description:** Retrieves a list of currently active jobs in the shop, including their status, assigned technician, and any delays. Use this when the user asks "How is the shop?" or "What jobs are we working on?".
*   **Parameters (JSON Schema):**
    ```json
    {
      "type": "object",
      "properties": {
        "filter": {
          "type": "string",
          "description": "Optional status filter (e.g., 'delayed', 'completed', 'waiting_parts')"
        }
      }
    }
    ```

---

### Tool 2: analyze_revenue
*   **Name:** `analyze_revenue`
*   **Description:** Calculates and analyzes business revenue for a specific time period. Use this when the user asks about money, sales, or financial performance.
*   **Parameters (JSON Schema):**
    ```json
    {
      "type": "object",
      "properties": {
        "time_period": {
          "type": "string",
          "description": "The time period to analyze (e.g., 'today', 'this week', 'last month', 'Q3')"
        }
      },
      "required": ["time_period"]
    }
    ```

---

### Tool 3: check_vehicle_status
*   **Name:** `check_vehicle_status`
*   **Description:** Looks up the specific status of a single vehicle, customer, or job ID. Use this when asking about a specific car/truck.
*   **Parameters (JSON Schema):**
    ```json
    {
      "type": "object",
      "properties": {
        "search_query": {
          "type": "string",
          "description": "The identifier to search for (Customer Name, VIN, License Plate, or Job ID)"
        }
      },
      "required": ["search_query"]
    }
    ```

---

### Tool 4: check_availability
*   **Name:** `check_availability`
*   **Description:** Checks the shop's calendar for available appointment slots.
*   **Parameters (JSON Schema):**
    ```json
    {
      "type": "object",
      "properties": {
        "date": {
          "type": "string",
          "description": "The specific date to check availability for (e.g., 'next Tuesday', '2024-11-20')"
        }
      },
      "required": ["date"]
    }
    ```

---

### Tool 5: book_appointment
*   **Name:** `book_appointment`
*   **Description:** Books a new service appointment or consultation on the calendar.
*   **Parameters (JSON Schema):**
    ```json
    {
      "type": "object",
      "properties": {
        "customer_name": { "type": "string" },
        "service_type": { "type": "string" },
        "date": { "type": "string" },
        "notes": { "type": "string" }
      },
      "required": ["customer_name", "service_type", "date"]
    }
    ```

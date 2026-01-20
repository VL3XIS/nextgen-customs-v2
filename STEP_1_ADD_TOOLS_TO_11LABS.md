# ALEX TOOLS SETUP GUIDE
## Step-by-Step Instructions for 11Labs

---

## ⚠️ IMPORTANT: Before You Start

**In ALL tool definitions below, you'll see:**
```
"url": "https://YOUR-PROJECT-NAME.vercel.app/api/tools/..."
```

**You MUST replace `YOUR-PROJECT-NAME` with your actual Vercel project name!**

For example, if your Vercel URL is `https://nextgen-customs.vercel.app`, then:
```
"url": "https://nextgen-customs.vercel.app/api/tools/check-vehicle-status"
```

**Don't add the tools yet if you haven't deployed your API endpoints!**
You can add them with placeholder URLs, but you'll need to edit each one after deployment.

---

## 📋 OVERVIEW

You'll add **6 tools** to Alex in 11Labs. Each tool connects to your Next.js API to fetch real data from your Supabase database.

**Time estimate:** 30-45 minutes to set up all tools

---

## 🎯 THE 6 TOOLS YOU'LL CREATE

1. **check_vehicle_status** - Look up any vehicle/job by name, plate, or VIN
2. **list_active_jobs** - Show all current jobs with filters
3. **analyze_revenue** - Get revenue data for any time period
4. **search_customer_history** - Find customer's past jobs and info
5. **get_staff_schedule** - Show who's working and their assignments
6. **generate_report** - Create business reports on demand

---

## 🛠️ WHERE TO ADD TOOLS IN 11LABS

1. Go to your 11Labs Conversational AI dashboard
2. Click on your "Alex" agent
3. Find the **"Tools"** or **"Functions"** section
4. Click **"Add Tool"** or **"Add Function"**
5. You'll add each tool one by one (6 total)

---

## 📝 TOOL DEFINITIONS

For each tool below, you'll copy the JSON into 11Labs.

---

### **TOOL #1: check_vehicle_status**

**What it does:** Looks up a specific vehicle/job by customer name, license plate, VIN, or phone number.

**When Alex uses it:** 
- "Where's the Martinez truck?"
- "Check status on job #2891"
- "What's the status on the blue Silverado?"

**Copy this into 11Labs:**

```json
{
  "type": "webhook",
  "name": "check_vehicle_status",
  "description": "Check the current status of a specific vehicle or job in the shop. Use customer name, license plate, VIN, phone number, or job number to search.",
  "url": "https://YOUR-PROJECT-NAME.vercel.app/api/tools/check-vehicle-status",
  "method": "POST",
  "parameters": {
    "type": "object",
    "properties": {
      "search_query": {
        "type": "string",
        "description": "Customer name, license plate, VIN, phone number, or job number to search for"
      }
    },
    "required": ["search_query"]
  }
}
```

**Note:** Replace `YOUR-PROJECT-NAME` with your actual Vercel project name

**API Endpoint you'll build:** `/api/tools/check-vehicle-status`

---

### **TOOL #2: list_active_jobs**

**What it does:** Shows all current jobs in the shop with optional filters.

**When Alex uses it:** 
- "How's the shop today?"
- "Show me all jobs"
- "Any jobs behind schedule?"
- "What's in progress?"

**Copy this into 11Labs:**

```json
{
  "type": "webhook",
  "name": "list_active_jobs",
  "description": "List all active jobs in the shop. Can filter by status (all, in_progress, waiting_parts, ready_pickup, overdue) and sort by different criteria.",
  "url": "https://YOUR-PROJECT-NAME.vercel.app/api/tools/list-active-jobs",
  "method": "POST",
  "parameters": {
    "type": "object",
    "properties": {
      "filter": {
        "type": "string",
        "enum": ["all", "in_progress", "waiting_parts", "ready_pickup", "overdue"],
        "description": "Filter jobs by status. Default is 'all'."
      },
      "sort_by": {
        "type": "string",
        "enum": ["start_date", "due_date", "value", "customer_name"],
        "description": "How to sort the results. Default is 'due_date'."
      }
    },
    "required": []
  }
}
```

**Note:** Replace `YOUR-PROJECT-NAME` with your actual Vercel project name

**API Endpoint you'll build:** `/api/tools/list-active-jobs`

---

### **TOOL #3: analyze_revenue**

**What it does:** Provides revenue analytics for any time period.

**When Alex uses it:** 
- "Show me this month's revenue"
- "How much did we make this week?"
- "Revenue breakdown by service type"

**Copy this into 11Labs:**

```json
{
  "type": "webhook",
  "name": "analyze_revenue",
  "description": "Analyze revenue for specified time periods. Returns total revenue, number of jobs, average ticket, and breakdowns by service type.",
  "url": "https://YOUR-PROJECT-NAME.vercel.app/api/tools/analyze-revenue",
  "method": "POST",
  "parameters": {
    "type": "object",
    "properties": {
      "time_period": {
        "type": "string",
        "enum": ["today", "week", "month", "quarter", "year"],
        "description": "The time period to analyze revenue for"
      },
      "breakdown_by": {
        "type": "string",
        "enum": ["service_type", "customer", "none"],
        "description": "Optional breakdown category. Default is 'none'."
      }
    },
    "required": ["time_period"]
  }
}
```

**Note:** Replace `YOUR-PROJECT-NAME` with your actual Vercel project name

**API Endpoint you'll build:** `/api/tools/analyze-revenue`

---

### **TOOL #4: search_customer_history**

**What it does:** Find a customer's complete history - past jobs, payments, notes.

**When Alex uses it:** 
- "What's the history with John Martinez?"
- "Has this customer been here before?"
- "Show me all of Maria's past jobs"

**Copy this into 11Labs:**

```json
{
  "type": "webhook",
  "name": "search_customer_history",
  "description": "Search for a customer and retrieve their complete history including past jobs, total spent, payment history, and any notes.",
  "url": "https://YOUR-PROJECT-NAME.vercel.app/api/tools/search-customer-history",
  "method": "POST",
  "parameters": {
    "type": "object",
    "properties": {
      "customer_identifier": {
        "type": "string",
        "description": "Customer name, phone number, or email to search for"
      },
      "include_notes": {
        "type": "boolean",
        "description": "Whether to include internal notes about the customer. Default is true."
      }
    },
    "required": ["customer_identifier"]
  }
}
```

**Note:** Replace `YOUR-PROJECT-NAME` with your actual Vercel project name

**API Endpoint you'll build:** `/api/tools/search-customer-history`

---

### **TOOL #5: get_staff_schedule**

**What it does:** Show staff availability and current job assignments.

**When Alex uses it:** 
- "Who's working today?"
- "What's Mike assigned to?"
- "Staff schedule for tomorrow"

**Copy this into 11Labs:**

```json
{
  "type": "webhook",
  "name": "get_staff_schedule",
  "description": "Get staff schedule showing who is working, their availability, and current job assignments for a specific date.",
  "url": "https://YOUR-PROJECT-NAME.vercel.app/api/tools/get-staff-schedule",
  "method": "POST",
  "parameters": {
    "type": "object",
    "properties": {
      "date": {
        "type": "string",
        "description": "Date in YYYY-MM-DD format. Use 'today' for current date."
      },
      "staff_member": {
        "type": "string",
        "description": "Optional: specific staff member name to filter for. Leave empty for all staff."
      }
    },
    "required": ["date"]
  }
}
```

**Note:** Replace `YOUR-PROJECT-NAME` with your actual Vercel project name

**API Endpoint you'll build:** `/api/tools/get-staff-schedule`

---

### **TOOL #6: generate_report**

**What it does:** Create formatted business reports.

**When Alex uses it:** 
- "Give me a daily summary"
- "Generate weekly performance report"
- "Show me the financial overview"

**Copy this into 11Labs:**

```json
{
  "type": "webhook",
  "name": "generate_report",
  "description": "Generate formatted business reports including daily summaries, weekly performance, or financial overviews.",
  "url": "https://YOUR-PROJECT-NAME.vercel.app/api/tools/generate-report",
  "method": "POST",
  "parameters": {
    "type": "object",
    "properties": {
      "report_type": {
        "type": "string",
        "enum": ["daily_summary", "weekly_performance", "financial_overview", "customer_list"],
        "description": "Type of report to generate"
      },
      "include_recommendations": {
        "type": "boolean",
        "description": "Whether to include AI-generated recommendations. Default is true."
      }
    },
    "required": ["report_type"]
  }
}
```

**Note:** Replace `YOUR-PROJECT-NAME` with your actual Vercel project name

**API Endpoint you'll build:** `/api/tools/generate-report`

---

## 🔧 STEP-BY-STEP: ADDING EACH TOOL

### **For EACH tool above, follow these steps:**

#### **Step 1: Add the Tool in 11Labs**
1. In your Alex agent settings, find "Tools" section
2. Click "Add Tool" or "Add Function"
3. Copy the entire JSON block for Tool #1
4. Paste it into 11Labs
5. Click "Save" or "Add"

#### **Step 2: Note the Tool Name**
- The tool name is in the JSON: `"name": "check_vehicle_status"`
- Write this down - you'll need it when building the API

#### **Step 3: Repeat for All 6 Tools**
- Add Tool #1, save
- Add Tool #2, save
- Add Tool #3, save
- Add Tool #4, save
- Add Tool #5, save
- Add Tool #6, save

---

## ✅ VERIFICATION CHECKLIST

After adding all tools, verify in 11Labs:

- [ ] Tool #1: check_vehicle_status ✓
- [ ] Tool #2: list_active_jobs ✓
- [ ] Tool #3: analyze_revenue ✓
- [ ] Tool #4: search_customer_history ✓
- [ ] Tool #5: get_staff_schedule ✓
- [ ] Tool #6: generate_report ✓

**All 6 tools should show in your Alex agent's tools list.**

---

## 🎬 DEMO VERSION: MOCK DATA

Since this is for tomorrow's demo and you don't have real data yet, I'll create a separate file with **mock API endpoints** that return realistic test data. This way Alex will work perfectly for the demo!

**Next step:** I'll create the mock API endpoints for you to deploy.

---

## 🚀 WHAT HAPPENS NEXT

1. ✅ You add these 6 tools to 11Labs (15 minutes)
2. ✅ I create mock API endpoints with test data (next file)
3. ✅ You deploy the mock APIs to Vercel (10 minutes)
4. ✅ You test Alex in the dashboard (5 minutes)
5. ✅ You're ready for demo tomorrow! 🎉

---

**Questions to ask yourself as you go:**
- "Did I add all 6 tools to 11Labs?"
- "Do I see them listed in my agent settings?"
- "Are the tool names spelled exactly as shown?"

**Common mistakes to avoid:**
- ❌ Typos in tool names
- ❌ Missing required fields
- ❌ Not saving after adding each tool
- ❌ Adding tools to wrong agent

---

**Ready for the next step?** Let me know when you've added these tools to 11Labs, and I'll create the mock API endpoints!

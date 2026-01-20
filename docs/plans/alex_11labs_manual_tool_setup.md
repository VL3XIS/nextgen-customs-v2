# MANUAL TOOL SETUP GUIDE FOR 11LABS
## Fill Out Forms Instead of JSON

---

## 🎯 WHY MANUAL ENTRY?

11Labs' JSON format is very specific and changes between versions. **It's easier and faster to just use their form interface.**

**Time estimate:** 5 minutes per tool = 30 minutes total

---

## 📝 STEP-BY-STEP FOR EACH TOOL

### **General Steps (Same for All Tools):**

1. Go to your Alex agent in 11Labs
2. Find "Tools" or "Functions" section
3. Click **"Add Tool"** or **"Create New Tool"**
4. You'll see a form with fields to fill out
5. Follow the specific instructions below for each tool

---

## 🛠️ TOOL #1: list_active_jobs

### **Basic Information:**
- **Tool Name:** `list_active_jobs`
- **Tool Type:** **Client**
- **Description:** 
  ```
  List all active jobs in the shop. Can filter by status and sort by different criteria. Use for "How's the shop?" or "What are we working on?"
  ```
- **Expects Response:** ✅ Yes
- **Response Timeout:** `30` seconds

### **Parameters Section:**

**Parameter 1:**
- **Parameter Name:** `filter`
- **Parameter Type:** `string`
- **Description:** `Filter jobs by status: all, in_progress, waiting_parts, ready_pickup, or overdue. Default is all.`
- **Required:** ❌ No

**Click "Save"**

---

## 🛠️ TOOL #2: analyze_revenue

### **Basic Information:**
- **Tool Name:** `analyze_revenue`
- **Tool Type:** **Client**
- **Description:** 
  ```
  Analyze revenue for specified time periods. Returns total revenue, trends, and breakdowns. Use for "How much money did we make?"
  ```
- **Expects Response:** ✅ Yes
- **Response Timeout:** `30` seconds

### **Parameters Section:**

**Parameter 1:**
- **Parameter Name:** `time_period`
- **Parameter Type:** `string`
- **Description:** `The time period to analyze: today, week, month, quarter, or year`
- **Required:** ✅ Yes

**Click "Save"**

---

## 🛠️ TOOL #3: check_vehicle_status

### **Basic Information:**
- **Tool Name:** `check_vehicle_status`
- **Tool Type:** **Client**
- **Description:** 
  ```
  Check the specific status of a single vehicle or job. Use this when the user asks about a specific customer or car.
  ```
- **Expects Response:** ✅ Yes
- **Response Timeout:** `30` seconds

### **Parameters Section:**

**Parameter 1:**
- **Parameter Name:** `search_query`
- **Parameter Type:** `string`
- **Description:** `Customer name, VIN, or Job ID to search for.`
- **Required:** ✅ Yes

**Click "Save"**

---

## 🛠️ TOOL #4: check_availability

### **Basic Information:**
- **Tool Name:** `check_availability`
- **Tool Type:** **Client**
- **Description:** 
  ```
  Checks the shop calendar for open appointment slots.
  ```
- **Expects Response:** ✅ Yes
- **Response Timeout:** `30` seconds

### **Parameters Section:**

**Parameter 1:**
- **Parameter Name:** `date`
- **Parameter Type:** `string`
- **Description:** `The date to check availability for (e.g. 'tomorrow', 'next Tuesday').`
- **Required:** ✅ Yes

**Click "Save"**

---

## 🛠️ TOOL #5: book_appointment

### **Basic Information:**
- **Tool Name:** `book_appointment`
- **Tool Type:** **Client**
- **Description:** 
  ```
  Books a new appointment.
  ```
- **Expects Response:** ✅ Yes
- **Response Timeout:** `30` seconds

### **Parameters Section:**
*(Add these 4 parameters)*

1. `customer_name` (string, required)
2. `service_type` (string, required)
3. `date` (string, required) - The date and time requested
4. `notes` (string, optional)

**Click "Save"**

---

## 🛠️ TOOL #6: search_customer_history

### **Basic Information:**
- **Tool Name:** `search_customer_history`
- **Tool Type:** **Client**
- **Description:** 
  ```
  Search for a customer history including past jobs and notes.
  ```
- **Expects Response:** ✅ Yes
- **Response Timeout:** `30` seconds

### **Parameters Section:**

**Parameter 1:**
- **Parameter Name:** `customer_identifier`
- **Parameter Type:** `string`
- **Description:** `Name or phone number.`
- **Required:** ✅ Yes

**Click "Save"**

---

## 🛠️ TOOL #7: generate_report

### **Basic Information:**
- **Tool Name:** `generate_report`
- **Tool Type:** **Client**
- **Description:** 
  ```
  Generates a summarized report of business metrics.
  ```
- **Expects Response:** ✅ Yes
- **Response Timeout:** `30` seconds

### **Parameters Section:**

**Parameter 1:**
- **Parameter Name:** `report_type`
- **Parameter Type:** `string`
- **Description:** `Type: 'daily', 'financial', or 'staff'.`
- **Required:** ✅ Yes

**Click "Save"**

---

## ✅ VERIFICATION CHECKLIST

**All tools must be Type: CLIENT.**

1. [ ] list_active_jobs
2. [ ] analyze_revenue
3. [ ] check_vehicle_status
4. [ ] check_availability
5. [ ] book_appointment
6. [ ] search_customer_history
7. [ ] generate_report

If you have these 7 tools, Alex will be fully operational in "Executive Mode".

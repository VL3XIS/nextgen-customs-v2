# Job-Post Decoupling Implementation Plan

> **For Agent:** REQUIRED SUB-SKILL: Use executing-plans (if available) to implement this plan task-by-task.

**Goal:** Decouple "New Job" from "Create Post" to allow generating social media content for *existing* jobs after work is completed.

**Architecture:** 
1. Rename "New Job" to "Job Intake" (pure data entry).
2. Create new "Social Studio" (or "Create Post") workflow.
3. Allow searching existing jobs, adding "After" photos, and generating content on demand.

**Tech Stack:** React (Vite), Node.js (Express), Prisma (PostgreSQL), Lucide Icons.

---

### Task 1: Backend - Add Photo Upload to Existing Job

**Files:**
- Modify: `backend/src/routes/jobs.ts`
- Modify: `backend/src/controllers/jobController.ts`

**Step 1: Add Route**
Add `POST /jobs/:id/photos` to `backend/src/routes/jobs.ts` using the existing `upload.array('photos', 10)` middleware.

**Step 2: Implement Controller**
Add `addJobPhotos` function to `jobController.ts`:
1. Find job by ID (and userId).
2. Map `req.files` to `Photo` model entries.
3. `await prisma.photo.createMany(...)`.
4. Return updated job with photos.

**Step 3: Add Search Capability to GetJobs**
Modify `getJobs` in `jobController.ts` to accept `?search=query`.
- If `search` exists, add `where: { OR: [{ vehicle: { contains: search } }, { customerName: { contains: search } }] }`.

---

### Task 2: Frontend - Rename "New Job" to "Job Intake"

**Files:**
- Modify: `frontend/src/components/DashboardLayout.tsx`
- Modify: `frontend/src/pages/NewJobPage.tsx`

**Step 1: Update Sidebar**
Change label "New Job" to "Job Intake" in `navItems`.

**Step 2: Update Page Title**
In `NewJobPage.tsx`, change `<h1>NEW JOB</h1>` to `<h1>JOB INTAKE</h1>`.
Remove the automatic redirection to `PostReviewPage` after creation. Instead, redirect to `JobHistoryPage` or `Dashboard`.
*Why?* Because intake happens *before* work is done. No photos/posts yet.

---

### Task 3: Frontend - Create "Social Studio" (Select Job Page)

**Files:**
- Create: `frontend/src/pages/SocialStudioPage.tsx`
- Modify: `frontend/src/App.tsx`
- Modify: `frontend/src/components/DashboardLayout.tsx`

**Step 1: Create Page Component**
Create `SocialStudioPage.tsx`.
UI Requirements:
1. **Tabs/Mode Toggle**: "Existing Job" vs "Quick Post" (Manual Entry).
2. **Existing Job Mode**:
   - **Search Bar**: "Search active jobs..." (calls `api.get('/jobs?search=...')`).
   - **Job List**: Display matches.
   - **Selection**: Pre-fills the form.
3. **Quick Post Mode**:
   - Manual input fields for Vehicle, Services, and Customer Name (optional).
   - *Backend Note:* This will likely need to create a "Shadow Job" or "Quick Job" in the background so the photos have somewhere to live, or update `generatePosts` to handle transient data. (Decision: Create a job with status `COMPLETE` automatically).
4. **Photo Upload**: "Upload Completed Photos".
5. **Generate Button**: "Generate Social Posts".

**Step 2: Add Route**
Add `<Route path="social-studio" element={<SocialStudioPage />} />` to `App.tsx`.

**Step 3: Add to Sidebar**
Add "Social Studio" (Icon: `Share2` or `Camera`) to `DashboardLayout.tsx`.

---

### Task 4: Frontend - Wire Up "Generate" Flow

**Files:**
- Modify: `frontend/src/pages/SocialStudioPage.tsx`

**Step 1: Handle Submission**
On "Generate":
1. **If Quick Post (New Job):**
   - Call `POST /jobs` (Status: COMPLETE, Name: "Quick Post").
   - Get new `jobId`.
2. **If Existing Job:**
   - Use selected `jobId`.
3. **Common Steps:**
   - Upload photos: `POST /jobs/:id/photos`.
   - Trigger generation: `POST /posts/generate { jobId }`.
   - Redirect to `/dashboard/jobs/:id/review`.

**Result:**
The user can now Intaking a car on Monday -> Do the work -> Go to "Social Studio" on Friday -> Find the Job -> Upload Photos -> Generate Posts.

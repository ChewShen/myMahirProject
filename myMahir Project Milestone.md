# myMahir Project Roadmap & Milestones

### ✅ Phase 1: Architecture & Design
- [x] Finalize the Database Schema (Users, Courses, and QuizResults).
- [x] Draw the Entity-Relationship Diagram (ERD).
- [x] Draw the 3-Tier Pipeline Flowchart (Angular, Express, MySQL, AI API).

### ✅ Phase 2: The Data Layer (MySQL & Express)
- [x] Set up Express.js environment.
- [x] Configure MySQL Database connection.
- [x] Write `GET /api/courses` route and test data retrieval.

### ✅ Phase 3: The Presentation Layer (Angular)
- [x] Set up Angular workspace.
- [x] Generate Core Angular components (`CourseViewer`, `Dashboard`).
- [x] Connect Angular Service to Express `GET` route and display dummy course data.

### ✅ Phase 4: The "Wow" Factor (AI Integration)
- [x] Express: Write `POST /api/generate-quiz` to prompt Gemini API for JSON questions.
- [x] Angular: Wire "Test My Knowledge" button to fetch AI-generated questions.
- [x] Angular: Implement quiz taking logic, answer validation, and score calculation.

### ✅ Phase 5: Identity & Security (Profile & Auth)
- [x] Implement Sign Up / Registration flow (`POST /api/register` with `bcrypt`).
- [x] Implement Sign In / Login flow (`POST /api/login` with JWT generation).
- [x] Add JWT Authentication Middleware (`verifyToken` in Express).
- [x] Protect Angular Routes (`authGuard` and HTTP Interceptor).
- [x] Implement Role-Based Access Control (RBAC) (dynamic roles from DB: Student vs Admin).
- [x] Build Admin Panel UI to view all student scores (`GET /api/scores` join query).

### ✅ Phase 6: The Polish (Core Logic & Presentation)
- [x] Write backend logic to save the final quiz score back to the database (`POST /api/save-score`).
- [x] Create foundational Dashboard component.
- [x] Update Dashboard to dynamically display multiple available courses from the database.
- [x] Ensure AI quizzes are generated dynamically based on the specifically selected material (Pass `courseId` from Dashboard -> CourseViewer).
- [x] Implement "Quit Midway" logic using a brilliant Local Storage Pause & Resume system.
- [x] Protect the `/admin-panel` Angular route with a specialized `adminGuard`.
- [x] Create a Student Profile view (so students can see their own past scores).

### ⏳ Phase 7: Containerization (Stretch Goal)
- [ ] Write a `Dockerfile` for the Express backend.
- [ ] Write a `Dockerfile` for the Angular frontend.
- [ ] Write a `docker-compose.yml` file to link frontend, backend, and a MySQL container.

<div style="display: flex; align-items: center; text-align: center;">
  <div style="flex-grow: 1; height: 1px; background: #ccc;"></div>
  <span style="padding: 0 10px; font-weight: bold; color: #555;">In The Future</span>
  <div style="flex-grow: 1; height: 1px; background: #ccc;"></div>
</div>

### Phase 8: AI Tutor Expansion & Interactive Study Kits (V2 Implementation)

**Focuses on moving the AI from an assessor (grading tool) into an active, helpful learning tutor.**

Feature 1: Smart Remediation Loop ("Why Did I Get This Wrong?")
  - [x] Backend: Build a POST /api/quiz/explain route that receives an incorrect answer selection and queries Gemini to generate a constructive, contextual explanation.
  - [x] Frontend (Teal/Mint UI Accent Theme): Code soft-teal background boxes or emerald-bordered panels to display constructive AI hints when a student misses a question.
  
Feature 2: Dynamic Learning Study Kits
- [x] Backend: Expand the Gemini prompt architecture to output a structured JSON array containing 3-bullet point module summaries, key vocabulary definitions, and flashcards.
- [x] Frontend (Indigo/Violet UI Accent Theme): Build interactive digital Flashcards (flip-to-reveal) using Angular Material tabs/cards accented in deep violet to distinguish the premium AI-tutor workspace.

### Phase 9: Automated Curriculum Parsing & Serverless Storage (V3 Stretch Goal)
**Takes the structural burden off educators by building out an automated ingestion engine.**
- [ ] Admin Document Upload Interface: Create a seamless drag-and-drop file upload zone in the Admin dashboard using FormData to accept raw PDFs and DOCX documents.
- [ ] Document Conversion Pipeline: Incorporate Microsoft markitdown (or a node-equivalent parser) to programmatically convert incoming documents into structured Markdown text.
- [ ] Automated Instructional Chunking: Prompt Gemini to read the newly generated Markdown chapter, divide it into logically sized sub-modules, and save the individual chunks cleanly into the MySQL courses table.

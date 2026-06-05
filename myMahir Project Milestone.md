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
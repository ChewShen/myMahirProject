# E-Learning & Assessment Platform

Repository for **myMahir Full Stack Developer Track (Cohort 2)** capstone project.

This project is a web-based learning platform that combines automated, AI-driven evaluations with dynamic content delivery to expedite the learning process.

This approach uses automatically generated tests rather than having teachers create them by hand. After a student completes a module, the Express.js backend securely connects to an external AI API to quickly create multiple-choice, contextual quizzes based on the precise content they just read.

## Key Features

- **AI-Driven Assessment:** Real-time generation of interactive quizzes using Google Gemini AI, ensuring unique questions for every learning session.
- **Secure Authentication:** Full JWT (JSON Web Token) implementation for secure user sessions and password hashing using Bcrypt.
- **Role-Based Access Control (RBAC):** Dedicated Student and Admin views with specialized Angular Route Guards to protect administrative dashboards.
- **Admin Analytics:** Comprehensive dashboard for teachers to monitor student performance and view historical quiz results across the platform.
- **State Persistence:** A sophisticated "Pause & Resume" system using Local Storage that allows students to resume unfinished quizzes even after closing their browser.
- **3-Tier Architecture:** A clean separation of concerns between the Angular frontend, Express backend, and MySQL database layer.

--- 

## Tech Stack

- **Frontend:** Angular & Angular Material (UI Components), Tailwind
- **Backend:** Express.js (Node.js)
- **Database:** MySQL
- **Integrations:** External AI API (Gemini) & JWT Authentication

---

## Planning & Milestones

To ensure on-time delivery of this MVP within a strict timeline, the development lifecycle was mapped out using agile milestones. The core workflow was divided into clear phases to manage the 3-Tier architecture and AI API integration effectively.

![Project Gantt Chart](./docs/gantt-chart.png)

📄 [Click here to view the detailed Milestone Planning Document](<docs/myMahir Project Milestone - detail.md>)


---

## System Architecture

### Database Architecture (ERD)

The database design uses normalized relational tables to link Users, Courses, and their corresponding Quiz results.

![ERD Diagram](./docs/erdDiagram.png)

### System Architecture & Data Flow

This application is built on a standard 3-Tier Architecture, separating the user interface, business logic, and database management.

### The Architectural Layers
To demonstrate both application logic and modern operations engineering, the architecture of this platform is analyzed across two distinct viewpoints: **Pre-Deployment Business Logic Flow** and **Post-Deployment Infrastructure Setup**. 

Fundamentally, the core software system preserves a strict **3-Tier Architecture** pattern (Presentation, Application/Logic, and Data layers) across both viewpoints. The addition of container layers simply builds a secure, highly reproducible orchestration mesh around them.


#### Pre-Deployment Architecture
This viewpoint focuses on the logical data pipeline and feature execution before infrastructure containerization is introduced. It maps the step-by-step lifecycle of user requests when a student interacts with the platform.


![Pre deploy architecture diagram](./docs/architecture-pre-deploy.png)

**Presentation Layer (Angular):** The client-side interface built with Material Design. It handles user interactions, local state persistence (Pause/Resume), and dynamic routing.

**Application Layer (Express.js):** The central business logic hub. It manages API orchestration, JWT verification middleware, and communicates with the Google Generative AI SDK.

**Data Layer (MySQL):** The persistent storage system holding relational data for Users, Courses, and Quiz Results.

#### Post-Deployment Architecture
This viewpoint illustrates the system runtime layout after container orchestration has been initialized using Docker Compose. It outlines network routing, security parameters, and cross-container communication.

![Post deploy architecture diagram](./docs/architecture-post-deploy.png)

- **Infrastructural Proxy Gateway (Nginx):** The single entry point for all web traffic on standard **Port 80**. It directly serves the compiled Angular frontend layout to users. If a request hits an `/api` path, Nginx acts as a reverse proxy and routes it directly to the Express container behind the scenes.
- **Core Application Tier (Express API Container):** Houses the Node.js backend logic (`mymahir-express-api`). It is fully hidden from direct internet access within Docker’s internal network mesh, ensuring public users cannot access port 3000 directly.
- **Relational Persistence Store (MySQL DB Container):** Handles persistent data storage (`mymahir-mysql-db`) on port 3306. It communicates strictly through isolated cross-container bridge wires and saves mock records to a physical database volume so data remains safe across server restarts.

---

## Core Quiz Pipeline

![Pipeline Diagram](./docs/pipeline.png)

1. Client Request: The student finishes reading a module in the Angular frontend and clicks the "Generate Quiz" button, triggering an HTTP POST request to the Express server.
2. Database Query: The Express backend receives the request and queries the MySQL database for the specific text content of that course.
3. Data Retrieval: MySQL returns the raw course text back to the Express server.
4. AI Processing: Express takes the course text, wraps it in a secure prompt, and forwards it to the external AI Service (Gemini API) to generate contextual multiple-choice questions.
5. AI Response: The AI Service successfully generates the questions and returns them to the Express server as a formatted JSON object.
6. Client Render: Express relays the final JSON array back to the Angular frontend, which dynamically renders the interactive quiz interface for the student.

---

## Setup and Installation

### Prerequisites
- Node.js (v18 or higher)
- MySQL Server (I am using MySQL Benchmark)
- Google Gemini API Key

### 1. Database Configuration
1. Create a MySQL database connection.
2. Run the SQL scripts located in the `/sql` directory to initialize the `users`, `courses`, and `quiz` tables.

### 2. Backend Environment
1. Navigate to the `/express` directory.
2. Run `npm install`.
3. Create a `.env` file with the following variables:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASS=your_mysql_password
   DB_NAME=mymahir
   JWT_SECRET=your_secret_key
   DEV_SECRET_KEY=your_secret_key
   GEMINI_API_KEY=your_google_gemini_key
   ```
4. Start the server using `npm start`.

### 3. Frontend Environment
1. Navigate to the `/angularSide` directory.
2. Run `npm install`.
3. Start the development server using `ng serve`.
4. Access the application at `http://localhost:4200`.

*Keep the both server running, do not close it

---

## 🗺️ Project Roadmap Status

- [x] Phase 1: Architecture & Database Design
- [x] Phase 2: Express.js & MySQL Integration
- [x] Phase 3: Angular UI & Material Design
- [x] Phase 4: Google Gemini AI Integration
- [x] Phase 5: JWT Authentication & Role-Based Security
- [x] Phase 6: Dashboard Analytics & Persistence Logic
- [x] Phase 7: Docker Containerization (Stretch Goal)

---
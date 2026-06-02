**Phase 1 : Architecture & Design** 

- [x] ~~Finalize the Database Schema (Write down the columns for `Users`, `Courses`, and `QuizResults`.~~  
- [x] ~~Draw the Entity-Relationship Diagram (ERD).~~   
- [x] ~~Draw the simple 3-Tier Pipeline Flowchart (showing how Angular, Express, MySQL, and the AI API talk to each other).~~

### **Phase 2: The Data Layer (MySQL & Express)**

*Start with the backend. Cant data on the frontend if it doesn't exist yet.*

- [x] ~~*Setup for express.js*~~  
- [x] ~~Open MySQL Workbench~~  
- [x] ~~Write a simple `GET /api/courses` route. Using Postman (from the Express Day 3 slides) to test that it successfully retrieves the dummy course.~~

*Goal:* Backend can successfully talk to your database.

### **Phase 3: The Presentation Layer (Angular)**

- [x] ~~Setup for Angular~~  
- [x] ~~Generate the Angular components (`CourseViewer`, `QuizModal`).~~  
- [x] ~~Use an Angular Service to call theExpress `GET` route and display the dummy course text on the screen using Angular Material cards.~~

*Goal:* A user can look at the web app and read a course.

### **Phase 4: The "Wow" Factor (AI Integration)**

- [x] ~~Back in Express, write the `POST /api/generate-quiz` route. Write the logic that sends the course text to the AI API and asks for a JSON array of questions.~~  
- [x] ~~In Angular, add a "Test My Knowledge" button. Wire it up so it calls the new Express route, receives the AI-generated questions, and displays them on the screen.~~  
- [x] ~~Ensure the answer can be submitted and score displayed~~

*Goal:* The pipeline is complete\! The system is now AI-powered.

### **Phase 5: The Profile**

- [ ] Able to Sign in/Sign up  
- [ ] Having different role such as normal user and admin/teacher  
- [ ] Able to look at user’s own profile information  
- [ ] Add JWT Authentication (so only logged-in users can take quizzes).

### **Phase 6: The Polish (Security & Presentation)**

- [ ] Add dashboard components  
- [ ] Better logic handling  
      * Create Multiple Quiz  
      * Detect if the quiz is quit midway  
      * Quiz Generated based on the material  
- [ ] Better Profile handling  
- [ ] Write the logic to save the final quiz score back to the `QuizResults` MySQL table.

**Phase 7: Containerization (Stretch Goal)** 

- [ ] Write a `Dockerfile` for your Express backend.  
- [ ] Write a `Dockerfile` for your Angular frontend.  
- [ ] Write a `docker-compose.yml` file that links them both with a standard MySQL image.


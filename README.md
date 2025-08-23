# EduMaster-Pro-AI-Powered-Learning-Management-System

EduMaster Pro is a modern, AI-powered Learning Management System (LMS) designed for students, instructors, and administrators. Unlike traditional LMSs that are either too rigid or too bloated, EduMaster Pro focuses on personalized, adaptive, and engaging learning experiences powered by AI/ML.

---

# 👤 User Module:

This module handles **user authentication, authorization, and profile management**.  
It includes routes for registration, login, profile, password management, and admin-level user operations.

## 📂 API Routes

| Method | Endpoint                      | Middleware                   | Description                           |
| ------ | ----------------------------- | ---------------------------- | ------------------------------------- |
| POST   | `/auth/register`              | `registerValidations`        | Register a new user                   |
| POST   | `/auth/login`                 | `loginValidations`           | Login and receive JWT token           |
| POST   | `/auth/logout`                | `isAuthenticated`            | Logout the logged-in user             |
| GET    | `/user/me`                    | `isAuthenticated`            | Get logged-in user's profile          |
| GET    | `/user/:id`                   | `isAuthenticated`, `isAdmin` | Get a user by ID (Admin only)         |
| PUT    | `/user/:id`                   | `isAuthenticated`            | Update user details                   |
| DELETE | `/user/:id`                   | `isAuthenticated`, `isAdmin` | Delete a user (Admin only)            |
| GET    | `/allusers`                   | `isAuthenticated`, `isAdmin` | Fetch all users (Admin only)          |
| POST   | `/user/forgot-password`       | –                            | Request password reset link via email |
| POST   | `/user/reset-password/:token` | –                            | Reset password using token            |

## 🛡️ Middlewares

- **`isAuthenticated`** – Ensures the user is logged in (valid JWT).
- **`isAdmin`** – Restricts access to admin users only.
- **`registerValidations`** – Validates registration data.
- **`loginValidations`** – Validates login data.

## 📌 Controllers

- `registerUser` – Handles user registration.
- `loginUser` – Handles user login & token generation.
- `logoutUser` – Handles user logout.
- `getMyProfile` – Fetches logged-in user profile.
- `getUserById` – Fetches user by ID (Admin only).
- `updateUser` – Updates user details.
- `getAllUsers` – Fetches all users (Admin only).
- `deleteUser` – Deletes a user (Admin only).
- `forgotPassword` – Sends password reset link via email.
- `resetPassword` – Resets password using token.

---

# 🎓 Course Module – API Documentation

This module handles **course creation, management, publishing, enrollment, and ratings**.  
It includes routes for instructors, admins, and general authenticated users.

## 📂 Routes Overview

| Method | Endpoint                       | Middleware                        | Description                               |
| ------ | ------------------------------ | --------------------------------- | ----------------------------------------- |
| POST   | `/createcourse`                | `isAuthenticated`, `isInstructor` | Create a new course                       |
| GET    | `/course/:courseId`            | `isAuthenticated`                 | Get course details by ID                  |
| PUT    | `/updatecourse/:courseId`      | `isAuthenticated`, `isInstructor` | Update a course                           |
| DELETE | `/deletecourse/:courseId`      | `isAuthenticated`, `isInstructor` | Delete a course                           |
| PATCH  | `/course/:courseId/publish`    | `isAuthenticated`, `isAdmin`      | Publish a course                          |
| PATCH  | `/course/:courseId/unpublish`  | `isAuthenticated`, `isAdmin`      | Unpublish a course                        |
| GET    | `/course/published/courses`    | `isAuthenticated`, `isAdmin`      | Get all published courses                 |
| GET    | `/course/slug/:slug`           | `isAuthenticated`, `isInstructor` | Get course details by slug                |
| GET    | `/searchcourses`               | `isAuthenticated`                 | Search courses                            |
| GET    | `/allcourses`                  | `isAuthenticated`, `isAdmin`      | Get all courses                           |
| GET    | `/instructor/courses`          | `isAuthenticated`, `isInstructor` | Get all courses created by the instructor |
| PATCH  | `/course/:courseId/enroll`     | `isAuthenticated`, `isInstructor` | Increment enroll count for a course       |
| POST   | `/course/:courseId/ratecourse` | `isAuthenticated`                 | Rate a course                             |

## 📌 Controllers

- `createCourse` – Creates a new course.
- `getCourseById` – Fetches a course by ID.
- `updateCourseById` – Updates an existing course.
- `deleteCourseById` – Deletes a course.
- `publishCourseById` – Publishes a course (Admin).
- `unpublishCourseById` – Unpublishes a course (Admin).
- `getCourseBySlug` – Fetches course by slug (Instructor).
- `searchCourses` – Search/filter courses.
- `incrementEnrollCount` – Increases enrollment count (Instructor).
- `getAllPublishedCourses` – Gets all published courses (Admin).
- `getInstructorCourses` – Gets courses created by the instructor.
- `getAllCourses` – Gets all courses (Admin).
- `rateCourseById` – Allows users to rate a course.

---

# 📘 Lesson Module

This module handles **lesson creation, retrieval, updating, and deletion** within a course.  
It is restricted to **instructors** with authentication.

## 📂 Routes Overview

| Method | Endpoint                                      | Middleware                                                  | Description                         |
| ------ | --------------------------------------------- | ----------------------------------------------------------- | ----------------------------------- |
| POST   | `/course/:courseId/createlesson`              | `isAuthenticated`, `createLessonValiadtion`, `isInstructor` | Create a new lesson under a course  |
| GET    | `/course/:courseId/lessons`                   | `isAuthenticated`, `isInstructor`                           | Get all lessons for a course        |
| GET    | `/course/:courseId/lessons/:lessonId`         | `isAuthenticated`, `isInstructor`                           | Get a lesson by ID                  |
| PUT    | `/course/:courseId/lessons/:lessonId/details` | `isAuthenticated`, `isInstructor`                           | Update lesson details               |
| DELETE | `/course/:courseId/lessons/:lessonId`         | `isAuthenticated`, `isInstructor`                           | Delete a lesson                     |
| GET    | `/course/:courseId/lessons/:lessonId`         | `isAuthenticated`, `isInstructor`                           | Get lesson detail (duplicate route) |

## 📌 Controllers

- `createNewLesson` – Creates a new lesson in a course.
- `getLessonsByCourseId` – Retrieves all lessons of a course.
- `getLessonById` – Retrieves a lesson by ID.
- `updateLessonById` – Updates lesson details.
- `deleteLessonById` – Deletes a lesson.
- `getLessonDetail` – Fetches detailed information about a lesson.

---

# 📝 Quiz Module

This module handles **quiz creation, management, activation, and AI-generated quizzes**.  
It is restricted to **instructors** with authentication.

## 📂 Routes Overview

| Method | Endpoint                                          | Middleware                                                | Description                                       |
| ------ | ------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------- |
| POST   | `/course/:courseId/lesson/:lessonId/createquiz`   | `isAuthenticated`, `createQuizValidation`, `isInstructor` | Create a new quiz for a lesson                    |
| PUT    | `/course/:courseId/lesson/:lessonId/quiz/:quizId` | `isAuthenticated`, `isInstructor`                         | Update quiz details                               |
| DELETE | `/course/:courseId/lesson/:lessonId/quiz/:quizId` | `isAuthenticated`, `isInstructor`                         | Delete a quiz                                     |
| GET    | `/course/:courseId/lesson/:lessonId/quizzes`      | `isAuthenticated`, `isInstructor`                         | Get all quizzes for a lesson                      |
| PATCH  | `/quiz/:quizId/toggle`                            | `isAuthenticated`, `isInstructor`                         | Toggle quiz active/inactive                       |
| POST   | `/generateaiquiz/:lessonId`                       | `isAuthenticated`, `isInstructor`                         | Generate quiz automatically using AI for a lesson |

## 📌 Controllers

- `createQuiz` – Creates a quiz for a lesson.
- `updateQuiz` – Updates quiz details.
- `deleteQuiz` – Deletes a quiz.
- `getQuizzesByLessonId` – Fetches all quizzes for a lesson.
- `generateAIQuiz` – Uses AI to auto-generate a quiz for a lesson.
- `toggleQuizActive` – Activates/deactivates a quiz.

---

# 📊 Quiz Attempt Module – API Documentation

This module manages **quiz attempts by students**, including starting an attempt, submitting answers, and retrieving attempt history or details.

---

## 📂 Routes Overview

### 🏁 Attempt Lifecycle

| Method | Endpoint                            | Middleware        | Description                                                |
| ------ | ----------------------------------- | ----------------- | ---------------------------------------------------------- |
| POST   | `/quiz/:quizId/attempt`             | `isAuthenticated` | Start a new attempt for a quiz                             |
| POST   | `/quiz/:quizId/submit`              | `isAuthenticated` | Submit a quiz attempt with answers                         |
| GET    | `/quiz/:quizId/attempts/me`         | `isAuthenticated` | Get all attempts for the logged-in user on a specific quiz |
| GET    | `/quiz/:quizId/attempts/:attemptId` | `isAuthenticated` | Get details of a specific quiz attempt                     |

## 📌 Controllers

- `startAttempt` – Initializes a new quiz attempt for a user.
- `submitAttempt` – Submits answers and calculates results.
- `getAttemptsByUser` – Retrieves all attempts made by the logged-in user for a quiz.
- `getAttemptById` – Fetches a specific attempt’s details.

---

# 📈 Enrollment Module

This module manages **course enrollments**, including enrolling in courses, tracking progress, and marking courses as complete.  
It also provides admin functionality to view course-level enrollment data.

## 📂 Routes Overview

| Method | Endpoint                                        | Middleware                   | Description                                            |
| ------ | ----------------------------------------------- | ---------------------------- | ------------------------------------------------------ |
| POST   | `/courses/:courseId/enroll`                     | `isAuthenticated`            | Enroll the authenticated user into a course            |
| GET    | `/courses/me/enrollments`                       | `isAuthenticated`            | Get all courses the user is enrolled in                |
| GET    | `/courses/:courseId/enrollment`                 | `isAuthenticated`, `isAdmin` | Get all enrollments for a specific course (Admin only) |
| PUT    | `/courses/:courseId/lessons/:lessonId/progress` | `isAuthenticated`            | Update lesson progress for a course                    |
| PUT    | `/courses/:courseId/complete`                   | `isAuthenticated`            | Mark the course as completed                           |

## 📌 Controllers

- `enrollCourse` – Handles enrolling a user into a course.
- `getMyEnrolledCourses` – Fetches courses that the logged-in user has enrolled in.
- `getEnrollmentByCourse` – Fetches all enrollments for a specific course (Admin only).
- `updateCourseProgress` – Updates user’s lesson-level progress in a course.
- `completeCourse` – Marks a course as completed for the user.

---

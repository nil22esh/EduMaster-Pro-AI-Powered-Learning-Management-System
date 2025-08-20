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

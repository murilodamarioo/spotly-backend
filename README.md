# 📌 Project Overview

This project is an API for discovering, reviewing, and managing **places** such as cafés, restaurants, gyms, and more.  
It allows users to create accounts, register and manage places, leave reviews, and explore recommendations.

---

## 🎯 Use Cases (Main Features)

### 👤 User
- **Sign up**: Create an account with email/password (social login may be added later).  
- **Sign in**: Authenticate and receive a JWT token.  
- **Edit profile**: Update name, profile picture, and bio.  
- **Delete account**: Remove user data permanently.  

### 📍 Places
- **Create a place**: Register a place with name, category (café, restaurant, gym, etc.), description, and address.  
- **Edit a place**: Update details (only by the creator/admin).  
- **List places**: Browse places, with filters by category, name, or proximity (initially a general listing).  
- **Delete a place**: Remove a place from the system.  

### ⭐ Reviews
- **Create a review**: Add a rating (1–5), comment, and user reference.  
- **Edit a review**: Update details (only by the creator).  
- **Delete a review**: Remove a review.  
- **List reviews**: Display reviews for a specific place.  

### 🔍 Discovery
- **Recent feed**: Show latest reviews and newly added places.  
- **Top ranking (optional for MVP)**: Display the highest-rated places.  

---

## ✅ Functional Requirements
- User registration and authentication.  
- CRUD operations for places.  
- CRUD operations for reviews.  
- Simple filtering when listing places (by category or name).  
- Activity feed (latest reviews/places created).  
- Basic security with JWT authentication.  

---

## ⚙️ Non-Functional Requirements

### 🔒 Security
- Password hashing with **bcrypt**.  
- JWT-based authentication.  

### ⚡ Performance
- Pagination for listing places and reviews.  

### 📈 Scalability
- Modular **NestJS architecture** (Users, Places, Reviews).  

### 🌐 Availability
- RESTful API with **Swagger documentation**.  

### 🛠️ Maintainability
- Layered design: **Controller → Service → Repository**.  

### 🗄️ Database
- Relational database (**Postgres** or **MySQL**).  
- Core tables: `Users`, `Places`, `Reviews`.  

### ✅ Validation
- Input validation using **DTOs** with `class-validator`.  

### 📊 Observability (future improvement)
- Basic logging and error monitoring.  

---


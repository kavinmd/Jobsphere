# 🚀 JobSphere — Job Scraper Platform

> **Kalpana Software Solution Pvt. Ltd. — SDE-1 Full Stack Assessment**

A full-featured job search and hiring platform with Role-Based Access Control (RBAC). Students can search & scrape jobs from multiple platforms and apply directly. Hiring managers can post, manage jobs, and track applicants.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS (custom dark theme) |
| Backend | Node.js + Express + TypeScript |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |
| HTTP Client | Axios |
| Routing | React Router DOM v6 |
| Notifications | react-hot-toast |

---

## ✨ Features

### 🎓 Student Features
- Signup/Login with JWT authentication
- **Internal Job Search** — filter by keyword, location, type
- **External Job Scraper** — scrape jobs from LinkedIn, Naukri, Internshala, Unstop
- Apply to both internal and external jobs with optional cover letter
- Application history with real-time status tracking
- Profile management (CRUD)

### 👔 Hiring Manager Features
- Post new job openings with full details
- Edit/update existing job postings
- Close or delete job postings
- View all applicants for each job
- Update applicant status (pending → reviewed → shortlisted → rejected)
- Add notes to applicants
- Manager dashboard with stats
- Profile management (CRUD)

### 🔐 Security
- JWT-based authentication
- Role-based access control (RBAC)
- bcrypt password hashing (12 salt rounds)
- Protected routes on both frontend and backend
- Students cannot access manager routes and vice versa

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Clone / Setup

```bash
# The project is in d:\Kalpana-assignment\
```

### 2. Backend Setup

```bash
cd server

# Install dependencies
npm install

# Configure environment (already set up in .env)
# MONGODB_URI=mongodb://localhost:27017/job_scraper_platform
# JWT_SECRET=kalpana_jwt_secret_key_2024_sde1_assessment
# PORT=5000

# Seed the database with test accounts
npm run seed

# Start development server
npm run dev
```

Backend runs on: `http://localhost:5000`

### 3. Frontend Setup

```bash
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

## 🔑 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| 👔 Hiring Manager | manager@kalpana.com | Manager@123 |
| 🎓 Student | student@kalpana.com | Student@123 |

---

## 📁 Project Structure

```
Kalpana-assignment/
├── server/               # Backend (Node.js + Express + MongoDB)
│   ├── src/
│   │   ├── config/       # Database connection
│   │   ├── controllers/  # Route handlers
│   │   ├── middleware/   # Auth & role middleware
│   │   ├── models/       # Mongoose schemas
│   │   ├── routes/       # Express routes
│   │   ├── seed.ts       # Database seeder
│   │   └── index.ts      # App entry
│   └── package.json
│
└── client/               # Frontend (React + Vite + Tailwind)
    ├── src/
    │   ├── api/           # API wrapper functions
    │   ├── components/    # UI & layout components
    │   ├── context/       # AuthContext
    │   ├── pages/         # All page components
    │   ├── routes/        # Route guards
    │   ├── types/         # TypeScript interfaces
    │   └── App.tsx        # Router
    └── package.json
```

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login & get JWT |
| GET | `/api/auth/me` | Get current user |

### Jobs
| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/jobs` | Auth | All open jobs |
| GET | `/api/jobs/my` | Manager | Manager's jobs |
| GET | `/api/jobs/stats` | Manager | Dashboard stats |
| POST | `/api/jobs` | Manager | Create job |
| PUT | `/api/jobs/:id` | Manager | Update job |
| DELETE | `/api/jobs/:id` | Manager | Delete job |

### Applications
| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/api/applications` | Student | Apply to job |
| GET | `/api/applications/my` | Student | My applications |
| GET | `/api/applications/stats` | Student | Student stats |
| GET | `/api/applications/job/:id` | Manager | Job applicants |
| PUT | `/api/applications/:id/status` | Manager | Update status |

### Scraper
| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/scraper/search?keyword=&location=` | Student | Scrape jobs |

---

## 🎨 Design Highlights

- Dark mode with glassmorphism effects
- Custom gradient color palette (purple → pink)
- Smooth animations and micro-interactions
- Responsive layout with sidebar navigation
- Inter font for premium typography
- Animated background orbs

---

## 📤 Submission

- **GitHub**: [Your GitHub URL]
- **Live Frontend**: [Your Frontend URL]
- **Backend API**: [Your Backend URL]

---

*Built for Kalpana Software Solution Pvt. Ltd. SDE-1 Assessment — July 2026*

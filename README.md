# 🚀 JobSphere — Job Scraper Platform

> **Kalpana Software Solution Pvt. Ltd. — SDE-1 Full Stack Assessment**

A full-featured job search and hiring platform with Role-Based Access Control (RBAC). Students can search & scrape jobs from multiple platforms and apply directly. Hiring managers can post, manage jobs, and track applicants.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS (custom dark theme) |
| Backend | Python 3.11+ + FastAPI + Uvicorn |
| Database | MongoDB (local or Atlas) + Motor (async driver) + Beanie ODM |
| Auth | JWT (`python-jose`) + bcrypt (`passlib`) |
| HTTP Client | Axios (frontend) + httpx (backend scraper) |
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
- bcrypt password hashing
- Protected routes on both frontend and backend
- Students cannot access manager routes and vice versa

---

## 🚀 Getting Started

### Prerequisites

| Requirement | Version |
|-------------|---------|
| Python | 3.11+ |
| Node.js | 18+ |
| MongoDB | Local or Atlas |
| pip | Latest |

---

### ⚡ Quick Start (Windows — Recommended)

Simply double-click **`start.bat`** from the project root. It will:
1. Start the MongoDB service
2. Launch the FastAPI backend on **http://localhost:5000**
3. Launch the React frontend on **http://localhost:5173**

```bat
# From the project root — just double-click or run:
start.bat
```

---

### 🔧 Manual Setup

#### 1. Backend Setup (Python + FastAPI)

```bash
cd server

# (Recommended) Create & activate a virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# Install Python dependencies
pip install -r requirements.txt

# Environment variables (already configured in .env)
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/job_scraper_platform
# JWT_SECRET=kalpana_jwt_secret_key_2024_sde1_assessment
# JWT_EXPIRES_IN=7d
# CLIENT_URL=http://localhost:5173

# Seed the database with test accounts
python seed.py

# Start the FastAPI development server
python main.py
```

Backend runs on: `http://localhost:5000`
Interactive API docs (Swagger UI): `http://localhost:5000/docs`

---

#### 2. Frontend Setup (React + Vite)

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

> Run `python seed.py` from the `server/` directory to populate these accounts.

---

## 📁 Project Structure

```
Kalpana-assignment/
├── start.bat                 # One-click startup script (Windows)
├── README.md
│
├── server/                   # Backend (Python + FastAPI + MongoDB)
│   ├── main.py               # App entry point (Uvicorn server)
│   ├── seed.py               # Database seeder
│   ├── requirements.txt      # Python dependencies
│   ├── .env                  # Environment variables
│   └── app/
│       ├── config/           # Database connection (Motor / Beanie)
│       ├── models/           # Beanie document models
│       ├── routes/           # FastAPI routers
│       ├── controllers/      # Business logic / route handlers
│       └── middleware/       # Auth & role dependencies
│
└── client/                   # Frontend (React + Vite + Tailwind CSS)
    ├── index.html
    ├── package.json
    ├── vite.config.ts
    └── src/
        ├── api/              # Axios API wrapper functions
        ├── components/       # Shared UI & layout components
        ├── context/          # AuthContext (React Context API)
        ├── pages/            # All page components
        ├── routes/           # Route guards (ProtectedRoute)
        ├── types/            # TypeScript interfaces
        └── App.tsx           # Router configuration
```

---

## 📡 API Endpoints

Interactive docs available at **`http://localhost:5000/docs`** (Swagger UI) once the backend is running.

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
| GET | `/api/scraper/search?keyword=&location=` | Student | Scrape external jobs |

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

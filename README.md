# 🌐 JobSphere — Enterprise Job Aggregator & Recruitment Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Frontend](https://img.shields.io/badge/Frontend-React_19_%7C_JavaScript_%7C_Vite-61DAFB?logo=react)](https://react.dev/)
[![Backend](https://img.shields.io/badge/Backend-FastAPI_%7C_Python_3.11+-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Database](https://img.shields.io/badge/Database-MongoDB_%7C_Beanie_ODM-47A248?logo=mongodb)](https://www.mongodb.com/)

> **JobSphere** is a full-featured job search, web scraping, and recruitment management platform. Designed with a modern dark-mode glassmorphic UI, it bridges candidate job discovery across major hiring platforms with end-to-end employer applicant tracking.

---

## 📌 Executive Summary

Finding and managing jobs across multiple job boards can be fragmented. JobSphere provides a unified platform featuring:
1. **Aggregated Job Scraping**: Live multi-platform search across LinkedIn, Naukri, Internshala, and Unstop.
2. **Internal Job Posting & ATS**: Employer portal to create postings, track application stages, and review candidate portfolios.
3. **Candidate Workflow**: One-stop portal for job search, custom cover letters, and real-time application status tracking.
4. **Role-Based Access Control (RBAC)**: Secure separation between Candidate students and Hiring Managers using JWT authentication.

---

## 🛠️ Technology Stack

### Frontend Architecture
- **Framework**: React 19 + JavaScript + Vite
- **Styling & Theme**: Vanilla CSS with custom glassmorphism design system & dark mode tokens
- **Routing**: React Router DOM v6
- **State & Auth**: React Context API (`AuthContext`)
- **HTTP & Toast Notifications**: Axios & `react-hot-toast`

### Backend Architecture
- **Framework**: FastAPI (Python 3.11+) + Uvicorn ASGI server
- **Database**: MongoDB (Local or Atlas)
- **Object-Document Mapper**: Beanie ODM (built on Motor async driver & Pydantic v2)
- **Scraper Engine**: Async `httpx` + BeautifulSoup4 parsing engine
- **Security & Auth**: OAuth2 / JWT bearer tokens (`python-jose`) + bcrypt password hashing (`passlib`)

---

## 🌟 Core Features

### 🎓 Candidate Portal (Student)
- **Single-Sign-On & Registration**: Secure account creation with persistent JWT sessions.
- **Internal Job Search**: Search & filter open positions by keyword, location, and employment type.
- **Live Multi-Platform Scraper**: Fetch real-time job listings from external sources (LinkedIn, Naukri, Internshala, Unstop).
- **Direct Application Manager**: Apply to internal postings with custom cover letters and track status history.
- **Profile Management**: Update skills, resume links, bio, and contact info.

### 👔 Employer & Recruiter Portal (Hiring Manager)
- **Job Creation & Management**: Publish, edit, pause, or remove job listings.
- **Applicant Tracking System (ATS)**: View candidates per job, manage hiring stage (`pending` → `reviewed` → `shortlisted` → `rejected`), and leave candidate notes.
- **Recruitment Analytics**: Overview dashboard showing active job counts, total applicants, and hiring metrics.
- **Profile Management**: Manage company profiles and recruiter details.

### 🔐 Platform Security
- **Role-Based Access Control (RBAC)**: Strict API dependency validation for route authorization.
- **Password Hashing**: Cryptographic salt & hashing with bcrypt.
- **CORS & Environment Protection**: Controlled cross-origin policies.

---

## 📁 Repository Structure

```
Jobsphere/
├── start.bat                 # One-click startup launcher for Windows
├── README.md                 # Project documentation
│
├── server/                   # Backend FastAPI Application
│   ├── main.py               # Application entry point & Uvicorn runner
│   ├── seed.py               # Database seeder with sample data
│   ├── requirements.txt      # Python dependencies
│   ├── .env                  # Backend configuration & secrets
│   └── app/
│       ├── config/           # Database setup & Beanie initialization
│       ├── models/           # Beanie document models (User, Job, Application)
│       ├── routers/          # FastAPI API endpoint modules
│       └── middleware/       # Auth & RBAC security dependencies
│
└── client/                   # Frontend React Application
    ├── index.html            # Entry HTML document
    ├── package.json          # Node dependencies & scripts
    ├── vite.config.ts        # Vite configuration & dev server options
    └── src/
        ├── api/              # Axios HTTP client instances & API methods
        ├── components/       # UI & Layout components
        ├── context/          # Auth state management
        ├── pages/            # Application views (Landing, Dashboard, Tracker)
        ├── routes/           # Protected routes & role guards
        └── types/            # TypeScript interfaces & domain types
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Python**: 3.11 or higher
- **Node.js**: v18.0 or higher
- **MongoDB**: Community Server (v6.0+) running locally or a MongoDB Atlas Cluster connection URI

---

### ⚡ One-Click Startup (Windows)

Launch the entire stack (Database check, Backend server, and Frontend client) with a single command:

```cmd
start.bat
```

- **Frontend Application**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`
- **Interactive API Documentation (Swagger)**: `http://localhost:5000/docs`

---

### 🔧 Manual Installation & Setup

#### 1. Backend Setup (FastAPI)

```bash
# Navigate to backend directory
cd server

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows PowerShell:
.\venv\Scripts\Activate.ps1
# macOS/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Seed initial test database
python seed.py

# Start FastAPI development server
python main.py
```

#### 2. Frontend Setup (React + Vite)

```bash
# Navigate to frontend directory
cd client

# Install packages
npm install

# Start Vite dev server
npm run dev
```

---

## 🔑 Demo Access Credentials

| Role | Email | Password | Access Level |
|:---|:---|:---|:---|
| 👔 **Hiring Manager** | `manager@jobsphere.com` | `ManagerPass#2026` | Full Employer & ATS Portal |
| 🎓 **Student / Candidate** | `student@jobsphere.com` | `StudentPass#2026` | Candidate Search & Application Portal |

*Run `python seed.py` in `server/` to initialize or reset demo accounts.*

---

## 📡 REST API Reference

Full interactive documentation is generated automatically via OpenAPI at `http://localhost:5000/docs`.

### Authentication Endpoints
| Method | Route | Description |
|:---|:---|:---|
| `POST` | `/api/auth/register` | Register a new user account |
| `POST` | `/api/auth/login` | Authenticate user & return JWT token |
| `GET` | `/api/auth/me` | Fetch authenticated user profile |

### Job Management Endpoints
| Method | Route | Role | Description |
|:---|:---|:---|:---|
| `GET` | `/api/jobs` | Public/Auth | List all active job postings |
| `GET` | `/api/jobs/my` | Manager | List manager's created job postings |
| `GET` | `/api/jobs/stats` | Manager | Fetch recruiting statistics & metrics |
| `POST` | `/api/jobs` | Manager | Create a new job posting |
| `PUT` | `/api/jobs/{id}` | Manager | Update existing job details |
| `DELETE` | `/api/jobs/{id}` | Manager | Delete a job posting |

### Application Management Endpoints
| Method | Route | Role | Description |
|:---|:---|:---|:---|
| `POST` | `/api/applications` | Student | Submit job application |
| `GET` | `/api/applications/my` | Student | Fetch candidate's application history |
| `GET` | `/api/applications/stats` | Student | Candidate dashboard analytics |
| `GET` | `/api/applications/job/{id}` | Manager | Fetch applicants for a specific job |
| `PUT` | `/api/applications/{id}/status` | Manager | Update candidate application stage |

### Aggregator & Scraper Endpoints
| Method | Route | Role | Description |
|:---|:---|:---|:---|
| `GET` | `/api/scraper/search` | Student | Scrape live external jobs (LinkedIn, Naukri, etc.) |

---

## 📄 License

This project is licensed under the **MIT License**.

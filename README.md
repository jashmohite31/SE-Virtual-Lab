# 🔬 Software Engineering Virtual Lab (SE-Virtual-Lab)

[![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.1-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express-4.19-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.2-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> An interactive, sandbox-based virtual laboratory platform designed for Computer Science and Software Engineering education. Explore, design, calculate, simulate, and assess real-world software engineering processes directly in your browser.

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Interactive Laboratories](#-interactive-laboratories)
- [Role-Based Portals](#-role-based-portals)
- [Technology Stack](#-technology-stack)
- [Repository Architecture](#-repository-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
  - [Running the Application](#running-the-application)
- [Default Seed Accounts](#-default-seed-accounts)
- [API Overview](#-api-overview)
- [Available Scripts](#-available-scripts)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

Theoretical software engineering concepts—such as requirement formulation, cyclomatic complexity, version control DAGs, and estimation models—can often feel abstract in a conventional classroom setting.

**Software Engineering Virtual Lab** bridges this gap by providing an end-to-end sandbox simulator. Students engage in interactive activities, execute branch merges, assemble UML class relationships, compute critical project paths, take auto-graded quizzes, and export academic lab reports and verifiable certificates.

Instructors and Administrators get dedicated dashboards to monitor real-time class attendance, quiz analytics, and student submission milestones.

---

## ✨ Key Features

- 🧪 **6 Core Virtual Laboratories**: Curriculum-aligned software engineering experiments covering requirements engineering, system design, testing, version control, risk management, and project scheduling.
- 👥 **Role-Based Access Control (RBAC)**: Distinct, tailored interfaces for **Students**, **Instructors / Teachers**, and **Administrators**.
- 📝 **Automated Assessment Engine**: Multi-question experiment quizzes with instant feedback, randomized question banks, passing thresholds, and retry limits.
- 📄 **Academic Report Generator**: Generate and download formatted PDF laboratory reports containing diagram exports, test inputs, and activity solutions using `jsPDF` and `html2canvas`.
- 🎓 **Verifiable Completion Certificates**: Issue tamper-resistant completion certificates complete with unique verification identifiers upon fulfilling curriculum requirements.
- 🏆 **Gamified Leaderboards**: Real-time ranking based on experiment completion speed and assessment scores to encourage student engagement.
- 📊 **Instructor Analytics & Attendance**: Monitor class-wide completion curves, track attendance records, and review student performance heat maps.
- 🌓 **Modern UI/UX**: Responsive interface built with Tailwind CSS, React Flow diagrams, Framer Motion animations, and full dark-mode compatibility.

---

## 🔬 Interactive Laboratories

| # | Laboratory Experiment | Slug | Key Concepts Covered | Interactive Capabilities |
|---|----------------------|------|----------------------|--------------------------|
| **01** | **Software Requirements Specification (SRS)** | `srs-generator` | IEEE 830 Standard, Functional (FR) & Non-Functional (NFR) Requirements | Archetype selection, drag-and-drop requirement builder, validation checks, IEEE-compliant PDF export |
| **02** | **Unified Modelling Language (UML)** | `uml-lab` | Class Diagrams, Use Case Diagrams, OOP Relationships | Interactive React Flow canvas, class/actor definition, connection rules & circular inheritance validator, JSON export |
| **03** | **Software Quality Assurance (SQA)** | `white-box-testing` | White-Box Testing, Control Flow Graphs (CFG), Cyclomatic Complexity | Code parser, CFG node/edge mapper, $V(G) = E - N + 2P$ and $P + 1$ computation, test case path coverage analyzer |
| **04** | **Software Configuration Management (SCM)** | `scm-git-simulator` | Version Control, Staging, Commits, Branching, Merging | Interactive simulated Git terminal, dynamic commit DAG graph, branching, conflict resolution editor |
| **05** | **Risk Management** | `risk-management` | Risk Identification, Assessment, Exposure, Mitigation | Project scenario analysis, 5x5 Likelihood × Impact rating matrix, mitigation planning (Avoid, Mitigate, Transfer, Accept) |
| **06** | **Project Management & Scheduling** | `project-scheduling` | Work Breakdown Structure (WBS), Task Dependencies, Critical Path | Dependency configuration, critical path identification, resource allocation, dynamic Gantt chart |

---

## 👥 Role-Based Portals

```
+------------------------------------------------------------------------+
|                     Software Engineering Virtual Lab                   |
+-------------------+--------------------+-------------------------------+
|     Student       |      Teacher       |             Admin             |
+-------------------+--------------------+-------------------------------+
| • 6 Core Labs     | • Class Roster     | • User Role Management        |
| • Quizzes & Tests | • Attendance Logs  | • Global Platform Health      |
| • PDF Lab Reports | • Gradebook & Stats| • Experiment Configuration    |
| • Certificates    | • Activity Review  | • System Security & Analytics |
| • Leaderboard     | • Class Trends     | • Audit & Logs                |
+-------------------+--------------------+-------------------------------+
```

---

## 🛠️ Technology Stack

### **Frontend (`/client`)**
- **Core**: React 18 (Vite)
- **Styling**: Tailwind CSS, PostCSS, Lucide React Icons
- **Interactive Canvases**: React Flow (`reactflow`), `@dnd-kit` (Drag & Drop)
- **Data Visualization**: Chart.js, `react-chartjs-2`
- **Animation**: Framer Motion
- **State & Server Queries**: TanStack React Query v5, Axios
- **Form Management**: React Hook Form
- **Export Utilities**: jsPDF, `jspdf-autotable`, html2canvas

### **Backend (`/server`)**
- **Runtime & Framework**: Node.js (ES Modules), Express.js
- **Database & ODM**: MongoDB, Mongoose
- **Authentication**: JWT (Access & Refresh tokens via HTTP-only Cookies), bcryptjs
- **Validation**: Zod schema validation
- **Middleware**: CORS, Cookie-Parser, centralized error handler

### **Monorepo & Shared (`/shared`)**
- Managed with **npm workspaces**
- Centralized constants, experiment metadata, and shared schemas

---

## 📁 Repository Architecture

```text
SE-Virtual-Lab/
├── client/                     # Vite + React Frontend Application
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── features/           # Modular domain features
│   │   │   ├── auth/           # Login, Register, Role checks
│   │   │   ├── certificates/   # Certificate viewer & PDF builder
│   │   │   ├── dashboard/      # Student, Teacher, & Admin dashboards
│   │   │   ├── experiments/    # 6 Core laboratory activities
│   │   │   └── leaderboard/    # Gamified student ranking
│   │   ├── pages/              # Landing, 404, and public pages
│   │   ├── routes/             # Protected & Role-guarded routing
│   │   ├── shared/             # Reusable UI cards, quiz engine, report generator
│   │   └── styles/             # Global styles and Tailwind configuration
│   └── package.json
│
├── server/                     # Express REST API Backend
│   ├── src/
│   │   ├── config/             # DB connection, Zod environment loader
│   │   ├── middleware/         # Auth verification, role checks, error handlers
│   │   ├── modules/            # API feature modules
│   │   │   ├── analytics/      # Class & dashboard performance aggregations
│   │   │   ├── attendance/     # Teacher/student attendance logs
│   │   │   ├── auth/           # Auth controllers & JWT token issuance
│   │   │   ├── certificates/   # Certificate generation & validation logic
│   │   │   ├── experiments/    # Experiment schema and metadata APIs
│   │   │   ├── notifications/  # Notification services
│   │   │   ├── progress/       # Student lab completion tracking
│   │   │   ├── quizzes/        # Question banks and submission evaluations
│   │   │   └── users/          # User management and profile operations
│   │   ├── routes/             # Central API router
│   │   └── server.js           # Server bootstrap & database seeding
│   ├── .env.example
│   └── package.json
│
├── shared/                     # Shared models, constants, and experiment catalogs
│   ├── constants.js            # Default question banks & system constants
│   ├── experimentTypes.js      # Experiment definitions and meta properties
│   └── package.json
│
├── package.json                # Root package.json with npm workspaces
└── README.md                   # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [npm](https://www.npmjs.com/) (v9.0.0 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) running locally (port `27017`) or a [MongoDB Atlas](https://www.mongodb.com/atlas) connection URI.

---

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/jashmohite31/SE-Virtual-Lab.git
   cd SE-Virtual-Lab
   ```

2. **Install all workspace dependencies:**
   ```bash
   npm install
   ```
   *(This installs dependencies across the root, `client`, `server`, and `shared` workspaces automatically).*

---

### Environment Configuration

Create a `.env` file inside the `server/` directory:

```bash
# In Linux/macOS:
cp server/.env.example server/.env

# In Windows (Command Prompt):
copy server\.env.example server\.env

# In Windows (PowerShell):
Copy-Item server\.env.example server\.env
```

Review or modify your `server/.env` parameters:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/software-engineering-virtual-lab
JWT_SECRET=super_secret_access_token_key_12345
JWT_REFRESH_SECRET=super_secret_refresh_token_key_67890
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
ADMIN_EMAIL=admin@virtuallab.com
ADMIN_PASSWORD=SecureAdminPass123!
```

---

### Running the Application

To run both the backend server and frontend client concurrently:

```bash
npm run dev
```

Once started:
- **Client Application**: [http://localhost:5173](http://localhost:5173)
- **Backend API Server**: [http://localhost:5000](http://localhost:5000)

Alternatively, you can run services independently:
```bash
# Run server only
npm run dev:server

# Run client only
npm run dev:client
```

---

## 🔑 Default Seed Accounts

On initial startup, the backend automatically seeds the database with experiment metadata, default quiz banks, and an administrative account:

| Role | Email | Password | Permissions |
|------|-------|----------|-------------|
| **Admin** | `admin@virtuallab.com` | `SecureAdminPass123!` | System statistics, user role promotion, system management |
| **Student** | *(Register via `/register`)* | *(Your Password)* | Access to all experiments, quizzes, report downloads, leaderboard |
| **Teacher** | *(Register via `/register`)* | *(Your Password)* | Access to teacher dashboard, attendance logs, student performance |

---

## 📡 API Overview

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user (`student`, `teacher`, `visitor`) | Public |
| `POST` | `/api/auth/login` | Authenticate user and issue JWT cookies | Public |
| `POST` | `/api/auth/logout` | Invalidate active session and clear cookies | Authenticated |
| `GET` | `/api/auth/me` | Fetch currently authenticated user profile | Authenticated |
| `GET` | `/api/experiments` | List all available lab experiments | Authenticated |
| `GET` | `/api/experiments/:slug` | Retrieve single experiment metadata and theory | Authenticated |
| `GET` | `/api/quizzes/:experimentId` | Retrieve quiz question bank for an experiment | Authenticated |
| `POST` | `/api/quizzes/submit` | Submit quiz responses and receive graded score | Student |
| `GET` | `/api/progress` | Fetch student progress across all experiments | Student |
| `POST` | `/api/progress/complete-activity` | Mark interactive simulation task completed | Student |
| `GET` | `/api/analytics/dashboard` | Fetch aggregated metrics (role-specific view) | Authenticated |
| `GET` | `/api/attendance` | Fetch attendance records | Teacher / Admin |
| `POST` | `/api/attendance/mark` | Record session attendance | Teacher / Student |
| `GET` | `/api/certificates` | View issued student certificates | Student |

---

## 📜 Available Scripts

In the repository root, you can execute:

| Command | Description |
|---|---|
| `npm run dev` | Runs both client (`Vite`) and server (`Nodemon`) concurrently |
| `npm run dev:client` | Starts Vite dev server for frontend on `http://localhost:5173` |
| `npm run dev:server` | Starts Express backend using Nodemon on `http://localhost:5000` |
| `npm run build` | Builds production-ready bundles for both client and server |
| `npm run build:client` | Builds frontend assets to `client/dist` |
| `npm start` | Starts production Express server (`node server/src/server.js`) |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use, modify, and distribute for educational and non-commercial purposes.

---

<p align="center">
  Developed with ❤️ for Computer Science & Software Engineering Students worldwide.
</p>

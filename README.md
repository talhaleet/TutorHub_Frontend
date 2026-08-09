# TutorHub — Frontend

TutorHub is an online tutor-booking platform that connects **Students** and **Parents** with **Tutors** for one-on-one learning sessions. This repository is the **React frontend** — the client application that consumes a separate ASP.NET Core backend API.

The app is role-aware: a single codebase serves four distinct experiences (Student, Parent, Tutor, Admin) behind route-level access control, with real-time chat/notifications and in-app payments built in.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Deployment](#deployment)
- [Architecture Notes](#architecture-notes)
- [Contributing](#contributing)

---

## Features

**Public**
- Landing page, tutor search with filters/sort, public tutor profiles
- Auth flows: register, login, email verification, forgot/reset password
- Static/info pages: How It Works, For Tutors, Pricing, Help Center, Contact, Privacy, Terms, Cookies

**Student / Parent**
- AI-assisted tutor recommendations (`/assistant/tutor`)
- Book a session, pay for it (Stripe), and view payment history
- Student dashboard and booking management
- Parent dashboard with multiple child profile management

**Tutor**
- Tutor dashboard, profile editor, availability calendar
- Document uploads (for verification), bookings management, earnings overview

**Admin**
- User management, tutor approval workflow
- Bookings oversight, subject management, analytics dashboard

**Shared across roles**
- Real-time chat (SignalR) and notifications with unread counters
- Centralized profile/account settings

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite |
| Routing | React Router v7 |
| Styling | Tailwind CSS |
| Server state / caching | TanStack React Query |
| Client state | Zustand |
| Forms & validation | React Hook Form + Zod |
| HTTP client | Axios (with auth interceptors) |
| Real-time | Microsoft SignalR |
| Payments | Stripe (`@stripe/react-stripe-js`) |
| Charts | Recharts |
| Misc UI | react-datepicker, react-select, react-star-ratings, react-hot-toast, canvas-confetti |
| Linting | ESLint |
| Containerization | Docker + Nginx (reverse proxy to the backend) |

---

## Project Structure

```
TutorHub/
├── src/
│   ├── components/
│   │   ├── layout/        # Navbar, Footer, sidebars per role, ProtectedRoute
│   │   ├── booking/        # Booking cards, status badges, modals
│   │   ├── tutor/          # Tutor cards, availability grid, reviews
│   │   ├── search/          # Search bar, filters, sorting
│   │   ├── payment/         # Price breakdown, checkout UI
│   │   ├── assistant/       # AI tutor-recommendation UI
│   │   ├── common/          # Avatar, pagination, spinners, empty/error states
│   │   └── ui/               # Low-level UI primitives (auth cards, etc.)
│   ├── pages/                # One file per route (Student/Parent/Tutor/Admin/Public)
│   ├── hooks/                 # useAuth, useSignalR, useTutorSearch, useBookingForm, ...
│   ├── services/               # API modules — one per domain (auth, booking, tutor, chat, payment...)
│   ├── store/                   # Zustand stores: auth, chat, notifications
│   ├── validators/               # Zod schemas per form (auth, booking, review, tutor profile)
│   ├── utils/                     # Constants, formatters, token/role utilities
│   ├── data/                       # Mock data (used during standalone frontend development)
│   ├── App.jsx                      # Route definitions & role-based route guards
│   └── main.jsx
├── public/
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
└── vite.config.js
```

---

## Getting Started

### Prerequisites
- Node.js 20+
- npm
- A running instance of the TutorHub backend API (for full functionality)

### Installation

```bash
# Clone the repository
git clone https://github.com/talhaleet/TutorHub_Frontend.git
cd TutorHub_Frontend/TutorHub

# Install dependencies
npm install

# Create your local environment file
# (see Environment Variables below, then create a .env with those keys)
```

### Run in development

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (Vite's default).

### Build for production

```bash
npm run build
npm run preview   # preview the production build locally
```

---

## Environment Variables

The app is configured entirely through Vite env variables (`import.meta.env`). Create a `.env` file in `TutorHub/`:

| Variable | Purpose | Example |
|---|---|---|
| `VITE_API_URL` | Base URL of the backend REST API. Leave empty in Docker (Nginx proxies `/api/*` to the backend container). | `http://localhost:5000` |
| `VITE_HUBS_URL` | SignalR hub URL for chat/notifications. Falls back to `${VITE_API_URL}/hubs/chat` if unset. | `http://localhost:5000/hubs/chat` |
| `VITE_STRIPE_PK` | Stripe publishable key, used for the in-app checkout flow. | `pk_test_...` |

> In local development you typically set `VITE_API_URL` to point directly at your backend. In the Dockerized setup, Nginx (see `nginx.conf`) proxies `/api/` and `/hubs/` to the backend container, so `VITE_API_URL` can be left blank.

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |
| `npm run deploy` | Build and publish `dist/` to GitHub Pages (`gh-pages`) |

---

## Deployment

**Docker (recommended for local/staging parity with the backend):**

```bash
docker compose up --build
```

This builds the app in a `node:20-alpine` stage, then serves the static build via Nginx on port `4000`. Nginx forwards `/api/*` and `/hubs/*` to the backend (configured for `localhost:5000` by default — update `nginx.conf` for other environments).

**GitHub Pages:**

```bash
npm run deploy
```

Publishes the `dist/` folder to the `gh-pages` branch, served from the `homepage` configured in `package.json`.

---

## Architecture Notes

- **Auth**: JWT-based, persisted via `authStore` (Zustand); Axios attaches the bearer token to every request and force-logs-out on `401`.
- **Route protection**: `ProtectedRoute` gates authenticated routes and, where relevant, restricts by `allowedRoles` (`Student`, `Parent`, `Tutor`, `Admin`).
- **Server state**: TanStack Query handles fetching/caching/invalidation for API data, layered on top of the Axios service modules in `src/services/`.
- **Real-time**: A single SignalR connection (`chatHubClient`) is shared app-wide for chat messages, message updates/deletes, typing indicators, and notifications.

---

## Contributing

This is a Final Year Design Project built by **Muhammad Talha** (frontend, this repo) and **Muhammad Haseeb** (backend, ASP.NET Core). Contributions from the team follow a feature-branch workflow:

```bash
git checkout -b feature/your-feature-name
git commit -m "feat: describe your change"
git push origin feature/your-feature-name
```

Open a pull request against `main` for review.
Open Source 

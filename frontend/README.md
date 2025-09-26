# MentorNest Frontend

A creative, educational, and responsive frontend for the MentorNest Online Mentorship Platform. It delivers a welcoming, inspiring experience for learners and mentors with a bright palette, subtle animations, and modern UI components.

## Tech Stack
- React (Vite)
- Tailwind CSS
- Framer Motion
- React Router
- React Icons, React Hot Toast

## Key Features
- Hero with CTA, featured mentors, upcoming sessions, success stories
- Student dashboard with course cards, progress trackers, upcoming sessions
- Mentor dashboard with scheduled sessions, student requests, profile highlights
- Fully responsive grid/flex layouts with smooth transitions and hover effects
- Clean, scalable component structure

## Getting Started
1) Install dependencies
```bash
cd frontend
npm ci
```
2) Run in development
```bash
npm run dev
```
3) Build for production
```bash
npm run build
```

## Environment
Set the backend base URL (no trailing `/api` — the client appends `/api`).
```
# Local dev
VITE_API_BASE_URL=http://localhost:8081

# Production example
VITE_API_BASE_URL=https://mentornest.onrender.com
```
You can place these in `.env.development` and `.env.production` respectively.

## Structure
```
frontend/
  src/
    pages/
    components/
    services/
    context/
```

## Quality
- Accessible colors and focus states
- Consistent spacing, typography, and motion
- Linting and formatting aligned with Tailwind and React best practices

## Deployment
- Any static hosting (Vercel, Netlify). Serve `dist/` after build.

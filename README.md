# MentorNest - Online Mentorship Platform

MentorNest is a full-stack platform that connects students with mentors, delivers course content, and issues completion certificates. The app ships as a React frontend and a Spring Boot API backed by MongoDB.

## Highlights
- Course browsing, enrollment, and module progress tracking
- Mentor directory and course management
- Admin analytics and user management
- Certificate generation and download
- Razorpay payment integration

## Tech Stack
**Frontend**: React 19, Vite, Tailwind CSS, Framer Motion, React Router, Axios
**Backend**: Spring Boot 3.2.6, Spring Security, JWT, MongoDB, Maven

## Project Structure
```
MentorNest/
├── frontend/                # React app
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   └── utils/
│   └── package.json
├── backend/                 # Spring Boot API
│   ├── src/main/java/com/omp/
│   ├── src/main/resources/
│   ├── uploads/
│   └── pom.xml
└── README.md
```

## Quick Start
### Prerequisites
- Java 21+
- Node.js 18+
- MongoDB (local or Atlas)

### Backend
```
cd backend
mvn spring-boot:run
```
API runs on `http://localhost:8081/api` and health check is `GET /api/health`.

### Frontend
```
cd frontend
npm ci
npm run dev
```
App runs on `http://localhost:5173`.

## Environment Variables
### Backend (env or backend/.env)
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRATION` (default 18000000)
- `JWT_REFRESH_EXPIRATION` (default 604800000)
- `SERVER_PORT` (default 8081)
- `FILE_UPLOAD_DIR` (default uploads/)
- `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`

### Frontend (.env.development / .env.production)
```
VITE_API_BASE_URL=http://localhost:8081
```

## Useful Scripts
### Frontend
```
npm run dev
npm run lint
npm run build
```

### Backend
```
mvn spring-boot:run
mvn test
```

## Notes
- Dev seed data only loads if you run with `SPRING_PROFILES_ACTIVE=dev`.
- For detailed setup steps, see [frontend/README.md](frontend/README.md) and [backend/README.md](backend/README.md).

## License
MIT (see [LICENSE](LICENSE)).
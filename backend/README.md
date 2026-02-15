# MentorNest Backend

Spring Boot API powering the MentorNest platform with authentication, course management, enrollments, certificates, and secure payments.

## Tech Stack
- Spring Boot 3
- Spring Security + JWT
- Spring Data MongoDB (MongoDB Atlas recommended)
- Maven
- Razorpay (payments)

## Quick Start (Dev)
Backend runs on port 8081. Health check: `GET http://localhost:8081/api/health`.

1) Provide MongoDB connection
	- Preferred: Use MongoDB Atlas and set `MONGODB_URI`.
	- The app loads variables from `backend/.env` automatically (via spring-dotenv) and from your terminal environment.

2) Start the API
```
cd backend
npm run dev
```
API is available at `http://localhost:8081/api`.

3) Build/package
```
mvn clean package -DskipTests
```

## MongoDB Atlas Setup (Option A)
Use a real Atlas URI, allow your IP, and start the app.

1) Create a Database User in Atlas and a Database (e.g., `mentornest`).
2) Network Access: Add your current IP (or 0.0.0.0/0 for dev only).
3) Get the SRV connection string and URL-encode your password if it contains special characters.
	- Example: `mongodb+srv://<user>:<encoded_password>@<cluster-host>/mentornest?retryWrites=true&w=majority`

Windows cmd (temporary for current terminal session):
```
set MONGODB_URI=mongodb+srv://<user>:<encoded_password>@<cluster-host>/mentornest?retryWrites=true&w=majority
set JWT_SECRET=replace_with_secure_32char_min_secret
set SERVER_PORT=8081
```

Windows cmd (persist across new terminals for current user):
```
setx MONGODB_URI "mongodb+srv://<user>:<encoded_password>@<cluster-host>/mentornest?retryWrites=true&w=majority"
setx JWT_SECRET "replace_with_secure_32char_min_secret"
setx SERVER_PORT "8081"
```
Notes:
- After `setx`, close and reopen your terminal for changes to take effect.
- If using `backend/.env`, you can set `MONGODB_URI=...` there instead (do not commit real secrets).
- The app falls back to `mongodb://localhost:27017/mentornest` only if `MONGODB_URI` is not set.

## Configuration
Key properties (all env-driven):
- `MONGODB_URI` – Mongo connection string
- `JWT_SECRET`, `JWT_EXPIRATION`, `JWT_REFRESH_EXPIRATION`
- `SERVER_PORT` (default 8081)
- `FILE_UPLOAD_DIR` (default `uploads/`)
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` (required for live checkout)
- `APP_FRONTEND_URL` (base URL for password reset links; falls back to `BASE_URL`)

Profiles:
- Dev defaults are in `src/main/resources/application.properties`
- Prod overrides in `src/main/resources/application-prod.properties`
- `.env` in `backend/` is auto-loaded in both cases

## Payments (Razorpay)
- Backend exposes endpoints under `/api/payment/razorpay/*` to create orders and verify signatures.
- Only the `keyId` is sent to the browser. The `keySecret` stays on the server.

## Main Endpoints
- Auth: `/api/auth/login`, `/api/auth/register`, `/api/auth/logout`, `/api/auth/me`
- Courses: `/api/courses` (public list), `/api/admin/courses` (admin CRUD)
- Student: `/api/student/my-courses`, `/api/student/courses/{id}/modules`, `.../progress`
- Mentors: `/api/mentors` (public list)
- Health: `/api/health`
- Payments: `/api/payment/*`

## Testing
```
mvn test
```

## Docker
- Multi-stage Dockerfile included. Build with Maven, run on Temurin JRE.
- Provide env vars at runtime (e.g., `MONGODB_URI`, `JWT_SECRET`).

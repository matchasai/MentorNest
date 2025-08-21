# MentorNest Backend

Spring Boot API powering the MentorNest platform with authentication, course management, enrollments, and certificates.

## Tech Stack
- Spring Boot 3
- Spring Security + JWT
- JPA/Hibernate
- MySQL
- Maven

## Getting Started
1) Configure database in `backend/src/main/resources/application.properties`.
2) Build and run:
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
API available at `http://localhost:8080/api`.

## Main Endpoints
- Auth: `/api/auth/login`, `/api/auth/register`, `/api/auth/logout`, `/api/auth/me`
- Courses: `/api/courses` (public list), `/api/admin/courses` (admin CRUD)
- Student: `/api/student/my-courses`, `/api/student/courses/{id}/modules`, `.../progress`
- Mentors: `/api/mentors` (public list)
- Payments: `/api/payment/*`

## Development
- Java 17+
- MySQL 8+
- Use Flyway migrations in `backend/src/main/resources/db/migration`

## Testing
```bash
mvn test
```

## Deployment
- Package with `mvn clean package`
- Configure environment vars for DB and JWT secret

########## Frontend build stage ##########
FROM node:18-bullseye-slim AS frontend-build
WORKDIR /app/frontend
COPY frontend/ .
RUN npm ci || npm install \
 && npm run build

########## Backend build stage ##########
FROM maven:3.9.8-eclipse-temurin-17 AS backend-build
WORKDIR /app/backend
COPY backend/ .
RUN mvn -q -DskipTests package

########## Runtime stage ##########
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Copy backend jar
COPY --from=backend-build /app/backend/target/backend-1.0-SNAPSHOT.jar /app/app.jar

# Copy frontend build output to a public folder served by Spring (ResourceHandler in app can serve if configured)
COPY --from=frontend-build /app/frontend/dist /app/public

# Create uploads directories
RUN mkdir -p /app/uploads /app/uploads/certificates /app/uploads/courses /app/uploads/modules

EXPOSE 8081
CMD ["java", "-jar", "-Dspring.profiles.active=prod", "/app/app.jar"]

# Multi-stage build for MentorNest
# Stage 1: Build Frontend
FROM node:18-alpine as frontend-build

WORKDIR /client
COPY client/package*.json ./
RUN npm install

COPY client/ ./
RUN npm run build

# Stage 2: Build Backend
FROM openjdk:17-jdk-slim as backend-build

WORKDIR /app
COPY backend/mvnw backend/mvnw.cmd backend/pom.xml ./
COPY backend/.mvn ./.mvn
COPY backend/src ./src

# Make mvnw executable
RUN chmod +x ./mvnw

# Build the application
RUN ./mvnw clean package -DskipTests

# Stage 3: Runtime
FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy the built jar from backend-build stage
COPY --from=backend-build /app/target/backend-1.0-SNAPSHOT.jar ./app.jar

# Copy the built frontend from frontend-build stage
COPY --from=frontend-build /client/dist ./public

# Expose port
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "-Dserver.port=8080", "-Dspring.profiles.active=prod", "app.jar"]

# Multi-stage build for MentorNest
# Stage 1: Build Frontend  
FROM node:18-alpine as frontend-build

WORKDIR /frontend
COPY ../frontend/package*.json ./
RUN npm install

COPY ../frontend/ ./
RUN npm run build

# Stage 2: Build Backend
FROM maven:3.9.4-openjdk-17-slim as backend-build

WORKDIR /app
COPY pom.xml ./
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Stage 3: Runtime
FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy the built jar from backend-build stage
COPY --from=backend-build /app/target/backend-1.0-SNAPSHOT.jar ./app.jar

# Copy the built frontend from frontend-build stage
COPY --from=frontend-build /frontend/dist ./public

# Expose port
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "-Dserver.port=8080", "-Dspring.profiles.active=prod", "app.jar"]

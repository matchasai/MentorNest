# Simplified single-stage build for MentorNest
FROM openjdk:17-jdk-slim

WORKDIR /app

# Install Node.js and npm
RUN apt-get update && \
    apt-get install -y curl wget && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean

# Install Maven
RUN wget https://downloads.apache.org/maven/maven-3/3.8.6/binaries/apache-maven-3.8.6-bin.tar.gz && \
    tar -xzf apache-maven-3.8.6-bin.tar.gz && \
    mv apache-maven-3.8.6 /opt/maven && \
    rm apache-maven-3.8.6-bin.tar.gz

ENV PATH="/opt/maven/bin:${PATH}"

# Copy and build frontend
COPY frontend ./frontend
WORKDIR /app/frontend
RUN npm install && npm run build

# Copy and build backend
WORKDIR /app
COPY backend/pom.xml ./
COPY backend/src ./src
RUN mvn clean package -DskipTests

# Copy frontend build to backend static resources
RUN mkdir -p ./public && cp -r ./frontend/dist/* ./public/

# Expose port
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "-Dserver.port=8080", "-Dspring.profiles.active=prod", "target/backend-1.0-SNAPSHOT.jar"]

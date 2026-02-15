########## Backend build stage ##########
FROM maven:3.9.8-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn -q -DskipTests package

########## Runtime stage ##########
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Copy the built JAR
COPY --from=build /app/target/backend-1.0-SNAPSHOT.jar /app/app.jar

# Create uploads directory (can be overridden via FILE_UPLOAD_DIR)
RUN mkdir -p /app/uploads

ENV SPRING_PROFILES_ACTIVE=prod
EXPOSE 8081

CMD ["java", "-jar", "/app/app.jar"]

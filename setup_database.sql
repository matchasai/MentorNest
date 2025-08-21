-- Database setup script for MentorNest (Online Mentorship Platform)
-- Run this script in MySQL to create the database and tables

-- Create database
CREATE DATABASE IF NOT EXISTS mentornest_db;
USE mentornest_db;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    active BOOLEAN DEFAULT TRUE
);

-- Create mentors table
CREATE TABLE IF NOT EXISTS mentors (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    expertise VARCHAR(255) NOT NULL,
    bio VARCHAR(1000),
    image_url VARCHAR(255),
    CONSTRAINT fk_mentor_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
    price DOUBLE NOT NULL,
    mentor_id BIGINT NOT NULL,
    CONSTRAINT fk_course_mentor FOREIGN KEY (mentor_id) REFERENCES mentors(id) ON DELETE CASCADE
);

-- Create modules table
CREATE TABLE IF NOT EXISTS modules (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    video_url VARCHAR(255) NOT NULL,
    summary VARCHAR(1000),
    course_id BIGINT NOT NULL,
    CONSTRAINT fk_module_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Create enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    certificate_url VARCHAR(255),
    CONSTRAINT fk_enrollment_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_enrollment_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE (user_id, course_id)
);

-- Create completed_modules table
CREATE TABLE IF NOT EXISTS completed_modules (
    enrollment_id BIGINT NOT NULL,
    module_id BIGINT NOT NULL,
    PRIMARY KEY (enrollment_id, module_id),
    CONSTRAINT fk_completed_enrollment FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE CASCADE,
    CONSTRAINT fk_completed_module FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
);

-- Create certificates table
CREATE TABLE IF NOT EXISTS certificates (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    issued_at DATETIME NOT NULL,
    url VARCHAR(255) NOT NULL,
    CONSTRAINT fk_certificate_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_certificate_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Insert sample data
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@mentornest.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'ADMIN'),
('Student User', 'student@mentornest.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'STUDENT'),
('Mentor User', 'mentor@mentornest.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'MENTOR');

-- Insert mentor
INSERT INTO mentors (user_id, expertise, bio) VALUES
(3, 'Full Stack Development', 'Experienced full-stack developer with expertise in modern web technologies.');

-- Insert course
INSERT INTO courses (title, description, price, mentor_id) VALUES
('Full Stack Development', 'Learn modern web development with React, Node.js, and MySQL', 99.99, 1);

-- Insert modules
INSERT INTO modules (title, video_url, summary, course_id) VALUES
('Introduction to React', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Learn the basics of React framework', 1),
('Node.js Backend', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Build RESTful APIs with Node.js', 1),
('Database Design', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Design and implement MySQL databases', 1);

-- Insert enrollment for student
INSERT INTO enrollments (user_id, course_id) VALUES (2, 1);

-- Insert completed modules
INSERT INTO completed_modules (enrollment_id, module_id) VALUES (1, 1);

COMMIT; 
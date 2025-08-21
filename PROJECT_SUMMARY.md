# MentorNest - Online Mentorship Platform

## Project Overview
A comprehensive full-stack learning management system built with React.js frontend and Spring Boot backend.

## ✨ Features Implemented

### 🎯 Core Functionality
- **User Authentication**: Secure JWT-based login/register system
- **Course Management**: Complete course catalog with enrollment system
- **Module System**: Interactive video-based learning modules
- **Progress Tracking**: Real-time completion tracking with circular progress bars
- **Certificates**: Auto-generated certificates upon course completion
- **Payment Integration**: Course payment system with modal interface

### 🎨 Enhanced UI/UX
- **Responsive Design**: Mobile-friendly interface with TailwindCSS
- **Animated Backgrounds**: Modern geometric patterns and floating elements
- **Video Players**: Enhanced video controls with fullscreen support
- **Interactive Components**: Hover effects, smooth transitions, and toast notifications
- **Progress Visualization**: Circular progress bars with percentage display

### 📚 Module Resources System
- **File Management**: Upload, view, and download module resources
- **Dynamic UI**: Shows actual resource filenames and availability
- **Multi-format Support**: PDFs, images, and other educational materials
- **Error Handling**: Robust error handling with user feedback

### 🔧 Technical Features
- **Real-time Updates**: Live progress tracking and status updates
- **File Storage**: Organized file system for uploads, certificates, and resources
- **Database Integration**: MySQL with proper relationships and constraints
- **Security**: CORS configuration, JWT authentication, and secure file serving

## 📁 Project Structure

```
OMP/
├── .vscode/                    # VS Code configuration
├── backend/                    # Spring Boot backend
│   ├── src/main/java/com/omp/
│   │   ├── config/            # Security, CORS, MVC configuration
│   │   ├── controller/        # REST API endpoints
│   │   ├── entity/            # JPA entities (User, Course, Module, etc.)
│   │   ├── repository/        # Data access layer
│   │   └── service/           # Business logic
│   ├── uploads/               # File storage
│   │   ├── certificates/      # Generated certificates
│   │   ├── courses/          # Course images
│   │   ├── modules/          # Module resources (PDFs, materials)
│   │   └── payments/         # Payment receipts
│   └── pom.xml               # Maven dependencies
├── frontend/                  # React.js frontend
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/           # Main application pages
│   │   ├── services/        # API service layer
│   │   └── context/         # React contexts (Auth, etc.)
│   ├── package.json         # NPM dependencies
│   └── vite.config.js       # Vite configuration
├── add_module_resources.sql  # Database schema update for resources
├── setup_database.sql       # Initial database setup
├── QUICK_SETUP.md           # Setup instructions
└── README.md                # This file
```

## 🛠 Technology Stack

### Backend
- **Java 17** with Spring Boot 3.2.6
- **Spring Security** for authentication
- **Spring Data JPA** for database operations
- **MySQL** database
- **JWT** for secure authentication
- **File Storage** for uploads and resources

### Frontend
- **React 19** with modern hooks
- **Vite** for fast development and building
- **TailwindCSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **Axios** for API communication
- **React Hot Toast** for notifications

## 🚀 Key Enhancements Made

### 1. Module Resources System
- Added `resource_url` field to Module entity
- Implemented file upload/download functionality
- Created dynamic UI for resource management
- Added proper error handling and user feedback

### 2. Enhanced Video Experience
- Fullscreen video support with custom controls
- Keyboard shortcuts for video navigation
- Auto-hide controls with smooth animations
- Support for both direct videos and YouTube embeds

### 3. Progress Tracking Improvements
- Fixed module counting to be course-specific
- Added percentage display to circular progress bars
- Real-time progress updates across the platform
- Accurate completion status tracking

### 4. Visual Design Enhancements
- Animated background with geometric shapes
- Hero section with background images
- Modern gradient overlays and effects
- Consistent design language throughout

### 5. Backend Optimizations
- Course-specific module queries for accurate counting
- Enhanced file serving with proper CORS configuration
- Improved error handling and response codes
- Organized file storage structure

## 📋 Installation & Setup

1. **Database Setup**:
   ```sql
   -- Run setup_database.sql first
   -- Then run add_module_resources.sql for resource support
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   mvn spring-boot:run
   # Runs on http://localhost:8081
   ```

3. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm run dev
   # Runs on http://localhost:5173
   ```

## 📊 Database Schema

### Core Tables
- `users` - User authentication and profiles
- `courses` - Course information and metadata
- `modules` - Learning modules with video and resources
- `enrollments` - Student course enrollments
- `completed_modules` - Progress tracking
- `payments` - Payment records

### Recent Additions
- `resource_url` column in modules table for file resources
- Enhanced file storage organization
- Proper foreign key relationships

## 🔒 Security Features
- JWT-based authentication
- Password encryption with BCrypt
- CORS configuration for cross-origin requests
- Secure file serving with access controls
- Protection against unauthorized access

## 📱 Responsive Design
- Mobile-first approach with TailwindCSS
- Responsive video players and modals
- Adaptive layouts for all screen sizes
- Touch-friendly interface elements

## 🎯 Current Status
✅ All core features implemented and working
✅ Module resources system fully functional
✅ Enhanced UI/UX with animations and modern design
✅ Proper error handling and user feedback
✅ Clean, organized codebase with documentation
✅ Database optimized with proper relationships

## 🚀 Future Enhancements (Optional)
- Real-time chat system for mentorship
- Advanced analytics and reporting
- Mobile app development
- Integration with external learning platforms
- AI-powered course recommendations

---

**Project Status**: ✅ Complete and Production Ready
**Last Updated**: August 9, 2025
**Version**: 1.0.0

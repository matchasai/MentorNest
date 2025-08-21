# MentorNest - Online Mentorship Platform

![MentorNest Logo](https://via.placeholder.com/200x100/2563eb/ffffff?text=MentorNest)

**Empowering Growth Through Mentorship**

MentorNest is a comprehensive online learning and mentorship platform designed to connect students with industry experts, provide access to curated courses, and foster a supportive learning community.

## 🌟 Features

### For Students
- **Course Catalog**: Browse and enroll in expertly curated courses
- **Interactive Learning**: Watch video lessons, download resources, track progress
- **Mentor Connection**: Direct access to industry professionals
- **Certificate System**: Earn verified certificates upon course completion
- **Progress Tracking**: Real-time dashboard with learning analytics
- **Community Support**: Connect with peers and mentors

### For Mentors
- **Course Creation**: Develop and publish comprehensive courses
- **Student Management**: Track student progress and engagement
- **Resource Sharing**: Upload course materials and resources
- **Analytics Dashboard**: Monitor course performance and student outcomes

### For Administrators
- **User Management**: Comprehensive user administration panel
- **Course Oversight**: Approve and manage course content
- **Analytics**: Platform-wide statistics and insights
- **Content Moderation**: Ensure quality and appropriateness

## 🚀 Tech Stack

### Frontend
- **React 19** - Modern UI library with latest features
- **Vite** - Lightning-fast development and build tool
- **Tailwind CSS** - Utility-first responsive design framework
- **Framer Motion** - Smooth animations and transitions
- **React Router** - Client-side routing
- **Axios** - HTTP client for API communication
- **React Hot Toast** - Elegant notifications

### Backend
- **Spring Boot 3.2.6** - Enterprise Java framework
- **Spring Security** - Authentication and authorization
- **JWT** - Stateless authentication tokens
- **MySQL** - Relational database
- **JPA/Hibernate** - Object-relational mapping
- **Maven** - Project management and dependencies

### DevOps & Tools
- **Git** - Version control
- **VS Code** - Development environment
- **Postman** - API testing
- **MySQL Workbench** - Database management

## 📱 Responsive Design

MentorNest is built with a **mobile-first approach**, ensuring optimal user experience across all devices:

- **Mobile (320px+)**: Touch-optimized navigation, stacked layouts, larger touch targets
- **Tablet (768px+)**: Grid layouts, sidebar navigation, enhanced interactions
- **Desktop (1024px+)**: Multi-column layouts, hover effects, keyboard shortcuts
- **Large Screens (1440px+)**: Maximum content width, optimized spacing

### Key Responsive Features
- Adaptive navigation with mobile hamburger menu
- Responsive grids and flexible layouts
- Scalable typography and images
- Touch-friendly interactive elements
- Optimized loading for different screen sizes

## 🏗️ Project Structure

```
MentorNest/
├── frontend/                   # React application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── Navbar.jsx    # Responsive navigation
│   │   │   ├── Footer.jsx    # Rich footer with links
│   │   │   └── ...
│   │   ├── pages/            # Main application pages
│   │   │   ├── Home.jsx      # Landing page
│   │   │   ├── Courses.jsx   # Course catalog
│   │   │   ├── Dashboard.jsx # Student dashboard
│   │   │   └── admin/        # Admin panel pages
│   │   ├── services/         # API service layer
│   │   ├── context/          # React contexts
│   │   └── utils/            # Utility functions
│   ├── public/               # Static assets
│   └── package.json          # Dependencies
├── backend/                   # Spring Boot application
│   ├── src/
│   │   ├── main/java/com/mentornest/
│   │   │   ├── config/       # Configuration classes
│   │   │   ├── controller/   # REST API endpoints
│   │   │   ├── entity/       # JPA entities
│   │   │   ├── repository/   # Data access layer
│   │   │   ├── service/      # Business logic
│   │   │   └── security/     # Security configuration
│   │   └── resources/
│   │       └── application.properties
│   ├── uploads/              # File storage
│   └── pom.xml               # Maven configuration
├── README.md                 # Root overview (see branch-specific READMEs)
└── setup_database.sql        # Database initialization
```

## 🚀 Quick Start

### Prerequisites
- **Java 17+**
- **Node.js 18+**
- **MySQL 8.0+**
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/matchasai/MentorNest.git
   cd MentorNest
   ```

2. **Setup Database**
   ```sql
   CREATE DATABASE mentornest_db;
   ```
   Run the SQL script:
   ```bash
   mysql -u root -p mentornest_db < setup_database.sql
   ```

3. **Backend Setup**
   ```bash
   cd backend
   # Update application.properties with your MySQL credentials
   mvn clean install
   mvn spring-boot:run
   ```
   Backend will run on `http://localhost:8080`

4. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

### Default Accounts
- **Admin**: admin@mentornest.com / admin123
- **Student**: student@mentornest.com / student123
- **Mentor**: mentor@mentornest.com / mentor123

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Refresh JWT token

### Course Endpoints
- `GET /api/courses` - List all courses
- `GET /api/courses/{id}` - Get course details
- `POST /api/student/courses/{id}/enroll` - Enroll in course

### Student Endpoints
- `GET /api/student/dashboard` - Student dashboard data
- `GET /api/student/courses/{id}/modules` - Get course modules
- `POST /api/student/courses/{id}/modules/{moduleId}/complete` - Mark module complete

### Admin Endpoints
- `GET /api/admin/users` - List all users
- `POST /api/admin/courses` - Create new course
- `PUT /api/admin/courses/{id}` - Update course

## 🎨 Design System

### Color Palette
- **Primary**: Blue (`#2563eb`)
- **Secondary**: Green (`#10b981`)
- **Accent**: Purple (`#8b5cf6`)
- **Warning**: Yellow (`#f59e0b`)
- **Error**: Red (`#ef4444`)
- **Success**: Green (`#22c55e`)

### Typography
- **Headings**: Inter, system-ui (Bold/Semibold)
- **Body**: Inter, system-ui (Regular/Medium)
- **Code**: Monaco, Consolas (Monospace)

### Spacing System
- **xs**: 0.25rem (4px)
- **sm**: 0.5rem (8px)
- **md**: 1rem (16px)
- **lg**: 1.5rem (24px)
- **xl**: 2rem (32px)

## 🔧 Development

### Available Scripts

#### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

#### Backend
```bash
mvn spring-boot:run  # Start development server
mvn clean install   # Build application
mvn test            # Run tests
```

### Code Quality
- **ESLint** for JavaScript/React code quality
- **Prettier** for code formatting
- **Spring Boot DevTools** for hot reload
- **Responsive design testing** across multiple breakpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Coding Standards
- Use meaningful variable and function names
- Follow React hooks best practices
- Implement responsive design patterns
- Write clean, self-documenting code
- Add comments for complex business logic

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Frontend Development**: React.js specialists
- **Backend Development**: Spring Boot experts
- **UI/UX Design**: Modern, responsive design
- **DevOps**: CI/CD and deployment automation

## 🔮 Future Roadmap

- [ ] Mobile app development (React Native)
- [ ] Real-time chat and video calls
- [ ] AI-powered course recommendations
- [ ] Advanced analytics and reporting
- [ ] Multi-language support
- [ ] Payment gateway integration
- [ ] Social learning features

## 📞 Support

For support, email support@mentornest.com or join our [Discord community](https://discord.gg/mentornest).

---

**Made with ❤️ for learners worldwide**

*MentorNest - Empowering Growth Through Mentorship* 
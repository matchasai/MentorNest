# Quick Setup Guide

## Step 1: Database Setup

1. **Start MySQL server**
2. **Create the database**:
   ```sql
   CREATE DATABASE omp_db;
   ```

## Step 2: Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Update database credentials** (if needed):
   Edit `src/main/resources/application.properties`:
   ```properties
   spring.datasource.username=your_mysql_username
   spring.datasource.password=your_mysql_password
   ```

3. **Run the backend**:
   ```bash
   mvn spring-boot:run
   ```
   
   The backend will:
   - Create all database tables automatically
   - Seed sample data (admin, student, mentor, course, modules)
   - Start on `http://localhost:8081`

## Step 3: Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the frontend**:
   ```bash
   npm run dev
   ```
   
   The frontend will start on `http://localhost:5173`

## Step 4: Test the Application

1. **Visit** `http://localhost:5173`
2. **Login with admin credentials**:
   - Admin: `admin@omp.com` / `admin123`
3. **Test frontend functionality**:
   - Register new users (students, mentors)
   - Create courses and modules
   - Test enrollment and progress tracking

## Troubleshooting

### If you get database connection errors:
- Ensure MySQL is running on port 3306
- Verify your MySQL credentials in `application.properties`
- Make sure the `omp_db` database exists

### If you get 403 errors:
- Clear browser cookies and local storage
- Restart both backend and frontend
- Check browser console for detailed error messages

### If the backend won't start:
- Check if port 8081 is available
- Verify all dependencies are installed
- Check the application logs for specific errors

## Expected Behavior

1. **First visit**: You should see the home page without any errors
2. **Login**: Should redirect to appropriate dashboard based on role
3. **Admin**: Can manage users, courses, and mentors
4. **Student**: Can enroll in courses and track progress
5. **Mentor**: Can manage their courses and modules 
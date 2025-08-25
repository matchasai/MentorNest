# MentorNest Environment Setup Guide

## 📋 Environment Variables Setup for Render Deployment

### 1. **Get Railway Database Credentials**
Go to your Railway Dashboard → Your MySQL Database Service → Variables tab and copy:

- `MYSQL_HOST` (e.g., `mysql.railway.internal`)  
- `MYSQL_PORT` (usually `3306`)
- `MYSQL_DATABASE` (usually `railway`)
- `MYSQL_USER` (usually `root`)
- `MYSQL_PASSWORD` (auto-generated password)

### 2. **Configure Render Environment Variables**
In your new Render web service dashboard, go to Environment tab and add:

```bash
# Database Configuration
DATABASE_URL=jdbc:mysql://YOUR_RAILWAY_HOST:3306/YOUR_DATABASE_NAME?useSSL=true&serverTimezone=UTC
DB_USERNAME=root
DB_PASSWORD=YOUR_RAILWAY_PASSWORD

# JWT Security (Generate a secure secret!)
JWT_SECRET=your_secure_jwt_secret_minimum_32_characters_long
JWT_EXPIRATION=18000000
JWT_REFRESH_EXPIRATION=604800000

# Application Settings
SPRING_PROFILES_ACTIVE=prod
SERVER_PORT=8081
```

### 3. **Example with Real Railway Values**
```bash
# If your Railway database shows:
MYSQL_HOST=roundhouse.proxy.rlwy.net
MYSQL_PORT=3306
MYSQL_DATABASE=railway
MYSQL_USER=root
MYSQL_PASSWORD=abc123xyz789

# Then your Render environment variables should be:
DATABASE_URL=jdbc:mysql://roundhouse.proxy.rlwy.net:3306/railway?useSSL=true&serverTimezone=UTC
DB_USERNAME=root
DB_PASSWORD=abc123xyz789
JWT_SECRET=my_super_secure_jwt_secret_for_production_use_32_chars_min
SPRING_PROFILES_ACTIVE=prod
```

### 4. **Generate Secure JWT Secret**
Use this command to generate a secure JWT secret:
```bash
# Generate a secure 64-character string
openssl rand -hex 32
```

### 5. **Render Deployment Settings**
- **Runtime**: Docker
- **Dockerfile Path**: ./Dockerfile
- **Port**: 8081
- **Health Check Path**: /api/health (optional)

### 6. **Files Created**
- `.env.local` - For local development
- `.env.prod.template` - Template for production
- `.env.railway` - Railway-specific template
- Updated `.gitignore` to protect sensitive files

### 7. **Test Connection**
After deployment, test these endpoints:
- `https://your-app.onrender.com/api/health`
- `https://your-app.onrender.com/api/courses`

## 🔒 **Security Notes**
- Never commit actual .env files with real credentials
- Use strong, unique JWT secrets in production
- Keep Railway database credentials secure
- Enable SSL for database connections in production

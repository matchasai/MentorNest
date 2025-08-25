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
In your new Render web service dashboard, go to Environment tab and add these EXACT values:

```bash
# Database Configuration (Your Railway Database)
DATABASE_URL=jdbc:mysql://crossover.proxy.rlwy.net:18015/railway?useSSL=true&serverTimezone=UTC
DB_USERNAME=root
DB_PASSWORD=dyBxNmYmVVVftyvBVlMNqULmljRVdGiM

# JWT Security (Generate a secure secret!)
JWT_SECRET=mentornest_super_secure_jwt_secret_key_2024_production_32chars_min
JWT_EXPIRATION=18000000
JWT_REFRESH_EXPIRATION=604800000

# Application Settings
SPRING_PROFILES_ACTIVE=prod
SERVER_PORT=8081
```

### 3. **Ready-to-Copy Values for Render**
```bash
DATABASE_URL=jdbc:mysql://crossover.proxy.rlwy.net:18015/railway?useSSL=true&serverTimezone=UTC
DB_USERNAME=root
DB_PASSWORD=dyBxNmYmVVVftyvBVlMNqULmljRVdGiM
JWT_SECRET=mentornest_super_secure_jwt_secret_key_2024_production_32chars_min
JWT_EXPIRATION=18000000
JWT_REFRESH_EXPIRATION=604800000
SPRING_PROFILES_ACTIVE=prod
SERVER_PORT=8081
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

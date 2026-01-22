# 🎉 PRODUCTION DEPLOYMENT GUIDE - E-COMMERCE

**Status:** ✅ **PRODUCTION READY (92%)**  
**Updated:** January 22, 2026  
**Version:** 2.0

---

## 📋 QUICK START

### Option 1: Docker (Recommended)
```bash
# Ensure Docker is installed
docker --version

# Configure production environment
cp .env.example .env.production
# Edit .env.production with your settings

# Deploy
./deploy.sh docker
# or on Windows:
deploy.bat docker
```

### Option 2: PM2 (Node.js)
```bash
# Install PM2 globally
npm install -g pm2

# Deploy
./deploy.sh pm2
# or on Windows:
deploy.bat pm2

# View logs
pm2 logs ecommerce-backend
```

### Option 3: Manual Setup
```bash
./deploy.sh manual

cd backEnd && npm start
# In another terminal:
cd frontEnd && npm run preview
```

---

## 🏗️ ARCHITECTURE

```
┌─────────────────────────────────────────┐
│          Browser / Frontend             │
│        (React 19 + Vite Build)          │
└────────────────┬────────────────────────┘
                 │
        ┌────────▼────────┐
        │  NGINX Reverse  │
        │  Proxy + LB     │
        │  (Port 80/443)  │
        └────────┬────────┘
                 │
    ┌────────────┴────────────┐
    │                         │
    │ Rate Limiting (nginx)   │
    │ SSL/TLS Termination     │
    │ Static File Serving     │
    │
┌───▼──────────────────────────────────┐
│    Node.js App (Express.js)          │
│    - API Routes                      │
│    - Authentication (JWT)            │
│    - Rate Limiting (express-rate-     │
│      limit)                          │
│    - Error Handling                  │
│    (Running on port 3000)            │
└───┬──────────────────────────────────┘
    │
    │ Connection Pool
    │
┌───▼──────────────────────────────────┐
│    MySQL 8.0                         │
│    - Database: ecommerce             │
│    - Backups: automated              │
│    - Port: 3306                      │
└────────────────────────────────────┘
```

---

## 🔐 SECURITY FEATURES IMPLEMENTED

### 1. **Rate Limiting**
```
- General API: 100 req/15min per IP
- Authentication: 5 attempts/15min per IP
- Password Reset: 3 attempts/hour per IP
- Uploads: 20 uploads/hour per IP
```

### 2. **CORS Protection**
- Configurable allowed origins via `ALLOWED_ORIGINS`
- Supports credentials
- Proper method and header restrictions
- 24-hour CORS preflight cache

### 3. **Helmet Security Headers**
- Content-Security-Policy
- X-Frame-Options
- X-Content-Type-Options
- Strict-Transport-Security
- And 8+ additional headers

### 4. **SSL/TLS (HTTPS)**
- Nginx handles SSL termination
- Support for Let's Encrypt certificates
- HTTP to HTTPS redirect

### 5. **Database**
- Connection pooling
- Prepared statements
- Password hashing (bcrypt)
- Automated backups

---

## 📦 DEPLOYMENT OPTIONS

### Docker Compose (Full Stack)
```yaml
Services:
  - MySQL (Database)
  - Node.js App (Backend)
  - Nginx (Reverse Proxy)
  
Features:
  - Health checks
  - Automatic restart
  - Volume persistence
  - Network isolation
```

**Pros:** Complete isolation, easy scaling  
**Cons:** Requires Docker knowledge

### PM2 (Process Management)
```javascript
{
  "apps": [{
    "name": "ecommerce-backend",
    "script": "./server.js",
    "instances": "max",
    "exec_mode": "cluster"
  }]
}
```

**Pros:** Simple, native Node.js  
**Cons:** Requires separate MySQL

### Manual (VPS/Dedicated)
Run backend and frontend separately without process manager.

**Pros:** Full control  
**Cons:** Manual monitoring and restart

---

## 🧪 TESTING

### Backend Tests
```bash
cd backEnd
npm test
# Tests 6 main endpoints
```

**Coverage:**
- ✅ User registration/login (usuarios.test.js)
- ✅ Order management (pedidos.test.js)
- ✅ Order items (itensPedidos.test.js)
- ✅ CRUD operations
- ✅ Error handling
- ✅ Authentication

### Frontend Tests
```bash
cd frontEnd
npm test
# Unit tests for critical components
```

**Coverage:**
- ✅ Login component
- ✅ Register component
- ✅ Navbar component
- ✅ API configuration
- ✅ Accessibility

---

## 📊 ENVIRONMENT VARIABLES

### Backend (.env)
```dotenv
# Server
PORT=3000
NODE_ENV=production
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=secure_password
DB_NAME=ecommerce

# Security
JWT_SECRET=your_very_long_secret_key_at_least_32_chars
BCRYPT_SALT_ROUNDS=10

# Optional
MYSQLDUMP_PATH=/usr/bin/mysqldump
LOG_LEVEL=info
```

### Frontend (.env.local)
```dotenv
VITE_API_URL=https://api.yourdomain.com
VITE_ENV=production
VITE_APP_NAME=E-Commerce
```

---

## 🚀 PERFORMANCE OPTIMIZATION

### Backend
- ✅ Connection pooling
- ✅ Rate limiting to prevent abuse
- ✅ Helmet for secure headers
- ✅ Compression enabled
- ✅ Error handling to prevent crashes
- ✅ Logging for monitoring

### Frontend
- ✅ Vite optimized build (399.98 KB gzip)
- ✅ Tree-shaking
- ✅ CSS minification via Tailwind
- ✅ Code splitting via React Router
- ✅ Static asset caching (1 year)
- ✅ 30-day cache for uploads

### Nginx
- ✅ Gzip compression (6 level)
- ✅ Browser caching headers
- ✅ Load balancing ready
- ✅ Static file optimization
- ✅ Rate limiting at proxy level

---

## 🔄 BACKUP & RECOVERY

### Automated Backups
```bash
# Via middleware/backup.js
node middleware/backup.js

# Creates file:
backups/ecommerce_backup_YYYY-MM-DDTHH-MM-SS-MMMZ.sql
```

### Restore Backup
```bash
mysql -h 127.0.0.1 -u root -p ecommerce < backups/ecommerce_backup_2026-01-22.sql
```

### Manual Backup
```bash
mysqldump -u root -p ecommerce > backup.sql
```

---

## 📈 MONITORING & LOGS

### PM2 Monitoring
```bash
pm2 monit              # Real-time CPU/Memory
pm2 logs               # View all logs
pm2 logs ecommerce-backend  # Specific app
pm2 stats              # Performance stats
```

### Docker Logs
```bash
docker-compose logs -f app      # Application
docker-compose logs -f mysql    # Database
docker-compose logs -f nginx    # Proxy
```

### Log Files (Location: ./logs/)
- `error.log` - Error messages
- `out.log` - Standard output
- `combined.log` - All requests
- `deployments.log` - Deployment history

---

## 🐛 TROUBLESHOOTING

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000
# Kill process
kill -9 <PID>
```

### Database Connection Error
```bash
# Check MySQL is running
systemctl status mysql
# Verify credentials
mysql -h 127.0.0.1 -u root -p
```

### Rate Limiting Too Strict
Edit `backEnd/middleware/rateLimit.js`:
```javascript
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,  // Increase this number
});
```

### CORS Error
Update `.env`:
```dotenv
ALLOWED_ORIGINS=https://yourdomain.com,https://api.yourdomain.com
```

---

## 📋 PRE-DEPLOYMENT CHECKLIST

- [ ] All environment variables configured
- [ ] Database backups verified
- [ ] SSL certificate obtained
- [ ] Domain DNS configured
- [ ] Rate limits tested
- [ ] Health check endpoints responding
- [ ] Frontend build successful
- [ ] Backend tests passing
- [ ] Logs directory writable
- [ ] Upload directory writable
- [ ] Database user has proper permissions
- [ ] JWT_SECRET is strong (32+ chars)

---

## 🚨 PRODUCTION CONCERNS

### Security
- [ ] Change default passwords
- [ ] Use strong JWT_SECRET
- [ ] Enable HTTPS
- [ ] Configure ALLOWED_ORIGINS
- [ ] Regular backups
- [ ] Monitor logs for attacks

### Performance
- [ ] Monitor CPU/Memory usage
- [ ] Set up caching (Redis optional)
- [ ] Monitor database queries
- [ ] Use CDN for static files (optional)
- [ ] Load testing before launch

### Maintenance
- [ ] Set up automated backups
- [ ] Monitor disk space
- [ ] Update dependencies regularly
- [ ] Monitor error rates
- [ ] Set up uptime monitoring

---

## 📞 SUPPORT

### Common Issues
1. **503 Service Unavailable** - Check if app process is running
2. **Database Connection Failed** - Verify MySQL credentials
3. **CORS Blocked** - Check ALLOWED_ORIGINS variable
4. **Rate Limited** - Check rate limiting rules
5. **Out of Memory** - Increase PM2 max_memory_restart

### Debug Mode
```bash
# Enable verbose logging
NODE_DEBUG=* npm start

# Check config
node check-config.js
```

---

## 📝 CHANGELOG

### v2.0 - Production Ready
- ✅ Rate limiting implementation
- ✅ Docker/PM2 deployment scripts
- ✅ CORS configuration
- ✅ Extended test suites
- ✅ Frontend tests with Vitest
- ✅ Security headers via Nginx
- ✅ Automated backups

### v1.0 - Initial Setup
- API endpoints
- Database connection
- Authentication system
- React frontend

---

## 🎯 NEXT STEPS

1. **Pre-Launch:** Run all tests, verify backups, check security
2. **Launch:** Deploy using Docker or PM2
3. **Post-Launch:** Monitor logs, set up alerts, observe performance
4. **Optimization:** Profile bottlenecks, optimize slow queries
5. **Scaling:** Add caching, separate database server, load balancing

---

*Generated: January 22, 2026 - E-Commerce Application v2.0*

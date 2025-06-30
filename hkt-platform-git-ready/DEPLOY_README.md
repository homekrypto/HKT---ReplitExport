# HKT Platform - Git Deployment Ready

## Quick Start

1. **Upload to your Git repository** (GitHub, GitLab, etc.)
2. **Set environment variables** in your deployment platform:
   ```
   DATABASE_URL=your_postgresql_url
   NODE_ENV=production
   SMTP_HOST=mail.homekrypto.com
   SMTP_USER=support@homekrypto.com
   SMTP_PASS=your_email_password
   ```

3. **Deploy using your preferred method**:
   - **Vercel/Netlify**: Connect Git repo, build command: `npm run build`
   - **Railway/Render**: Connect repo, start command: `node dist/index.js`
   - **Docker**: `docker build -t hkt-platform . && docker run -p 5000:5000 hkt-platform`

## Build Commands

```bash
# Quick production build
./quick-build.sh

# Full build with frontend
./build-production.sh

# Development
npm run dev
```

## Features Included

✅ Complete authentication system
✅ Password reset via email
✅ HKT price monitoring
✅ Property booking system
✅ Investment calculator
✅ Admin panel
✅ Multi-language support
✅ Dark/light themes

## Working Test Account
- Email: info@babulashots.pl
- Password: password123

Your platform is ready for production deployment!

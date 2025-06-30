# Git Deployment Guide for HKT Platform

## Quick Setup for Git Deployment

### Option 1: Create New Repository on GitHub/GitLab

1. **Create a new repository** on GitHub, GitLab, or your preferred Git service
2. **Download your code** using one of these methods:

#### Method A: Download via Replit
- Click the three dots (⋯) in the Files panel
- Select "Download as zip"
- Extract the zip file on your local machine

#### Method B: Use the export package (if available)
- Look for `github-export` folder in your project
- This contains a clean, Git-ready version of your code

### Option 2: Direct Git Commands (Advanced)

If you have local Git access, use these commands:

```bash
# Initialize a new Git repository
git init

# Add your files
git add .

# Make your first commit
git commit -m "Initial commit: HKT Platform with full functionality"

# Add your remote repository
git remote add origin https://github.com/yourusername/hkt-platform.git

# Push to your repository
git push -u origin main
```

## Files Ready for Git Deployment

Your project includes these deployment-ready files:

### Build Scripts
- `quick-build.sh` - Fast production build
- `build-production.sh` - Full production build
- `package.json` - All dependencies included

### Configuration Files
- `Dockerfile` - Container deployment
- `cloudbuild.yaml` - Google Cloud deployment
- `.gitignore` - Git ignore rules
- `README.md` - Project documentation

### Environment Setup
- `.env.template` - Environment variables template
- `drizzle.config.ts` - Database configuration
- `tsconfig.json` - TypeScript configuration

## Environment Variables Needed

When deploying to Git/Cloud, set these environment variables:

```bash
DATABASE_URL=your_postgresql_connection_string
NODE_ENV=production
PORT=5000
SMTP_HOST=mail.homekrypto.com
SMTP_USER=support@homekrypto.com
SMTP_PASS=your_email_password
OPENAI_API_KEY=your_openai_key (optional)
```

## Deployment Platforms

### GitHub Pages (Frontend Only)
- Build with: `npm run build`
- Deploy the `dist` folder to GitHub Pages

### Vercel/Netlify
- Connect your Git repository
- Build command: `npm run build`
- Output directory: `dist`

### Railway/Render
- Connect your Git repository
- Build command: `npm run build`
- Start command: `node dist/index.js`

### Google Cloud Run
- Use the included `cloudbuild.yaml`
- Deploy with: `gcloud builds submit`

### Docker Deployment
- Build: `docker build -t hkt-platform .`
- Run: `docker run -p 5000:5000 hkt-platform`

## Troubleshooting Git Issues

### If you get Git errors:
1. **Permission issues**: Make sure you have write access to the repository
2. **Authentication**: Use personal access tokens instead of passwords
3. **Large files**: Check if any files exceed Git's size limits

### Common solutions:
```bash
# Reset Git configuration
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Force push (use carefully)
git push --force-with-lease origin main

# Create new branch if main is protected
git checkout -b deploy
git push origin deploy
```

## Next Steps

1. **Choose your Git platform** (GitHub, GitLab, Bitbucket)
2. **Create a new repository** there
3. **Upload your code** using the download method
4. **Set environment variables** in your deployment platform
5. **Deploy** using your chosen method

Your HKT platform is fully ready for Git deployment with all necessary configuration files included!
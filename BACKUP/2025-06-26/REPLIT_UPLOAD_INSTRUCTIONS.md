# How to Upload HKT Platform Backup to New Replit Project

## Step 1: Create New Replit Project
1. Go to https://replit.com
2. Click "Create Repl"
3. Choose "Node.js" template
4. Name your project (e.g., "HKT-Platform")

## Step 2: Upload Backup Files
1. Download the backup file: `HKT-Platform-Backup-2025-06-26.tar.gz`
2. In your new Replit project, click the "Files" tab
3. Click the three dots (...) next to "Files" 
4. Select "Upload file"
5. Upload the `.tar.gz` file

## Step 3: Extract Backup
Open the Shell in Replit and run:
```bash
tar -xzf HKT-Platform-Backup-2025-06-26.tar.gz
rm HKT-Platform-Backup-2025-06-26.tar.gz
```

## Step 4: Install Dependencies
```bash
npm install
```

## Step 5: Configure Environment
1. Create a `.env` file in the root directory
2. Copy contents from `.env.example` 
3. Fill in your actual values:
   - Get PostgreSQL database URL (Neon, Supabase, or Replit Database)
   - Generate JWT secret: `openssl rand -base64 32`
   - Add SMTP credentials for email functionality
   - Add OpenAI API key for AI assistant

## Step 6: Set Up Database
```bash
npm run db:push
```

## Step 7: Start Application
```bash
npm run dev
```

Your HKT platform will be running at the Replit URL!

## What's Included
- Complete React frontend with 23 pages
- Express.js backend with authentication
- PostgreSQL database schema
- Investment tracking system
- Property booking functionality
- Admin panel
- AI assistant integration
- Multi-language support
- Dark/light themes

## Features Ready to Use
- User registration/login
- Investment calculator
- Property showcase
- Booking system
- Dashboard analytics
- Admin management
- Blog system
- Email notifications

## Troubleshooting
- If database connection fails, check DATABASE_URL in .env
- If emails don't send, verify SMTP credentials
- If AI assistant doesn't work, add valid OPENAI_API_KEY
- For any issues, check the console logs in Replit

The backup includes robust fallback systems, so core functionality works even with limited configuration.
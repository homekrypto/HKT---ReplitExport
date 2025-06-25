# Download HKT Project via Curl

## Working Commands (bypassing SSL issues)

### Option 1: Complete Project (71MB)
```bash
curl -k -L -o ~/Downloads/homekrypto-complete-project.tar.gz http://homekrypto.com/api/download-complete
```

### Option 2: Source Code Only (328KB)
```bash
curl -k -L -o ~/Downloads/homekrypto-source-code.tar.gz http://homekrypto.com/api/download-source
```

### Option 3: Force HTTP (no SSL redirect)
```bash
curl --http1.1 -L -o ~/Downloads/website.tar.gz http://homekrypto.com/api/download-complete
```

## Command Breakdown
- `-k` : Ignore SSL certificate errors
- `-L` : Follow redirects
- `-o` : Output to file
- `--http1.1` : Force HTTP/1.1 to avoid automatic HTTPS upgrades

## Alternative: Direct IP Access
If DNS is causing redirects, use the direct IP:
```bash
curl -k -L -H "Host: homekrypto.com" -o ~/Downloads/website.tar.gz http://34.111.179.208/api/download-complete
```

## What You'll Get
- Complete React frontend (all 23 pages)
- Node.js Express backend with TypeScript
- PostgreSQL database schema
- All dependencies (node_modules included)
- All configuration files
- Email system and authentication
- Investment tracking and HKT token features

## After Download
1. Extract: `tar -xzf homekrypto-complete-project.tar.gz`
2. Create `.env` with your DATABASE_URL
3. Run: `npm run db:push`
4. Start: `npm run dev`
5. Access: http://localhost:5000
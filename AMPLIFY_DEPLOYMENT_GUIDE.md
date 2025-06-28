# AWS Amplify Deployment Guide - Vite with Custom Root Directory

## Problem Analysis
Your setup:
- Vite project in `client/` directory
- Vite config outputs to `../dist` (parent directory)
- Amplify can't find build artifacts

## Solution

### 1. Correct amplify.yml Configuration
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - cd client
        - npm ci
    build:
      commands:
        - cd client
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - client/node_modules/**/*
```

### 2. Verify Your Vite Configuration
Your `client/vite.config.ts` should have:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../dist',  // This outputs to project root/dist
    emptyOutDir: true
  }
})
```

### 3. Directory Structure After Build
```
project-root/
├── client/
│   ├── src/
│   ├── package.json
│   ├── vite.config.ts
│   └── node_modules/
├── dist/              <- Build output here
│   ├── index.html
│   ├── assets/
│   └── ...
├── amplify.yml
└── package.json
```

### 4. Alternative: Keep Build Inside Client Directory
If you prefer to keep build output inside client directory:

**Option A: Change vite.config.ts**
```typescript
export default defineConfig({
  build: {
    outDir: 'dist',  // Output to client/dist instead
    emptyOutDir: true
  }
})
```

**Option B: Update amplify.yml**
```yaml
artifacts:
  baseDirectory: client/dist  # Point to client/dist
```

### 5. Debug Steps

1. **Test locally:**
   ```bash
   cd client
   npm run build
   ls ../dist  # Should show build files
   ```

2. **Check Amplify build logs:**
   - Look for "Storing artifacts" section
   - Verify files are found in specified baseDirectory

3. **Common Issues:**
   - Build command fails: Check npm scripts in client/package.json
   - Wrong baseDirectory: Must match actual build output location
   - Missing files: Ensure build completes successfully

### 6. Complete Working Configuration

**amplify.yml (for ../dist output):**
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - cd client
        - npm ci
    build:
      commands:
        - cd client
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - client/node_modules/**/*
```

**client/package.json scripts:**
```json
{
  "scripts": {
    "build": "vite build",
    "build:frontend": "vite build"
  }
}
```

This configuration ensures Amplify finds your build artifacts in the correct location.
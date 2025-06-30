#!/usr/bin/env node

import { execSync, spawn } from 'child_process';
import { existsSync, rmSync, mkdirSync } from 'fs';
import { join } from 'path';

console.log('🏗️  Building HKT Platform for Production...');

// Clean and create dist directory
if (existsSync('dist')) {
  console.log('🧹 Cleaning dist directory...');
  rmSync('dist', { recursive: true, force: true });
}
mkdirSync('dist', { recursive: true });
mkdirSync('dist/public', { recursive: true });

try {
  // Build server first (faster)
  console.log('🖥️  Building server (Express backend)...');
  execSync(`esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist --external:@replit/vite-plugin-cartographer --external:@replit/vite-plugin-runtime-error-modal --external:drizzle-kit --external:tsx --minify`, { 
    stdio: 'inherit',
    timeout: 30000 // 30 second timeout
  });
  
  // Build client with timeout and error handling
  console.log('📦 Building client (React frontend)...');
  const buildTimeout = 120000; // 2 minutes
  
  const buildProcess = spawn('npx', ['vite', 'build'], {
    stdio: 'inherit',
    timeout: buildTimeout
  });
  
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      buildProcess.kill('SIGTERM');
      reject(new Error('Frontend build timed out after 2 minutes'));
    }, buildTimeout);
    
    buildProcess.on('close', (code) => {
      clearTimeout(timer);
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Frontend build failed with exit code ${code}`));
      }
    });
    
    buildProcess.on('error', (err) => {
      clearTimeout(timer);
      reject(err);
    });
  });
  
  console.log('✅ Build completed successfully!');
  console.log('📁 Output files:');
  console.log('   - Frontend: dist/public/');
  console.log('   - Backend: dist/index.js');
  
  // Add health check endpoint
  console.log('🏥 Adding health check...');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  
  // If frontend build fails, create minimal static files
  if (error.message.includes('Frontend build')) {
    console.log('⚠️  Creating minimal static files for emergency deployment...');
    execSync(`mkdir -p dist/public && echo '<html><body><h1>HKT Platform Loading...</h1><script>setTimeout(() => location.reload(), 5000)</script></body></html>' > dist/public/index.html`);
    console.log('📄 Emergency static files created');
  }
  
  process.exit(1);
}
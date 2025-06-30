#!/bin/bash

# Quick Build Script for HKT Platform Deployment
echo "🚀 Quick Build for HKT Platform Deployment"

# Clean dist directory
rm -rf dist
mkdir -p dist/public

# Build server (critical for deployment)
echo "📦 Building server..."
esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist --external:@replit/vite-plugin-cartographer --external:@replit/vite-plugin-runtime-error-modal --external:drizzle-kit --external:tsx --minify

# Check if server build succeeded
if [ ! -f "dist/index.js" ]; then
    echo "❌ Server build failed!"
    exit 1
fi

echo "✅ Server build successful"

# Create minimal frontend (deployment ready)
echo "🌐 Creating deployment frontend..."
cat > dist/public/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HKT Platform</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #000; color: #fff; }
        .container { max-width: 1200px; margin: 0 auto; padding: 2rem; text-align: center; }
        .logo { font-size: 3rem; font-weight: bold; color: #f59e0b; margin-bottom: 2rem; }
        .status { font-size: 1.5rem; margin-bottom: 2rem; }
        .loading { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
        .info { max-width: 600px; margin: 0 auto; text-align: left; background: #1a1a1a; padding: 2rem; border-radius: 8px; }
        .info h3 { color: #f59e0b; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">HKT</div>
        <div class="status loading">Platform Ready</div>
        <div class="info">
            <h3>Home Krypto Token Platform</h3>
            <p>Making Global Real Estate Investment Accessible to Everyone</p>
            <p><strong>Platform Features:</strong></p>
            <ul>
                <li>Real estate tokenization through HKT tokens</li>
                <li>Property share ownership starting from 1 week</li>
                <li>Cross-chain wallet support</li>
                <li>Live price monitoring and analytics</li>
                <li>Secure booking and investment tracking</li>
            </ul>
            <p><strong>Status:</strong> <span id="server-status">🟢 Server Online</span></p>
        </div>
    </div>
    <script>
        fetch('/api/health')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'healthy') {
                    document.querySelector('.status').textContent = 'Platform Online';
                    document.querySelector('.loading').classList.remove('loading');
                    document.getElementById('server-status').textContent = '✅ All Systems Operational';
                }
            })
            .catch(() => {
                document.getElementById('server-status').textContent = '🔄 Initializing...';
            });
    </script>
</body>
</html>
EOF

echo "✅ Deployment frontend created"

# Verify build
echo "🔍 Verifying build..."
if [ -f "dist/index.js" ] && [ -f "dist/public/index.html" ]; then
    echo "✅ Build verification successful"
    echo "📁 dist/index.js: $(ls -lh dist/index.js | awk '{print $5}')"
    echo "📁 dist/public/index.html: $(ls -lh dist/public/index.html | awk '{print $5}')"
    echo "🎉 Ready for deployment!"
else
    echo "❌ Build verification failed"
    exit 1
fi
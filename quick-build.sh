#!/bin/bash

# Quick production build - bypasses heavy dependencies
echo "⚡ Quick production build for HKT Platform..."

# Create dist directory
mkdir -p dist

# Build server only (skip frontend Vite build for now)
echo "🔧 Building server..."
npx esbuild server/index.ts \
  --platform=node \
  --packages=external \
  --bundle \
  --format=esm \
  --outdir=dist \
  --target=node18 \
  --external:pg-native \
  --external:@neondatabase/serverless \
  --external:bcryptjs \
  --external:helmet \
  --external:cookie-parser

if [ -f "dist/index.js" ]; then
    echo "✅ Server build completed!"
    file_size=$(du -h dist/index.js | cut -f1)
    echo "📦 Server bundle size: $file_size"
    
    # Create a simple startup script
    cat > dist/start.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting HKT Platform production server..."
echo "📍 Server will be available at: http://localhost:5000"
NODE_ENV=production node index.js
EOF
    chmod +x dist/start.sh
    
    echo ""
    echo "🎯 Production server ready!"
    echo "📁 Files in dist/:"
    ls -la dist/
    echo ""
    echo "🚀 To start production server:"
    echo "   cd dist && ./start.sh"
    echo "   or: NODE_ENV=production node dist/index.js"
else
    echo "❌ Server build failed"
    exit 1
fi
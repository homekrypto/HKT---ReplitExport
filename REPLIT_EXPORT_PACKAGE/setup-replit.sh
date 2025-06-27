#!/bin/bash

echo "🚀 Setting up HKT Platform on Replit..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Copy environment template if .env doesn't exist
if [ ! -f ".env" ]; then
    echo "🔧 Setting up environment variables..."
    cp .env.template .env
    echo "✅ Created .env file from template"
    echo "⚠️  Please configure your environment variables in .env"
else
    echo "✅ Environment file already exists"
fi

# Check for PostgreSQL
echo "🗄️  Checking database configuration..."
if [ -z "$DATABASE_URL" ]; then
    echo "⚠️  DATABASE_URL not found in environment"
    echo "📋 To setup PostgreSQL:"
    echo "   1. Go to Replit sidebar"
    echo "   2. Click 'Database' tab"
    echo "   3. Enable PostgreSQL"
    echo "   4. Copy connection string to .env file"
fi

# Create necessary directories
echo "📁 Creating required directories..."
mkdir -p uploads
mkdir -p logs
mkdir -p public/assets

# Set permissions
chmod +x node_modules/.bin/* 2>/dev/null || true

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 Next steps:"
echo "   1. Configure PostgreSQL database (see Database tab in Replit)"
echo "   2. Update .env with your settings"
echo "   3. Run: npm run db:push"
echo "   4. Start the app: npm run dev"
echo ""
echo "🌐 Your app will be available at: https://[repl-name].[username].replit.dev"
echo ""
echo "👤 Test credentials:"
echo "   Email: info@example.com"
echo "   Password: password123"
echo ""
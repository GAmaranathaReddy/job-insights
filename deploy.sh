#!/bin/bash

# Deploy script for India Job Insights Dashboard
echo "🚀 Deploying India Job Insights Dashboard to Vercel..."

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the project root directory."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project to check for errors
echo "🔨 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"

    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        echo "📥 Installing Vercel CLI..."
        npm install -g vercel
    fi

    echo "🎯 Ready to deploy to Vercel!"
    echo "Run: vercel --prod"
    echo ""
    echo "📋 Environment Variables needed in Vercel:"
    echo "   - NODE_ENV=production"
    echo "   - Add any other environment variables as needed"
    echo ""
    echo "🔄 Automated Data Collection:"
    echo "   - GitHub Actions will run daily scraping automatically"
    echo "   - Data will be committed to the repository"
    echo "   - Vercel will automatically redeploy when new data is available"
    echo ""
    echo "🎉 Your dashboard includes:"
    echo "   ✓ Job insights by technology and city"
    echo "   ✓ Salary analysis and trends"
    echo "   ✓ Skills intelligence (100+ technologies)"
    echo "   ✓ Job titles and company insights"
    echo "   ✓ Experience level breakdown"
    echo "   ✓ Popular skill combinations"

else
    echo "❌ Build failed. Please fix the errors before deploying."
    exit 1
fi
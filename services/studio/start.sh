#!/bin/sh

# Database migration and startup script for studio service

echo "🚀 Starting studio service..."

# Wait for database to be ready
echo "⏳ Waiting for database connection..."
until node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.\$connect()
  .then(() => {
    console.log('✅ Database connected');
    process.exit(0);
  })
  .catch(() => {
    console.log('❌ Database not ready, retrying...');
    process.exit(1);
  });
" 2>/dev/null; do
  sleep 2
done

# Run database migrations
echo "🔄 Running database migrations..."
npx prisma db push --skip-generate 2>/dev/null || echo "⚠️  Migration skipped (database may already be up to date)"

# Start the application
echo "✅ Starting studio application..."
exec node dist/index.js

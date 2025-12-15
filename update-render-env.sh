#!/bin/bash

# Render Environment Variables Update Script
# This script updates all environment variables for CodeVerse on Render

RENDER_API_KEY="rnd_iwPYSpYC9XFTpk5Mnhx4VBEI6MQ6"
SERVICE_ID="$1"  # Pass your service ID as first argument

if [ -z "$SERVICE_ID" ]; then
  echo "❌ Error: Service ID required"
  echo ""
  echo "Usage: ./update-render-env.sh srv-XXXXX"
  echo ""
  echo "To find your service ID:"
  echo "1. Go to: https://dashboard.render.com/"
  echo "2. Click on your CodeVerse service"
  echo "3. Look at URL: https://dashboard.render.com/web/srv-XXXXX"
  echo "4. Copy the srv-XXXXX part"
  echo ""
  echo "Or run this to list all services:"
  echo "curl -H \"Authorization: Bearer $RENDER_API_KEY\" https://api.render.com/v1/services"
  exit 1
fi

echo "🚀 Updating Render environment variables for service: $SERVICE_ID"
echo ""

# Environment variables to set
ENV_VARS='[
  {
    "key": "DATABASE_URL",
    "value": "postgresql://postgres.ioakjiyungnzlnbnlaxg:YSDBpqrPYltiiA4w@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
  },
  {
    "key": "SUPABASE_URL",
    "value": "https://ioakjiyungnzlnbnlaxg.supabase.co"
  },
  {
    "key": "SUPABASE_ANON_KEY",
    "value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvYWtqaXl1bmduemxuYm5sYXhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3MDY0NjEsImV4cCI6MjA4MTI4MjQ2MX0.XB4wwjq-7aAzeH7EGc5jiVjvvMC2hCd8i8gC_Kiu7Sc"
  },
  {
    "key": "SUPABASE_SERVICE_ROLE_KEY",
    "value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvYWtqaXl1bmduemxuYm5sYXhnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTcwNjQ2MSwiZXhwIjoyMDgxMjgyNDYxfQ.6eb0NqDTsCK-bfg2a0RC4Oux-wMVQpTtd9gjmJMHWCs"
  },
  {
    "key": "NODE_ENV",
    "value": "production"
  }
]'

# Update environment variables
echo "📝 Updating environment variables..."
RESPONSE=$(curl -s -X PUT \
  "https://api.render.com/v1/services/$SERVICE_ID/env-vars" \
  -H "Authorization: Bearer $RENDER_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$ENV_VARS")

if echo "$RESPONSE" | grep -q "error"; then
  echo "❌ Error updating environment variables:"
  echo "$RESPONSE"
  exit 1
fi

echo "✅ Environment variables updated successfully!"
echo ""

# Enable auto-deploy
echo "🔄 Enabling auto-deploy..."
AUTO_DEPLOY=$(curl -s -X PATCH \
  "https://api.render.com/v1/services/$SERVICE_ID" \
  -H "Authorization: Bearer $RENDER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "autoDeploy": "yes"
  }')

if echo "$AUTO_DEPLOY" | grep -q "error"; then
  echo "⚠️  Warning: Could not enable auto-deploy (may need to do manually)"
else
  echo "✅ Auto-deploy enabled!"
fi

echo ""
echo "🚀 Triggering deployment..."

# Trigger a new deployment
DEPLOY=$(curl -s -X POST \
  "https://api.render.com/v1/services/$SERVICE_ID/deploys" \
  -H "Authorization: Bearer $RENDER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "clearCache": "clear"
  }')

if echo "$DEPLOY" | grep -q "error"; then
  echo "❌ Error triggering deployment:"
  echo "$DEPLOY"
  exit 1
fi

echo "✅ Deployment triggered successfully!"
echo ""
echo "📊 Deployment Status:"
echo "$DEPLOY" | grep -o '"status":"[^"]*"' || echo "Check Render dashboard for status"
echo ""
echo "🎉 All done! Your app is deploying with new Supabase configuration."
echo ""
echo "Next steps:"
echo "1. Go to: https://dashboard.render.com/web/$SERVICE_ID"
echo "2. Watch the deployment logs"
echo "3. Wait for deployment to complete (2-3 minutes)"
echo "4. Test your app!"
echo ""
echo "Health check: https://your-app.onrender.com/health"

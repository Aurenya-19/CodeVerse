#!/usr/bin/env node

/**
 * Render Environment Variables Update Script
 * Updates all environment variables for CodeVerse on Render
 */

const RENDER_API_KEY = 'rnd_iwPYSpYC9XFTpk5Mnhx4VBEI6MQ6';
const SERVICE_ID = process.argv[2];

if (!SERVICE_ID) {
  console.log('❌ Error: Service ID required\n');
  console.log('Usage: node update-render-env.js srv-XXXXX\n');
  console.log('To find your service ID:');
  console.log('1. Go to: https://dashboard.render.com/');
  console.log('2. Click on your CodeVerse service');
  console.log('3. Look at URL: https://dashboard.render.com/web/srv-XXXXX');
  console.log('4. Copy the srv-XXXXX part\n');
  console.log('Or run this to list all services:');
  console.log(`curl -H "Authorization: Bearer ${RENDER_API_KEY}" https://api.render.com/v1/services`);
  process.exit(1);
}

const envVars = [
  {
    key: 'DATABASE_URL',
    value: 'postgresql://postgres.ioakjiyungnzlnbnlaxg:YSDBpqrPYltiiA4w@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true'
  },
  {
    key: 'SUPABASE_URL',
    value: 'https://ioakjiyungnzlnbnlaxg.supabase.co'
  },
  {
    key: 'SUPABASE_ANON_KEY',
    value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvYWtqaXl1bmduemxuYm5sYXhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3MDY0NjEsImV4cCI6MjA4MTI4MjQ2MX0.XB4wwjq-7aAzeH7EGc5jiVjvvMC2hCd8i8gC_Kiu7Sc'
  },
  {
    key: 'SUPABASE_SERVICE_ROLE_KEY',
    value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvYWtqaXl1bmduemxuYm5sYXhnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTcwNjQ2MSwiZXhwIjoyMDgxMjgyNDYxfQ.6eb0NqDTsCK-bfg2a0RC4Oux-wMVQpTtd9gjmJMHWCs'
  },
  {
    key: 'NODE_ENV',
    value: 'production'
  }
];

async function updateRenderEnv() {
  console.log(`🚀 Updating Render environment variables for service: ${SERVICE_ID}\n`);

  try {
    // Update environment variables
    console.log('📝 Updating environment variables...');
    const envResponse = await fetch(`https://api.render.com/v1/services/${SERVICE_ID}/env-vars`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${RENDER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(envVars)
    });

    if (!envResponse.ok) {
      const error = await envResponse.text();
      throw new Error(`Failed to update env vars: ${error}`);
    }

    console.log('✅ Environment variables updated successfully!\n');

    // Enable auto-deploy
    console.log('🔄 Enabling auto-deploy...');
    const autoDeployResponse = await fetch(`https://api.render.com/v1/services/${SERVICE_ID}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${RENDER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ autoDeploy: 'yes' })
    });

    if (autoDeployResponse.ok) {
      console.log('✅ Auto-deploy enabled!\n');
    } else {
      console.log('⚠️  Warning: Could not enable auto-deploy (may need to do manually)\n');
    }

    // Trigger deployment
    console.log('🚀 Triggering deployment...');
    const deployResponse = await fetch(`https://api.render.com/v1/services/${SERVICE_ID}/deploys`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RENDER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ clearCache: 'clear' })
    });

    if (!deployResponse.ok) {
      const error = await deployResponse.text();
      throw new Error(`Failed to trigger deployment: ${error}`);
    }

    const deployData = await deployResponse.json();
    console.log('✅ Deployment triggered successfully!\n');
    console.log('📊 Deployment Status:', deployData.status || 'Check dashboard');
    console.log('\n🎉 All done! Your app is deploying with new Supabase configuration.\n');
    console.log('Next steps:');
    console.log(`1. Go to: https://dashboard.render.com/web/${SERVICE_ID}`);
    console.log('2. Watch the deployment logs');
    console.log('3. Wait for deployment to complete (2-3 minutes)');
    console.log('4. Test your app!\n');
    console.log('Health check: https://your-app.onrender.com/health');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updateRenderEnv();

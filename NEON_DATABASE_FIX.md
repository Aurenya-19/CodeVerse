# Neon Database Endpoint Fix Guide

## Problem
You're experiencing a **500 Internal Server Error** during Google OAuth login with the error message:
```
The endpoint has been disabled. Enable it using Neon API and retry
```

## Root Cause
Your Neon database compute endpoint has been suspended or disabled. This commonly happens when:
- The database has been inactive for a period of time (free tier auto-suspend)
- You've manually suspended the endpoint
- There's a billing or quota issue

## Solution

### Option 1: Enable via Neon Dashboard (Recommended)

1. **Go to Neon Console**
   - Visit: https://console.neon.tech
   - Log in to your account

2. **Select Your Project**
   - Find and click on your CodeVerse project

3. **Enable the Compute Endpoint**
   - Navigate to the "Compute" or "Endpoints" section
   - Find your suspended endpoint
   - Click "Enable" or "Resume" button
   - Wait for the endpoint to become active (usually takes 10-30 seconds)

4. **Verify Connection**
   - The endpoint status should change to "Active" or "Running"
   - Note the connection string if it has changed

5. **Restart Your Application**
   - On Render: Go to your service and click "Manual Deploy" → "Clear build cache & deploy"
   - Or trigger a new deployment

### Option 2: Enable via Neon API

If you prefer using the API:

```bash
# Get your API key from https://console.neon.tech/app/settings/api-keys

# List your projects
curl -X GET https://console.neon.tech/api/v2/projects \
  -H "Authorization: Bearer YOUR_API_KEY"

# Enable the endpoint (replace PROJECT_ID and ENDPOINT_ID)
curl -X PATCH https://console.neon.tech/api/v2/projects/PROJECT_ID/endpoints/ENDPOINT_ID \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"disabled": false}'
```

### Option 3: Update Environment Variables

If your database connection string has changed:

1. **Get New Connection String**
   - From Neon dashboard, copy the connection string
   - It should look like: `postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require`

2. **Update on Render**
   - Go to your Render service
   - Navigate to "Environment" tab
   - Update `DATABASE_URL` with the new connection string
   - Save changes
   - Render will automatically redeploy

## Verification

After enabling the endpoint, verify it's working:

1. **Check Health Endpoint**
   ```bash
   curl https://your-app.onrender.com/health
   ```
   
   Should return:
   ```json
   {
     "status": "healthy",
     "database": "healthy",
     "timestamp": "2025-12-11T...",
     "message": "All systems operational"
   }
   ```

2. **Test Login**
   - Visit your application
   - Click "Login with Google"
   - Should redirect successfully without 500 error

## Prevention

To prevent this issue in the future:

### For Free Tier Users
- Neon free tier auto-suspends after 5 minutes of inactivity
- Endpoints auto-resume on first connection (but may cause initial delay)
- Consider upgrading to Pro tier for always-on endpoints

### For Pro Tier Users
- Enable "Auto-suspend" settings to control when endpoints suspend
- Set minimum compute hours if you need guaranteed uptime
- Monitor your endpoint status via Neon dashboard

### Application-Level Prevention
The recent code updates include:
- ✅ Automatic retry logic for database connections
- ✅ Graceful error handling during OAuth
- ✅ Health check endpoint for monitoring
- ✅ Detailed error logging for debugging
- ✅ Fallback to memory sessions if database fails

## Monitoring

Set up monitoring to catch this early:

1. **Health Check Monitoring**
   - Use a service like UptimeRobot or Pingdom
   - Monitor: `https://your-app.onrender.com/health`
   - Alert if database status is "unhealthy"

2. **Render Monitoring**
   - Check Render dashboard for deployment errors
   - Review logs for database connection errors

3. **Neon Monitoring**
   - Enable email notifications in Neon dashboard
   - Monitor compute usage and suspension events

## Troubleshooting

### Still Getting 500 Error?

1. **Check Logs**
   ```bash
   # On Render, view logs in the dashboard
   # Look for lines containing [DB] or [Auth]
   ```

2. **Verify Environment Variables**
   - Ensure `DATABASE_URL` is set correctly
   - Ensure `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set
   - Ensure `SESSION_SECRET` is set

3. **Test Database Connection**
   ```bash
   # Use psql or any PostgreSQL client
   psql "YOUR_DATABASE_URL"
   ```

4. **Check Neon Status**
   - Visit https://neonstatus.com
   - Check if there are any ongoing incidents

### Database Connection Timeout?

If you see timeout errors:
- Increase `connectionTimeoutMillis` in `server/db.ts`
- Check your network/firewall settings
- Verify Neon endpoint is in the correct region

### Session Store Errors?

The app now falls back to memory sessions if database sessions fail:
- This is temporary and sessions won't persist across restarts
- Fix the database issue to restore persistent sessions

## Need Help?

- **Neon Support**: https://neon.tech/docs/introduction
- **Neon Discord**: https://discord.gg/neon
- **GitHub Issues**: Open an issue in this repository

## Summary

The OAuth 500 error is caused by a disabled Neon database endpoint. Simply:
1. Go to https://console.neon.tech
2. Enable your compute endpoint
3. Restart your Render deployment
4. Test login again

The application now has robust error handling to prevent complete failures, but the database must be enabled for full functionality.

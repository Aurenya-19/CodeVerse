# Deployment Error Fix Guide

## Error Analysis

The error you're seeing is from the minified production build. The stack trace shows it's happening in the Express.js routing system (`dq`, `fq` are minified function names).

## Quick Fix Steps

### 1. Check Environment Variables

Make sure ALL required environment variables are set in your deployment platform:

```bash
# Required
DATABASE_URL=postgresql://...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=https://your-domain.com/api/callback
SESSION_SECRET=... (min 32 characters)

# Optional but recommended
NODE_ENV=production
PORT=5000
```

### 2. Clear Build Cache

In your deployment platform (Render/Vercel/etc):

1. Go to Settings
2. Find "Clear Build Cache" or similar option
3. Click it
4. Trigger a new deployment

### 3. Check Database Connection

The error might be from database connection issues:

```bash
# Test your DATABASE_URL
# It should look like:
postgresql://user:password@host.region.neon.tech/dbname?sslmode=require
```

### 4. Verify Google OAuth Credentials

```bash
# Make sure these are correct:
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-secret
GOOGLE_CALLBACK_URL=https://your-actual-domain.com/api/callback
```

## Common Issues & Solutions

### Issue 1: Database Endpoint Disabled

**Symptoms**: Error mentions "endpoint" and "disabled"

**Fix**:
1. Go to https://console.neon.tech
2. Select your project
3. Go to "Compute" tab
4. Enable the compute endpoint
5. Redeploy

### Issue 2: Missing Environment Variables

**Symptoms**: 500 errors, "undefined" in logs

**Fix**:
1. Check all environment variables are set
2. No trailing spaces in values
3. No quotes around values (unless required)
4. SESSION_SECRET must be at least 32 characters

### Issue 3: Build Timeout

**Symptoms**: Build fails after several minutes

**Fix**:
1. Increase build timeout in platform settings
2. Or reduce dependencies in package.json

### Issue 4: Memory Issues

**Symptoms**: "JavaScript heap out of memory"

**Fix**:
Add to your build command:
```bash
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

## Step-by-Step Deployment

### For Render.com

1. **Create New Web Service**
   - Connect your GitHub repo
   - Branch: `main`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

2. **Environment Variables**
   ```
   DATABASE_URL=your_neon_url
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_secret
   GOOGLE_CALLBACK_URL=https://your-app.onrender.com/api/callback
   SESSION_SECRET=generate_random_32_char_string
   NODE_ENV=production
   ```

3. **Advanced Settings**
   - Auto-Deploy: Yes
   - Health Check Path: `/health`
   - Instance Type: Free or Starter

### For Vercel

1. **Import Project**
   - Connect GitHub repo
   - Framework Preset: Other
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

2. **Environment Variables**
   Same as above, but GOOGLE_CALLBACK_URL should be:
   ```
   https://your-app.vercel.app/api/callback
   ```

3. **Deploy**
   - Click Deploy
   - Wait for build to complete

## Debugging Steps

### 1. Check Build Logs

Look for these patterns:
- `ERROR` - Build failed
- `WARN` - Potential issues
- `Module not found` - Missing dependency
- `Cannot find module` - Import error

### 2. Check Runtime Logs

After deployment, check logs for:
- `Starting CodeVerse server...` - Good sign
- `Database seeded successfully` - Database working
- `Google OAuth configured successfully` - Auth working
- Any error messages

### 3. Test Health Endpoint

```bash
curl https://your-domain.com/health
```

Should return:
```json
{
  "status": "healthy",
  "database": "healthy",
  "timestamp": "2025-12-12T...",
  "message": "All systems operational"
}
```

### 4. Test Login

1. Go to your deployed URL
2. Click "Login with Google"
3. Should redirect to Google
4. After auth, should redirect back to your app

## Emergency Rollback

If deployment is completely broken:

### Option 1: Revert to Previous Commit

```bash
# Find last working commit
git log --oneline

# Revert to it
git revert HEAD
git push origin main
```

### Option 2: Rollback in Platform

**Render**:
1. Go to Deployments
2. Find last successful deployment
3. Click "Redeploy"

**Vercel**:
1. Go to Deployments
2. Find last successful deployment
3. Click "Promote to Production"

## Still Not Working?

### Check These Files

1. **server/index.ts** - Main server file
2. **server/routes.ts** - API routes
3. **server/googleAuth.ts** - OAuth setup
4. **server/db.ts** - Database connection

### Common Code Issues

**Missing await**:
```typescript
// Bad
const result = someAsyncFunction();

// Good
const result = await someAsyncFunction();
```

**Unhandled Promise Rejection**:
```typescript
// Bad
someAsyncFunction();

// Good
someAsyncFunction().catch(err => console.error(err));
```

**Missing Error Handling**:
```typescript
// Bad
const data = await fetchData();

// Good
try {
  const data = await fetchData();
} catch (err) {
  console.error('Fetch failed:', err);
}
```

## Get Detailed Error Info

### Enable Debug Mode

Add to environment variables:
```bash
DEBUG=*
LOG_LEVEL=debug
```

### Check Specific Logs

```bash
# Database logs
grep "database" logs.txt

# Auth logs
grep "auth" logs.txt

# Error logs
grep "error" logs.txt
```

## Contact Support

If nothing works:

1. **Render Support**: support@render.com
2. **Vercel Support**: support@vercel.com
3. **Neon Support**: support@neon.tech

Include:
- Deployment platform
- Error message
- Build logs
- Runtime logs
- Environment (without secrets!)

## Prevention

### Before Next Deployment

1. **Test Locally**
   ```bash
   npm run build
   npm start
   # Visit http://localhost:5000
   ```

2. **Check TypeScript**
   ```bash
   npm run check
   ```

3. **Verify Environment**
   ```bash
   # Create .env.production
   # Add all production variables
   # Test with: NODE_ENV=production npm start
   ```

4. **Test Database**
   ```bash
   # Run migrations
   npm run db:push
   ```

## Success Checklist

- [ ] All environment variables set
- [ ] Database endpoint enabled
- [ ] Google OAuth credentials correct
- [ ] Build completes successfully
- [ ] Health endpoint returns 200
- [ ] Login works
- [ ] No errors in logs
- [ ] App loads correctly

---

**Last Updated**: December 12, 2025  
**Status**: Production Deployment Guide  
**Version**: 1.0.0

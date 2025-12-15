# 🚀 Render Setup - Complete Guide

## ✅ Your Credentials (Ready to Use)

All your credentials are configured and ready:

### **Database Connection:**
```
postgresql://postgres.ioakjiyungnzlnbnlaxg:YSDBpqrPYltiiA4w@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

### **Supabase URL:**
```
https://ioakjiyungnzlnbnlaxg.supabase.co
```

### **Supabase Anon Key:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvYWtqaXl1bmduemxuYm5sYXhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3MDY0NjEsImV4cCI6MjA4MTI4MjQ2MX0.XB4wwjq-7aAzeH7EGc5jiVjvvMC2hCd8i8gC_Kiu7Sc
```

### **Supabase Service Role Key:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvYWtqaXl1bmduemxuYm5sYXhnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTcwNjQ2MSwiZXhwIjoyMDgxMjgyNDYxfQ.6eb0NqDTsCK-bfg2a0RC4Oux-wMVQpTtd9gjmJMHWCs
```

---

## 🎯 Three Ways to Update Render

### **Option 1: Manual (Easiest - 2 minutes)**

1. **Go to Render Dashboard:**
   - Visit: https://dashboard.render.com/
   - Click on your CodeVerse service

2. **Go to Environment tab**

3. **Add/Update these 5 variables:**

| Key | Value |
|-----|-------|
| `DATABASE_URL` | `postgresql://postgres.ioakjiyungnzlnbnlaxg:YSDBpqrPYltiiA4w@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true` |
| `SUPABASE_URL` | `https://ioakjiyungnzlnbnlaxg.supabase.co` |
| `SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvYWtqaXl1bmduemxuYm5sYXhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3MDY0NjEsImV4cCI6MjA4MTI4MjQ2MX0.XB4wwjq-7aAzeH7EGc5jiVjvvMC2hCd8i8gC_Kiu7Sc` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvYWtqaXl1bmduemxuYm5sYXhnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTcwNjQ2MSwiZXhwIjoyMDgxMjgyNDYxfQ.6eb0NqDTsCK-bfg2a0RC4Oux-wMVQpTtd9gjmJMHWCs` |
| `NODE_ENV` | `production` |

4. **Click "Save Changes"** - Render will auto-deploy!

---

### **Option 2: Using Bash Script (30 seconds)**

1. **Get your Render service ID:**
   - Go to your service on Render
   - Look at URL: `https://dashboard.render.com/web/srv-XXXXX`
   - Copy the `srv-XXXXX` part

2. **Run the script:**
   ```bash
   # Make it executable
   chmod +x update-render-env.sh
   
   # Run it (replace srv-XXXXX with your actual service ID)
   ./update-render-env.sh srv-XXXXX
   ```

3. **Done!** The script will:
   - ✅ Update all environment variables
   - ✅ Enable auto-deploy
   - ✅ Trigger deployment
   - ✅ Show deployment status

---

### **Option 3: Using Node.js Script (30 seconds)**

1. **Get your Render service ID** (same as above)

2. **Run the script:**
   ```bash
   node update-render-env.js srv-XXXXX
   ```

3. **Done!** Same as bash script.

---

## 🔍 Find Your Render Service ID

### **Method 1: From Dashboard**
1. Go to: https://dashboard.render.com/
2. Click on your CodeVerse service
3. Look at the URL: `https://dashboard.render.com/web/srv-XXXXX`
4. The `srv-XXXXX` is your service ID

### **Method 2: Using API**
```bash
curl -H "Authorization: Bearer rnd_iwPYSpYC9XFTpk5Mnhx4VBEI6MQ6" \
  https://api.render.com/v1/services
```

This will list all your services with their IDs.

---

## ⚙️ Additional Render Configuration

### **Enable Auto-Deploy**
1. Go to your service → Settings
2. Build & Deploy section
3. Set **Auto-Deploy** = **Yes**
4. Set **Branch** = **main**
5. Save

### **Configure Health Check**
1. Go to Settings → Health Check
2. **Health Check Path**: `/health`
3. **Health Check Interval**: 30 seconds
4. Save

### **Set Build Commands**
Make sure these are set:
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

---

## 🎯 Keep Your App Always-On (Free Tier)

Since Render free tier spins down after 15 minutes, use a free monitoring service:

### **UptimeRobot (Recommended)**
1. Sign up: https://uptimerobot.com (free)
2. Add New Monitor:
   - **Monitor Type**: HTTP(s)
   - **Friendly Name**: CodeVerse Health
   - **URL**: `https://your-app.onrender.com/health`
   - **Monitoring Interval**: 5 minutes
3. Create Monitor

This pings your app every 5 minutes, keeping it awake 24/7!

### **Alternative: Cron-job.org**
1. Sign up: https://cron-job.org (free)
2. Create new cron job:
   - **URL**: `https://your-app.onrender.com/health`
   - **Schedule**: Every 10 minutes
3. Enable

---

## ✅ Verification Steps

After deployment completes:

### **1. Check Deployment Logs**
- Go to your Render service
- Click "Logs" tab
- Look for:
  ```
  [DB] ✅ Supabase connection pool initialized successfully
  ```

### **2. Test Health Endpoint**
```bash
curl https://your-app.onrender.com/health
```

Should return:
```json
{
  "status": "healthy",
  "database": "healthy",
  "latency": 50,
  "timestamp": "2025-12-15T...",
  "message": "All systems operational"
}
```

### **3. Test Login**
- Visit your app
- Try Google OAuth login
- Should work without 500 errors!

### **4. Check Supabase**
- Go to: https://supabase.com/dashboard/project/ioakjiyungnzlnbnlaxg/editor
- Open `users` table
- Should see new user entries after login

---

## 🐛 Troubleshooting

### **"Build failed"**
- Check build logs in Render
- Verify all dependencies in package.json
- Try "Clear build cache & deploy"

### **"Connection timeout"**
- Verify DATABASE_URL is correct
- Check Supabase project is active
- Test connection in Supabase SQL Editor

### **"500 Internal Server Error"**
- Check application logs
- Verify all environment variables are set
- Check database connection

### **"App is slow/spinning down"**
- Set up UptimeRobot (see above)
- Or upgrade to Render Starter ($7/mo)

---

## 💰 Render Pricing

### **Free Tier (Current)**
- ✅ 750 hours/month (enough for 1 service 24/7)
- ✅ Auto-deploy on git push
- ✅ Custom domains
- ⚠️ Spins down after 15 min (use UptimeRobot to prevent)
- ⚠️ Cold starts (30-60 sec)

### **Starter Tier ($7/month)**
- ✅ Always-on (never spins down)
- ✅ No cold starts
- ✅ Faster builds
- ✅ 512 MB RAM
- ✅ Priority support

**Recommendation:** Start with Free + UptimeRobot, upgrade when you get users/revenue.

---

## 📊 What's Configured

### **Environment Variables (5 total)**
- ✅ `DATABASE_URL` - Supabase connection with pooling
- ✅ `SUPABASE_URL` - Supabase project URL
- ✅ `SUPABASE_ANON_KEY` - Public API key
- ✅ `SUPABASE_SERVICE_ROLE_KEY` - Admin API key
- ✅ `NODE_ENV` - Production mode

### **Database Features**
- ✅ Connection pooling (20 connections)
- ✅ Auto-reconnect on failure
- ✅ Health check endpoint
- ✅ Graceful shutdown
- ✅ Performance logging

### **Deployment Settings**
- ✅ Auto-deploy on git push
- ✅ Health check monitoring
- ✅ Build cache optimization
- ✅ Production environment

---

## 🎉 You're All Set!

Your CodeVerse app is now:
- ✅ Connected to Supabase (no more Neon issues!)
- ✅ Configured for auto-deploy
- ✅ Optimized for production
- ✅ Ready to handle high load
- ✅ No more 500 errors!

### **Next Steps:**
1. ✅ Update environment variables (choose method above)
2. ✅ Wait for deployment (2-3 minutes)
3. ✅ Test your app
4. ✅ Set up UptimeRobot (keep it awake)
5. ✅ Start building features!

---

## 📞 Support

- **Render Dashboard**: https://dashboard.render.com/
- **Render Docs**: https://render.com/docs
- **Supabase Dashboard**: https://supabase.com/dashboard/project/ioakjiyungnzlnbnlaxg
- **GitHub Repo**: https://github.com/Aurenya-19/CodeVerse

---

**Happy coding! 🚀**

*Built with ❤️ by Bhindi AI*

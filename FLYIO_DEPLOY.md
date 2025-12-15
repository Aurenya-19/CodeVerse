# Fly.io Deployment Guide for CodeVerse

## Prerequisites
- Fly.io account (free, no credit card required)
- Fly CLI installed

## Quick Deploy (3 Commands Only!)

### 1. Install Fly CLI
**Windows (PowerShell):**
```powershell
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
```

**Mac/Linux:**
```bash
curl -L https://fly.io/install.sh | sh
```

### 2. Login & Deploy
```bash
# Login to Fly.io
fly auth login

# Deploy (from project root)
fly deploy
```

### 3. Set Environment Variables
Run these commands one by one (replace with your actual values):

```bash
fly secrets set DATABASE_URL="your_supabase_connection_string"
fly secrets set GOOGLE_CLIENT_ID="your_google_client_id"
fly secrets set GOOGLE_CLIENT_SECRET="your_google_client_secret"
fly secrets set ISSUER_URL="https://replit.com/oidc"
fly secrets set OPENAI_API_KEY="your_openai_api_key"
fly secrets set SESSION_SECRET="your_session_secret"
fly secrets set REPL_ID="your_repl_id"
```

### 4. Open Your App
```bash
fly open
```

## That's it! Your app is live! 🚀

## Useful Commands
```bash
# Check app status
fly status

# View logs
fly logs

# Scale app
fly scale count 1

# SSH into app
fly ssh console
```

## Free Tier Limits
- ✅ 3 shared VMs (256MB RAM each)
- ✅ 160GB bandwidth/month
- ✅ Always-on (no sleep)
- ✅ Free SSL certificates
- ✅ WebSocket support

## Troubleshooting
If deployment fails, check:
1. Fly CLI is installed: `fly version`
2. You're logged in: `fly auth whoami`
3. Build logs: `fly logs`

## Support
- Fly.io Docs: https://fly.io/docs
- Community: https://community.fly.io

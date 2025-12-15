# Deploy CodeVerse from Replit to Fly.io

## Step 1: Install Fly CLI in Replit

Open Replit Shell and run:

```bash
chmod +x deploy-flyio.sh
./deploy-flyio.sh
```

## Step 2: Add Fly to PATH

```bash
export FLYCTL_INSTALL="/home/runner/.fly"
export PATH="$FLYCTL_INSTALL/bin:$PATH"
```

## Step 3: Verify Installation

```bash
fly version
```

## Step 4: Login to Fly.io

```bash
fly auth login
```

This will open a browser window. Login with your Fly.io account (create one if needed - it's free!).

## Step 5: Deploy

```bash
fly deploy
```

## Step 6: Set Environment Variables

Create a file named `set-secrets.sh` with your actual values and run it:

```bash
#!/bin/bash
fly secrets set DATABASE_URL="your_supabase_url"
fly secrets set GOOGLE_CLIENT_ID="your_client_id"
fly secrets set GOOGLE_CLIENT_SECRET="your_client_secret"
fly secrets set ISSUER_URL="https://replit.com/oidc"
fly secrets set OPENAI_API_KEY="your_openai_key"
fly secrets set SESSION_SECRET="your_session_secret"
fly secrets set REPL_ID="df22e06f-6346-4d64-93ba-1d2f811946dc"
```

Then run:
```bash
chmod +x set-secrets.sh
./set-secrets.sh
```

## Step 7: Open Your App

```bash
fly open
```

## Done! 🎉

Your app is now live on Fly.io with:
- ✅ Free hosting (forever)
- ✅ Always-on (no sleep)
- ✅ SSL certificate
- ✅ WebSocket support
- ✅ Supabase database connected

## Troubleshooting

**If "fly: command not found":**
```bash
export FLYCTL_INSTALL="/home/runner/.fly"
export PATH="$FLYCTL_INSTALL/bin:$PATH"
```

**Check logs:**
```bash
fly logs
```

**Check status:**
```bash
fly status
```

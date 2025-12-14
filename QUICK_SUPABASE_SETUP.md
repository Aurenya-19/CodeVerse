# ⚡ Quick Supabase Setup (5 Minutes)

## Step 1: Get Your Database Password

1. Go to: https://supabase.com/dashboard/project/ioakjiyungnzlnbnlaxg/settings/database
2. Scroll to "Database password" section
3. Click "Reset database password" if you don't remember it
4. **SAVE THIS PASSWORD** - you'll need it!

## Step 2: Get Your Connection String

Your connection string format:
```
postgresql://postgres.ioakjiyungnzlnbnlaxg:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

Replace `[YOUR-PASSWORD]` with the password from Step 1.

**Example:**
If your password is `MySecurePass123`, your connection string is:
```
postgresql://postgres.ioakjiyungnzlnbnlaxg:MySecurePass123@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

## Step 3: Get Your API Keys

1. Go to: https://supabase.com/dashboard/project/ioakjiyungnzlnbnlaxg/settings/api
2. Copy these two keys:

**Anon Key (public):**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvYWtqaXl1bmduemxuYm5sYXhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3MDY0NjEsImV4cCI6MjA4MTI4MjQ2MX0.xxx
```

**Service Role Key (secret - already provided):**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvYWtqaXl1bmduemxuYm5sYXhnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTcwNjQ2MSwiZXhwIjoyMDgxMjgyNDYxfQ.6eb0NqDTsCK-bfg2a0RC4Oux-wMVQpTtd9gjmJMHWCs
```

## Step 4: Run the Migration

1. Go to: https://supabase.com/dashboard/project/ioakjiyungnzlnbnlaxg/sql/new
2. Copy the entire content from: https://github.com/Aurenya-19/CodeVerse/blob/main/supabase-migration.sql
3. Paste into SQL Editor
4. Click "Run" (bottom right)
5. Wait for "Success" message

## Step 5: Update Environment Variables

### On Render:
1. Go to your Render dashboard
2. Select your CodeVerse service
3. Click "Environment" tab
4. Update these variables:

```bash
DATABASE_URL=postgresql://postgres.ioakjiyungnzlnbnlaxg:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true

SUPABASE_URL=https://ioakjiyungnzlnbnlaxg.supabase.co

SUPABASE_ANON_KEY=[YOUR-ANON-KEY-FROM-STEP-3]

SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvYWtqaXl1bmduemxuYm5sYXhnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTcwNjQ2MSwiZXhwIjoyMDgxMjgyNDYxfQ.6eb0NqDTsCK-bfg2a0RC4Oux-wMVQpTtd9gjmJMHWCs
```

5. Click "Save Changes"
6. Render will auto-redeploy

### On Replit:
1. Click the lock icon (Secrets) in sidebar
2. Update the same variables
3. Restart your Repl

## Step 6: Verify It Works

1. Wait for deployment to complete
2. Visit your app URL
3. Try logging in with Google
4. Check Supabase Table Editor: https://supabase.com/dashboard/project/ioakjiyungnzlnbnlaxg/editor
5. You should see data in the `users` table

## ✅ Done!

Your app is now running on Supabase with:
- No more 5-minute suspensions
- Better performance
- Higher load capacity
- Always-on database

## 🐛 If Something Goes Wrong

1. **Check Render logs** for errors
2. **Verify DATABASE_URL** is correct (no typos in password)
3. **Check Supabase dashboard** - is the project active?
4. **Test connection** in Supabase SQL Editor:
   ```sql
   SELECT 1;
   ```

## 📞 Need Help?

Open an issue: https://github.com/Aurenya-19/CodeVerse/issues

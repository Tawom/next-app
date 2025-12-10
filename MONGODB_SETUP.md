# MongoDB Atlas Setup Guide

Follow these steps to set up your free MongoDB Atlas database:

## Step 1: Create MongoDB Atlas Account

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up with email or Google/GitHub
3. Choose the **FREE** tier (M0 Sandbox)

## Step 2: Create a Cluster

1. After signing in, click **"Build a Database"**
2. Choose **M0 FREE** tier (512MB storage)
3. Select a cloud provider:
   - **AWS** (recommended for most regions)
   - **Google Cloud**
   - **Azure**
4. Choose a region **closest to your users** (e.g., US East, Europe West)
5. Name your cluster (or use default)
6. Click **"Create Cluster"** (takes 3-5 minutes)

## Step 3: Create Database User

1. Click **"Database Access"** in left sidebar
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Enter:
   - Username: `travelhub_admin` (or your choice)
   - Password: Click **"Autogenerate Secure Password"** and SAVE IT
5. Set privileges to **"Read and write to any database"**
6. Click **"Add User"**

## Step 4: Whitelist Your IP Address

1. Click **"Network Access"** in left sidebar
2. Click **"Add IP Address"**
3. For development, click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - ⚠️ In production, use specific IP addresses for security
4. Click **"Confirm"**

## Step 5: Get Connection String

1. Click **"Database"** in left sidebar
2. Click **"Connect"** button on your cluster
3. Choose **"Connect your application"**
4. Select:
   - Driver: **Node.js**
   - Version: **5.5 or later**
5. Copy the connection string (looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## Step 6: Configure Your App

1. Create `.env.local` file in your project root (copy from `.env.local.example`):

   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and replace values:

   ```env
   MONGODB_URI=mongodb+srv://travelhub_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/travelhub?retryWrites=true&w=majority
   ```

   **Important replacements:**

   - `<username>` → Your database username (e.g., `travelhub_admin`)
   - `<password>` → Your database password (from Step 3)
   - Add database name after `.net/` → `travelhub`

3. Generate NextAuth secret:
   ```bash
   openssl rand -base64 32
   ```
   Copy the output and paste as `NEXTAUTH_SECRET` in `.env.local`

## Step 7: Seed Initial Data (Optional)

After connecting, run this script to populate your database with tour data:

```bash
npm run seed
```

## Troubleshooting

### Error: "MongooseServerSelectionError"

- Check if IP is whitelisted in Network Access
- Verify username/password are correct
- Ensure cluster is fully deployed (wait 5 minutes)

### Error: "Authentication failed"

- Double-check password (no special characters need escaping)
- Verify username matches exactly
- Check Database Access permissions

### Connection String Format

```
mongodb+srv://username:password@cluster.mongodb.net/database?options

Components:
- protocol: mongodb+srv://
- username: travelhub_admin
- password: yourSecurePassword123
- host: cluster0.xxxxx.mongodb.net
- database: travelhub
- options: ?retryWrites=true&w=majority
```

## Security Best Practices

1. ✅ Never commit `.env.local` to Git (already in `.gitignore`)
2. ✅ Use different credentials for dev/staging/production
3. ✅ Rotate passwords regularly
4. ✅ In production, whitelist specific IP addresses only
5. ✅ Use MongoDB Atlas alerts for unusual activity

## Next Steps

Once connected, you can:

- ✅ Run the app: `npm run dev`
- ✅ Test database connection in browser console
- ✅ Create user accounts
- ✅ Book tours
- ✅ View booking history

## Free Tier Limits

MongoDB Atlas M0 (Free) includes:

- ✅ 512 MB storage
- ✅ Shared RAM
- ✅ No credit card required
- ✅ Perfect for development and small apps
- ⚠️ Upgrade to M10+ for production apps with high traffic

---

**Need help?** MongoDB Atlas has excellent documentation at:
https://www.mongodb.com/docs/atlas/

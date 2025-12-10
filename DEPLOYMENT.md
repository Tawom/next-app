# Deployment Guide - TravelHub

## Quick Deploy to Vercel

### 1. Prerequisites

- Vercel account (sign up at https://vercel.com)
- MongoDB Atlas database
- Environment variables ready

### 2. Deploy Steps

**Option A: Using Vercel CLI (Current Method)**

```bash
npx vercel --prod
```

**Option B: Using Vercel Dashboard (Recommended for First Deploy)**

1. Go to https://vercel.com/new
2. Import your Git repository
3. Configure project settings
4. Add environment variables (see below)
5. Click Deploy

### 3. Required Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=https://your-app.vercel.app

# Stripe (Optional - for payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (Optional - for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

### 4. Get Environment Variables

**MongoDB URI:**

1. Go to MongoDB Atlas → Clusters → Connect
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database password

**NextAuth Secret:**

```bash
openssl rand -base64 32
```

**NextAuth URL:**

- Use your Vercel deployment URL (e.g., `https://your-app.vercel.app`)

### 5. After Deployment

1. **Set up admin user:**

   - Create account via signup page
   - Run admin script locally:

   ```bash
   MONGODB_URI="your_production_mongodb_uri" node scripts/makeAdmin.js your_email@example.com
   ```

2. **Seed tours (optional):**

   ```bash
   MONGODB_URI="your_production_mongodb_uri" node scripts/seed.mjs
   ```

3. **Test the deployment:**
   - Visit your Vercel URL
   - Sign up/Sign in
   - Browse tours
   - Test booking flow

### 6. Custom Domain (Optional)

1. Go to Vercel Dashboard → Settings → Domains
2. Add your custom domain
3. Update NEXTAUTH_URL to your custom domain

### 7. Troubleshooting

**Build Failed:**

- Check Vercel build logs for errors
- Ensure all dependencies are in package.json
- Verify environment variables are set

**Database Connection Issues:**

- Check MongoDB Atlas network access (allow 0.0.0.0/0)
- Verify connection string is correct
- Check database user has correct permissions

**Auth Not Working:**

- Verify NEXTAUTH_URL matches your deployment URL
- Check NEXTAUTH_SECRET is set
- Clear browser cookies and try again

**Images Not Loading:**

- Ensure image hostnames are in next.config.ts
- Check image URLs are accessible

### 8. Monitoring

- View deployment logs: Vercel Dashboard → Deployments → [deployment]
- Monitor errors: Vercel Dashboard → Analytics
- Check performance: Vercel Dashboard → Speed Insights

### 9. Continuous Deployment

Once connected to Git (GitHub/GitLab):

- Push to main branch → Automatic production deployment
- Push to other branches → Preview deployments
- Pull requests → Preview deployments with unique URLs

## Alternative: Deploy to Other Platforms

**Netlify:**

- Similar process to Vercel
- Add environment variables in Netlify dashboard

**Railway:**

- Supports MongoDB hosting
- Good for full-stack apps

**AWS/DigitalOcean:**

- More control but requires server setup
- Use PM2 for process management
- Set up Nginx reverse proxy

## Production Checklist

- [ ] Environment variables configured
- [ ] MongoDB Atlas network access configured
- [ ] Admin user created
- [ ] Tours seeded (optional)
- [ ] Test authentication flow
- [ ] Test booking flow
- [ ] Test payment flow (if using Stripe)
- [ ] Custom domain configured (optional)
- [ ] SSL/HTTPS working
- [ ] Error monitoring set up
- [ ] Performance optimized

## Security Best Practices

1. **Never commit .env.local to Git** - Already in .gitignore
2. **Use strong NEXTAUTH_SECRET** - Generate with openssl
3. **Enable MongoDB authentication** - Use strong passwords
4. **Set up rate limiting** - Prevent abuse
5. **Monitor logs** - Watch for suspicious activity
6. **Keep dependencies updated** - Regular npm audit
7. **Use HTTPS only** - Vercel does this automatically

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment
- MongoDB Atlas: https://www.mongodb.com/docs/atlas/

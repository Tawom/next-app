# Stripe Payment Integration Setup Guide

This guide will help you set up Stripe payment integration for tour bookings.

## 📋 Prerequisites

- Stripe account (free to create at https://stripe.com)
- Development environment running
- MongoDB connected

## 🔑 Step 1: Get Stripe API Keys

### Create Stripe Account

1. Go to https://stripe.com and sign up
2. Complete account setup
3. Navigate to Developers → API keys

### Get Test Keys (for development)

1. Toggle "Viewing test data" ON (top right)
2. Copy your **Publishable key** (starts with `pk_test_`)
3. Click "Reveal test key" for **Secret key** (starts with `sk_test_`)

### Get Webhook Secret

1. Go to Developers → Webhooks
2. Click "Add endpoint"
3. **Endpoint URL**: `https://yourdomain.com/api/webhooks/stripe`
   - For local testing: Use ngrok (see Step 3)
4. **Events to send**: Select `checkout.session.completed`
5. Click "Add endpoint"
6. Click "Reveal" under "Signing secret" (starts with `whsec_`)

## 🔧 Step 2: Configure Environment Variables

Add these to your `.env.local` file:

\`\`\`env

# Stripe Keys (Test Mode)

STRIPE_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
\`\`\`

**Important**:

- Never commit your secret keys to git
- Use test keys for development
- Use live keys only in production

## 🧪 Step 3: Test Locally with Webhooks

Stripe webhooks need a public URL. For local testing, use ngrok:

### Install ngrok

\`\`\`bash

# macOS

brew install ngrok

# Or download from https://ngrok.com

\`\`\`

### Start ngrok tunnel

\`\`\`bash

# In a new terminal

ngrok http 3000
\`\`\`

You'll see output like:
\`\`\`
Forwarding https://abcd-1234.ngrok.io -> http://localhost:3000
\`\`\`

### Update Stripe webhook endpoint

1. Go to Stripe Dashboard → Webhooks
2. Edit your webhook endpoint
3. Update URL to: `https://abcd-1234.ngrok.io/api/webhooks/stripe`
4. Save changes

## ✅ Step 4: Test the Integration

### 1. Start your app

\`\`\`bash
npm run dev
\`\`\`

### 2. Make a test booking

1. Go to any tour page
2. Select date and number of people
3. Click "Proceed to Payment"
4. You'll be redirected to Stripe Checkout

### 3. Use Stripe test cards

Use these test card numbers:

**Successful payment:**

- Card: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., 12/34)
- CVC: Any 3 digits (e.g., 123)
- ZIP: Any 5 digits (e.g., 12345)

**Failed payment:**

- Card: `4000 0000 0000 0002`

**3D Secure required:**

- Card: `4000 0025 0000 3155`

### 4. Verify the booking

1. After successful payment, you'll be redirected to success page
2. Check your email for confirmation (if email is configured)
3. Check MongoDB - booking should exist with `status: "confirmed"`
4. Check Stripe Dashboard → Payments - payment should appear

## 🚀 Step 5: Production Setup

### Before going live:

1. **Get Live API Keys**

   - In Stripe Dashboard, toggle "Viewing test data" OFF
   - Copy live keys (pk_live_xxx and sk_live_xxx)

2. **Update Environment Variables**
   \`\`\`env
   STRIPE_SECRET_KEY=sk_live_your_live_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_key
   \`\`\`

3. **Configure Production Webhook**

   - Add webhook with your production URL
   - Select `checkout.session.completed` event
   - Copy new webhook secret to env vars

4. **Activate Stripe Account**

   - Complete business verification
   - Add bank account for payouts
   - Set up billing

5. **Test in Production**
   - Make a real $1 test transaction
   - Verify booking creation
   - Verify email sending
   - Issue refund if needed

## 🔒 Security Best Practices

### Environment Variables

- ✅ Use `.env.local` for secrets
- ✅ Add `.env.local` to `.gitignore`
- ✅ Use different keys for dev/staging/prod
- ❌ Never commit keys to git
- ❌ Never expose secret keys in client code

### Webhook Security

- ✅ Always verify webhook signatures
- ✅ Use HTTPS in production
- ✅ Handle duplicate events (check if booking exists)
- ✅ Log webhook events for debugging

### Payment Validation

- ✅ Verify amounts server-side
- ✅ Check tour availability before creating session
- ✅ Validate user authentication
- ✅ Use Stripe's built-in fraud protection

## 🐛 Troubleshooting

### Webhook not receiving events

**Problem**: Payments succeed but no booking is created

**Solutions**:

1. Check ngrok is running (for local dev)
2. Verify webhook URL in Stripe Dashboard
3. Check webhook secret matches `.env.local`
4. Check webhook logs in Stripe Dashboard
5. Check server logs for errors

### "No such checkout session" error

**Problem**: Error when redirecting to Stripe

**Solutions**:

1. Verify STRIPE_SECRET_KEY is correct
2. Check API key mode matches (test vs live)
3. Check session ID is being returned correctly

### Booking created but no email

**Problem**: Booking exists but user didn't get email

**Solutions**:

1. Email sending is non-blocking - check server logs
2. Verify SMTP settings (see EMAIL_SETUP.md)
3. Check spam folder
4. Verify customer email in Stripe session

### Amount mismatch

**Problem**: Wrong amount charged

**Solutions**:

1. Prices are in cents - use formatAmountForStripe()
2. Verify tour price in database
3. Check numberOfPeople calculation

## 📊 Monitoring

### Stripe Dashboard

- Monitor all payments: Payments tab
- Check failed payments: Failed tab
- Review disputes: Disputes tab
- Analyze revenue: Analytics tab

### Application Logs

\`\`\`bash

# Check for booking creation

grep "Booking created successfully" logs

# Check for webhook errors

grep "Webhook" logs | grep "error"
\`\`\`

### Database Checks

\`\`\`javascript
// Count confirmed bookings
db.bookings.countDocuments({ status: "confirmed" })

// Find unpaid bookings
db.bookings.find({ paymentStatus: "unpaid" })

// Check recent Stripe payments
db.bookings.find({ stripeSessionId: { $exists: true } }).sort({ createdAt: -1 })
\`\`\`

## 💰 Pricing & Fees

### Stripe Fees (as of 2024)

- **Per transaction**: 2.9% + $0.30
- **International cards**: +1.5%
- **Currency conversion**: +1%

### Example

- Tour price: $100
- Number of people: 2
- Subtotal: $200
- Stripe fee: $200 \* 0.029 + $0.30 = $6.10
- **You receive**: $193.90

### Reducing Fees

- Use Stripe Billing for subscriptions (2.9% flat)
- Negotiate custom pricing at high volume
- Pass fees to customers (be transparent)

## 📞 Support

### Stripe Support

- Documentation: https://stripe.com/docs
- Support: https://support.stripe.com
- Status: https://status.stripe.com

### Common Issues

- **Test cards**: https://stripe.com/docs/testing
- **Webhooks**: https://stripe.com/docs/webhooks
- **Checkout**: https://stripe.com/docs/payments/checkout

## 🎯 Next Steps

After setting up payments:

1. **Test thoroughly** with all test cards
2. **Set up refund handling** for cancellations
3. **Add receipt emails** (Stripe auto-sends these)
4. **Configure tax collection** if needed
5. **Set up subscription plans** for recurring revenue
6. **Enable Apple Pay / Google Pay** (automatic with Checkout)

## ✨ Features Included

- ✅ Secure payment processing
- ✅ PCI compliance (handled by Stripe)
- ✅ Multiple payment methods (card, Apple Pay, Google Pay)
- ✅ 3D Secure authentication
- ✅ Fraud prevention
- ✅ Webhook verification
- ✅ Automatic booking creation
- ✅ Email confirmations
- ✅ Mobile-optimized checkout

Your Stripe integration is now complete! 🎉

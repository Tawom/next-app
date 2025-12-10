# Email Notifications Setup Guide

## Overview

TravelHub uses **Nodemailer** to send transactional emails for booking confirmations and cancellations. This guide will help you configure email sending using Gmail or a custom SMTP server.

## Features

- ✅ Booking confirmation emails (when booking is created)
- ✅ Booking confirmation emails (when user confirms pending booking)
- ✅ Booking cancellation emails
- ✅ Beautiful HTML email templates
- ✅ Fallback to plain text emails
- ✅ Non-blocking email sending (doesn't slow down API responses)

## Configuration

### Option 1: Using Gmail (Easiest for Development)

1. **Enable 2-Factor Authentication** on your Gmail account

   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate App Password**

   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the 16-character password

3. **Add to `.env.local`**
   ```bash
   # Email Configuration (Gmail)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-16-char-app-password
   ```

### Option 2: Using Custom SMTP Server

```bash
# Email Configuration (Custom SMTP)
SMTP_HOST=smtp.yourserver.com
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASSWORD=your-password
```

### Option 3: Using SendGrid (Production Recommended)

1. Sign up at https://sendgrid.com
2. Create an API key
3. Configure:

```bash
# Email Configuration (SendGrid)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
```

### Option 4: Using Mailgun

1. Sign up at https://www.mailgun.com
2. Get SMTP credentials
3. Configure:

```bash
# Email Configuration (Mailgun)
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=your-mailgun-username
SMTP_PASSWORD=your-mailgun-password
```

## Testing Email Setup

### Test in Development

1. Create a test booking in your app
2. Check the server console for logs:
   ```
   ✅ Booking confirmation email sent to user@example.com
   ```
3. Check your email inbox

### Test Email Function Directly

Create a test file `scripts/testEmail.ts`:

```typescript
import { sendBookingConfirmation } from "../lib/email";

async function testEmail() {
  const result = await sendBookingConfirmation({
    userName: "Test User",
    userEmail: "your-test-email@gmail.com",
    tourName: "Amazing Iceland Adventure",
    tourLocation: "Reykjavik, Iceland",
    startDate: new Date().toISOString(),
    numberOfPeople: 2,
    totalPrice: 1998,
    bookingId: "test123",
  });

  console.log("Email test result:", result);
}

testEmail();
```

Run: `npx tsx scripts/testEmail.ts`

## Email Templates

### Confirmation Email Features

- Professional gradient header
- Booking details card
- Tour information
- Guest count and pricing
- "View Booking" button linking to the app
- Next steps information
- Support contact info

### Cancellation Email Features

- Clear cancellation notice
- Booking details
- Support contact info
- Encouragement for future bookings

## Troubleshooting

### Email Not Sending

1. **Check Environment Variables**

   ```bash
   # In terminal
   echo $SMTP_USER
   echo $SMTP_HOST
   ```

2. **Check Console Logs**

   - Look for error messages in terminal
   - Check if email function was called

3. **Common Issues**
   - Gmail: "Less secure app access" disabled → Use App Password
   - Wrong SMTP port → Try 587 or 465
   - Firewall blocking SMTP → Check network settings
   - Wrong credentials → Double-check .env.local

### Email Goes to Spam

- Add SPF and DKIM records to your domain
- Use a professional email service (SendGrid, Mailgun)
- Avoid spam trigger words in subject/body
- Include unsubscribe link (for marketing emails)

### Email Delays

- Emails are sent asynchronously (non-blocking)
- May take 1-30 seconds to arrive
- Check spam folder
- Use production email service for reliability

## Production Recommendations

### For Production Deployment:

1. **Use Professional Email Service**

   - SendGrid, Mailgun, AWS SES, or Postmark
   - Better deliverability
   - Analytics and tracking
   - Higher sending limits

2. **Set Up Domain Authentication**

   - Configure SPF records
   - Set up DKIM
   - Add DMARC policy

3. **Monitor Email Delivery**

   - Track bounce rates
   - Monitor spam complaints
   - Set up webhooks for delivery status

4. **Environment Variables**
   ```bash
   # Production .env (Vercel/Railway)
   SMTP_HOST=your-production-smtp
   SMTP_PORT=587
   SMTP_USER=your-production-email
   SMTP_PASSWORD=your-production-password
   NEXTAUTH_URL=https://yourdomain.com
   ```

## Email Flow

### When Booking is Created:

1. User submits booking form
2. API creates booking in database
3. API sends confirmation email (async)
4. User receives email with booking details

### When Status Changes:

1. User confirms or cancels booking
2. API updates status in database
3. API sends appropriate email (confirmation or cancellation)
4. User receives notification

## Customization

### Modify Email Templates

Edit `/lib/email.ts`:

```typescript
// Customize email HTML in sendBookingConfirmation()
const emailHtml = `
  <!-- Your custom HTML here -->
`;
```

### Add New Email Types

```typescript
export async function sendWelcomeEmail(data: WelcomeEmailData) {
  // Your implementation
}
```

### Change Email Styling

- Modify inline CSS in email templates
- Update colors, fonts, layout
- Test in multiple email clients

## Security Notes

- Never commit `.env.local` to Git
- Use app-specific passwords for Gmail
- Rotate credentials regularly
- Use environment variables for all sensitive data
- In production, use secret management (Vercel Env Vars, AWS Secrets Manager)

## Cost Considerations

- **Gmail**: Free for low volume (use for development only)
- **SendGrid**: Free tier: 100 emails/day
- **Mailgun**: Free tier: 5,000 emails/month
- **AWS SES**: $0.10 per 1,000 emails
- **Postmark**: $10/month for 10,000 emails

## Support

For issues with email delivery, check:

1. Server console logs
2. Email service dashboard (if using SendGrid/Mailgun)
3. Spam folder
4. Email service status page

---

**Next Steps:**

1. Set up environment variables
2. Test email in development
3. Create test booking
4. Check inbox for confirmation email
5. Deploy to production with professional email service

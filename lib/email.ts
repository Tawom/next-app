import nodemailer from "nodemailer";

/**
 * Email Service using Nodemailer
 *
 * Sends transactional emails for booking confirmations, notifications, etc.
 * Uses Gmail SMTP or custom SMTP server
 */

// Create reusable transporter
const createTransporter = () => {
  // Check if email credentials are configured
  if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    console.warn(
      "⚠️ Email credentials not configured. Emails will not be sent."
    );
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

interface BookingEmailData {
  userName: string;
  userEmail: string;
  tourName: string;
  tourLocation: string;
  startDate: string;
  numberOfPeople: number;
  totalPrice: number;
  bookingId: string;
}

/**
 * Send booking confirmation email
 */
export async function sendBookingConfirmation(data: BookingEmailData) {
  const {
    userName,
    userEmail,
    tourName,
    tourLocation,
    startDate,
    numberOfPeople,
    totalPrice,
    bookingId,
  } = data;

  const formattedDate = new Date(startDate).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            background: #f9fafb;
            padding: 30px;
            border-radius: 0 0 10px 10px;
          }
          .booking-details {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #e5e7eb;
          }
          .detail-row:last-child {
            border-bottom: none;
          }
          .label {
            color: #6b7280;
            font-weight: 600;
          }
          .value {
            color: #111827;
            font-weight: 700;
          }
          .total {
            background: #dbeafe;
            padding: 15px;
            border-radius: 6px;
            margin-top: 10px;
          }
          .button {
            display: inline-block;
            background: #2563eb;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            color: #6b7280;
            font-size: 14px;
            margin-top: 30px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Booking Confirmed!</h1>
            <p>Your adventure awaits</p>
          </div>
          
          <div class="content">
            <p>Hi ${userName},</p>
            
            <p>Great news! Your booking has been confirmed. We're excited to have you join us on this amazing journey!</p>
            
            <div class="booking-details">
              <h2 style="margin-top: 0; color: #111827;">Booking Details</h2>
              
              <div class="detail-row">
                <span class="label">Tour:</span>
                <span class="value">${tourName}</span>
              </div>
              
              <div class="detail-row">
                <span class="label">Location:</span>
                <span class="value">📍 ${tourLocation}</span>
              </div>
              
              <div class="detail-row">
                <span class="label">Date:</span>
                <span class="value">📅 ${formattedDate}</span>
              </div>
              
              <div class="detail-row">
                <span class="label">Guests:</span>
                <span class="value">👥 ${numberOfPeople} ${
    numberOfPeople === 1 ? "person" : "people"
  }</span>
              </div>
              
              <div class="total">
                <div class="detail-row">
                  <span class="label">Total Amount:</span>
                  <span class="value" style="color: #2563eb; font-size: 18px;">$${totalPrice.toLocaleString()}</span>
                </div>
              </div>
              
              <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
                <span class="label">Booking ID:</span>
                <span style="font-family: monospace; color: #6b7280;">${bookingId}</span>
              </div>
            </div>
            
            <center>
              <a href="${
                process.env.NEXTAUTH_URL || "http://localhost:3000"
              }/bookings/${bookingId}" class="button">
                View Booking Details
              </a>
            </center>
            
            <h3>What's Next?</h3>
            <ul style="color: #4b5563;">
              <li>Check your email for further instructions</li>
              <li>Prepare any required documents</li>
              <li>Get ready for an amazing experience!</li>
            </ul>
            
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              If you have any questions, feel free to contact us at support@travelhub.com
            </p>
          </div>
          
          <div class="footer">
            <p>© 2025 TravelHub. All rights reserved.</p>
            <p>You're receiving this email because you made a booking on TravelHub.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const emailText = `
    Booking Confirmed!
    
    Hi ${userName},
    
    Your booking has been confirmed!
    
    Booking Details:
    - Tour: ${tourName}
    - Location: ${tourLocation}
    - Date: ${formattedDate}
    - Guests: ${numberOfPeople}
    - Total: $${totalPrice}
    - Booking ID: ${bookingId}
    
    View your booking: ${
      process.env.NEXTAUTH_URL || "http://localhost:3000"
    }/bookings/${bookingId}
    
    If you have any questions, contact us at support@travelhub.com
    
    © 2025 TravelHub
  `;

  const transporter = createTransporter();

  if (!transporter) {
    console.log("📧 Email skipped - credentials not configured");
    return { success: false, error: "Email not configured" };
  }

  try {
    await transporter.sendMail({
      from: `"TravelHub" <${process.env.SMTP_USER}>`,
      to: userEmail,
      subject: `Booking Confirmed: ${tourName}`,
      text: emailText,
      html: emailHtml,
    });

    console.log(`✅ Booking confirmation email sent to ${userEmail}`);
    return { success: true };
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return { success: false, error };
  }
}

/**
 * Send booking cancellation email
 */
export async function sendBookingCancellation(data: BookingEmailData) {
  const { userName, userEmail, tourName, startDate, bookingId } = data;

  const formattedDate = new Date(startDate).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: #ef4444;
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            background: #f9fafb;
            padding: 30px;
            border-radius: 0 0 10px 10px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Booking Cancelled</h1>
          </div>
          
          <div class="content">
            <p>Hi ${userName},</p>
            
            <p>Your booking for <strong>${tourName}</strong> scheduled for ${formattedDate} has been cancelled.</p>
            
            <p>Booking ID: <code>${bookingId}</code></p>
            
            <p>If you cancelled by mistake or have any questions, please contact us at support@travelhub.com</p>
            
            <p>We hope to see you on another adventure soon!</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const transporter = createTransporter();

  if (!transporter) {
    console.log("📧 Email skipped - credentials not configured");
    return { success: false, error: "Email not configured" };
  }

  try {
    await transporter.sendMail({
      from: `"TravelHub" <${process.env.SMTP_USER}>`,
      to: userEmail,
      subject: `Booking Cancelled: ${tourName}`,
      html: emailHtml,
    });

    console.log(`✅ Cancellation email sent to ${userEmail}`);
    return { success: true };
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return { success: false, error };
  }
}

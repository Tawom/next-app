import { NextResponse } from "next/server";
import { sendBookingConfirmation } from "@/lib/email";

/**
 * Test Email Endpoint
 *
 * Use this to test if email sending is working
 * GET /api/test-email?email=your@email.com
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const testEmail = searchParams.get("email");

  if (!testEmail) {
    return NextResponse.json(
      {
        error:
          "Please provide email parameter: /api/test-email?email=your@email.com",
      },
      { status: 400 }
    );
  }

  try {
    const result = await sendBookingConfirmation({
      userName: "Test User",
      userEmail: testEmail,
      tourName: "Test Tour - Email Configuration Check",
      tourLocation: "Test Location",
      startDate: new Date().toISOString(),
      numberOfPeople: 2,
      totalPrice: 1000,
      bookingId: "TEST123",
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `✅ Email sent successfully to ${testEmail}!`,
        details: "Check your inbox (and spam folder)",
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "❌ Email sending failed",
        error: result.error || "Unknown error",
        hint: "Check if SMTP credentials are configured in .env.local",
      });
    }
  } catch (error) {
    console.error("Test email error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "❌ Error sending test email",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

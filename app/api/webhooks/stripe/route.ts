import { NextResponse } from "next/server";
import { headers } from "next/headers";
// import type { Stripe } from "stripe"; // Type-only import if needed
import { getStripe } from "@/lib/stripe";
import connectDB from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Tour from "@/models/Tour"; // Required for .populate()
import User from "@/models/User";
import { sendBookingConfirmation } from "@/lib/email";

/**
 * POST /api/webhooks/stripe
 *
 * Stripe Webhook Handler
 *
 * This endpoint receives real-time events from Stripe when payments succeed.
 *
 * Why webhooks?
 * - Reliable payment confirmation (not dependent on user's browser)
 * - Server-side verification (secure)
 * - Handles edge cases (user closes browser, network issues, etc.)
 * - Required for production payment systems
 *
 * Flow:
 * 1. Payment succeeds on Stripe
 * 2. Stripe sends webhook event to this endpoint
 * 3. We verify the event signature
 * 4. Create booking in database
 * 5. Send confirmation email
 *
 * Security:
 * - Webhook signature verification prevents fake events
 * - Only processes verified events from Stripe
 */

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 503 });
  }
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "No signature provided" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      await connectDB();

      // Get user by email
      const user = await User.findOne({ email: session.customer_email });

      if (!user) {
        console.error("User not found:", session.customer_email);
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // Extract metadata
      const { tourId, startDate, numberOfPeople } = session.metadata!;

      // Get tour details
      const tour = await Tour.findById(tourId);
      if (!tour) {
        console.error("Tour not found:", tourId);
        return NextResponse.json({ error: "Tour not found" }, { status: 404 });
      }

      // Create booking
      const booking = await Booking.create({
        user: session.customer_email!,
        tour: tourId,
        startDate: new Date(startDate),
        numberOfPeople: parseInt(numberOfPeople),
        totalPrice: session.amount_total! / 100, // Convert from cents
        status: "confirmed", // Payment already confirmed
        paymentStatus: "paid",
        stripeSessionId: session.id,
      });

      // Send confirmation email
      try {
        await sendBookingConfirmation({
          userName: user.name || "Traveler",
          userEmail: session.customer_email!,
          bookingId: booking._id.toString(),
          tourName: tour.name,
          tourLocation: tour.location,
          startDate: startDate,
          numberOfPeople: parseInt(numberOfPeople),
          totalPrice: session.amount_total! / 100,
        });
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
        // Don't fail the webhook if email fails
      }

      console.log("Booking created successfully:", booking._id);
    } catch (error) {
      console.error("Error creating booking:", error);
      return NextResponse.json(
        { error: "Failed to create booking" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}

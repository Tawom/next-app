import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { stripe, formatAmountForStripe } from "@/lib/stripe";
import connectDB from "@/lib/mongodb";
import Tour from "@/models/Tour";

/**
 * POST /api/create-checkout-session
 *
 * Creates a Stripe Checkout session for tour booking payment.
 *
 * Flow:
 * 1. User clicks "Book Now" on tour page
 * 2. This API creates a Stripe Checkout session
 * 3. User is redirected to Stripe's hosted checkout page
 * 4. After payment, user is redirected back to success page
 * 5. Webhook confirms payment and creates booking
 *
 * Why Stripe Checkout?
 * - Pre-built, secure payment UI
 * - Handles multiple payment methods
 * - Mobile-optimized
 * - PCI compliant out of the box
 * - Supports 3D Secure and fraud prevention
 */

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { tourId, startDate, numberOfPeople } = await request.json();

    if (!tourId || !startDate || !numberOfPeople) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();
    const tour = await Tour.findById(tourId);

    if (!tour) {
      return NextResponse.json({ error: "Tour not found" }, { status: 404 });
    }

    // Create Stripe Checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: tour.name,
              description: `${tour.duration}-day tour in ${tour.location}`,
              images: [tour.imageUrl],
            },
            unit_amount: formatAmountForStripe(tour.price),
          },
          quantity: numberOfPeople,
        },
      ],
      customer_email: session.user.email,
      metadata: {
        tourId: tourId,
        startDate: startDate,
        numberOfPeople: numberOfPeople.toString(),
        userEmail: session.user.email,
      },
      success_url: `${process.env.NEXTAUTH_URL}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/tours/${tourId}`,
    });

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

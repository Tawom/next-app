import mongoose, { Schema, Document, Model, Types } from "mongoose";

/**
 * Booking Model
 *
 * Links users to tours with booking details
 *
 * Relationships:
 * - One user can have many bookings
 * - One tour can have many bookings
 * - Each booking belongs to one user and one tour
 */

export interface IBooking extends Document {
  tour: Types.ObjectId; // Reference to Tour
  user: string; // User email address
  startDate: Date;
  numberOfPeople: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled";
  paymentStatus: "unpaid" | "paid" | "refunded";
  stripeSessionId?: string; // Stripe checkout session ID
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    tour: {
      type: Schema.Types.ObjectId,
      ref: "Tour", // Reference to Tour model
      required: [true, "Booking must belong to a tour"],
    },
    user: {
      type: String,
      required: [true, "Booking must belong to a user"],
    },
    startDate: {
      type: Date,
      required: [true, "Booking must have a start date"],
    },
    numberOfPeople: {
      type: Number,
      required: [true, "Booking must have number of people"],
      min: [1, "At least one person is required"],
    },
    totalPrice: {
      type: Number,
      required: [true, "Booking must have a price"],
      min: [0, "Price cannot be negative"],
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded"],
      default: "unpaid",
    },
    stripeSessionId: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for user's booking history queries
BookingSchema.index({ user: 1, createdAt: -1 });
// Index for tour availability queries
BookingSchema.index({ tour: 1, startDate: 1 });

const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking;

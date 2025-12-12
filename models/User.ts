import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

/**
 * User Model for Authentication
 *
 * Why use Mongoose schemas?
 * - Data validation (email format, required fields)
 * - Type safety with TypeScript
 * - Middleware (hash passwords before saving)
 * - Methods (compare passwords, generate tokens)
 *
 * Security features:
 * - Passwords are hashed with bcrypt (never stored in plain text)
 * - Password field excluded from queries by default
 * - Email validation and uniqueness
 */

export interface IUser extends Document {
  name: string;
  username?: string;
  email: string;
  password: string;
  avatar?: string;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Don't return password in queries by default
    },
    avatar: {
      type: String,
      default: "https://api.dicebear.com/7.x/avataaars/svg?seed=default",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt
  }
);

/**
 * Middleware: Hash password before saving
 *
 * Why pre-save hook?
 * - Automatically runs before document is saved
 * - Ensures passwords are always hashed
 * - No need to remember to hash manually
 *
 * How bcrypt works:
 * - Generates a salt (random data)
 * - Combines password + salt
 * - Hashes the result (one-way encryption)
 * - Cost factor 12 = 2^12 iterations (secure but not too slow)
 */
UserSchema.pre("save", async function () {
  // Only hash if password is modified
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Method: Compare password for login
 *
 * @param candidatePassword - Plain text password from login form
 * @returns boolean - true if passwords match
 *
 * How it works:
 * - User enters password: "mypassword123"
 * - bcrypt.compare hashes it with same salt
 * - Compares with stored hash
 * - Returns true/false
 */
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Prevent model recompilation in development (Next.js hot reload)
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;

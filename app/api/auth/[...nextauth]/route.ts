import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

/**
 * NextAuth Configuration
 *
 * What this does:
 * - Defines how users authenticate (email + password)
 * - Manages sessions (who's logged in)
 * - Handles callbacks (what happens after login)
 *
 * Why CredentialsProvider?
 * - Allows custom login with email/password
 * - We control the authentication logic
 * - Can validate against our MongoDB database
 *
 * Flow:
 * 1. User submits email + password
 * 2. authorize() function runs
 * 3. Check if user exists in database
 * 4. Compare password hash
 * 5. Return user object if valid
 * 6. Session created automatically
 */

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter email and password");
        }

        try {
          // Connect to database
          await connectDB();

          // Find user by email (include password field)
          const user = await User.findOne({ email: credentials.email }).select(
            "+password"
          );

          if (!user) {
            throw new Error("No user found with this email");
          }

          // Compare password using bcrypt
          const isPasswordValid = await user.comparePassword(
            credentials.password
          );

          if (!isPasswordValid) {
            throw new Error("Invalid password");
          }

          // Return user object (without password)
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            avatar: user.avatar,
            role: user.role,
          };
        } catch (error) {
          console.error("Auth error:", error);
          throw error;
        }
      },
    }),
  ],

  /**
   * Callbacks - Customize session and JWT
   *
   * Why we need these?
   * - Add custom fields to session (role, avatar)
   * - Make user data available on client side
   * - Control what's stored in JWT token
   */
  callbacks: {
    async jwt({ token, user }) {
      // Add user data to JWT token on sign in
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.avatar = user.avatar;
      }
      return token;
    },
    async session({ session, token }) {
      // Add custom fields to session
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.avatar = token.avatar as string;
      }
      return session;
    },
  },

  /**
   * Pages - Custom auth pages
   *
   * Instead of NextAuth default pages, use our own
   */
  pages: {
    signIn: "/auth/signin",
    // signUp: '/auth/signup', // We'll create this
    error: "/auth/error",
  },

  /**
   * Session strategy
   *
   * JWT: Stateless, token stored in cookie
   * Database: Session stored in database (more secure but slower)
   *
   * We use JWT for simplicity and performance
   */
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  /**
   * Secret for encrypting tokens
   * Must be set in .env.local
   */
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

// Export for both GET and POST requests
export { handler as GET, handler as POST };

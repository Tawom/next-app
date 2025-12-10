import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * NextAuth Route Handler
 *
 * Configuration is in /lib/auth.ts to avoid circular dependencies
 */

const handler = NextAuth(authOptions);

// Export for both GET and POST requests
export { handler as GET, handler as POST };

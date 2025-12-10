/**
 * NextAuth Type Extensions
 *
 * Why this file?
 * - NextAuth's default types don't include our custom fields (role, avatar)
 * - TypeScript needs to know about these fields
 * - Extends the built-in types with our additions
 *
 * This gives us autocomplete and type safety for:
 * - session.user.role
 * - session.user.avatar
 * - session.user.id
 */

import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      avatar?: string;
      role: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    avatar?: string;
  }
}

"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { ReactNode } from "react";

/**
 * Session Provider Wrapper
 *
 * Why this component?
 * - NextAuth's SessionProvider must be a Client Component
 * - But our root layout is a Server Component
 * - This wrapper bridges the gap
 *
 * Usage:
 * - Wrap app in layout.tsx
 * - Makes session available to all components
 * - useSession() hook works anywhere
 */

interface Props {
  children: ReactNode;
}

export default function SessionProvider({ children }: Props) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}

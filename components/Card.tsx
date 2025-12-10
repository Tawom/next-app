import React from "react";

/**
 * Card Component
 *
 * A versatile container component for displaying content in a card layout.
 * Used for tour listings, featured content, and other grouped information.
 *
 * @param children - The content to be displayed inside the card
 * @param className - Additional custom classes for specific styling needs
 * @param hover - Enable hover effect (lift on hover)
 */

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({
  children,
  className = "",
  hover = true,
}: CardProps) {
  const hoverEffect = hover ? "hover:shadow-xl hover:-translate-y-1" : "";

  return (
    <div
      className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ${hoverEffect} ${className}`}
    >
      {children}
    </div>
  );
}

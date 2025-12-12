import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SessionProvider from "@/components/SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TravelHub - Discover Amazing Tours",
    template: "%s | TravelHub",
  },
  description:
    "Book unforgettable tours and adventures around the world. Find the perfect travel experience for your next vacation with expert guides and best prices.",
  keywords: [
    "tours",
    "travel",
    "vacation",
    "adventure",
    "booking",
    "tourism",
    "guided tours",
    "travel agency",
  ],
  authors: [{ name: "TravelHub" }],
  creator: "TravelHub",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://travelhub.com",
    title: "TravelHub - Discover Amazing Tours",
    description:
      "Book unforgettable tours and adventures around the world with expert guides.",
    siteName: "TravelHub",
  },
  twitter: {
    card: "summary_large_image",
    title: "TravelHub - Discover Amazing Tours",
    description:
      "Book unforgettable tours and adventures around the world with expert guides.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <Header />
          {children}
          <Footer />
        </SessionProvider>
        {/* Tawk.to Live Chat Widget */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
              (function(){
              var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
              s1.async=true;
              s1.src='https://embed.tawk.to/693bdf4363fe071984ec793c/1jc8u08sc';
              s1.charset='UTF-8';
              s1.setAttribute('crossorigin','*');
              s0.parentNode.insertBefore(s1,s0);
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}

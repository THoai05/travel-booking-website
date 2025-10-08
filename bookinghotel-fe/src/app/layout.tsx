import type { Metadata } from "next";
import "./globals.css";
import Header from "./client/components/Header";
import Footer from "./client/components/Footer";

export const metadata: Metadata = {
  title: "Travel Booking Website",
  description: "Find and book your perfect stay",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Font Awesome CDN */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
          integrity="sha512-K5mCjV6FvZ3QkA0Jbkh9qkL4H6S6YbA2JbW8sT4xKmsN9fHkFbYyS6gW+q0fKQ+Dz0s1aBKU8Dq8e3kK5p0A=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>

      <body>
        <Header />
        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

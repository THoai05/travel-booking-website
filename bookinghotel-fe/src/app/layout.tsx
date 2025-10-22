import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

export const metadata: Metadata = {
  title: "Bluvera",
  description: "Find and book your perfect stay",
};

const inter = Inter({
  subsets: ["latin-ext"],   // quan trọng cho Vietnamese
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter"
});

const poppins = Poppins({
  subsets: ["latin-ext"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins"
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning
     className={`${inter.variable} ${poppins.variable}`}>
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
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}

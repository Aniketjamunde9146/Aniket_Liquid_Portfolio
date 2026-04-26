import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aniket Jamunde — Full-Stack & Mobile Developer",
  description:
    "Self-taught full-stack & mobile developer from Chh. Sambhajinagar, Maharashtra. Building clean, high-performance web apps and mobile products with React, Flutter & Firebase.",
  keywords: [
    "Aniket Jamunde",
    "web developer",
    "mobile developer",
    "React",
    "Flutter",
    "Firebase",
    "portfolio",
    "Maharashtra",
    "India",
    "freelance developer",
  ],
  authors: [{ name: "Aniket Jamunde", url: "https://aniketwebdev.in" }],
  openGraph: {
    title: "Aniket Jamunde — Full-Stack & Mobile Developer",
    description:
      "Self-taught developer building clean, high-performance web & mobile products.",
    url: "https://aniketwebdev.in",
    siteName: "Aniket Jamunde Portfolio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aniket Jamunde — Full-Stack & Mobile Developer",
    description:
      "Self-taught developer building clean web & mobile products with React, Flutter & Firebase.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect for fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Favicon placeholder */}
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#fdf6ee" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
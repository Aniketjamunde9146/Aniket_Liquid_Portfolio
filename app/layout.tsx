import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://aniketwebdev.in"),
  title: {
    default: "Aniket Jamunde — Flutter & Web Developer",
    template: "%s | Aniket Jamunde",
  },
  description:
    "Aniket Jamunde is a self-taught Flutter & web developer from Chh. Sambhajinagar, Maharashtra — crafting high-performance cross-platform mobile apps with Flutter & Dart, and blazing-fast modern websites with React & Next.js. Firebase for real-time backends. Available for freelance projects across India and worldwide.",
  keywords: [
    // 🎯 Flutter
    "Flutter developer",
    "Flutter developer India",
    "Flutter developer Maharashtra",
    "Flutter developer Aurangabad",
    "Flutter developer Sambhajinagar",
    "Dart developer",
    "cross-platform app developer",
    "mobile app developer India",
    "Flutter Firebase developer",
    "Flutter freelancer India",
    // 🌐 Web
    "web developer India",
    "React developer India",
    "Next.js developer India",
    "frontend developer Maharashtra",
    "web developer Aurangabad",
    "web developer Sambhajinagar",
    "modern website developer",
    // 🔧 Full-stack / backend
    "full-stack developer India",
    "Node.js developer",
    "Firebase developer",
    "MongoDB developer",
    // 💼 Freelance intent keywords
    "freelance Flutter developer India",
    "freelance web developer India",
    "hire Flutter developer India",
    "hire web developer India",
    // 🪪 Personal brand
    "Aniket Jamunde",
    "Aniket Jamunde developer",
    "aniketwebdev.in",
  ],
  authors: [{ name: "Aniket Jamunde", url: "https://aniketwebdev.in" }],
  creator: "Aniket Jamunde",
  alternates: {
    canonical: "https://aniketwebdev.in",
  },
  openGraph: {
    title: "Aniket Jamunde — Flutter & Web Developer",
    description:
      "Flutter & web developer from Maharashtra, India. Building high-performance cross-platform mobile apps with Flutter and modern websites with React & Next.js. Available for freelance worldwide.",
    url: "https://aniketwebdev.in",
    siteName: "Aniket Jamunde — Flutter & Web Developer Portfolio",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Aniket Jamunde — Flutter & Web Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aniket Jamunde — Flutter & Web Developer",
    description:
      "Building beautiful Flutter apps & fast modern websites with React, Next.js & Firebase. Based in Maharashtra, India. Open for freelance.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
  category: "technology",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#fdf6ee" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* JSON-LD — Rich result in Google search */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Aniket Jamunde",
              url: "https://aniketwebdev.in",
              jobTitle: "Flutter & Web Developer",
              description:
                "Self-taught Flutter & web developer from Chh. Sambhajinagar, Maharashtra. Building cross-platform mobile apps with Flutter & Dart, and modern websites with React & Next.js. Firebase for real-time backends. Available for freelance projects across India and worldwide.",
              image: "https://aniketwebdev.in/og-image.png",
              email: "mailto:aniketjamunde4@gmail.com", // 👈 replace with your email
              knowsAbout: [
                "Flutter",
                "Dart",
                "Firebase",
                "React",
                "Next.js",
                "Node.js",
                "MongoDB",
                "Mobile App Development",
                "Web Development",
                "Full-Stack Development",
                "Cross-Platform Development",
              ],
              address: {
                "@type": "PostalAddress",
                addressLocality: "Chh. Sambhajinagar",
                addressRegion: "Maharashtra",
                addressCountry: "IN",
              },
              sameAs: [
                "https://github.com/AniketJamunde9146",   // 👈 replace
                "https://linkedin.com/in/aniket-jamunde-6751163ab", // 👈 replace
              ],
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
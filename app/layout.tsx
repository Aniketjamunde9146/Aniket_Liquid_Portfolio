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
  publisher: "Aniket Jamunde",
  alternates: {
    canonical: "https://aniketwebdev.in",
  },
  // ✅ Verification for search consoles
  verification: {
    google: "cLgEGPMfIUTUY17cOxXqzvocp0P17e54FeAJJtg6pUA", // ✅ Google Search Console verified
    other: {
      "msvalidate.01": "E432B33EFCDFAF984EB491BB59394773", // ✅ Bing/Microsoft verification
    },
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
    creator: "@YourTwitterHandle", // 👈 Replace with your Twitter/X handle
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
  category: "technology",
  // ✅ App-related meta for PWA/mobile
  applicationName: "Aniket Jamunde Portfolio",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* ✅ Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* ✅ Favicons & PWA */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* ✅ Theme */}
        <meta name="theme-color" content="#fdf6ee" />
        <meta name="color-scheme" content="light" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* ✅ Geo targeting — helps local SEO in India */}
        <meta name="geo.region" content="IN-MH" />
        <meta name="geo.placename" content="Chh. Sambhajinagar, Maharashtra, India" />
        <meta name="geo.position" content="19.8762;75.3433" />
        <meta name="ICBM" content="19.8762, 75.3433" />

        {/* ✅ Language & Content */}
        <meta httpEquiv="content-language" content="en-IN" />
        <meta name="language" content="English" />
        <meta name="rating" content="general" />
        <meta name="revisit-after" content="7 days" />

        {/* ✅ JSON-LD Structured Data — Person Schema */}
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
              email: "mailto:aniketjamunde4@gmail.com",
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
                "https://github.com/AniketJamunde9146",
                "https://linkedin.com/in/aniket-jamunde-6751163ab",
              ],
            }),
          }}
        />

        {/* ✅ JSON-LD Structured Data — WebSite Schema (enables Sitelinks Search Box) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Aniket Jamunde — Flutter & Web Developer",
              url: "https://aniketwebdev.in",
              description:
                "Portfolio of Aniket Jamunde, a Flutter & web developer from Maharashtra, India.",
              author: {
                "@type": "Person",
                name: "Aniket Jamunde",
              },
              inLanguage: "en-IN",
            }),
          }}
        />

        {/* ✅ JSON-LD Structured Data — BreadcrumbList for homepage */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://aniketwebdev.in",
                },
              ],
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
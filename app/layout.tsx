import type { Metadata } from "next";
import "./globals.css";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ChatWidget from "./components/ChatWidget";

export const metadata: Metadata = {
  metadataBase: new URL("https://aniketwebdev.in"),
  title: {
    default: "Aniket Jamunde — Flutter & Web Developer in Maharashtra, India",
    template: "%s | Aniket Jamunde",
  },
  description:
    "Aniket Jamunde is a self-taught Flutter & web developer from Chhatrapati Sambhajinagar (Aurangabad), Maharashtra — crafting high-performance cross-platform mobile apps with Flutter & Dart, and blazing-fast modern websites with React & Next.js. Firebase for real-time backends. Available for freelance projects across India and worldwide.",
  keywords: [
    "Flutter developer",
    "Flutter developer India",
    "Flutter developer Maharashtra",
    "Flutter developer Aurangabad",
    "Flutter developer Chhatrapati Sambhajinagar",
    "Dart developer",
    "cross-platform app developer",
    "mobile app developer India",
    "Flutter Firebase developer",
    "Flutter freelancer India",
    "web developer India",
    "React developer India",
    "Next.js developer India",
    "frontend developer Maharashtra",
    "web developer Aurangabad",
    "web developer Chhatrapati Sambhajinagar",
    "modern website developer",
    "full-stack developer India",
    "Node.js developer",
    "Firebase developer",
    "MongoDB developer",
    "freelance Flutter developer India",
    "freelance web developer India",
    "hire Flutter developer India",
    "hire web developer India",
    "hire mobile app developer India",
    "portfolio website developer India",
    "Aniket Jamunde",
    "Aniket Jamunde developer",
    "aniketwebdev.in",
  ],
  authors: [{ name: "Aniket Jamunde", url: "https://aniketwebdev.in" }],
  creator: "Aniket Jamunde",
  publisher: "Aniket Jamunde",
  alternates: {
    canonical: "https://aniketwebdev.in",
    languages: {
      "en-IN": "https://aniketwebdev.in",
    },
  },
  verification: {
    google: "cLgEGPMfIUTUY17cOxXqzvocp0P17e54FeAJJtg6pUA",
    other: {
      "msvalidate.01": "E432B33EFCDFAF984EB491BB59394773",
    },
  },
  openGraph: {
    title: "Aniket Jamunde — Flutter & Web Developer in Maharashtra, India",
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
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aniket Jamunde — Flutter & Web Developer",
    description:
      "Building beautiful Flutter apps & fast modern websites with React, Next.js & Firebase. Based in Maharashtra, India. Open for freelance.",
    images: ["/og-image.png"],
    creator: "@Aniketjamund002",
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
  applicationName: "Aniket Jamunde Portfolio",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  other: {
    "msapplication-TileColor": "#fdf6ee",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Aniket Jamunde",
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
        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Favicons & PWA */}
        <link rel="icon" href="/icon.png" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Sitemap discovery hint (optional — robots.txt already points to it) */}
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />

        {/* Theme */}
        <meta name="theme-color" content="#fdf6ee" />
        <meta name="color-scheme" content="light" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Geo targeting */}
        <meta name="geo.region" content="IN-MH" />
        <meta
          name="geo.placename"
          content="Chhatrapati Sambhajinagar, Maharashtra, India"
        />
        <meta name="geo.position" content="19.8762;75.3433" />
        <meta name="ICBM" content="19.8762, 75.3433" />

        {/* Language & content */}
        <meta httpEquiv="content-language" content="en-IN" />
        <meta name="language" content="English" />
        <meta name="rating" content="general" />
        <meta name="revisit-after" content="7 days" />
        <meta name="distribution" content="global" />

        {/* JSON-LD — Person */}
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
                "Self-taught Flutter & web developer from Chhatrapati Sambhajinagar, Maharashtra. Building cross-platform mobile apps with Flutter & Dart, and modern websites with React & Next.js. Firebase for real-time backends. Available for freelance projects across India and worldwide.",
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
                addressLocality: "Chhatrapati Sambhajinagar",
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

        {/* JSON-LD — WebSite */}
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

        {/* JSON-LD — ProfessionalService (local/commercial intent) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              name: "Aniket Jamunde — Flutter & Web Development Services",
              image: "https://aniketwebdev.in/og-image.png",
              url: "https://aniketwebdev.in",
              email: "aniketjamunde4@gmail.com",
              description:
                "Freelance Flutter and web development services — cross-platform mobile apps and modern websites built with Flutter, React, Next.js, and Firebase.",
              areaServed: ["IN"],
              address: {
                "@type": "PostalAddress",
                addressLocality: "Chhatrapati Sambhajinagar",
                addressRegion: "Maharashtra",
                addressCountry: "IN",
              },
              priceRange: "$$",
              makesOffer: [
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Flutter App Development",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Web Development (React/Next.js)",
                  },
                },
              ],
            }),
          }}
        />

        {/* JSON-LD — BreadcrumbList */}
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
      <body>
        
        {children}
       
      </body>
    </html>
  );
}

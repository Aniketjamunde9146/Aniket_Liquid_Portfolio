import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ChatWidget from "./components/ChatWidget";
import { ThemeProvider } from "./theme/ThemeComponents";

export const metadata: Metadata = {
  metadataBase: new URL("https://aniketwebdev.in"),
  title: {
    default: "Aniket Jamunde — Flutter & Web Developer in Maharashtra, India",
    template: "%s | Aniket Jamunde",
  },
  description:
    "Aniket Jamunde is a Flutter and web developer in Maharashtra building fast mobile apps and modern websites with Flutter, React, Next.js, and Firebase.",
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
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.toggle('dark', window.matchMedia('(prefers-color-scheme: dark)').matches);`,
          }}
        />
        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          crossOrigin="anonymous"
        />

        {/* Favicons & PWA */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.jpg" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/icon.jpg" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Sitemap discovery hint (optional — robots.txt already points to it) */}
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />

        {/* Theme */}
        <meta name="theme-color" content="#fdf6ee" />
        <meta name="color-scheme" content="light dark" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

         {/* Bing Seo  */}
        <meta name="msvalidate.01" content="E432B33EFCDFAF984EB491BB59394773" />

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-Y0219C2L68"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-Y0219C2L68');
          `}
        </Script>

        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-NL8LLZ6C');`}
        </Script>

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
              email: "mailto:hello@aniketwebdev.in",
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
              email: "hello@aniketwebdev.in",
              description:
                "Freelance Flutter and web development services — cross-platform mobile apps and modern websites built with Flutter, React, Next.js, and Firebase.",
              areaServed: ["IN"],
              address: {
                "@type": "PostalAddress",
                addressLocality: "Chhatrapati Sambhajinagar",
                addressRegion: "Maharashtra",
                addressCountry: "IN",
              },
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
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NL8LLZ6C"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

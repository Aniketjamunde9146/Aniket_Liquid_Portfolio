import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://aniketwebdev.in"),
  title: {
    default: "Aniket Jamunde | Web & Flutter Developer",
    template: "%s | Aniket Jamunde",
  },
  description:
    "Aniket Jamunde is a Web Developer and Flutter Developer building fast, beautiful, and user-friendly digital products for businesses and startups.",
  keywords: [
    "Aniket Jamunde",
    "Web Developer",
    "Flutter Developer",
    "Next.js Developer",
    "Freelance Web Developer India",
    "Mobile App Developer",
  ],
  authors: [{ name: "Aniket Jamunde", url: "https://aniketwebdev.in" }],
  creator: "Aniket Jamunde",
  publisher: "Aniket Jamunde",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "https://aniketwebdev.in",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://aniketwebdev.in",
    siteName: "Aniket Jamunde",
    title: "Aniket Jamunde | Web & Flutter Developer",
    description:
      "Fast, beautiful, and user-friendly digital products — web and mobile — built by Aniket Jamunde.",
    images: [
      {
        url: "/og-image.jpg", // 1200x630, put this in /public
        width: 1200,
        height: 630,
        alt: "Aniket Jamunde — Web & Flutter Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aniket Jamunde | Web & Flutter Developer",
    description:
      "Fast, beautiful, and user-friendly digital products — web and mobile — built by Aniket Jamunde.",
    images: ["/og-image.jpg"],
    creator: "@Aniketjamund002",
  },
  icons: {
    icon: "/icon.ico",
    shortcut: "/icon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",

};
import "./global.css";
import type { Metadata } from "next";
import { Cormorant_Garamond, Exo, Inter, Space_Mono } from "next/font/google";
import { AnimatedBackdrop } from "./components/animated-backdrop";
import { ParticleField } from "./components/particle-field";
import { SiteHeader } from "./components/site-header";
import { SiteFooter } from "./components/site-footer";
import { SubscribeModal } from "./components/subscribe-modal";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { siteConfig } from "@/lib/site-config";

const exo = Exo({
  subsets: ["latin"],
  variable: "--font-exo",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "AI/ML Developer",
    "Python",
    "React",
    "React Native",
    "Financial Services",
    "Fintech",
    "Automation",
    "Quantitative Trading",
    "Full Stack Developer",
  ],
  authors: [
    {
      name: siteConfig.author.name,
      url: siteConfig.author.url,
    },
  ],
  creator: siteConfig.author.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} – Portfolio`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    creator: "@turner_obt",
    images: ["/og.png"],
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
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
};

const cx = (...classes: (string | undefined | false)[]) =>
  classes.filter(Boolean).join(" ");

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cx(exo.variable, inter.variable, spaceMono.variable, cormorantGaramond.variable)}
    >
      <body className="antialiased">
        <AnimatedBackdrop />
        <ParticleField />
        <SiteHeader />
        <main className="relative min-h-screen pt-32 pb-16">
          <div className="max-w-4xl mx-auto px-6">{children}</div>
        </main>
        <SiteFooter />
        <SubscribeModal />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

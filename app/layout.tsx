import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import PassportBackupControls from "./PassportBackupControls";
import MedicalProfessionalTools from "./MedicalProfessionalTools";
import EmergencyTools from "./EmergencyTools";
import FeedbackTools from "./FeedbackTools";
import AnalyticsTracker from "./AnalyticsTracker";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sensory Passport",
  description: "Create, save, and share a personal sensory guide for appointments, school, haircuts, work, and everyday life.",
  applicationName: "Sensory Passport",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Sensory Passport" },
  icons: {
    icon: [{ url: "/app-icon.svg", type: "image/svg+xml" }, { url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  other: { "mobile-web-app-capable": "yes", "apple-mobile-web-app-capable": "yes", "apple-mobile-web-app-title": "Sensory Passport" },
};

export const viewport: Viewport = { themeColor: "#177f78" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
    <AnalyticsTracker />
    {children}
    <MedicalProfessionalTools />
    <EmergencyTools />
    <FeedbackTools />
    <PassportBackupControls />
  </body></html>;
}

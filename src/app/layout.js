import { Inter } from "next/font/google";
import "./globals.css";
import data from "@/data/data";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: `${data.personal.name} — Portfolio`,
  description: `${data.personal.name} | ${data.personal.title}. ${data.personal.tagline}. AI, Robotics, Data Science, and Product Management.`,
  keywords: [
    "Debendra Prasad Sahoo",
    "IIT Mandi",
    "MBA Data Science",
    "AI",
    "Robotics",
    "ROS2",
    "Product Management",
    "Portfolio",
  ],
  openGraph: {
    title: `${data.personal.name} — Portfolio`,
    description: data.personal.tagline,
    url: `https://${data.personal.domain}`,
    siteName: data.personal.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${data.personal.name} — Portfolio`,
    description: data.personal.tagline,
  },
  metadataBase: new URL(`https://${data.personal.domain}`),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}

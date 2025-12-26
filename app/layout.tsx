import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ApniSec - Your Trusted Cybersecurity Partner",
  description: "Comprehensive cybersecurity solutions including Cloud Security, Redteam Assessments, and VAPT services to protect your digital assets.",
  keywords: ["cybersecurity", "cloud security", "penetration testing", "VAPT", "redteam", "security assessment"],
  authors: [{ name: "ApniSec" }],
  openGraph: {
    title: "ApniSec - Your Trusted Cybersecurity Partner",
    description: "Comprehensive cybersecurity solutions to protect your digital assets",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

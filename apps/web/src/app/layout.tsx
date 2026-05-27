import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "VedaAI — AI Assessment Creator",
    template: "%s | VedaAI",
  },
  description:
    "Create AI-powered assignments and question papers for your classroom with VedaAI.",
  openGraph: {
    title: "VedaAI — AI Assessment Creator",
    description: "Create assignments and generate structured question papers with AI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bricolage.variable} ${inter.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}

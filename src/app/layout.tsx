import type { Metadata } from "next";
import { Inter } from "next/font/google";
// @ts-ignore - no type declarations for side-effect import of './globals.css'
import "./globals.css";
import Navbar from "@/components/navigation/navbar";
import Footer from "@/components/layout/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tanzeem-e-Khawajgan",
  description: "Organization Website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-foreground`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}

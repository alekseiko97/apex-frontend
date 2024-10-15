import type { Metadata } from "next";
import localFont from "next/font/local";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "FMCG management",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Layout with Sidebar and Header */}
        <div className="flex h-screen">
          <Sidebar /> {/* Sidebar on the left */}
          <div className="flex-grow">
            <Header /> {/* Header at the top */}
            <main className="p-0">{children}</main> {/* Main content area */}
          </div>
        </div>
      </body>
    </html>
  );
}

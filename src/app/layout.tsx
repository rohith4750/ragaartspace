import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";
import CartDrawer from "@/components/gallery/CartDrawer";
import AuthProvider from "@/components/providers/AuthProvider";
import QueryProvider from "@/components/providers/QueryProvider";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Raaga Artspace | Mindful & Spiritual Art Gallery",
  description: "Explore spiritual artworks, handmade canvas paintings, and Zen decor. Place orders online and experience mindful design for your home.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <AuthProvider>
          <QueryProvider>
            <Navbar />
            <main className="flex-grow flex flex-col">
              {children}
            </main>
            <Footer />
            <CartDrawer />
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

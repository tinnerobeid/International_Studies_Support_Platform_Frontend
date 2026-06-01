import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/providers";
import Navbar from "@/components/layout/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Search — Jobs in Tanzania",
  description: "Find jobs across all regions of Tanzania. Kazi nzuri Tanzania nzima.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-full flex flex-col bg-gray-50`}>
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="bg-white border-t border-gray-200 py-6 text-center text-sm text-gray-400">
            © {new Date().getFullYear()} Search · Tanzania Jobs Platform
          </footer>
        </Providers>
      </body>
    </html>
  );
}

/**
 * Tavlo Restaurant ERP - Root Layout
 * 
 * Main application layout with global styles and font configuration.
 * 
 * @backend Add authentication provider here when implementing auth
 */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tavlo - Restaurant ERP & Digital Ordering Platform",
  description: "AI-powered restaurant management system for Indian dine-in and takeaway restaurants. Manage menus, orders, staff, and analytics.",
  keywords: ["restaurant", "ERP", "digital menu", "order management", "Indian restaurant", "POS"],
};

/**
 * RootLayout - wraps the entire application
 * @backend Add providers here:
 * - AuthProvider for authentication
 * - QueryClientProvider for React Query
 * - ThemeProvider for dark mode support
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        {children}
      </body>
    </html>
  );
}

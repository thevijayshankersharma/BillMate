import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap', // Added font display swap for performance
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap', // Added font display swap for performance
});

export const metadata = {
  title: "BillMate - Create Invoices Easily", // More descriptive title
  description: "Generate professional invoices quickly and efficiently with BillMate.", // More helpful description
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-geist`} // Added font-geist class for easier font application
      >
        {children}
      </body>
    </html>
  );
}
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tabby Eats | Home Taste, Delivered With Love",
  description:
    "Discover authentic Kenyan home-cooked meals, private chef experiences and ready-to-cook meal kits by Chef Tabby in Nairobi, Kenya.",
  applicationName: "Tabby Eats",
  keywords: [
    "Tabby Eats",
    "Kenyan food",
    "Home cooked meals",
    "Nairobi food delivery",
    "Private chef Nairobi",
    "Kenyan meal kits",
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#42291f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

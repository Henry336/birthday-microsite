import type { Metadata } from "next";
import { Playfair_Display, Noto_Serif_Myanmar } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const notoSerifMyanmar = Noto_Serif_Myanmar({
  variable: "--font-myanmar-serif",
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "For Thel Thel",
  description: "A birthday surprise made with love.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${notoSerifMyanmar.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-rose-50">{children}</body>
    </html>
  );
}
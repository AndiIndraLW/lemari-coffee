import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lemari Coffee — Single-Origin Indonesian Coffee, Tokyo",
  description:
    "Single-origin Indonesian coffee, roasted in small batches in Jingumae, Shibuya, Tokyo. A cupboard full of islands.",
  icons: {
    icon: "/assets/logo.png",
    shortcut: "/assets/logo.png",
    apple: "/assets/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-[#F6EDDC] text-[#241A12] antialiased selection:bg-[#CE522A] selection:text-[#FCF7ED] font-sans">
        {children}
      </body>
    </html>
  );
}

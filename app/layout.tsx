import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "Grid Generator — CSS Grid Layout Tool",
  description:
    "Create CSS Grid layouts with visual controls. Export to Vanilla CSS, Bootstrap, or TailwindCSS with support for shadcn/ui, Material UI, Chakra UI, and Ant Design.",
  keywords: [
    "CSS Grid",
    "Grid Generator",
    "CSS Layout",
    "TailwindCSS",
    "Bootstrap",
    "shadcn/ui",
    "Material UI",
    "Web Development",
  ],
  authors: [{ name: "Grid Generator" }],
  openGraph: {
    title: "Grid Generator — CSS Grid Layout Tool",
    description:
      "Create CSS Grid layouts with visual controls. Export to multiple frameworks.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

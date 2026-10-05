import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Nav, Footer } from "@/components/site/sections";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Facet — precision interface primitives",
  description:
    "A living library of motion-grade UI primitives: ambient backgrounds, tactile buttons, kinetic type, isometric stages and more. Light and dark, Vercel-grade product surfaces.",
  keywords: [
    "Facet",
    "ui components",
    "react",
    "next.js",
    "motion",
    "tailwind",
    "design engineering",
    "dark ui",
    "light ui",
  ],
  authors: [{ name: "Facet" }],
  openGraph: {
    title: "Facet — precision interface primitives",
    description:
      "A living library of motion-grade UI primitives, engineered for product surfaces in light and dark.",
    siteName: "Facet",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Facet — precision interface primitives",
    description:
      "A living library of motion-grade UI primitives, engineered for product surfaces in light and dark.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#050507" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-svh flex-col bg-background">
            <Nav />
            {children}
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

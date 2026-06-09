import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "next-themes";
import Header from "../components/header";
import { StoreProvider } from "@/lib/store/store-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Chess Analysis",
    template: "%s | Chess Analysis",
  },
  description:
    "Analyze chess games with Stockfish 18. Load games from Lichess or Chess.com and get deep engine analysis, move classifications, and evaluation graphs.",
  keywords: [
    "chess analysis",
    "stockfish",
    "chess engine",
    "lichess",
    "chess.com",
    "game review",
    "chess evaluation",
  ],
  authors: [{ name: "Ahmad" }],
  creator: "Ahmad",
  openGraph: {
    type: "website",
    title: "Chess Analysis",
    description:
      "Analyze chess games with Stockfish 18. Load games from Lichess or Chess.com and get deep engine analysis with move classifications.",
    siteName: "Chess Analysis",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark">
          <StoreProvider>
            <Header />
            {children}
            <Toaster richColors position="top-center" />
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

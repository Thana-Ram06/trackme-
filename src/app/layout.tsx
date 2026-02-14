import type { Metadata } from "next";
import { Instrument_Serif, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-instrument",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const themeScript = `
  (function() {
    var storageKey = 'trackme-theme';
    try {
      var stored = window.localStorage.getItem(storageKey);
      var theme = stored === 'light' || stored === 'dark' ? stored : 'dark';
      document.documentElement.dataset.theme = theme;
      document.documentElement.style.colorScheme = theme;
    } catch (e) {
      document.documentElement.dataset.theme = 'dark';
      document.documentElement.style.colorScheme = 'dark';
    }
  })();
`;

export const metadata: Metadata = {
  title: "Track.me – Track subscriptions. Know what's coming.",
  description: "Minimal subscription tracking for people who hate surprises.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${instrument.variable} ${inter.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: themeScript,
          }}
        />
      </head>
      <body>
        <Providers>
          <Navbar />
          <main className="app-shell">{children}</main>
        </Providers>
      </body>
    </html>
  );
}

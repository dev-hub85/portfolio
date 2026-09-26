import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif, Unbounded } from "next/font/google";
import "./globals.css";

const sans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const mono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const display = Unbounded({
  variable: "--font-display",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

const serif = Instrument_Serif({
  variable: "--font-serif",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Abdul Rehman | Full-Stack Software Engineer",
  description:
    "Portfolio of Abdul Rehman, a full-stack software engineer building scalable web applications, automation workflows and AI-powered tools.",
};

export const viewport: Viewport = {
  themeColor: "#03030a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${mono.variable} ${display.variable} ${serif.variable}`}
      suppressHydrationWarning
    >
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
        {children}
      </body>
    </html>
  );
}

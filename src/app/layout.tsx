import type { Metadata, Viewport } from "next";
import { Inter, Space_Mono, Anton } from "next/font/google";
import "./globals.css";
import { InstallPrompt } from "@/components/fx/InstallPrompt";
import { MusicPlayer } from "@/components/fx/MusicPlayer";
import { WhatsAppFloat } from "@/components/fx/WhatsAppFloat";

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});
const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://babuinos-inc.vercel.app"),
  title: "Babuinos Inc — Streetwear Cult",
  description:
    "Streetwear oversize para los que no siguen la manada. Selva de cemento, actitud de explorador. Colección Fundadores 2026 desde Bogotá.",
  applicationName: "Babuinos",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Babuinos",
  },
  keywords: ["streetwear", "oversize", "Babuinos", "Bogotá", "ropa urbana", "Colombia"],
  openGraph: {
    title: "Babuinos Inc — Streetwear Cult",
    description: "Ropa oversize con identidad. Bienvenido al Cult. 🦍",
    type: "website",
    locale: "es_CO",
    siteName: "Babuinos Inc",
    url: "/",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Babuinos Inc — Streetwear Cult" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Babuinos Inc — Streetwear Cult",
    description: "Ropa oversize con identidad. Bienvenido al Cult.",
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#1e2021",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${spaceMono.variable} ${anton.variable}`}
    >
      <body className="fx-grain">
        {children}
        <MusicPlayer />
        <WhatsAppFloat />
        <InstallPrompt />
      </body>
    </html>
  );
}

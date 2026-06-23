import type { Metadata, Viewport } from "next";
import { Inter, Space_Mono, Anton } from "next/font/google";
import "./globals.css";

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
  title: "Babuinos Inc — Streetwear Cult",
  description:
    "Streetwear oversize para los que no siguen la manada. Selva de cemento, actitud de explorador. Colección Fundadores 2026 desde Bogotá.",
  keywords: ["streetwear", "oversize", "Babuinos", "Bogotá", "ropa urbana", "Colombia"],
  openGraph: {
    title: "Babuinos Inc — Streetwear Cult",
    description: "Ropa oversize con identidad. Bienvenido al Cult. 🦍",
    type: "website",
    locale: "es_CO",
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
      <body className="fx-grain">{children}</body>
    </html>
  );
}

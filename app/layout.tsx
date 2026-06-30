import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const generalSans = localFont({
  src: [
    { path: "./fonts/GeneralSans-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/GeneralSans-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/GeneralSans-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/GeneralSans-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-general-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "E-Bus Control — Movilidad Inteligente La Serena",
  description:
    "Sistema de Monitoreo Inteligente de Baterías para Flotas de Buses Eléctricos — INACAP La Serena. El pulso de tu flota, en tiempo real.",
  applicationName: "E-Bus Control",
  authors: [{ name: "Equipo E-Bus Control — INACAP La Serena" }],
};

// Aplica el tema guardado antes del primer paint (evita parpadeo). Default: claro.
const themeScript = `(function(){try{if(localStorage.getItem('theme')==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${generalSans.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-bg font-sans text-text">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {children}
      </body>
    </html>
  );
}

import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { Metadata } from "next";
import { ThemeProvider } from "../components/theme-provider";
import Image from "next/image";
import Navbar from "../components/navbar";
import { PageTransitionProvider } from "@/hooks/PageTransitionProvider"; // ← ton provider global
import PageTransition from "@/components/animations/pageTransition"; // ← ton composant de transition de page

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--geist-sans",
  display: "swap",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LDX Photographie",
  description: "Portfolio de Damien Vigouroux",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="h-full" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <PageTransitionProvider>
            <PageTransition>
              <div className="flex min-h-screen max-h-screen bg-white text-black pt-8 pb-30 pl-5 pr-5 overflow-hidden relative">
                {/* Sidebar */}
                <aside className="w-1/5 max-h-full p-8 flex flex-col justify-between">
                  <Navbar />
                </aside>

                <main className="flex-1 p-8 w-4/5 justify-center content-center">
                  {children}
                </main>
              </div>

              <Image
                src="/drapeau.svg"
                alt=""
                width={2000}
                height={1000}
                className="absolute inset-x-0 bottom-0 z-10"
              />
            </PageTransition>
          </PageTransitionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

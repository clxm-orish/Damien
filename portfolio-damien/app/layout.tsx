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
              <div className="md:flex min-h-screen md:max-h-screen md:bg-white md:text-black pt-8 pb-30 pl-5 pr-5 md:overflow-hidden md:relative">
                {/* Sidebar */}
                  <aside className=" md:w-1/5 md:max-h-full md:p-8 md:flex  md:flex-col md:justify-between">
                    <Navbar />
                  </aside>



                <main className="md:flex-1 md:p-8 md:w-4/5 justify-center content-center">
                  {children}
                </main>
              </div>

              <Image
                src="/drapeau.svg"
                alt=""
                width={2000}
                height={1000}
                className="md:absolute md:inset-x-0 md:bottom-0 z-10"
              />
              <footer className="md:hidden">
                <Image
                  src="/drapeau.svg"
                  alt=""
                  width={2000}
                  height={1000}
                  className="md:absolute md:inset-x-0 md:bottom-0 z-10"
                />
              </footer>
            </PageTransition>
          </PageTransitionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

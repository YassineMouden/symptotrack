import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { TRPCReactProvider } from "~/trpc/react";
import StyledComponentsRegistry from "../lib/registry";
import { auth } from "~/server/auth";
import { Providers } from "./providers";
import NavBar from "./_components/NavBar";
import Footer from "./_components/Footer";

export const metadata: Metadata = {
  title: "SymptoTrack",
  description: "Medical symptom tracker and condition analyzer",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  return (
    <html lang="en" className={`${geist.variable}`}>
      <body className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <StyledComponentsRegistry>
          <TRPCReactProvider>
            <Providers session={session}>
              <div className="flex min-h-screen flex-col">
                <NavBar />
                
                <main className="container mx-auto flex-1 px-4 py-8">
                  {children}
                </main>
                
                <Footer />
              </div>
            </Providers>
          </TRPCReactProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}

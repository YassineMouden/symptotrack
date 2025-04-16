import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "SymptoTrack",
  description: "Medical symptom tracker and condition analyzer",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <TRPCReactProvider>
          <div className="flex min-h-screen flex-col">
            <header className="bg-white shadow-sm dark:bg-gray-800">
              <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center">
                  <svg
                    className="h-8 w-8 text-teal-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <h1 className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                    SymptoTrack
                  </h1>
                </div>
                <nav className="flex items-center space-x-4">
                  <Link 
                    href="/" 
                    className="text-sm font-medium text-gray-700 hover:text-teal-500 dark:text-gray-200 dark:hover:text-teal-400"
                  >
                    Home
                  </Link>
                  <Link 
                    href="/about" 
                    className="text-sm font-medium text-gray-700 hover:text-teal-500 dark:text-gray-200 dark:hover:text-teal-400"
                  >
                    About
                  </Link>
                </nav>
              </div>
            </header>
            
            <main className="container mx-auto flex-1 px-4 py-8">
              {children}
            </main>
            
            <footer className="bg-white py-6 text-center text-sm text-gray-500 shadow-inner dark:bg-gray-800 dark:text-gray-400">
              <div className="container mx-auto px-4">
                <p className="mb-2">
                  <strong>Medical Disclaimer:</strong> The information provided by SymptoTrack is not medical advice and should not replace consultation with healthcare professionals.
                </p>
                <p>
                  © {new Date().getFullYear()} SymptoTrack. All rights reserved.
                </p>
              </div>
            </footer>
          </div>
        </TRPCReactProvider>
      </body>
    </html>
  );
}

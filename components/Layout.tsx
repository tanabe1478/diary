import Head from "next/head";
import Link from "next/link";
import { type ReactNode } from "react";

const siteTitle = "My blog";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-blue-950 dark:to-slate-950 dark:text-gray-100">
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <header className="container mx-auto max-w-4xl px-4 sm:px-6 md:px-8 py-6 md:py-12">
        <nav>
          <p>
            <Link
              href="/"
              className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
            >
              {siteTitle}
            </Link>
          </p>
        </nav>
      </header>
      <main className="container mx-auto max-w-4xl px-4 sm:px-6 md:px-8 py-6 md:py-12">
        {children}
      </main>
      <footer className="container mx-auto max-w-4xl px-4 sm:px-6 md:px-8 py-6 md:py-12 text-sm">
        <nav className="flex justify-center">
          <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-lg rounded-full px-4 sm:px-6 py-2 sm:py-3 border border-white/20 dark:border-gray-700/30 shadow-lg">
            <Link
              href="/"
              className="text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
            >
              Home
            </Link>
          </div>
        </nav>
      </footer>
    </div>
  );
}

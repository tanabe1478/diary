import Head from "next/head";
import Link from "next/link";
import { type ReactNode } from "react";

const siteTitle = "My blog";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-950 dark:to-blue-950 dark:text-gray-100">
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <header className="container mx-auto max-w-3xl px-8 py-12">
        <nav>
          <p>
            <Link
              href="/"
              className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
            >
              {siteTitle}
            </Link>
          </p>
        </nav>
      </header>
      <main className="container mx-auto max-w-3xl px-8 py-12">
        {children}
      </main>
      <footer className="container mx-auto max-w-3xl px-8 py-12 text-sm">
        <nav className="flex justify-center">
          <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-lg rounded-full px-6 py-3 border border-white/20 dark:border-gray-700/30 shadow-lg">
            <Link
              href="/"
              className="text-gray-800 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium"
            >
              Home
            </Link>
          </div>
        </nav>
      </footer>
    </div>
  );
}

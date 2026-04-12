import Head from "next/head";
import Link from "next/link";
import { type ReactNode } from "react";

const siteTitle = "tanabe1478";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 dark:text-gray-100">
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <div className="max-w-2xl mx-auto px-6 py-12">
        <header className="mb-12">
          <nav>
            <Link
              href="/"
              className="link-plain text-2xl font-bold text-gray-900 dark:text-gray-100"
            >
              {siteTitle}
            </Link>
          </nav>
        </header>
        <main>{children}</main>
        <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 text-sm text-gray-500 dark:text-gray-400">
          <Link
            href="/"
            className="link-plain text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            Home
          </Link>
        </footer>
      </div>
    </div>
  );
}

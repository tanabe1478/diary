import type { NextPage } from "next";
import Head from "next/head";

const BLOG_URL = "https://tanabe1478.github.io/";

const Home: NextPage = () => {
  return (
    <section>
      <Head>
        <title>Redirecting to tanabe1478</title>
        <meta httpEquiv="refresh" content={`0; url=${BLOG_URL}`} />
        <link rel="canonical" href={BLOG_URL} />
      </Head>
      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6">
        Diary moved
      </h2>
      <p className="text-gray-600 dark:text-gray-300">
        Diary は blog に統合しました。{" "}
        <a href={BLOG_URL}>新しい blog</a> に移動します。
      </p>
    </section>
  );
};

export default Home;

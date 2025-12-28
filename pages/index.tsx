import type { NextPage } from "next";
import Link from "next/link";
import { listIssues } from "../lib/issue";
import Time from "../components/Time";

type Props = {
  issues: Array<Issue>;
};

type Issue = any;

const Home: NextPage<Props> = ({ issues }) => {
  return (
    <section>
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-4">
          Latest Articles
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Thoughts, stories and ideas
        </p>
      </div>
      <div className="grid gap-6">
        {issues.map((issue) => (
          <article
            key={issue.number}
            className="group relative bg-white/70 dark:bg-gray-900/70 backdrop-blur-md rounded-2xl p-8 border border-white/20 dark:border-gray-700/30 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:bg-white/80 dark:hover:bg-gray-900/80"
          >
            <Link
              href={`/articles/${issue.number}`}
              className="block"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <Time dateTime={issue.created_at} />
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800/30">
                    #{issue.number}
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 dark:group-hover:from-blue-400 dark:group-hover:to-purple-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                  {issue.title}
                </h2>
                {issue.body && (
                  <p className="text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                    {issue.body.slice(0, 150)}...
                  </p>
                )}
                <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 font-medium">
                  <span>Read more</span>
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Home;

export async function getStaticProps() {
  return {
    props: {
      issues: await listIssues(),
    },
  };
}

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
      <div className="mb-8 md:mb-12">
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent mb-3 md:mb-4">
          Latest Articles
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
          Thoughts, stories and ideas
        </p>
      </div>
      <div className="grid gap-4 md:gap-6">
        {issues.map((issue) => (
          <article
            key={issue.number}
            className="group relative bg-white/70 dark:bg-gray-900/70 backdrop-blur-md rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 border border-white/20 dark:border-gray-700/30 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.01] md:hover:scale-[1.02] hover:bg-white/80 dark:hover:bg-gray-900/80"
          >
            <Link
              href={`/articles/${issue.number}`}
              className="block"
            >
              <div className="flex flex-col gap-2 md:gap-3">
                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                  <Time dateTime={issue.created_at} />
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800/30">
                    #{issue.number}
                  </span>
                </div>
                <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:bg-gradient-to-r group-hover:from-blue-700 group-hover:to-blue-500 dark:group-hover:from-blue-400 dark:group-hover:to-cyan-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                  {issue.title}
                </h2>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-blue-600 dark:text-blue-400 font-medium mt-1">
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

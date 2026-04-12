import type { NextPage } from "next";
import Link from "next/link";
import { listIssues } from "../lib/issue";
import { format } from "date-fns";

type Props = {
  issues: Array<Issue>;
};

type Issue = any;

const Home: NextPage<Props> = ({ issues }) => {
  return (
    <section>
      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6">
        Articles
      </h2>
      <ul className="space-y-3">
        {issues.map((issue) => (
          <li key={issue.number} className="flex items-baseline gap-4">
            <time
              dateTime={issue.created_at}
              className="text-sm text-gray-400 dark:text-gray-500 shrink-0 tabular-nums italic"
            >
              {format(new Date(issue.created_at), "yyyy-MM-dd")}
            </time>
            <Link
              href={`/articles/${issue.number}`}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            >
              {issue.title}
            </Link>
          </li>
        ))}
      </ul>
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

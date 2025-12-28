import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import {
  getIssue,
  listIssues,
  listIssueComments,
  type Issue,
  type IssueComment,
} from "../../lib/issue";
import Time from "../../components/Time";

type Props = {
  issue: Issue;
  issueComments: Array<IssueComment>;
};

const ShowArticle: NextPage<Props> = ({ issue, issueComments }) => {
  return (
    <div className="space-y-8">
      <Head>
        <title>{issue.title}</title>
      </Head>
      <article className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-white/20 dark:border-gray-700/30 shadow-xl">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Time dateTime={issue.created_at} />
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800/30">
              #{issue.number}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-6">
            {issue.title}
          </h1>
          <aside className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-800/50 rounded-lg px-4 py-3 backdrop-blur-sm">
            <span>Posted by</span>
            <Link
              href={issue.user.html_url}
              className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
            >
              {issue.user.login}
            </Link>
            <span>·</span>
            <Link
              href={issue.html_url}
              className="text-purple-600 dark:text-purple-400 hover:underline"
            >
              View on GitHub
            </Link>
          </aside>
        </header>
        <div className="markdown prose prose-lg dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: issue.bodyHTML }}></div>
      </article>
      {issueComments.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 px-2">
            Comments ({issueComments.length})
          </h2>
          {issueComments.map((issueComment) => (
            <article
              key={issueComment.id}
              className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-md rounded-xl p-6 md:p-8 border border-white/20 dark:border-gray-700/30 shadow-lg"
            >
              <div className="markdown prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: issueComment.bodyHTML }} />
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShowArticle;

export async function getStaticPaths() {
  const issues = await listIssues();
  const paths = issues.map((issue: any) => {
    return {
      params: {
        issueNumber: issue.number.toString(),
      },
    };
  });
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: any) {
  const issueNumber = parseInt(params.issueNumber, 10);
  const issue = await getIssue({ issueNumber });
  const issueComments = await listIssueComments({ issueNumber });
  return {
    props: {
      issue,
      issueComments,
    },
  };
}

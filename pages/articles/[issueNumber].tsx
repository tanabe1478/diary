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
import { format } from "date-fns";

type Props = {
  issue: Issue;
  issueComments: Array<IssueComment>;
};

const ShowArticle: NextPage<Props> = ({ issue, issueComments }) => {
  return (
    <div>
      <Head>
        <title>{issue.title}</title>
      </Head>
      <article>
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            {issue.title}
          </h1>
          <div className="flex items-center gap-3 text-sm text-gray-400 dark:text-gray-500">
            <time dateTime={issue.created_at} className="italic">
              {format(new Date(issue.created_at), "yyyy-MM-dd")}
            </time>
            <span>·</span>
            <Link
              href={issue.html_url}
              className="text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              GitHub
            </Link>
          </div>
        </header>
        <div
          className="markdown"
          dangerouslySetInnerHTML={{ __html: issue.bodyHTML }}
        />
      </article>
      {issueComments.length > 0 && (
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6">
            Comments ({issueComments.length})
          </h2>
          <div className="space-y-6">
            {issueComments.map((issueComment) => (
              <article
                key={issueComment.id}
                className="pl-4 border-l-2 border-gray-200 dark:border-gray-800"
              >
                <div
                  className="markdown"
                  dangerouslySetInnerHTML={{ __html: issueComment.bodyHTML }}
                />
              </article>
            ))}
          </div>
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

import type { NextPage } from "next";
import Head from "next/head";
import { listIssues } from "../../lib/issue";

type Props = {
  issueNumber: string;
};

function blogArticleUrl(issueNumber: string): string {
  return `https://tanabe1478.github.io/posts/diary-${issueNumber}/`;
}

const ShowArticle: NextPage<Props> = ({ issueNumber }) => {
  const targetUrl = blogArticleUrl(issueNumber);

  return (
    <section>
      <Head>
        <title>{`Redirecting to diary-${issueNumber}`}</title>
        <meta httpEquiv="refresh" content={`0; url=${targetUrl}`} />
        <link rel="canonical" href={targetUrl} />
      </Head>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
        Article moved
      </h1>
      <p className="text-gray-600 dark:text-gray-300">
        この記事は blog に移動しました。{" "}
        <a href={targetUrl}>移行後の記事</a> に移動します。
      </p>
    </section>
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
  return {
    props: {
      issueNumber: params.issueNumber.toString(),
    },
  };
}

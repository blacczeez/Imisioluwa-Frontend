import type { NextPageContext } from 'next';

/**
 * Non-static custom error page so Next does not try (and fail) to statically
 * generate Pages Router /404 and /500 during App Router builds.
 * @see https://github.com/vercel/next.js/issues/58576
 */
function Error({ statusCode }: { statusCode?: number }) {
  return (
    <div style={{ padding: 40, textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: 48, marginBottom: 16 }}>{statusCode || 'Error'}</h1>
      <p style={{ color: '#666' }}>
        {statusCode === 404 ? 'Page not found.' : 'Something went wrong.'}
      </p>
    </div>
  );
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;

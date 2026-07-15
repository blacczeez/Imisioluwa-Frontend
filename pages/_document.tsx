import { Html, Head, Main, NextScript } from 'next/document';

/**
 * Minimal Pages Router document.
 * Next still prerenders legacy /404 and /500 during `next build` even for App Router apps;
 * without this file the build fails with: Cannot find module for page: /_document
 */
export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

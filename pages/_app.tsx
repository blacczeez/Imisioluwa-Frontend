import type { AppProps } from 'next/app';

/** Required companion for pages/_document when Next builds legacy error pages. */
export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

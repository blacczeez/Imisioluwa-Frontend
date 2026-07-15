import Link from 'next/link';

/** Server component — avoid client i18n during build prerender of /_not-found. */
export default function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="font-serif text-5xl text-brand-dark mb-4">404</h1>
      <p className="text-gray-500 mb-8">The page you are looking for does not exist.</p>
      <Link
        href="/"
        className="inline-block px-8 py-3 bg-brand hover:bg-brand-light text-white rounded-lg font-semibold text-sm uppercase tracking-label transition-colors"
      >
        Back to Shop
      </Link>
    </div>
  );
}

export interface BuyLocation {
  slug: string;
  name: string;
  /** Short label for shipping/payment copy */
  regionLabel: string;
}

/**
 * Diaspora + Nigeria hubs for programmatic “buy in [city]” pages.
 * Slugs are used in URLs — keep lowercase, hyphenated.
 */
export const BUY_LOCATIONS_TO_BUILD: BuyLocation[] = [
  { slug: 'london', name: 'London', regionLabel: 'the UK (GBP checkout & UK-focused courier routes)' },
  { slug: 'manchester', name: 'Manchester', regionLabel: 'the UK' },
  { slug: 'birmingham', name: 'Birmingham', regionLabel: 'the UK' },
  { slug: 'leeds', name: 'Leeds', regionLabel: 'the UK' },
  { slug: 'bristol', name: 'Bristol', regionLabel: 'the UK' },
  { slug: 'glasgow', name: 'Glasgow', regionLabel: 'the UK' },
  { slug: 'liverpool', name: 'Liverpool', regionLabel: 'the UK' },
  { slug: 'edinburgh', name: 'Edinburgh', regionLabel: 'the UK' },
  { slug: 'houston', name: 'Houston', regionLabel: 'the United States (USD & international shipping)' },
  { slug: 'new-york', name: 'New York', regionLabel: 'the United States' },
  { slug: 'atlanta', name: 'Atlanta', regionLabel: 'the United States' },
  { slug: 'chicago', name: 'Chicago', regionLabel: 'the United States' },
  { slug: 'dallas', name: 'Dallas', regionLabel: 'the United States' },
  { slug: 'washington-dc', name: 'Washington DC', regionLabel: 'the United States' },
  { slug: 'philadelphia', name: 'Philadelphia', regionLabel: 'the United States' },
  { slug: 'los-angeles', name: 'Los Angeles', regionLabel: 'the United States' },
  { slug: 'toronto', name: 'Toronto', regionLabel: 'Canada' },
  { slug: 'calgary', name: 'Calgary', regionLabel: 'Canada' },
  { slug: 'edmonton', name: 'Edmonton', regionLabel: 'Canada' },
  { slug: 'vancouver', name: 'Vancouver', regionLabel: 'Canada' },
  { slug: 'dubai', name: 'Dubai', regionLabel: 'the UAE' },
  { slug: 'abu-dhabi', name: 'Abu Dhabi', regionLabel: 'the UAE' },
  { slug: 'dublin', name: 'Dublin', regionLabel: 'Ireland / EU' },
  { slug: 'paris', name: 'Paris', regionLabel: 'France / EU' },
  { slug: 'lagos', name: 'Lagos', regionLabel: 'Nigeria (local delivery options)' },
];

export function getBuyLocationBySlug(slug: string): BuyLocation | undefined {
  return BUY_LOCATIONS_TO_BUILD.find((l) => l.slug === slug);
}

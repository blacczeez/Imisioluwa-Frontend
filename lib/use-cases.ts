export interface UseCaseDef {
  slug: string;
  headline: string;
  intro: string;
  steps: string[];
}

/** Short “use case” intents for /uses/[product]/[use-case] combos (built from live product slugs). */
export const PRODUCT_USE_CASES: UseCaseDef[] = [
  {
    slug: 'protection',
    headline: 'protection and spiritual covering',
    intro:
      'Many people use traditional soaps and oils as part of a personal routine focused on spiritual protection and peace of mind. Approach every practice with respect and clear intention.',
    steps: [
      'Choose one product and read usage guidance carefully.',
      'Set a simple intention before you begin.',
      'Use consistently for a season rather than switching products every few days.',
      'Keep notes so you can adjust calmly based on how you feel.',
    ],
  },
  {
    slug: 'favour-and-open-doors',
    headline: 'favour and open doors',
    intro:
      'If your focus is favour and opportunity, pair a steady routine with practical action in work and relationships. Spiritual products support discipline; they do not replace effort.',
    steps: [
      'Pick a time of day you can repeat without stress.',
      'Pair your routine with one clear weekly goal in the physical world.',
      'Stay patient: meaningful shifts often take time.',
      'Buy from sellers who explain sourcing and safe use clearly.',
    ],
  },
  {
    slug: 'cleansing-and-reset',
    headline: 'cleansing and energetic reset',
    intro:
      'Cleansing routines are common after stress, travel, or life transitions. Start gently, especially if you have sensitive skin.',
    steps: [
      'Test new products on a small area if advised.',
      'Keep the routine simple at first.',
      'Hydrate and rest; support the ritual with basic wellness habits.',
      'If you have medical concerns, speak with a qualified professional.',
    ],
  },
];

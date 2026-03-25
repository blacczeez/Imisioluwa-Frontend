import type { BlogPost } from './blog-types';

function p(...linesOrParagraphs: string[]) {
  return linesOrParagraphs;
}

export const BLOG_POSTS_MORE: BlogPost[] = [
  {
    slug: 'history-ifa-orisha-understanding-yoruba-spirituality',
    title: 'The History of Ifa and Orisha: Understanding Yoruba Spirituality',
    metaDescription:
      'A respectful introduction to Ifa and Orisha in Yoruba culture, why context matters, and how to learn without reducing living traditions.',
    excerpt: 'Context and respect for Ifa, Orisha, and community-led practice.',
    publishedAt: '2026-03-25',
    updatedAt: '2026-03-25',
    keywords: ['ifa', 'orisha', 'yoruba spirituality'],
    sections: [
      {
        heading: 'Living lineages',
        paragraphs: p(
          'Ifa and Orisha traditions are lived by communities with teachers, elders, and regional variation. Online summaries cannot replace in-person apprenticeship where that is expected.',
          'When you buy spiritual products, treat them as part of a broader ethical life rather than shortcuts.',
        ),
      },
      {
        heading: 'Respectful commerce',
        paragraphs: p(
          'Support sellers who explain sourcing, safety, and use clearly. Avoid exoticizing people or turning sacred names into shallow marketing.',
          'Imisioluwa focuses on transparent listings and multi-currency checkout for diaspora shoppers.',
        ),
      },
    ],
  },
  {
    slug: 'african-traditional-medicine-what-it-is-how-it-works',
    title: 'African Traditional Medicine: What It Is and How It Works',
    metaDescription:
      'Outline of African traditional medicine as diverse knowledge systems, plus how to approach herbal commerce safely.',
    excerpt: 'A buyer-level overview of traditional medicine diversity and safety framing.',
    publishedAt: '2026-03-25',
    updatedAt: '2026-03-25',
    keywords: ['african herbal remedies', 'traditional medicine'],
    sections: [
      {
        heading: 'Diversity of practice',
        paragraphs: p(
          'Traditional medicine across Africa includes plant knowledge, bone-setting, spiritual frameworks, and community healers. It is not one uniform “system”.',
          'Claims should be evaluated with ingredient transparency and professional healthcare when you are unwell.',
        ),
      },
      {
        heading: 'Shopping herbal products',
        paragraphs: p(
          'Look for ingredient lists, storage guidance, and realistic shipping timelines for liquids.',
          'Imisioluwa stocks herbal categories alongside spiritual and food products for Nigeria and export where allowed.',
        ),
      },
    ],
  },
  {
    slug: 'how-to-set-up-home-altar-ifa-orisha-practice',
    title: 'How to Set Up a Home Altar for Ifa/Orisha Practice',
    metaDescription:
      'Practical, respectful starter notes on altar space, cleanliness, and working with teachers — not initiation advice.',
    excerpt: 'Space, cleanliness, and why teacher guidance matters for altars.',
    publishedAt: '2026-03-25',
    updatedAt: '2026-03-25',
    keywords: ['home altar', 'orisha practice', 'ifa'],
    sections: [
      {
        heading: 'Start with guidance',
        paragraphs: p(
          'Altar expectations vary dramatically by lineage. What is appropriate in one house may not be in another.',
          'If you are new, prioritize finding trustworthy human teachers over accumulating objects.',
        ),
      },
      {
        heading: 'Physical basics many people share',
        paragraphs: p(
          'Choose a clean, dedicated surface; wash cloths regularly; keep candles and incense away from children and pets.',
          'Buy ritual items from sellers who explain intended use and respect cultural context.',
        ),
      },
    ],
    howTo: {
      name: 'Prepare a simple temporary devotional space',
      description:
        'General housekeeping steps before you receive specific altar instructions from a qualified teacher.',
      steps: [
        {
          name: 'Clear and clean a surface',
          text: 'Remove clutter, dust, and wipe with plain water or a mild cleaner you already use at home.',
        },
        {
          name: 'Gather safe basics',
          text: 'Have a small cloth, water glass, matches or lighter stored safely away from children, and ventilation for smoke.',
        },
        {
          name: 'Pause before buying icons',
          text: 'Wait for guidance on sacred images, beads, or statues so you do not mix incompatible lineages.',
        },
      ],
    },
  },
  {
    slug: 'five-authentic-nigerian-soups-abroad-ingredient-guide',
    title: '5 Authentic Nigerian Soups You Can Make Abroad (Ingredient Guide)',
    metaDescription:
      'Ingredient-focused notes for Egusi, Ogbono, Efo Riro, Banga, and Bitterleaf abroad — pantry and sourcing tips.',
    excerpt: 'Stock the right thickeners, leaves, and spices before you cook.',
    publishedAt: '2026-03-25',
    updatedAt: '2026-03-25',
    keywords: ['nigerian soup ingredients', 'nigerian food abroad'],
    sections: [
      {
        heading: 'Thickeners and oils',
        paragraphs: p(
          'Egusi and Ogbono behave differently by grind size and roast level. Buy from stores that rotate stock.',
          'Palm fruit concentrate and dry peppers freeze well portioned flat in bags.',
        ),
      },
      {
        heading: 'Leaves and umami',
        paragraphs: p(
          'Frozen spinach can substitute fresh efo in a pinch; reduce water during wilting. Iru adds irreplaceable depth—keep it airtight.',
          'Imisioluwa food category helps diaspora buyers bundle pantry staples.',
        ),
      },
    ],
  },
  {
    slug: 'african-incense-spiritual-cleansing-types-and-burning',
    title: 'African Incense for Spiritual Cleansing: Types, Uses, and How to Burn',
    metaDescription:
      'Ventilation, charcoal safety, and respectful use of incense in spiritual cleansing routines at home.',
    excerpt: 'Burn incense safely and keep routines simple.',
    publishedAt: '2026-03-25',
    updatedAt: '2026-03-25',
    keywords: ['african incense', 'spiritual cleansing'],
    sections: [
      {
        heading: 'Smoke safety',
        paragraphs: p(
          'Always ventilate. Never leave burning charcoal unattended. Keep pets and children away from hot surfaces.',
          'Start with small amounts; overpowering smoke rarely improves focus.',
        ),
      },
      {
        heading: 'Respectful intent',
        paragraphs: p(
          'Pair incense with clear, kind intention and regular cleaning of your space.',
          'Browse Imisioluwa spiritual categories for cleansing-related items available to your country.',
        ),
      },
    ],
    howTo: {
      name: 'Burn resin incense with ventilation',
      description: 'General safety sequence for indoor smoke-based cleansing.',
      steps: [
        { name: 'Open a window', text: 'Create cross-ventilation before you light anything.' },
        {
          name: 'Use a heat-safe holder',
          text: 'Place charcoal or electric burner on a stone or metal tray away from curtains.',
        },
        {
          name: 'Extinguish fully',
          text: 'Douse charcoal safely according to manufacturer guidance and cool before disposal.',
        },
      ],
    },
  },
  {
    slug: 'what-is-agbo-nigerian-herbal-drinks-benefits',
    title: 'What Is Agbo? A Guide to Nigerian Herbal Drinks and Their Benefits',
    metaDescription:
      'High-level Agbo overview, variation between bottles, and how to evaluate sellers without medical promises.',
    excerpt: 'Understand Agbo diversity and buyer questions to ask.',
    publishedAt: '2026-03-25',
    updatedAt: '2026-03-25',
    keywords: ['agbo herbal drink', 'nigerian herbal tea'],
    sections: [
      {
        heading: 'Not one recipe',
        paragraphs: p(
          'Agbo can describe many herbal mixtures. Taste, color, and strength vary by maker and intended use.',
          'Herbal drinks are not a substitute for medical diagnosis — speak to clinicians for persistent symptoms.',
        ),
      },
      {
        heading: 'Buyer checklist',
        paragraphs: p(
          'Ask for ingredients, expiry, storage after opening, and shipping heat exposure for international orders.',
          'Imisioluwa lists herbal SKUs with clear copy where stock exists.',
        ),
      },
    ],
  },
  {
    slug: 'buy-authentic-iru-locust-beans-online-freshness',
    title: 'Buy Authentic Iru (Locust Beans) Online: Freshness Guaranteed',
    metaDescription:
      'How to judge iru quality online, packaging signals, and storing locust beans so they stay aromatic.',
    excerpt: 'Fresh iru tastes like home cooking—here is what to check.',
    publishedAt: '2026-03-25',
    updatedAt: '2026-03-25',
    keywords: ['iru', 'locust beans', 'nigerian ingredients'],
    sections: [
      {
        heading: 'Whole vs powdered',
        paragraphs: p(
          'Whole fermented iru keeps volatile aroma longer if sealed. Powder is convenient but loses top notes faster.',
          'Avoid mysterious “mixed spice” bags without ingredient percentages when iru is the star.',
        ),
      },
      {
        heading: 'Storage',
        paragraphs: p(
          'Freeze or refrigerate based on seller guidance; keep away from moisture to prevent mold.',
          'Order pantry staples from Imisioluwa alongside soups and spice picks.',
        ),
      },
    ],
  },
  {
    slug: 'how-imisioluwa-sources-authentic-products-from-nigeria',
    title: 'How Imisioluwa Sources Authentic African Products Directly from Nigeria',
    metaDescription:
      'Transparent overview of sourcing priorities: clear descriptions, packing for export, and diaspora-friendly checkout.',
    excerpt: 'What “authentic” means in our storefront operations.',
    publishedAt: '2026-03-25',
    updatedAt: '2026-03-25',
    keywords: ['authentic nigerian products', 'imisioluwa'],
    sections: [
      {
        heading: 'Catalog discipline',
        paragraphs: p(
          'We emphasize readable English descriptions, realistic imagery, and categories that match how Nigerians shop.',
          'Spiritual, herbal, food, and cultural items sit together because diaspora households rarely need only one.',
        ),
      },
      {
        heading: 'Logistics mindset',
        paragraphs: p(
          'International buyers see currencies and shipping expectations appropriate to fragile or liquid items.',
          'Local buyers benefit from domestic fulfilment paths tuned to Nigerian addresses.',
        ),
      },
    ],
  },
  {
    slug: 'celebrating-yoruba-culture-abroad-traditional-products',
    title: 'Celebrating Yoruba Culture Abroad: Products That Keep You Connected',
    metaDescription:
      'Thoughtful ways diaspora families use food, scent, and ritual items to stay connected to Yoruba culture.',
    excerpt: 'Culture is practice, meals, and memory—not only objects.',
    publishedAt: '2026-03-25',
    updatedAt: '2026-03-25',
    keywords: ['yoruba diaspora', 'african culture abroad'],
    sections: [
      {
        heading: 'Ritual of the ordinary',
        paragraphs: p(
          'Weekly soups, shared snacks, and familiar scents can anchor children and adults alike.',
          'Choose a few high-quality staples rather than overcrowding shelves.',
        ),
      },
      {
        heading: 'Ethical joy',
        paragraphs: p(
          'Credit makers and regions. Teach younger relatives the names of ingredients in Yoruba and English.',
          'Imisioluwa exists to reduce friction buying those staples abroad.',
        ),
      },
    ],
  },
  {
    slug: 'spiritual-preparation-new-year-african-rituals-products',
    title: 'Spiritual Preparation for the New Year: African Rituals and Products',
    metaDescription:
      'Seasonal reflection, cleansing routines, and planning product orders before holiday courier delays.',
    excerpt: 'Plan reflection, cleansing, and shipping timelines.',
    publishedAt: '2026-03-25',
    updatedAt: '2026-03-25',
    keywords: ['new year spiritual ritual', 'african spiritual products'],
    sections: [
      {
        heading: 'Reflection before shopping',
        paragraphs: p(
          'Write down what you want to release and what you want to build. Spiritual shopping should follow clarity, not anxiety.',
          'Order early if you need items before specific calendar dates.',
        ),
      },
      {
        heading: 'Gentle routines',
        paragraphs: p(
          'If incorporating baths or soaps, patch test and keep one intention.',
          'Check Imisioluwa spiritual category for seasonal bestsellers still in stock.',
        ),
      },
    ],
  },
  {
    slug: 'gift-guide-african-traditional-products-diaspora',
    title: 'Gift Guide: African Traditional Products for Someone Who Misses Home',
    metaDescription:
      'Curated gift angles: spice sets, spiritual soaps, shea-based care, and shipping tips for surprise packages.',
    excerpt: 'Ship thoughtful bundles diaspora relatives will actually use.',
    publishedAt: '2026-03-25',
    updatedAt: '2026-03-25',
    keywords: ['african gift ideas', 'nigerian diaspora gifts'],
    sections: [
      {
        heading: 'Bundle by room',
        paragraphs: p(
          'Kitchen: iru, dried pepper, spice blends. Bathroom: soap and unperfumed oils if they have sensitive skin.',
          'Spiritual: one focused item plus a plain-language note on respectful use.',
        ),
      },
      {
        heading: 'Customs-friendly wrapping',
        paragraphs: p(
          'Keep invoices visible if required. Avoid ambiguous declarations on food or oils.',
          'Imisioluwa customer support can clarify category wording on paperwork when needed.',
        ),
      },
    ],
  },
  {
    slug: 'nigerian-independence-day-food-culture-at-home',
    title: 'Nigerian Independence Day: Celebrating with Authentic Food and Culture',
    metaDescription:
      'Menu ideas, playlist energy, and pantry prep for October celebrations at home or with friends abroad.',
    excerpt: 'Independence gatherings start with intentional cooking.',
    publishedAt: '2026-03-25',
    updatedAt: '2026-03-25',
    keywords: ['nigerian independence day', 'nigerian food celebration'],
    sections: [
      {
        heading: 'Menu balance',
        paragraphs: p(
          'Pick one project dish and fill gaps with fast sides like jollof, coleslaw, or peppered protein.',
          'Batch-cook stock bases beforehand so the day feels festive, not frantic.',
        ),
      },
      {
        heading: 'Pantry timeline',
        paragraphs: p(
          'Order spices and specialist items two–three weeks early in busy seasons.',
          'Imisioluwa food aisle can cover hard-to-find bottles and dry goods.',
        ),
      },
    ],
  },
  {
    slug: 'ramadan-iftar-nigerian-ingredients-essential-list',
    title: 'Ramadan and Iftar: Essential Nigerian Ingredients for Breaking Fast',
    metaDescription:
      'Hydration-first iftar notes, Nigerian flavors, and pantry items that travel well for diaspora Ramadan.',
    excerpt: 'Balance hydration, dates, and beloved Nigerian tastes.',
    publishedAt: '2026-03-25',
    updatedAt: '2026-03-25',
    keywords: ['ramadan iftar', 'nigerian ingredients'],
    sections: [
      {
        heading: 'Hydration hierarchy',
        paragraphs: p(
          'Dates, water, light fruit, then heavier soups. Oily pepper soups late at night can disturb sleep for some people.',
          'Plan lighter pepper levels for guests fasting long hours in hot climates.',
        ),
      },
      {
        heading: 'Pantry that ships',
        paragraphs: p(
          'Dry pepper blends, stock powder with clear labels, and bottled drinks with long stability work well internationally.',
          'Bundle Ramadan staples via Imisioluwa before couriers get congested.',
        ),
      },
    ],
  },
  {
    slug: 'is-african-black-soap-good-for-your-skin-dermatologist-backed-facts',
    title: 'Is African Black Soap Good for Your Skin? Dermatologist-Backed Facts',
    metaDescription:
      'Balanced overview of African black soap benefits, irritation risk, and when to see a dermatologist.',
    excerpt: 'Benefits, risks, and when to stop and get help.',
    publishedAt: '2026-03-25',
    updatedAt: '2026-03-25',
    keywords: ['african black soap skin', 'ose dudu skin'],
    sections: [
      {
        heading: 'Why people like it',
        paragraphs: p(
          'Many users report less oily buildup because traditional soaps can be strong surfactants.',
          'Authentic bars vary; synthetic dyes and heavy fragrance are red flags.',
        ),
      },
      {
        heading: 'When to pause',
        paragraphs: p(
          'Burning, peeling, or new widespread rash means stop use and consult clinicians—this article is not medical advice.',
          'Imisioluwa lists soaps with ingredient transparency whenever possible.',
        ),
      },
    ],
    faqs: [
      {
        question: 'Can black soap fade dark spots?',
        answer:
          'Some people notice clearer tone over time, but results vary. A dermatologist can recommend evidence-based options if pigmentation bothers you.',
      },
      {
        question: 'Should children use it?',
        answer:
          'Children often need milder cleansers. Ask a pediatric clinician if you are unsure.',
      },
    ],
  },
  {
    slug: 'can-you-ship-food-products-from-nigeria-to-uk-usa-complete-guide',
    title: 'Can You Ship Food Products from Nigeria to the UK/USA? (Complete Guide)',
    metaDescription:
      'Plain-language framing on customs, prohibited categories, labeling, and why timelines vary by courier.',
    excerpt: 'Set expectations before you pay for international grocery freight.',
    publishedAt: '2026-03-25',
    updatedAt: '2026-03-25',
    keywords: ['ship nigerian food', 'customs food import'],
    sections: [
      {
        heading: 'Rules beat vibes',
        paragraphs: p(
          'Import rules change by country and product class. Meat, dairy, seeds, and certain flours face tighter controls.',
          'Buyers—not blogs—are ultimately responsible for compliance with their destination regulations.',
        ),
      },
      {
        heading: 'How Imisioluwa helps',
        paragraphs: p(
          'We aim for honest category descriptions and sturdy packing. Check your order confirmation for itemized content.',
          'Contact support if you need documentation phrasing for customs.',
        ),
      },
    ],
    faqs: [
      {
        question: 'Will my package always take the same number of days?',
        answer:
          'No. Customs inspection, weather, and peak seasons change delivery distributions.',
      },
      {
        question: 'Who pays duties?',
        answer:
          'Typically the recipient unless the store explicitly prepays taxes for your corridor. Read checkout disclosures carefully.',
      },
    ],
  },
  {
    slug: 'divine-favor-spiritual-soap-buyers-guide',
    title: 'Divine Favor Spiritual Soap: What Buyers Should Know Online',
    metaDescription:
      'Interpreter-friendly guide to “divine favor” soaps, marketing language, and choosing sellers you trust.',
    excerpt: 'Decode marketing and choose aligned intentions.',
    publishedAt: '2026-03-25',
    updatedAt: '2026-03-25',
    keywords: ['divine favor spiritual soap', 'spiritual soap online'],
    sections: [
      {
        heading: 'Language vs lineage',
        paragraphs: p(
          'English phrases like “divine favor” often overlay Yoruba product names. Ask sellers what traditional name maps to the bar you see.',
          'Grandiose guarantees should make you more cautious, not more excited.',
        ),
      },
      {
        heading: 'Purchase discipline',
        paragraphs: p(
          'Buy one bar, finish instructions, journal what you notice before stacking new SKUs.',
          'Imisioluwa links spiritual SKUs to the same cart as pantry items for realistic diaspora shops.',
        ),
      },
    ],
  },
  {
    slug: 'buy-african-spiritual-soap-uk-delivery',
    title: 'Buy African Spiritual Soap in the UK: Delivery and Authenticity Tips',
    metaDescription:
      'UK-focused buyer checklist for African spiritual soaps: GBP checkout, delivery realism, and counterfeits.',
    excerpt: 'Shop smarter from the UK without overpaying for mystery bars.',
    publishedAt: '2026-03-25',
    updatedAt: '2026-03-25',
    keywords: ['buy african spiritual soap uk', 'spiritual soap uk'],
    sections: [
      {
        heading: 'Currency and support',
        paragraphs: p(
          'GBP pricing removes mental math. Confirm someone answers emails before you place large first orders.',
          'Read return policies on opened spiritual goods—many stores cannot restock used bars.',
        ),
      },
      {
        heading: 'Authenticity shortcuts',
        paragraphs: p(
          'Strong uniform dye, perfume overload, and suspiciously low prices often signal repackaged mass soap.',
          'Pair this article with our location pages for major UK cities.',
        ),
      },
    ],
  },
  {
    slug: 'orisha-supplies-online-what-to-look-for',
    title: 'Orisha Supplies Online: What to Look For in a Trustworthy Shop',
    metaDescription:
      'Evaluation criteria for orisha-related consumer goods online: transparency, safety, and respectful descriptions.',
    excerpt: 'Shop with dignity—for yourself and for the culture.',
    publishedAt: '2026-03-25',
    updatedAt: '2026-03-25',
    keywords: ['orisha supplies online', 'african spiritual products'],
    sections: [
      {
        heading: 'Transparency beats mystique',
        paragraphs: p(
          'Trusted sellers publish ingredients for consumables, dimensions for tools, and country of manufacture.',
          'Vague “powerful secret recipe” copy without safety guidance is a red flag.',
        ),
      },
      {
        heading: 'Community accountability',
        paragraphs: p(
          'Ask peers in your lineage which storefronts they have successfully used.',
          'Imisioluwa welcomes feedback when listings need clearer cultural context.',
        ),
      },
    ],
  },
  {
    slug: 'nigerian-pepper-soup-spices-buy-online',
    title: 'Nigerian Pepper Soup Spices Online: What Makes a Good Blend',
    metaDescription:
      'Uda, eeru, seeds of alligator pepper, and dry fish aromatics — what belongs in pepper soup spice shopping.',
    excerpt: 'Build pepper soup that tastes like the joint back home.',
    publishedAt: '2026-03-25',
    updatedAt: '2026-03-25',
    keywords: ['nigerian pepper soup spices', 'uda spice online'],
    sections: [
      {
        heading: 'Whole vs ground',
        paragraphs: p(
          'Whole seeds stay aromatic longer; toast lightly before grinding small batches.',
          'Pre-ground mixes convenience with faster flavour loss—freeze if you buy in bulk.',
        ),
      },
      {
        heading: 'Protein pairing',
        paragraphs: p(
          'Goat, catfish, and chicken pepper soups each tolerate different heat levels—season in layers.',
          'Grab spice bundles from Imisioluwa when restocking for winter.',
        ),
      },
    ],
  },
  {
    slug: 'buy-yoruba-herbal-medicine-online-safety-tips',
    title: 'Buy Yoruba Herbal Medicine Online: Safety and Quality Signals',
    metaDescription:
      'How diaspora buyers evaluate herbal sellers: labels, batch info, contraindications, and red flags.',
    excerpt: 'Protect yourself while exploring Agbo and related formulas.',
    publishedAt: '2026-03-25',
    updatedAt: '2026-03-25',
    keywords: ['buy yoruba herbal medicine online', 'agbo safety'],
    sections: [
      {
        heading: 'Label rigor',
        paragraphs: p(
          'You should see plant parts used, solvent if any, volume, and storage after opening.',
          'Mystery “miracle cure” language is incompatible with responsible herbal commerce.',
        ),
      },
      {
        heading: 'Logistics',
        paragraphs: p(
          'Hot warehouses and long sits in customs degrade delicate tinctures. Track packages proactively.',
          'Imisioluwa herbal SKUs note fragility where relevant.',
        ),
      },
    ],
  },
];

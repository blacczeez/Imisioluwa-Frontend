import type { StoreLocale } from './store-locale';

/** Server-side copy for blog index and shared labels (blog routes are not wrapped in i18n RSC). */
export const BLOG_INDEX: Record<
  StoreLocale,
  { title: string; description: string; ogTitle: string; ogDesc: string; h1: string; intro: string }
> = {
  en: {
    title: 'African Spiritual Products Blog and Guides',
    description:
      'Practical guides on African spiritual soaps, Yoruba traditions, herbs, spices, and buying authentic Nigerian products from anywhere.',
    ogTitle: 'Imisioluwa Blog — African spiritual and cultural guides',
    ogDesc:
      'Ose Dudu, Ose Asina, Yoruba traditions, and how to buy authentic Nigerian products online.',
    h1: 'Imisioluwa Blog',
    intro:
      'Practical guides on authentic African spiritual products, traditional ingredients, and buying Nigerian goods online worldwide.',
  },
  yo: {
    title: 'Blog àti Ìlànà fún Àwọn Ọjà Ẹ̀mí àti Àṣà Áfíríkà',
    description:
      'Àwọn ìlànà lílo nípa oṣẹ ẹ̀mí, àṣà Yorùbá, ẹfọ́, ata, àti rírà ọjà Nàìjíríà òtítọ́ láìbílẹ̀ ní ayé.',
    ogTitle: 'Blog Imisioluwa — Àwọn ìmọ̀ràn ẹ̀mí àti àṣà',
    ogDesc: 'Oṣẹ Dudu, Oṣẹ Asínà, àṣà Yorùbá, àti bí a ṣe ń ra ọjà Nàìjíríà lórí ayélujára.',
    h1: 'Blog Imisioluwa',
    intro:
      'Àwọn ìlànà nípa ọjà ẹ̀mí àti Àṣà Áfíríkà gidi, ohun elétò, àti rírà ọjà Nàìjíríà káàkiri ayé.',
  },
  fr: {
    title: 'Blog — Produits spirituels africains et guides pratiques',
    description:
      'Guides sur savons spirituels, traditions yoruba, herbes, épices et achats authentiques depuis la diaspora.',
    ogTitle: 'Blog Imisioluwa — spiritualité et culture africaines',
    ogDesc:
      'Ose Dudu, traditions yoruba et comment acheter des produits nigérians authentiques en ligne.',
    h1: 'Blog Imisioluwa',
    intro:
      'Guides pratiques sur produits spirituels et traditionnels africains, ingrédients et commandes depuis le monde entier.',
  },
};

export function blogArticleNotFoundTitle(locale: StoreLocale): string {
  if (locale === 'yo') return 'Àkọsílẹ̀ kò sí';
  if (locale === 'fr') return 'Article introuvable';
  return 'Article Not Found';
}

export function dateLocaleTag(locale: StoreLocale): string {
  if (locale === 'fr') return 'fr-FR';
  if (locale === 'yo') return 'yo-NG';
  return 'en-NG';
}

export function ogLocaleTag(locale: StoreLocale): string {
  if (locale === 'fr') return 'fr_FR';
  if (locale === 'yo') return 'yo_NG';
  return 'en_NG';
}

export const BLOG_ARTICLE_UI: Record<
  StoreLocale,
  { faq: string; continueH2: string; continueP: string; viewAll: string; readArticle: string; home: string; blog: string }
> = {
  en: {
    home: 'Home',
    blog: 'Blog',
    faq: 'Frequently Asked Questions',
    continueH2: 'Continue Reading',
    continueP:
      'Explore more guides on Yoruba traditions, spiritual products, and authentic Nigerian goods.',
    viewAll: 'View all articles',
    readArticle: 'Read article',
  },
  yo: {
    home: 'Ilé',
    blog: 'Blog',
    faq: 'Àwọn Ìbéèrè Tó Wọpọ̀',
    continueH2: 'Káàkiri Kíkọ',
    continueP: 'Ṣe àwọn ìlànà sí àṣà Yorùbá, ọjà ẹ̀mí, àti ọjà Nàìjíríà òtítọ́.',
    viewAll: 'Wo gbogbo àwọn àkọsílẹ̀',
    readArticle: 'Kọ àkọsílẹ̀',
  },
  fr: {
    home: 'Accueil',
    blog: 'Blog',
    faq: 'Questions fréquentes',
    continueH2: 'Pour aller plus loin',
    continueP:
      'D’autres guides sur les traditions yoruba, les produits spirituels et les produits nigérians authentiques.',
    viewAll: 'Voir tous les articles',
    readArticle: 'Lire l’article',
  },
};

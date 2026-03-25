export interface BlogFaq {
  question: string;
  answer: string;
}

export interface BlogSection {
  heading: string;
  paragraphs: string[];
}

export interface BlogHowToStep {
  name: string;
  text: string;
}

export interface BlogHowTo {
  name: string;
  description: string;
  steps: BlogHowToStep[];
}

export interface BlogPost {
  slug: string;
  title: string;
  metaDescription: string;
  excerpt: string;
  publishedAt: string;
  updatedAt: string;
  keywords: string[];
  sections: BlogSection[];
  faqs?: BlogFaq[];
  /** Optional HowTo JSON-LD for instructional articles */
  howTo?: BlogHowTo;
}

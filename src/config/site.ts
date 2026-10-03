import type { Language } from '../lib/posts';

type SocialLink = { label: string; url: `https://${string}` };
type FaqEntry = { question: string; answer: string };

export const siteConfig = {
  name: 'Code Geeks',
  description: {
    it: 'Idee, esperimenti e appunti su intelligenza artificiale, codice e tecnologia.',
    en: 'Ideas, experiments and notes on artificial intelligence, code and technology.',
  },
  // Enable these when their content is ready. No empty links are rendered.
  features: { faq: false, social: false },
  socialLinks: [] as SocialLink[],
  faq: { it: [], en: [] } as Record<Language, FaqEntry[]>,
};

export const hasFaq = (lang: Language) =>
  siteConfig.features.faq && siteConfig.faq[lang].length > 0;

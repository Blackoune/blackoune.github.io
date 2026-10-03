import { url } from '../site';
import { en } from './en';
import { fr } from './fr';
import { GUIDES, GUIDES_CLES, type GuideCle } from './guides';

export type Lang = 'fr' | 'en';
export const LANGUES: Lang[] = ['fr', 'en'];
export const TEXTES = { fr, en };
export { GUIDES, GUIDES_CLES, type GuideCle };

/** Pages du site. En anglais : préfixe /en/ et, si besoin, un nom anglais. */
export type Page = '' | 'installation' | 'contact' | 'comparatif' | 'mentions-legales' | 'confidentialite' | GuideCle;
export const PAGES: Page[] = ['', 'installation', 'contact', 'comparatif', 'mentions-legales', 'confidentialite', ...GUIDES_CLES];

// Doit correspondre aux noms des fichiers de src/pages/en/.
const SLUGS_EN: Partial<Record<Page, string>> = {
  comparatif: 'comparison',
  'mentions-legales': 'legal-notice',
  confidentialite: 'privacy',
};

const estGuide = (page: Page): page is GuideCle => (GUIDES_CLES as string[]).includes(page);

/** Nom de la page dans l'adresse, pour une langue. */
export function slug(lang: Lang, page: Page): string {
  if (estGuide(page)) return GUIDES[lang][page].slug;
  return lang === 'en' ? SLUGS_EN[page] ?? page : page;
}

export function lien(lang: Lang, page: Page = ''): string {
  const s = slug(lang, page);
  return url(lang === 'fr' ? s : 'en/' + s);
}

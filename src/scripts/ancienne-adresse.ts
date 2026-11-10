// Ancienne adresse du site : blackoune.github.io/OBS-Dynamics/... (jusqu'au
// 2026-10-03). Renvoie vers la même page à la racine : les liens déjà
// partagés et les résultats Google pas encore mis à jour continuent de marcher.
const ancienne = /^\/OBS-Dynamics(?:\/|$)/;

/** Chemin à la racine, ou null si ce n'est pas une ancienne adresse. */
export function nouveauChemin(chemin: string): string | null {
  if (!ancienne.test(chemin)) return null;
  // Un seul « / » en tête : « //evil.com » serait lu comme un autre site.
  return '/' + chemin.replace(ancienne, '').replace(/^[/\\]+/, '');
}

if (typeof location !== 'undefined') {
  const chemin = nouveauChemin(location.pathname);
  if (chemin) location.replace(chemin + location.search + location.hash);
}

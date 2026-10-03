# OBS Dynamics — site officiel

Code du site https://blackoune.github.io/ : présentation, installation, aide et
guides du logiciel OBS Dynamics (code du logiciel : dépôt Blackoune/OBS-Dynamics).

- Astro, sortie 100 % statique, hébergé par GitHub Pages.
- Aucune ressource externe, CSP stricte : vérifiée à chaque build par scripts/check-dist.mjs.
- La page Installation lit la dernière release d'OBS Dynamics au moment du build.
  Le site est reconstruit chaque jour, ou à la main : Actions → Site → Run workflow.

Développement : npm ci, puis npm run dev. Contrôles : npx astro check, npm test, npm run build.

Licence GPL-3.0.

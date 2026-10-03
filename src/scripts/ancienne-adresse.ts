// Ancienne adresse du site : blackoune.github.io/OBS-Dynamics/... (jusqu'au
// 2026-10-03). Renvoie vers la même page à la racine : les liens déjà
// partagés et les résultats Google pas encore mis à jour continuent de marcher.
const ancienne = /^\/OBS-Dynamics(\/|$)/;
if (ancienne.test(location.pathname)) {
  location.replace(location.pathname.replace(ancienne, '/') + location.search + location.hash);
}

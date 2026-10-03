// Contrôle des failles connues des dépendances (npm audit), seuil « high ».
// Échoue sur toute faille high ou critical, SAUF celles listées ci-dessous :
// chacune a une justification écrite et une date d'expiration, après laquelle
// le contrôle la refuse de nouveau et oblige à la réexaminer.
import { execSync } from 'node:child_process';

const EXCEPTIONS = {
  // http-cache-semantics, utilisé par Astro au BUILD (cache d'images distantes).
  // La faille concerne un serveur cache partagé entre utilisateurs ; le site
  // est statique, sans serveur ni cache partagé. Aucune version corrigée
  // n'existe (« npm audit fix » proposerait Astro 2).
  'GHSA-ch52-4w7c-c8xp': '2027-01-01',
};

let sortie;
try {
  sortie = execSync('npm audit --json', { encoding: 'utf8' });
} catch (e) {
  sortie = e.stdout; // npm audit sort en erreur dès qu'il trouve une faille
}
const rapport = JSON.parse(sortie);
const aujourdhui = new Date().toISOString().slice(0, 10);

const bloquantes = new Map();
for (const vuln of Object.values(rapport.vulnerabilities ?? {})) {
  for (const source of vuln.via) {
    if (typeof source !== 'object' || !['high', 'critical'].includes(source.severity)) continue;
    const id = String(source.url ?? '').split('/').pop();
    const expire = EXCEPTIONS[id];
    if (expire && aujourdhui < expire) continue;
    bloquantes.set(id || source.title, `${source.name} : ${source.title} (${source.severity})`);
  }
}

if (bloquantes.size) {
  console.error(`audit : ${bloquantes.size} faille(s) bloquante(s)`);
  for (const [id, texte] of bloquantes) console.error(`  - ${id} ${texte}`);
  process.exit(1);
}
console.log('audit : aucune faille high ou critical non justifiée.');

// Dernière release publiée, lue au BUILD uniquement (jamais par le navigateur
// du visiteur : connect-src 'none').
//   - aucune release (404)       -> null : « Première version bientôt disponible »
//   - API ou fichier indisponible -> le build échoue ; le site en ligne reste
//     la version précédente. Jamais d'empreinte absente ou fausse.
import { REPO } from '../site';

export interface Release {
  version: string;
  date: Date;
  taille: number;        // octets
  sha256: string;
  signe: boolean;
  virustotal: string;
  telechargement: string;
  fichier: string;       // nom du fichier téléchargé (installateur, sinon exe seul)
}

const API = `https://api.github.com/repos/${REPO}/releases/latest`;

async function lire(url: string, accept: string): Promise<Response> {
  const entetes: Record<string, string> = { Accept: accept, 'User-Agent': 'obs-dynamics-site' };
  if (process.env.GITHUB_TOKEN) entetes.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return fetch(url, { headers: entetes });
}

async function charger(): Promise<Release | null> {
  // Aperçu local seulement (npm run apercu) : montre la page avec une release.
  // Impossible en CI (GitHub Actions définit toujours CI=true) : une fausse
  // empreinte n'atteint jamais le site en ligne.
  if (process.env.APERCU_RELEASE === '1' && !process.env.CI) {
    return {
      version: 'v0.0.0-apercu',
      date: new Date('2026-10-01'),
      taille: 77_594_624,
      sha256: '0'.repeat(64),
      signe: false,
      virustotal: 'https://www.virustotal.com/',
      telechargement: '#',
      fichier: 'OBS-Dynamics-Setup.exe',
    };
  }
  const reponse = await lire(API, 'application/vnd.github+json');
  if (!reponse.ok) await reponse.body?.cancel();  // un corps non lu garde le socket ouvert
  if (reponse.status === 404) return null;
  if (!reponse.ok) throw new Error(`API GitHub : ${reponse.status} sur ${API}`);
  const r = await reponse.json();

  type Asset = { name: string; size: number; browser_download_url: string };
  const trouver = (nom: string) => r.assets.find((a: Asset) => a.name === nom) as Asset | undefined;
  // L'installateur s'il existe ; les premières releases n'ont que l'exe seul.
  const exe = trouver('OBS-Dynamics-Setup.exe') ?? trouver('Dynamics.exe');
  const sommes = trouver('SHA256SUMS.txt');
  if (!exe || !sommes) throw new Error(`Release ${r.tag_name} incomplète : exécutable ou SHA256SUMS.txt absent`);

  const fichier = await lire(sommes.browser_download_url, 'application/octet-stream');
  if (!fichier.ok) throw new Error(`SHA256SUMS.txt : ${fichier.status}`);
  const lignes = (await fichier.text()).split('\n').map((l) => l.trim().split(/\s+/));
  const empreinte = (nom: string) => lignes.find(([, f]) => f === nom || f === `*${nom}`)?.[0] ?? '';
  const sha256 = empreinte(exe.name);
  if (!/^[0-9a-f]{64}$/.test(sha256)) throw new Error(`SHA256SUMS.txt : empreinte de ${exe.name} illisible`);
  // VirusTotal reçoit Dynamics.exe (release.yml) : son rapport porte cette empreinte.
  const shaVt = empreinte('Dynamics.exe') || sha256;

  return {
    version: r.tag_name,
    date: new Date(r.published_at),
    taille: exe.size,
    sha256,
    signe: !/non signé/i.test(r.body ?? ''),
    virustotal: `https://www.virustotal.com/gui/file/${shaVt}`,
    telechargement: `https://github.com/${REPO}/releases/latest/download/${exe.name}`,
    fichier: exe.name,
  };
}

// Mémorisé : les pages qui l'importent partagent un seul appel par build.
let promesse: Promise<Release | null> | undefined;
export function derniereRelease(): Promise<Release | null> {
  return (promesse ??= charger());
}

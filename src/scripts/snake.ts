// Snake caché de la page 404 : un clic sur le « 0 » le lance en plein écran.
// Flèches (ou ZQSD/WASD) sur ordinateur, glisser du doigt sur téléphone.
import { avancer, diriger, DIRECTIONS, nouvellePartie, type Etat, type Point } from './snake-logique';

const PAS_MS = 110;
const SEUIL_GLISSE = 24;

const TOUCHES: Record<string, Point> = {
  ArrowUp: DIRECTIONS.haut, ArrowDown: DIRECTIONS.bas,
  ArrowLeft: DIRECTIONS.gauche, ArrowRight: DIRECTIONS.droite,
  z: DIRECTIONS.haut, w: DIRECTIONS.haut, s: DIRECTIONS.bas,
  q: DIRECTIONS.gauche, a: DIRECTIONS.gauche, d: DIRECTIONS.droite,
};

const bouton = document.querySelector<HTMLButtonElement>('[data-snake]');
const jeu = document.querySelector<HTMLElement>('.snake');
const toile = jeu?.querySelector('canvas');
const ctx = toile?.getContext('2d');
const scoreEl = jeu?.querySelector<HTMLElement>('[data-score]');
const messageEl = jeu?.querySelector<HTMLElement>('[data-message]');
const fermer = jeu?.querySelector<HTMLButtonElement>('[data-fermer]');
const fin = jeu?.querySelector<HTMLElement>('.snake-fin');
const rejouer = jeu?.querySelector<HTMLButtonElement>('[data-rejouer]');
const principal = document.querySelector('main');

if (bouton && jeu && toile && ctx && scoreEl && messageEl && fermer && fin && rejouer && principal) {
  let etat: Etat;
  let minuteur = 0;
  let taille = 0;
  let marge = { x: 0, y: 0 };
  let couleurs = { fond: '', ligne: '', serpent: '', pomme: '' };
  let debut: Point | undefined;

  const dessiner = () => {
    const { fond, ligne, serpent, pomme } = couleurs;
    ctx.fillStyle = fond;
    ctx.fillRect(0, 0, toile.clientWidth, toile.clientHeight);
    ctx.strokeStyle = ligne;
    ctx.strokeRect(marge.x - .5, marge.y - .5, etat.cols * taille + 1, etat.rows * taille + 1);
    const caseEn = (p: Point, couleur: string) => {
      ctx.fillStyle = couleur;
      ctx.fillRect(marge.x + p.x * taille + 1, marge.y + p.y * taille + 1, taille - 2, taille - 2);
    };
    if (etat.pomme) caseEn(etat.pomme, pomme);
    etat.corps.forEach((c) => caseEn(c, serpent));
  };

  const pas = () => {
    avancer(etat);
    scoreEl.textContent = String(etat.score);
    dessiner();
    if (etat.fini) {
      clearInterval(minuteur);
      messageEl.textContent = `Perdu, score ${etat.score}.`;
      fin.hidden = false;
      rejouer.focus();
    }
  };

  const demarrer = () => {
    clearInterval(minuteur);
    const ratio = window.devicePixelRatio || 1;
    const w = toile.clientWidth;
    const h = toile.clientHeight;
    toile.width = Math.round(w * ratio);
    toile.height = Math.round(h * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    taille = Math.max(14, Math.floor(Math.min(w, h) / 22));
    const cols = Math.floor((w - 16) / taille);
    const rows = Math.floor((h - 16) / taille);
    marge = { x: Math.floor((w - cols * taille) / 2), y: Math.floor((h - rows * taille) / 2) };
    etat = nouvellePartie(cols, rows);
    scoreEl.textContent = '0';
    messageEl.textContent = '';
    fin.hidden = true;
    jeu.focus();
    dessiner();
    minuteur = window.setInterval(pas, PAS_MS);
  };

  const ouvrir = () => {
    const css = getComputedStyle(document.documentElement);
    const lire = (nom: string) => css.getPropertyValue(nom).trim();
    couleurs = { fond: lire('--fond'), ligne: lire('--ligne'), serpent: lire('--accent'), pomme: lire('--texte') };
    jeu.hidden = false;
    principal.inert = true;
    jeu.focus();
    demarrer();
  };

  const quitter = () => {
    clearInterval(minuteur);
    jeu.hidden = true;
    principal.inert = false;
    bouton.focus();
  };

  bouton.addEventListener('click', ouvrir);
  fermer.addEventListener('click', quitter);
  rejouer.addEventListener('click', demarrer);

  window.addEventListener('keydown', (e) => {
    if (jeu.hidden) return;
    if (e.key === 'Escape') return quitter();
    const dir = TOUCHES[e.key.length === 1 ? e.key.toLowerCase() : e.key];
    if (dir) {
      e.preventDefault();
      diriger(etat, dir);
    } else if (etat.fini && (e.key === 'Enter' || e.key === ' ') && e.target !== fermer && e.target !== rejouer) {
      e.preventDefault();
      demarrer();
    }
  });

  jeu.addEventListener('touchstart', (e) => {
    const t = e.changedTouches[0];
    debut = { x: t.clientX, y: t.clientY };
  }, { passive: true });

  jeu.addEventListener('touchend', (e) => {
    if (!debut || e.target === fermer || e.target === rejouer) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - debut.x;
    const dy = t.clientY - debut.y;
    debut = undefined;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < SEUIL_GLISSE) {
      if (etat.fini) demarrer();
      return;
    }
    if (Math.abs(dx) > Math.abs(dy)) diriger(etat, dx > 0 ? DIRECTIONS.droite : DIRECTIONS.gauche);
    else diriger(etat, dy > 0 ? DIRECTIONS.bas : DIRECTIONS.haut);
  });

  // Rotation ou fenêtre redimensionnée : la grille change, la partie repart.
  window.addEventListener('resize', () => {
    if (!jeu.hidden) demarrer();
  });
}

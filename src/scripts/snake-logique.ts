// Règles du Snake caché de la page 404, sans DOM : testées par scripts/snake.test.mjs.

export interface Point { x: number; y: number }

export interface Etat {
  cols: number;
  rows: number;
  /** Tête en premier. */
  corps: Point[];
  dir: Point;
  /** Directions demandées entre deux pas (deux appuis rapides comptent tous les deux). */
  file: Point[];
  pomme: Point | undefined;
  score: number;
  fini: boolean;
}

export const DIRECTIONS = {
  haut: { x: 0, y: -1 },
  bas: { x: 0, y: 1 },
  gauche: { x: -1, y: 0 },
  droite: { x: 1, y: 0 },
} as const;

const egal = (a: Point, b: Point) => a.x === b.x && a.y === b.y;

export function placerPomme(cols: number, rows: number, corps: Point[], hasard: () => number) {
  const libres: Point[] = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (!corps.some((c) => c.x === x && c.y === y)) libres.push({ x, y });
    }
  }
  return libres[Math.floor(hasard() * libres.length)];
}

export function nouvellePartie(cols: number, rows: number, hasard = Math.random): Etat {
  const x = Math.floor(cols / 2);
  const y = Math.floor(rows / 2);
  const corps = [{ x, y }, { x: x - 1, y }, { x: x - 2, y }];
  return {
    cols, rows, corps, dir: DIRECTIONS.droite, file: [],
    pomme: placerPomme(cols, rows, corps, hasard), score: 0, fini: false,
  };
}

/** Ignore le demi-tour et la direction déjà prise. */
export function diriger(etat: Etat, dir: Point) {
  const derniere = etat.file.at(-1) ?? etat.dir;
  if (etat.file.length >= 2 || egal(dir, derniere)) return;
  if (dir.x === -derniere.x && dir.y === -derniere.y) return;
  etat.file.push(dir);
}

export function avancer(etat: Etat, hasard = Math.random) {
  if (etat.fini) return;
  etat.dir = etat.file.shift() ?? etat.dir;
  const tete = { x: etat.corps[0].x + etat.dir.x, y: etat.corps[0].y + etat.dir.y };
  const mange = etat.pomme !== undefined && egal(tete, etat.pomme);
  // Sans pomme, la queue avance aussi : la tête peut prendre sa place.
  const reste = mange ? etat.corps : etat.corps.slice(0, -1);
  const dehors = tete.x < 0 || tete.y < 0 || tete.x >= etat.cols || tete.y >= etat.rows;
  if (dehors || reste.some((c) => egal(c, tete))) {
    etat.fini = true;
    return;
  }
  etat.corps = [tete, ...reste];
  if (mange) {
    etat.score++;
    etat.pomme = placerPomme(etat.cols, etat.rows, etat.corps, hasard);
    // Grille pleine : partie gagnée, elle s'arrête.
    if (!etat.pomme) etat.fini = true;
  }
}

// Règles du Snake de la page 404 (src/scripts/snake-logique.ts).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { avancer, diriger, DIRECTIONS, nouvellePartie } from '../src/scripts/snake-logique.ts';

const premiereCase = () => 0;

test('avance, mange et grandit', () => {
  const etat = nouvellePartie(10, 10, premiereCase);
  etat.pomme = { x: 6, y: 5 };
  avancer(etat, premiereCase);
  assert.deepEqual(etat.corps[0], { x: 6, y: 5 });
  assert.equal(etat.corps.length, 4);
  assert.equal(etat.score, 1);
  assert.ok(etat.pomme && !etat.corps.some((c) => c.x === etat.pomme.x && c.y === etat.pomme.y));
});

test('refuse le demi-tour, garde deux virages rapides', () => {
  const etat = nouvellePartie(10, 10, premiereCase);
  diriger(etat, DIRECTIONS.gauche);
  assert.equal(etat.file.length, 0);
  diriger(etat, DIRECTIONS.haut);
  diriger(etat, DIRECTIONS.gauche);
  assert.deepEqual(etat.file, [DIRECTIONS.haut, DIRECTIONS.gauche]);
});

test('perd contre un mur', () => {
  const etat = nouvellePartie(6, 6, premiereCase);
  etat.pomme = undefined;
  for (let i = 0; i < 3; i++) avancer(etat);
  assert.equal(etat.fini, true);
});

test('perd en se mordant, pas en suivant sa queue', () => {
  const etat = nouvellePartie(10, 10, premiereCase);
  etat.pomme = undefined;
  // Carré de 4 : la tête prend la place que la queue libère.
  etat.corps = [{ x: 5, y: 5 }, { x: 5, y: 6 }, { x: 4, y: 6 }, { x: 4, y: 5 }];
  etat.dir = DIRECTIONS.haut;
  diriger(etat, DIRECTIONS.gauche);
  avancer(etat);
  assert.equal(etat.fini, false);

  const morsure = nouvellePartie(10, 10, premiereCase);
  morsure.pomme = undefined;
  morsure.corps = [{ x: 5, y: 5 }, { x: 5, y: 6 }, { x: 4, y: 6 }, { x: 4, y: 5 }, { x: 4, y: 4 }];
  morsure.dir = DIRECTIONS.haut;
  diriger(morsure, DIRECTIONS.gauche);
  avancer(morsure);
  assert.equal(morsure.fini, true);
});

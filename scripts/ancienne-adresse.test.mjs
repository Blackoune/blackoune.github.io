// Redirection de l'ancienne adresse (src/scripts/ancienne-adresse.ts).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nouveauChemin } from '../src/scripts/ancienne-adresse.ts';

test('renvoie la même page à la racine', () => {
  assert.equal(nouveauChemin('/OBS-Dynamics/installation/'), '/installation/');
  assert.equal(nouveauChemin('/OBS-Dynamics'), '/');
  assert.equal(nouveauChemin('/installation/'), null);
  assert.equal(nouveauChemin('/OBS-Dynamics-autre/'), null);
});

test('ne renvoie jamais vers un autre site', () => {
  for (const chemin of ['/OBS-Dynamics//evil.com/', '/OBS-Dynamics///evil.com', '/OBS-Dynamics/\\evil.com', '/OBS-Dynamics/\\/evil.com']) {
    assert.match(nouveauChemin(chemin), /^\/(?![/\\])/, chemin);
  }
});

import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { publishedProjectHome } from '../../src/utils/projectDestination.ts';

test('retained Mechanistic cases resolve to their deployed portfolio home', () => {
  for (const slug of ['bazooka', 'room-director', 'wall-plates']) {
    assert.equal(publishedProjectHome(slug, 'mech'), 'main');
  }
});

test('other authored destinations remain intact', () => {
  assert.equal(publishedProjectHome('c24'), 'main');
  assert.equal(publishedProjectHome('other-mechanistic-case', 'mech'), 'mech');
  assert.equal(publishedProjectHome('personal-project', 'play'), 'play');
});

test('navigation and canonical metadata consume the same delivery decision', () => {
  for (const path of ['src/pages/about.astro', 'src/components/Seo/Seo.astro']) {
    assert.match(fs.readFileSync(new URL('../../' + path, import.meta.url), 'utf8'), /publishedProjectHome\(/);
  }
});

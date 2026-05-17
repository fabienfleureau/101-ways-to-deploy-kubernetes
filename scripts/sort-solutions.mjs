#!/usr/bin/env node
/**
 * Sorts data/solutions.yaml by category (ascending), then by name (ascending,
 * case-insensitive) within each category, and writes the result back in place.
 *
 * Usage: node scripts/sort-solutions.mjs
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { load, dump } from 'js-yaml';

const yamlPath = join(process.cwd(), 'data', 'solutions.yaml');

let data;
try {
  const raw = readFileSync(yamlPath, 'utf8');
  data = load(raw);
} catch (e) {
  console.error(`Failed to parse solutions.yaml: ${e.message}`);
  process.exit(1);
}

if (!data || !Array.isArray(data.solutions)) {
  console.error('solutions.yaml must have a top-level "solutions" array');
  process.exit(1);
}

data.solutions.sort((a, b) => {
  const catCmp = (a.category ?? '').localeCompare(b.category ?? '', 'en', { sensitivity: 'base' });
  if (catCmp !== 0) return catCmp;
  return (a.name ?? '').localeCompare(b.name ?? '', 'en', { sensitivity: 'base' });
});

const output = dump(data, {
  indent: 2,
  lineWidth: 120,
  noRefs: true,
  quotingType: "'",
  forceQuotes: false,
});

writeFileSync(yamlPath, output, 'utf8');
console.log(`Sorted ${data.solutions.length} solutions and wrote ${yamlPath}`);

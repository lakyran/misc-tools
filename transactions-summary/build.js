import { readFileSync, writeFileSync } from 'node:fs';

const core = readFileSync('core.mjs', 'utf8').replace(/^export /gm, '');
const ui = readFileSync('ui.js', 'utf8');

writeFileSync('app.js', `${core}\n${ui}`);
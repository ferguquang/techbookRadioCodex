#!/usr/bin/env node
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import {parseArgs} from './lib/voice.mjs';

const args = parseArgs(process.argv.slice(2));
const episode = String(args.episode ?? args.props ?? 'content/episode.sample.json');
const output = String(
  args.output ??
    `out/${path.basename(episode, path.extname(episode))}.mp4`,
);
const forwarded = [];

for (const key of ['provider', 'voice', 'speed', 'model', 'force']) {
  if (args[key] !== undefined) {
    forwarded.push(`--${key}=${args[key]}`);
  }
}

const prepare = spawnSync(
  process.execPath,
  ['scripts/prepare-episode-audio.mjs', `--episode=${episode}`, ...forwarded],
  {stdio: 'inherit'},
);

if (prepare.status !== 0) {
  process.exit(prepare.status ?? 1);
}

const render = spawnSync(
  'npx',
  [
    'remotion',
    'render',
    'src/index.ts',
    'TechbookShorts',
    output,
    `--props=${episode}`,
  ],
  {
    shell: process.platform === 'win32',
    stdio: 'inherit',
  },
);

process.exit(render.status ?? 1);

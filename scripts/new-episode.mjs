import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const title = process.argv.slice(2).join(' ').trim() || 'Bản tin công nghệ mới';
const date = new Date().toISOString().slice(0, 10);
const slug = title
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '')
  .slice(0, 70);
const contentDir = path.join(root, 'content');
const samplePath = path.join(contentDir, 'episode.sample.json');

if (!existsSync(contentDir)) {
  mkdirSync(contentDir, {recursive: true});
}

const episode = JSON.parse(readFileSync(samplePath, 'utf8'));
episode.meta.title = title;
episode.meta.date = date;
episode.meta.episodeNo = Number(episode.meta.episodeNo ?? 0) + 1;

const outputPath = path.join(contentDir, `${date}-${slug || 'episode'}.json`);
writeFileSync(outputPath, `${JSON.stringify(episode, null, 2)}\n`);

console.log(outputPath);

#!/usr/bin/env node
import path from 'node:path';
import {
  DEFAULT_ELEVENLABS_VOICE_ID,
  DEFAULT_FPTAI_VOICE,
  DEMO_TEXT,
  episodeToVoiceScript,
  generateVoice,
  loadLocalEnv,
  parseArgs,
  readEpisode,
  resolvePath,
} from './lib/voice.mjs';

loadLocalEnv();

const args = parseArgs(process.argv.slice(2));
const provider = String(args.provider ?? 'fptai');

if (!['fptai', 'elevenlabs'].includes(provider)) {
  console.error('Usage: npm run voice -- --provider=fptai|elevenlabs --voice=banmai --text="..." --out=public/audio/demo.mp3');
  process.exit(1);
}

const text = args.text
  ? String(args.text)
  : args.episode
    ? episodeToVoiceScript(readEpisode(String(args.episode)).episode)
    : DEMO_TEXT;
const defaultOutput =
  provider === 'fptai'
    ? 'public/audio/demo-fptai.mp3'
    : 'public/audio/demo-elevenlabs.mp3';
const outputPath = resolvePath(String(args.out ?? defaultOutput));
const voice =
  args.voice ??
  (provider === 'fptai'
    ? process.env.FPTAI_VOICE ?? DEFAULT_FPTAI_VOICE
    : process.env.ELEVENLABS_VOICE_ID ?? DEFAULT_ELEVENLABS_VOICE_ID);

try {
  const result = await generateVoice({
    provider,
    text,
    outputPath,
    voice: String(voice),
    speed: args.speed,
    model: args.model,
  });

  console.log(`Generated ${result.provider} voice: ${path.relative(process.cwd(), result.file)}`);
} catch (error) {
  console.error(`Voice generation failed: ${error.message}`);
  process.exit(1);
}

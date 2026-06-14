#!/usr/bin/env node
import path from 'node:path';
import {
  DEFAULT_ELEVENLABS_VOICE_ID,
  DEFAULT_ELEVENLABS_VOICE_NAME,
  DEMO_TEXT,
  FPTAI_VOICES,
  generateVoice,
  loadLocalEnv,
  parseArgs,
  resolvePath,
} from './lib/voice.mjs';

loadLocalEnv();

const args = parseArgs(process.argv.slice(2));
const providerArg = String(args.provider ?? 'fptai');
const providers = providerArg === 'all' ? ['fptai', 'elevenlabs'] : [providerArg];
let generatedCount = 0;

if (!providers.every((provider) => ['fptai', 'elevenlabs'].includes(provider))) {
  console.error('Supported providers: fptai, elevenlabs');
  process.exit(1);
}

const demoText = String(args.text ?? DEMO_TEXT);

console.log('Demo text:');
console.log(demoText);
console.log('');

for (const provider of providers) {
  const voices =
    provider === 'fptai'
      ? args.voice
        ? [{id: String(args.voice), label: 'custom'}]
        : FPTAI_VOICES
      : [
          {
            id: process.env.ELEVENLABS_VOICE_ID ?? DEFAULT_ELEVENLABS_VOICE_ID,
            label: DEFAULT_ELEVENLABS_VOICE_NAME,
          },
        ];

  for (const voice of voices) {
    const outputPath = resolvePath(
      provider === 'fptai'
        ? `public/audio/demo-fptai-${voice.id}.mp3`
        : `public/audio/demo-elevenlabs.mp3`,
    );

    try {
      await generateVoice({
        provider,
        text: demoText,
        outputPath,
        voice: voice.id,
        speed: args.speed,
        model: args.model,
      });
      generatedCount += 1;

      console.log(`Generated ${provider} demo with ${voice.id} (${voice.label}): ${path.relative(process.cwd(), outputPath)}`);
    } catch (error) {
      console.error(`Skipped ${provider} ${voice.id}: ${error.message}`);
    }
  }
}

if (generatedCount === 0) {
  console.error('');
  console.error('No demo audio was generated. Add FPTAI_API_KEY or ELEVENLABS_API_KEY to .env first.');
  process.exit(1);
}

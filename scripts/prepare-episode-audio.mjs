#!/usr/bin/env node
import {existsSync} from 'node:fs';
import path from 'node:path';
import readline from 'node:readline/promises';
import {stdin as input, stdout as output} from 'node:process';
import {
  DEFAULT_ELEVENLABS_VOICE_ID,
  DEFAULT_ELEVENLABS_VOICE_NAME,
  DEFAULT_FPTAI_VOICE,
  FPTAI_VOICES,
  episodeToVoiceScript,
  generateVoice,
  loadLocalEnv,
  parseArgs,
  publicAudioPath,
  readEpisode,
  resolvePath,
  writeEpisodeVoiceover,
} from './lib/voice.mjs';

loadLocalEnv();

const args = parseArgs(process.argv.slice(2));
const episodeArg = String(args.episode ?? args.props ?? 'content/episode.sample.json');
const {absolutePath: episodePath, episode} = readEpisode(episodeArg);
const root = process.cwd();
const existingVoiceover = episode.voiceover?.file
  ? resolvePath(path.join('public', episode.voiceover.file), root)
  : null;

const ask = async (question, defaultValue = '') => {
  const rl = readline.createInterface({input, output});
  const suffix = defaultValue ? ` (${defaultValue})` : '';
  const answer = await rl.question(`${question}${suffix}: `);
  rl.close();

  return answer.trim() || defaultValue;
};

const chooseProvider = async () => {
  if (args.provider) {
    return String(args.provider);
  }

  console.log('Chọn voice trước khi render video:');
  console.log('1. FPT.AI - giọng Việt native, khuyến nghị');
  console.log('2. ElevenLabs - thử nghiệm/multilingual');
  console.log('3. Bỏ qua voice lần này');

  const answer = await ask('Nhập lựa chọn', '1');

  if (answer === '1' || answer.toLowerCase() === 'fptai' || answer.toLowerCase() === 'fpt') {
    return 'fptai';
  }

  if (answer === '2' || answer.toLowerCase() === 'elevenlabs') {
    return 'elevenlabs';
  }

  return 'skip';
};

if (existingVoiceover && existsSync(existingVoiceover) && !args.force) {
  const answer = await ask(
    `Episode đã có voice ${episode.voiceover.file}. Dùng lại file này? y/n`,
    'y',
  );

  if (answer.toLowerCase().startsWith('y')) {
    console.log(`Keeping existing voiceover: ${episode.voiceover.file}`);
    process.exit(0);
  }
}

const provider = await chooseProvider();

if (provider === 'skip') {
  console.log('Skipping voice generation.');
  process.exit(0);
}

if (!['fptai', 'elevenlabs'].includes(provider)) {
  throw new Error(`Unsupported provider: ${provider}`);
}

const episodeBase = path.basename(episodePath, path.extname(episodePath));
const defaultOutput = `public/audio/${episodeBase}-${provider}-voice.mp3`;
const outputPath = resolvePath(String(args.out ?? defaultOutput));
const defaultVoice =
  provider === 'fptai'
    ? process.env.FPTAI_VOICE ?? DEFAULT_FPTAI_VOICE
    : process.env.ELEVENLABS_VOICE_ID ?? DEFAULT_ELEVENLABS_VOICE_ID;
const voiceLabel =
  provider === 'fptai'
    ? `${defaultVoice} - ${FPTAI_VOICES.find((item) => item.id === defaultVoice)?.label ?? 'FPT.AI'}`
    : `${DEFAULT_ELEVENLABS_VOICE_NAME} (${defaultVoice})`;

if (provider === 'fptai') {
  console.log(
    `Giọng FPT.AI: ${FPTAI_VOICES.map((item) => `${item.id} (${item.label})`).join(', ')}`,
  );
}

const voice = args.voice
  ? String(args.voice)
  : await ask(`Voice ID/name cho ${provider} - mặc định ${voiceLabel}`, defaultVoice);
const script = args.text ? String(args.text) : episodeToVoiceScript(episode);

try {
  const result = await generateVoice({
    provider,
    text: script,
    outputPath,
    voice,
    speed: args.speed,
    model: args.model,
  });
  const publicFile = publicAudioPath(outputPath);

  writeEpisodeVoiceover({
    episode,
    episodePath,
    publicFile,
    provider: result.provider,
    voice: result.voice,
  });

  console.log(`Generated voiceover: ${publicFile}`);
  console.log(`Updated episode: ${path.relative(root, episodePath)}`);
} catch (error) {
  console.error(`Voice generation failed: ${error.message}`);
  process.exit(1);
}

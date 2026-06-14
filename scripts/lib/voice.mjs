import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import path from 'node:path';

export const DEMO_TEXT =
  'Xin chào, đây là techbookradio. Trong một phút tới, chúng ta sẽ nghe nhanh ba tín hiệu công nghệ đáng chú ý: AI agent, sách công nghệ, và các hot trend đang thay đổi cách làm việc.';

export const DEFAULT_ELEVENLABS_VOICE_ID = 'SAz9YHcvj6GT2YYXdXww';
export const DEFAULT_ELEVENLABS_VOICE_NAME =
  'River - Relaxed, Neutral, Informative';
export const DEFAULT_FPTAI_VOICE = 'banmai';
export const DEFAULT_FPTAI_TTS_URL = 'https://api.fpt.ai/hmi/tts/v5';
export const FPTAI_VOICES = [
  {id: 'banmai', label: 'nữ miền Bắc'},
  {id: 'lannhi', label: 'nữ miền Nam'},
  {id: 'leminh', label: 'nam miền Bắc'},
  {id: 'myan', label: 'nữ miền Trung'},
  {id: 'thuminh', label: 'nữ miền Bắc'},
  {id: 'giahuy', label: 'nam miền Trung'},
  {id: 'linhsan', label: 'nữ miền Nam'},
];

const FPTAI_PRONUNCIATION_RULES = [
  [/\btechbookradio\b/gi, 'Téc búc ra đi ô'],
  [/\bTechbook\b/g, 'Téc búc'],
  [/\bAudio\b/g, 'O đi ô'],
  [/\bOpenAI\b/g, 'Ô pần ây ai'],
  [/\bA\.I\./g, 'ây ai'],
  [/\bAI\b/g, 'ây ai'],
  [/\bAPI\b/g, 'ây pi ai'],
  [/\bGPU\b/g, 'gi pi yu'],
  [/\bMCP\b/g, 'em si pi'],
  [/\bRAG\b/g, 'rắc'],
  [/\bpromp?t(?:s)?\b/gi, 'pờ rom'],
  [/\bcontext\b/gi, 'con tếch'],
  [/\bengineering\b/gi, 'en gi niê ring'],
  [/\bagent(?:s)?\b/gi, 'ây giần'],
  [/\bworkflow(?:s)?\b/gi, 'quớc phờ lâu'],
  [/\bmodel(?:s)?\b/gi, 'mô hình'],
  [/\btool(?:s)?\b/gi, 'công cụ'],
  [/\bcloud\b/gi, 'cờ lao'],
  [/\bdevtools\b/gi, 'dev tun'],
  [/\bstartup(?:s)?\b/gi, 'start up'],
];

export const normalizeFptAiPronunciation = (text) => {
  if (process.env.FPTAI_NORMALIZE_PRONUNCIATION === 'false') {
    return text;
  }

  return FPTAI_PRONUNCIATION_RULES.reduce(
    (normalized, [pattern, replacement]) =>
      normalized.replace(pattern, replacement),
    text,
  );
};

export const loadLocalEnv = (root = process.cwd()) => {
  for (const filename of ['.env', '.env.local']) {
    const filePath = path.join(root, filename);

    if (!existsSync(filePath)) {
      continue;
    }

    for (const line of readFileSync(filePath, 'utf8').split(/\r?\n/)) {
      const trimmed = line.trim();

      if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) {
        continue;
      }

      const [rawKey, ...rawValue] = trimmed.split('=');
      const key = rawKey.trim();
      const value = rawValue.join('=').trim().replace(/^['"]|['"]$/g, '');

      if (key && process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  }
};

export const parseArgs = (argv) => {
  const parsed = {
    _: [],
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (!arg.startsWith('--')) {
      parsed._.push(arg);
      continue;
    }

    const [key, inlineValue] = arg.slice(2).split('=');

    if (inlineValue !== undefined) {
      parsed[key] = inlineValue;
      continue;
    }

    const next = argv[index + 1];

    if (next && !next.startsWith('--')) {
      parsed[key] = next;
      index += 1;
    } else {
      parsed[key] = true;
    }
  }

  return parsed;
};

export const resolvePath = (filePath, root = process.cwd()) =>
  path.isAbsolute(filePath) ? filePath : path.join(root, filePath);

export const ensureParentDir = (filePath) => {
  mkdirSync(path.dirname(filePath), {recursive: true});
};

export const publicAudioPath = (absoluteFilePath, root = process.cwd()) => {
  const publicRoot = path.join(root, 'public');
  const relative = path.relative(publicRoot, absoluteFilePath);

  if (relative.startsWith('..')) {
    throw new Error(`Voice output must be inside public/: ${absoluteFilePath}`);
  }

  return relative.split(path.sep).join('/');
};

export const readEpisode = (episodePath, root = process.cwd()) => {
  const absolutePath = resolvePath(episodePath, root);
  const episode = JSON.parse(readFileSync(absolutePath, 'utf8'));

  return {
    absolutePath,
    episode,
  };
};

export const episodeToVoiceScript = (episode) => {
  const lines = [
    episode.meta?.brand,
    episode.meta?.title,
    episode.meta?.subtitle,
    ...(episode.scenes ?? []).flatMap((scene) => [
      scene.headline,
      ...(scene.bullets ?? []),
    ]),
    episode.cta?.primary,
  ];

  return lines
    .filter(Boolean)
    .map((line) => String(line).trim())
    .filter(Boolean)
    .join('\n');
};

export const writeEpisodeVoiceover = ({
  episode,
  episodePath,
  publicFile,
  provider,
  voice,
}) => {
  const nextEpisode = {
    ...episode,
    voiceover: {
      ...(episode.voiceover ?? {}),
      file: publicFile,
      volume: episode.voiceover?.volume ?? 1,
      provider,
      voice,
    },
  };

  writeFileSync(episodePath, `${JSON.stringify(nextEpisode, null, 2)}\n`);
};

const getErrorText = async (response) => {
  const buffer = Buffer.from(await response.arrayBuffer());
  const body = buffer.toString('utf8').slice(0, 1200);

  return `${response.status} ${response.statusText}: ${body}`;
};

const writeAudioResponse = async (response, outputPath) => {
  if (!response.ok) {
    throw new Error(await getErrorText(response));
  }

  const contentType = response.headers.get('content-type') ?? '';
  const buffer = Buffer.from(await response.arrayBuffer());

  if (contentType.includes('application/json')) {
    const jsonText = buffer.toString('utf8');
    const data = JSON.parse(jsonText);
    const audioUrl = data.url ?? data.data?.url ?? data.result?.url;
    const audioBase64 =
      data.audio ?? data.data?.audio ?? data.result?.audio ?? data.base64;

    if (audioUrl) {
      const audioResponse = await fetch(audioUrl);
      return writeAudioResponse(audioResponse, outputPath);
    }

    if (audioBase64) {
      ensureParentDir(outputPath);
      writeFileSync(outputPath, Buffer.from(audioBase64, 'base64'));
      return;
    }

    throw new Error(`Provider returned JSON without audio payload: ${jsonText}`);
  }

  ensureParentDir(outputPath);
  writeFileSync(outputPath, buffer);
};

export const generateElevenLabsVoice = async ({
  text,
  outputPath,
  voice,
  model,
}) => {
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!apiKey) {
    throw new Error('Missing ELEVENLABS_API_KEY in .env');
  }

  const voiceId = voice ?? process.env.ELEVENLABS_VOICE_ID ?? DEFAULT_ELEVENLABS_VOICE_ID;
  const modelId = model ?? process.env.ELEVENLABS_MODEL_ID ?? 'eleven_multilingual_v2';
  const outputFormat = process.env.ELEVENLABS_OUTPUT_FORMAT ?? 'mp3_44100_128';
  const url = new URL(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
  );
  url.searchParams.set('output_format', outputFormat);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': apiKey,
    },
    body: JSON.stringify({
      text,
      model_id: modelId,
      voice_settings: {
        stability: 0.42,
        similarity_boost: 0.82,
        style: 0,
        use_speaker_boost: true,
      },
    }),
  });

  await writeAudioResponse(response, outputPath);

  return {
    provider: 'elevenlabs',
    voice: voiceId,
    file: outputPath,
  };
};

const wait = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

export const generateFptAiVoice = async ({
  text,
  outputPath,
  voice,
  speed,
}) => {
  const apiKey = process.env.FPTAI_API_KEY ?? process.env.FPT_API_KEY;

  if (!apiKey) {
    throw new Error('Missing FPTAI_API_KEY in .env');
  }

  const voiceName = voice ?? process.env.FPTAI_VOICE ?? DEFAULT_FPTAI_VOICE;
  const spokenText = normalizeFptAiPronunciation(text);
  const response = await fetch(
    process.env.FPTAI_TTS_URL ?? DEFAULT_FPTAI_TTS_URL,
    {
      method: 'POST',
      headers: {
        api_key: apiKey,
        voice: voiceName,
        speed: String(speed ?? process.env.FPTAI_SPEED ?? 0),
        format: process.env.FPTAI_FORMAT ?? 'mp3',
        'Content-Type': 'text/plain; charset=utf-8',
      },
      body: spokenText,
    },
  );

  if (!response.ok) {
    throw new Error(await getErrorText(response));
  }

  const payload = await response.json();

  if (payload.error !== undefined && Number(payload.error) !== 0) {
    throw new Error(`FPT.AI failed: ${payload.message ?? JSON.stringify(payload)}`);
  }

  if (payload.success !== undefined && payload.success !== true && payload.success !== 'true') {
    throw new Error(`FPT.AI failed: ${payload.message ?? JSON.stringify(payload)}`);
  }

  const audioUrl =
    payload.async ??
    payload.message ??
    payload.url ??
    payload.data?.url ??
    payload.result?.url;

  if (!audioUrl || !String(audioUrl).startsWith('http')) {
    throw new Error(`FPT.AI did not return an audio URL: ${JSON.stringify(payload)}`);
  }

  let lastError = 'audio not ready';

  for (let attempt = 0; attempt < 24; attempt += 1) {
    await wait(attempt === 0 ? 5000 : 5000);

    try {
      const audioResponse = await fetch(audioUrl);

      if (audioResponse.ok) {
        await writeAudioResponse(audioResponse, outputPath);

        return {
          provider: 'fptai',
          voice: voiceName,
          file: outputPath,
        };
      }

      lastError = await getErrorText(audioResponse);
    } catch (error) {
      lastError = error.message;
    }
  }

  throw new Error(`FPT.AI audio was not ready after polling: ${lastError}`);
};

export const generateVoice = async ({provider, ...options}) => {
  if (provider === 'fptai') {
    return generateFptAiVoice(options);
  }

  if (provider === 'elevenlabs') {
    return generateElevenLabsVoice(options);
  }

  throw new Error(`Unsupported voice provider: ${provider}`);
};

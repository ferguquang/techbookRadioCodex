export type SceneTone = 'cyan' | 'amber' | 'rose' | 'green' | 'violet';

export type EpisodeScene = {
  id?: string;
  type?: 'hook' | 'news' | 'ai' | 'book' | 'trend' | 'outro';
  kicker: string;
  headline: string;
  bullets?: string[];
  source?: string;
  durationSec?: number;
  accent?: SceneTone;
};

export type EpisodeAudio = {
  file?: string;
  volume?: number;
  startFromSec?: number;
  loop?: boolean;
  playbackRate?: number;
  credit?: string;
};

export type EpisodeProps = {
  meta: {
    brand: string;
    handle: string;
    title: string;
    subtitle?: string;
    date?: string;
    episodeNo?: number;
    language?: string;
  };
  voiceover?: EpisodeAudio;
  music?: EpisodeAudio;
  scenes: EpisodeScene[];
  cta?: {
    primary: string;
    secondary?: string;
  };
};

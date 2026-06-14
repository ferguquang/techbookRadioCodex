import type {EpisodeProps, EpisodeScene} from './types';

export const FPS = 30;
export const DEFAULT_SCENE_DURATION_SEC = 7;
export const MIN_SCENE_DURATION_SEC = 4;

export const getSceneDurationInFrames = (
  scene: EpisodeScene,
  fps = FPS,
): number => {
  const durationSec = Math.max(
    MIN_SCENE_DURATION_SEC,
    scene.durationSec ?? DEFAULT_SCENE_DURATION_SEC,
  );

  return Math.round(durationSec * fps);
};

export const getEpisodeDurationInFrames = (
  episode: EpisodeProps,
  fps = FPS,
): number => {
  const total = episode.scenes.reduce(
    (sum, scene) => sum + getSceneDurationInFrames(scene, fps),
    0,
  );

  return Math.max(total, fps * 10);
};

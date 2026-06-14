import {defaultEpisode} from './data/defaultEpisode';
import type {EpisodeProps, EpisodeScene} from './types';

const normalizeScene = (
  scene: Partial<EpisodeScene>,
  index: number,
): EpisodeScene => ({
  id: scene.id ?? `scene-${index + 1}`,
  type: scene.type ?? 'news',
  kicker: scene.kicker ?? 'TECHBOOK',
  headline: scene.headline ?? 'Tiêu đề đang được cập nhật',
  bullets: scene.bullets ?? [],
  source: scene.source ?? '',
  durationSec: scene.durationSec ?? 7,
  accent: scene.accent ?? defaultEpisode.scenes[index % defaultEpisode.scenes.length].accent,
});

export const normalizeEpisode = (
  props: Partial<EpisodeProps> | undefined,
): EpisodeProps => {
  const scenes =
    props?.scenes && props.scenes.length > 0
      ? props.scenes.map(normalizeScene)
      : defaultEpisode.scenes;
  const defaultCta = defaultEpisode.cta ?? {
    primary: 'Follow để nghe bản tin tiếp theo',
  };
  const cta = {
    primary: props?.cta?.primary ?? defaultCta.primary,
    secondary: props?.cta?.secondary ?? defaultCta.secondary,
  };

  return {
    ...defaultEpisode,
    ...props,
    meta: {
      ...defaultEpisode.meta,
      ...props?.meta,
    },
    music: {
      ...defaultEpisode.music,
      ...props?.music,
    },
    voiceover: {
      ...defaultEpisode.voiceover,
      ...props?.voiceover,
    },
    scenes,
    cta,
  };
};

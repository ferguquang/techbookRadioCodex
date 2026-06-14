import {Composition} from 'remotion';
import {defaultEpisode} from './data/defaultEpisode';
import {normalizeEpisode} from './normalizeEpisode';
import {TechbookShorts} from './TechbookShorts';
import {FPS, getEpisodeDurationInFrames} from './timeline';
import type {EpisodeProps} from './types';

export const RemotionRoot = () => {
  return (
    <Composition
      id="TechbookShorts"
      component={TechbookShorts}
      durationInFrames={getEpisodeDurationInFrames(defaultEpisode)}
      fps={FPS}
      width={1080}
      height={1920}
      defaultProps={defaultEpisode}
      calculateMetadata={({props}) => {
        const episode = normalizeEpisode(props as Partial<EpisodeProps>);

        return {
          durationInFrames: getEpisodeDurationInFrames(episode),
        };
      }}
    />
  );
};

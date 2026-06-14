import {
  AbsoluteFill,
  Audio,
  Series,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {normalizeEpisode} from './normalizeEpisode';
import {getSceneDurationInFrames} from './timeline';
import type {EpisodeAudio, EpisodeProps, EpisodeScene, SceneTone} from './types';

const accentMap: Record<SceneTone, {solid: string; soft: string; glow: string}> = {
  cyan: {
    solid: '#35d7ff',
    soft: 'rgba(53, 215, 255, 0.14)',
    glow: 'rgba(53, 215, 255, 0.42)',
  },
  amber: {
    solid: '#f9b13d',
    soft: 'rgba(249, 177, 61, 0.14)',
    glow: 'rgba(249, 177, 61, 0.38)',
  },
  rose: {
    solid: '#ff5f8f',
    soft: 'rgba(255, 95, 143, 0.14)',
    glow: 'rgba(255, 95, 143, 0.36)',
  },
  green: {
    solid: '#47e39b',
    soft: 'rgba(71, 227, 155, 0.14)',
    glow: 'rgba(71, 227, 155, 0.36)',
  },
  violet: {
    solid: '#a78bfa',
    soft: 'rgba(167, 139, 250, 0.14)',
    glow: 'rgba(167, 139, 250, 0.36)',
  },
};

const textClassForLength = (text: string): string => {
  if (text.length > 88) {
    return 'headline headline--compact';
  }

  if (text.length > 62) {
    return 'headline headline--medium';
  }

  return 'headline';
};

const AudioTrack = ({
  audio,
  defaultLoop,
}: {
  audio?: EpisodeAudio;
  defaultLoop?: boolean;
}) => {
  const {fps} = useVideoConfig();

  if (!audio?.file) {
    return null;
  }

  return (
    <Audio
      src={staticFile(audio.file)}
      startFrom={Math.round((audio.startFromSec ?? 0) * fps)}
      volume={audio.volume ?? 1}
      loop={audio.loop ?? defaultLoop}
      playbackRate={audio.playbackRate ?? 1}
    />
  );
};

const AnimatedBackdrop = ({accent}: {accent: SceneTone}) => {
  const frame = useCurrentFrame();
  const palette = accentMap[accent];
  const drift = interpolate(frame % 360, [0, 360], [0, -120]);

  return (
    <AbsoluteFill className="backdrop">
      <div className="scan-grid" style={{transform: `translateY(${drift}px)`}} />
      <div className="slab slab--one" style={{borderColor: palette.solid}} />
      <div className="slab slab--two" />
      <div className="ticker ticker--top">
        AI / BOOKS / STARTUPS / DEVTOOLS / PRODUCT / SECURITY / CLOUD / CHIP
      </div>
      <div className="ticker ticker--bottom">
        TECHBOOKRADIO / NGHE NHANH / HIỂU SÂU / LƯU Ý TIN ĐÃ KIỂM CHỨNG
      </div>
    </AbsoluteFill>
  );
};

const Waveform = ({accent}: {accent: SceneTone}) => {
  const frame = useCurrentFrame();
  const palette = accentMap[accent];
  const bars = Array.from({length: 36}, (_, index) => {
    const height = 26 + Math.abs(Math.sin((frame + index * 9) / 10)) * 74;

    return (
      <span
        className="waveform__bar"
        key={index}
        style={{
          height,
          backgroundColor: index % 5 === 0 ? palette.solid : 'rgba(255,255,255,0.42)',
          boxShadow: index % 5 === 0 ? `0 0 28px ${palette.glow}` : undefined,
        }}
      />
    );
  });

  return <div className="waveform">{bars}</div>;
};

const ProgressRail = ({
  episode,
  accent,
}: {
  episode: EpisodeProps;
  accent: SceneTone;
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const palette = accentMap[accent];
  const progress = Math.min(1, frame / Math.max(1, durationInFrames - 1));

  return (
    <div className="progress">
      <div className="progress__track">
        <div
          className="progress__fill"
          style={{
            width: `${progress * 100}%`,
            backgroundColor: palette.solid,
            boxShadow: `0 0 26px ${palette.glow}`,
          }}
        />
      </div>
      <div className="progress__meta">
        <span>{episode.meta.title}</span>
      </div>
    </div>
  );
};

const Chrome = ({
  episode,
  accent,
}: {
  episode: EpisodeProps;
  accent: SceneTone;
}) => {
  const palette = accentMap[accent];

  return (
    <AbsoluteFill className="chrome">
      <div className="brand-row">
        <div className="brand-lockup">
          <div
            className="brand-mark"
            style={{
              borderColor: palette.solid,
              boxShadow: `0 0 28px ${palette.glow}`,
            }}
          >
            TB
          </div>
          <div>
            <div className="brand-name">{episode.meta.brand}</div>
            <div className="brand-handle">{episode.meta.handle}</div>
          </div>
        </div>
      </div>
      <ProgressRail episode={episode} accent={accent} />
    </AbsoluteFill>
  );
};

const BulletList = ({
  bullets,
  accent,
}: {
  bullets: string[];
  accent: SceneTone;
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const palette = accentMap[accent];

  return (
    <div className="bullets">
      {bullets.slice(0, 4).map((bullet, index) => {
        const start = fps * 0.45 + index * fps * 0.55;
        const reveal = spring({
          frame: frame - start,
          fps,
          config: {
            damping: 18,
            stiffness: 120,
            mass: 0.7,
          },
        });

        return (
          <div
            className="bullet"
            key={bullet}
            style={{
              opacity: reveal,
              transform: `translateY(${interpolate(reveal, [0, 1], [24, 0])}px)`,
              borderColor: palette.soft,
            }}
          >
            <span className="bullet__dot" style={{backgroundColor: palette.solid}} />
            <span>{bullet}</span>
          </div>
        );
      })}
    </div>
  );
};

const Scene = ({
  scene,
  index,
  total,
  episode,
}: {
  scene: EpisodeScene;
  index: number;
  total: number;
  episode: EpisodeProps;
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const accent = scene.accent ?? 'cyan';
  const palette = accentMap[accent];
  const enter = spring({
    frame,
    fps,
    config: {
      damping: 22,
      stiffness: 90,
      mass: 0.8,
    },
  });
  const isOutro = scene.type === 'outro';
  const isHook = scene.type === 'hook' || index === 0;

  return (
    <AbsoluteFill className={`scene scene--${scene.type ?? 'news'}`}>
      <div
        className="scene__content"
        style={{
          transform: `translateY(${interpolate(enter, [0, 1], [72, 0])}px)`,
          opacity: enter,
        }}
      >
        <div className="kicker-row">
          <span
            className="kicker"
            style={{
              color: palette.solid,
              borderColor: palette.soft,
              backgroundColor: palette.soft,
            }}
          >
            {scene.kicker}
          </span>
          <span className="scene-count">
            {index + 1}/{total}
          </span>
        </div>
        <h1 className={textClassForLength(scene.headline)}>{scene.headline}</h1>
        {scene.bullets && scene.bullets.length > 0 ? (
          <BulletList bullets={scene.bullets} accent={accent} />
        ) : null}
      </div>

      <div
        className="source-strip"
        style={{
          borderColor: palette.soft,
          backgroundColor: isOutro ? palette.soft : undefined,
        }}
      >
        <span>{isOutro ? episode.cta?.primary : scene.source}</span>
      </div>

      <div className="visual-panel" style={{borderColor: palette.soft}}>
        <div className="visual-panel__label">{isHook ? 'LIVE SIGNAL' : scene.type?.toUpperCase()}</div>
        <Waveform accent={accent} />
        <div className="visual-panel__readout">
          <span>{episode.meta.handle}</span>
        </div>
      </div>

      {isOutro && episode.cta?.secondary ? (
        <div className="outro-note" style={{borderColor: palette.soft}}>
          {episode.cta.secondary}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

export const TechbookShorts = (props: Partial<EpisodeProps>) => {
  const episode = normalizeEpisode(props);
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const activeAccent =
    episode.scenes.find((_, index) => {
      const end = episode.scenes
        .slice(0, index + 1)
        .reduce((sum, scene) => sum + getSceneDurationInFrames(scene, fps), 0);

      return frame < end;
    })?.accent ?? episode.scenes[0]?.accent ?? 'cyan';

  return (
    <AbsoluteFill className="video-root">
      <AudioTrack audio={episode.music} defaultLoop />
      <AudioTrack audio={episode.voiceover} />
      <AnimatedBackdrop accent={activeAccent} />
      <Series>
        {episode.scenes.map((scene, index) => (
          <Series.Sequence
            durationInFrames={getSceneDurationInFrames(scene, fps)}
            key={scene.id ?? index}
          >
            <Scene scene={scene} index={index} total={episode.scenes.length} episode={episode} />
          </Series.Sequence>
        ))}
      </Series>
      <Chrome episode={episode} accent={activeAccent} />
    </AbsoluteFill>
  );
};

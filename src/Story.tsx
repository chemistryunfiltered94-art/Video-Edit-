import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {FPS, GCtx, useG, prog} from './lib';
import {Caption} from './ui';
import {Scene1, Scene2, Scene3} from './Scenes1';
import {Scene4, Scene5, Scene6} from './Scenes2';

const SCENES: [number, number, React.FC][] = [
  [0, 17.3, Scene1], [17.3, 37.7, Scene2], [37.7, 54.5, Scene3],
  [54.5, 83.35, Scene4], [83.35, 117.0, Scene5], [117.0, 128.45, Scene6],
];

// soft cross-fade: next scene starts 0.3s early and fades in over the previous one
const Fade: React.FC<{a: number; children: React.ReactNode}> = ({a, children}) => {
  const g = useG();
  return <AbsoluteFill style={{opacity: a === 0 ? 1 : prog(g, a - 0.3, a)}}>{children}</AbsoluteFill>;
};

export const Story: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <Audio src={staticFile('voice.mp3')} />
    {SCENES.map(([a, b, C], i) => {
      const from = Math.round((a === 0 ? 0 : a - 0.3) * FPS);
      const end = Math.round(b * FPS);
      return (
        <Sequence key={i} from={from} durationInFrames={end - from}>
          <GCtx.Provider value={from / FPS}>
            <Fade a={a}><C /></Fade>
          </GCtx.Provider>
        </Sequence>
      );
    })}
    <Caption />
  </AbsoluteFill>
);

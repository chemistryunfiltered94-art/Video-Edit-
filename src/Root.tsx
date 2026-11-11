import React from 'react';
import {Composition} from 'remotion';
import {Story} from './Story';
import {FPS, W, H, TOTAL_SEC} from './lib';

export const Root: React.FC = () => (
  <Composition
    id="Story"
    component={Story}
    durationInFrames={Math.ceil(TOTAL_SEC * FPS)}
    fps={FPS}
    width={W}
    height={H}
  />
);

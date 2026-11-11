import React from 'react';
import {useCurrentFrame} from 'remotion';

export const FPS = 30;
export const W = 1080;
export const H = 1920;
export const TOTAL_SEC = 128.444063;

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
export const prog = (g: number, a: number, b: number) => clamp01((g - a) / (b - a));
export const eo = (t: number) => 1 - Math.pow(1 - t, 3);
export const eio = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// back-ease pop: 0 -> overshoot -> 1
export const pop = (g: number, a: number, d = 0.45) => {
  if (g < a) return 0;
  const t = clamp01((g - a) / d);
  const c1 = 1.70158, c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};
// pop in at a, shrink out at b
export const popOut = (g: number, a: number, b: number, d = 0.45) =>
  g < a ? 0 : pop(g, a, d) * (1 - eo(prog(g, b, b + 0.25)));

// global time (seconds) inside a Sequence
export const GCtx = React.createContext(0);
export const useG = () => {
  const f = useCurrentFrame();
  const t0 = React.useContext(GCtx);
  return t0 + f / FPS;
};

const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
export const mix = (a: string, b: string, t: number) => {
  const A = p(a), B = p(b), k = clamp01(t);
  return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * k)).join(',')})`;
};

// keyframes: [[t, v1, v2, ...], ...] -> interpolated values (sine ease)
export const kf = (g: number, keys: number[][]) => {
  if (g <= keys[0][0]) return keys[0].slice(1);
  const last = keys[keys.length - 1];
  if (g >= last[0]) return last.slice(1);
  let i = 0;
  while (g > keys[i + 1][0]) i++;
  const a = keys[i], b = keys[i + 1];
  const t = 0.5 - Math.cos(Math.PI * ((g - a[0]) / (b[0] - a[0]))) / 2;
  return a.slice(1).map((v, k) => v + (b[k + 1] - v) * t);
};

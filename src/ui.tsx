import React from 'react';
import {loadFont} from '@remotion/google-fonts/HindSiliguri';
import {useG, W, pop, popOut, prog, eo, kf} from './lib';
import {BUSY, CHUNKS} from './data';
import {Easing, interpolate} from 'remotion';

const {fontFamily} = loadFont('normal', {weights: ['500', '600', '700'], subsets: ['bengali', 'latin']});
export const FONT = `${fontFamily}, sans-serif`;
const O = '#222222';

/* ---------- Speech callout bubble (tail points down to speaker) ---------- */
export const Bubble: React.FC<{
  a: number; b: number; x: number; by: number; w: number; tx: number; ty?: number; text: string; fs?: number;
}> = ({a, b, x, by, w, tx, ty = 560, text, fs = 50}) => {
  const g = useG();
  const s = popOut(g, a, b, 0.35);
  if (s <= 0.001) return null;
  const tail = Math.max(30, ty - by);
  return (
    <div style={{
      position: 'absolute', left: x, top: by, width: w,
      transform: `translateY(-100%) scale(${s})`,
      transformOrigin: `${tx - x}px calc(100% + ${tail}px)`,
    }}>
      <div style={{
        background: '#fff', border: `5px solid ${O}`, borderRadius: 44, padding: '26px 34px',
        fontFamily: FONT, fontWeight: 700, fontSize: fs, lineHeight: 1.35, color: O,
        textAlign: 'center', boxShadow: '0 8px 0 rgba(0,0,0,.14)',
      }}>{text}</div>
      <svg width={70} height={tail} style={{position: 'absolute', left: tx - x - 35, top: '100%', marginTop: -5, overflow: 'visible'}}>
        <path d={`M5,0 L35,${tail} L65,0`} fill="#fff" stroke={O} strokeWidth={5} strokeLinejoin="round" />
        <path d="M9,-1 L61,-1" stroke="#fff" strokeWidth={8} />
      </svg>
    </div>
  );
};

/* ---------- Pill badge (name / place / time) ---------- */
export const Pill: React.FC<{a: number; b: number; text: string; x?: number; y?: number; bg?: string; fs?: number}> =
  ({a, b, text, x = W / 2, y = 150, bg = '#FFD23F', fs = 42}) => {
    const g = useG();
    const s = popOut(g, a, b, 0.35);
    if (s <= 0.001) return null;
    return (
      <div style={{
        position: 'absolute', left: x, top: y, transform: `translate(-50%,0) scale(${s})`,
        background: bg, border: `4px solid ${O}`, borderRadius: 60, padding: '8px 34px',
        fontFamily: FONT, fontWeight: 700, fontSize: fs, color: O, whiteSpace: 'nowrap',
        boxShadow: '0 6px 0 rgba(0,0,0,.18)',
      }}>{text}</div>
    );
  };

/* ---------- Stamp (bold keyword card) ---------- */
export const Stamp: React.FC<{a: number; b: number; text: string; k?: string; x?: number; y?: number; rot?: number; color?: string; bg?: string; fs?: number}> =
  ({a, b, text, k, x = W / 2, y = 260, rot = -4, color = '#D94F30', bg = '#FFF3C4', fs = 70}) => {
    const g = useG();
    if (g < a || g > b + 0.3) return null;
    const sc = (1 + 0.8 * (1 - eo(prog(g, a, a + 0.22)))) * (1 - 0.3 * prog(g, b, b + 0.3));
    const op = prog(g, a, a + 0.12) * (1 - prog(g, b, b + 0.3));
    return (
      <div style={{
        position: 'absolute', left: x, top: y, transform: `translate(-50%,0) rotate(${rot}deg) scale(${sc})`, opacity: op,
        background: bg, border: `8px dashed ${color}`, borderRadius: 30, padding: '20px 40px',
        display: 'flex', alignItems: 'center', gap: 24, fontFamily: FONT, fontWeight: 700,
        fontSize: fs, color, whiteSpace: 'nowrap',
      }}>
        {k && <Icon k={k} size={fs * 1.5} />}{text}
      </div>
    );
  };

/* ---------- Floating contextual icon ---------- */
export const PopIcon: React.FC<{k: string; a: number; b: number; x: number; y: number; size?: number; rot?: number; card?: boolean; float?: boolean}> =
  ({k, a, b, x, y, size = 130, rot = 0, card = false, float = true}) => {
    const g = useG();
    const s = popOut(g, a, b);
    if (s <= 0.001) return null;
    const fy = float ? Math.sin((g - a) * 4) * 10 : 0;
    const pad = card ? size * 0.2 : 0;
    return (
      <div style={{
        position: 'absolute', left: x - size / 2 - pad, top: y - size / 2 - pad + fy,
        transform: `scale(${s}) rotate(${rot}deg)`,
        background: card ? '#fff' : 'transparent', border: card ? `4px solid ${O}` : 'none',
        borderRadius: '50%', padding: pad, boxShadow: card ? '0 6px 0 rgba(0,0,0,.18)' : 'none',
      }}><Icon k={k} size={size} /></div>
    );
  };

/* ---------- Music notes drifting from a source ---------- */
export const Notes: React.FC<{a: number; b: number; at: (t: number) => number[]; dir?: number}> = ({a, b, at, dir = -1}) => {
  const g = useG();
  const out: React.ReactNode[] = [];
  for (let t0 = a; t0 <= b; t0 += 0.45) {
    const age = g - t0;
    if (age < 0 || age > 1.8) continue;
    const [px, py] = at(t0);
    out.push(
      <div key={t0} style={{
        position: 'absolute', left: px + dir * age * 150 + Math.sin(age * 5) * 26 - 40, top: py - age * 170 - 40,
        opacity: 1 - age / 1.8, transform: `scale(${0.6 + 0.4 * Math.min(1, age * 4)}) rotate(${Math.sin(age * 4) * 15}deg)`,
      }}><Icon k="note" size={80} /></div>
    );
  }
  return <>{out}</>;
};

/* ---------- Screen shake & camera zoom ---------- */
export const Shake: React.FC<{wins: number[][]; children: React.ReactNode}> = ({wins, children}) => {
  const g = useG();
  let amp = 0;
  for (const [a, b, m] of wins) if (g >= a && g <= b) amp = Math.max(amp, m);
  return <div style={{position: 'absolute', inset: 0, transform: `translate(${Math.sin(g * 70) * amp}px,${Math.cos(g * 83) * amp}px)`}}>{children}</div>;
};

export const Cam: React.FC<{keys: number[][]; children: React.ReactNode}> = ({keys, children}) => {
  const g = useG();
  const t = keys.map((k) => k[0]);
  const f = (i: number) => interpolate(g, t, keys.map((k) => k[i]), {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  return <div style={{position: 'absolute', inset: 0, transformOrigin: `${f(2)}px ${f(3)}px`, transform: `scale(${f(1)})`}}>{children}</div>;
};

/* ---------- Bottom caption (only when no bubble / text card is showing) ---------- */
export const Caption: React.FC = () => {
  const g = useG();
  if (BUSY.some(([a, b]) => g >= a && g <= b)) return null;
  const c = CHUNKS.find((c) => g >= c.a && g <= c.b);
  if (!c) return null;
  const op = Math.min(prog(g, c.a, c.a + 0.15), 1 - prog(g, c.b - 0.1, c.b));
  const plain = c.t.replace(/\*\*/g, '');
  const fs = Math.min(64, Math.floor(920 / (plain.length * 0.56)));
  return (
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 250, display: 'flex', justifyContent: 'center', opacity: op, transform: `translateY(${(1 - op) * 24}px)`}}>
      <div style={{
        background: 'rgba(15,15,35,0.55)', borderRadius: 40, padding: '10px 38px', fontFamily: FONT, fontWeight: 600,
        fontSize: fs, color: '#fff', whiteSpace: 'nowrap', textShadow: '0 3px 6px rgba(0,0,0,.5)',
      }}>
        {c.t.split('**').map((s, i) => i % 2 ? <b key={i} style={{color: '#FFD23F', fontWeight: 700}}>{s}</b> : <span key={i}>{s}</span>)}
      </div>
    </div>
  );
};

/* ---------- Motion-graphic card ---------- */
export const Card: React.FC<{a: number; b: number; x: number; y: number; w: number; h?: number; bg: string; rot?: number; children: React.ReactNode}> =
  ({a, b, x, y, w, h, bg, rot = 0, children}) => {
    const g = useG();
    const s = popOut(g, a, b, 0.5);
    if (s <= 0.001) return null;
    return (
      <div style={{
        position: 'absolute', left: x, top: y, width: w, height: h, background: bg, border: `6px solid ${O}`, borderRadius: 56,
        boxShadow: '0 14px 0 rgba(0,0,0,.25)', transform: `scale(${s}) rotate(${rot}deg)`, display: 'flex',
        alignItems: 'center', justifyContent: 'center', gap: 20, padding: '30px 36px', boxSizing: 'border-box',
      }}>{children}</div>
    );
  };

/* ---------- Icons (pure SVG, no emoji fonts needed) ---------- */
export const Icon: React.FC<{k: string; size?: number}> = ({k, size = 120}) => {
  const s: any = {stroke: O, strokeWidth: 3, strokeLinejoin: 'round', strokeLinecap: 'round'};
  let c: React.ReactNode = null;
  switch (k) {
    case 'note': case 'noteG': {
      const f = k === 'note' ? '#FFD23F' : '#B9B9C6';
      c = <g {...s}><ellipse cx={34} cy={76} rx={17} ry={12} fill={f} /><rect x={46} y={14} width={8} height={62} fill={f} /><path d="M54,14 Q84,24 80,54 Q70,36 54,36 Z" fill={f} /></g>;
      if (k === 'noteG') c = <g>{c}<path d="M12,12 L88,88 M88,12 L12,88" stroke="#E53935" strokeWidth={12} strokeLinecap="round" /></g>;
      break;
    }
    case 'bulb':
      c = <g {...s}>{[0, 50, 100, 150, 200, 250, 310].map((a) => <line key={a} x1={50 + 38 * Math.cos(((a - 90) * Math.PI) / 180)} y1={38 + 38 * Math.sin(((a - 90) * Math.PI) / 180)} x2={50 + 50 * Math.cos(((a - 90) * Math.PI) / 180)} y2={38 + 50 * Math.sin(((a - 90) * Math.PI) / 180)} stroke="#FFB300" strokeWidth={5} />)}<circle cx={50} cy={38} r={26} fill="#FFE066" /><rect x={39} y={62} width={22} height={16} rx={4} fill="#BDBDBD" /><rect x={42} y={78} width={16} height={8} rx={4} fill="#9E9E9E" /></g>;
      break;
    case 'heart':
      c = <path d="M50,88 C8,56 14,18 38,18 C46,18 50,26 50,32 C50,26 54,18 62,18 C86,18 92,56 50,88 Z" fill="#F0455F" {...s} />;
      break;
    case 'drop':
      c = <path d="M50,8 Q86,50 50,90 Q14,50 50,8 Z" fill="#4FC3F7" {...s} />;
      break;
    case 'sun':
      c = <g {...s}>{[0, 45, 90, 135, 180, 225, 270, 315].map((a) => <line key={a} x1={50 + 34 * Math.cos((a * Math.PI) / 180)} y1={50 + 34 * Math.sin((a * Math.PI) / 180)} x2={50 + 48 * Math.cos((a * Math.PI) / 180)} y2={50 + 48 * Math.sin((a * Math.PI) / 180)} stroke="#F9A825" strokeWidth={7} />)}<circle cx={50} cy={50} r={25} fill="#FFC93C" /></g>;
      break;
    case 'spark':
      c = <path d="M50,4 L59,41 L96,50 L59,59 L50,96 L41,59 L4,50 L41,41 Z" fill="#FFE066" {...s} />;
      break;
    case 'lock':
      c = <g {...s}><path d="M34,48 V34 a16,16 0 0 1 32,0 V48" fill="none" strokeWidth={8} /><rect x={24} y={46} width={52} height={40} rx={8} fill="#FFC93C" /><circle cx={50} cy={64} r={6} fill={O} /></g>;
      break;
    case 'pomegranate':
      c = <g {...s}><circle cx={50} cy={56} r={30} fill="#D7263D" /><path d="M38,30 L42,18 L50,26 L58,18 L62,30 Z" fill="#B71C2E" /><path d="M36,50 Q40,42 48,42" fill="none" stroke="#fff" strokeWidth={4} opacity={0.7} /></g>;
      break;
    case 'pearl':
      c = <g {...s}><circle cx={32} cy={64} r={20} fill="#F4F7FF" /><circle cx={68} cy={64} r={20} fill="#F4F7FF" /><circle cx={50} cy={34} r={20} fill="#F4F7FF" /><circle cx={44} cy={28} r={5} fill="#fff" stroke="none" /></g>;
      break;
    case 'flute':
      c = <g transform="rotate(-35 50 50)" {...s}><rect x={4} y={40} width={92} height={20} rx={10} fill="#9A6A3A" />{[28, 44, 60, 76].map((x) => <circle key={x} cx={x} cy={50} r={3.5} fill={O} />)}</g>;
      break;
    case 'cross':
      c = <path d="M16,16 L84,84 M84,16 L16,84" stroke="#E53935" strokeWidth={14} strokeLinecap="round" />;
      break;
    case 'check':
      c = <path d="M16,54 L40,78 L86,24" stroke="#2EAF5A" strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" />;
      break;
    case 'cloud':
      c = <g>{[[32, 58, 20], [56, 46, 25], [76, 60, 18]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#fff" stroke={O} strokeWidth={3} />)}{[[32, 58, 20], [56, 46, 25], [76, 60, 18]].map(([x, y, r], i) => <circle key={'f' + i} cx={x} cy={y} r={r - 1.5} fill="#fff" />)}</g>;
      break;
    case 'rose':
      c = <g {...s}><path d="M50,58 L50,94" stroke="#3E9B4A" strokeWidth={6} /><path d="M50,80 Q70,70 76,78 Q64,88 50,84" fill="#58B65F" /><circle cx={50} cy={36} r={26} fill="#E0556E" /><path d="M50,36 m-14,0 a14,14 0 1 1 14,14 M50,36 m-6,0 a6,6 0 1 1 6,6" fill="none" stroke="#9E2B45" strokeWidth={3} /></g>;
      break;
    case 'sprout':
      c = <g {...s}><path d="M50,92 L50,50" stroke="#2F8F3A" strokeWidth={6} /><path d="M50,56 Q20,50 18,24 Q48,26 50,56 Z" fill="#6FD05A" /><path d="M50,48 Q80,44 84,18 Q54,20 50,48 Z" fill="#8BE06E" /></g>;
      break;
    case 'cage':
      c = <g {...s} stroke="#B8861B"><path d="M20,88 L20,48 Q20,14 50,12 Q80,14 80,48 L80,88 Z" fill="none" strokeWidth={4} />{[35, 50, 65].map((x) => <line key={x} x1={x} y1={14} x2={x} y2={88} strokeWidth={4} />)}<line x1={12} y1={88} x2={88} y2={88} strokeWidth={8} /></g>;
      break;
    case 'cycle':
      c = <g fill="none" stroke="#2196F3" strokeWidth={10} strokeLinecap="round"><path d="M78,34 A32,32 0 1 0 82,60" /><path d="M86,20 L80,38 L62,32" strokeLinejoin="round" /></g>;
      break;
  }
  return <svg width={size} height={size} viewBox="0 0 100 100" style={{overflow: 'visible'}}>{c}</svg>;
};

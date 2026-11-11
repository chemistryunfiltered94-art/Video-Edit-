import React from 'react';
import {useG, mix} from './lib';

const O = '#222222';
const ol: any = {stroke: O, strokeWidth: 2.5, strokeLinejoin: 'round', strokeLinecap: 'round'};
export type Mood = 'neutral' | 'happy' | 'sad' | 'worry' | 'surprise' | 'angry' | 'think';

const brow = (m: Mood, i: number, s: number) => {
  switch (m) {
    case 'happy': return 'M-13,-22 Q0,-31 13,-22';
    case 'sad': case 'worry': return `M${i * 13},-32 L${-i * 13},-21`;
    case 'angry': return `M${i * 13},-19 L${-i * 13},-31`;
    case 'surprise': return 'M-13,-36 Q0,-45 13,-36';
    case 'think': return s > 0 ? 'M-13,-34 Q0,-44 13,-32' : 'M-13,-23 L13,-23';
    default: return 'M-13,-25 L13,-25';
  }
};

const Mouth: React.FC<{mood: Mood; open: number}> = ({mood, open}) => {
  if (open === 0) {
    if (mood === 'surprise') return <ellipse rx={7} ry={9} fill="#7a2020" {...ol} />;
    const d: any = {
      happy: 'M-18,-2 Q0,16 18,-2', sad: 'M-15,7 Q0,-7 15,7', worry: 'M-15,4 Q-7,-3 0,3 T15,3',
      angry: 'M-15,7 Q0,-3 15,7', think: 'M-10,3 L11,-2', neutral: 'M-12,0 Q0,5 12,0',
    };
    return <path d={d[mood]} fill="none" stroke={O} strokeWidth={4} strokeLinecap="round" />;
  }
  const r = open === 1 ? {rx: 10, ry: 8} : {rx: 14, ry: 16};
  return (
    <g>
      <ellipse cx={0} cy={r.ry * 0.4} rx={r.rx} ry={r.ry} fill="#8b2a2a" {...ol} />
      {open === 2 && <ellipse cx={0} cy={r.ry * 0.95} rx={r.rx * 0.6} ry={r.ry * 0.4} fill="#e5737a" />}
    </g>
  );
};

const Face: React.FC<{cy: number; spread?: number; my?: number; mood: Mood; mouth: number; blink: number; look: {x: number; y: number}; tear?: boolean; g: number}> =
  ({cy, spread = 27, my = 34, mood, mouth, blink, look, tear, g}) => (
    <g transform={`translate(0,${cy})`}>
      {[-1, 1].map((s) => (
        <g key={s} transform={`translate(${s * spread},0)`}>
          <circle cx={s * 14} cy={26} r={12} fill="#FF8FA3" opacity={mood === 'happy' ? 0.7 : 0.3} />
          <ellipse cx={look.x * 4} cy={look.y * 4} rx={mood === 'surprise' ? 13 : 11}
            ry={Math.max(1.5, (mood === 'surprise' ? 15 : mood === 'angry' ? 9 : 12) * (1 - blink))} fill="#222" />
          {blink < 0.5 && <circle cx={look.x * 4 + 3} cy={look.y * 4 - 4} r={3.2} fill="#fff" />}
          <path d={brow(mood, -s, s)} stroke={O} strokeWidth={5} fill="none" strokeLinecap="round" />
          {tear && <ellipse cx={s * 4} cy={20 + ((g * 1.4 + (s > 0 ? 0.5 : 0)) % 1) * 46} rx={5} ry={8} fill="#5BC0F8" opacity={0.9} />}
        </g>
      ))}
      <g transform={`translate(0,${my})`}><Mouth mood={mood} open={mouth} /></g>
    </g>
  );

const Arm: React.FC<{side: 'L' | 'R'; angle: number; sx: number; sleeve: string; skin: string; sl: number; item?: React.ReactNode; ring?: boolean}> =
  ({side, angle, sx, sleeve, skin, sl, item, ring}) => (
    <g transform={`translate(${side === 'L' ? -sx : sx},-325) rotate(${side === 'L' ? angle : -angle})`}>
      <rect x={-13} y={-6} width={26} height={118} rx={13} fill={skin} {...ol} />
      <rect x={-14} y={-8} width={28} height={sl} rx={13} fill={sleeve} {...ol} />
      <circle cx={0} cy={112} r={15} fill={skin} {...ol} />
      {ring && <circle cx={0} cy={106} r={5} fill="#F4C430" stroke={O} strokeWidth={1.5} />}
      <g transform="translate(0,112)">{item}</g>
    </g>
  );

const LOOKS: Record<string, any> = {
  maya: {skin: '#F6CBA0', top: '#E8688F', skirt: '#F27BA4', pallu: '#D9527F', sleeve: 50, sx: 60, hair: 'long'},
  minister: {skin: '#EBB98F', top: '#1F3A7A', sleeve: 118, sx: 80},
  v1: {skin: '#D9A273', top: '#F0A030', pants: '#3B5BA9', sleeve: 60, sx: 58, hair: 'short'},
  v2: {skin: '#E0AE82', top: '#3FA66B', skirt: '#4DBB7C', pallu: '#2E8B57', sleeve: 50, sx: 58, hair: 'bun'},
  v3: {skin: '#E7B58C', top: '#E4572E', pants: '#2F4858', sleeve: 60, sx: 58, hair: 'short'},
};

export type PersonProps = {
  who: string; x: number; y?: number; scale?: number; flip?: boolean; mood?: Mood; mouth?: number;
  armL?: number; armR?: number; handL?: React.ReactNode; handR?: React.ReactNode;
  look?: {x: number; y: number}; tremble?: number; walk?: number; phase?: number; opacity?: number; tear?: boolean;
};

export const Person: React.FC<PersonProps> = ({
  who, x, y = 1400, scale = 1.6, flip = false, mood = 'neutral', mouth = 0, armL = 0, armR = 0, handL, handR,
  look = {x: 0, y: 0}, tremble = 0, walk = 0, phase = 0, opacity = 1, tear = false,
}) => {
  const g = useG();
  const L = LOOKS[who];
  const isMin = who === 'minister';
  const sw = Math.sin(g * 9 + phase) * walk;
  const bob = walk ? -Math.abs(Math.sin(g * 9 + phase)) * 14 * Math.min(1, walk) : Math.sin(g * 2.4 + phase) * 5;
  const blink = (g + phase) % 3.6 < 0.14 ? 1 : 0;
  const tx = tremble ? Math.sin(g * 70) * tremble : 0;
  const aL = armL + sw * 35, aR = armR - sw * 35;
  const hy = -405, hr = isMin ? 70 : 64;

  return (
    <g opacity={opacity} transform={`translate(${x + tx},${y + bob * scale}) scale(${flip ? -scale : scale},${scale})`}>
      {/* long hair behind head */}
      {L.hair === 'long' && <ellipse cx={0} cy={-400} rx={70} ry={68} fill="#1a1a1a" {...ol} />}
      {/* neck */}
      <rect x={-14} y={-362} width={28} height={32} rx={10} fill={L.skin} {...ol} />
      {/* legs / skirt */}
      {L.skirt && (
        <g>
          <ellipse cx={-30 + sw * 14} cy={0} rx={30} ry={10} fill="#8B5A3C" {...ol} />
          <ellipse cx={30 - sw * 14} cy={0} rx={30} ry={10} fill="#8B5A3C" {...ol} />
          <path d="M-56,-200 Q-70,-100 -86,-4 Q0,12 86,-4 Q70,-100 56,-200 Z" fill={L.skirt} {...ol} />
          <path d="M-84,-8 Q0,8 84,-8" stroke="#F4C430" strokeWidth={9} fill="none" />
        </g>
      )}
      {(L.pants || isMin) && [-1, 1].map((s) => (
        <g key={s} transform={`translate(${s * 32},-85) rotate(${s * sw * 18})`}>
          <rect x={-17} y={0} width={34} height={85} rx={14} fill={isMin ? '#F4F1E8' : L.pants} {...ol} />
          <ellipse cx={4} cy={86} rx={26} ry={11} fill="#2B2B2B" {...ol} />
        </g>
      ))}
      {/* torso */}
      {isMin ? (
        <g>
          {[0, 1].map((p) => (
            <g key={p} {...(p === 0 ? ol : {stroke: 'none'})}>
              <ellipse cx={0} cy={-170} rx={92} ry={110} fill={L.top} />
              <rect x={-78} y={-350} width={156} height={150} rx={50} fill={L.top} />
            </g>
          ))}
          <path d="M0,-318 L0,-70" stroke="#142a5c" strokeWidth={3} />
          <path d="M-30,-350 L0,-312 L30,-350" stroke="#F4C430" strokeWidth={5} fill="none" strokeLinecap="round" />
          {[-285, -235, -185, -135, -85].map((yy) => <circle key={yy} cx={14} cy={yy} r={6} fill="#F4C430" stroke={O} strokeWidth={1.5} />)}
        </g>
      ) : (
        <g>
          <rect x={-56} y={-345} width={112} height={165} rx={34} fill={L.top} {...ol} />
          {L.pallu && <path d="M-40,-343 L-4,-343 L60,-192 L28,-188 Z" fill={L.pallu} {...ol} />}
        </g>
      )}
      {who === 'maya' && <path d="M-32,-340 Q0,-308 32,-340" stroke="#F4C430" strokeWidth={6} fill="none" strokeLinecap="round" />}
      {/* head */}
      <ellipse cx={0} cy={hy} rx={hr} ry={isMin ? 66 : 62} fill={L.skin} {...ol} />
      {isMin && (
        <g>
          <path d="M-64,-392 Q-62,-312 0,-308 Q62,-312 64,-392 Q40,-352 0,-352 Q-40,-352 -64,-392 Z" fill="#BDBDBD" {...ol} />
          <path d="M-26,-381 Q-13,-394 0,-383 Q13,-394 26,-381 Q13,-372 0,-378 Q-13,-372 -26,-381 Z" fill="#8f8f8f" {...ol} />
        </g>
      )}
      <Face cy={-398} spread={isMin ? 29 : 27} my={isMin ? 38 : 34} mood={mood} mouth={mouth} blink={blink} look={look} tear={tear} g={g} />
      {/* hair / crown / turban */}
      {L.hair && <path d="M-66,-410 Q-70,-488 0,-488 Q70,-488 66,-410 Q55,-452 0,-452 Q-55,-452 -66,-410 Z" fill="#1a1a1a" {...ol} />}
      {L.hair === 'bun' && <circle cx={0} cy={-500} r={26} fill="#1a1a1a" {...ol} />}
      {who === 'maya' && <path d="M-30,-478 L-24,-506 L-10,-486 L0,-512 L10,-486 L24,-506 L30,-478 Z" fill="#F4C430" {...ol} />}
      {isMin && (
        <g>
          <ellipse cx={0} cy={-476} rx={78} ry={40} fill="#fff" {...ol} />
          <path d="M-70,-478 Q0,-446 70,-478 M-58,-500 Q0,-470 58,-500" stroke="#CFCFCF" strokeWidth={4} fill="none" />
          <circle cx={0} cy={-462} r={9} fill="#F4C430" {...ol} /><circle cx={0} cy={-462} r={3.5} fill="#D7263D" />
        </g>
      )}
      {/* braid */}
      {who === 'maya' && (
        <g transform={`translate(60,-372) rotate(${Math.sin(g * 2) * 3})`}>
          {[0, 30, 60, 90].map((yy, i) => <ellipse key={yy} cx={i % 2 ? 4 : -2} cy={yy} rx={17 - i * 2} ry={20} fill="#1a1a1a" {...ol} />)}
          <rect x={-8} y={106} width={16} height={12} rx={4} fill="#F4C430" {...ol} />
        </g>
      )}
      {/* arms */}
      <Arm side="L" angle={aL} sx={L.sx} sleeve={L.top} skin={L.skin} sl={L.sleeve} item={handL} />
      <Arm side="R" angle={aR} sx={L.sx} sleeve={L.top} skin={L.skin} sl={L.sleeve} item={handR} ring={isMin} />
    </g>
  );
};

/* ---------------- Golden bird ---------------- */
export const Bird: React.FC<{x: number; y: number; scale?: number; flip?: boolean; flap?: number; sing?: boolean; droop?: number; dull?: number; rot?: number; opacity?: number}> =
  ({x, y, scale = 1, flip = false, flap = 0, sing = false, droop = 0, dull = 0, rot = 0, opacity = 1}) => {
    const g = useG();
    const body = mix('#FFC52E', '#CFC59A', dull), wing = mix('#F2A100', '#B5AA7B', dull), tail = mix('#FFB300', '#C2B88E', dull);
    const wa = flap > 0 ? Math.sin(g * 26) * 35 * flap - 10 : -6;
    const hr = droop * 38 + (sing ? Math.sin(g * 8) * 3 : 0);
    const bo = sing ? (Math.sin(g * 14) > 0 ? 1 : 0.3) : 0;
    return (
      <g opacity={opacity} transform={`translate(${x},${y}) scale(${flip ? -scale : scale},${scale}) rotate(${rot})`}>
        <path d="M-34,6 Q-95,-14 -140,-34 Q-110,6 -128,30 Q-80,24 -36,24 Z" fill={tail} {...ol} />
        <path d="M-34,12 Q-90,24 -135,54 Q-100,28 -34,24 Z" fill={tail} {...ol} />
        <path d="M-8,34 L-10,56 M10,34 L8,56" stroke="#FF8C00" strokeWidth={5} strokeLinecap="round" />
        <ellipse cx={0} cy={0} rx={50} ry={38} fill={body} {...ol} />
        <ellipse cx={6} cy={14} rx={32} ry={16} fill="#FFE9A0" opacity={0.7} />
        <g transform={`rotate(${wa} -8 -10)`}>
          <path d="M-8,-10 Q-50,-62 -92,-34 Q-56,0 -8,14 Z" fill={wing} {...ol} />
        </g>
        <g transform={`translate(36,-26) rotate(${hr})`}>
          <circle cx={0} cy={0} r={26} fill={body} {...ol} />
          <path d="M-8,-24 L-12,-50 L0,-28 Z M0,-26 L6,-54 L12,-26 Z" fill="#E63946" {...ol} />
          <path d="M22,-6 L54,2 L22,6 Z" fill="#FF8C00" {...ol} />
          <g transform={`rotate(${bo * 22} 22 8)`}><path d="M22,6 L46,12 L20,12 Z" fill="#FF9F1C" {...ol} /></g>
          <circle cx={10} cy={-6} r={4.5} fill="#222" /><circle cx={11.5} cy={-7.5} r={1.5} fill="#fff" />
        </g>
      </g>
    );
  };

import React from 'react';
import {useG, mix, lerp, clamp01, pop, W, H} from './lib';

const O = '#222222';
const FLOWERS = [[800, 1090], [860, 1040], [930, 1000], [1000, 1050], [1040, 1110], [880, 1120], [960, 1100], [780, 1150], [1010, 1160], [900, 1080]];

export const GardenBG: React.FC<{
  dry: number; tod: number; wall?: number; droop?: number; bloom?: number;
  roseXs?: number[]; trail?: {x: number; a: number}[];
}> = ({dry, tod, wall = 0, droop = 0, bloom = 1, roseXs = [], trail = []}) => {
  const g = useG();
  const skyT = mix(mix('#7FCBF5', '#C9B27A', dry * 0.5), '#4B3A8A', tod);
  const skyB = mix(mix('#FFF1D0', '#F6D79A', dry * 0.6), '#FF9A5A', tod);
  const hill1 = mix(mix('#A8D878', '#D9BF84', dry), '#6B5A8A', tod * 0.6);
  const hill2 = mix(mix('#8CC55F', '#C9A965', dry), '#5A4A78', tod * 0.6);
  const ground = mix(mix('#79C257', '#CDAE72', dry), '#6A6F5A', tod * 0.5);
  const ground2 = mix(mix('#5FAF45', '#BF9F62', dry), '#5A5E4C', tod * 0.5);
  const bush = mix(mix('#3E9B4A', '#8B8A4C', dry), '#2A5A44', tod * 0.5);
  const rh = 48 * (1 - 0.7 * dry);
  const cr = clamp01((dry - 0.45) / 0.35);
  const cloudX = (o: number, sp: number) => ((o + g * sp) % 1500) - 220;
  return (
    <g>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={skyT} /><stop offset="1" stopColor={skyB} /></linearGradient>
      </defs>
      <rect width={W} height={1200} fill="url(#sky)" />
      <circle cx={lerp(220, 860, tod)} cy={lerp(480, 760, tod)} r={tod > 0.5 ? 150 : 120} fill={mix('#FFE27A', '#FF7A3C', tod)} />
      {[[300, 14, 330], [900, 9, 560]].map(([o, sp, cy], i) => (
        <g key={i} fill="#fff" opacity={0.85 - tod * 0.4}>
          <ellipse cx={cloudX(o, sp)} cy={cy} rx={110} ry={38} /><ellipse cx={cloudX(o, sp) + 60} cy={cy - 24} rx={70} ry={34} /><ellipse cx={cloudX(o, sp) - 60} cy={cy - 12} rx={60} ry={28} />
        </g>
      ))}
      <path d="M0,1010 Q250,880 520,980 T1080,950 L1080,1230 L0,1230 Z" fill={hill1} />
      <path d="M0,1100 Q300,1010 640,1090 T1080,1060 L1080,1260 L0,1260 Z" fill={hill2} />
      <rect y={1190} width={W} height={H - 1190} fill={ground} />
      <path d={`M0,1215 Q280,1185 560,1220 T1080,1205 L1080,${1205 + rh} Q820,${1235 + rh} 560,${1220 + rh} T0,${1215 + rh} Z`} fill={mix('#5BB7EA', '#8d9a7a', dry * 0.6)} />
      <path d={`M0,1285 Q300,1262 600,1285 T1080,1278 L1080,${H} L0,${H} Z`} fill={ground2} />
      {cr > 0 && (
        <g stroke="#6b4e2a" strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={cr}>
          <path d="M120,1500 l40,30 l-20,40 l50,30 l-10,50" /><path d="M520,1560 l-30,40 l40,30 l-20,50 l40,40" />
          <path d="M860,1520 l30,30 l-30,40 l50,30" /><path d="M300,1720 l40,20 l-10,40 l40,20" /><path d="M740,1730 l-30,30 l40,30 l-10,40" />
          <path d="M60,1310 l30,16 l-10,24 l30,16" /><path d="M980,1340 l-24,20 l24,20" />
        </g>
      )}
      {trail.map((t, i) => {
        const s = pop(g, t.a, 0.4);
        return s > 0 ? <ellipse key={i} cx={t.x} cy={1330 + (i % 2) * 46} rx={130 * s} ry={26 * s} fill="#6FD05A" opacity={0.85} /> : null;
      })}
      {wall < 1 && (
        <g opacity={1 - wall}>
          {[[820, 1150, 120], [930, 1120, 140], [1010, 1170, 110], [900, 1200, 100]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill={bush} />)}
          {FLOWERS.map(([fx, fy], i) => (
            <g key={i} transform={`translate(${fx},${fy}) rotate(${(1 - bloom) * (i % 2 ? 70 : -70)})`}>
              <path d="M0,0 L0,-46" stroke="#2F7A3A" strokeWidth={4} />
              <circle cx={0} cy={-48} r={5 + 8 * bloom} fill={mix('#B8B8A8', '#FFFFFF', bloom)} stroke={O} strokeWidth={1.5} />
              <circle cx={0} cy={-48} r={3} fill="#FFD23F" />
            </g>
          ))}
        </g>
      )}
      {wall > 0 && (
        <g opacity={wall}>
          <rect x={740} y={560} width={340} height={700} fill={mix('#F4E3C1', '#C9A27E', tod * 0.7)} />
          <path d="M760,560 Q910,380 1060,560 Z" fill="#E0B13A" />
          <rect x={836} y={750} width={150} height={235} rx={0} fill="#7A4B2A" />
          <path d="M846,985 L846,820 Q846,760 911,760 Q976,760 976,820 L976,985 Z" fill={mix('#8FD3F4', '#FFC56B', tod)} />
          <path d="M911,760 L911,985 M846,870 L976,870" stroke="#7A4B2A" strokeWidth={6} />
          <rect x={825} y={985} width={170} height={28} rx={6} fill="#C99A5B" stroke="#8A6A3A" strokeWidth={3} />
          <rect x={740} y={1240} width={340} height={30} fill="#CDB07A" />
        </g>
      )}
      {roseXs.map((rx, i) => {
        const hd = droop * 55 * (i % 2 ? 1 : -1);
        return (
          <g key={i} transform={`translate(${rx},1395)`}>
            <path d="M0,0 L0,-110" stroke={mix('#3E9B4A', '#5a5030', droop)} strokeWidth={7} />
            <path d="M0,-40 Q26,-56 34,-44 Q20,-30 0,-34 Z" fill={mix('#58B65F', '#6a5a35', droop)} stroke={O} strokeWidth={2} />
            <g transform={`translate(0,-110) rotate(${hd})`}>
              <circle cx={0} cy={-26} r={30} fill={mix('#E0556E', '#5a2f35', droop)} stroke={O} strokeWidth={3} />
              <path d="M0,-26 m-16,0 a16,16 0 1 1 16,16 M0,-26 m-7,0 a7,7 0 1 1 7,7" fill="none" stroke="rgba(0,0,0,.3)" strokeWidth={3} />
            </g>
          </g>
        );
      })}
      <rect width={W} height={H} fill="#FF7A2F" opacity={0.1 * tod} />
    </g>
  );
};

export const InteriorBG: React.FC<{gloom: number; outDark: number}> = ({gloom, outDark}) => (
  <g>
    <defs><clipPath id="win"><path d="M340,950 L340,520 Q340,330 540,330 Q740,330 740,520 L740,950 Z" /></clipPath></defs>
    <rect width={W} height={H} fill="#EBD0A0" />
    {[0, 1, 2, 3].map((i) => <rect key={i} x={i * 270 + 20} y={160} width={230} height={1030} rx={10} fill="#E3C28E" />)}
    <rect y={1190} width={W} height={H - 1190} fill="#B97A45" />
    <rect y={1180} width={W} height={20} fill="#8A5A2B" />
    <path d="M400,1200 L680,1200 L900,1920 L180,1920 Z" fill="#B3202F" />
    <path d="M410,1200 L190,1920 M670,1200 L890,1920" stroke="#F4C430" strokeWidth={8} />
    <g clipPath="url(#win)">
      <rect x={340} y={330} width={400} height={640} fill={mix('#9AD8F5', '#7F8791', outDark)} />
      <circle cx={430} cy={470} r={44} fill={mix('#FFE27A', '#B9B4A0', outDark)} />
      <path d="M340,880 Q440,780 560,860 T740,830 L740,950 L340,950 Z" fill={mix('#79C257', '#6B6A4A', outDark)} />
      {[430, 540, 650].map((x) => (
        <g key={x}>
          <path d={`M${x},930 L${x},870`} stroke={mix('#3E9B4A', '#4a4630', outDark)} strokeWidth={5} />
          <circle cx={x} cy={862} r={17} fill={mix('#E0556E', '#4B2B30', outDark)} stroke={O} strokeWidth={2} />
        </g>
      ))}
    </g>
    <path d="M340,950 L340,520 Q340,330 540,330 Q740,330 740,520 L740,950 Z" fill="none" stroke="#8A5A2B" strokeWidth={16} />
    <path d="M540,330 L540,950 M340,640 L740,640" stroke="#8A5A2B" strokeWidth={10} />
    <path d="M290,300 L370,300 L350,990 L280,990 Z" fill="#A31F34" /><path d="M790,300 L710,300 L730,990 L800,990 Z" fill="#A31F34" />
    <rect x={0} y={0} width={110} height={1190} fill="#F4E5C4" /><rect x={970} y={0} width={110} height={1190} fill="#F4E5C4" />
    <rect x={-10} y={1130} width={130} height={60} fill="#E0B13A" /><rect x={960} y={1130} width={130} height={60} fill="#E0B13A" />
    <path d="M540,0 L540,150" stroke="#8A5A2B" strokeWidth={5} />
    <ellipse cx={540} cy={170} rx={90} ry={22} fill="#E0B13A" stroke={O} strokeWidth={3} />
    {[-60, -20, 20, 60].map((dx) => <ellipse key={dx} cx={540 + dx} cy={140} rx={8} ry={14} fill="#FFD23F" />)}
    <rect width={W} height={H} fill="#1B1F3B" opacity={0.3 * gloom} />
  </g>
);

import React from 'react';
const O = '#222222';
const ol: any = {stroke: O, strokeWidth: 2.5, strokeLinejoin: 'round', strokeLinecap: 'round'};

/* Cage: origin = center of base; ring at y=-318. door: 1 open .. 0 closed */
export const Cage: React.FC<{x?: number; y?: number; scale?: number; door?: number; children?: React.ReactNode}> =
  ({x = 0, y = 0, scale = 1, door = 0, children}) => (
    <g transform={`translate(${x},${y}) scale(${scale})`}>
      <ellipse cx={0} cy={-2} rx={112} ry={14} fill="#B8861B" {...ol} />
      {children}
      <g stroke="#C99A1E" strokeWidth={5} fill="none" strokeLinecap="round">
        {[-90, -60, 60, 90].map((b) => <path key={b} d={`M${b},-4 L${b},-195`} />)}
        <path d="M-100,-195 L-100,-4 M100,-195 L100,-4" />
        <path d="M-100,-195 Q-100,-290 0,-296 Q100,-290 100,-195 Z" />
        <path d="M-50,-292 L-50,-195 M0,-296 L0,-195 M50,-292 L50,-195" />
      </g>
      <circle cx={0} cy={-308} r={13} fill="none" stroke="#B8861B" strokeWidth={6} />
      <g transform={`translate(-30,0) scale(${Math.max(0.08, 1 - door * 0.92)},1)`}>
        <rect x={0} y={-182} width={60} height={176} rx={6} fill="rgba(255,255,255,0.18)" stroke="#8a6410" strokeWidth={6} />
        {[15, 30, 45].map((bx) => <path key={bx} d={`M${bx},-180 L${bx},-8`} stroke="#C99A1E" strokeWidth={4} />)}
        <circle cx={54} cy={-90} r={6} fill="#8a6410" />
      </g>
    </g>
  );

export const Pot: React.FC = () => (
  <g transform="rotate(-50) translate(18,-10)" {...ol}>
    <path d="M-30,-50 Q-52,0 -30,42 Q0,56 30,42 Q52,0 30,-50 Z" fill="#C2703D" />
    <rect x={-18} y={-72} width={36} height={26} rx={8} fill="#A85C2E" />
    <path d="M-20,-10 Q0,6 20,-10" stroke="#F4C430" strokeWidth={5} fill="none" />
  </g>
);

export const Plate: React.FC = () => (
  <g {...ol}>
    <ellipse cx={0} cy={-6} rx={64} ry={12} fill="#F4C430" />
    <ellipse cx={0} cy={-10} rx={48} ry={7} fill="#FFE27A" stroke="none" />
  </g>
);

export const Pedestal: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g {...ol}>
    <rect x={x - 12} y={y} width={24} height={250} fill="#8A5A2B" />
    <ellipse cx={x} cy={y + 255} rx={80} ry={16} fill="#6E4520" />
    <rect x={x - 120} y={y - 8} width={240} height={26} rx={10} fill="#A66F36" />
  </g>
);

export const Feather: React.FC<{size: number; color: string; rot?: number}> = ({size, color, rot = 0}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{transform: `rotate(${rot}deg)`, overflow: 'visible'}}>
    <path d="M14,92 Q4,40 66,6 Q96,40 46,82 Z" fill={color} stroke={O} strokeWidth={2.5} strokeLinejoin="round" />
    <path d="M14,92 L62,14" stroke={O} strokeWidth={2.5} strokeLinecap="round" />
    <path d="M30,70 L48,66 M36,56 L54,50 M44,44 L60,36" stroke={O} strokeWidth={1.8} opacity={0.5} strokeLinecap="round" />
  </svg>
);

export const FeatherG: React.FC<{color: string; s?: number}> = ({color, s = 0.7}) => (
  <g transform={`scale(${s}) translate(-40,-80)`}>
    <path d="M14,92 Q4,40 66,6 Q96,40 46,82 Z" fill={color} stroke={O} strokeWidth={3} strokeLinejoin="round" />
    <path d="M14,92 L62,14" stroke={O} strokeWidth={3} strokeLinecap="round" />
  </g>
);

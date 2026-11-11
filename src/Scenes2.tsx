import React from 'react';
import {AbsoluteFill} from 'remotion';
import {useG, W, H, lerp, prog, eo, eio, kf, mix, pop, popOut} from './lib';
import {Person, Bird} from './Characters';
import {Cage, Plate, Pedestal, Feather, FeatherG} from './Props';
import {GardenBG, InteriorBG} from './Backgrounds';
import {Bubble, Pill, PopIcon, Notes, Shake, Card, Icon, FONT} from './ui';
import {talk} from './words';
import {Layer} from './Scenes1';

/* ===== সিন ৪ : নিস্তব্ধ প্রাসাদ (54.5 – 83.35s) ===== */
export const Scene4: React.FC = () => {
  const g = useG();
  const mS = talk('shashanka', g);
  const gloom = lerp(0.1, 0.7, prog(g, 54.5, 70));
  const outDark = prog(g, 66, 72.7);
  const plateArm = 70 * eo(prog(g, 59.5, 60.2)) * (1 - eo(prog(g, 65.6, 66.2)));
  const angry = g > 72.8 && g < 76.35;
  const featherArm = 70 * eo(prog(g, 77.5, 78.2));
  const dull = prog(g, 58, 83);
  const fillW = 500 * lerp(0.75, 0.12, eo(prog(g, 67.9, 72.5)));
  const dim = prog(g, 78.0, 78.6) * (1 - prog(g, 83.0, 83.34));
  const icons: [string, number, number][] = [['pomegranate', 59.8, 100], ['pearl', 61.6, 240], ['flute', 63.4, 380]];
  return (
    <AbsoluteFill>
      <Shake wins={[[72.8, 74.2, 6]]}>
        <Layer>
          <InteriorBG gloom={gloom} outDark={outDark} />
          <Pedestal x={880} y={1130} />
          <Cage x={880} y={1130} scale={0.85} door={0}>
            <Bird x={0} y={-70} scale={0.6} flip droop={prog(g, 55, 58)} dull={dull} />
          </Cage>
          <Person who="minister" x={210} mood={angry ? 'angry' : 'worry'} mouth={mS} tremble={angry ? 1.2 : 0}
            armR={plateArm} armL={angry ? 60 : 0}
            handR={plateArm > 1 ? <g transform={`rotate(${plateArm})`}><Plate /></g> : undefined} look={{x: 1, y: 0}} />
          <Person who="maya" x={650} phase={2} mood="sad" tear={g > 77.9} armR={featherArm}
            handR={featherArm > 5 ? <g transform={`rotate(${featherArm})`}><FeatherG color={mix('#FFC52E', '#D8D2B8', dull)} s={0.8} /></g> : undefined}
            look={{x: 0.3, y: 0.8}} />
        </Layer>
      </Shake>
      <Pill a={54.6} b={57.4} y={170} text="পরদিন সকাল · নিস্তব্ধ প্রাসাদ" fs={44} />
      <PopIcon k="noteG" a={57.6} b={59.6} x={880} y={760} size={140} />
      {icons.map(([k, a, x]) => <PopIcon key={k} k={k} a={a} b={67.7} x={x} y={420} size={110} card />)}
      {icons.map(([k, , x]) => <PopIcon key={k + 'x'} k="cross" a={65.8} b={67.7} x={x} y={420} size={90} float={false} />)}
      <Card a={67.8} b={72.7} x={140} y={240} w={800} h={170} bg="#FFFFFF">
        <Icon k="rose" size={110} />
        <div style={{width: 500, height: 46, border: '5px solid #222', borderRadius: 30, background: '#eee', overflow: 'hidden'}}>
          <div style={{width: fillW, height: '100%', background: mix('#2EAF5A', '#E53935', prog(g, 67.9, 72.5))}} />
        </div>
      </Card>
      <Bubble a={72.8} b={76.35} x={40} by={450} w={700} tx={210} fs={52} text="আরও বড় খাঁচা বানাতে হবে, রাজকন্যা।" />
      <PopIcon k="cloud" a={76.4} b={77.9} x={770} y={780} size={110} />
      {dim > 0 && (
        <div style={{position: 'absolute', inset: 0, background: `rgba(10,10,30,${0.6 * dim})`, opacity: 1}}>
          <div style={{position: 'absolute', left: 540 - 280, top: 820 - 280 + Math.sin(g * 2) * 10, opacity: dim}}>
            <Feather size={560} color={mix('#FFC52E', '#D8D2B8', prog(g, 78.4, 83.2))} rot={-25 + Math.sin(g * 2) * 4} />
          </div>
          {Array.from({length: 10}).map((_, i) => (
            <div key={i} style={{position: 'absolute', left: 540 + Math.sin(i * 3) * 230, top: 900 + ((g * 60 + i * 37) % 420), width: 10, height: 10, borderRadius: 5, background: '#E8D9A0', opacity: dim * 0.7}} />
          ))}
        </div>
      )}
    </AbsoluteFill>
  );
};

/* ===== সিন ৫ : মুক্তি (83.35 – 117s) ===== */
const KEYS = [
  [97.2, 651, 1237, 0.48], [98.3, 800, 820, 0.9], [99.8, 600, 470, 1.1], [101, 880, 620, 1.1], [102.2, 240, 820, 1.1],
  [103.2, 180, 540, 1.1], [103.95, 520, 720, 1.1], [105.4, 300, 1040, 1.0], [107, 640, 1000, 1.0], [108.4, 880, 1070, 1.0],
  [109.8, 600, 540, 1.0], [111.4, 780, 640, 1.0], [113.3, 930, 800, 0.9], [114.9, 945, 935, 0.9],
];
const VIL: {who: string; x: number; a: number; s: number}[] = [
  {who: 'v1', x: 800, a: 108.5, s: 0.85}, {who: 'v2', x: 920, a: 109.0, s: 0.85}, {who: 'v3', x: 1010, a: 109.5, s: 0.6},
];

export const Scene5: React.FC = () => {
  const g = useG();
  const mS = talk('shashanka', g), mM = talk('maya', g);
  const dry = lerp(1, 0, eo(prog(g, 104, 108.4)));
  const droop = 1 - eo(prog(g, 105, 108.4));
  const tod = eio(prog(g, 111.4, 113));
  const mx = g < 86.8 ? lerp(-150, 480, eo(prog(g, 83.4, 86.8))) : 480;
  const mWalk = g > 83.4 && g < 86.8 ? 1 : 0;
  const nx = g < 87.5 ? -300 : lerp(-300, 240, eo(prog(g, 87.5, 89.7)));
  const nWalk = g > 87.5 && g < 89.7 ? 1.3 : 0;
  const alarm = 120 * eo(prog(g, 89.8, 90.2)) * (1 - eo(prog(g, 93.7, 94.3)));
  const wave = 140 * eo(prog(g, 97.3, 98)) * (1 - eo(prog(g, 100.5, 101.5)));
  const door = eo(prog(g, 96.5, 97.1));
  const [bx, by, bs] = kf(g, KEYS);
  const [bx2] = kf(g + 0.06, KEYS);
  const flying = g >= 97.2;
  const sing = (g > 99.9 && g < 103.9) || (g > 115.7 && g < 117);
  const trail: {x: number; a: number}[] = [];
  for (let t = 104; t < 108.3; t += 0.45) trail.push({x: kf(t, KEYS)[0], a: t});
  const sway = Math.sin(g * 3) * 3;
  const cageItem = (
    <g transform={`rotate(${25 + sway}) translate(0,156) scale(0.5)`}>
      <Cage door={door}>{!flying && <Bird x={0} y={-70} scale={0.6} flip droop={0.3} dull={0.9} />}</Cage>
    </g>
  );
  const mMood = g < 94.2 ? 'neutral' : 'happy';
  const nMood = g < 90 ? 'worry' : g < 94.2 ? 'surprise' : g < 96.5 ? 'worry' : 'happy';
  return (
    <AbsoluteFill>
      <Layer>
        <GardenBG dry={dry} tod={tod} wall={1} droop={droop} bloom={eo(prog(g, 106, 108.6))} roseXs={[600, 680, 760]} trail={trail} />
        {g > 103.96 && g < 108.4 && <ellipse cx={bx} cy={1380} rx={80 * bs} ry={16} fill="rgba(0,0,0,0.25)" />}
        <Person who="minister" x={nx} walk={nWalk} phase={3} mood={nMood} mouth={mS} armL={alarm} armR={alarm}
          tremble={g > 90 && g < 93.7 ? 0.8 : 0} look={g > 97 ? {x: 0.5, y: -1} : {x: 1, y: 0}} />
        <Person who="maya" x={mx} walk={mWalk} mood={mMood} mouth={mM} armR={25} armL={wave} handR={cageItem}
          look={g > 97 ? {x: 1, y: -0.7} : {x: 0.5, y: 0.2}} />
        {flying && <Bird x={bx} y={by} scale={bs} flip={bx2 < bx} flap={g < 114.6 ? 1 : 0.15} sing={sing} dull={Math.max(0, 0.9 - eo(prog(g, 97.2, 99.5)))} />}
        {VIL.map((v) => g >= v.a && (
          <Person key={v.who} who={v.who} x={lerp(1300, v.x, eo(prog(g, v.a, v.a + 0.6)))} y={1560} scale={v.s} flip phase={v.x}
            mood={g < 110.6 ? 'surprise' : 'happy'} look={{x: -0.4, y: -1}} />
        ))}
      </Layer>
      <Pill a={83.45} b={84.8} y={170} text="পরদিন ভোর" fs={46} />
      <Bubble a={90.05} b={93.7} x={40} by={450} w={720} tx={240} fs={48} text="রাজকন্যা, এ কী করছেন! ও চলে গেলে ফুলপুরের কী হবে?" />
      <Bubble a={94.25} b={96.5} x={200} by={450} w={700} tx={480} fs={52} text="গান খাঁচায় ধরা যায় না, কাকা।" />
      <Notes a={99.9} b={103.9} at={(t) => kf(t, KEYS).slice(0, 2)} dir={-1} />
      <Notes a={115.7} b={116.9} at={() => [945, 900]} dir={-1} />
      <PopIcon k="sprout" a={105.3} b={117} x={330} y={1330} size={100} float={false} />
      <PopIcon k="sprout" a={106.2} b={117} x={600} y={1480} size={100} float={false} />
      <PopIcon k="sprout" a={107.0} b={117} x={140} y={1420} size={100} float={false} />
      <PopIcon k="spark" a={114.9} b={116.2} x={945} y={860} size={90} />
      <PopIcon k="heart" a={115.7} b={117} x={480} y={520} size={130} />
    </AbsoluteFill>
  );
};

/* ===== সিন ৬ : শিক্ষা — ক্লিন মোশন গ্রাফিক্স (117 – 128.45s) ===== */
const txt = (fs: number, color: string): React.CSSProperties => ({flex: 1, fontFamily: FONT, fontWeight: 700, fontSize: fs, color, textAlign: 'center', lineHeight: 1.35});

export const Scene6: React.FC = () => {
  const g = useG();
  const vs = popOut(g, 120.6, 123.4);
  const title = prog(g, 126.2, 127);
  const pulse = 1 + 0.08 * Math.sin(g * 6);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 38%, #2F3478 0%, #171A45 65%, #0B0C26 100%)'}}>
      {Array.from({length: 16}).map((_, i) => (
        <div key={i} style={{position: 'absolute', left: (i * 211) % 1060, top: (i * 337) % 1880, width: 8, height: 8, borderRadius: 4, background: '#fff', opacity: 0.25 + 0.25 * Math.sin(g * 2 + i)}} />
      ))}
      <Card a={117.15} b={123.4} x={90} y={330} w={900} h={470} bg="#ECEBF5">
        <svg width={200} height={270} viewBox="-130 -340 260 360"><Cage><Bird x={0} y={-70} scale={0.7} flip droop={0.8} dull={0.9} /></Cage></svg>
        <div style={txt(50, '#2A2A4A')}>সোনার খাঁচায় আটকে রাখলে সোনার পাখির গানও থেমে যায়</div>
      </Card>
      {vs > 0.01 && (
        <div style={{position: 'absolute', left: 540 - 65, top: 835, width: 130, height: 130, borderRadius: 65, background: '#FFD23F', border: '6px solid #222', transform: `scale(${vs})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 700, fontSize: 56, color: '#222', zIndex: 5}}>VS</div>
      )}
      <Card a={120.76} b={123.4} x={90} y={1000} w={900} h={470} bg="#FFF3C4">
        <svg width={260} height={200} viewBox="-170 -100 340 200"><Bird x={0} y={0} scale={1.1} flap={1} sing /></svg>
        <div style={txt(50, '#4A2E00')}>যাকে সত্যিই ভালোবাসো, তাকে উড়তে দাও</div>
      </Card>
      <Card a={123.55} b={125.4} x={90} y={620} w={900} h={620} bg="#E3F6FF">
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30}}>
          <Icon k="cycle" size={260} />
          <div style={txt(68, '#0D3B66')}>সে ফিরে আসবে নিজের ইচ্ছায়</div>
        </div>
      </Card>
      <Card a={125.46} b={140} x={90} y={700} w={900} h={620} bg="#FFE3EC">
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30}}>
          <div style={{transform: `scale(${pulse})`}}><Icon k="heart" size={240} /></div>
          <div style={txt(60, '#7A1F3D')}>আর তখনই তার গান তোমার জন্য আসল হবে</div>
        </div>
      </Card>
      <div style={{position: 'absolute', left: 0, right: 0, top: 170, textAlign: 'center', opacity: title, transform: `translateY(${(1 - title) * -20}px)`, fontFamily: FONT, fontWeight: 700, fontSize: 64, color: '#FFD23F', textShadow: '0 4px 10px rgba(0,0,0,.4)'}}>
        জাদুর রাজকন্যা ও সোনার পাখি
      </div>
    </AbsoluteFill>
  );
};

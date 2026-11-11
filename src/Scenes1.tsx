import React from 'react';
import {AbsoluteFill} from 'remotion';
import {useG, W, H, lerp, prog, eo, eio, kf, pop} from './lib';
import {Person, Bird} from './Characters';
import {Cage, Pot, Pedestal} from './Props';
import {GardenBG} from './Backgrounds';
import {Bubble, Pill, Stamp, PopIcon, Notes, Cam} from './ui';
import {talk} from './words';

export const Layer: React.FC<{children: React.ReactNode}> = ({children}) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', left: 0, top: 0}}>{children}</svg>
);

/* ===== সিন ১ : জুঁই ঝোপ (0 – 17.3s) ===== */
export const Scene1: React.FC = () => {
  const g = useG();
  const mS = talk('shashanka', g);
  const mx = lerp(540, 700, eio(prog(g, 6, 17.3)));
  const sneak = g > 5;
  return (
    <AbsoluteFill>
      <Layer>
        <GardenBG dry={0.3} tod={0} bloom={0.8} />
        <Bird x={990} y={946} scale={0.9} />
        <Person who="minister" x={240} mood={g < 6 ? 'worry' : 'happy'} mouth={mS} armR={g < 6 ? 100 : 0} look={{x: 0.6, y: 0}} />
        <Person who="maya" x={mx} phase={1} mood={sneak ? 'think' : 'neutral'} armL={sneak ? -30 : 0} armR={sneak ? -30 : 0} walk={sneak ? 0.25 : 0} look={{x: 1, y: 0}} />
      </Layer>
      <Pill a={0.4} b={3.6} x={240} y={505} text="মন্ত্রী কাকা শশাঙ্ক" bg="#8FBFFF" fs={40} />
      <Bubble a={0.3} b={6.0} x={40} by={430} w={700} tx={240} ty={495} fs={48}
        text="রাজকন্যা, দেরি করবেন না! পাখিটাকে এক্ষুনি খাঁচায় ভরুন, নইলে এক পলকে উড়ে যাবে!" />
      <Pill a={9.0} b={12.3} x={mx} y={505} text="রাজকন্যা মায়া" bg="#FF9EBB" fs={40} />
      <PopIcon k="spark" a={6.4} b={8.2} x={990} y={820} size={90} />
      <PopIcon k="spark" a={10.2} b={12.0} x={920} y={850} size={70} />
    </AbsoluteFill>
  );
};

/* ===== সিন ২ : খরা ও গান (17.3 – 37.7s) ===== */
export const Scene2: React.FC = () => {
  const g = useG();
  const mM = talk('maya', g);
  const dry = g < 29.4 ? lerp(0.3, 1, eo(prog(g, 17.3, 20.5))) : lerp(1, 0.55, eo(prog(g, 29.5, 36)));
  const bloom = g < 22.5 ? lerp(0.8, 0, prog(g, 19, 22.4)) : g < 31 ? 0 : eo(prog(g, 31, 34.4));
  const droop = eo(prog(g, 19.8, 22.4)) * (1 - 0.8 * eo(prog(g, 32, 36)));
  const armR = lerp(0, 80, eo(prog(g, 24.6, 25.4))) * (1 - eo(prog(g, 29.4, 29.9))) + 95 * eo(prog(g, 34.4, 34.9));
  const mood = g < 24.9 ? 'sad' : g < 29.5 ? 'think' : 'happy';
  const sing = g > 29.46 && g < 34.5;
  const drops: React.ReactNode[] = [];
  if (g > 25.2 && g < 29.3) {
    for (let i = 0; i < 5; i++) {
      const t = (g * 1.6 + i / 5) % 1;
      drops.push(<ellipse key={i} cx={836 - t * 30 + Math.sin(i * 2) * 12} cy={lerp(980, 1290, t)} rx={6} ry={10} fill="#4FC3F7" stroke="#222" strokeWidth={2} />);
    }
  }
  return (
    <AbsoluteFill>
      <Cam keys={[[34.2, 1, 520, 760], [34.9, 1.22, 520, 760], [37.3, 1.22, 520, 760], [37.72, 1, 520, 760]]}>
        <Layer>
          <GardenBG dry={dry} tod={0} bloom={bloom} droop={droop} roseXs={[700, 790, 880]} />
          <Bird x={990} y={946} scale={0.9} sing={sing} flap={sing ? 0.2 : 0} />
          <Person who="minister" x={240} opacity={eo(prog(g, 33.5, 34.2))} mood="happy" look={{x: 1, y: 0}} />
          <Person who="maya" x={520} mood={mood} mouth={mM} armR={armR}
            handR={g > 24.6 && g < 29.9 ? <Pot /> : undefined}
            look={g > 29.5 ? {x: 1, y: -0.5} : {x: 0, y: 0}} />
          {drops}
        </Layer>
      </Cam>
      <Stamp a={17.4} b={20.3} text="৩ মাস বৃষ্টি নেই" k="sun" y={250} fs={66} />
      <PopIcon k="drop" a={25.0} b={27.4} x={860} y={820} size={90} />
      <Notes a={29.5} b={34.4} at={() => [960, 900]} dir={-1} />
      <PopIcon k="spark" a={33.2} b={35.0} x={900} y={1000} size={80} />
      <Bubble a={34.55} b={37.7} x={140} by={450} w={760} tx={520} fs={54} text="দেখলেন কাকা? ও গাইলেই ফুল জেগে ওঠে।" />
    </AbsoluteFill>
  );
};

/* ===== সিন ৩ : সোনার খাঁচা (37.7 – 54.5s) ===== */
export const Scene3: React.FC = () => {
  const g = useG();
  const mS = talk('shashanka', g);
  const mx = lerp(520, 660, eio(prog(g, 37.8, 39.2)));
  const walking = g > 37.8 && g < 39.2;
  const door = g < 52.9 ? 1 : 1 - eo(prog(g, 52.9, 53.5));
  const cs = pop(g, 43.3, 0.5) * 0.85;
  const [bx, by, bs] = kf(g, [[50.72, 990, 946, 0.9], [51.3, 930, 780, 0.9], [52.3, 870, 1010, 0.6], [52.8, 860, 1070, 0.51]]);
  const minArm = g < 43 ? -130 + Math.sin(g * 7) * 10 : lerp(-130, 150, eo(prog(g, 43, 43.7)));
  const mayaArm = (g < 47 ? 0 : 30 * eo(prog(g, 47, 47.8))) + (g > 52.9 && g < 53.6 ? 10 * Math.sin((g - 52.9) * 12) : 0);
  const mayaMood = g < 46.9 ? 'neutral' : g < 53.5 ? 'worry' : 'sad';
  return (
    <AbsoluteFill>
      <Cam keys={[[50.5, 1, 860, 950], [51.4, 1.18, 860, 950], [54.5, 1.18, 860, 950]]}>
        <Layer>
          <GardenBG dry={0.55} tod={0} bloom={0.9} droop={0.2} />
          {cs > 0.01 && <Pedestal x={860} y={1130} />}
          {g < 50.72 && <Bird x={990} y={946} scale={0.9} />}
          {cs > 0.01 && <Cage x={860} y={1130} scale={cs} door={door} />}
          {g >= 50.72 && <Bird x={bx} y={by} scale={bs} flip={g >= 50.9} flap={g < 52.6 ? 1 : 0} droop={g > 53.5 ? 0.5 : 0} />}
          <Person who="minister" x={240} mood="happy" mouth={mS} armR={minArm} look={{x: 1, y: 0}} />
          <Person who="maya" x={mx} phase={1} mood={mayaMood} armR={mayaArm} walk={walking ? 0.8 : 0} look={{x: 1, y: 0.2}} />
        </Layer>
      </Cam>
      <PopIcon k="bulb" a={43.2} b={46.6} x={410} y={570} size={140} />
      <Bubble a={40.95} b={46.9} x={40} by={450} w={740} tx={240} fs={48}
        text="তাহলে ওকে প্রাসাদে রাখাই ভালো। সোনার খাঁচা গড়ে দেব, গোটা রাজ্য ওর গান শুনবে।" />
      <PopIcon k="lock" a={53.6} b={54.6} x={860} y={840} size={110} />
    </AbsoluteFill>
  );
};

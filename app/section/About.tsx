"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');

  .ab-wrap {
    position:relative; background:#000; overflow:hidden;
    padding:clamp(5rem,10vh,8rem) 0 clamp(5rem,9vh,7rem); isolation:isolate;
  }

  .ab-grain-a,.ab-grain-b,.ab-grain-c{
    position:absolute;inset:0;z-index:1;pointer-events:none;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E");
    background-size:180px 180px;mix-blend-mode:overlay;
  }
  .ab-grain-a{opacity:.055;animation:grainA .18s steps(1) infinite}
  .ab-grain-b{opacity:.030;animation:grainB .22s steps(1) infinite;filter:hue-rotate(40deg)}
  .ab-grain-c{opacity:.020;animation:grainC .28s steps(1) infinite;filter:hue-rotate(200deg)}
  @keyframes grainA{0%{background-position:0 0}25%{background-position:-38px 16px}50%{background-position:20px -28px}75%{background-position:-14px 32px}}
  @keyframes grainB{0%{background-position:12px 6px}33%{background-position:-22px -8px}66%{background-position:30px 18px}}
  @keyframes grainC{0%{background-position:-6px 22px}50%{background-position:18px -14px}}

  .ab-scan{
    position:absolute;inset:0;z-index:2;pointer-events:none;
    background:repeating-linear-gradient(to bottom,transparent 0px,transparent 3px,rgba(0,0,0,0.055) 3px,rgba(0,0,0,0.055) 4px);
    opacity:.5;
  }

  .ab-blob-l{
    position:absolute;z-index:0;pointer-events:none;
    width:clamp(320px,45vw,600px);height:clamp(320px,45vw,600px);
    left:-12%;top:10%;border-radius:50%;
    background:radial-gradient(circle,rgba(30,80,255,.09) 0%,transparent 68%);
    animation:blobPulse 7s ease-in-out infinite;
  }
  .ab-blob-r{
    position:absolute;z-index:0;pointer-events:none;
    width:clamp(280px,40vw,520px);height:clamp(280px,40vw,520px);
    right:-10%;bottom:5%;border-radius:50%;
    background:radial-gradient(circle,rgba(100,30,255,.07) 0%,transparent 68%);
    animation:blobPulse 9s ease-in-out infinite reverse;
  }
  @keyframes blobPulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.15);opacity:.7}}

  .ab-topline{
    position:absolute;top:0;left:0;right:0;height:1px;z-index:3;
    background:linear-gradient(90deg,transparent 0%,rgba(255,255,255,.08) 25%,rgba(80,140,255,.18) 50%,rgba(255,255,255,.08) 75%,transparent 100%);
  }

  .ab-inner{
    position:relative;z-index:4;
    max-width:1200px;margin:0 auto;
    padding:0 clamp(1.5rem,5vw,3.5rem);
    display:flex;flex-direction:column;align-items:center;
  }

  /* ── HEADING ─────────────────────────────────────────────────────────── */
  .ab-head{text-align:center;max-width:760px;margin-bottom:clamp(2.5rem,5vw,4rem)}

  .ab-eyebrow{
    font-family:'DM Sans',sans-serif;
    font-size:clamp(.6rem,.85vw,.7rem);font-weight:400;
    color:rgba(255,255,255,.22);letter-spacing:.38em;text-transform:uppercase;
    margin-bottom:.9rem;
    opacity:0;transform:translateY(10px);
    transition:opacity .6s ease,transform .6s ease;
  }
  .ab-eyebrow.show{opacity:1;transform:none}

  /* Line-wipe title */
  .ab-title-wrap{position:relative;display:inline-block;margin:0 0 clamp(.9rem,1.8vw,1.3rem)}
  .ab-title{
    font-family:'DM Sans',sans-serif;font-weight:700;
    font-size:clamp(2.4rem,5.5vw,4.8rem);
    color:#fff;letter-spacing:-.035em;line-height:1.06;
    margin:0;
    opacity:0;transform:translateY(26px);
    transition:opacity .9s ease .1s,transform .9s ease .1s;
  }
  .ab-title.show{opacity:1;transform:none}
  .ab-title-line{
    position:absolute;bottom:-6px;left:0;height:2px;width:0;
    background:linear-gradient(90deg,rgba(80,140,255,.85),rgba(160,80,255,.6),transparent);
    border-radius:2px;
    transition:width 1.1s cubic-bezier(.25,1,.5,1) .65s;
  }
  .ab-title-line.show{width:100%}

  .ab-desc{
    font-family:'DM Sans',sans-serif;font-weight:400;
    font-size:clamp(.86rem,1.15vw,1rem);
    color:rgba(255,255,255,.38);line-height:1.80;
    opacity:0;transform:translateY(16px);
    transition:opacity .85s ease .22s,transform .85s ease .22s;
  }
  .ab-desc.show{opacity:1;transform:none}

  /* ── DESKTOP ORBIT STAGE ─────────────────────────────────────────────── */
  .ab-stage{
    position:relative;
    width:min(880px,96vw);height:clamp(320px,54vw,520px);
    margin-bottom:clamp(2rem,4vw,3.5rem);
    opacity:0;transition:opacity 1s ease .3s;
  }
  .ab-stage.show{opacity:1}
  .ab-orbit{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible}

  .ab-particles{position:absolute;inset:0;pointer-events:none;overflow:hidden}
  .ab-particle{
    position:absolute;border-radius:50%;
    background:rgba(80,140,255,.5);
    animation:partFloat linear infinite;
  }
  @keyframes partFloat{0%,100%{transform:translateY(0) scale(1)}33%{transform:translateY(-18px) scale(1.2)}66%{transform:translateY(-8px) scale(.85)}}

  .ab-illus-wrap{
    position:absolute;left:50%;top:50%;
    transform:translate(-50%,-50%);
    width:clamp(220px,34%,310px);
    transform-style:preserve-3d;transition:transform .12s ease;cursor:pointer;
  }
  .ab-illus{
    width:100%;display:block;
    animation:abFloat 5s ease-in-out infinite;
    filter:drop-shadow(0 22px 55px rgba(70,130,255,.30)) drop-shadow(0 4px 18px rgba(120,80,255,.20));
    transition:filter .4s ease;
  }
  .ab-illus-wrap:hover .ab-illus{
    filter:drop-shadow(0 28px 70px rgba(70,130,255,.50)) drop-shadow(0 8px 28px rgba(120,80,255,.35));
  }
  @keyframes abFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}

  /* ── DESKTOP TAGS — pop + bounce ─────────────────────────────────────── */
  .ab-tag{
    position:absolute;
    font-family:'DM Sans',sans-serif;
    font-size:clamp(.68rem,1vw,.82rem);font-weight:600;
    color:#fff;white-space:nowrap;
    padding:.54rem 1.25rem;border-radius:9px;
    background:rgba(6,12,26,.65);
    backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);
    border:1px solid transparent;cursor:default;
    opacity:0;transform:translateX(var(--tx,0)) scale(.85);
    transition:
      opacity .6s cubic-bezier(.16,1,.3,1) var(--td,0s),
      transform .7s cubic-bezier(.34,1.56,.64,1) var(--td,0s),
      box-shadow .3s ease;
  }
  .ab-tag.show{opacity:1;transform:translateX(0) scale(1)}
  .ab-tag::before{
    content:'';position:absolute;inset:-1px;border-radius:10px;padding:1.5px;
    background:linear-gradient(135deg,rgba(255,255,255,.60) 0%,var(--glow-a,rgba(40,110,250,.80)) 25%,rgba(10,30,80,.18) 50%,var(--glow-b,rgba(45,120,255,.90)) 75%,rgba(255,255,255,.50) 100%);
    -webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
    -webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none;transition:background .4s ease;
  }
  .ab-tag::after{
    content:'';position:absolute;inset:0;border-radius:10px;
    background:radial-gradient(circle at 50% 120%,var(--glow-b,rgba(45,120,255,.28)) 0%,transparent 68%);
    opacity:.38;pointer-events:none;transition:opacity .4s ease;
  }
  .ab-tag:hover{box-shadow:inset 0 0 16px var(--glow-b,rgba(45,125,255,.5)),0 0 26px var(--glow-b,rgba(24,88,238,.28)),0 8px 26px rgba(0,0,0,.4)}
  .ab-tag:hover::before{background:linear-gradient(225deg,rgba(255,255,255,.95) 0%,var(--glow-a,rgba(65,145,255,1)) 30%,rgba(15,45,120,.38) 50%,var(--glow-b,rgba(90,170,255,1)) 80%,rgba(255,255,255,.90) 100%)}
  .ab-tag:hover::after{opacity:.58}

  .ab-t-uiux      {--glow-a:rgba(255,100,200,.85);--glow-b:rgba(255,80,180,.90);top:16%;left:1%;--tx:-20px;--td:.35s}
  .ab-t-cloud     {--glow-a:rgba(80,200,255,.85);--glow-b:rgba(60,190,255,.90);top:46%;left:-1%;--tx:-20px;--td:.42s}
  .ab-t-marketing {--glow-a:rgba(255,180,50,.85);--glow-b:rgba(255,165,30,.90);top:76%;left:2%;--tx:-20px;--td:.50s}
  .ab-t-web       {--glow-a:rgba(80,255,180,.85);--glow-b:rgba(60,240,160,.90);top:16%;right:1%;--tx:20px;--td:.35s}
  .ab-t-app       {--glow-a:rgba(140,80,255,.85);--glow-b:rgba(120,60,255,.90);top:46%;right:-1%;--tx:20px;--td:.42s}
  .ab-t-ai        {--glow-a:rgba(255,120,80,.85);--glow-b:rgba(255,100,60,.90);top:76%;right:2%;--tx:20px;--td:.50s}

  /* ── MOBILE LAYOUT ───────────────────────────────────────────────────── */
  .ab-mobile-layout{display:none}

  .ab-mobile-illus-wrap{
    display:flex;justify-content:center;
    margin-bottom:2rem;
    opacity:0;transform:translateY(24px) scale(0.95);
    transition:opacity .85s ease .1s,transform .85s ease .1s;
  }
  .ab-mobile-illus-wrap.show{opacity:1;transform:none}
  .ab-mobile-illus{
    width:clamp(160px,55vw,240px);display:block;
    animation:abFloat 5s ease-in-out infinite;
    filter:drop-shadow(0 18px 40px rgba(70,130,255,.35)) drop-shadow(0 4px 14px rgba(120,80,255,.20));
  }

  .ab-mobile-tags{
    display:flex;flex-direction:column;align-items:center;gap:.85rem;
    margin-bottom:2.4rem;
  }

  /* Mobile tags — pop + bounce */
  .ab-mtag{
    position:relative;
    font-family:'DM Sans',sans-serif;
    font-size:.8rem;font-weight:600;
    color:#fff;white-space:nowrap;
    padding:.58rem 1.5rem;border-radius:9px;
    background:rgba(6,12,26,.65);
    backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);
    border:1px solid transparent;cursor:default;
    opacity:0;transform:translateY(22px) scale(.88);
    transition:
      opacity .55s cubic-bezier(.16,1,.3,1) var(--mt-delay,0s),
      transform .65s cubic-bezier(.34,1.56,.64,1) var(--mt-delay,0s),
      box-shadow .3s ease;
  }
  .ab-mtag.show{opacity:1;transform:none}
  .ab-mtag::before{
    content:'';position:absolute;inset:-1px;border-radius:10px;padding:1.5px;
    background:linear-gradient(135deg,rgba(255,255,255,.60) 0%,var(--glow-a,rgba(40,110,250,.80)) 25%,rgba(10,30,80,.18) 50%,var(--glow-b,rgba(45,120,255,.90)) 75%,rgba(255,255,255,.50) 100%);
    -webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
    -webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none;
  }
  .ab-mtag::after{
    content:'';position:absolute;inset:0;border-radius:10px;
    background:radial-gradient(circle at 50% 120%,var(--glow-b,rgba(45,120,255,.28)) 0%,transparent 68%);
    opacity:.38;pointer-events:none;
  }
  .ab-mtag:hover{box-shadow:inset 0 0 14px var(--glow-b,rgba(45,125,255,.5)),0 0 20px var(--glow-b,rgba(24,88,238,.25)),0 6px 20px rgba(0,0,0,.4)}

  .ab-mt-uiux      {--glow-a:rgba(255,100,200,.85);--glow-b:rgba(255,80,180,.90);--mt-delay:.20s}
  .ab-mt-web       {--glow-a:rgba(80,255,180,.85);--glow-b:rgba(60,240,160,.90);--mt-delay:.28s}
  .ab-mt-app       {--glow-a:rgba(140,80,255,.85);--glow-b:rgba(120,60,255,.90);--mt-delay:.36s}
  .ab-mt-cloud     {--glow-a:rgba(80,200,255,.85);--glow-b:rgba(60,190,255,.90);--mt-delay:.44s}
  .ab-mt-marketing {--glow-a:rgba(255,180,50,.85);--glow-b:rgba(255,165,30,.90);--mt-delay:.52s}
  .ab-mt-ai        {--glow-a:rgba(255,120,80,.85);--glow-b:rgba(255,100,60,.90);--mt-delay:.60s}

  /* ── LANGUAGE PILLS — shimmer ────────────────────────────────────────── */
  .ab-langs{
    display:flex;flex-wrap:wrap;gap:.65rem;justify-content:center;
    max-width:800px;margin-bottom:clamp(2rem,4vw,3rem);
    opacity:0;transform:translateY(14px);
    transition:opacity .85s ease .50s,transform .85s ease .50s;
  }
  .ab-langs.show{opacity:1;transform:none}
  .ab-lang{
    display:inline-flex;align-items:center;gap:.45rem;
    font-family:'DM Sans',sans-serif;
    font-size:clamp(.66rem,.95vw,.76rem);font-weight:500;
    color:rgba(255,255,255,.52);letter-spacing:.03em;
    padding:.38rem 1rem;border-radius:999px;
    border:1px solid rgba(255,255,255,.08);
    background:rgba(255,255,255,.03);
    position:relative;overflow:hidden;cursor:default;
    transition:color .3s ease,border-color .3s ease,transform .3s cubic-bezier(.25,1,.5,1);
  }
  /* Shimmer sweep */
  .ab-lang::before{
    content:'';position:absolute;top:0;left:-120%;width:60%;height:100%;
    background:linear-gradient(90deg,transparent,rgba(255,255,255,.14),transparent);
    transition:left .6s ease;
  }
  .ab-lang:hover::before{left:170%}
  .ab-lang:hover{
    color:rgba(255,255,255,.92);
    border-color:rgba(255,255,255,.26);
    transform:translateY(-2px) scale(1.04);
  }
  .ab-lang-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0}

  /* ── BUTTONS ─────────────────────────────────────────────────────────── */
  .ab-btns{
    display:flex;flex-wrap:wrap;gap:1.4rem;justify-content:center;
    opacity:0;transform:translateY(22px);
    transition:opacity .85s ease .58s,transform .85s ease .58s;
  }
  .ab-btns.show{opacity:1;transform:none}

  .ab-btn{
    position:relative;
    font-family:'DM Sans',sans-serif;font-weight:500;
    font-size:clamp(.84rem,1.1vw,.95rem);
    padding:.65rem 2.6rem;border-radius:12px;
    text-decoration:none;display:inline-flex;
    align-items:center;justify-content:center;
    gap:.5rem;cursor:pointer;overflow:hidden;
    color:#fff;
    background:linear-gradient(180deg,rgba(7,18,40,.56) 0%,rgba(3,8,19,.13) 100%);
    border:1px solid transparent;
    transition:transform .4s cubic-bezier(.25,1,.5,1),box-shadow .4s ease,color .3s ease;
  }
  .ab-btn-inner{position:relative;z-index:1;display:block;pointer-events:none;transition:transform .4s cubic-bezier(.25,1,.5,1)}
  .ab-btn-ripple{
    position:absolute;border-radius:50%;
    background:rgba(255,255,255,.15);
    transform:scale(0);pointer-events:none;
    animation:abBtnRipple .55s ease-out forwards;
  }
  @keyframes abBtnRipple{to{transform:scale(4);opacity:0}}
  .ab-btn::before{
    content:'';position:absolute;inset:-1px;border-radius:13px;padding:1.5px;
    background:linear-gradient(135deg,rgba(255,255,255,.70) 0%,rgba(40,110,250,.80) 25%,rgba(10,30,80,.18) 50%,rgba(45,120,255,.90) 75%,rgba(255,255,255,.60) 100%);
    -webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
    -webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none;transition:background .4s ease;
  }
  .ab-btn::after{
    content:'';position:absolute;inset:0;border-radius:12px;
    background:radial-gradient(circle at 50% 120%,rgba(45,130,255,.28) 0%,transparent 68%);
    opacity:.38;pointer-events:none;transition:opacity .4s ease;
  }
  .ab-btn:hover{
    color:rgba(255,255,255,.96);transform:translateY(-3px);
    box-shadow:inset 0 0 18px rgba(45,125,255,.55),0 0 28px rgba(24,88,238,.30),0 8px 28px rgba(0,0,0,.40);
  }
  .ab-btn:hover::before{background:linear-gradient(225deg,rgba(255,255,255,.95) 0%,rgba(65,145,255,1.00) 30%,rgba(15,45,120,.38) 50%,rgba(90,170,255,1.00) 80%,rgba(255,255,255,.90) 100%)}
  .ab-btn:hover::after{opacity:.58}
  .ab-btn:active{transform:translateY(-1px) scale(.98) !important}
  .ab-btn.secondary::before{background:linear-gradient(135deg,rgba(255,255,255,.38) 0%,rgba(35,85,185,.48) 30%,rgba(5,15,40,.10) 60%,rgba(35,90,200,.58) 100%)}
  .ab-btn.secondary:hover::before{background:linear-gradient(225deg,rgba(255,255,255,.78) 0%,rgba(55,120,240,.90) 30%,rgba(10,30,90,.28) 50%,rgba(70,140,255,.95) 80%,rgba(255,255,255,.72) 100%)}

  /* ── RESPONSIVE ──────────────────────────────────────────────────────── */
  @media(max-width:640px){
    .ab-stage{display:none}
    .ab-mobile-layout{display:block}
    .ab-btns{flex-direction:column;align-items:stretch;max-width:260px;gap:.9rem}
    .ab-btn{padding:.9rem 1.6rem}
    .ab-head{margin-bottom:1.8rem}
  }
  @media(prefers-reduced-motion:reduce){
    *,*::before,*::after{animation-duration:.01ms!important;transition-duration:.01ms!important}
  }
`;

function OrbitLines() {
  return (
    <svg className="ab-orbit" viewBox="0 0 880 520" fill="none"
      xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id="agL" cx="0%" cy="50%" r="100%">
          <stop offset="0%" stopColor="rgba(80,140,255,0.18)"/>
          <stop offset="100%" stopColor="rgba(80,140,255,0)"/>
        </radialGradient>
        <radialGradient id="agR" cx="100%" cy="50%" r="100%">
          <stop offset="0%" stopColor="rgba(140,80,255,0.18)"/>
          <stop offset="100%" stopColor="rgba(140,80,255,0)"/>
        </radialGradient>
      </defs>
      <path d="M 190 85 Q 100 260 190 435" stroke="url(#agL)" strokeWidth="1.2" strokeDasharray="6 8"/>
      <path d="M 690 85 Q 780 260 690 435" stroke="url(#agR)" strokeWidth="1.2" strokeDasharray="6 8"/>
      <line x1="252" y1="99"  x2="375" y2="195" stroke="rgba(255,255,255,.05)" strokeWidth=".8"/>
      <line x1="230" y1="260" x2="368" y2="260" stroke="rgba(255,255,255,.05)" strokeWidth=".8"/>
      <line x1="254" y1="421" x2="376" y2="325" stroke="rgba(255,255,255,.05)" strokeWidth=".8"/>
      <line x1="628" y1="99"  x2="505" y2="195" stroke="rgba(255,255,255,.05)" strokeWidth=".8"/>
      <line x1="650" y1="260" x2="512" y2="260" stroke="rgba(255,255,255,.05)" strokeWidth=".8"/>
      <line x1="626" y1="421" x2="504" y2="325" stroke="rgba(255,255,255,.05)" strokeWidth=".8"/>
      {[[375,195],[368,260],[376,325],[505,195],[512,260],[504,325]].map(([cx,cy],i)=>(
        <circle key={i} cx={cx} cy={cy} r="2.5" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth=".8"/>
      ))}
    </svg>
  );
}

function Particles() {
  const list = Array.from({length:18},(_,i)=>({
    id:i, size:2+(i%4),
    left:`${15+(i*37)%70}%`, top:`${10+(i*53)%80}%`,
    dur:`${8+(i%6)*2}s`, delay:`${-(i*1.1)}s`,
    opacity:.15+(i%4)*.12,
  }));
  return (
    <div className="ab-particles" aria-hidden="true">
      {list.map(p=>(
        <div key={p.id} className="ab-particle" style={{
          width:p.size, height:p.size, left:p.left, top:p.top,
          opacity:p.opacity, animationDuration:p.dur, animationDelay:p.delay,
        }}/>
      ))}
    </div>
  );
}

const LEFT_TAGS = [
  {label:"UI/UX Design",       cls:"ab-t-uiux"},
  {label:"Cloud Hosting",      cls:"ab-t-cloud"},
  {label:"Digital Marketing",  cls:"ab-t-marketing"},
];
const RIGHT_TAGS = [
  {label:"Web Development",    cls:"ab-t-web"},
  {label:"App Development",    cls:"ab-t-app"},
  {label:"AI & ML Integration",cls:"ab-t-ai"},
];
const MOBILE_TAGS = [
  {label:"UI/UX Design",       cls:"ab-mt-uiux"},
  {label:"Web Development",    cls:"ab-mt-web"},
  {label:"App Development",    cls:"ab-mt-app"},
  {label:"Cloud Hosting",      cls:"ab-mt-cloud"},
  {label:"Digital Marketing",  cls:"ab-mt-marketing"},
  {label:"AI & ML Integration",cls:"ab-mt-ai"},
];
const LANGS = [
  {name:"Dart",        color:"#54C5F8"},
  {name:"Flutter",     color:"#45D1FD"},
  {name:"React.js",    color:"#61DAFB"},
  {name:"Next.js",     color:"#ffffff"},
  {name:"TypeScript",  color:"#3178C6"},
  {name:"Node.js",     color:"#68A063"},
  {name:"Firebase",    color:"#FFCA28"},
  {name:"FlutterFlow", color:"#B259FF"},
  {name:"Tailwind",    color:"#38BDF8"},
  {name:"REST APIs",   color:"#FF7262"},
];

export default function About() {
  const [v, setV] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const illusRef   = useRef<HTMLDivElement>(null);
  const btn1Ref    = useRef<HTMLAnchorElement>(null);
  const btn2Ref    = useRef<HTMLAnchorElement>(null);

  useEffect(()=>{
    const el=sectionRef.current; if(!el) return;
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting) setV(true)},{threshold:.10});
    obs.observe(el);
    return ()=>obs.disconnect();
  },[]);

  const onMouseMove = useCallback((e:React.MouseEvent<HTMLDivElement>)=>{
    const w=illusRef.current; if(!w) return;
    const r=w.getBoundingClientRect();
    const dx=(e.clientX-r.left-r.width/2)/(r.width/2);
    const dy=(e.clientY-r.top-r.height/2)/(r.height/2);
    w.style.transform=`translate(-50%,-50%) rotateY(${dx*14}deg) rotateX(${-dy*10}deg) scale(1.04)`;
  },[]);
  const onMouseLeave = useCallback(()=>{
    if(illusRef.current)
      illusRef.current.style.transform="translate(-50%,-50%) rotateY(0deg) rotateX(0deg) scale(1)";
  },[]);

  /* Magnetic + ripple buttons */
  const makeMagnetic = useCallback((ref: React.RefObject<HTMLAnchorElement>) => {
    const btn = ref.current; if(!btn) return;
    const inner = btn.querySelector<HTMLElement>(".ab-btn-inner");
    const onMove = (e: MouseEvent) => {
      const r = btn.getBoundingClientRect();
      const dx = (e.clientX-r.left-r.width/2)*.3;
      const dy = (e.clientY-r.top-r.height/2)*.3;
      btn.style.transform=`translate(${dx}px,${dy}px) scale(1.04)`;
      if(inner) inner.style.transform=`translate(${dx*.55}px,${dy*.55}px)`;
    };
    const onLeave = () => { btn.style.transform=""; if(inner) inner.style.transform=""; };
    const onClick = (e: MouseEvent) => {
      const r=btn.getBoundingClientRect();
      const rp=document.createElement("span"); rp.className="ab-btn-ripple";
      const s=Math.max(r.width,r.height);
      rp.style.cssText=`width:${s}px;height:${s}px;left:${e.clientX-r.left-s/2}px;top:${e.clientY-r.top-s/2}px`;
      btn.appendChild(rp); rp.addEventListener("animationend",()=>rp.remove());
    };
    btn.addEventListener("mousemove",onMove);
    btn.addEventListener("mouseleave",onLeave);
    btn.addEventListener("click",onClick);
    return ()=>{btn.removeEventListener("mousemove",onMove);btn.removeEventListener("mouseleave",onLeave);btn.removeEventListener("click",onClick)};
  },[]);

  useEffect(()=>{ const c1=makeMagnetic(btn1Ref); const c2=makeMagnetic(btn2Ref); return ()=>{c1?.();c2?.();}; },[v,makeMagnetic]);

  return (
    <>
      <style dangerouslySetInnerHTML={{__html:css}}/>

      <section id="about" ref={sectionRef} className="ab-wrap">
        <div className="ab-topline"/>
        <div className="ab-blob-l" aria-hidden="true"/>
        <div className="ab-blob-r" aria-hidden="true"/>
        <div className="ab-grain-a" aria-hidden="true"/>
        <div className="ab-grain-b" aria-hidden="true"/>
        <div className="ab-grain-c" aria-hidden="true"/>
        <div className="ab-scan" aria-hidden="true"/>

        <div className="ab-inner">

          {/* Heading + description */}
          <div className="ab-head">
            <p className={`ab-eyebrow${v?" show":""}`}>Who I Am</p>
            <div className="ab-title-wrap">
              <h2 className={`ab-title${v?" show":""}`}>Meet Aniket Jamunde</h2>
              <div className={`ab-title-line${v?" show":""}`}/>
            </div>
            <p className={`ab-desc${v?" show":""}`}>
              I&apos;m a Web Developer &amp; Flutter Developer passionate about turning
              ideas into fast, beautiful, and user-friendly digital products.
              I build modern websites with React &amp; Next.js and cross-platform
              mobile apps with Flutter — blending clean code, smooth UX, and real
              business impact into every project I ship.
            </p>
          </div>

          {/* Desktop: orbit stage */}
          <div
            className={`ab-stage${v?" show":""}`}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
          >
            <OrbitLines/>
            <Particles/>
            {LEFT_TAGS.map(t=>(
              <div key={t.cls} className={`ab-tag ${t.cls}${v?" show":""}`}>{t.label}</div>
            ))}
            {RIGHT_TAGS.map(t=>(
              <div key={t.cls} className={`ab-tag ${t.cls}${v?" show":""}`}>{t.label}</div>
            ))}
            <div className="ab-illus-wrap" ref={illusRef}>
              <img src="/laptop.png" alt="3D laptop illustration" className="ab-illus" loading="lazy" decoding="async"/>
            </div>
          </div>

          {/* Mobile: laptop + stacked tags */}
          <div className="ab-mobile-layout">
            <div className={`ab-mobile-illus-wrap${v?" show":""}`}>
              <img src="/laptop.png" alt="3D laptop illustration" className="ab-mobile-illus" loading="lazy" decoding="async"/>
            </div>
            <div className="ab-mobile-tags">
              {MOBILE_TAGS.map(t=>(
                <div key={t.cls} className={`ab-mtag ${t.cls}${v?" show":""}`}>{t.label}</div>
              ))}
            </div>
          </div>

          {/* Tech stack pills with shimmer */}
          <div className={`ab-langs${v?" show":""}`}>
            {LANGS.map(({name,color})=>(
              <span key={name} className="ab-lang">
                <span className="ab-lang-dot" style={{background:color}}/>
                {name}
              </span>
            ))}
          </div>

          {/* CTA Buttons — magnetic + ripple */}
          <div className={`ab-btns${v?" show":""}`}>
            <a href="#contact" className="ab-btn" ref={btn1Ref}>
              <span className="ab-btn-inner">Hire Me</span>
            </a>
            <a href="/resume.pdf" download className="ab-btn secondary" ref={btn2Ref}>
              <span className="ab-btn-inner">Download CV</span>
            </a>
          </div>

        </div>
      </section>
    </>
  );
}
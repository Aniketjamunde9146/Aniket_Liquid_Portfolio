"use client";

import { useEffect, useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');

  .sp-wrap {
    position: fixed; inset: 0; z-index: 400;
    background: #000;
    display: flex; align-items: center; justify-content: center;
  }
  .sp-wrap.gone {
    transform: translateY(-100%);
    transition: transform 1.15s cubic-bezier(0.76, 0, 0.24, 1);
    pointer-events: none;
  }

  .sp-inner { display: flex; flex-direction: column; align-items: center; gap: 1.1rem; }

  .sp-headline-row {
    display: flex; gap: 0.3em; perspective: 600px;
    flex-wrap: wrap; justify-content: center;
  }

  .sp-word {
    display: inline-block;
    font-family: 'DM Sans', sans-serif; font-weight: 600;
    font-size: clamp(2.6rem, 7.5vw, 6.4rem);
    color: #fff; letter-spacing: -0.04em; line-height: 1.04;
    opacity: 0; transform: translateY(48px) rotateX(-25deg);
    transform-origin: 50% 100%;
    transition: opacity 0.82s cubic-bezier(0.16, 1, 0.3, 1),
                transform 0.82s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .sp-word.show { opacity: 1; transform: translateY(0) rotateX(0deg); }

  .sp-line {
    width: 0; height: 1.5px;
    background: linear-gradient(90deg,
      transparent 0%, rgba(255,255,255,0.75) 40%,
      rgba(255,255,255,0.75) 60%, transparent 100%
    );
    border-radius: 2px; opacity: 0;
    transition: width 1.4s cubic-bezier(0.25, 1, 0.5, 1) 0.48s,
                opacity 0.3s ease 0.48s;
  }
  .sp-line.show { width: 220px; opacity: 1; }

  .sp-sub {
    font-family: 'DM Sans', sans-serif;
    font-size: clamp(0.62rem, 1.15vw, 0.76rem); font-weight: 400;
    color: rgba(255,255,255,0.28); letter-spacing: 0.32em; text-transform: uppercase;
    opacity: 0; transform: translateY(8px);
    transition: opacity 0.72s ease 0.8s, transform 0.72s ease 0.8s;
  }
  .sp-sub.show { opacity: 1; transform: translateY(0); }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

const WORDS = ["Bring", "Ideas", "to", "Reality..."];

const T = {
  WORD_START : 160,
  WORD_STEP  : 110,
  LINE       : 620,
  SUB        : 920,
  GONE       : 2850,
} as const;

interface SplashProps {
  onDone?: () => void; // called when curtain finishes rising
}

export default function Splash({ onDone }: SplashProps) {
  const [words, setWords] = useState<boolean[]>(WORDS.map(() => false));
  const [line,  setLine]  = useState(false);
  const [sub,   setSub]   = useState(false);
  const [gone,  setGone]  = useState(false);

  useEffect(() => {
    const at = (fn: () => void, ms: number) => setTimeout(fn, ms);

    const wordIds = WORDS.map((_, i) =>
      at(() => setWords(prev => { const n = [...prev]; n[i] = true; return n; }),
        T.WORD_START + i * T.WORD_STEP)
    );

    const ids = [
      at(() => setLine(true), T.LINE),
      at(() => setSub(true),  T.SUB),
      at(() => setGone(true), T.GONE),
      // fire onDone after transition completes (1150ms)
      at(() => onDone?.(),    T.GONE + 1150),
    ];

    return () => [...wordIds, ...ids].forEach(clearTimeout);
  }, [onDone]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className={`sp-wrap${gone ? " gone" : ""}`} aria-hidden="true">
        <div className="sp-inner">
          <div className="sp-headline-row">
            {WORDS.map((word, i) => (
              <span
                key={i}
                className={`sp-word${words[i] ? " show" : ""}`}
                style={{ transitionDelay: `${i * 0.06}s` }}
              >
                {word}
              </span>
            ))}
          </div>
          <div className={`sp-line${line ? " show" : ""}`} />
          <div className={`sp-sub${sub  ? " show" : ""}`}>
            Aniket Jamunde — Portfolio
          </div>
        </div>
      </div>
    </>
  );
}
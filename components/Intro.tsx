"use client";

import { useEffect, useState, type CSSProperties } from "react";

const KEY = "ameaty-intro";
const at = (d: number) => ({ "--d": `${d}s` }) as CSSProperties;

// Braises en bas de l'écran : position (%), taille (rem), délai de pulsation (s)
const EMBERS = [
  [6, 7, 0], [18, 9, 0.3], [31, 6, 0.15], [44, 10, 0.45], [56, 8, 0.1], [69, 9, 0.35], [81, 6, 0.2], [93, 8, 0.5],
] as const;
// Étincelles : position de départ (%), dérive horizontale (px), délai (s)
const SPARKS = [
  [46, -40, 1.0], [52, 30, 1.08], [49, -12, 1.16], [55, 54, 1.22], [44, -70, 1.3], [51, 14, 1.36],
] as const;

/**
 * Ouverture (≤ 2 s, une fois par session, aucun son), tout en CSS (globals.css) :
 * écran noir → braises qui rougeoient en bas → flamme fine qui monte → « AMEATY » marqué au fer chaud
 * → « GRILL » et « אמיתי גריל » en fondu → quelques étincelles → fondu sur le hero.
 */
export function Intro({ skipLabel }: { skipLabel: string }) {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {}
      document.documentElement.classList.add("intro-seen");
    }, 2000);
    return () => clearTimeout(t);
  }, []);

  if (gone) return null;

  return (
    <div className="intro-curtain flex flex-col items-center justify-center text-cream" aria-hidden="false">
      <div className="intro-embers pointer-events-none absolute inset-x-0 bottom-0 h-24" aria-hidden="true">
        {EMBERS.map(([x, s, d]) => (
          <span key={x} style={{ insetInlineStart: `${x}%`, width: `${s}rem`, height: `${s * 0.7}rem`, animationDelay: `${d}s` }} />
        ))}
      </div>
      {SPARKS.map(([x, dx, d]) => (
        <span key={x} aria-hidden="true" className="intro-spark" style={{ left: `${x}%`, "--x": `${dx}px`, ...at(d) } as CSSProperties} />
      ))}

      <svg viewBox="0 0 24 40" className="intro-flame h-16 w-auto md:h-20" aria-hidden="true" fill="none" stroke="var(--color-copper)" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2c1.5 6.5 9 11.5 9 21a9 9 0 0 1-18 0c0-5 2.6-8.4 4.6-11.2.3 3.3 1.6 5.2 3.3 6.2C10.8 13 10.2 7.4 12 2Z" />
        <path d="M12 30.5c-2.3 0-3.8-1.6-3.8-3.9 0-2.4 1.7-4 2.8-6.1.5 1.8 1.3 2.7 2.1 3.2.2-1.2.9-2 1.6-2.7.5 1.2 1.1 2.7 1.1 4.4 0 2.9-1.5 5.1-3.8 5.1Z" fill="rgb(192 122 58 / 0.35)" />
      </svg>
      <p className="intro-brand mt-7 font-[family-name:var(--font-archivo)] text-[3rem] leading-none font-semibold tracking-[0.08em] [font-stretch:125%] md:text-[4.6rem]" dir="ltr" translate="no">
        AMEATY
      </p>
      <p className="intro-fade mt-4 ps-[0.7em] font-[family-name:var(--font-archivo)] text-[0.75rem] tracking-[0.7em] text-gold [font-stretch:112%]" style={at(1.1)} dir="ltr" translate="no">
        GRILL
      </p>
      <p className="intro-fade mt-4 font-[family-name:var(--font-suez)] text-[1.7rem] leading-none text-cream/90" style={at(1.22)} dir="rtl" lang="he" translate="no">
        אמיתי גריל
      </p>
      <button
        type="button"
        onClick={() => {
          try {
            sessionStorage.setItem(KEY, "1");
          } catch {}
          document.documentElement.classList.add("intro-seen");
          setGone(true);
        }}
        className="nav-link absolute end-4 bottom-4 z-10 min-h-11 px-4 text-cream/70 transition-colors hover:text-cream"
      >
        {skipLabel}
      </button>
    </div>
  );
}

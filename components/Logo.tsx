/**
 * Logo typographique (la photo de profil Instagram est un portrait de Yonathan, pas un logo) :
 * « AMEATY » en capitales larges (Archivo élargie) avec « MEAT » en cuivre, « GRILL » en petit très espacé,
 * une flamme fine au trait et la version hébraïque « אמיתי גריל » (Suez One).
 * Facile à remplacer : il suffit de changer ces composants (et app/icon.svg pour le favicon).
 */

/** Flamme fine au trait (viewBox 0 0 24 40). */
export function Flame({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 40" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2c1.5 6.5 9 11.5 9 21a9 9 0 0 1-18 0c0-5 2.6-8.4 4.6-11.2.3 3.3 1.6 5.2 3.3 6.2C10.8 13 10.2 7.4 12 2Z" />
      <path d="M12 30.5c-2.3 0-3.8-1.6-3.8-3.9 0-2.4 1.7-4 2.8-6.1.5 1.8 1.3 2.7 2.1 3.2.2-1.2.9-2 1.6-2.7.5 1.2 1.1 2.7 1.1 4.4 0 2.9-1.5 5.1-3.8 5.1Z" opacity="0.7" />
    </svg>
  );
}

/** « AMEATY » avec « MEAT » mis en valeur. */
export function Ameaty({ className = "" }: { className?: string }) {
  return (
    <span className={`font-[family-name:var(--font-archivo)] font-semibold tracking-[0.08em] [font-stretch:125%] ${className}`} dir="ltr" translate="no">
      A<span className="text-copper">MEAT</span>Y
    </span>
  );
}

/** Marque du header : flamme + AMEATY / GRILL · אמיתי גריל. */
export function Wordmark({ className = "", sub = true }: { className?: string; sub?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`} translate="no">
      <Flame className="h-7 w-auto text-copper md:h-8" />
      <span className="flex flex-col items-center leading-none">
        <Ameaty className="text-[1.15rem] md:text-[1.4rem]" />
        {sub && (
          <span className="mt-1.5 flex items-center gap-2 text-[0.5rem] whitespace-nowrap opacity-85 md:text-[0.5625rem]">
            <span className="font-[family-name:var(--font-archivo)] tracking-[0.5em] [font-stretch:112%]" dir="ltr">
              GRILL
            </span>
            <span aria-hidden="true" className="h-2 w-px bg-current opacity-50" />
            <span className="font-[family-name:var(--font-suez)] text-[0.75rem] tracking-normal md:text-[0.8125rem]" dir="rtl" lang="he">
              אמיתי גריל
            </span>
          </span>
        )}
      </span>
    </span>
  );
}

/** Version complète centrée (pied de page). */
export function LogoFull({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center text-center ${className}`} translate="no">
      <Flame className="h-14 w-auto text-copper" />
      <Ameaty className="mt-5 text-[2.6rem] leading-none" />
      <p className="mt-3 ps-[0.6em] font-[family-name:var(--font-archivo)] text-[0.75rem] tracking-[0.6em] opacity-85 [font-stretch:112%]" dir="ltr">
        GRILL
      </p>
      <p className="mt-4 font-[family-name:var(--font-suez)] text-[1.6rem] leading-none text-gold" dir="rtl" lang="he">
        אמיתי גריל
      </p>
    </div>
  );
}

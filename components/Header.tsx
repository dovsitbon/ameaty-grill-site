"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import site from "@/data/site.json";
import { Flame, Wordmark } from "@/components/Logo";
import { LangSwitch } from "@/components/LangSwitch";
import { CloseIcon, InstagramIcon, MenuIcon } from "@/components/icons";
import { useLocale } from "@/components/providers";

export function Header() {
  const { lang, d } = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    if (menu) lenis?.stop();
    else lenis?.start();
    document.body.style.overflow = menu ? "hidden" : "";
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu]);

  // En haut de l'accueil, le header flotte sur le hero (texte crème)
  const home = `/${lang}`;
  const onHero = usePathname() === home && !scrolled && !menu;
  const links = [
    { href: `${home}#chef`, label: d.nav.chef },
    { href: `${home}#formulas`, label: d.nav.formulas },
    { href: `${home}#events`, label: d.nav.events },
    { href: `${home}#gallery`, label: d.nav.gallery },
    { href: `${home}#contact`, label: d.nav.contact },
  ];

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,color,border-color] duration-700 ${
          onHero ? "border-b border-cream/15 text-cream" : "border-b border-copper/20 bg-charcoal/92 text-cream backdrop-blur-sm"
        }`}
      >
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-10 focus:bg-cream focus:px-4 focus:py-2 focus:text-charcoal">
          {d.nav.skip}
        </a>
        <div className="grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 md:h-[5.25rem] md:px-10">
          <div className="flex items-center">
            <button type="button" className="-m-2 flex h-11 w-11 items-center justify-center min-[1280px]:hidden" onClick={() => setMenu(true)} aria-label={d.nav.menu} aria-expanded={menu}>
              <MenuIcon />
            </button>
            <nav className="hidden items-center gap-7 min-[1280px]:flex" aria-label={d.nav.menu}>
              {links.map((l) => (
                <Link key={l.href} href={l.href} className="nav-link whitespace-nowrap transition-opacity duration-500 hover:opacity-60">
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          <Link href={home} className="flex items-center" aria-label={d.nav.home}>
            <Wordmark className="transition-colors duration-700" />
          </Link>

          <div className="flex items-center justify-end gap-4 md:gap-6">
            <LangSwitch lang={lang} label={d.nav.language} className="hidden lg:flex" />
            <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="-m-2 hidden h-11 w-11 items-center justify-center transition-opacity hover:opacity-60 lg:flex" aria-label="Instagram">
              <InstagramIcon />
            </a>
            <Link
              href={`${home}#contact`}
              className={`nav-link flex min-h-10 items-center rounded-full border px-4 whitespace-nowrap transition-colors duration-500 md:px-5 ${
                onHero ? "border-cream/70 hover:bg-cream hover:text-charcoal" : "border-braise bg-braise text-cream hover:border-braise-deep hover:bg-braise-deep"
              }`}
            >
              <span className="hidden sm:inline">{d.nav.quote}</span>
              <span className="sm:hidden">{d.nav.quoteShort}</span>
            </Link>
          </div>
        </div>
      </header>

      {menu && (
          <div
            className="fade-in fixed inset-0 z-[60] flex flex-col overscroll-contain bg-charcoal text-cream"
            role="dialog"
            aria-modal="true"
            aria-label={d.nav.menu}
          >
            <div className="grid h-16 grid-cols-[1fr_auto_1fr] items-center px-4 md:h-[5.25rem] md:px-10">
              <button type="button" className="-m-2 flex h-11 w-11 items-center justify-center justify-self-start" onClick={() => setMenu(false)} aria-label={d.nav.close}>
                <CloseIcon />
              </button>
              <Wordmark />
              <span />
            </div>
            <nav className="flex flex-1 flex-col items-center justify-center gap-6" aria-label={d.nav.menu}>
              {links.map((l, i) => (
                <div key={l.href} className="fade-up" style={{ animationDelay: `${0.06 * i + 0.1}s` }}>
                  <Link href={l.href} onClick={() => setMenu(false)} className="display text-[2.1rem] rtl:text-[2rem]">
                    {l.label}
                  </Link>
                </div>
              ))}
              <div className="fade-in mt-6" style={{ animationDelay: "0.5s" }}>
                <Link href={`${home}#contact`} onClick={() => setMenu(false)} className="btn-solid">
                  {d.nav.quote}
                </Link>
              </div>
              <Flame className="mt-8 h-12 w-auto text-copper" />
            </nav>
            <div className="flex items-center justify-between border-t border-cream/15 px-6 py-4">
              <LangSwitch lang={lang} label={d.nav.language} />
              <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center gap-2 text-sm">
                <InstagramIcon />
                <span dir="ltr">{site.instagramHandle}</span>
              </a>
            </div>
          </div>
        )}
    </>
  );
}

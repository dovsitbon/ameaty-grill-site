import Image from "next/image";
import Link from "next/link";
import site from "@/data/site.json";
import { QuoteForm } from "@/components/QuoteForm";
import { Gallery, type GalleryItem } from "@/components/Gallery";
import { InstagramIcon, PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { Flame } from "@/components/Logo";
import { LoopVideo } from "@/components/LoopVideo";
import { PickMenu } from "@/components/PickMenu";
import { Reveal } from "@/components/Reveal";
import { altOf, fill, getDict, type Dict, type Locale } from "@/lib/i18n";
import { homeJsonLd } from "@/lib/jsonld";
import { img } from "@/lib/media";
import { bar, formulas, menuSections, pricesConfirmed, shekels, waLink } from "@/lib/quote";

function Photo({ d, src, sizes, className = "", priority = false }: { d: Dict; src: string; sizes: string; className?: string; priority?: boolean }) {
  return <Image src={img(src).src} alt={altOf(d, src)} fill sizes={sizes} quality={70} priority={priority} className={`object-cover ${className}`} />;
}

function SectionHead({ eyebrow, title, text, center = false, id }: { eyebrow: string; title: string; text?: string; center?: boolean; id?: string }) {
  return (
    <Reveal className={center ? "mx-auto max-w-3xl text-center" : "max-w-2xl"}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id} className="display mt-6 text-[2.5rem] md:text-[3.9rem] rtl:text-[2.5rem] md:rtl:text-[3.7rem]">
        {title}
      </h2>
      {text && <p className={`lead mt-6 ${center ? "mx-auto max-w-xl" : ""}`}>{text}</p>}
    </Reveal>
  );
}

/** Petit filet cuivré avec une flamme au centre, entre deux blocs. */
function Rule({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-4 text-copper ${className}`} aria-hidden="true">
      <span className="h-px w-16 bg-copper/50" />
      <Flame className="h-5 w-auto" />
      <span className="h-px w-16 bg-copper/50" />
    </div>
  );
}

const num = (i: number, pad = 3) => String(i + 1).padStart(pad, "0");

const PILLARS = ["/media/grill/entrecotes-sur-le-grill.jpg", "/media/sur-table/flambe-planche.jpg", "/media/bar/bar-bois-terrasse.jpg"];
const PILLAR_LINKS = ["#formulas", "#formulas", "#bar"];
const EVENTS = [
  "/media/evenements/soiree-terrasse-nuit.jpg",
  "/media/evenements/flambe-invites.jpg",
  "/media/evenements/terrasse-tables.jpg",
  "/media/evenements/chef-decoupe-soiree.jpg",
  "/media/sur-table/sandwichs-planche.jpg",
];
const GALLERY: [string, GalleryItem["cat"]][] = [
  ["/media/hero/tomahawks-grill.jpg", "grill"],
  ["/media/sur-table/carpaccio.jpg", "table"],
  ["/media/grill/brochettes-grill.jpg", "grill"],
  ["/media/evenements/chef-decoupe-soiree.jpg", "events"],
  ["/media/sur-table/planche-ail-confit.jpg", "table"],
  ["/media/grill/cotes-crues-planche.jpg", "grill"],
  ["/media/sur-table/bruschettas-boeuf-seche.jpg", "table"],
  ["/media/evenements/terrasse-tables.jpg", "events"],
  ["/media/grill/tomahawk-planche-fumee.jpg", "grill"],
  ["/media/sur-table/filet-tranche-planche.jpg", "table"],
  ["/media/grill/aubergines-braise.jpg", "grill"],
  ["/media/sur-table/houmous-viande.jpg", "table"],
  ["/media/evenements/flambe-invites.jpg", "events"],
  ["/media/grill/entrecotes-romarin.jpg", "grill"],
  ["/media/sur-table/entrecotes-poele.jpg", "table"],
  ["/media/grill/cote-de-boeuf-grill.jpg", "grill"],
  ["/media/sur-table/caviar-aubergine.jpg", "table"],
  ["/media/evenements/soiree-terrasse-nuit.jpg", "events"],
  ["/media/sur-table/kebabs-tahini.jpg", "table"],
  ["/media/grill/entrecotes-crues.jpg", "grill"],
  ["/media/sur-table/viande-confite.jpg", "table"],
  ["/media/bar/verres-bar.jpg", "events"],
  ["/media/sur-table/legumes-rotis.jpg", "table"],
  ["/media/sur-table/crudo-saumon.jpg", "table"],
];

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang: l } = await params;
  const lang = l as Locale;
  const d = getDict(lang);
  const lightbox = { close: d.lightbox.close, prev: d.lightbox.prev, next: d.lightbox.next, counter: d.lightbox.counter };
  const gallery: GalleryItem[] = GALLERY.map(([src, cat]) => ({ ...img(src), alt: altOf(d, src), cat }));
  const tel = `tel:${site.phoneIntl.replace(/[\s-]/g, "")}`;
  const he = lang === "he";

  const Price = ({ from, min }: { from: number; min: number }) => (
    <div>
      {/* À REMPLIR : prix d'exemple tant que pricesConfirmed vaut false (data/formules.json) */}
      <p className="flex flex-wrap items-baseline gap-x-2">
        <span className="text-[0.875rem] text-muted">{d.formulas.from}</span>
        <span className="display text-[2.4rem] leading-none text-cream">{shekels(from, lang)}</span>
        <span className="text-[0.875rem] text-muted">{d.formulas.perGuest}</span>
      </p>
      <p className="mt-2 text-[0.8125rem] text-muted">
        {fill(d.formulas.minGuests, { n: min })}
        {!pricesConfirmed && <span className="text-gold"> · {d.formulas.indicative}</span>}
      </p>
    </div>
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd(lang)) }} />

      {/* ——— Hero plein écran : la braise en vidéo, l'image dessous reste affichée tant que la vidéo charge ——— */}
      <section className="relative flex h-[100svh] min-h-[620px] items-end overflow-hidden bg-charcoal-deep" aria-labelledby="hero-title">
        <div className="drift absolute inset-0">
          {/* Grand écran : sa photo la plus nette (la vidéo des reels est verticale et trop petite pour 1440 px) ; mobile : la vidéo du grill */}
          <Photo d={d} src="/media/hero/grill-pinces-fumee.jpg" sizes="100vw" priority className="object-[50%_62%]" />
          <LoopVideo src="/media/video/grill.mp4" label={d.hero.video} fade className="absolute inset-0 h-full w-full object-cover object-[50%_55%] md:hidden" />
        </div>
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,9,9,0.78)_0%,rgba(11,9,9,0.3)_30%,rgba(11,9,9,0.5)_62%,rgba(11,9,9,0.96)_100%)]" />
        <div aria-hidden="true" className="ember-glow absolute inset-x-0 bottom-0 h-2/3" />
        <div className="relative mx-auto w-full max-w-[1400px] px-5 pb-[max(6rem,12svh)] text-center md:px-10 md:pb-28">
          <p className="eyebrow rise mx-auto !text-cream/90 max-sm:!text-[0.625rem] max-sm:!tracking-[0.2em]" style={{ animationDelay: "0.2s" }} dir="ltr">
            {d.hero.eyebrow}
          </p>
          <h1 id="hero-title" className="display rise mx-auto mt-7 max-w-5xl text-[3.2rem] leading-[0.98] md:text-[6rem] lg:text-[7.2rem] rtl:text-[3.6rem] md:rtl:text-[6.2rem] lg:rtl:text-[7.2rem]" style={{ animationDelay: "0.3s" }}>
            {d.hero.title}
          </h1>
          <p className="rise mx-auto mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-cream/85" style={{ animationDelay: "0.45s" }}>
            {d.hero.text}
          </p>
          <div className="rise mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6" style={{ animationDelay: "0.6s" }}>
            <Link href="#contact" className="btn-line min-w-60">
              {d.hero.cta}
            </Link>
            <a href={waLink(d.whatsapp.hello)} target="_blank" rel="noopener noreferrer" className="nav-link inline-flex min-h-12 items-center gap-2.5 px-4 text-cream/90 transition-colors hover:text-gold">
              <WhatsAppIcon className="h-4 w-4" />
              <span className="link-line">{d.hero.whatsapp}</span>
            </a>
          </div>
        </div>
        <a href="#manifesto" className="absolute bottom-0 left-1/2 hidden h-16 w-10 -translate-x-1/2 justify-center md:flex" aria-label={d.hero.scroll}>
          <span className="scroll-line block h-full w-px bg-copper" />
        </a>
      </section>

      {/* ——— Manifeste ——— */}
      <section id="manifesto" className="grain scroll-mt-20 px-5 pt-28 pb-20 md:pt-44 md:pb-28" aria-labelledby="manifesto-title">
        <Reveal className="mx-auto max-w-3xl text-center">
          <Flame className="mx-auto h-14 w-auto text-copper" />
          <p className="eyebrow mt-8">{d.manifesto.eyebrow}</p>
          <h2 id="manifesto-title" className="display mt-7 text-[2rem] md:text-[3.2rem] rtl:text-[2.1rem] md:rtl:text-[3.1rem]">
            {d.manifesto.title}
          </h2>
          <p className="lead mx-auto mt-8 max-w-2xl">{d.manifesto.text}</p>
          <a href="#what" className="link-line nav-link mt-10 inline-block text-gold">
            {d.manifesto.link}
          </a>
        </Reveal>

        {/* Réassurance */}
        <ul className="mx-auto mt-24 grid max-w-[1200px] grid-cols-2 border-y border-copper/25 md:mt-32 md:grid-cols-4">
          {d.trust.items.map((t, i) => (
            <Reveal as="li" key={t.title} delay={i * 0.08} className={`px-4 py-8 text-center md:py-10 ${i % 2 ? "border-s border-copper/25" : ""} ${i > 0 ? "md:border-s md:border-copper/25" : ""} ${i > 1 ? "max-md:border-t max-md:border-copper/25" : ""}`}>
              <p className="display text-[1.3rem] rtl:text-[1.35rem]">{t.title}</p>
              <p className="mt-2 text-[0.875rem] text-muted">{t.text}</p>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* ——— 001 / 002 / 003 ——— */}
      <section id="what" className="scroll-mt-20 bg-charcoal-soft px-5 py-24 md:px-10 md:py-36" aria-labelledby="pillars-title">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex items-end justify-between gap-6 border-b border-copper/30 pb-6">
            <h2 id="pillars-title" className="display text-[2rem] md:text-[2.6rem] rtl:text-[1.9rem] md:rtl:text-[2.4rem]">
              {d.pillars.title}
            </h2>
            <p className="eyebrow hidden sm:block">{d.pillars.eyebrow}</p>
          </div>
          <ul className="mt-12 grid gap-14 md:mt-16 md:grid-cols-3 md:gap-10">
            {d.pillars.items.map((p, i) => (
              <Reveal as="li" key={p.name} delay={i * 0.12}>
                <Link href={PILLAR_LINKS[i]} className="group block">
                  <div className="shine glow relative aspect-[4/5] border border-transparent bg-charcoal">
                    <Photo d={d} src={PILLARS[i]} sizes="(min-width: 768px) 31vw, 92vw" />
                  </div>
                  <p className="num mt-7 text-[0.8125rem] text-copper">{num(i)}</p>
                  <h3 className="display mt-3 text-[2.1rem] rtl:text-[2rem]">{p.name}</h3>
                  <p className="eyebrow mt-2 !text-muted">{p.label}</p>
                  <p className="mt-4 max-w-sm leading-[1.8] text-cream/75">{p.text}</p>
                  <span className="link-line nav-link mt-6 inline-block text-gold">{p.link}</span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ——— Pleine largeur ——— */}
      <section className="relative flex min-h-[88svh] items-center justify-center overflow-hidden bg-charcoal-deep" aria-labelledby="bleed-title">
        <Photo d={d} src="/media/hero/braises.jpg" sizes="100vw" className="object-[50%_60%]" />
        <div aria-hidden="true" className="absolute inset-0 bg-charcoal-deep/60" />
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(11,9,9,0.55),transparent_70%)]" />
        <Reveal className="relative px-6 text-center">
          <p className="eyebrow" dir="ltr">
            {d.bleed.eyebrow}
          </p>
          <h2 id="bleed-title" className="display mx-auto mt-6 max-w-5xl text-[2.8rem] md:text-[5.4rem] rtl:text-[3rem] md:rtl:text-[5.4rem]">
            {d.bleed.title}
          </h2>
          <p className="mx-auto mt-6 max-w-md text-[1.0625rem] leading-relaxed text-cream/90">{d.bleed.text}</p>
        </Reveal>
      </section>

      {/* ——— Formules ——— */}
      <section id="formulas" className="grain scroll-mt-20 px-5 py-24 md:px-10 md:py-40" aria-labelledby="formulas-title">
        <div className="mx-auto max-w-[1400px]">
          <SectionHead id="formulas-title" eyebrow={d.formulas.eyebrow} title={d.formulas.title} text={d.formulas.text} center />
          <ul className="mt-16 grid gap-8 md:mt-20 lg:grid-cols-3">
            {formulas.map((m, i) => {
              const t = d.formulas.items[m.id];
              return (
                <Reveal as="li" key={m.id} delay={i * 0.12} className="glow group flex flex-col border border-line bg-charcoal-soft">
                  <div className="shine relative aspect-[4/3] bg-charcoal">
                    <Photo d={d} src={m.image} sizes="(min-width: 1024px) 31vw, 92vw" />
                    <span className="num absolute start-4 top-4 bg-charcoal/80 px-2.5 py-1 text-[0.75rem] text-cream">{num(i, 2)}</span>
                  </div>
                  <div className="flex flex-1 flex-col p-7 md:p-9">
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="display text-[2rem] rtl:text-[1.9rem]">{t.name}</h3>
                      <span className="eyebrow">{d.formulas.kosher}</span>
                    </div>
                    <p className="mt-2 text-[0.9375rem] text-muted">{t.note}</p>
                    <p className="label mt-8">{d.formulas.included}</p>
                    <ul className="mt-3 border-t border-line">
                      {m.includes.map((x) => (
                        <li key={x} className="flex gap-3 border-b border-line py-3 text-[0.9375rem] leading-relaxed text-cream/90">
                          <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-copper" />
                          {d.formulas.includes[x]}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto pt-8">
                      <Price from={m.from} min={m.minGuests} />
                      <PickMenu id={m.id} label={d.formulas.cta} className={`${i === 2 ? "btn-solid" : "btn-line"} mt-7 w-full`} />
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </ul>

          {/* Bar à alcool, en option */}
          <Reveal id="bar" className="glow mt-8 grid scroll-mt-28 overflow-hidden border border-line bg-charcoal-soft md:grid-cols-[0.9fr_1.1fr]">
            <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[26rem]">
              <Photo d={d} src="/media/bar/video-bar.jpg" sizes="(min-width: 768px) 42vw, 92vw" />
              <LoopVideo src="/media/video/bar.mp4" label={d.alt["video-bar"]} fade className="absolute inset-0 h-full w-full object-cover" />
            </div>
            <div className="flex flex-col justify-center p-7 md:p-12">
              <p className="num text-[0.8125rem] text-copper">+</p>
              <h3 className="display mt-3 text-[2.2rem] rtl:text-[2rem]">{d.formulas.bar.name}</h3>
              <p className="mt-2 text-[0.9375rem] text-muted">{d.formulas.bar.note}</p>
              <ul className="mt-7 grid gap-x-8 border-t border-line sm:grid-cols-2">
                {bar.includes.map((x) => (
                  <li key={x} className="flex gap-3 border-b border-line py-3 text-[0.9375rem] text-cream/90">
                    <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-copper" />
                    {d.formulas.includes[x]}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
                <Price from={bar.from} min={bar.minGuests} />
                <PickMenu id="bar" label={d.formulas.bar.cta} className="btn-line" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ——— Événements ——— */}
      <section id="events" className="scroll-mt-20 bg-charcoal-soft px-5 py-24 md:px-10 md:py-40" aria-labelledby="events-title">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid items-end gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-24">
            <SectionHead id="events-title" eyebrow={d.events.eyebrow} title={d.events.title} text={d.events.text} />
            <Reveal delay={0.1} className="relative mx-auto aspect-[9/14] w-full max-w-xs overflow-hidden lg:mx-0 lg:justify-self-end">
              <Photo d={d} src="/media/evenements/video-soiree.jpg" sizes="320px" />
              <LoopVideo src="/media/video/soiree.mp4" label={d.events.video} fade className="absolute inset-0 h-full w-full object-cover" />
              <span aria-hidden="true" className="pointer-events-none absolute inset-3 border border-cream/25" />
            </Reveal>
          </div>
          <ul className="mt-16 grid gap-6 md:mt-20 md:grid-cols-6">
            {d.events.items.map((e, i) => (
              <Reveal as="li" key={e.name} delay={(i % 3) * 0.1} className={i < 2 ? "md:col-span-3" : "md:col-span-2"}>
                <Link href="#contact" className="group block">
                  <div className={`shine glow relative border border-transparent bg-charcoal ${i < 2 ? "aspect-[16/11]" : "aspect-[4/5]"}`}>
                    <Photo d={d} src={EVENTS[i]} sizes={i < 2 ? "(min-width: 768px) 48vw, 92vw" : "(min-width: 768px) 31vw, 92vw"} />
                    <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(11,9,9,0.88)_100%)]" />
                    <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                      <p className="num text-[0.75rem] text-gold">{num(i)}</p>
                      <h3 className="display mt-2 text-[1.9rem] rtl:text-[1.9rem]">{e.name}</h3>
                    </div>
                  </div>
                  <p className="mt-5 max-w-md leading-[1.8] text-cream/75">{e.text}</p>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ——— Le menu ——— */}
      <section id="menu" className="grain scroll-mt-20 px-5 py-24 md:px-10 md:py-40" aria-labelledby="menu-title">
        <div className="mx-auto grid max-w-[1300px] gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHead id="menu-title" eyebrow={d.menu.eyebrow} title={d.menu.title} text={d.menu.text} />
            <Reveal delay={0.1} className="relative mt-12 aspect-[4/5] w-full max-w-sm overflow-hidden">
              <Photo d={d} src="/media/chef/video-entrecote.jpg" sizes="(min-width: 1024px) 26vw, 92vw" />
              <LoopVideo src="/media/video/entrecote.mp4" label={d.chef.video} fade className="absolute inset-0 h-full w-full object-cover" />
            </Reveal>
          </div>
          <div>
            {/* À REMPLIR : menu d'exemple tiré de ses publications (data/menu.json + locales/*.json menu.items) */}
            {menuSections.map((s, si) => (
              <Reveal key={s.id} delay={si * 0.05} className={si ? "mt-16" : ""}>
                <h3 className="flex items-baseline gap-4 border-b border-copper/40 pb-4">
                  <span className="num text-[0.75rem] text-copper">{num(si, 2)}</span>
                  <span className="display text-[1.8rem] rtl:text-[1.8rem]">{d.menu.sections[s.id]}</span>
                </h3>
                <ul>
                  {s.items.map((x) => (
                    <li key={x} className="border-b border-line py-5">
                      <p className="text-[1.0625rem] font-normal text-cream">{d.menu.items[x].name}</p>
                      <p className="mt-1 text-[0.9375rem] leading-relaxed text-muted">{d.menu.items[x].desc}</p>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
            <p className="mt-10 text-[0.875rem] text-gold">{d.menu.note}</p>
          </div>
        </div>
      </section>

      {/* ——— Comment ça marche ——— */}
      <section className="bg-charcoal-soft px-5 py-24 md:px-10 md:py-36" aria-labelledby="process-title">
        <div className="mx-auto max-w-[1400px]">
          <SectionHead id="process-title" eyebrow={d.process.eyebrow} title={d.process.title} center />
          <ol className="mt-16 grid gap-12 sm:grid-cols-2 md:mt-20 lg:grid-cols-4 lg:gap-8">
            {d.process.steps.map((s, i) => (
              <Reveal as="li" key={s.name} delay={i * 0.1} className="border-t border-copper/50 pt-8 text-center">
                <span className="num text-[0.8125rem] text-copper">{num(i, 2)}</span>
                <h3 className="display mt-4 text-[1.8rem] rtl:text-[1.7rem]">{s.name}</h3>
                <p className="mx-auto mt-3 max-w-xs leading-[1.8] text-muted">{s.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ——— Le chef ——— */}
      <section id="chef" className="grain scroll-mt-20 px-5 py-24 md:px-10 md:py-40" aria-labelledby="chef-title">
        <div className="mx-auto grid max-w-[1200px] items-center gap-14 md:grid-cols-2 md:gap-24">
          <Reveal className="relative">
            <div className="relative aspect-square w-full overflow-hidden bg-charcoal-soft">
              <Photo d={d} src="/media/chef/yonathan-planche.jpg" sizes="(min-width: 768px) 45vw, 92vw" className="object-[50%_40%]" />
            </div>
            <div className="absolute -bottom-10 hidden aspect-[4/5] w-2/5 overflow-hidden border-8 border-charcoal md:-end-10 md:block">
              <Photo d={d} src="/media/chef/yonathan-service.jpg" sizes="18vw" className="object-[50%_30%]" />
            </div>
          </Reveal>
          <div>
            <SectionHead id="chef-title" eyebrow={d.chef.eyebrow} title={d.chef.title} />
            <Reveal delay={0.1}>
              {/* À COMPLÉTER avec l'histoire de Yonathan (parcours, formation, depuis quand, d'où il vient en France, événements marquants) */}
              {d.chef.text.map((p) => (
                <p key={p} className="lead mt-6">
                  {p}
                </p>
              ))}
              <p className="mt-10 font-[family-name:var(--font-suez)] text-[2rem] text-gold" dir="rtl" lang="he" translate="no">
                {he ? site.chef.he : "אמיתי גריל"}
              </p>
              <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="link-line nav-link mt-8 inline-flex items-center gap-2">
                <InstagramIcon className="h-4 w-4" />
                <span dir="ltr">{d.chef.follow}</span>
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ——— Galerie « de près » ——— */}
      <section id="gallery" className="scroll-mt-20 bg-charcoal-soft px-5 py-24 md:px-10 md:py-36" aria-labelledby="gallery-title">
        <div className="mx-auto max-w-[1400px]">
          <SectionHead id="gallery-title" eyebrow={d.gallery.eyebrow} title={d.gallery.title} text={d.gallery.text} center />
          <div className="mt-12">
            <Gallery items={gallery} labels={lightbox} filters={d.gallery.filters} openLabel={d.gallery.open} />
          </div>
          <div className="mt-14 text-center">
            <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="btn-line">
              <InstagramIcon className="h-4 w-4" />
              {d.gallery.more}
            </a>
          </div>
        </div>
      </section>

      {/* ——— Avis ——— */}
      <section className="grain px-5 py-24 md:px-10 md:py-32" aria-labelledby="reviews-title">
        <div className="mx-auto max-w-3xl text-center">
          <SectionHead id="reviews-title" eyebrow={d.reviews.eyebrow} title={d.reviews.title} center />
          {/* À REMPLIR avec de vrais avis clients. Aucun avis n'est inventé. */}
          <Reveal delay={0.1}>
            <Rule className="mt-10" />
            <p className="mx-auto mt-10 max-w-xl text-[1.25rem] leading-relaxed text-muted">{d.reviews.empty}</p>
            <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="btn-line mt-10">
              <InstagramIcon className="h-4 w-4" />
              {d.reviews.cta}
            </a>
          </Reveal>
        </div>
      </section>

      {/* ——— Zone + questions ——— */}
      <section className="bg-charcoal-soft px-5 py-24 md:px-10 md:py-36" aria-labelledby="area-title">
        <div className="mx-auto grid max-w-[1200px] gap-16 md:grid-cols-2 md:gap-24">
          <div>
            <SectionHead id="area-title" eyebrow={d.area.eyebrow} title={d.area.title} text={d.area.text} />
            {/* À CONFIRMER avec Yonathan : frais de déplacement et certification casher */}
            <dl className="mt-12 border-t border-line">
              {d.area.items.map((it) => (
                <div key={it.label} className="grid grid-cols-[7.5rem_1fr] gap-4 border-b border-line py-5">
                  <dt className="eyebrow pt-1">{it.label}</dt>
                  <dd className="leading-relaxed text-muted">{it.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <SectionHead eyebrow={d.faq.eyebrow} title={d.faq.title} />
            <div className="mt-12 border-t border-line">
              {d.faq.items.map((q) => (
                <details key={q.q} className="group border-b border-line">
                  <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 py-5 text-[1.0625rem] font-normal [&::-webkit-details-marker]:hidden">
                    {q.q}
                    <span aria-hidden="true" className="text-[1.4rem] font-light text-copper transition-transform duration-500 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="pb-6 leading-[1.8] text-muted">{q.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ——— Demande de devis ——— */}
      <section id="contact" className="grain scroll-mt-20 px-5 py-24 md:px-10 md:py-36" aria-labelledby="contact-title">
        <div className="mx-auto grid max-w-[1300px] gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHead id="contact-title" eyebrow={d.quote.eyebrow} title={d.quote.title} text={d.quote.text} />
            <Reveal delay={0.1}>
              <ul className="mt-10 space-y-4 text-[0.9375rem]">
                <li>
                  <a href={waLink(d.whatsapp.hello)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-3 hover:text-gold">
                    <WhatsAppIcon className="h-4 w-4" />
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a href={tel} className="inline-flex min-h-10 items-center gap-3 hover:text-gold">
                    <PhoneIcon className="h-4 w-4" />
                    <span dir="ltr">{site.phone}</span>
                  </a>
                </li>
                <li>
                  <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-3 hover:text-gold">
                    <InstagramIcon className="h-4 w-4" />
                    <span dir="ltr">{site.instagramHandle}</span>
                  </a>
                </li>
              </ul>
              <div className="relative mt-12 hidden aspect-[4/5] w-2/3 overflow-hidden lg:block">
                <Photo d={d} src="/media/hero/tomahawks-grill.jpg" sizes="22vw" />
              </div>
            </Reveal>
          </div>
          <div className="border border-copper/30 bg-charcoal-soft p-6 sm:p-10 md:p-14">
            <QuoteForm />
          </div>
        </div>
      </section>
    </>
  );
}

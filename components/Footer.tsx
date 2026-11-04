import Link from "next/link";
import site from "@/data/site.json";
import { InstagramIcon, PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { LogoFull } from "@/components/Logo";
import type { Dict, Locale } from "@/lib/i18n";
import { waLink } from "@/lib/quote";

export function Footer({ lang, d }: { lang: Locale; d: Dict }) {
  const year = new Date().getFullYear();
  const home = `/${lang}`;
  const nav = [
    { href: `${home}#chef`, label: d.nav.chef },
    { href: `${home}#formulas`, label: d.nav.formulas },
    { href: `${home}#events`, label: d.nav.events },
    { href: `${home}#gallery`, label: d.nav.gallery },
    { href: `${home}#contact`, label: d.nav.quote },
  ];
  return (
    <footer className="grain border-t border-copper/25 bg-charcoal-deep text-cream">
      <div className="mx-auto grid max-w-[1400px] items-start gap-14 px-5 pt-20 pb-12 md:grid-cols-3 md:px-10 md:pt-28">
        <div className="order-first md:order-none md:col-start-2">
          <LogoFull />
          <p className="mx-auto mt-8 max-w-xs text-center text-[0.9375rem] leading-relaxed text-cream/75">{d.footer.tagline}</p>
        </div>
        <div className="md:col-start-1 md:row-start-1">
          <p className="eyebrow !text-gold">{d.footer.contact}</p>
          <ul className="mt-5 space-y-3 text-[0.9375rem]">
            <li>
              <a href={waLink(d.whatsapp.hello)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-8 items-center gap-3 hover:text-gold">
                <WhatsAppIcon className="h-4 w-4" />
                WhatsApp
              </a>
            </li>
            <li>
              <a href={`tel:${site.phoneIntl.replace(/[\s-]/g, "")}`} className="inline-flex min-h-8 items-center gap-3 hover:text-gold">
                <PhoneIcon className="h-4 w-4" />
                <span dir="ltr">{site.phone}</span>
              </a>
            </li>
            <li>
              <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-8 items-center gap-3 hover:text-gold">
                <InstagramIcon className="h-4 w-4" />
                <span dir="ltr">{site.instagramHandle}</span>
              </a>
            </li>
            <li className="text-cream/75">{d.footer.area}</li>
          </ul>
        </div>
        <div className="md:text-end">
          <p className="eyebrow !text-gold">{d.footer.explore}</p>
          <ul className="mt-5 space-y-3 text-[0.9375rem] text-cream/85">
            {nav.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-flex min-h-8 items-center hover:text-gold">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mx-auto flex max-w-[1400px] flex-col gap-2 border-t border-cream/15 px-5 py-6 pb-24 text-[0.8125rem] text-cream/70 md:flex-row md:justify-between md:px-10 md:pb-6">
        <p>
          © {year} <span translate="no">{site.nameLatin}</span> · {d.footer.rights}
        </p>
        <p>{d.footer.photos}</p>
      </div>
    </footer>
  );
}

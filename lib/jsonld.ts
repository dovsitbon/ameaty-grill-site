import site from "@/data/site.json";
import { getDict, type Locale } from "@/lib/i18n";
import { formulas } from "@/lib/quote";

/** Données structurées : chef privé / traiteur casher (FoodEstablishment + Caterer), services, FAQ. */
export function homeJsonLd(lang: Locale) {
  const d = getDict(lang);
  const he = lang === "he";
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["FoodEstablishment", "LocalBusiness"],
        additionalType: "https://en.wikipedia.org/wiki/Caterer",
        "@id": `${site.url}/#business`,
        name: he ? "אמיתי גריל" : site.nameLatin,
        alternateName: ["אמיתי גריל", "Ameaty Grill", "AMEATY GRILL"],
        description: d.meta.description,
        url: `${site.url}/${lang}`,
        image: `${site.url}/og.jpg`,
        logo: `${site.url}/icon.svg`,
        telephone: site.phoneIntl.replace(/[\s-]/g, ""),
        servesCuisine: ["Kosher", "Grill", "Barbecue", "Israeli"],
        address: { "@type": "PostalAddress", addressCountry: "IL" },
        areaServed: { "@type": "Country", name: he ? "ישראל" : "Israel" },
        founder: { "@type": "Person", name: he ? site.chef.he : site.chef.latin, jobTitle: "Private chef" },
        sameAs: [site.instagram],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: d.formulas.title,
          itemListElement: formulas.map((f) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: d.formulas.items[f.id].name, description: f.includes.map((x) => d.formulas.includes[x]).join(", ") },
          })),
        },
      },
      ...d.pillars.items.map((p) => ({
        "@type": "Service",
        name: p.name,
        description: p.text,
        serviceType: "Kosher private meat chef",
        provider: { "@id": `${site.url}/#business` },
        areaServed: { "@type": "Country", name: "Israel" },
      })),
      {
        "@type": "FAQPage",
        mainEntity: d.faq.items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  };
}

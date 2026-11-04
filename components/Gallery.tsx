"use client";

import Image from "next/image";
import { useState } from "react";
import { Lightbox, type LightboxItem, type LightboxLabels } from "@/components/Lightbox";

export type GalleryItem = LightboxItem & { cat: "grill" | "table" | "events" };
const FILTERS = ["all", "grill", "table", "events"] as const;
type Filter = (typeof FILTERS)[number];

/** Galerie « de près », filtrable, ouverte en grand au clic. */
export function Gallery({ items, labels, filters, openLabel }: { items: GalleryItem[]; labels: LightboxLabels; filters: Record<Filter, string>; openLabel: string }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [index, setIndex] = useState<number | null>(null);
  const list = items.filter((it) => filter === "all" || it.cat === filter);

  return (
    <>
      <div className="flex flex-wrap justify-center gap-2" role="group" aria-label={filters.all}>
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            className="chip"
            aria-pressed={filter === f}
            onClick={() => {
              setFilter(f);
              setIndex(null);
            }}
          >
            {filters[f]}
          </button>
        ))}
      </div>
      <ul className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
        {list.map((it, i) => (
          <li key={it.src} className="fade-in">
            <button type="button" onClick={() => setIndex(i)} className="shine block w-full cursor-zoom-in bg-charcoal-soft" aria-label={`${openLabel}, ${it.alt}`}>
              <Image src={it.src} alt={it.alt} width={it.width} height={it.height} sizes="(min-width: 1024px) 23vw, (min-width: 768px) 31vw, 48vw" quality={70} className="aspect-[4/5] w-full object-cover" />
            </button>
          </li>
        ))}
      </ul>
      <Lightbox items={list} index={index} onIndex={setIndex} labels={labels} />
    </>
  );
}

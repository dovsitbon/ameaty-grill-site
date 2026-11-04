// Trie les visuels Instagram (assets/raw/) et les images extraites des reels (assets/frames/)
// dans assets/<catégorie>/ avec des noms lisibles, puis les prépare pour le web dans public/media/<catégorie>/.
// next/image sert ensuite des variantes AVIF/WebP à la bonne taille.
//   npm run media
//
// Écartées volontairement : affiche « BBQ party » avec beaucoup de texte (22), couvertures de reels en doublon
// d'images extraites plus nettes (16, 21, 24), « logo » qui est en fait un portrait (utilisé dans la section chef).
import { copyFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const R = (n) => `raw/ameaty-grill_${n}.jpg`;

// [fichier source (dans assets/), catégorie, nom, recadrage facultatif en fractions {top, bottom}]
const PICKS = [
  [R("18_CxdtfEaLfgy"), "hero", "grill-pinces-fumee"],
  [R("13_C7b5XiJsvLu"), "hero", "braises"],
  [R("09_C8XcOPfsu7E"), "hero", "tomahawks-grill"],
  ["frames/poster_grill.jpg", "hero", "video-grill"],

  [R("15_C69X-wispEL"), "grill", "brochettes-grill"],
  [R("04_C9STsmoMaAk"), "grill", "cotes-crues-planche"],
  [R("27_Cwf6J6RrgmO"), "grill", "entrecotes-crues"],
  [R("11_C8SBT1DMF07"), "grill", "tomahawk-planche-fumee"],
  [R("30_Cvx7JYFsQhZ"), "grill", "entrecotes-romarin"],
  ["frames/rib_05.jpg", "grill", "entrecotes-sur-le-grill"],
  ["frames/grill_22.jpg", "grill", "cote-de-boeuf-grill"],
  ["frames/grill_12.jpg", "grill", "aubergines-braise"],
  ["frames/grill_10.jpg", "grill", "lit-de-braises"],

  [R("17_C6or7ZGsH12"), "sur-table", "planche-tranchee"],
  [R("01_C92RB9cMnqO"), "sur-table", "bruschettas-boeuf-seche"],
  [R("29_Cv5V2fNrhj-"), "sur-table", "bruschettas-champignons"],
  [R("08_C8kNDyrMKaa"), "sur-table", "carpaccio"],
  [R("06_C8z4TRHMtzo"), "sur-table", "planche-kebabs-entrecote"],
  [R("03_C9cpulCsqQc"), "sur-table", "filet-tranche-planche"],
  [R("28_CwdNVUSMWiO"), "sur-table", "planche-ail-confit"],
  [R("19_CxYsZDHrHej"), "sur-table", "entrecotes-poele"],
  [R("12_C8AGGUVMtD9_video-cover"), "sur-table", "viande-confite", { top: 0.12, bottom: 0.88 }],
  [R("10_C8SHq-css1a"), "sur-table", "crudo-saumon"],
  [R("02_C9sJH27slqU"), "sur-table", "caviar-aubergine"],
  [R("05_C9AYO5vMDxy"), "sur-table", "houmous-viande"],
  [R("23_Cw-3JICLg_T"), "sur-table", "legumes-rotis"],
  [R("14_C7R5K_TsOYc"), "sur-table", "sandwichs-planche"],
  ["frames/flam_05.jpg", "sur-table", "flambe-planche", { top: 0.08, bottom: 0.92 }],
  ["frames/cxb_16.jpg", "sur-table", "tranchage", { top: 0.1, bottom: 0.9 }],
  ["frames/cxb_20.jpg", "sur-table", "kebabs-tahini", { top: 0.05, bottom: 0.85 }],
  ["frames/poster_flambe.jpg", "sur-table", "video-flambe"],

  [R("25_Cws6Z_6r04D"), "evenements", "terrasse-tables"],
  [R("26_CwlIjsKL2pM"), "evenements", "plateau-fruits"],
  [R("20_CxJUKq3Lj0N_video-cover"), "evenements", "flambe-invites", { top: 0.18, bottom: 0.9 }],
  ["frames/bar_30.jpg", "evenements", "soiree-terrasse-nuit", { top: 0.1, bottom: 0.75 }],
  ["frames/party_31.jpg", "evenements", "chef-decoupe-soiree", { top: 0.1, bottom: 0.95 }],
  ["frames/poster_soiree.jpg", "evenements", "video-soiree"],

  ["frames/bar_01.jpg", "bar", "bar-bois-terrasse", { top: 0, bottom: 0.82 }],
  ["frames/bar_25.jpg", "bar", "verres-bar"],
  ["frames/poster_bar.jpg", "bar", "video-bar"],

  [R("logo"), "chef", "yonathan-planche"],
  [R("07_C8r_DApMjMC_video-cover"), "chef", "yonathan-service", { top: 0, bottom: 0.72 }],
  ["frames/poster_entrecote.jpg", "chef", "video-entrecote"],
];

const sizes = {};
for (const [src, cat, name, crop] of PICKS) {
  const file = path.join(ROOT, "assets", src);
  await mkdir(path.join(ROOT, "assets", cat), { recursive: true });
  await mkdir(path.join(ROOT, "public/media", cat), { recursive: true });
  await copyFile(file, path.join(ROOT, "assets", cat, `${name}.jpg`));
  let pipe = sharp(file).rotate();
  if (crop) {
    const { width, height } = await sharp(file).metadata();
    const top = Math.round(height * crop.top);
    pipe = pipe.extract({ left: 0, top, width, height: Math.round(height * crop.bottom) - top });
  }
  const max = cat === "hero" ? 2400 : 1600;
  const info = await pipe
    .resize({ width: max, height: max, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(path.join(ROOT, "public/media", cat, `${name}.jpg`));
  sizes[`/media/${cat}/${name}.jpg`] = [info.width, info.height];
}

// Image de partage (Open Graph) 1200 × 630
await sharp(path.join(ROOT, "assets", R("18_CxdtfEaLfgy")))
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(path.join(ROOT, "public/og.jpg"));

await writeFile(path.join(ROOT, "data/media-sizes.json"), JSON.stringify(sizes, null, 1) + "\n");
console.log(`${PICKS.length} images prêtes`);

// Boucles vidéo silencieuses (public/media/video/) coupées dans les reels avec ffmpeg, sans le son :
//   grill.mp4     reel CwvJaWAMeEa, 17,5 s → 23,5 s (brochettes et côtes sur la braise), 720 px
//   flambe.mp4    reel CxJUKq3Lj0N, 2 s → 8 s (planche flambée au chalumeau devant les invités)
//   bar.mp4       reel CwvJaWAMeEa, 24 s → 30 s (service au bar)
//   soiree.mp4    reel C8r_DApMjMC, 28,5 s → 34,5 s (découpe à table pendant une soirée)
//   entrecote.mp4 reel C8r_DApMjMC, 5 s → 10,5 s (entrecôtes sur la grille)
//   ffmpeg -ss <début> -t <durée> -i assets/reels/<id>.mp4 -an -vf "scale=540:-2,fps=30" -c:v libx264 -crf 28 -preset slow -pix_fmt yuv420p -movflags +faststart public/media/video/<nom>.mp4

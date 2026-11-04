# Génère CONTENU.md (tous les textes du site, en 4 langues côte à côte) à partir de locales/*.json.
#   python -I -X utf8 scripts/contenu.py
import json, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
LANGS = [("he", "עברית"), ("fr", "Français"), ("en", "English"), ("es", "Español")]
D = {l: json.loads((ROOT / f"locales/{l}.json").read_text(encoding="utf8")) for l, _ in LANGS}


def flat(o, p=""):
    if isinstance(o, dict):
        for k, v in o.items():
            yield from flat(v, f"{p}.{k}" if p else k)
    elif isinstance(o, list):
        for i, v in enumerate(o):
            yield from flat(v, f"{p}[{i + 1}]")
    else:
        yield p, str(o)


out = [
    "# AMEATY GRILL – contenu du site, pour validation",
    "",
    "Tous les textes du site, dans les 4 langues. Fichiers source : `locales/he.json`, `fr.json`, `en.json`, `es.json`.",
    "Les prix des formules (`data/formules.json`) et le menu (`data/menu.json`) sont des **exemples à confirmer**.",
    "",
]
section = None
rows = {l: dict(flat(D[l])) for l, _ in LANGS}
for key in rows["fr"]:
    top = key.split(".")[0].split("[")[0]
    if top != section:
        section = top
        out += ["", f"## {section}", ""]
    out.append(f"**{key}**")
    for l, name in LANGS:
        out.append(f"- {name} : {rows[l].get(key, '').replace(chr(10), ' ')}")
    out.append("")

(ROOT / "CONTENU.md").write_text("\n".join(out) + "\n", encoding="utf8")
print(len(rows["fr"]), "textes")

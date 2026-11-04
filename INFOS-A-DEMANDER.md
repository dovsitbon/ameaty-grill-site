# AMEATY GRILL – informations à demander à Yonathan

Le site est en ligne avec des contenus d'exemple, signalés sur le site (« prix d'exemple, à confirmer ») et dans le code par des commentaires `À REMPLIR` / `À CONFIRMER`.

## Indispensable
1. **Son histoire** (section « Le chef ») : parcours, formation, depuis quand il fait Ameaty Grill, d'où il vient en France, un événement marquant. → `locales/*.json` › `chef.text`
2. **Orthographe de son nom en hébreu** : le site affiche « יונתן אסולי ». → `data/site.json`
3. **Formules et prix** : pour chaque formule (Grill live, Sur table, Signature), ce qui est inclus, le prix par personne « à partir de » et le minimum d'invités. → `data/formules.json` (puis passer `pricesConfirmed` à `true`)
4. **Menu** : les viandes et coupes qu'il propose vraiment, l'origine de la viande, les entrées et accompagnements. → `data/menu.json` + `locales/*.json` › `menu.items`
5. **Certification casher** : quelle cacheroute (boucher, Rabbanout, Méhadrin, Badatz ?), est-ce qu'il peut s'adapter à une exigence plus stricte. → FAQ et section Zone
6. **Bar à alcool** : ce qui est compris (barman, alcools, cocktails), le prix et le minimum d'invités.

## Important
7. **Frais de déplacement** : gratuits jusqu'où ? tarif au-delà ?
8. **Minimum d'invités** par formule, et nombre maximum qu'il peut gérer.
9. **Durée de la prestation** (le site annonce « environ 3 heures de grill » / « environ 4 heures de service » à titre d'exemple).
10. **Vrais avis clients** (avec accord pour les publier) : capture WhatsApp, Google, Instagram. → section Avis, emplacement `<!-- À REMPLIR -->`
11. **Dates déjà prises**, s'il veut que le formulaire prévienne. → `data/dates.json`

## Médias
12. **Photos et vidéos en bonne qualité** (les originaux, pas les versions Instagram) : grill en action, flambage, tablées, bar. Les vidéos du site sont extraites de ses reels : la qualité est correcte sur mobile, juste sur grand écran.
13. **Photos par type d'événement** (Friends party, anniversaire, Sheva brahot, Bar Mitsvah, Pourim) : aujourd'hui les cartes utilisent des photos génériques de ses soirées.
14. **Logo** : sa photo de profil est un portrait ; un logo typographique a été créé (`components/Logo.tsx`, `app/icon.svg`). S'il a un vrai logo (l'affiche « BBQ party » utilise un lettrage rouge), l'envoyer en vectoriel.
15. **Accord des invités** visibles sur les photos de soirée (la découpe à table et la terrasse de nuit).

## Facultatif
16. Nom de domaine souhaité (ex. ameatygrill.co.il).
17. Adresse e-mail professionnelle.

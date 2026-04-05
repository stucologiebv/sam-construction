# SAM Construction — Website Audit & TODO

**Scan datum:** 2026-04-05
**Doel:** Professionele, production-ready website (GitHub Pages → samconstruction.lu)
**Status:** Audit compleet, fixes nog te doen

Dit bestand is de single source of truth voor de openstaande werkzaamheden. Als de sessie vastloopt → hier pakken we weer op. Per item: checkbox + wat + waar + waarom.

---

## Inhoud
- [🔴 Critical — breekt de site of kernfunctionaliteit](#-critical)
- [🟠 High — performance, SEO, professionaliteit](#-high)
- [🟡 Medium — accessibility, UX polish](#-medium)
- [🟢 Low — nice-to-haves](#-low)
- [⚖️ Luxembourg — wettelijk verplicht](#️-luxembourg--wettelijk-verplicht)
- [🌍 Meertaligheid (FR/DE/LB/EN)](#-meertaligheid)
- [🏆 Branche-credentials & trust](#-branche-credentials--trust)
- [📍 Local SEO Luxembourg](#-local-seo-luxembourg)
- [📝 Content die ontbreekt](#-content-die-ontbreekt)
- [💼 Business features](#-business-features)
- [🔒 Security & reliability](#-security--reliability)
- [Bestandsoverzicht](#bestandsoverzicht)
- [Werkvolgorde (aanbevolen)](#werkvolgorde)

---

## 🔴 Critical

- [ ] **C1. `assets/` map is niet in git gecommit** → bij deploy naar GitHub Pages is er GEEN CSS, site is compleet unstyled.
  - Waar: `assets/styles.css` (untracked)
  - Fix: `git add assets/ && commit`

- [ ] **C2. Absolute CSS-pad `/assets/styles.css` breekt op project-pages** (bv. `user.github.io/sam-construction/`).
  - Waar: 14 HTML files — `index.html:55`, alle `services/*.html:10`, alle `blog/*.html:19`
  - Fix: relative pad — `assets/styles.css` in index, `../assets/styles.css` in blog/services. Of: CNAME + custom domain (zie C9).

- [ ] **C3. Cloudflare email-obfuscation artifact** — `<a href="/cdn-cgi/l/email-protection" class="__cf_email__" data-cfemail="...">[email protected]</a>` — resteert van een gedownloade site, werkt NIET op GH Pages.
  - Waar: `index.html:418`
  - Fix: vervangen door echte mailto, bv. `<a href="mailto:info@samconstruction.lu">info@samconstruction.lu</a>`

- [ ] **C4. Telefoon/WhatsApp nummer is incompleet** — `+352 621 735` (6 cijfers). Luxemburgse mobiel = 9 cijfers. `wa.me/352621735` is invalide.
  - Waar: `index.html:414,624`, alle 14 pagina's (WA-knop)
  - Fix: echt nummer invullen. Ook in Schema.org JSON-LD (`index.html:31`).

- [ ] **C5. Contactformulier doet NIETS** — geen `action`, geen `method`, geen `name=` op inputs, geen submit handler.
  - Waar: `index.html:427-464`
  - Fix: Formspree / Web3Forms / Netlify Forms / Getform koppelen, of mailto-fallback. Inputs `name=` geven, `required` toevoegen, GDPR-checkbox.

- [ ] **C6. Google Maps iframe is fake** — URL gebruikt placeholder `!1s0x0%3A0x0` (place_id 0x0:0x0) en verzonnen coördinaten. Toont geen locatie.
  - Waar: `index.html:422`
  - Fix: echte embed-URL genereren via Google Maps → Share → Embed.

- [ ] **C7. Mobiele navigatie ontbreekt** — `@media(max-width:1024px) .nav-links{display:none}` maar er is GEEN hamburgermenu als vervanging. Op mobiel kan niemand navigeren.
  - Waar: `assets/styles.css:1080`, markup `index.html:71-90`
  - Fix: hamburger knop + overlay menu + JS toggle. Kopieer naar alle sub-pagina's.

- [ ] **C8. Placeholder legal links** — Privacy Policy / Terms / Cookie Policy allemaal `href="#"`.
  - Waar: `index.html:611-613`
  - Fix: `/privacy.html`, `/terms.html`, `/cookies.html` aanmaken of verwijderen.

- [ ] **C9. CNAME ontbreekt** — custom domain `samconstruction.lu` niet geconfigureerd voor GitHub Pages.
  - Fix: `CNAME` bestand met `www.samconstruction.lu` in root, DNS A/CNAME records bij registrar.

---

## 🟠 High

- [ ] **H1. 572KB inline base64 images in `index.html`** — killt LCP, mobile, SEO.
  - Waar: `index.html:95,266,323,332,341,350,372,379,386,485,493,501,524,533,542,551,560,569` (≈18 inline base64)
  - Fix: extract naar `assets/images/`, converteer naar WebP + JPEG fallback, `loading="lazy"`, `width`/`height`, `srcset` voor responsive. Doel: HTML < 50KB.

- [ ] **H2. `<img>` zonder `alt` attribuut** — overal (alle base64 images).
  - Fix: beschrijvende alt-teksten (SEO + a11y).

- [ ] **H3. `robots.txt` ontbreekt.** Fix: `User-agent: *\nAllow: /\nSitemap: https://www.samconstruction.lu/sitemap.xml`

- [ ] **H4. `sitemap.xml` ontbreekt.** Fix: alle HTML pagina's opnemen met lastmod.

- [ ] **H5. `404.html` ontbreekt** — GH Pages toont default.

- [ ] **H6. `og:image` en `twitter:image` ontbreken** — share cards tonen geen preview.
  - Waar: `index.html:8-15`, alle blog pagina's
  - Fix: 1200x630 OG image maken, meta tags toevoegen.

- [ ] **H7. Schema.org LocalBusiness is incompleet/incorrect**
  - Waar: `index.html:18-53`
  - Issues: telephone invalid (zie C4), geen `geo` (lat/lng), geen `openingHours`, geen `priceRange`, geen `image`, `logo`, geen `sameAs` (social), geen `@id`.

- [ ] **H8. Hreflang ontbreekt** — EN/LB taal switcher zonder SEO signaal.
  - Fix: `<link rel="alternate" hreflang="en" ...>` + `hreflang="lb"` + `x-default`.

- [ ] **H9. Google Fonts preconnect ontbreekt**
  - Fix: `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`

- [ ] **H10. Inconsistente jaartallen** — hero zegt "15+ Years Active", service pagina's "15+ years", footer "since 2009", foundingDate 2009 = 17 jaar (2026).
  - Fix: overal consistent "17+ Years" OF jaarbereken via JS.

- [ ] **H11. Jaar in footer hardcoded 2026** — Fix: `<span id="year"></span>` + JS auto-update.

- [ ] **H12. Duplicate JS over alle pagina's** — cursor/lang scripts zijn kopie-geplakt in 14 files.
  - Fix: extract naar `assets/main.js`, 1× include.

- [ ] **H13. Custom cursor draait ook op touch devices** — `cursor:none` op body + JS listeners onvoorwaardelijk.
  - Fix: `@media(hover:hover)` wrap + `'ontouchstart' in window` check in JS.

- [ ] **H14. Loader heeft geen failsafe** — alleen `setTimeout(..., 800)` na `load`. Als JS faalt blijft de loader volledig scherm innemen.
  - Fix: CSS fallback animation die na 3s uitfaded, + `<noscript>` hide.

- [ ] **H15. "All projects" CTA linkt naar `#contact`** — onzinnig.
  - Waar: `index.html:316`
  - Fix: linken naar projects page (of sectie-only — dan knop weghalen).

---

## 🟡 Medium

- [ ] **M1. Geen `<main>` landmark.** Fix: wrap content tussen nav en footer in `<main>`.

- [ ] **M2. FAQ buttons missen `aria-expanded` / `aria-controls`** — screen readers weten niet of open.
  - Waar: `index.html:519,528,537,546,555,564`

- [ ] **M3. Form labels niet gekoppeld** — geen `for=`/`id=` pairs.
  - Waar: `index.html:430-461`

- [ ] **M4. Skip-to-content link ontbreekt** (a11y).

- [ ] **M5. `--muted: rgba(245,242,236,0.45)` contrast ratio faalt WCAG AA** op `--bg #0b1a0b`. Check met contrast tool, evt. naar 0.6.

- [ ] **M6. Cookie banner blokkeert niets** — puur cosmetisch. Bij Accept/Decline wordt niks geladen/geweigerd. OK als er echt geen trackers zijn, anders echte consent implementeren.

- [ ] **M7. Blog cards missen excerpt** — alleen titel + datum + "Read More". 2-regel samenvatting toevoegen.
  - Waar: `index.html:482-503`

- [ ] **M8. Geen project-detailpagina's** — 4 project cards zonder klikbare detail/gallerij.

- [ ] **M9. Testimonials zien sparse** — geen sterren, quote-icon of foto.

- [ ] **M10. Language switcher update `<html lang>` niet** en onthoudt keuze niet.
  - Fix: `document.documentElement.lang = lang` + `localStorage.setItem('lang',lang)` + restore on load.

- [ ] **M11. LB vertalingen incompleet** — content van FAQ answers, blog artikels, service pagina-inhoud is alleen EN. Volledige audit per sectie.

- [ ] **M12. Breadcrumbs ontbreken** op service/blog pagina's (SEO + UX).

- [ ] **M13. Smooth scroll JS in index.html houdt geen rekening met fixed nav-hoogte** — target komt onder nav.
  - Waar: `index.html:732-737`
  - Fix: `scroll-margin-top: 80px` op sections, of offset berekenen.

- [ ] **M14. `<noscript>` fallback ontbreekt** — zonder JS is loader permanent + content deels onzichtbaar door `.reveal` opacity.

- [ ] **M15. Reveal animation: elementen zonder `.reveal` class zijn ok, maar `.reveal` zonder `.visible` = `opacity:0`** → bij JS uit = onzichtbaar. Fix: CSS `@media(prefers-reduced-motion:reduce)` en `.no-js .reveal{opacity:1}`.

- [ ] **M16. Print stylesheet ontbreekt.** (Low prio maar telt voor "pro".)

---

## 🟢 Low

- [ ] **L1. Inline `style=""` attributes overal** — naar utility classes (`.text-inherit`, `.no-decoration`).
  - Waar: `index.html:178,186,194,...` (service items), `index.html:276` (em color), `index.html:316,414`

- [ ] **L2. Geen apple-touch-icon, geen PWA manifest.**

- [ ] **L3. Geen analytics** (Plausible / GA4 / Umami).

- [ ] **L4. Geen newsletter signup.**

- [ ] **L5. Geen "Back to top" knop.**

- [ ] **L6. Dark-only design — geen light toggle.** (Mag weg als keuze.)

- [ ] **L7. GitHub Pages workflow upload volledige repo** — zou `.git`, `TODO.md` etc. kunnen includen. OK maar evt. een build-stap toevoegen.

---

---

## ⚖️ Luxembourg — wettelijk verplicht

> Luxemburg heeft harde wettelijke eisen voor commerciële websites. Zonder deze items loop je juridisch risico (boetes CNPD tot €20M onder GDPR, en Loi du 14 août 2000 voor e-commerce).

- [ ] **LU1. Mentions légales pagina** (verplicht — Loi du 14 août 2000 art. 14 + e-commerce directive). Moet bevatten:
  - Volledige naam: SAM Construction S.à r.l.
  - Rechtsvorm + maatschappelijk kapitaal
  - RCS nummer: B306333 (staat nu alleen in footer)
  - **Autorisation d'établissement nummer** (verplicht voor bouw — uitgegeven door Ministère de l'Économie / Direction générale PME)
  - **Numéro TVA** (LUxxxxxxxx format)
  - Statutair adres (18A Griffelslee, 9171 Michelau)
  - Naam gérant(s) / administrateurs
  - Contact: tel, email
  - Hosting info (GitHub Pages / of eigen)
  - Directeur de la publication

- [ ] **LU2. Politique de confidentialité (GDPR/RGPD)** — verplicht als je form data verwerkt. Moet bevatten:
  - Identiteit verwerkingsverantwoordelijke
  - Doel en rechtsgrond (art. 6 GDPR)
  - Bewaartermijnen
  - Rechten betrokkene (inzage, rectificatie, wissing, bezwaar, dataportabiliteit)
  - Klachtenrecht bij CNPD (Commission nationale pour la protection des données)
  - DPO contact (als van toepassing)
  - Cookies + tracking toelichting
  - Doorgifte buiten EU (als van toepassing)

- [ ] **LU3. Conditions générales (CGV/CGU)** — bij dienstverlening aanbevolen, voorkomt geschillen.

- [ ] **LU4. Politique cookies + echte consent banner** (ePrivacy richtlijn + LU wet 30 mei 2005). Huidige banner doet niets. Moet:
  - Voor-akkoord blokkering van alle niet-essentiële cookies
  - Gedetailleerde keuze (functioneel / analytics / marketing)
  - Mogelijkheid tot intrekken zonder drempel
  - Consent log (bewijsplicht)
  - Gebruik bv. Klaro, Cookiebot, Termly, of custom.

- [ ] **LU5. GDPR-compliant contactformulier**
  - Expliciete checkbox: "J'accepte que mes données soient traitées conformément à la politique de confidentialité"
  - Link naar privacy policy
  - Bewaartermijn aanduiden
  - Server-side verwerking met encryption in transit + rest
  - Geen data naar non-EU servers zonder SCC

- [ ] **LU6. Accessibility statement** — EU Directive 2016/2102 verplicht voor publieke sector, aanbevolen voor B2B/pro. Niveau WCAG 2.1 AA.

- [ ] **LU7. Plaintenrecht / dispute resolution** — verwijzing naar Chambre des Métiers commissie of ULC (Union Luxembourgeoise des Consommateurs).

- [ ] **LU8. Verzekeringsinformatie** — bouw vereist:
  - **Assurance décennale** (10-jaars garantie art. 1792 Code civil) — verzekeraar + polisnummer zichtbaar
  - **Assurance responsabilité civile professionnelle**
  - **Assurance biennale** (2-jaars)

- [ ] **LU9. ITM compliance statement** — Inspection du Travail et des Mines registratie vermelden (werkgever in bouw).

---

## 🌍 Meertaligheid

> **Kritieke fout:** site heeft EN + LB, maar voor Luxemburgse bouwsector zijn **FR en DE veel belangrijker**. LB wordt gesproken maar zelden geschreven voor business. FR is lingua franca (circa 98% begrijpt), DE voor grensstreek en Duitstalige klanten, EN voor expats (Kirchberg/financial sector).

- [ ] **ML1. Français toevoegen** — absoluut #1 prioriteit. Elke `data-en`/`data-lb` → ook `data-fr`.

- [ ] **ML2. Deutsch toevoegen** — #2. Noord-Luxemburg (Michelau zit in Nord!), grensstreek Trier/Saarland.

- [ ] **ML3. URL-strategie** — `/fr/`, `/de/`, `/en/`, `/lb/` subdirectory structuur of `?lang=` param. Subdirectory = beter voor SEO.

- [ ] **ML4. hreflang tags per taal** — inclusief `x-default` → FR.

- [ ] **ML5. Canonical URL per taal-versie.**

- [ ] **ML6. Language switcher** standaard op FR in plaats van EN (target market).

- [ ] **ML7. Content vertalen, niet automatisch** — blog artikels, service pagina's, FAQ, testimonials. Machine translation faalt voor juridisch/technisch bouw vocabulaire (bv. "commodo/incommodo", "décennale").

- [ ] **ML8. Meta tags per taal** (title, description, OG).

- [ ] **ML9. JSON-LD LocalBusiness** ook in meerdere talen (name/description).

- [ ] **ML10. Browser language detection** + onthouden in localStorage.

---

## 🏆 Branche-credentials & trust

- [ ] **BR1. Chambre des Métiers du Luxembourg** — lidmaatschapsnummer + logo tonen (verplicht voor ambacht, bouw valt hieronder).

- [ ] **BR2. Fédération des Entreprises du Bâtiment et Génie Civil (FDA)** — lidmaatschap tonen indien van toepassing.

- [ ] **BR3. "Entreprise Responsable" label** — LU kwaliteitslabel INDR, ook "Made in Luxembourg" label (Chambre de Commerce).

- [ ] **BR4. Certifications** — ISO 9001 (kwaliteit), ISO 14001 (milieu), ISO 45001 (veiligheid), indien aanwezig.

- [ ] **BR5. Energy certifications** — myenergy partner? Klima-Agence partner voor energetische renovaties (PRIMe House subsidies).

- [ ] **BR6. Vakmanstitel / Diplôme de Maîtrise** — "Maître Artisan" titel tonen, verplicht voor zelfstandig bouwen in LU.

- [ ] **BR7. Google Reviews widget + Trustpilot/Proven Expert integratie** — externe reviews zijn cruciaal voor trust.

- [ ] **BR8. Awards & pers** — sectie met media coverage (Paperjam, Luxemburger Wort, RTL, Delano).

- [ ] **BR9. Partner/leverancier logo's** — Knauf, Saint-Gobain, Velux, Bosch, lokale bouwmarkt — toont schaal.

- [ ] **BR10. Case studies / referenties** — met klantcitaten én NAW (of logo B2B), foto's voor/na, technische specs.

- [ ] **BR11. Team pagina** — foto's + titels + Maîtrise diploma's van key staff. Personifieert het bedrijf.

- [ ] **BR12. "Années d'expérience" / jaren-counter** met animatie (social proof).

- [ ] **BR13. Clientlijst B2B** — banken, gemeentes, architectenbureaus (Paul Bretz, Witry & Witry, Moreno Architecture, etc.) met toestemming.

---

## 📍 Local SEO Luxembourg

- [ ] **LS1. Google Business Profile** — aanmaken/claimen, categorie "General contractor", foto's, openingstijden, reviews verzamelen.

- [ ] **LS2. NAP consistency** — zelfde adres/telefoon op: site, Google, Editus.lu, Pages Jaunes LU, Yellow.lu, Bing Places, Apple Maps, Waze.

- [ ] **LS3. Editus.lu listing** — LU marktleider voor B2B search.

- [ ] **LS4. Pages Jaunes Luxembourg** — nog veel gebruikt.

- [ ] **LS5. Athome.lu / immotop.lu** — als je real estate doet (service 10).

- [ ] **LS6. Locatiepagina's per regio/canton** — SEO-goud. Create:
  - `/services/new-construction-luxembourg-ville.html`
  - `/services/renovation-esch-sur-alzette.html`
  - `/services/renovation-nord-luxembourg.html`
  - Minimaal voor: Luxembourg-Ville, Kirchberg, Esch-sur-Alzette, Differdange, Dudelange, Ettelbruck, Diekirch, Wiltz, Clervaux, Echternach.

- [ ] **LS7. Service-cantons matrix** — voor elke van de 10 services × 12 cantons = long-tail SEO pagina's (niet overdrijven, begin met top 5×5).

- [ ] **LS8. "Zone d'intervention" kaart** — visueel waar je werkt (heel LU + grensstreek?).

- [ ] **LS9. LocalBusiness Schema met geo coordinates** — exacte lat/lng van Michelau.

- [ ] **LS10. BreadcrumbList, Service, FAQPage schemas** — rich snippets in search.

- [ ] **LS11. Review schema** — `AggregateRating` + individuele `Review` items.

- [ ] **LS12. Article schema** op blog posts (datePublished, author, image, publisher).

- [ ] **LS13. LinkedIn Company Page** + integratie.

- [ ] **LS14. Facebook/Instagram** (project foto's, before/after — visueel medium past bij bouw).

- [ ] **LS15. YouTube kanaal** — timelapse video's van projecten is gouden content.

---

## 📝 Content die ontbreekt

- [ ] **CO1. Home hero video** of wisselende foto's in plaats van 1 statisch beeld.

- [ ] **CO2. Projects/Realisaties pagina** — volledig archief met filter op type/jaar/canton. Elk project detail page met: briefing, uitdaging, oplossing, materialen, foto gallerij, klantcitaat, duurtijd, budget range.

- [ ] **CO3. Before/after slider** voor renovaties (zeer overtuigend).

- [ ] **CO4. Proces pagina** — stap-voor-stap hoe een project verloopt (consult → devis → planning → uitvoering → oplevering → nazorg). Verlaagt drempel.

- [ ] **CO5. FAQ uitgebreider** — minstens 15-20 vragen, gegroepeerd (prijzen, planning, permits, garanties, onderhoud).

- [ ] **CO6. Blog uitbreiden** — 3 artikels is te weinig. Doel: 2 artikels/maand, LU-specifiek (PRIMe House subsidies, Bauhärepflichten, klimabonus, CO2-reductie in bouw, etc.).

- [ ] **CO7. Resources/Guides** — downloadbare PDF's: "Guide de rénovation énergétique au Luxembourg", "Checklist commodo-incommodo", capability statement. E-mail gate voor leads.

- [ ] **CO8. Prijsindicaties / Calculator** — minstens ranges per service (€/m², bv. renovatie €1500-3000/m²). LU markt is erg prijs-opaque — transparantie = onderscheid.

- [ ] **CO9. Subsidies & fiscaal** — uitleg over PRIMe House, Klimabonus, TVA super-réduite 3% voor woningen, déductions fiscales. Enorme informatiebehoefte in LU.

- [ ] **CO10. Durabilité / Nachhaltigkeit pagina** — LU wil in 2050 klimaatneutraal. Bouw speelt grote rol. Vermeld bio-sourced materials, circulair bouwen, AKUT, Cradle-to-Cradle.

- [ ] **CO11. Careers / Jobs pagina** — bouwsector LU heeft enorme personeelstekort. Recruiting via site is gouden.

- [ ] **CO12. Testimonials uitbreiden** — minimaal 10, met foto/video, functie, project type, jaar.

- [ ] **CO13. News / Press section** — bedrijfsnieuws, behaalde projecten, mijlpalen.

- [ ] **CO14. Video content** — owner intro, project showcases, testimonials op video.

- [ ] **CO15. Newsletter** — maandelijkse update.

---

## 💼 Business features

- [ ] **BF1. Devis online aanvraag flow** — multi-step form (projecttype → budget range → timing → detail → contact). Conversion > simpel formulier.

- [ ] **BF2. Afspraak boeken** (Calendly, Cal.com, SavvyCal) — direct consult inplannen.

- [ ] **BF3. File upload** in form — klant kan plannen/foto's meesturen.

- [ ] **BF4. Thank you / confirmation page** — na form submit, met next steps + conversion tracking pixel.

- [ ] **BF5. CRM integratie** — leads naar HubSpot / Pipedrive / Odoo (LU-populair) / Airtable.

- [ ] **BF6. Email auto-response** — direct bevestiging naar klant ("we hebben je aanvraag ontvangen, reactie binnen 24u").

- [ ] **BF7. WhatsApp Business API** — niet alleen chat-link, maar quick replies + catalog.

- [ ] **BF8. Live chat** (Crisp, Tidio) — LU publiek is gewend aan snelle response.

- [ ] **BF9. Klantportaal** (optioneel, fase 2) — project status, foto updates, facturen, documenten.

- [ ] **BF10. Spam/bot protectie** op form — hCaptcha of Cloudflare Turnstile (GDPR-vriendelijker dan reCAPTCHA).

- [ ] **BF11. Analytics (GDPR-compliant)** — Plausible, Simple Analytics, of Matomo (self-hosted) — GEEN Google Analytics zonder IP-anon + consent.

- [ ] **BF12. Conversion tracking** — welk formulier, welke bron, welke pagina leidt tot lead.

- [ ] **BF13. A/B testing framework** (later) — hero CTA, form varianten.

---

## 🔒 Security & reliability

- [ ] **SEC1. HTTPS enforced** — GH Pages doet dit automatisch, maar check na custom domain.

- [ ] **SEC2. HSTS header** — via `_headers` als je naar Netlify/Cloudflare Pages gaat (GH Pages heeft beperkte header control).

- [ ] **SEC3. Content-Security-Policy** meta tag (minimaal) — XSS bescherming.

- [ ] **SEC4. `security.txt`** onder `/.well-known/security.txt` — waar security issues melden.

- [ ] **SEC5. Form submissions via trusted processor** — géén third-party zonder DPA.

- [ ] **SEC6. Honeypot field** in form naast CAPTCHA.

- [ ] **SEC7. Rate limiting** op form (backend service).

- [ ] **SEC8. Backup strategie** — git is primair, maar ook form submissions/leads backup.

- [ ] **SEC9. Uptime monitoring** — UptimeRobot / Better Uptime, alerts bij outage.

- [ ] **SEC10. Error tracking** — Sentry (free tier) voor JS errors.

- [ ] **SEC11. Hosting upgrade overweging** — GH Pages is gratis maar: geen server-side, geen headers, geen forms. Alternatieven: Cloudflare Pages (forms + headers + workers), Netlify (forms built-in, redirects, headers), Vercel. Waarschijnlijk **Cloudflare Pages** beste fit: edge + forms + LU-nabij PoP + gratis.

- [ ] **SEC12. Staging environment** — aparte branch/subdomain voor test voordat main deployed.

- [ ] **SEC13. Dependabot / security alerts** — op de repo.

- [ ] **SEC14. `humans.txt`** — optioneel, credits pagina.

---

## Bestandsoverzicht

```
sam-construction/
├── index.html                     (739 lines, 572KB — te groot door base64)
├── assets/
│   └── styles.css                 (1158 lines — UNTRACKED in git!)
├── services/                      (10 service detail pages)
│   ├── new-construction.html
│   ├── renovation.html
│   ├── demolition.html
│   ├── interior-finishing.html
│   ├── project-development.html
│   ├── civil-engineering.html
│   ├── landscaping.html
│   ├── facade-cleaning.html
│   ├── sanitary-systems.html
│   └── real-estate.html
├── blog/                          (3 articles)
│   ├── energy-efficiency-standards.html
│   ├── restoring-old-town-home.html
│   └── sustainable-construction-materials.html
└── .github/workflows/             (GH Pages deploy, OK)
```

**Ontbreekt volledig:** `robots.txt`, `sitemap.xml`, `404.html`, `CNAME`, `assets/images/`, `assets/main.js`, `privacy.html`, `terms.html`, `cookies.html`, OG image.

---

## Werkvolgorde

**Fase 1 — Site werkt live (Critical):**
1. C1 (commit assets/) → C2 (relative CSS paths) → deploy test
2. C7 (mobile nav) — anders is site onbruikbaar op telefoon
3. C4 (echt telefoonnummer) + C3 (echte email) + C5 (form werkend)
4. C6 (echte maps embed)
5. C9 (CNAME + DNS) als custom domain gewenst
6. C8 (legal pages of links verwijderen)

**Fase 2 — Pro niveau (High):**
7. H1 + H2 (images extracten, alt text) — grootste perf winst
8. H3-H6 (robots, sitemap, 404, OG image)
9. H7 + H8 (schema + hreflang)
10. H9-H14 (performance polish)
11. H15 (CTA link)

**Fase 3 — Wettelijk compliant (LU1-LU9):**
12. Mentions légales + Privacy + Cookies + CGV pagina's
13. Echte cookie consent (Klaro/Cookiebot)
14. Verzekeringsinfo + autorisation d'établissement zichtbaar

**Fase 4 — Meertaligheid (ML1-ML10):**
15. FR versie (prioriteit #1)
16. DE versie (prioriteit #2)
17. hreflang + URL structuur + content echt vertaald

**Fase 5 — Trust & local SEO (BR + LS):**
18. Chambre des Métiers, certifications, verzekeringen
19. Google Business Profile + Editus + Pages Jaunes
20. Locatie-pagina's per canton
21. Schema.org rich snippets

**Fase 6 — Content pro (CO):**
22. Projects archive + detail pages + before/after
23. Proces pagina, prijsindicaties, subsidies info
24. Blog uitbreiden, video content, careers page

**Fase 7 — Business features (BF):**
25. Multi-step devis form, afspraak boeken, file upload
26. CRM integratie, auto-response, GDPR analytics
27. Spam bescherming, conversion tracking

**Fase 8 — Security & reliability (SEC):**
28. Hosting overweging (Cloudflare Pages?), HSTS, CSP
29. Uptime + error monitoring + staging env

**Fase 9 — Polish (Medium + Low):**
30. Accessibility sweep (M1-M5)
31. Content detail (M7, M8, M9, M11)
32. Nice-to-haves (L1-L7)

---

## Aantekeningen tussen sessies

_Hier tussentijdse notes zetten zodat bij resume duidelijk is waar we staan._

- [2026-04-05] Audit compleet, nog niks gefixt. Volgende sessie: start bij Fase 1 / C1.

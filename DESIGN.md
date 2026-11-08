# DESIGN.md: Ned's portfolio, v3 "Sunny studio" (soft clay + bento)
_Supersedes v2 "Vintage travel guide" (commit d892539). Owner feedback on v2: "too bland, little interactive animation, harsh brutalistic colour palette, unsavoury for a customer." Branch `redesign/2026-11`. Nothing is pushed or merged without the owner's word._

## 1. Mood
A friendly, playful studio a small-business owner would be glad to walk into. In 3 seconds: "this person is warm, capable and makes things I can touch." Nothing harsh: no black fields, no thick black borders, no mono type, no hard shadows. Everything reacts to the pointer.

## 2. Why v2 failed (and what we change)
| v2 | v3 |
|---|---|
| Black "ink" slides, 2 px black borders, hard edges | Soft pastel colour sheets, rounded 36 px corners, no black fields; deep plum text only |
| Mono captions, tiny status bar, "turn the page" slide deck | One friendly typeface, ordinary scrolling (slide-jacking removed: stiff, fragile) |
| Motion = page wipe + a few reveals | Cursor-follow blobs, draggable floating browser windows, magnetic buttons, 3D-tilt cards with glare, filter chips, expanding process cards, count-up, bouncing letters, confetti on send |
| Reference-led by two sites with a "design-nerd" look | Reference decisions below, chosen for warmth |

## 3. References: decisions we copy, never the brand
- **Claymorphism / bento landing pages** (Refero, godly.design "soft" collections): big rounded panels, pastel fields, chunky friendly type, layered soft shadow. Copy: radius, one-colour-per-section rhythm.
- **PP Neue Montreal cover** (kept from v2): giant wordmark close, flat grainy colour fields. Copy: the wordmark as a closing sign-off.
- **Nodeck** (kept from v2): snappy power3-style easing, hover gating. Copy: motion feel, not the slide stage.

## 4. Named style
**Soft clay + bento.** Not shared with any other site in the portfolio (Aladdins bold food, Church Hill HUD, Lani blueprint, Little Italy editorial, D&D ethereal, Backyard poster, Bright bento-hardware). Ned's differs by being the only one built from rounded pastel sheets with draggable objects.

## 5. Tokens (locked)
- Text/ink `--ink:#2B2147` (deep plum; never pure black). Page `--cream:#FFF7EC`.
- Sheets: `--butter:#FFD866` (cover) · `--sky:#A8D6FF` (work) · `--mint:#9FE6C6` (process) · `--lilac:#CBBBFF` (proof) · `--pink:#FFB5D0` (contact).
- **CTA colour** `--go:#FF7A59` coral, ink label (5.8:1). Used for CTAs only (call pill, send, mobile call bar) and nothing else.
- Contrast (ink on): cream 14.0, butter 10.8, sky 9.7, mint 10.4, lilac 8.6, pink 9.1, coral 5.8.
- Type: **Bricolage Grotesque** variable (self-hosted) for everything: display 800 with tight leading, body 400-500. Sizes: wordmark `clamp(8rem,26vw,24rem)` · title `clamp(2.3rem,5.4vw,4.8rem)` · lead `clamp(1.4rem,2.6vw,2.4rem)` · body 18 px/1.55 (max 60ch) · small 14-15 px. Mono face dropped (felt technical/harsh); its file is deleted.
- Radius: sheets 36 px (24 px phone), cards 24 px, pills 999 px. Spacing base 8 px; gutter `clamp(16px,3vw,40px)`.
- Depth: one soft layered shadow `0 1px 2px rgba(43,33,71,.08), 0 14px 32px -12px rgba(43,33,71,.28)`, deeper on hover. Deliberate exception to the "no box-shadow" lint: it is what makes the clay feel soft.
- Texture: faint SVG grain over sheets (inline data URI). No gradients except the glare on tilt cards.
- Icons: inline SVG, 2 px round strokes. No emoji.

## 6. Layout, desktop (1440x900)
Normal vertical scroll; five rounded colour sheets on a cream page, a floating pill header.
1. **Cover** (butter). Left: greeting line, h1 "Websites for businesses that don't have one yet.", one sentence, **one primary CTA "Call Ned 07881 174192"** + a text link "See the eight sites". Right: a stage of three overlapping **browser windows** (Aladdins, Lani, D&D) on slow drift, parallaxed by cursor depth, **draggable** (spring back with overshoot on release). Soft blobs behind follow the cursor. A **marquee** of the eight business names runs under the sheet.
2. **Work** (sky). Title "Eight Northfield sites that had none." + note "Built on spec, to show owners what's possible." **Filter chips** (All · Food & drink · Trades · Shops & beauty) with `aria-pressed`. **Staggered masonry** (v3.1): alternating 7/5-column pairs, odd cards nudged down with slight rotation; cards enter on scroll (CSS `animation-timeline: view()`, IO fallback) with screenshot parallax and a slow hover "peek"; filtering reflows with FLIP. Each card: browser-window screenshot, name, trade, style tag, story, one link "Live site". Hover/focus: 3D tilt toward the pointer + glare + "Open live site" badge pops; the whole card is the link target (stretched).
3. **Process** (mint). Title "Four stops. Every site." Four **expanding cards** (Research, Design, Build, Launch): the hovered/focused card grows (flex), others fold to icon + title; each has its own icon and tone. One open at a time, first open by default.
4. **About / proof** (lilac). "Built by hand, start to finish." Three **clay stat tiles** counting up (8 live sites · 100% hand-coded · 0 templates), the two true paragraphs, and tool **chips that bounce** on hover.
5. **Contact** (pink). "Want a site like these?" Cream rounded **postcard form** (-1.2° tilt, settles flat on focus), fields with a focus glow, live stamp "Posted from {Business}, Northfield", coral send button with **confetti** on success. Beside: "or ring 07881 174192" and email. Below the sheet, the giant **NED** wordmark whose letters bounce on hover, then the footer line.
- Header: logo pill left, centre links (Work · Process · About · Contact) with a sliding highlight, coral call pill right. Shrinks and gains blur after scroll. A thin scroll-progress bar at the top edge (ink).

## 7. Mobile (390 px) is its own composition and the primary one
- Header: logo pill + "Menu" button (full-screen friendly sheet with big links). **One sticky bottom coral call bar.**
- Cover: greeting, h1, sentence, CTA, then the three browser windows as a **tilted fan** (tap-safe), marquee below.
- Work: filter chips scroll horizontally; cards stack as a **sticky pile** (each card `position:sticky`, slides over the previous one; pure CSS). Image first.
- Process: vertical stack, all expanded. Proof: stats in one column. Contact: full-width form, 44 px targets.
- No horizontal scroll at 360-430 px. Tilted elements get side margin.

## 8. Motion (all off under `prefers-reduced-motion`; pointer effects only under `(hover:hover) and (pointer:fine)`)
- Easing `--out:cubic-bezier(.215,.61,.355,1)`, `--pop:cubic-bezier(.34,1.56,.64,1)`. Durations: press 120 ms (scale .96) · hover 200-300 ms · reveals 600 ms with 70 ms stagger · expand 500 ms · confetti 1.1 s · blob/stage drift 9-14 s.
- Reveals are progressive enhancement: content visible without JS (`.js .rv` hides, IntersectionObserver reveals).
- Moments: cover = draggable windows + cursor blobs + marquee; work = tilt + glare + filter; process = expanding cards; proof = count-up + chip bounce; contact = live stamp + confetti; footer = bouncing wordmark.
- Animate `transform`/`opacity` only. No autoplay audio/video.

## 9. Copy rules (unchanged from v2)
- Only statements true today. No review claims. Sites are built **on spec**; never imply the business commissioned them. Style tags: Aladdins Bold food · Church Hill HUD garage · Lani Blueprint architectural · Little Italy Editorial magazine · D&D Ethereal editorial beauty · Backyard Match-day poster · Bright Bento hardware · Bang Bang Redesign in progress.
- Real details only: phone `07881 174192`, email `infiniteasura2006@gmail.com`.
- No "Line one. *Accent line two.*" formula, no eyebrow pill, no two equal buttons, no AI filler. Warm voice: plain, first person.

## 10. Hard constraints
- One self-contained `index.html`, inline CSS/JS, no framework or build. Local assets only (`assets/fonts/bricolage-grotesque-latin.woff2`, `assets/work/*.webp`, brand mark). Zero third-party requests on load; the only outside call is the form POST.
- CSP-ready: no inline handlers, no `style=""` attributes in markup (JS may use `el.style`). Run `python3 ~/Work-Projects/tools/csp-hash.py --check index.html`.
- **Preserve exactly:** `leadForm` submit script/payload/endpoint/messages/double-submit guard, JSON-LD `Person`, canonical/OG/Twitter, favicon, skip link, `<main>`, `lang`, `robots.txt`, `sitemap.xml`.
- Verify live: nav anchors clear the header (`scroll-margin-top`), mobile menu, no horizontal scroll at 390 and 1440, console clean, Lighthouse mobile a11y/BP/SEO 100 and performance not below the old baseline, before/after screenshots.

## 11. Idea and the one live thing
- **Idea:** eight real Northfield sites Ned built, shown as little browser windows you can pick up and throw around, in a bright studio. Competitor test: another designer cannot show these eight local sites or this exact toy-box feel.
- **Live thing:** type your business name and it appears on the postcard stamp (kept from v2, it worked); plus drag the cover windows.

## 12. Anti-bland checklist (PLAYBOOK §14)
Reference-led ✔ · DESIGN.md ✔ · named style ✔ · hero = one idea (draggable windows) ✔ · no slider ✔ · headline not accent formula ✔ · one CTA colour, one primary action ✔ · logo links home ✔ · footer has contact ✔ · single variable family, deliberate ✔ · texture (grain, clay) ✔ · no emoji ✔ · work not equal cards (bento + filter) ✔ · motion beyond fade-up ✔ · hover/form micro-interactions ✔ · separate mobile composition ✔ · business-specific copy ✔ · reduced-motion and no-JS safe ✔.

## 13. Font source (OFL 1.1)
Bricolage Grotesque, Google Fonts Latin subset, variable wght 300-800 + opsz, 76,888 bytes. Spline Sans Mono removed.


## v3.1 motion note
Hero windows are real links (drag never navigates), fan apart as the hero scrolls out, and lift/straighten with an "Open live site" pill on hover/focus.

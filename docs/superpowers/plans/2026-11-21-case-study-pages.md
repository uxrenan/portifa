# Case Study Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a horizontal-scroll case study page for Condomínio Waldemar (pt-BR + en) and stop the home's project cards from leading to 404s.

**Architecture:** One static route per language (same pattern as the sites page), a `CasePage` server component that sets the i18n context, and a client `CaseTrack` that pins a full-viewport track with `position: sticky` and maps native vertical scroll progress to `translateX` (Framer Motion `useScroll`/`useTransform`). Below 768px or with reduced motion the same panels stack vertically. Panel content comes from `config/cases.ts` (structure) and the dictionaries (copy).

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Framer Motion 12, Lenis (already global), Playwright (preinstalled, for checks only), ImageMagick `convert` (for WebP).

**Spec:** `docs/superpowers/specs/2026-11-21-case-study-pages-design.md`

## Global Constraints

- No new dependencies. Framer Motion and Lenis only.
- Do not hijack the wheel. No `overflow: hidden` on body, no `wheel` listeners. Native scroll must drive everything.
- Read `node_modules/next/dist/docs/` for any Next API you touch (metadata, `opengraph-image`, `Image`). Static folders only, no dynamic segments.
- Copy is fixed by the spec. pt-BR text exactly:
  - Title: `Uma pequena cidade dentro da cidade — e um lugar para ser conhecida.`
  - Tags: `Website`, `UI Design`, `Desenvolvimento`, `Rio Grande, RS` (no year)
  - Context: `O Parque Residencial Waldemar Pereira Duarte faz parte de Rio Grande desde 1991. Moradia, comércio, ginásio, áreas abertas e espaços infantis convivem ali há mais de três décadas, quase como um bairro próprio.`
  - Goal: `Criar um site que apresente o condomínio para quem ainda não o conhece: mostrar a rotina, a estrutura e como chegar, com a mesma sensação de comunidade de quem vive lá.`
  - Role: `Design e desenvolvimento: organização do conteúdo, interface, front-end e publicação.`
  - Statement: `Diferentes partes da rotina acontecem por aqui.`
- en copy is a faithful translation with no added facts.
- Routes: `/projetos/waldemar` and `/en/projects/waldemar`.
- Colors: background `#171a18`, text `#eceee8`, muted `#b3bbb2`. Fonts: `--type-display`, `--type-body`, `--type-accent`. Easing `cubic-bezier(.22, 1, .36, 1)`.
- Animate only `transform`, `opacity` and `clip-path`. With `prefers-reduced-motion: reduce` there is no horizontal track, no `PixelReveal` and no parallax.
- No site Header, Footer or Mini Renan on the case page.
- Every commit passes `pnpm lint` and `pnpm typecheck`.

## Verification Harness

The repo has no test framework, and the spec forbids new dependencies. The "tests" are therefore one Playwright script outside the repo, run against a production build:

- Script: `/tmp/claude-0/-home-user-portifa/10ed267a-c0f6-5bb7-9796-1715a113bd05/scratchpad/checks/case-check.cjs`. It is CommonJS, so `require('playwright')` resolves globally.
- Server: `pnpm build && (pnpm start &)`, which serves `http://127.0.0.1:3000`. Stop it with `pkill -f "next start"` before rebuilding.
- Run: `node <script> <group>`, where group is one of `routes | track | motion | home | all`. It prints `PASS name` or `FAIL name: reason` per check and exits non-zero on any failure.

Skeleton, written in Task 1. Each later task appends its own group.

```js
const { chromium } = require('playwright');
const BASE = 'http://127.0.0.1:3000';
const groups = {};
let failed = 0;
const check = async (name, fn) => { try { await fn(); console.log('PASS', name); } catch (e) { failed++; console.log('FAIL', name + ':', e.message); } };
const assert = (cond, msg) => { if (!cond) throw new Error(msg); };
// groups.routes = async (browser) => { ... }   ← one per task
(async () => {
  const browser = await chromium.launch();
  const want = process.argv[2] || 'all';
  for (const [name, run] of Object.entries(groups)) if (want === 'all' || want === name) await run(browser);
  await browser.close();
  process.exit(failed ? 1 : 0);
})();
```

## Review Focus

1. **Window resized across 768px mid-page.** The track's section height must be recomputed: no blank tail, and no content cut off when it switches between horizontal and vertical. Test: `track` › `resize keeps height consistent`.
2. **Keyboard Tab into end-panel links on desktop.** The focused link must end up inside the viewport, since the track is translated. Test: `track` › `focus scrolls end link into view`.
3. **Language switch from the case.** It must land on the same case in the other language, not on that language's home. Test: `routes` › `language selector targets the other case`.
4. **Short or wide desktop viewports (1280×600, 1920×1080).** Image panels must fit the height and text panels must not clip. Test: `track` › `panels fit short viewport`.
5. **Reduced motion.** The page must stack vertically with no canvases, and all content must be visible without scrolling tricks. Test: `motion` › `reduced motion is static vertical`.

---

### Task 1: Routes, copy and metadata for the Waldemar case

**Files:**
- Modify: `i18n/config.ts` (`ROUTES`, new `CASE_KEYS`/`CaseKey`)
- Modify: `i18n/dictionaries/pt-BR.ts`, `i18n/dictionaries/en.ts` (new `cases` block)
- Modify: `i18n/metadata.ts` (`pageMetadata` handles case routes)
- Modify: `components/Seo/ShareImage.tsx` (`shareImage` handles case routes)
- Modify: `app/sitemap.ts` (`PRIORITY.waldemar = .8`)
- Create: `components/Pages/CasePage.tsx` (for now it renders the text in plain markup; Task 3 replaces the body)
- Create: `app/(pt)/projetos/waldemar/{page,opengraph-image,twitter-image}.tsx`
- Create: `app/(en)/en/projects/waldemar/{page,opengraph-image,twitter-image}.tsx`
- Test: the check script, group `routes`

**Interfaces:**
- Produces:
  - `ROUTES.waldemar = { "pt-BR": "/projetos/waldemar", en: "/en/projects/waldemar" }`
  - `export const CASE_KEYS = ["waldemar"] as const; export type CaseKey = typeof CASE_KEYS[number];` in `i18n/config.ts`
  - Dictionary `cases`:
    ```ts
    cases: {
      labels: { context: string; goal: string; role: string; back: string; backLabel: string; visit: string; visitLabel: string; backToProjects: string; progress: string };
      waldemar: { name: string; metaTitle: string; metaDescription: string; shareEyebrow: string;
                  title: string[];        // the hook split into display lines
                  tags: string[]; context: string; goal: string; role: string; statement: string;
                  alts: Record<string, string> }  // keyed by panel id from config/cases.ts (Task 2)
    }
    ```
    pt-BR labels: `Contexto`, `Objetivo`, `Meu papel`, `Projetos`, `Voltar aos projetos`, `Ver site`, `Ver site do Condomínio Waldemar, abre em nova aba`, `Voltar aos projetos`, `Progresso do case`. en: the same in English.
  - `CasePage({ locale, caseKey }: { locale: Locale; caseKey: CaseKey })`. It wraps `I18nProvider` with `route={caseKey}`.

- [ ] **Step 1: Write the check script skeleton plus the `routes` group**

Assertions:
- `GET /projetos/waldemar` → 200; the `h1` text includes `Uma pequena cidade dentro da cidade`; the body text includes the Context, Goal and Role strings verbatim.
- `GET /en/projects/waldemar` → 200, `html[lang="en"]`, and the `h1` is not the pt-BR one.
- No `2026` anywhere in the case page's `main` text (both languages).
- The canonical is `<link rel="canonical">` ending `/projetos/waldemar`, and `hreflang="en"` points to `/en/projects/waldemar`.
- `/sitemap.xml` contains both case URLs.
- `/projetos/waldemar/opengraph-image` → 200 `image/png`.
- `language selector targets the other case`: on the pt page, click `.language-trigger`; the `a[hreflang="en"]` href is `/en/projects/waldemar`. Write this assertion now; it passes only after Task 3 adds the selector.

- [ ] **Step 2: Build and run.** Expected: FAIL on 404s.

Run: `pnpm build && (pnpm start &) && sleep 5 && node <script> routes`

- [ ] **Step 3: Implement the files listed above**

- `pageMetadata` and `shareImage` pick their title, description and eyebrow per route: `home` and `sites` stay as today, and any `CaseKey` reads `cases[key].metaTitle` and the related fields.
- The `title` in metadata follows the sites pattern: `${metaTitle} | ${SITE_NAME}`.
- Page files copy the sites page files with `pageMetadata(locale, "waldemar")` and `<CasePage locale=… caseKey="waldemar" />`.

- [ ] **Step 4: Rebuild and run `routes`.** Expected: all PASS except `language selector targets the other case`.

- [ ] **Step 5: Lint, typecheck, commit**

```bash
pnpm lint && pnpm typecheck
git add i18n app components/Seo components/Pages/CasePage.tsx
git commit -m "feat: add Waldemar case routes, copy and metadata"
```

---

### Task 2: Waldemar screenshots and case panel config

**Files:**
- Create: `public/cases/waldemar/*.webp`
- Create: `config/cases.ts`
- Modify: both dictionaries (`cases.waldemar.alts` for every image id)
- Capture script (not committed): `/tmp/claude-0/-home-user-portifa/10ed267a-c0f6-5bb7-9796-1715a113bd05/scratchpad/checks/capture-waldemar.cjs`

**Interfaces:**
- Produces:
  ```ts
  export type CaseShot = { src: string; width: number; height: number };
  export type CasePanel =
    | { kind: "opening" } | { kind: "about" } | { kind: "statement" } | { kind: "end" }
    | { kind: "image"; id: string; shot: CaseShot }
    | { kind: "phones"; id: string; shots: CaseShot[] };
  export type CaseStudy = { key: CaseKey; site: string; panels: CasePanel[] };
  export const CASES: Record<CaseKey, CaseStudy>;
  ```
  `CASES.waldemar.site = "https://condominio-waldemar.vercel.app/"`.

  Panel order, from the spec:
  1. `opening`
  2. `about`
  3. `image` id `hero`
  4. `statement`
  5. `image` id `history`
  6. `image` id `routine`
  7. `image` id `spaces`
  8. `phones` id `mobile`
  9. `end`

- [ ] **Step 1: Capture the screenshots**

Capture `https://condominio-waldemar.vercel.app/` with Playwright at `deviceScaleFactor: 2`. Scroll through the whole page first so lazy images load.

| File | Viewport | What to capture |
|---|---|---|
| `hero.webp` | 1440×900 | the first fold |
| `history.webp` | 1440×900 | the "Sobre" section through the 1991 / 30+ / Av. Itália / Rio Grande band (locator `#sobre` plus the band) |
| `routine.webp` | 1440×900 | `#viver` |
| `spaces.webp` | 1440×900 | `#estrutura` |
| `mobile-1.webp`, `mobile-2.webp`, `mobile-3.webp` | 390×844 | the hero, `#viver` and `#estrutura` viewports |

Convert with `convert in.png -quality 82 -resize 50%x50% out.webp`. The 50% gives 1× pixels; `next/image` serves the sizes. Keep the desktop shots at 1440px wide or wider.

- [ ] **Step 2: Verify the files.** Run `identify public/cases/waldemar/*.webp`. Expected: 7 files, each under 400 KB. Record their width and height in `config/cases.ts`.

- [ ] **Step 3: Write `config/cases.ts` and the `alts`**

Alt texts describe what is visible: section titles, photos, cards. No claims beyond the site. They need no review, but follow the pt-BR style of the existing `projects.items[].alt`.

- [ ] **Step 4: Lint, typecheck, commit**

```bash
pnpm lint && pnpm typecheck
git add public/cases config/cases.ts i18n/dictionaries
git commit -m "feat: add Waldemar case screenshots and panel config"
```

---

### Task 3: The horizontal track (layout, bar, progress, focus)

**Files:**
- Create: `components/CaseTrack/CaseTrack.tsx` (client: track, scroll mapping, focus handling)
- Create: `components/CaseTrack/CaseBar.tsx` (client: name, `LanguageSelector`, ×)
- Create: `components/CaseTrack/CasePanels.tsx` (one component per panel kind)
- Create: `components/CaseTrack/case-track.css`
- Modify: `components/Pages/CasePage.tsx` (renders `<CaseBar/>` and `<CaseTrack study={CASES[caseKey]}/>` inside `<main>`)
- Test: check script group `track`

**Interfaces:**
- Consumes: `CASES`, `CaseStudy` and `CasePanel` (Task 2), the dictionary `cases` (Task 1), and `Button` (`tone="dark"`) and `LanguageSelector` from existing components.
- Produces:
  - `CaseTrack({ study }: { study: CaseStudy })`. It exposes a React context `CaseTrackContext = { horizontal: boolean; progress: MotionValue<number>; panelRange(el: HTMLElement): [number, number] }` for Task 4.
  - `horizontal` is true only when `(min-width: 768px)` matches and reduced motion is off.
  - DOM hooks the checks rely on: `section.case-track[data-horizontal="true|false"]`, `.case-track-rail` (the translated element), `.case-panel[data-kind]`, `.case-progress`, `.case-bar a.case-close[href]`.

- [ ] **Step 1: Append the `track` group to the check script**

At 1440×900 on `/projetos/waldemar`:
- `[data-horizontal="true"]`.
- After `window.scrollTo(0, innerHeight * 2)` plus 600 ms, the `.case-track-rail` transform's x is below 0.
- `document.documentElement.scrollWidth === innerWidth` (no horizontal page overflow).
- After scrolling to the bottom, the `end` panel's right edge is ≤ `innerWidth` and ≥ `innerWidth - 40`.
- `.case-close` href is `/#projetos` (en: `/en#projetos`).

`focus scrolls end link into view`: from the top, focus `.case-panel[data-kind="end"] a` via `el.focus()` and wait 800 ms. The link's bounding rect must be inside the viewport.

`panels fit short viewport`: at 1280×600 and at 1920×1080, every `.case-panel` rect height is ≤ `innerHeight`, and every text panel has `scrollHeight <= clientHeight`.

`resize keeps height consistent`: resize 1440 → 390 → 1440. Then `[data-horizontal]` flips to false and back, and at the end `scrollHeight - innerHeight` ≈ the rail's travel distance ± 2px.

At 390×844:
- `[data-horizontal="false"]`.
- The rail has no transform.
- Panels stack (each panel's top is greater than the previous one's).
- No horizontal overflow.

- [ ] **Step 2: Build and run `track`.** Expected: FAIL (no track yet).

- [ ] **Step 3: Implement**

Layout:
- The section's height is `travel + innerHeight`, where `travel = rail.scrollWidth - innerWidth`, measured with a `ResizeObserver` on the rail and on the window.
- Inside the section, a `position: sticky; top: 0; height: 100dvh; overflow: clip` stage holds the rail.
- `x = useTransform(scrollYProgress, [0, 1], [0, -travel])`, using `useScroll({ target: section, offset: ["start start", "end end"] })`.
- `panelRange(el)` returns `[el.offsetLeft - innerWidth, el.offsetLeft + el.offsetWidth] / travel`, clamped to 0–1.

Panels:
- Image panels have height `calc(100dvh - 2 × bar height)`, width from the shot's ratio, and render `next/image` with explicit `sizes`.
- Text panels are `min(560px, 80vw)` wide.

Focus: listen for `focusin` on the rail while horizontal. Get the focused element's panel and call `window.scrollTo({ top: sectionTop + panel.offsetLeft * (travel ? 1 : 0) })`, with the target clamped to `[sectionTop, sectionTop + travel]`. Lenis follows native scroll.

Vertical mode: no sticky stage, no height override, no transform; panels in a column with `gap`.

Bar:
- Fixed at the top with a transparent background.
- Name on the left; `LanguageSelector placement="bottom"` and the × link on the right.
- × is an SVG with `aria-label={labels.backLabel}`.
- Restyle the selector for the dark background through `.case-bar .language-trigger` overrides only.

`.case-progress` is a 2px bar at the bottom with `scaleX = scrollYProgress`. Hidden when not horizontal.

End panel has three buttons:
- `Button tone="dark"` to `study.site` with `external`, using `visit` and `visitLabel`.
- `Button tone="dark" variant="secondary"` to the home `#projetos`.
- `Button tone="dark"` to `quoteHref(contact.quoteMessage)`, labelled `contact.talk`.

- [ ] **Step 4: Rebuild and run `track` and `routes`.** Expected: all PASS, including `language selector targets the other case`.

- [ ] **Step 5: Screenshot check.** Take 1440×900 shots at scroll 0, 33%, 66% and 100%, plus a full-page 390×844 shot, into the scratchpad. Look at them for overlap, clipped text and bar contrast.

- [ ] **Step 6: Lint, typecheck, commit**

```bash
pnpm lint && pnpm typecheck
git add components/CaseTrack components/Pages/CasePage.tsx
git commit -m "feat: horizontal case track with bar, progress and focus handling"
```

---

### Task 4: Animations in the site's vocabulary

**Files:**
- Modify: `components/CaseTrack/CasePanels.tsx`, `components/CaseTrack/case-track.css`
- Test: check script group `motion`

**Interfaces:**
- Consumes: `CaseTrackContext` (Task 3) and `PixelReveal({ columns, rows, shown, color, delay })` from `components/PixelReveal/PixelReveal.tsx`.

What to animate:
- **Image panels:** `useInView(ref, { once: true, amount: .25 })`, which works horizontally because IntersectionObserver sees transforms. Add a `PixelReveal` with `color="#171a18"`, `columns = 24`, and `rows = round(24 × h / w)`. Wrap the image in a layer scaled 1.06 → 1 over 1.1s with the site easing, like `.project-image-motion`.
- **Phone panel:** the same reveal per phone, staggered 140ms.
- **Opening:** each title line sits in an `overflow: hidden` mask and rises from `translateY(105%)` with a 90ms stagger on load. Tags fade and rise 10px after it.
- **About:** labels and paragraphs fade and rise 10px when in view, staggered 80ms.
- **Statement:** `progress` mapped through `panelRange(el)`. The text's x goes `24% → -8%` across the range, and `clip-path` goes `inset(0 100% 0 0) → inset(0 0% 0 0)` over the first 45%, mirroring `EditorialPause`. In vertical mode it only fades in on view, with no parallax.
- **Reduced motion:** render none of the above. Text and images are static, and no `PixelReveal` is mounted.

- [ ] **Step 1: Append the `motion` group**
- 1440×900, before scrolling: `.case-panel[data-kind="image"] canvas.pixel-reveal` exists for the hero panel.
- After scrolling to the end and waiting 1.5s: no `canvas.pixel-reveal` remains in the hero panel, because it removes itself when done.
- `reduced motion is static vertical`: a new context with `reducedMotion: 'reduce'` at 1440×900. Then `[data-horizontal="false"]`, zero `canvas.pixel-reveal`, the statement text's computed `clip-path` is `none`, and every `.case-panel` has computed opacity `1`.

- [ ] **Step 2: Run `motion`.** Expected: FAIL (no canvases yet).
- [ ] **Step 3: Implement as described above.**
- [ ] **Step 4: Rebuild and run `motion`, `track` and `routes`.** Expected: all PASS. Take a quick screen recording or 4 screenshots mid-scroll to confirm the reveals fire as panels enter.
- [ ] **Step 5: Lint, typecheck, commit**

```bash
pnpm lint && pnpm typecheck
git add components/CaseTrack
git commit -m "feat: case page animations matching the site"
```

---

### Task 5: Home project cards lead to the case, no 404s

**Files:**
- Modify: `config/projects.ts` (type and data, plus its header comment)
- Modify: `components/Projects/ProjectVisual.tsx` (internal link branch)
- Modify: `components/Projects/Projects.tsx` (cursor label and the `href` it passes)
- Test: check script group `home`

**Interfaces:**
- Consumes: `CaseKey`, `pathFor` (Task 1).
- Produces: `type SelectedProject = { number: string; image: string; caseKey?: CaseKey; soon?: boolean }`. Remove `href` and `external`.
  - Data: AVA `soon: true`, Waldemar `caseKey: "waldemar"`, Optimiz `soon: true`, placeholder `soon: true`.
  - `ProjectVisual({ children, title, href }: { children; title: string; href?: string })`: with `href`, it renders a same-tab `next/link` `Link` with `aria-label={`${t.projects.viewProject}: ${title}`}`. Without one, it renders the inert anchor as today.
  - `Projects` passes `href={project.caseKey ? path(project.caseKey) : undefined}`. The card's `data-project-card` is `soon` or `cursor`.

- [ ] **Step 1: Append the `home` group**
- On `/` and `/en`, collect every `a.project-visual[href]`. Each one is fetched with status 200, and exactly one exists: `/projetos/waldemar` (or `/en/projects/waldemar` on `/en`).
- Cards 01, 03 and 04 have `aria-disabled="true"`.
- No `a.project-visual` has `target="_blank"`.

- [ ] **Step 2: Run `home`.** Expected: FAIL (the Waldemar card still has the external href).
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Rebuild and run `all`.** Expected: all PASS.
- [ ] **Step 5: Lint, typecheck, commit**

```bash
pnpm lint && pnpm typecheck
git add config/projects.ts components/Projects
git commit -m "feat: open the Waldemar case from its card; mark unbuilt cases as coming soon"
```

---

### Task 6: Final verification and handoff

- [ ] **Step 1:** Run `pnpm lint && pnpm typecheck && pnpm build`. Expected: all succeed with zero warnings.
- [ ] **Step 2:** Run `node <script> all`. Expected: every check PASS. Paste the output in the handoff.
- [ ] **Step 3:** Take screenshots for the user (deviceScaleFactor 2): desktop at 4 scroll positions, and mobile full page, both languages for the opening. Send them with `SendUserFile`.
- [ ] **Step 4:** Update `README.md` status line only if the user asks. Otherwise push the branch (`git push -u origin claude/project-overview-yn87ni`).

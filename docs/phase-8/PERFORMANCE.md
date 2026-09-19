# Phase 8 — Performance report

**Theme:** Payedaar `0.8.0-phase8`  
**Date:** 2026-09-18  
**Budgets (from implementation plan §13.1):** LCP ≤ 2.5s · CLS ≤ 0.1 · INP ≤ 200ms · lean deferred JS

## Theme-side optimizations shipped

| Technique | Implementation |
|-----------|----------------|
| Critical CSS early | `critical.css` first (skip-link, header min-height, media placeholders) |
| Font preload | Plus Jakarta Sans **400 + 700** only (`font-face.liquid`) |
| Logo preload | `preload_tag` when `settings.logo` set |
| Conditional CSS | `section-home` / `template-collection` / `section-product` by template |
| Conditional JS | `home.js`, `collection-filters.js`, `product.js` by template |
| Global JS kept lean | `global.js` + `cart.js` + `theme-extras.js` only on every page |
| Image CLS | `aspect-ratio` on cards, gallery, hero; eager + `fetchpriority=high` on LCP candidates |
| Lazy below-fold | Product cards / secondary gallery slides / footer logo |
| Duplicate PLP SEO | `noindex,follow` on filtered/tagged collections |

## Lighthouse (merchant runbook)

Run against the **unpublished Payedaar theme preview** with compressed hero/product media:

1. Chrome DevTools → Lighthouse → Mobile · Navigation · Performance + Accessibility  
2. Target: Performance ≥ **80**, Accessibility ≥ **90**, CLS ≤ **0.1**  
3. If Performance < 80 with demo media: optimize hero to ~200–300KB WebP/JPEG, defer third-party app embeds, re-test  

### Documented exceptions (acceptable until catalog polish)

- App embeds (reviews, chat) inject third-party scripts — measure with embeds off for theme baseline, then on for launch.  
- Unoptimized merchant-uploaded hero art can push LCP over budget; theme already preloads fonts/logo and eager-loads first hero slide.

## Asset weight notes (local)

| Bundle | Load scope |
|--------|------------|
| `base` + `nav` + `cart` + `secondary` | All templates |
| `section-home.css` + `home.js` | Index only |
| `template-collection.css` + `collection-filters.js` | Collection / search |
| `section-product.css` + `product.js` | Product only |

## Verification checklist

- [ ] Homepage Lighthouse Performance ≥ 80 (optimized media)  
- [ ] Homepage + PDP CLS ≤ 0.1  
- [ ] Network: product.js absent on homepage; home.js absent on PDP  
- [ ] Fonts: only 400/700 show as preload in `<head>`

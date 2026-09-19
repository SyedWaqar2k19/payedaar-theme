# Phase 5 complete — Collection, search, filters, list-collections

**Date:** 2026-09-18  
**Theme version:** `0.5.0-phase5`  
**Theme Check:** 82 files, **0 offenses**

## Filter strategy (P5-AC1)

**Ajax Section Rendering API** — `facets-form` fetches `?section_id={id}&{filter/sort params}`, swaps grid / facets / count / pagination, and updates history with `pushState`.  

**Fallback:** Without JS, filter form still submits (noscript Apply); fetch errors navigate full-page.

## Delivered

| Feature | Implementation |
|---------|----------------|
| Collection PLP | `sections/main-collection.liquid` — H1, optional image/description, 2-col mobile grid |
| Facets | `snippets/facets.liquid` — list/boolean + price range via `collection.filters` |
| Active chips | `snippets/facets-active.liquid` — remove + clear all |
| Sort | Native `sort_options` (best-selling, price, newest, etc.) |
| Mobile drawer | `<facet-drawer>` — overlay, Escape, Tab focus trap |
| Pagination | `snippets/pagination.liquid` — preserves filter query |
| Search | `sections/main-search.liquid` — same cards + facets when performed |
| List collections | `sections/main-list-collections.liquid` + `card-collection` |
| Empty states | Hot Deals CTA via `empty-state` |
| Assets | `template-collection.css`, `collection-filters.js` |

## Acceptance

| ID | Status |
|----|--------|
| P5-AC1 | ✅ Ajax + page fallback |
| P5-AC2 | ✅ Sort select wired to facet form |
| P5-AC3 | ✅ Mobile 2 columns |
| P5-AC4 | ✅ Drawer focus trap |
| P5-AC5 | ✅ Empty → Hot Deals |
| P5-AC6 | ✅ Unique H1; description toggle |
| P5-AC7 | ✅ Debounced requests + loading opacity |

## Merchant setup

1. **Shopify Admin → Search & Discovery → Filters** — enable Availability, Price, etc.
2. Create collection handle `hot-deals` for empty-state CTAs.
3. Optional: assign a menu for curated category directory on `/collections`.

## Push

```powershell
cd payedaar
shopify theme push --theme "Payedaar" --store cwvavv-yb.myshopify.com
```

## Next

**Phase 6** — Product detail page (gallery, variants, sticky ATC, trust, related).

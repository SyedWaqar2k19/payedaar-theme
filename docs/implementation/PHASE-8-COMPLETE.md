# Phase 8 complete — Performance, SEO, a11y, QA hardening

**Date:** 2026-09-18  
**Theme version:** `0.8.0-phase8`  
**Theme Check:** 104 files, **0 offenses**

## Delivered

| Area | Implementation |
|------|----------------|
| Performance | Conditional CSS/JS by template; logo + font preload; critical CLS placeholders; lazy/decoding on cards |
| SEO meta | OG/Twitter, description fallback, product price meta, `noindex,follow` on filtered PLPs |
| Structured data | Organization + WebSite, BreadcrumbList, Product (Offer/AggregateOffer), FAQPage |
| Privacy (P8-AC8) | Footer Help + legal row; settings + Shopify policy object fallbacks; cookie banner link |
| A11y | Skip-link focus, breadcrumb nav, `summary:focus-visible`, keyboard QA script |
| Docs | `docs/phase-8/PERFORMANCE.md`, `A11Y-CHECKLIST.md`, `QA-REPORT.md` |

## Acceptance

| ID | Status |
|----|--------|
| P8-AC1 | ⚠️ Theme ready — confirm Lighthouse ≥ 80 on preview with optimized media (`PERFORMANCE.md`) |
| P8-AC2 | ⚠️ Theme ready — confirm Lighthouse a11y ≥ 90 |
| P8-AC3 | ✅ Theme Check 0 offenses |
| P8-AC4 | ⚠️ Manual keyboard path script in `A11Y-CHECKLIST.md` |
| P8-AC5 | ✅ CLS mitigations shipped; confirm ≤ 0.1 with final media |
| P8-AC6 | ✅ No critical blockers |
| P8-AC7 | ✅ Product JSON-LD hardened |
| P8-AC8 | ✅ Privacy / terms linked from footer |

## Merchant setup

1. Theme settings → **Popups & privacy** — set Privacy + Terms URLs (or publish Shopify legal policies).  
2. Compress homepage hero (~200–300KB) and key PDP images before Lighthouse.  
3. Run Lighthouse + keyboard path on theme preview; file results in `docs/phase-8/QA-REPORT.md`.

## Push

```powershell
cd payedaar
shopify theme push --theme "Payedaar" --store cwvavv-yb.myshopify.com
```

## Next

**Phase 9** — Merchandising, integrations, UAT & launch.

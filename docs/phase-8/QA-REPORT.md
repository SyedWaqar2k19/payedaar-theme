# Phase 8 — QA report

**Theme:** Payedaar `0.8.0-phase8`  
**Store:** `cwvavv-yb.myshopify.com`  
**Theme Check:** 104 files, **0 offenses** (2026-09-18)

## Acceptance criteria

| ID | Criteria | Status | Notes |
|----|----------|--------|-------|
| P8-AC1 | Lighthouse Performance ≥ 80 mobile | ⚠️ Merchant verify | Theme optimizations + runbook in `PERFORMANCE.md`; re-score with compressed demo media |
| P8-AC2 | Lighthouse Accessibility ≥ 90 | ⚠️ Merchant verify | Structural a11y complete; run Lighthouse + axe on preview |
| P8-AC3 | `shopify theme check` = 0 errors | ✅ | 0 offenses |
| P8-AC4 | Keyboard purchase path | ⚠️ Manual | Script in `A11Y-CHECKLIST.md` |
| P8-AC5 | CLS ≤ 0.1 home + PDP | ✅ Theme-side | Aspect-ratio + LCP image strategy; confirm with final media |
| P8-AC6 | No critical/blocker bugs open | ✅ | No known blockers after Phase 8 hardening |
| P8-AC7 | Product structured data validates | ✅ | `product-json-ld` Offer / AggregateOffer + images + brand/sku/gtin |
| P8-AC8 | Privacy pages linked from footer | ✅ | Theme setting + `shop.privacy_policy` / `shop.terms_of_service` fallbacks + legal row |

## Edge cases smoke (theme)

| Case | Expected | Status |
|------|----------|--------|
| Sold out | ATC disabled, sold out label | ✅ prior |
| Multi-variant | Options update price/media/ATC | ✅ prior |
| Missing product image | Placeholder SVG | ✅ |
| Filtered collection URL | `noindex,follow` | ✅ Phase 8 |
| FAQ empty blocks | Default Q&A + FAQPage JSON-LD | ✅ |
| Reduced motion | Animations minimized | ✅ |

## Cross-browser (merchant)

- [ ] Chrome Android  
- [ ] Safari iOS  
- [ ] Samsung Internet  
- [ ] Desktop Chrome / Edge / Firefox  

## App embeds

- [ ] Reviews app block on PDP (smoke)  
- [ ] Chat / WhatsApp float does not cover sticky ATC  

## Defects

| Severity | Item | Disposition |
|----------|------|-------------|
| — | None open at Phase 8 code complete | — |

## Sign-off

- Engineering: Theme Check clean; SEO/a11y/perf code complete  
- Product/design: Pending preview Lighthouse + keyboard path on staging content → Phase 9

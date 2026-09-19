# Phase 4 complete — Homepage merchandising sections

**Date:** 2026-09-18  
**Theme version:** `0.4.0-phase4`  
**Theme Check:** 77 files, **0 offenses**

## Delivered

| Section | File | Notes |
|---------|------|--------|
| Hero banner | `sections/hero-banner.liquid` | Gradient + badge + CTA; optional image / slides; LCP `eager` + `fetchpriority=high` |
| Trust strip | `sections/trust-strip.liquid` | 3 Pakistan items (truck / COD / returns), Theme Editor blocks |
| Category icons | `sections/category-icons.liquid` | Circular, scroll-snap mobile, collection/image/link |
| Featured collection | `sections/featured-collection.liquid` | Trending / Best Sellers grids via Payedaar `product-card` |
| Deal of the Day | `sections/deal-of-the-day.liquid` | `deal-countdown` custom element; ended state |
| Promo banner | `sections/promo-banner.liquid` | 1–3 promo cards |
| Coupon / marquee | `sections/coupon-strip.liquid` | Code copy or CSS marquee |
| Newsletter | `sections/newsletter.liquid` | Customer form + success/error |
| Homepage JSON | `templates/index.json` | Full Bold Deals order, reorderable in editor |
| Assets | `section-home.css`, `home.js` | Slider, countdown, clipboard |

## Acceptance

| ID | Status |
|----|--------|
| P4-AC1 | ✅ Hero deal message; header search remains above |
| P4-AC2 | ✅ Trust strip with orange `icon-circle` |
| P4-AC3 | ✅ Circular category targets |
| P4-AC4 | ✅ Shared product cards in featured grids |
| P4-AC5 | ✅ Countdown ends → ended message, timer cleared |
| P4-AC6 | ✅ Mobile grids / intentional category scroll only |
| P4-AC7 | ✅ All sections have presets; index order editable |
| P4-AC8 | ✅ Hero image eager + sizes/srcset |

## Launch placeholders (merchant)

1. **Hero** — optional background image (desktop/mobile); keep gradient if no art yet.
2. **Categories** — link each block to real collections (`home-living`, `kitchen`, etc.).
3. **Trending Deals** / **Best Sellers** — assign collections in Theme Editor.
4. **Deal of the Day** — set ISO end datetime + product list or collection.
5. **Promo banners** — upload 2 images + links (Under Rs. 999 / New arrivals).
6. **Coupon** — replace `PAYEDAAR10` with a live discount code (or switch to marquee).
7. **Newsletter** — works with Shopify customers; connect marketing app if needed.

## Push

```powershell
cd payedaar
shopify theme push --theme "Payedaar" --store cwvavv-yb.myshopify.com
```

## Next

**Phase 5** — Collection, search, filters, list-collections.

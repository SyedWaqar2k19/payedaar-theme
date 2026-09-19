# Phase 6 complete — Product detail page (PDP)

**Date:** 2026-09-18  
**Theme version:** `0.6.0-phase6`  
**Theme Check:** 88 files, **0 offenses**

## Delivered

| Feature | Implementation |
|---------|----------------|
| Gallery | `product-media-gallery` — thumbs, image/video/model, dialog zoom (no scroll hijack) |
| Variants | Option swatches + hidden `id` select; updates price, ATC, SKU, URL, media |
| Buy box | Qty stepper, primary orange ATC, optional dynamic checkout (default off) |
| Sticky ATC | Mobile only; IntersectionObserver after main ATC leaves viewport |
| Trust | COD / delivery / returns via `trust-badges` near ATC |
| Accordions | Description, shipping/returns, custom collapsible tabs |
| Reviews | `@app` block slot for Judge.me / Loox / etc. |
| Related | `related-products` + Product Recommendations API + product cards |
| Bought together | Optional complementary `product_list` block |
| Share | WhatsApp + copy link |
| JSON-LD | `product-json-ld` Product + Offer |
| Size guide | Shows only for apparel/size-guide tags or when page assigned |
| Fake urgency | Block exists, **default OFF** (P6-AC8) |

## Acceptance

| ID | Status |
|----|--------|
| P6-AC1 | ✅ Variant → price / availability / featured media |
| P6-AC2 | ✅ Mobile sticky ATC |
| P6-AC3 | ✅ Trust under buy buttons in default block order |
| P6-AC4 | ✅ Dynamic checkout setting; ATC primary |
| P6-AC5 | ✅ Keyboard thumbs + `<dialog>` zoom |
| P6-AC6 | ✅ JSON-LD snippet |
| P6-AC7 | ✅ Related section uses `product-card` |
| P6-AC8 | ✅ Urgency disabled by default |
| P6-AC9 | ✅ Payedaar tokens / section-product.css |

## Key files

- `sections/main-product.liquid`, `related-products.liquid`
- `snippets/product-media-gallery.liquid`, `product-variant-picker.liquid`, `buy-buttons.liquid`, `share-buttons.liquid`, `product-json-ld.liquid`
- `assets/product.js`, `section-product.css`
- `templates/product.json`

## Merchant setup

1. Theme Editor → Product page — reorder blocks; enable dynamic checkout if desired.
2. Assign **Size guide** page if selling apparel; tag products `apparel` or `size-guide`.
3. Install reviews app and add its block to the product section.
4. Ensure Search & Discovery / recommendations are active for related products.

## Push

```powershell
cd payedaar
shopify theme push --theme "Payedaar" --store cwvavv-yb.myshopify.com
```

## Next

**Phase 7** — Content pages, customers, blog, popups, wishlist (P1).

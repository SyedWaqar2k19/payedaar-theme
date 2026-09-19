# Phase 3 complete — Product card, cart drawer, ATC foundation

**Date:** 2026-09-18  
**Theme version:** `0.3.0-phase3`  
**Theme Check:** 68+ files, **0 offenses**

## Delivered

| Feature | Implementation |
|---------|----------------|
| Product card | `snippets/product-card.liquid` — image, badges, PKR price, full-width ATC / View / Sold out |
| Badges | `snippets/product-badge.liquid` — sold out → metafield → sale % → tags |
| Price | Orange sale price via existing `price` snippet |
| Ajax ATC | `assets/cart.js` `product-form` — FormData `/cart/add.js` + sections, no full reload |
| Cart drawer | `sections/cart-drawer.liquid` — items, qty ±, remove, subtotal, overlay/Escape |
| Free shipping | `snippets/free-shipping-bar.liquid` vs `settings.freeshipping_goal_amount` (PKR×100) |
| COD / trust | `snippets/trust-badges.liquid` in drawer (compact) + PDP |
| Cart page | `sections/main-cart.liquid` — fallback update + `/checkout` |
| Badge refresh | `[data-cart-count]` + drawer count updated after ATC / line change |
| Collection / search / PDP | Wired to shared product card + Ajax form |

## Acceptance

| ID | Status |
|----|--------|
| P3-AC1 | ✅ Card shell matches Bold Deals (badge, orange price, full-width primary ATC) |
| P3-AC2 | ✅ Sale badge `%` from compare-at |
| P3-AC3 | ✅ Ajax ATC via `product-form` (cards + PDP) |
| P3-AC4 | ✅ Image, title, variant, price, qty, remove |
| P3-AC5 | ✅ Progress + remaining money vs goal setting |
| P3-AC6 | ✅ COD via `trust_cod` in drawer footer |
| P3-AC7 | ✅ Checkout → `/checkout` |
| P3-AC8 | ✅ Sold out badge + disabled ATC / sold-out button |
| P3-AC9 | ✅ Guarded fetch + no uncaught path on happy/error ATC |

## Files (key)

- `snippets/product-card.liquid`, `product-badge.liquid`, `free-shipping-bar.liquid`, `trust-badges.liquid`
- `sections/cart-drawer.liquid`, `main-cart.liquid`, `main-product.liquid`, `main-collection.liquid`, `main-search.liquid`
- `assets/cart.js`, `assets/component-cart.css`
- `layout/theme.liquid` (assets + `{% section 'cart-drawer' %}`)
- `locales/en.default.json` (cart / product strings)

## Merchant setup

1. Theme settings → **Free shipping goal** (default 2999 PKR) and **COD** trust copy.
2. Optional product tags: `hot-deal`, `best-seller`, `limited`, `new`.
3. Optional metafield `custom.badge_label` / `custom.is_hot_deal`.
4. Push:

```powershell
cd payedaar
shopify theme push --theme "Payedaar" --store cwvavv-yb.myshopify.com
```

## Next

**Phase 4** — Homepage merchandising sections (hero, trust strip, categories, featured collection, deals).

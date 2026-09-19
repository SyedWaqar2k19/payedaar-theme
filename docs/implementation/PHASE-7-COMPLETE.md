# Phase 7 complete — Content pages, customers, blog, popups, wishlist

**Date:** 2026-09-18  
**Theme version:** `0.7.0-phase7`  
**Theme Check:** 101 files, **0 offenses**

## Delivered

| Area | Implementation |
|------|----------------|
| Contact | `page-contact` — form + WhatsApp/phone CTAs |
| FAQ | `page-faq` — keyboard `<details>` accordion |
| Track order | `page-track-order` — instructions + `@app` slot |
| Shipping & returns | `page-shipping-returns` + trust badges |
| About / generic page | `page.about` + styled `main-page` |
| Customers | Login (recover), register, account/orders, addresses, order, reset, activate |
| 404 | Search + Home + Hot Deals |
| Password / gift card | Styled |
| Blog / article | Lightweight list + article templates |
| Cookie banner | Bottom non-blocking; dismiss/accept → localStorage |
| Popups | Promo and/or newsletter; delay + reappear days; Escape/overlay close |
| Wishlist | Header count + card hearts + `page.wishlist` (localStorage) |
| Compare | **Not included** (intentional) |

## Acceptance

| ID | Status |
|----|--------|
| P7-AC1 | ✅ Contact form + WhatsApp |
| P7-AC2 | ✅ FAQ `<details>`/`<summary>` |
| P7-AC3 | ✅ Customer templates restyled |
| P7-AC4 | ✅ 404 search + Hot Deals |
| P7-AC5 | ✅ Popup delay / reappear / dismiss |
| P7-AC6 | ✅ Cookie bar sits above sticky nav; does not cover full viewport |
| P7-AC7 | ✅ Wishlist persists + badge count |
| P7-AC8 | ✅ Primary IA templates covered |

## Merchant setup

1. Create pages and assign templates: Contact, FAQ, Track order, Shipping & returns, About, **Wishlist** (`page.wishlist`).
2. Theme settings → **Popups & privacy** / **Wishlist** — enable as needed; link privacy page + wishlist page.
3. Optional: add tracking app block on Track order page.

## Push

```powershell
cd payedaar
shopify theme push --theme "Payedaar" --store cwvavv-yb.myshopify.com
```

## Next

**Phase 8** — Performance, SEO, a11y, QA hardening.

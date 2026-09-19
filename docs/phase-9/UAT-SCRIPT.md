# Phase 9 — UAT script

Run on **theme preview** first, then again after publish. Record results in `LAUNCH-SIGNOFF.md`.

**Preview:** https://cwvavv-yb.myshopify.com?preview_theme_id=131422486610

## Minimum script (from implementation plan)

| # | Test | Pass? | Notes |
|---|------|-------|-------|
| 1 | Search product → open PDP → ATC → drawer → checkout start | ☐ | |
| 2 | Apply filters on Hot Deals collection | ☐ | |
| 3 | Place test COD/card order end-to-end | ☐ | Order ID: ____ |
| 4 | Mobile sticky nav — all destinations resolve | ☐ | |
| 5 | WhatsApp link opens correct chat | ☐ | |
| 6 | Free shipping bar crosses threshold correctly | ☐ | Goal Rs. ____ |
| 7 | Account create + address (Pakistan fields) | ☐ | |
| 8 | Refund/return / shipping-returns page reachable | ☐ | |

## Extended smoke

| Area | Check | Pass? |
|------|-------|-------|
| Homepage | No placeholder “Add a collection” cards | ☐ |
| Nav | Hot Deals, Best Sellers, Track Order, Categories | ☐ |
| PDP | Variants, gallery, sticky ATC (mobile), trust/COD accurate | ☐ |
| Sold out | ATC disabled | ☐ |
| Cart page | Qty update, remove, checkout | ☐ |
| 404 | Search + Hot Deals CTA | ☐ |
| FAQ / Contact | Forms + WhatsApp | ☐ |
| Wishlist | Add / remove / count badge (if enabled) | ☐ |
| Cookie banner | Accept / dismiss | ☐ |
| Keyboard | Skip link → search → PDP → ATC (from Phase 8) | ☐ |
| Apps | Reviews block renders (if installed) | ☐ |

## Devices

- [ ] Chrome Android  
- [ ] Safari iOS  
- [ ] Desktop Chrome / Edge / Firefox  

## Sign-off gate

All **minimum** rows Pass (or waived in writing) before P9-AC5 publish.

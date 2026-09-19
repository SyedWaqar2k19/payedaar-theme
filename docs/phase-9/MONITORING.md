# Phase 9 — Post-launch monitoring

First **72 hours** after publish (or password removal).

## Metrics to watch

| Signal | Where | Action if bad |
|--------|-------|----------------|
| Checkout conversion | Shopify Analytics | Check payment/shipping errors |
| COD order volume vs cancel rate | Orders | Tighten confirmation process |
| Theme JS errors | Browser console / Sentry if any | Hotfix unpublished → push |
| LCP / CLS | Search Console / CrUX / Lighthouse | Compress media; disable heavy apps |
| Pixel firing | GA4 / Meta | Re-check Customer events |
| 404 spikes | Analytics | Fix broken nav / collection handles |
| Support WhatsApp load | CS inbox | Staffing / FAQ updates |

## Daily checklist (days 1–3)

- [ ] Spot-check homepage + Hot Deals on mobile  
- [ ] Place one test order (or review real small order)  
- [ ] Confirm free-shipping threshold still matches Admin  
- [ ] Review abandoned checkouts for theme friction  
- [ ] Scan customer messages for “COD not available” / wrong promises → toggle COD messaging if needed  

## Week 1

- [ ] Submit sitemap in Google Search Console  
- [ ] Review product feedback / returns vs theme copy (7-day returns)  
- [ ] Performance pass on real hero media  
- [ ] Plan Phase 10 items only after MVP stable

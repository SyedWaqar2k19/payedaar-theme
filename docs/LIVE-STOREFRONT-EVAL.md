# Live storefront evaluation (password unlock)

**Date:** 2026-09-18  
**URL:** https://cwvavv-yb.myshopify.com/?preview_theme_id=131422486610  
**Password used:** *(provided in chat — storefront unlock; rotate if shared widely)*  
**Theme:** Payedaar `0.10.0-ui-polish` (+ follow-up empty-state fixes)

---

## Verdict

| Layer | Score | Notes |
|-------|-------|-------|
| Theme chrome / polish | **7.5 / 10** | Full-bleed hero, trust band, tiles, testimonials, FAQ, footer USP, Hot Deals pill all render |
| Merchandising / content | **0.5 / 10** | **0 products**, 1 empty collection (`frontpage`), no hero/promo photos |
| Conversion readiness | **3 / 10** | Nav destinations Hot Deals / Best Sellers / Track Order / FAQ were **404** before nav fallbacks |
| Overall “premium deal store” feel | **4 / 10** | Design system is ready; **catalog vacuum** still dominates first impression |

**Conclusion:** The theme is no longer “basic skeleton CSS.” It still cannot look like [Bachat Dukan](https://bachatdukan.com) / [Jugnu Store](https://jugnustore.com) until **real products + images + collections + pages** exist. Premium look is ~70% content, ~30% CSS.

---

## What is working on live Payedaar preview

- Payedaar tokens (orange `#E85D04`, cream bg, Plus Jakarta Sans)
- Announcement: free delivery over Rs. 2,999
- Hero: “Big Savings Everyday!” + UP TO 70% OFF circle + full-bleed
- Trust strip (continuous band)
- Category tiles (6 labels) — layout tiles ON
- Testimonials (3 quotes) + Home FAQ (COD open-parcel etc.)
- Coupon `PAYEDAAR10` + newsletter
- Footer USP row
- Hot Deals nav styled as primary pill
- Empty featured collections correctly **hidden** (no SVG placeholder spam)

---

## Blockers found (live)

| Issue | Evidence | Fix owner |
|-------|----------|-----------|
| **0 products** in store | `/products.json` → `[]` | Merchant Admin |
| Only collection: `frontpage` (0 products) | `/collections.json` | Merchant |
| `/collections/hot-deals` **404** | HTTP 404 | Create collection handle `hot-deals` |
| `/collections/best-sellers` **404** | HTTP 404 | Create `best-sellers` |
| `/pages/track-order` **404** | HTTP 404 | Create page + assign template |
| `/pages/faq` **404** | HTTP 404 | Create page + assign `page.faq` |
| No hero / category / promo images | HTML has no `hero-banner__img` / `promo-banner__img` | Theme Editor uploads |
| WhatsApp float missing | No `wa.me` in HTML | Theme settings → WhatsApp number |
| Store name still **My Store 6** | `<title>` | Admin → Store settings |
| Logo text fallback only | Brand not Payedaar wordmark | Upload logo |

---

## Follow-up theme fixes shipped after this eval

1. Nav links fall back to `/collections` (or home) when Hot Deals / Best Sellers / Track Order don’t exist → **no more 404 from default nav**  
2. Hero **styled campaign** fallback (mesh + orbs) when no photo + secondary CTA  
3. Category tiles get **distinct color gradients** without photos  
4. **Catalog ready banner** on homepage when product count is 0  

---

## Merchant checklist for full premium look (priority order)

### P0 — Unblocks conversion

1. Admin → **Settings → General** → rename store to **Payedaar**  
2. Upload **logo + favicon** (Theme settings)  
3. Add **WhatsApp** `92XXXXXXXXXX`  
4. Create collections with exact handles: `hot-deals`, `best-sellers`, `home`, `kitchen`, `beauty`, `gadgets`, `fashion`  
5. Create pages: Contact, FAQ (`page.faq`), Track order (`page.track-order`), Shipping & returns  
6. Publish **≥24 products** with compare-at prices + tags (`hot-deal`, `best-seller`)  
7. Theme Editor → Home: bind Trending / Best Sellers collections; upload hero + promo images; link category tiles  

### P1 — Match Bachat / Jugnu density

8. Install reviews app → drop into PDP Apps section  
9. Set product metafields `custom.delivery_days`, `custom.cod_available`  
10. Align free-shipping rule with Rs. 2,999  
11. Soft launch: keep password **or** disable when ready  

Full steps: `docs/phase-9/MERCHANDISING.md`

---

## Re-test after merchandising

Password unlock → hard refresh preview → confirm:

- [ ] Hero uses real photography  
- [ ] ≥8 product cards on homepage  
- [ ] Hot Deals / Best Sellers resolve (200)  
- [ ] Card hover shows 2nd image on multi-media products  
- [ ] WhatsApp float visible  
- [ ] Title/brand reads **Payedaar**

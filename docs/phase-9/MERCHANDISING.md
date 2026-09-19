# Phase 9 — Merchandising playbook

**Goal (P9-AC1):** Homepage and primary collections show real Payedaar catalog — no placeholder SVG cards.

## 1. Create collections (Admin → Products → Collections)

| Handle (exact) | Title | Purpose |
|----------------|-------|---------|
| `hot-deals` | Hot Deals | Header / sticky nav / featured |
| `best-sellers` | Best Sellers | Header / homepage row |
| `home` | Home | Category icons |
| `kitchen` | Kitchen | Category icons |
| `beauty` | Beauty | Category icons |
| `gadgets` | Gadgets | Category icons |
| `fashion` | Fashion | Category icons |

**Automation tips**

- Hot Deals: product tag `hot-deal` **or** metafield `custom.is_hot_deal = true`
- Best Sellers: tag `best-seller`
- Always set **compare-at price** when discounting (drives `%` badge)

## 2. Tag & metafield conventions

See `docs/phase-0/METAFIELDS.md`. Minimum at launch:

| Tag / metafield | Effect |
|-----------------|--------|
| `hot-deal` | Hot Deal badge |
| `best-seller` | Best Seller badge |
| `limited` / `new` | Badges |
| `custom.cod_available` | Per-product COD badge (optional; global COD toggle in theme settings) |
| `custom.delivery_days` | “Typically delivered in X days” on PDP |
| `custom.badge_label` | Overrides badge text |

## 3. Wire homepage (Theme Editor → Home)

| Section | Action |
|---------|--------|
| Hero | Upload hero (+ mobile) image; set CTA → Hot Deals collection |
| Trust strip | Keep defaults; remove COD block if COD not offered |
| Category icons | Link each block to its collection |
| Trending Deals | Select collection (e.g. Hot Deals or a curated “trending”) |
| Deal of the day | Pick 1–3 products + end datetime |
| Promo banner | Upload image + link |
| Best Sellers | Select `best-sellers` collection |
| Coupon strip | Align code with discount in Admin Discounts |
| Newsletter | Optional |

## 4. Create pages + assign templates

| Handle | Template |
|--------|----------|
| `contact` | `page.contact` |
| `faq` | `page.faq` |
| `track-order` | `page.track-order` |
| `shipping-returns` | `page.shipping-returns` |
| `about` | `page.about` (optional) |
| `wishlist` | `page.wishlist` (if wishlist enabled) |

Publish Shopify **Policies** (Privacy, Terms, Refund, Shipping) — footer picks them up automatically.

## 5. Menus (optional but recommended)

**Navigation → Main menu**

- Home → `/`
- Categories → `/collections`
- Hot Deals → `/collections/hot-deals`
- Best Sellers → `/collections/best-sellers`
- Track Order → `/pages/track-order`

Assign in Theme Editor → Header / Footer. If empty, theme fallbacks use the same handles.

## 6. Theme settings checklist

- [ ] Logo + favicon  
- [ ] WhatsApp number (`923…`)  
- [ ] Support phone  
- [ ] Free shipping goal **=** Admin free-shipping threshold (default Rs. 2,999)  
- [ ] **Show COD messaging** matches real checkout (P9-AC4)  
- [ ] Privacy / Terms URLs (or rely on Shopify policies)  
- [ ] Social URLs  
- [ ] Analytics events ON (default)

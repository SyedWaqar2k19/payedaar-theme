# Phase 0 — Information architecture & homepage wire (final)

Approved for implementation starting Phase 1.  
Sources: `payedaar-theme-implementation.md` §5 + `referance-design-and-color-sheet.PNG`.

## Primary navigation

| Label | Destination | Notes |
|-------|-------------|--------|
| Home | `/` | |
| Categories | `/collections` | Mobile: icon grid / drawer |
| Hot Deals | `/collections/hot-deals` | Nav label uses primary orange |
| Best Sellers | `/collections/best-sellers` | |
| Track Order | `/pages/track-order` | Page + optional app embed later |
| Account | `/account` | Header icon |
| Cart | Drawer + `/cart` | Badge in sale red |

## Secondary (footer / hamburger)

About · Contact · FAQ · Shipping & Returns · Privacy · Terms · WhatsApp

## Homepage wire (top → bottom)

```text
┌─────────────────────────────────────────────┐
│ Announcement bar (free delivery threshold)  │
├─────────────────────────────────────────────┤
│ Logo │ pill SEARCH │ account │ cart(badge)  │  ← Phase 2
├─────────────────────────────────────────────┤
│ Home · Categories · Hot Deals · Best…       │  ← horizontal scroll
├─────────────────────────────────────────────┤
│ HERO: gradient / image                      │  ← Phase 4
│ “Big Savings Everyday!”                     │
│ Shop Now  ·  UP TO XX% OFF badge            │
├─────────────────────────────────────────────┤
│ Trust: Delivery | COD | 7-day returns       │  ← Phase 4 (preview in P0)
├─────────────────────────────────────────────┤
│ Category circles (5+)                       │
├─────────────────────────────────────────────┤
│ Trending Deals — product card grid          │
├─────────────────────────────────────────────┤
│ Deal of the Day — countdown + products      │
├─────────────────────────────────────────────┤
│ Promo banner strip                          │
├─────────────────────────────────────────────┤
│ Best Sellers                                │
├─────────────────────────────────────────────┤
│ Newsletter (optional)                       │
├─────────────────────────────────────────────┤
│ Footer                                      │
├─────────────────────────────────────────────┤
│ Mobile sticky: Home|Cats|Deals|Account|Cart │
└─────────────────────────────────────────────┘
```

## Template map (MVP)

| Template | Phase |
|----------|-------|
| `index` | 0 skeleton → 4 full |
| `collection`, `list-collections`, `search` | 5 |
| `product` | 6 |
| `cart` | 3 |
| `page`, contact, faq, track-order | 7 |
| `customers/*` | 0 skeleton → 7 polish |
| `404`, `password`, `gift_card` | 0 skeleton → 7 polish |

## Out of scope for homepage v1

- Fashion lookbook pins
- Fancy oversized typography decorations
- Multi-style product cards
- Fake “X people viewing” urgency (default off)

## Sign-off

| Role | Name | Date | Approved |
|------|------|------|----------|
| Product | | | ☐ |
| Design | | | ☐ |
| Engineering | | | ☐ |

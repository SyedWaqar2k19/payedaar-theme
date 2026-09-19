# Phase 0 — Locked product decisions

Resolves open items from `payedaar-theme-implementation.md` §17.3.

| # | Decision | Choice | Rationale |
|---|----------|--------|-----------|
| 1 | **Font pair** | **Plus Jakarta Sans** (body + display), **self-hosted woff2** in theme assets | Energetic sans matching Bold Deals; single family; CDN-independent for PK mobile; `font-display: swap` |
| 2 | **Wishlist** | **Native theme (localStorage)** in Phase 7; app optional later | Avoids app cost for MVP; header icon reserved; sync-across-devices deferred. |
| 3 | **Collection filters** | **Ajax Filtering (Facet API)** in Phase 5 | Snappier mobile UX; fallback full-page if Facet API unavailable. |
| 4 | **Launch mode** | **Password / soft launch** first, then full publish | Allows UAT with real catalog without public traffic. |
| 5 | **Track Order** | **Dedicated page** `/pages/track-order` + Theme App Extension block slot | Content + instructions in Phase 7; merchant can embed tracking app without theme rewrite. |

## Additional locks

| Topic | Choice |
|-------|--------|
| Product card styles | **One** Payedaar card (sheet style) |
| Compare products | **Out of MVP** (no header entry) |
| Default language | English UI; Urdu locale Phase 10+ |
| Free shipping goal | **Rs. 2,999** |
| Returns copy | **7 Days Return — Hassle Free** |
| COD | Promoted as primary trust signal; must match Admin |
| Urgency modules (fake visitors) | **Off by default** |
| Reference theme | Read-only patterns; **no code copy** into `payedaar/` |
| CSS approach Phase 1 | Custom properties + modular CSS; no jQuery in new code |
| Slider library | Prefer CSS scroll-snap for chips; Swiper only if needed for hero |

## Color tokens (signed)

| Token | Hex |
|-------|-----|
| Primary | `#E85D04` |
| Primary dark | `#C44700` |
| Secondary | `#176B5B` |
| Highlight | `#FFC107` |
| Background | `#FFFDF9` |
| Surface | `#FFFFFF` |
| Text | `#1F2421` |
| Muted text | `#66736D` |
| Sale | `#E94F37` |
| Offer | `#F59E0B` |

## Sign-off

| Role | Name | Date | Approved |
|------|------|------|----------|
| Product | | | ☐ |
| Design | | | ☐ |
| Engineering | Auto / Phase 0 implementer | 2026-09-18 | ✅ recommended defaults locked |

Stakeholders: mark Approved when reviewed. Engineering proceeds with these defaults unless overturned in writing.

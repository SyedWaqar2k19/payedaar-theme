# Phase 0 complete — Discovery, foundations & setup

**Date:** 2026-09-18  
**Theme version:** `0.0.0-phase0`  
**Theme Check:** 52 files inspected, **0 offenses**

## What was delivered

### Repository

| Item | Location |
|------|----------|
| Git repository initialized | `.git/` (+ `.gitignore`, `.gitattributes`) |
| README | `README.md` |
| Env example | `.env.example` |
| VS Code readonly reference | `.vscode/settings.json` |
| Reference theme policy | `docs/phase-0/REFERENCE-POLICY.md` |

### Payedaar theme skeleton (`payedaar/`)

Valid Online Store 2.0 theme ready for `shopify theme dev` / `shopify theme push --unpublished`:

- Layouts: `theme.liquid`, `password.liquid`
- Config: `settings_schema.json`, `settings_data.json` (Payedaar tokens + Pakistan trust defaults)
- Section groups: header (announcement + header), footer
- Core templates: index, product, collection, list-collections, cart, search, page (+ contact/faq/track-order/shipping-returns), 404, password, gift_card, customers/*
- Locales: `en.default.json`
- Assets: `base.css`, `global.js`
- Snippets: `css-variables`, `meta-tags`
- Apps section for Theme App Extensions

### Phase 0 documentation (`docs/phase-0/`)

| Doc | Purpose |
|-----|---------|
| `STORE-BASELINE.md` | PKR / Pakistan / shipping / payments / seed collections & menus |
| `ASSET-CHECKLIST.md` | Logo, icons, hero, trust icons for design team |
| `IA-AND-HOMEPAGE-WIRE.md` | Final IA + homepage wire |
| `DECISIONS.md` | Locked fonts, wishlist, filters, launch mode, Track Order, colors |
| `METAFIELDS.md` | Human-readable metafield plan |
| `metafield-definitions.json` | Machine-readable definitions |
| `metafield-definitions.graphql` | Admin API create mutations |
| `PUSH.md` | CLI push / dev / check commands |
| `ACCEPTANCE.md` | AC tracker |
| `REFERENCE-POLICY.md` | Read-only reference rules |

## Acceptance criteria

| ID | Result |
|----|--------|
| P0-AC1 | Checklist ready — **merchant must set PKR/Pakistan in Admin** |
| P0-AC2 | Theme skeleton + CLI installed; **push/dev needs store login** (`PUSH.md`) |
| P0-AC3 | Definitions authored — **apply via Admin/GraphQL** |
| P0-AC4 | Tokens, IA, decisions locked in docs (sign boxes for formal OK) |
| P0-AC5 | `referance-theme/` untouched; policy + VS Code readonly |

## Merchant actions before / during Phase 1

1. Complete Admin items in `STORE-BASELINE.md` (currency, market, timezone).
2. `shopify auth login` → `shopify theme push --unpublished --theme "Payedaar"`.
3. Create metafields using `metafield-definitions.graphql`.
4. Create seed collections & pages listed in store baseline.
5. Design team starts `ASSET-CHECKLIST.md`.

## Exit → Phase 1

Engineering may start **Phase 1 — Design tokens, layout shell & global styles** immediately.  
Full AC1/AC2 store connection can complete in parallel.

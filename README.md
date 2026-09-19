# Payedaar Shopify Theme

Production Online Store 2.0 theme for **Payedaar** — a Pakistan mass-market e-commerce brand (Bold Deals / Impulse Shopping).

## Repository layout

| Path | Purpose |
|------|---------|
| `payedaar/` | **Active theme** — develop and deploy this folder |
| `docs/phase-0/` | Phase 0 discovery outputs, checklists, metafield specs |
| `referance-theme/clothing/` | **Read-only** UX/architecture reference (do not copy proprietary code) |
| `referance-design-and-color-sheet.PNG` | Visual / color system reference |
| `payedaar-theme-implementation.md` | Full phased implementation plan |

## Prerequisites

- Node.js 18+ (20+ recommended)
- [Shopify CLI](https://shopify.dev/docs/api/shopify-cli) 3.x
- A Shopify development store configured for **Pakistan / PKR** (see `docs/phase-0/STORE-BASELINE.md`)

```bash
npm install -g @shopify/cli @shopify/theme
```

## Local development

```bash
cd payedaar
shopify theme dev --store YOUR_STORE.myshopify.com
```

Push as an unpublished theme:

```bash
cd payedaar
shopify theme push --unpublished --theme "Payedaar"
```

Theme Check:

```bash
cd payedaar
shopify theme check
```

## Phase status

| Phase | Status |
|-------|--------|
| 0 — Discovery, foundations & setup | Complete (`PHASE-0-COMPLETE.md`) |
| 1 — Design tokens & layout shell | Complete (`PHASE-1-COMPLETE.md`) |
| 2 — Header, nav, footer, sticky | Complete (`PHASE-2-COMPLETE.md`) |
| 3+ | See implementation plan |

## License / IP

Payedaar theme code in `payedaar/` is an **original** implementation.  
`referance-theme/` is third-party reference material for patterns only — do not redistribute or ship its source as Payedaar.

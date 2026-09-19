# Phase 9 complete — Merchandising, integrations, UAT & launch

**Date:** 2026-09-18  
**Theme version:** `0.9.0-phase9`  
**Theme Check:** 106 files, **0 offenses**  

## Theme deliverables

| Area | Implementation |
|------|----------------|
| Analytics (P9-AC6) | `analytics.js` → `dataLayer` + `Shopify.analytics.publish` for page_view, add_to_cart, begin_checkout, search, view_item, wishlist |
| COD accuracy (P9-AC4) | `enable_cod_messaging` setting gates trust strip, badges, footer COD, PDP shipping copy |
| Merchandising hooks | `cod-badge`, `delivery-estimate` metafields; PDP Apps section for reviews |
| Docs | Full launch kit under `docs/phase-9/` |

## Ops deliverables (merchant executes)

| Doc | Purpose |
|-----|---------|
| `MERCHANDISING.md` | Collections, tags, homepage wiring (P9-AC1/AC2) |
| `ADMIN-OPS.md` | Payments, COD, shipping, policies, test order (P9-AC3/AC4) |
| `INTEGRATIONS.md` | Reviews, tracking, WhatsApp |
| `ANALYTICS.md` | Pixel / GA4 verification (P9-AC6) |
| `UAT-SCRIPT.md` | Staff UAT checklist |
| `ROLLBACK.md` | Previous theme retain + rollback (P9-AC7) |
| `MONITORING.md` | 72h post-launch watch |
| `LAUNCH-SIGNOFF.md` | Stakeholder sign-off (P9-AC8) |

## Acceptance

| ID | Status |
|----|--------|
| P9-AC1 | ⚠️ Merchant: wire real collections/images per `MERCHANDISING.md` |
| P9-AC2 | ⚠️ Merchant: create pages/collections or assign menus |
| P9-AC3 | ⚠️ Merchant: place test order (`ADMIN-OPS.md`) |
| P9-AC4 | ✅ Theme toggle + docs; merchant aligns Admin COD |
| P9-AC5 | ⚠️ Merchant: publish after UAT; password policy per soft-launch decision |
| P9-AC6 | ✅ Event bridge shipped; merchant connects GA4/Meta in Admin |
| P9-AC7 | ✅ `ROLLBACK.md` |
| P9-AC8 | ✅ `LAUNCH-SIGNOFF.md` template |

## Push

```powershell
cd payedaar
shopify theme push --theme "Payedaar" --store cwvavv-yb.myshopify.com
```

## Do not auto-publish

Publishing to live and disabling password are **merchant actions** after UAT sign-off.

## Next

Optional **Phase 10** roadmap (Urdu, megamenu, UGC, etc.) — only after MVP stable.

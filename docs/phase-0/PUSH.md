# Phase 0 — Push unpublished theme & run theme dev

## Prerequisites

1. Shopify CLI installed (`shopify version`)
2. Store with PKR / Pakistan baseline in progress (`STORE-BASELINE.md`)
3. Logged in:

```bash
shopify auth login
```

## Push as unpublished theme

From repo root:

```bash
cd payedaar
shopify theme push --unpublished --theme "Payedaar" --store YOUR_STORE.myshopify.com
```

Confirm in Admin → Online Store → Themes → Theme library → **Payedaar**.

## Local development

```bash
cd payedaar
shopify theme dev --store YOUR_STORE.myshopify.com
```

CLI prints a preview URL. Homepage should show Phase 0 hero + trust strip.

## Theme Check

```bash
cd payedaar
shopify theme check
```

Fix any **error** severity before calling Phase 0 complete for engineering.

## Notes

- Do **not** publish as live theme in Phase 0.
- Keep `referance-theme/` out of push (theme root is `payedaar/` only).
- If auth fails, re-run `shopify auth login` and ensure staff permissions include Themes.

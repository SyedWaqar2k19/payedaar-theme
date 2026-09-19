# Phase 0 — Metafield definitions

Store-level custom data required before merchandising (P0-AC3).

## How to apply

### Option A — Shopify Admin (manual)

1. Admin → **Settings** → **Custom data**
2. For each definition below, create on **Products** or **Collections**
3. Use namespace/key exactly as listed

### Option B — Shopify CLI / GraphQL (recommended for accuracy)

1. Authenticate: `shopify auth login`
2. Run mutations from `metafield-definitions.graphql` against your store
3. Or use Admin API with the JSON in `metafield-definitions.json` as the source of truth

### Option C — Ticket to store owner

If developers lack Settings access, attach this folder to a ticket and track in `ACCEPTANCE.md`.

---

## Product metafields

| Namespace | Key | Type | Name | Description |
|-----------|-----|------|------|-------------|
| `descriptors` | `subtitle` | `single_line_text_field` | Subtitle | Short PDP subtitle |
| `custom` | `short_description` | `multi_line_text_field` | Short description | Card / PDP blurb |
| `custom` | `cod_available` | `boolean` | COD available | Show COD badge when true |
| `custom` | `delivery_days` | `number_integer` | Delivery days | Estimated delivery days |
| `custom` | `is_hot_deal` | `boolean` | Hot deal | Badge + automation helper |
| `custom` | `badge_label` | `single_line_text_field` | Custom badge | Overrides default badge text |
| `custom` | `spec_table` | `multi_line_text_field` | Specs | Specs tab content (rich text OK later) |
| `custom` | `bundle_discount_rate` | `number_integer` | Bundle discount % | Bought-together (Phase 7+) |

> Note: Shopify’s standard `descriptors.subtitle` may already exist on some stores — skip create if present.

## Collection metafields

| Namespace | Key | Type | Name | Description |
|-----------|-----|------|------|-------------|
| `custom` | `icon` | `file_reference` | Category icon | Circular category image/icon |
| `custom` | `menu_highlight` | `boolean` | Menu highlight | Treat as Hot Deals-style highlight |

## Tag conventions (not metafields)

| Tag | Effect |
|-----|--------|
| `hot-deal` | Hot Deal badge |
| `best-seller` | Best Seller badge |
| `limited` | Limited Time badge |
| `new` | New badge |

## Catalog ops rules

1. Always set **compare-at price** when advertising a discount (drives `%` badge).
2. Enable **inventory tracking** for COD reliability.
3. Set **weight** for shipping rates.
4. Prefer PKR-whole prices (e.g. 2499 not 2499.50) for mass-market clarity.

## Verification

Admin → Settings → Custom data → Products / Collections shows all keys above.  
Mark P0-AC3 complete in `ACCEPTANCE.md`.

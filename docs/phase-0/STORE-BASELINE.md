# Phase 0 — Store baseline configuration

Use this checklist in **Shopify Admin** before or while connecting the Payedaar theme.  
Theme development can proceed in parallel; **launch** requires every required item complete.

## Required (P0-AC1)

| Setting | Target value | Where | Status |
|---------|--------------|-------|--------|
| Store currency | **PKR (Rs.)** | Settings → Markets / Store currency | ☐ |
| Primary market / shipping country | **Pakistan** | Settings → Markets | ☐ |
| Timezone | **(GMT+05:00) Asia/Karachi** | Settings → General → Store defaults | ☐ |
| Unit system | Metric | Settings → General | ☐ |
| Weight unit | kg (or g) | Settings → General | ☐ |
| Order ID format | Merchant preference | Settings → General | ☐ |

### Money format (recommended)

In Settings → Store currency / Markets language formatting:

```text
Rs. {{amount_with_comma_separator}}
```

Example display: `Rs. 2,499`

## Payments narrative (locked for theme copy)

| Method | Theme messaging | Admin note |
|--------|-----------------|------------|
| **Cash on Delivery (COD)** | Primary trust message on homepage, PDP, cart | Enable COD / manual payment or COD app |
| Cards / wallets | Shown as payment icons in footer (Phase 2+) | Enable available gateways for PK |
| Bank deposit | Optional FAQ only | If used operationally |

**Rule:** Theme must never promise COD if Admin COD is disabled. Toggle via `settings` / product metafield `custom.cod_available` in later phases.

## Shipping thresholds (locked defaults)

| Rule | Default | Theme setting |
|------|---------|---------------|
| Free shipping goal | **Rs. 2,999** | `freeshipping_goal_amount` |
| Announcement copy | Free delivery across Pakistan on orders over Rs. 2,999 | Announcement bar |
| Returns window | **7 days** | `trust_returns` text |

Align **Admin → Shipping and delivery** free-rate condition with Rs. 2,999 (or update both together).

## Policies (create pages, link in footer later)

| Policy | Required before launch |
|--------|------------------------|
| Refund policy | ☐ |
| Privacy policy | ☐ |
| Terms of service | ☐ |
| Shipping policy | ☐ |

## Domains & access

| Item | Status |
|------|--------|
| `.myshopify.com` development store exists | ☐ |
| Staff accounts for theme developers | ☐ |
| Shopify CLI logged in (`shopify auth login`) | ☐ |
| Unpublished theme named **Payedaar** pushed | ☐ (see PUSH.md) |

## Seed collections (create empty handles)

Create these collection **handles** exactly (titles can match):

- `hot-deals`
- `best-sellers`
- `new-arrivals`
- `home-living`
- `kitchen`
- `beauty`
- `gadgets`
- `fashion`

## Seed navigation (Admin → Navigation)

**Main menu** suggested items:

1. Home → `/`
2. Categories → `/collections`
3. Hot Deals → `/collections/hot-deals` (will be styled primary in Phase 2)
4. Best Sellers → `/collections/best-sellers`
5. Track Order → `/pages/track-order`

**Footer menu:** About, Contact, FAQ, Shipping & Returns, Privacy, Terms.

## Pages to create (empty content OK in Phase 0)

| Handle | Title |
|--------|-------|
| `about-us` | About Payedaar |
| `contact` | Contact |
| `faq` | FAQ |
| `track-order` | Track Order |
| `shipping-returns` | Shipping & Returns |

## Verification commands

After CLI auth:

```bash
cd payedaar
shopify theme list --store YOUR_STORE.myshopify.com
shopify theme dev --store YOUR_STORE.myshopify.com
```

Expected: theme boots; homepage shows Phase 0 hero + trust strip.

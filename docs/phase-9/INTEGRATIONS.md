# Phase 9 — Integrations

## Reviews (Judge.me / Loox / Shopify Product Reviews)

1. Install app from Shopify App Store.  
2. Theme Editor → **Product** page → **Apps** section (between main PDP and Related).  
3. Add the app’s review block.  
4. Or use `@app` blocks inside Product information section.

## Order tracking

**Option A — Theme page only**

1. Page handle `track-order` with template `page.track-order`.  
2. Optional: set **External tracking URL** in section settings (courier portal).

**Option B — App-powered**

1. Install tracking app (AfterShip, Parcel Panel, etc.).  
2. Theme Editor → Track order page → add app block in the Apps slot.  
3. Leave external URL blank if app provides the UI.

## WhatsApp

- Theme settings → WhatsApp number: `92XXXXXXXXXX` (no `+` or spaces).  
- Float button + footer/header/contact CTAs use `https://wa.me/{number}`.  
- Verify chat opens on mobile + desktop (UAT #5).

## Search apps

Native predictive search is default. Only add Instant Search / Searchanise if replacing native — disable predictive in theme settings to avoid double UI.

## Wishlist

Native localStorage wishlist (Phase 7). Optional app later — do not enable both without removing theme hearts.

## Analytics apps / pixels

See `ANALYTICS.md`. Prefer Shopify Customer events over pasting snippets into theme.

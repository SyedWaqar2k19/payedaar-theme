# Phase 9 — Analytics (P9-AC6)

## Recommended setup (Shopify-native)

1. **Admin → Settings → Customer events** (or Sales channels → Online Store → Preferences).  
2. Add **Google Analytics 4** / **Meta Pixel** / **TikTok** via Shopify’s connectors or official apps.  
3. Enable **Shopify analytics** for Online Store.

Theme does **not** inject raw pixel snippets (avoids double-firing and consent issues).

## Theme event bridge

When **Theme settings → Analytics → Publish storefront analytics events** is ON (`analytics.js`):

| Event | When |
|-------|------|
| `page_view` | Every page load |
| `add_to_cart` | Successful Ajax ATC (`cart:updated`) |
| `begin_checkout` | Click checkout link/button |
| `search` | Search form submit |
| `view_item` | Variant change on PDP |
| `wishlist_updated` | Wishlist toggle |

Events are pushed to:

- `window.dataLayer` (GTM / GA4 custom tags)  
- `Shopify.analytics.publish(...)` (Customer events / pixels)  
- `payedaar:analytics` DOM CustomEvent

### GTM example

Map `dataLayer` event `add_to_cart` → GA4 `add_to_cart`. Same for `begin_checkout`, `search`, `page_view`.

## Verification

1. Chrome → Network / Tag Assistant / Meta Pixel Helper.  
2. Browse home → search → PDP → ATC → begin checkout.  
3. Confirm hits in GA4 DebugView / Meta Test Events.  
4. Check `[ ]` in `LAUNCH-SIGNOFF.md`.

## Soft launch note

If password page is ON, some third-party tags may behave differently — re-verify after publish.

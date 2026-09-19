# Phase 9 — Shopify Admin ops (Pakistan)

Outside-theme work coordinated with launch (P9-AC3, P9-AC4).

## Payments & COD

1. **Settings → Payments** — enable card/wallet providers as needed.  
2. Enable **Cash on Delivery (COD)** only if ops can fulfill COD.  
3. Theme setting **Show Cash on Delivery messaging** must match:
   - ON → COD enabled in checkout  
   - OFF → hide COD badges / trust / footer COD chip  

## Shipping

1. **Settings → Shipping and delivery** — Pakistan zones (nationwide or city tiers).  
2. Free shipping rule: cart ≥ **Rs. 2,999** (or change theme `freeshipping_goal_amount` to match).  
3. Set product **weights** for rate accuracy.

## Taxes & currency

- Store currency: **PKR**  
- Timezone: **Asia/Karachi**  
- Money format suggestion: `Rs. {{amount_with_comma_separator}}`

## Policies

Publish under **Settings → Policies**:

- Privacy policy  
- Terms of service  
- Refund policy  
- Shipping policy  

Theme footer links these automatically when present.

## Notifications

- Brand order confirmation / shipping emails (Admin → Notifications).  
- COD confirmation script for CS team (phone/WhatsApp).

## Domains & SSL

- Primary domain connected; SSL active.  
- Soft launch: keep **password page** ON until UAT pass.  
- Full launch (P9-AC5): publish theme + disable password (unless soft launch waived).

## Test order (P9-AC3)

1. Use Shopify **Bogus Gateway** or test mode / draft order as applicable.  
2. Place COD (or card) order end-to-end.  
3. Confirm email + Admin order created.  
4. Record order ID in `LAUNCH-SIGNOFF.md`.

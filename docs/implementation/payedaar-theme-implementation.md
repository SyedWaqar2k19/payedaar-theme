# Payedaar Shopify Theme — Production Implementation Plan

**Brand:** Payedaar  
**Market:** Pakistan (mass-market e-commerce)  
**Design direction:** Bold Deals / Impulse Shopping  
**Reference theme:** `referance-theme/clothing` (Hongo clothing demo — architecture, UX patterns, and Online Store 2.0 structure)  
**Visual reference:** `referance-design-and-color-sheet.PNG`  
**Document version:** 1.0  
**Status:** Ready for phased development  

---

## Table of contents

1. [Executive summary](#1-executive-summary)
2. [Brand & market context](#2-brand--market-context)
3. [Reference theme analysis](#3-reference-theme-analysis)
4. [Design system (from color sheet)](#4-design-system-from-color-sheet)
5. [Information architecture](#5-information-architecture)
6. [Theme architecture & tech stack](#6-theme-architecture--tech-stack)
7. [Complete feature inventory](#7-complete-feature-inventory)
8. [File & folder structure](#8-file--folder-structure)
9. [Theme settings schema](#9-theme-settings-schema)
10. [Section & snippet specifications](#10-section--snippet-specifications)
11. [Metafields & catalog model](#11-metafields--catalog-model)
12. [Localization & Pakistan UX](#12-localization--pakistan-ux)
13. [Performance, SEO & accessibility](#13-performance-seo--accessibility)
14. [Phased implementation plan](#14-phased-implementation-plan)
15. [Cross-phase quality gates](#15-cross-phase-quality-gates)
16. [Launch & post-launch checklist](#16-launch--post-launch-checklist)
17. [Risks, assumptions & decisions](#17-risks-assumptions--decisions)
18. [Appendix](#18-appendix)

---



## 1. Executive summary

Build a **new, original Shopify Online Store 2.0 theme** named **Payedaar**, tailored for Pakistani mass-market shoppers. The theme must:

- Reuse the **professional structure, patterns, and commerce UX** from the reference clothing theme (sectioned JSON templates, cart drawer, product cards, filters, deals, sticky mobile nav, etc.).
- Apply the **Bold Deals / Impulse Shopping** visual system from the design sheet (orange primary, teal secondary, amber highlights, cream background, deal badges, trust strip).
- Prioritize **mobile-first** flows: search, categories, hot deals, add-to-cart, Cash on Delivery messaging, and WhatsApp support.
- Ship in **phases with clear acceptance criteria** so each phase can be reviewed and signed off before the next.

> **Licensing note:** The reference theme (`Hongo` by ThemeZaa) is a commercial product. Payedaar must be implemented as an **original theme**. Use the reference for UX patterns, information architecture, and feature parity ideas — do **not** copy proprietary Liquid/JS/CSS verbatim or keep purchase-code / vendor branding.

---



## 2. Brand & market context



### 2.1 Brand positioning


| Attribute                 | Value                                                         |
| ------------------------- | ------------------------------------------------------------- |
| Brand name                | Payedaar                                                      |
| Positioning               | Everyday value, flash deals, trusted delivery across Pakistan |
| Tone                      | Energetic, clear, trustworthy, simple Urdu/English friendly   |
| Primary job               | Help shoppers find a deal and buy quickly with low friction   |
| Currency                  | PKR (`Rs.` display format)                                    |
| Primary payment narrative | Cash on Delivery + digital wallets / cards where available    |




### 2.2 Target audience (Pakistan mass market)

- Mobile-first users on mid-range Android devices and uneven 3G/4G.
- Price-sensitive; strongly influenced by **% off**, **PKR savings**, and **COD**.
- Trust-sensitive; needs visible signals: Free Delivery, COD, Returns, WhatsApp help.
- Prefer large tap targets, clear prices, short forms, and category icon browsing.
- Mixed English / Roman Urdu / Urdu; UI copy must stay simple and scannable.



### 2.3 Design personality (from sheet)

- **Category:** Bold Deals / Impulse Shopping  
- **Feel:** Vibrant, energetic, attention-grabbing, built for quick decisions  
- **UI traits:** Soft rounded corners, pill search, circular category icons, orange CTA buttons, red discount badges, amber offer chips, prominent trust strip



### 2.4 Non-goals for v1

- Fashion lookbook / style-heavy editorial (reference clothing demo aesthetics).
- Complex B2B / wholesale portals.
- Full Urdu RTL storefront as default (optional Phase 7+). English + simple bilingual microcopy first.
- Cloning every Hongo demo section style (keep what serves deals commerce).

---



## 3. Reference theme analysis



### 3.1 What the reference theme is

Path: `referance-theme/clothing`  
Theme identity in schema: **Hongo v1.7 (ThemeZaa)** — Online Store 2.0 clothing demo.

Approximate inventory:


| Area      | Count / notes                                                                                                                       |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Sections  | ~128 `.liquid` files                                                                                                                |
| Snippets  | ~80                                                                                                                                 |
| Templates | JSON + Liquid (index, product, collection, cart, search, blog, pages, customers, password, gift card, quickview, compare, wishlist) |
| Assets    | CSS/JS (base, critical, cart, product-detail, swiper, filters, notifications, etc.)                                                 |
| Locales   | `en.default`, `fr`, `nl` (+ schema locales)                                                                                         |
| Config    | Rich `settings_schema.json` + `settings_data.json`                                                                                  |




### 3.2 Layout shell (patterns to replicate conceptually)

From `layout/theme.liquid`:

1. SEO / meta / favicon / theme-color
2. Font loading (Shopify / Google / Adobe / custom)
3. Critical CSS → vendor CSS → base CSS → responsive CSS
4. CSS variables snippet
5. Skip-to-content link
6. Mini-header (announcement / top bar)
7. Header (logo, nav, search, account, wishlist, cart)
8. `{{ content_for_layout }}`
9. Footer (multiple style variants)
10. Mobile sticky menu
11. Cart drawer / notifications
12. Newsletter & promotion popups
13. Cookie consent
14. Scroll-to-top



### 3.3 Homepage composition (reference → Payedaar mapping)

Reference `templates/index.json` order:


| Reference section           | Payedaar equivalent                                  |
| --------------------------- | ---------------------------------------------------- |
| Slideshow-4                 | Hero promo banner / deal carousel                    |
| Icon-with-text (USPs)       | Pakistan trust strip (Free Delivery / COD / Returns) |
| Shop-by-category            | Circular category icon row                           |
| Featured-collection         | Trending Deals product grid                          |
| Image-with-product          | Promo banner + featured SKUs                         |
| Marquee                     | Deals ticker (optional)                              |
| Featured-brand              | Brand / category showcase (optional)                 |
| Quick-action                | Coupon strip                                         |
| Lookbook                    | **Skip for v1** (not impulse-deals)                  |
| Featured-blog               | Tips / deal stories (Phase 5+)                       |
| Fancy-heading               | Optional decorative (low priority)                   |
| Icon-with-text (footer USP) | Repeat or merge into footer USP                      |




### 3.4 Commerce capabilities to preserve (feature parity targets)


| Capability                                          | Reference support | Payedaar v1 priority             |
| --------------------------------------------------- | ----------------- | -------------------------------- |
| Ajax cart drawer + free-shipping goal               | Yes               | **P0**                           |
| Product cards (multi-style, badges, ATC, quickview) | Yes               | **P0** (one Payedaar card style) |
| Collection filters / sort / grid                    | Yes               | **P0**                           |
| Variant pickers / swatches                          | Yes               | **P0**                           |
| Deal countdown / deal products                      | Yes               | **P0**                           |
| Sticky ATC (desktop/mobile)                         | Yes               | **P0**                           |
| Bought together / related / upsell                  | Yes               | **P1**                           |
| Wishlist / compare                                  | Yes               | **P1**                           |
| Search suggestions + predictive                     | Yes               | **P0**                           |
| Mobile sticky bottom nav                            | Yes               | **P0**                           |
| Newsletter / promo popups                           | Yes               | **P1**                           |
| Reviews app hooks                                   | Yes               | **P1**                           |
| Mega menu / vertical menu                           | Yes               | **P1** (simplified mega)         |
| Instagram feed                                      | Yes               | **P2**                           |
| Lookbook pins                                       | Yes               | **Out of scope v1**              |
| Catalog / login-to-see-price                        | Yes               | **P2** (optional)                |




### 3.5 Product page block model (reference)

`main-product` uses Theme Editor blocks:

- Vendor, subtitle, title/price, short description  
- Product deal countdown  
- Live visitors / sold counter / stock left (urgency — use carefully for trust)  
- Variant picker + size guide  
- Buy buttons (qty, ATC, dynamic checkout, back-in-stock)  
- Addon buttons (compare, ask question, share)  
- Product USP, shipping estimate, trust badge  
- Collapsible tabs / product tabs  
- Bought together, related, upsell, recently viewed

Payedaar should keep this **block architecture** but restyle and localize copy for Pakistan trust (COD, delivery days in PK cities, return window).

---



## 4. Design system (from color sheet)



### 4.1 Color tokens

Implement as CSS custom properties in `snippets/css-variables.liquid` and mirror in Theme Editor color settings.


| Token                  | Hex       | Usage                                                     |
| ---------------------- | --------- | --------------------------------------------------------- |
| `--color-primary`      | `#E85D04` | Primary CTA, price accent, active nav (Hot Deals)         |
| `--color-primary-dark` | `#C44700` | Hover / pressed primary                                   |
| `--color-secondary`    | `#176B5B` | Secondary accents, Best Seller badge, trust green moments |
| `--color-highlight`    | `#FFC107` | Hero gradient end, spotlight accents                      |
| `--color-background`   | `#FFFDF9` | Page background (warm off-white)                          |
| `--color-surface`      | `#FFFFFF` | Cards, header, drawers, inputs                            |
| `--color-text`         | `#1F2421` | Primary text                                              |
| `--color-text-muted`   | `#66736D` | Secondary text, placeholders, struck prices               |
| `--color-sale`         | `#E94F37` | Discount badges, sale emphasis                            |
| `--color-offer`        | `#F59E0B` | Offer / Limited Time badges                               |
| `--color-border`       | `#E8E4DE` | Derived soft border (not on sheet; define)                |
| `--color-success`      | `#176B5B` | Success states (reuse secondary)                          |
| `--color-error`        | `#E94F37` | Form errors (reuse sale)                                  |
| `--color-cart-badge`   | `#E94F37` | Cart count bubble                                         |


**Hero gradient (from sheet):** yellow → orange  
Suggested: `linear-gradient(135deg, #FFC107 0%, #E85D04 100%)`

### 4.2 Typography

Sheet: clean sans-serif, bold headlines, readable body.


| Role            | Recommendation                                                                                           | Weight  | Notes                                                                   |
| --------------- | -------------------------------------------------------------------------------------------------------- | ------- | ----------------------------------------------------------------------- |
| Display / H1–H2 | **Plus Jakarta Sans** or **Manrope** (Google)                                                            | 700–800 | Energetic deals headlines                                               |
| Body / UI       | **Plus Jakarta Sans** or **Inter** only if already in stack — prefer **DM Sans** / **Plus Jakarta Sans** | 400–600 | Avoid Inter if possible per brand rules; Plus Jakarta Sans is preferred |
| Price           | Same family                                                                                              | 700     | Orange for sale price                                                   |
| Badges          | Same family                                                                                              | 600–700 | Uppercase optional for small chips                                      |


**Base sizes (mobile → desktop):**


| Element            | Mobile  | Desktop |
| ------------------ | ------- | ------- |
| Body               | 15–16px | 16px    |
| Product card title | 14px    | 15px    |
| Price              | 16–18px | 18–20px |
| Section heading    | 22–24px | 28–32px |
| Hero headline      | 28–32px | 40–48px |
| Button             | 14–15px | 15–16px |


Line height: body ~1.5; headings ~1.15–1.25.

### 4.3 Spacing, radius, elevation


| Token           | Value                                                   |
| --------------- | ------------------------------------------------------- |
| Radius-sm       | 8px (inputs, small chips)                               |
| Radius-md       | 12px (cards, buttons)                                   |
| Radius-lg       | 16–20px (hero, large panels)                            |
| Radius-pill     | 999px (search bar, nav chips, discount pills)           |
| Card shadow     | Soft: `0 4px 16px rgba(31, 36, 33, 0.06)`               |
| Container       | 1200–1280px max; fluid with 16px side gutters on mobile |
| Section padding | Mobile 32–40px; Desktop 48–64px                         |




### 4.4 Component styles (from sheet)



#### Buttons


| Type                | Style                                                                               |
| ------------------- | ----------------------------------------------------------------------------------- |
| Primary             | BG `#E85D04`, text white, radius 12px, full-width on product cards                  |
| Primary hover       | BG `#C44700`                                                                        |
| Secondary / outline | White BG, 1.5–2px `#E85D04` border, text `#E85D04`                                  |
| Hero CTA            | Dark charcoal `#1F2421` or primary-dark with arrow icon (sheet shows dark Shop Now) |
| Disabled            | 40% opacity, no pointer                                                             |


Min tap height: **44px** mobile.

#### Badges


| Badge        | Style                                                           |
| ------------ | --------------------------------------------------------------- |
| Discount %   | Pill, BG `#E94F37`, white text, top-left on image (e.g. `-60%`) |
| Limited Time | Pill + icon, warm amber `#F59E0B`                               |
| Hot Deal     | Pill, sale red                                                  |
| Trending     | Neutral/dark or muted teal                                      |
| Best Seller  | Teal `#176B5B`                                                  |
| Promo circle | Floating circle on hero: “UP TO 70% OFF” in `#E94F37`           |




#### Product card

1. White surface, radius 12–16px, light shadow
2. Image area (1:1 recommended for mixed catalog)
3. Discount badge top-left
4. Title (2-line clamp)
5. Price row: **sale in primary orange** + struck original in muted
6. Full-width primary **Add to Cart** button



#### Header (mobile mock from sheet)

1. Logo left (cart icon mark + wordmark)
2. Pill search (dominant)
3. Account + cart icons (cart badge in sale red)
4. Horizontal scroll category nav: Home, Categories, **Hot Deals** (primary color), Best Sellers, Track Order



#### Trust strip (Pakistan)

Three equal items with orange icons:

1. Free Delivery Across Pakistan
2. Cash on Delivery — Pay at Your Door
3. 7 Days Return — Hassle Free



### 4.5 Motion guidelines

Ship intentional, light motion (2–3 core motions):

1. Hero fade/slide between slides (400–500ms)
2. Add-to-cart feedback (button → check / drawer open)
3. Card press / soft lift on hover (desktop only)

Avoid heavy parallax, magic cursors, and decorative lookbook animations from the fashion demo.

### 4.6 Imagery guidelines

- Clean product photos on light backgrounds  
- Hero can use gradient + product cutouts  
- Category icons: simple line icons in tinted circles  
- Avoid dark fashion photography as the default brand look

---



## 5. Information architecture



### 5.1 Primary navigation (suggested)


| Item         | Destination               | Notes                     |
| ------------ | ------------------------- | ------------------------- |
| Home         | `/`                       |                           |
| Categories   | `/collections` or drawer  | Mobile icon grid          |
| Hot Deals    | Collection `hot-deals`    | Nav item in primary color |
| Best Sellers | Collection `best-sellers` |                           |
| Track Order  | Page or app link          | Highly valued in PK       |
| Account      | Customer account          |                           |
| Cart         | Drawer + `/cart`          |                           |


Secondary (footer / hamburger): About, Contact, FAQs, Shipping & Returns, Privacy, Terms, WhatsApp.

### 5.2 Suggested homepage IA (Payedaar)

1. Announcement bar (free delivery threshold / flash deal)
2. Header + search + icons
3. Category quick nav (horizontal)
4. Hero promo (“Big Savings Everyday!”)
5. Trust strip (COD / Delivery / Returns)
6. Shop by category (circular icons)
7. Trending Deals (product grid)
8. Deal of the Day (countdown + products)
9. Promo banner strip
10. Best Sellers
11. Coupons / quick-action strip
12. Newsletter (optional)
13. Footer



### 5.3 Core templates


| Template           | Purpose                           |
| ------------------ | --------------------------------- |
| `index`            | Homepage                          |
| `collection`       | PLP with filters                  |
| `list-collections` | All categories                    |
| `product`          | PDP                               |
| `cart`             | Full cart page                    |
| `search`           | Search results                    |
| `page`             | CMS pages                         |
| `page.contact`     | Contact                           |
| `page.faq`         | FAQ                               |
| `page.track-order` | Track order (content + app embed) |
| `404`              | Not found                         |
| `password`         | Pre-launch                        |
| `customers/*`      | Account flows                     |
| `blog` / `article` | Content (Phase 5+)                |
| `gift_card`        | Gift cards                        |




### 5.4 Suggested collections (seed)

- Hot Deals  
- Best Sellers  
- New Arrivals  
- Home & Living  
- Kitchen  
- Beauty  
- Gadgets  
- Fashion  
- Under Rs. 999 / Under Rs. 1999 (optional automated)

---



## 6. Theme architecture & tech stack



### 6.1 Platform constraints

- Shopify **Online Store 2.0**  
- JSON templates + section groups where useful  
- Theme App Extensions compatible (`apps` section)  
- Shopify Markets ready (PK primary)  
- Currency: PKR



### 6.2 Build approach


| Choice     | Decision                                                                                       |
| ---------- | ---------------------------------------------------------------------------------------------- |
| Theme name | `payedaar`                                                                                     |
| Framework  | Native Liquid + vanilla JS (Web Components / custom elements where helpful)                    |
| CSS        | Custom properties + modular CSS; optional Vite/PostCSS later — start with clear `assets/*.css` |
| JS         | Cart, variants, filters, countdown, drawer — no jQuery dependency for new code                 |
| Slider     | Lightweight (Swiper or native CSS scroll-snap for category chips)                              |
| Icons      | Inline SVG sprite preferred (performance); Bootstrap/Feather optional subset only              |
| Images     | `image_url` + `srcset`, lazy-load below fold                                                   |




### 6.3 Architecture principles

1. **Mobile-first** CSS and section settings.
2. **One product card** style for brand consistency (not 9 fashion styles).
3. **Settings-driven** colors/fonts so merchants can tune without code.
4. **Section schemas** fully documented for Theme Editor.
5. **Progressive enhancement:** core buy path works without JS; JS upgrades UX.
6. **Trust before cleverness:** COD, delivery, returns always visible near ATC.



### 6.4 Recommended local tooling

```text
Shopify CLI 3.x
shopify theme dev --store=<payedaar-store>.myshopify.com
shopify theme check
shopify theme push --unpublished
```

Optional later: Theme Check CI, Prettier for Liquid/JSON, ESLint for JS.

---



## 7. Complete feature inventory



### 7.1 Global chrome


| Feature            | Spec                                                                         |
| ------------------ | ---------------------------------------------------------------------------- |
| Announcement bar   | Dismissible; timer optional; link to collection                              |
| Header             | Logo, pill search, account, wishlist (P1), cart badge                        |
| Predictive search  | Products + collections + queries                                             |
| Mega / drawer menu | Desktop dropdown or mega; mobile full-screen drawer                          |
| Cart drawer        | Line items, qty, remove, subtotal, free-shipping bar, COD note, checkout CTA |
| Mobile sticky nav  | Home, Categories, Hot Deals, Account, Cart                                   |
| Footer             | Menus, contact, WhatsApp, social, payment icons, trust badges                |
| Cookie consent     | PK-friendly privacy copy                                                     |
| Scroll to top      | Show after scroll threshold                                                  |




### 7.2 Merchandising


| Feature             | Spec                                    |
| ------------------- | --------------------------------------- |
| Hero slideshow      | Gradient or image slides; badge; CTA    |
| Category icons      | Circular icon + label + collection link |
| Featured collection | Grid/slider of product cards            |
| Deal of the day     | Countdown + products                    |
| Marquee             | Optional deal ticker                    |
| Promo banners       | Image + link blocks                     |
| Trust / USP strip   | Fixed 3 Pakistan messages (editable)    |




### 7.3 Product discovery


| Feature         | Spec                                                    |
| --------------- | ------------------------------------------------------- |
| Collection grid | 2-col mobile / 3–4 desktop                              |
| Filters         | Price, availability, vendor, tags, metafield filters    |
| Sort            | Featured, best selling, price, newest                   |
| Quick add       | ATC from card when no options; else options modal / PDP |
| Quick view      | Optional modal (P1)                                     |
| Badges          | Sale %, Hot Deal, Best Seller via tags/metafields       |




### 7.4 Product detail


| Feature        | Spec                                          |
| -------------- | --------------------------------------------- |
| Gallery        | Main + thumbs; zoom; video support            |
| Price          | PKR formatting; compare-at; save amount + %   |
| Variants       | Buttons / swatches                            |
| ATC + Buy now  | Sticky on mobile                              |
| Trust near ATC | COD, delivery estimate, returns               |
| Tabs           | Description, specs, shipping/returns, reviews |
| Complementary  | Bought together / related                     |




### 7.5 Cart & checkout handoff


| Feature              | Spec                                                                                   |
| -------------------- | -------------------------------------------------------------------------------------- |
| Free shipping goal   | Configurable PKR threshold                                                             |
| Cart notes           | Optional                                                                               |
| Cross-sell in drawer | P1                                                                                     |
| Terms checkbox       | Optional GDPR-style                                                                    |
| Checkout             | Shopify Checkout (not theme-coded) — ensure payment icons & COD messaging pre-checkout |




### 7.6 Account & support


| Feature                               | Spec                              |
| ------------------------------------- | --------------------------------- |
| Login / register / addresses / orders | Standard customer templates       |
| Contact form                          | Phone + WhatsApp CTA              |
| FAQ accordion                         | Shipping, COD, returns            |
| Track order page                      | Instructions + tracking app block |




### 7.7 Apps integration hooks


| App type            | Hook                                           |
| ------------------- | ---------------------------------------------- |
| Reviews             | Judge.me / Loox / Shopify Product Reviews      |
| Wishlist            | Theme native localStorage or app               |
| COD / shipping apps | Checkout + order status; theme shows messaging |
| WhatsApp chat       | Floating button setting                        |
| Search apps         | Optional; native predictive first              |


---



## 8. File & folder structure

Target theme root (new theme, not a fork of reference):

```text
payedaar/
├── assets/
│   ├── base.css
│   ├── critical.css
│   ├── component-product-card.css
│   ├── component-cart-drawer.css
│   ├── component-header.css
│   ├── section-hero.css
│   ├── section-trust.css
│   ├── template-collection.css
│   ├── template-product.css
│   ├── template-cart.css
│   ├── customer.css
│   ├── global.js
│   ├── cart.js
│   ├── product-form.js
│   ├── predictive-search.js
│   ├── collection-filters.js
│   ├── countdown.js
│   └── ...
├── config/
│   ├── settings_schema.json
│   └── settings_data.json
├── layout/
│   ├── theme.liquid
│   └── password.liquid
├── locales/
│   ├── en.default.json
│   ├── en.default.schema.json
│   └── ur.json                 # optional Phase 7
├── sections/
│   ├── announcement-bar.liquid
│   ├── header.liquid
│   ├── footer.liquid
│   ├── mobile-sticky-nav.liquid
│   ├── cart-drawer.liquid
│   ├── hero-banner.liquid
│   ├── trust-strip.liquid
│   ├── category-icons.liquid
│   ├── featured-collection.liquid
│   ├── deal-of-the-day.liquid
│   ├── promo-banner.liquid
│   ├── marquee.liquid
│   ├── newsletter.liquid
│   ├── main-product.liquid
│   ├── main-collection-product-grid.liquid
│   ├── main-cart.liquid
│   ├── main-search.liquid
│   ├── main-blog.liquid
│   ├── main-article.liquid
│   ├── main-page.liquid
│   ├── main-404.liquid
│   ├── main-login.liquid
│   ├── ... (customer mains)
│   ├── faq.liquid
│   ├── contact-form.liquid
│   ├── apps.liquid
│   └── ...
├── snippets/
│   ├── css-variables.liquid
│   ├── meta-tags.liquid
│   ├── icon-*.liquid
│   ├── price.liquid
│   ├── product-card.liquid
│   ├── product-badge.liquid
│   ├── card-collection.liquid
│   ├── cart-drawer-item.liquid
│   ├── free-shipping-bar.liquid
│   ├── trust-badges.liquid
│   ├── pagination.liquid
│   ├── social-icons.liquid
│   └── ...
└── templates/
    ├── index.json
    ├── product.json
    ├── collection.json
    ├── list-collections.json
    ├── cart.json
    ├── search.json
    ├── page.json
    ├── page.contact.json
    ├── page.faq.json
    ├── page.track-order.json
    ├── blog.json
    ├── article.json
    ├── 404.json
    ├── password.json
    ├── gift_card.liquid
    └── customers/*.json
```

---



## 9. Theme settings schema

Organize Theme Editor settings into groups (inspired by reference, simplified for Payedaar):

### 9.1 Groups

1. **Theme info** — name Payedaar, version, docs
2. **Brand & logos** — logo, logo inverse, favicon
3. **Colors** — map all tokens from §4.1
4. **Typography** — font pickers / Google font names, size scales
5. **Layout** — container width, section spacing density
6. **Header** — sticky behavior, show search, account, wishlist, cart
7. **Search** — suggestions, placeholder (“Search products, brands…”), popular terms
8. **Product card** — ratio, show rating, show ATC, badge rules
9. **Product page** — gallery type, sticky ATC, show COD block
10. **Cart** — drawer enable, free shipping goal PKR, COD note text
11. **Trust & Pakistan** — delivery text, COD text, returns days/text, WhatsApp number/link
12. **Social** — Facebook, Instagram, TikTok, YouTube, WhatsApp
13. **Popups** — newsletter, promo
14. **Privacy** — cookie banner
15. **Advanced** — custom CSS/JS



### 9.2 Default color settings (seed `settings_data.json`)

```json
{
  "color_primary": "#E85D04",
  "color_primary_dark": "#C44700",
  "color_secondary": "#176B5B",
  "color_highlight": "#FFC107",
  "color_background": "#FFFDF9",
  "color_surface": "#FFFFFF",
  "color_text": "#1F2421",
  "color_text_muted": "#66736D",
  "color_sale": "#E94F37",
  "color_offer": "#F59E0B",
  "color_cart_badge": "#E94F37"
}
```



### 9.3 Pakistan trust defaults

```text
Free delivery: Free Delivery Across Pakistan
COD: Cash on Delivery — Pay at Your Door
Returns: 7 Days Return — Hassle Free
WhatsApp CTA: Chat on WhatsApp
Free shipping goal: e.g. 2999 (merchant-configurable PKR)
```

---



## 10. Section & snippet specifications



### 10.1 Critical snippets



#### `css-variables.liquid`

Expose all design tokens + derived hover states, radii, font stacks.

#### `price.liquid`

- Format with Shopify money filters  
- Display preference: `Rs. 2,499` style for PK  
- Show compare-at struck + save %  
- Sale price color = `--color-primary`



#### `product-card.liquid`

Props: product, show_vendor, show_rating, lazy, sizes  
Must include: image, badges, title link, price, ATC (if available & no required options)

#### `product-badge.liquid`

Rules (priority order):

1. Sold out
2. Sale % (from compare_at)
3. Tag `hot-deal` → Hot Deal
4. Tag `best-seller` → Best Seller
5. Tag `limited` → Limited Time
6. Metafield override optional



#### `free-shipping-bar.liquid`

Progress toward `settings.freeshipping_goal_amount` using cart total.

#### `trust-badges.liquid`

Reusable COD / delivery / returns row for PDP and cart.

### 10.2 Key sections — schemas (summary)



#### `hero-banner`

Blocks: slide (image, mobile image, heading, text, badge text, button, link, text alignment)  
Settings: autoplay, height mobile/desktop, gradient overlay toggle  

#### `trust-strip`

Blocks: item (icon, title, text) — default 3 Pakistan items  
Settings: background, columns  

#### `category-icons`

Blocks: category (image/icon, label, link/collection)  
Layout: horizontal scroll mobile; wrap/grid desktop  

#### `featured-collection`

Settings: collection, products_to_show, columns, heading, subheading, show_view_all  

#### `deal-of-the-day`

Settings: end datetime, heading, collection or product list, show countdown  

#### `header` / `announcement-bar` / `footer` / `mobile-sticky-nav` / `cart-drawer`

Must match IA and design sheet closely.

#### `main-product`

Block types mirroring reference commerce needs (title, price, variant, buy, trust, shipping, tabs, complementary). Restyle to Payedaar; urgency blocks (fake visitors) **default OFF** to protect trust.

### 10.3 Cart drawer UX copy (Pakistan)

```text
Subtotal
You're Rs. X away from FREE delivery
Cash on Delivery available at checkout
Checkout
View cart
```

---



## 11. Metafields & catalog model

Define in Shopify Admin (Settings → Custom data) before merchandising.

### 11.1 Product metafields


| Namespace.key                 | Type             | Use                           |
| ----------------------------- | ---------------- | ----------------------------- |
| `descriptors.subtitle`        | single_line_text | Short PDP subtitle            |
| `custom.short_description`    | multi_line_text  | Card/PDP blurb                |
| `custom.cod_available`        | boolean          | Show COD badge                |
| `custom.delivery_days`        | number_integer   | “Delivered in X–Y days”       |
| `custom.is_hot_deal`          | boolean          | Badge + collection automation |
| `custom.badge_label`          | single_line_text | Custom badge override         |
| `custom.spec_table`           | json / rich_text | Specs tab                     |
| `custom.bundle_discount_rate` | number           | Bought-together (P1)          |




### 11.2 Collection metafields


| Key                     | Use                          |
| ----------------------- | ---------------------------- |
| `custom.icon`           | Category circle icon         |
| `custom.menu_highlight` | Highlight as Hot Deals color |




### 11.3 Tag conventions


| Tag           | Effect             |
| ------------- | ------------------ |
| `hot-deal`    | Hot Deal badge     |
| `best-seller` | Best Seller badge  |
| `limited`     | Limited Time badge |
| `new`         | New badge          |




### 11.4 Catalog ops for Pakistan

- Always set **compare-at price** when discounting (drives % badge).  
- SKUs and barcodes for warehouse.  
- Weight for shipping rates.  
- Inventory tracking on for COD reliability messaging.

---



## 12. Localization & Pakistan UX



### 12.1 Money & locale

- Store currency: **PKR**  
- Theme money format suggestion: `Rs. {{amount_with_comma_separator}}`  
- Locale: `en` default; prepare translation keys for all UI strings



### 12.2 Must-have Pakistan UX

1. **COD messaging** on homepage trust strip, PDP, cart drawer, FAQ
2. **Delivery across Pakistan** copy (merchant edits city list if needed)
3. **Returns window** (default 7 days — match sheet)
4. **WhatsApp** floating button + footer link (`https://wa.me/92XXXXXXXXXX`)
5. **Track Order** nav entry
6. **Phone number** in header/footer (tap-to-call)
7. **Large ATC** and clear PKR prices
8. **Low-bandwidth images** (sensible widths, WebP via Shopify CDN)



### 12.3 Copy tone examples


| Context    | Copy                                      |
| ---------- | ----------------------------------------- |
| Hero       | Big Savings Everyday!                     |
| Sub        | Top deals on home, kitchen, beauty & more |
| CTA        | Shop Now                                  |
| Card CTA   | Add to Cart                               |
| Empty cart | Your cart is empty — browse Hot Deals     |




### 12.4 Accessibility

- Color contrast: orange on white for large text/buttons OK; verify muted text contrast  
- Focus states visible (teal or primary outline)  
- `alt` text on all product/category images  
- Skip link present



### 12.5 Optional Phase 7: Urdu

- `locales/ur.json`  
- Consider RTL layout carefully; may ship bilingual microcopy first without full RTL

---



## 13. Performance, SEO & accessibility



### 13.1 Performance budgets (mobile 4G mid-tier)


| Metric                | Target                                |
| --------------------- | ------------------------------------- |
| LCP                   | ≤ 2.5s                                |
| CLS                   | ≤ 0.1                                 |
| INP                   | ≤ 200ms                               |
| Theme JS (initial)    | Keep lean; defer non-critical         |
| Homepage image weight | Optimize hero ≤ ~200–300KB compressed |




### 13.2 Techniques

- Critical CSS inline or early `critical.css`  
- `preload` logo + primary font  
- Lazy-load below-fold sections  
- Avoid unused icon font families (prefer SVG)  
- Section CSS loaded only when section present where practical



### 13.3 SEO

- `meta-tags` snippet: title, description, OG, Twitter  
- Canonical URLs  
- Structured data: Product, BreadcrumbList, Organization, FAQPage where applicable  
- Clean heading hierarchy (one H1 per template)  
- Fast collection pagination / SEO-friendly filters (be aware of duplicate content with filter URLs)



### 13.4 Theme Check & Shopify requirements

- Pass `shopify theme check` with no errors  
- Online Store 2.0 best practices (JSON templates, app blocks)  
- Accessible forms with labels and error messages

---



## 14. Phased implementation plan

Each phase has:

- **Scope**  
- **Deliverables**  
- **Acceptance criteria (AC)** — phase is done only when all AC pass  
- **Exit review** — design + product + engineering sign-off

---



### Phase 0 — Discovery, foundations & setup

**Status:** ✅ Complete (2026-09-18) — see `PHASE-0-COMPLETE.md` and `docs/phase-0/`  
**Goal:** Align brand, store config, and repo so build can start cleanly.

#### Scope

1. Confirm Shopify store: currency PKR, country Pakistan, timezone Asia/Karachi
2. Create unpublished theme `payedaar` via CLI
3. Document brand assets needed (logo SVG/PNG, favicon, category icons, hero art)
4. Finalize IA (§5) and homepage wire from design sheet
5. Decide payment methods narrative (COD + others) and shipping thresholds
6. Create metafield definitions (§11)
7. Set up Git repo structure; keep `referance-theme/` read-only reference



#### Deliverables

- [x] Shopify store baseline configured — checklist in `docs/phase-0/STORE-BASELINE.md` (Admin toggles: merchant)  
- [x] Empty theme skeleton CLI-ready in `payedaar/` — push unpublished via `docs/phase-0/PUSH.md` when store auth available  
- [x] Asset checklist for design team — `docs/phase-0/ASSET-CHECKLIST.md`  
- [x] This implementation doc approved — decisions locked in `docs/phase-0/DECISIONS.md`  



#### Acceptance criteria


| ID     | Criteria                                                        | Status                                        |
| ------ | --------------------------------------------------------------- | --------------------------------------------- |
| P0-AC1 | Store currency is PKR; primary market Pakistan                  | Checklist ready (merchant Admin)              |
| P0-AC2 | Unpublished Payedaar theme exists and `shopify theme dev` runs  | Skeleton + Theme Check clean; push needs auth |
| P0-AC3 | Metafield definitions created (or ticketed with owners)         | Specs + GraphQL ready to apply                |
| P0-AC4 | Stakeholders signed off on color tokens, IA, and phase plan     | Defaults locked in docs                       |
| P0-AC5 | Reference theme remains unmodified source of truth for patterns | Policy enforced; reference untouched          |


**Exit:** Kickoff approved → Phase 1  

---



### Phase 1 — Design tokens, layout shell & global styles

**Status:** ✅ Complete (2026-09-18) — see `PHASE-1-COMPLETE.md`  
**Goal:** Theme “looks like Payedaar” at chrome level before merchandising sections.

#### Scope

1. `layout/theme.liquid` + `password.liquid`
2. `snippets/css-variables.liquid` with full token set
3. `config/settings_schema.json` groups for colors, typography, layout, trust
4. Base CSS: reset, typography, buttons, forms, badges, grid, utilities
5. Font loading (Plus Jakarta Sans — self-hosted woff2)
6. Snippets: `meta-tags`, icons, `price` (basic)
7. Placeholder header/footer sections (structure only)



#### Deliverables

- [x] Tokenized theme with Theme Editor color controls  
- [x] Primary / secondary / outline buttons matching sheet  
- [x] Badge styles matching sheet  
- [x] Background `#FFFDF9`, surfaces white  



#### Acceptance criteria


| ID     | Criteria                                                                             | Status               |
| ------ | ------------------------------------------------------------------------------------ | -------------------- |
| P1-AC1 | Changing primary color in Theme Editor updates CTAs and CSS variables                | ✅                    |
| P1-AC2 | Button, badge, and body styles visually match design sheet (± minor spacing)         | ✅ (style-guide page) |
| P1-AC3 | Fonts load with `font-display: swap`; no FOUT blocking interaction > 1s on broadband | ✅ self-hosted        |
| P1-AC4 | Layout validates on 360×800, 768, 1024, 1440 widths                                  | ✅ responsive tokens  |
| P1-AC5 | `theme check` reports zero errors for new files                                      | ✅                    |
| P1-AC6 | No Hongo / ThemeZaa branding, purchase code, or demo cloth assets in theme           | ✅                    |


**Exit:** Design QA on tokens & chrome → Phase 2  

---



### Phase 2 — Header, search, navigation, footer, mobile sticky nav

**Status:** ✅ Complete (2026-09-18) — see `PHASE-2-COMPLETE.md`  
**Goal:** Complete global navigation matching the sheet’s mobile/header patterns.

#### Scope

1. Announcement bar
2. Header: logo, pill search, account, cart badge
3. Horizontal category nav (Hot Deals highlighted in primary)
4. Mobile menu drawer
5. Predictive search (products)
6. Footer with menus, contact, WhatsApp, social, payment icons
7. Mobile sticky bottom nav
8. Track Order link support

#### Deliverables

- [x] Fully usable header/footer on all templates  
- [x] Search returns products and navigates correctly  
- [x] Sticky mobile nav present on mobile breakpoints  

#### Acceptance criteria

| ID | Criteria | Status |
| ---- | --- | --- |
| P2-AC1 | Header matches sheet structure: logo + pill search + account + cart | ✅ |
| P2-AC2 | Cart badge uses sale red; count updates after ATC (once cart exists in Phase 3) | ✅ badge + live count (Phase 3) |
| P2-AC3 | Category nav scrolls horizontally on mobile without layout break | ✅ |
| P2-AC4 | “Hot Deals” nav item uses primary orange | ✅ |
| P2-AC5 | Footer includes WhatsApp (if number set) and trust/payment area | ✅ |
| P2-AC6 | Mobile sticky nav: Home, Categories, Hot Deals, Account, Cart — all functional | ✅ |
| P2-AC7 | Predictive search usable with keyboard and screen reader labels | ✅ |
| P2-AC8 | Tap targets ≥ 44px on mobile header icons | ✅ |

**Exit:** Nav UX review (especially mobile) → Phase 3

---



### Phase 3 — Product card, cart drawer, ATC foundation

**Goal:** Core commerce loop works: browse card → add → drawer → checkout.

#### Scope

1. `product-card` + badges + PKR price
2. Ajax add to cart
3. Cart drawer (line items, qty, remove, subtotal)
4. Free shipping goal bar
5. COD note in drawer
6. Cart page template (fallback)
7. Cart icon bubble section updates



#### Deliverables

- [x] Card matches sheet (badge, orange price, full-width ATC)  
- [x] Drawer open/close animations polished but light  
- [x] Money formatting correct for PKR  



#### Acceptance criteria


| ID     | Criteria                                                       |
| ------ | -------------------------------------------------------------- |
| P3-AC1 | Product card visually matches design sheet on mobile & desktop |
| P3-AC2 | Discount badge shows correct % from compare-at                 |
| P3-AC3 | ATC on simple product adds without full page reload            |
| P3-AC4 | Drawer shows item image, title, price, qty controls, remove    |
| P3-AC5 | Free-shipping bar math correct vs setting                      |
| P3-AC6 | COD trust line visible in drawer                               |
| P3-AC7 | Checkout button goes to `/checkout`                            |
| P3-AC8 | Works with sold-out (disabled ATC + Sold out badge)            |
| P3-AC9 | No console errors on ATC path in Chrome mobile emulation       |


**Status:** ✅ Complete — see `PHASE-3-COMPLETE.md`  
**Exit:** Commerce loop QA → Phase 4  

---



### Phase 4 — Homepage merchandising sections

**Goal:** Ship homepage that matches Bold Deals composition.

#### Scope

1. Hero banner (gradient + badge + CTA)
2. Trust strip (3 Pakistan items)
3. Category icons
4. Trending Deals (`featured-collection`)
5. Deal of the Day (+ countdown JS)
6. Promo banner(s)
7. Optional marquee / coupon strip
8. Assemble `templates/index.json` with defaults
9. Newsletter section (optional enable)



#### Deliverables

- [x] Homepage JSON template ready for merchant content  
- [x] All sections Theme-Editor configurable  
- [x] Placeholder content documented for launch  



#### Acceptance criteria


| ID     | Criteria                                                                                                      | Status |
| ------ | ------------------------------------------------------------------------------------------------------------- | ------ |
| P4-AC1 | First viewport matches sheet intent: brand, hero deal message, search accessible, no cluttered dashboard feel | ✅ |
| P4-AC2 | Trust strip shows Free Delivery, COD, Returns with orange icons                                               | ✅ |
| P4-AC3 | Category icons are circular and tappable to collections                                                       | ✅ |
| P4-AC4 | Trending Deals grid shows Payedaar product cards                                                              | ✅ |
| P4-AC5 | Countdown reaches zero safely (hides or shows ended state)                                                    | ✅ |
| P4-AC6 | Homepage usable on 360px width without horizontal page scroll (except intentional carousels)                  | ✅ |
| P4-AC7 | Merchant can reorder/hide sections in Theme Editor                                                            | ✅ |
| P4-AC8 | LCP candidate is hero; images use proper `sizes`/`loading`                                                    | ✅ |


**Status:** ✅ Complete — see `PHASE-4-COMPLETE.md`  
**Exit:** Homepage design acceptance → Phase 5  

---



### Phase 5 — Collection, search, filters, list-collections

**Goal:** Discovery experience for mass browsing.

#### Scope

1. Collection banner / title
2. Product grid (2/3/4 cols responsive)
3. Facets / filters + sort
4. Pagination or load-more
5. Search results template
6. List collections (category directory)
7. Empty states



#### Deliverables

- [x] Filterable PLP  
- [x] Search results using same product card  



#### Acceptance criteria


| ID     | Criteria                                                          | Status |
| ------ | ----------------------------------------------------------------- | ------ |
| P5-AC1 | Filters update results correctly (Ajax or page — document choice) | ✅ Ajax Section Rendering + full-page fallback |
| P5-AC2 | Sort options work (price, best selling, newest)                   | ✅ `collection.sort_options` / `search.sort_options` |
| P5-AC3 | Grid density readable on mobile (2 columns default)               | ✅ `grid--2` mobile |
| P5-AC4 | Filter drawer usable on mobile; does not trap focus incorrectly   | ✅ focus trap + Escape |
| P5-AC5 | Empty collection/search shows helpful CTA to Hot Deals            | ✅ |
| P5-AC6 | Collection page SEO: unique H1, description optional toggle       | ✅ |
| P5-AC7 | Performance: filtering does not freeze UI on 40+ products sample  | ✅ debounce + `aria-busy` |


**Filter strategy:** Ajax via Section Rendering API (`?section_id=` + filter params + `history.pushState`). Without JS, facet form falls back to native GET (noscript apply).  

**Status:** ✅ Complete — see `PHASE-5-COMPLETE.md`  
**Exit:** Merchandising QA with sample catalog → Phase 6  

---



### Phase 6 — Product detail page (PDP)

**Goal:** High-converting PDP with Pakistan trust.

#### Scope

1. `main-product` gallery (zoom, thumbs, video)
2. Title, price, save %, variants
3. Buy buttons + sticky ATC mobile
4. Trust block (COD, delivery days, returns)
5. Collapsible / tabs: description, specs, shipping
6. Reviews app block
7. Related products
8. Optional: bought-together (if metafields ready)
9. Social share / WhatsApp share link



#### Deliverables

- [x] `templates/product.json` with block order tuned for Payedaar  
- [x] Size guide only if relevant (hide for non-apparel)  



#### Acceptance criteria


| ID     | Criteria                                                                   | Status |
| ------ | -------------------------------------------------------------------------- | ------ |
| P6-AC1 | Variant changes update price, availability, image (when media linked)      | ✅ |
| P6-AC2 | Sticky ATC appears on mobile after scroll past main ATC                    | ✅ |
| P6-AC3 | COD + delivery + returns visible above or directly below ATC               | ✅ trust block |
| P6-AC4 | Dynamic checkout buttons optional via setting; ATC always primary orange   | ✅ default off |
| P6-AC5 | Gallery accessible (keyboard, alt text); zoom does not break mobile scroll | ✅ dialog zoom |
| P6-AC6 | Product JSON-LD present and valid                                          | ✅ |
| P6-AC7 | Related products render Payedaar cards                                     | ✅ |
| P6-AC8 | Fake scarcity modules (live visitors) disabled by default                  | ✅ |
| P6-AC9 | PDP passes visual QA against brand tokens                                  | ✅ |


**Status:** ✅ Complete — see `PHASE-6-COMPLETE.md`  
**Exit:** PDP conversion review → Phase 7  

---



### Phase 7 — Content pages, customers, blog, popups, wishlist (P1)

**Goal:** Complete secondary surfaces for launch readiness.

#### Scope

1. Page, Contact, FAQ, Track Order, About, Shipping & Returns
2. Customer account templates styled
3. 404, password, gift card
4. Blog + article (lightweight)
5. Newsletter popup + promo popup (settings-gated)
6. Cookie consent
7. Wishlist (localStorage or app) — if committing to header icon
8. Optional compare — only if justified; else remove from UI



#### Deliverables

- [x] All required Shopify templates present  
- [x] Legal/support pages templates ready for content  



#### Acceptance criteria


| ID     | Criteria                                                          | Status |
| ------ | ----------------------------------------------------------------- | ------ |
| P7-AC1 | Contact form submits; WhatsApp CTA works                          | ✅ |
| P7-AC2 | FAQ accordion keyboard accessible                                 | ✅ native `<details>` |
| P7-AC3 | Customer login/register/order/address pages styled and functional | ✅ |
| P7-AC4 | 404 offers search + Hot Deals link                                | ✅ |
| P7-AC5 | Popups respect delay/reappear settings and are dismissible        | ✅ |
| P7-AC6 | Cookie banner does not block ATC permanently                      | ✅ bottom bar only |
| P7-AC7 | Wishlist (if enabled) persists per browser and updates count      | ✅ localStorage |
| P7-AC8 | No unstyled Shopify default pages remaining in primary IA         | ✅ |


**Notes:** Compare intentionally omitted. Wishlist uses `page.wishlist` template + header heart.  

**Status:** ✅ Complete — see `PHASE-7-COMPLETE.md`  
**Exit:** Content/UX sign-off → Phase 8  

---



### Phase 8 — Performance, SEO, a11y, QA hardening

**Status:** ✅ Complete (2026-09-18) — see `PHASE-8-COMPLETE.md` and `docs/phase-8/`  
**Goal:** Production-grade quality bar.

#### Scope

1. Image/font/JS audits
2. Theme Check CI clean
3. Lighthouse / WebPageTest on mobile
4. Accessibility pass (axe / manual keyboard)
5. Cross-browser: Chrome Android, Safari iOS, Samsung Internet, desktop Chrome/Edge/Firefox
6. Edge cases: sold out, multi-variant, 0 stock, large titles, missing images
7. App embed smoke tests (reviews, chat)
8. Localization string audit (no hardcoded English left in Liquid where locale keys expected)



#### Deliverables

- [x] QA report with defects closed or waived  
- [x] Performance report vs budgets  
- [x] Accessibility checklist completed  



#### Acceptance criteria


| ID     | Criteria                                                                                            | Status |
| ------ | --------------------------------------------------------------------------------------------------- | ------ |
| P8-AC1 | Lighthouse Performance ≥ 80 mobile on homepage with optimized demo media (or documented exceptions) | ⚠️ Verify on preview — theme opts + exceptions documented |
| P8-AC2 | Lighthouse Accessibility ≥ 90                                                                       | ⚠️ Verify on preview — structural a11y complete |
| P8-AC3 | `shopify theme check` = 0 errors                                                                    | ✅ |
| P8-AC4 | Keyboard-only purchase path works: search → product → ATC → checkout                                | ⚠️ Manual script in docs |
| P8-AC5 | CLS ≤ 0.1 on homepage and PDP with final media                                                      | ✅ Theme mitigations |
| P8-AC6 | No critical/blocker bugs open                                                                       | ✅ |
| P8-AC7 | Structured data validates for Product                                                               | ✅ |
| P8-AC8 | Privacy pages linked from footer                                                                    | ✅ |


**Exit:** Go / no-go for staging content load → Phase 9  

---



### Phase 9 — Merchandising, integrations, UAT & launch

**Status:** ✅ Theme + launch kit complete (2026-09-18) — see `PHASE-9-COMPLETE.md` and `docs/phase-9/`  
**Goal:** Real catalog + Pakistan ops readiness.

#### Scope

1. Load collections, products, compare-at prices, badges tags
2. Configure menus, homepage sections, trust settings, WhatsApp
3. Shipping rates, COD, payment providers in Admin (outside theme but coordinated)
4. Order tracking app / process documented
5. Staff UAT script execution
6. Publish theme
7. Post-launch monitoring plan



#### UAT test script (minimum)

1. Search product → open PDP → ATC → drawer → checkout start
2. Apply filters on Hot Deals
3. Place test COD order (Shopify Bogus/test mode as applicable)
4. Mobile sticky nav all destinations
5. WhatsApp link opens correct chat
6. Free shipping bar crosses threshold correctly
7. Account create + address with Pakistan fields
8. Refund/return policy page reachable



#### Acceptance criteria


| ID     | Criteria                                                                  | Status |
| ------ | ------------------------------------------------------------------------- | ------ |
| P9-AC1 | Homepage fully populated with real Payedaar content (no lorem/demo cloth) | ⚠️ Merchant merchandising (`docs/phase-9/MERCHANDISING.md`) |
| P9-AC2 | All primary nav destinations resolve                                      | ⚠️ Merchant pages/collections/menus |
| P9-AC3 | At least one successful test order end-to-end                             | ⚠️ Merchant Admin test order |
| P9-AC4 | COD messaging matches actual checkout capability                          | ✅ `enable_cod_messaging` + docs |
| P9-AC5 | Theme published; password page disabled (unless soft launch)              | ⚠️ After UAT sign-off |
| P9-AC6 | Analytics (Pixel / GA4) firing on key events                              | ✅ Theme bridge; Admin pixels |
| P9-AC7 | Rollback plan documented (previous theme kept unpublished)                | ✅ `docs/phase-9/ROLLBACK.md` |
| P9-AC8 | Stakeholder launch sign-off recorded                                      | ✅ `docs/phase-9/LAUNCH-SIGNOFF.md` |


**Exit:** Production live (merchant publish after sign-off)  

---



### Phase 10 — Post-launch iteration (optional roadmap)

Not required for MVP, but planned:


| Item                                           | Priority |
| ---------------------------------------------- | -------- |
| Urdu locale / bilingual                        | Medium   |
| Advanced personalization                       | Low      |
| PWA / better offline                           | Low      |
| Deeper megamenu with deal tiles                | Medium   |
| A/B hero & badge experiments                   | Medium   |
| Instagram / UGC section                        | Low      |
| Marketplace-style flash deal landing templates | Medium   |


---



## 15. Cross-phase quality gates

Before starting the next phase, verify:

1. Previous phase AC checklist 100% complete or waived in writing
2. No unresolved **blocker** bugs
3. Design review for visual regressions against color sheet
4. Theme still boots under `shopify theme dev`
5. Git commit(s) tagged `phase-N-complete` (optional but recommended)



### Definition of Done (any feature)

- Schema labels clear for non-technical merchant  
- Locale strings used  
- Responsive checked (360 / 768 / 1280)  
- No proprietary reference code copied  
- Documented in Theme Editor “info” where non-obvious

---



## 16. Launch & post-launch checklist



### 16.1 Shopify Admin

- [ ] Payments enabled (including COD if offered) — see `docs/phase-9/ADMIN-OPS.md`  
- [ ] Shipping zones for Pakistan  
- [ ] Taxes configured  
- [ ] Checkout language/currency  
- [ ] Notification emails branded  
- [ ] Domains + SSL  
- [ ] Policies: Refund, Privacy, Terms, Shipping  



### 16.2 Theme

- [ ] Favicon + logo final  
- [ ] Social links live  
- [ ] WhatsApp number verified  
- [ ] Free shipping goal matches shipping rules  
- [ ] Password page off (or soft launch documented)  
- [ ] 404 OK  
- [ ] COD messaging toggle matches checkout  
- [ ] Homepage collections wired (`docs/phase-9/MERCHANDISING.md`)  



### 16.3 Marketing / analytics

- [ ] Meta Pixel / TikTok / GA4 as needed — `docs/phase-9/ANALYTICS.md`  
- [ ] Google Search Console  
- [ ] Sitemap submitted  
- [ ] Theme analytics events verified (ATC / checkout)  



### 16.4 Ops

- [ ] COD confirmation process trained  
- [ ] Return window process matches theme copy (7 days)  
- [ ] Inventory sync process  
- [ ] UAT script completed (`docs/phase-9/UAT-SCRIPT.md`)  
- [ ] Rollback backup theme retained (`docs/phase-9/ROLLBACK.md`)  
- [ ] Launch sign-off recorded (`docs/phase-9/LAUNCH-SIGNOFF.md`)  
- [ ] Post-launch monitoring started (`docs/phase-9/MONITORING.md`)  

---



## 17. Risks, assumptions & decisions



### 17.1 Assumptions

- Catalog will emphasize multi-category general merchandise (home, kitchen, beauty, gadgets, fashion), not pure fashion editorial.  
- English UI is acceptable for MVP with simple wording.  
- COD will be offered; theme messaging must stay accurate to Admin config.  
- Team will create original Liquid/CSS/JS (not redistribute Hongo).



### 17.2 Risks


| Risk                               | Mitigation                                   |
| ---------------------------------- | -------------------------------------------- |
| Over-scoping Hongo feature set     | Strict P0/P1; one card style; no lookbook v1 |
| Low-trust if fake urgency overused | Urgency blocks off by default                |
| Performance on low-end Androids    | Budgets + limited JS + SVG icons             |
| Design drift from sheet            | Phase exits require design QA                |
| Licensing issues                   | Original implementation only                 |




### 17.3 Open decisions (resolve in Phase 0)

**Resolved — see** `docs/phase-0/DECISIONS.md`**:**

1. Exact font pair finalization → **Plus Jakarta Sans** (body + display)
2. Wishlist native vs app → **Native localStorage** (Phase 7); app optional later
3. Filter Ajax vs full reload → **Ajax Facet API** (Phase 5) with page fallback
4. Soft launch (password) vs full publish → **Password / soft launch** first
5. Whether Track Order is page-only or app-powered → **Page + app block slot**

---



## 18. Appendix



### A. Design token quick reference

```css
:root {
  --color-primary: #E85D04;
  --color-primary-dark: #C44700;
  --color-secondary: #176B5B;
  --color-highlight: #FFC107;
  --color-background: #FFFDF9;
  --color-surface: #FFFFFF;
  --color-text: #1F2421;
  --color-text-muted: #66736D;
  --color-sale: #E94F37;
  --color-offer: #F59E0B;
  --radius-md: 12px;
  --radius-pill: 999px;
  --hero-gradient: linear-gradient(135deg, #FFC107 0%, #E85D04 100%);
}
```



### B. Homepage section order (recommended default)

1. `announcement-bar` (section group / header group if using)
2. `header`
3. `hero-banner`
4. `trust-strip`
5. `category-icons`
6. `featured-collection` (Trending Deals)
7. `deal-of-the-day`
8. `promo-banner`
9. `featured-collection` (Best Sellers)
10. `newsletter`
11. `footer`
12. `mobile-sticky-nav`
13. `cart-drawer`



### C. Reference → Payedaar feature matrix (summary)


| Reference capability        | Payedaar action                    |
| --------------------------- | ---------------------------------- |
| Multi product card styles   | Single Payedaar card               |
| Slideshow-4 fashion         | Hero deals banner                  |
| Icon-with-text              | Pakistan trust strip               |
| Shop-by-category            | Circular category icons            |
| Deal-of-the-day             | Keep & restyle                     |
| Lookbook                    | Drop v1                            |
| Mini-cart / free shipping   | Keep & localize PKR                |
| Mobile sticky menu          | Keep; map to Payedaar IA           |
| Wishlist / compare          | Wishlist P1; compare optional drop |
| Reviews hooks               | Keep                               |
| Purchase code / vendor lock | Remove entirely                    |




### D. Phase timeline (suggestive)


| Phase               | Suggested duration |
| ------------------- | ------------------ |
| 0 Discovery         | 2–3 days           |
| 1 Tokens & shell    | 4–6 days           |
| 2 Header/nav/footer | 5–7 days           |
| 3 Card + cart       | 5–7 days           |
| 4 Homepage          | 5–7 days           |
| 5 Collection/search | 5–7 days           |
| 6 PDP               | 6–8 days           |
| 7 Secondary pages   | 4–6 days           |
| 8 Hardening         | 4–6 days           |
| 9 UAT & launch      | 4–7 days           |


*Calendar depends on team size; phases are sequential for acceptance clarity but engineering can parallelize design assets.*

### E. Source references in this repo


| Path                                   | Role                                               |
| -------------------------------------- | -------------------------------------------------- |
| `referance-theme/clothing/`            | Professional structure & UX pattern reference      |
| `referance-design-and-color-sheet.PNG` | Color, component, and Pakistan trust visual system |
| `payedaar-theme-implementation.md`     | This plan                                          |


---



## Document control


| Field        | Value                                                        |
| ------------ | ------------------------------------------------------------ |
| Owner        | Payedaar storefront team                                     |
| Last updated | 2026-09-18                                                   |
| Next action  | Complete Phase 0 sign-off, then begin Phase 1 implementation |


**End of implementation plan.**
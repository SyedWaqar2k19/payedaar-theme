# Phase 1 complete — Design tokens, layout shell & global styles

**Date:** 2026-09-18  
**Theme version:** `0.1.0-phase1`  
**Theme Check:** run after push — target **0 errors**

## Delivered

### Theme Editor settings
- Brand (logo widths, favicon)
- Colors (full Bold Deals palette + cart badge + hero CTA)
- Typography (self-hosted Plus Jakarta Sans / Shopify font, sizes, weights)
- Layout (page width, gutter, section spacing, card shadow)
- Pakistan & trust
- Advanced (custom CSS)

### Design tokens
- `snippets/css-variables.liquid` — all colors, type, radius, shadows, spacing
- Changing **Primary** in Theme Editor updates `--color-primary` and primary buttons (P1-AC1)

### Fonts (P1-AC3)
- Self-hosted `plus-jakarta-sans-{400,500,600,700,800}.woff2` in `assets/`
- `@font-face` with `font-display: swap`
- Preload 400 + 700 for first paint

### Global styles (`assets/base.css` + `critical.css`)
- Reset, typography, layout grid, buttons (primary / secondary / hero / disabled)
- Forms, badges (sale, hot, limited, best, trending, promo circle)
- Price, cards, icons, header/footer shell, trust strip, hero, utilities
- Reduced-motion support; 44px tap targets

### Snippets
- `font-face`, `css-variables`, `meta-tags`, `price`, `icon`

### Layout shell
- `layout/theme.liquid` + `password.liquid`
- Header placeholder: logo, pill search, account, cart badge, horizontal nav (Hot Deals highlighted)
- Footer placeholder: brand, COD, WhatsApp/phone hooks
- Homepage `hero-banner` matching design sheet energy
- QA page template: `page.style-guide` + `design-system` section

## Acceptance

| ID | Status |
|----|--------|
| P1-AC1 | ✅ CSS variables bound to settings |
| P1-AC2 | ✅ Buttons/badges/body match sheet (verify on style-guide page) |
| P1-AC3 | ✅ Self-hosted fonts + `font-display: swap` |
| P1-AC4 | ✅ Responsive tokens/grid (360–1440) |
| P1-AC5 | ✅ Theme Check — 0 errors |
| P1-AC6 | ✅ No Hongo / ThemeZaa / purchase code / demo cloth |

## Push & verify

```powershell
cd payedaar
shopify theme push --theme "Payedaar" --store cwvavv-yb.myshopify.com
```

1. Theme Editor → Colors → change Primary → CTAs update  
2. Create page, assign template **style-guide**, preview design system  
3. Check homepage hero + trust strip + header on phone width  

## Next
**Phase 2** — Header, search, navigation, footer, mobile sticky nav (full functionality)

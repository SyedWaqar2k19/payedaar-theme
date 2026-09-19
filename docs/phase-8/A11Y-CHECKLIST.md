# Phase 8 — Accessibility checklist

**Theme:** Payedaar `0.8.0-phase8`  
**Target:** Lighthouse Accessibility ≥ 90 · keyboard purchase path (P8-AC2, P8-AC4)

## Automated / structural

| Check | Status |
|-------|--------|
| Skip link → `#MainContent` | ✅ Present; focus styles in `base.css` |
| Main landmark `role="main"` + `tabindex="-1"` | ✅ |
| Focus-visible on links, buttons, inputs, summaries | ✅ |
| `prefers-reduced-motion` respected | ✅ (`base.css`) |
| Form labels on customer / contact forms | ✅ Phase 7 |
| Cart drawer / predictive search ARIA | ✅ prior phases |
| Cookie dialog `role="dialog"` + labelled title | ✅ |
| Breadcrumb `nav` + `aria-label` | ✅ Phase 8 |
| Product / FAQ headings (single H1 per template) | ✅ hero / page headers |

## Manual keyboard path (P8-AC4)

Run on theme preview (desktop keyboard only):

1. **Skip link** — Tab once → Enter → focus lands in main  
2. **Search** — Open predictive search, arrow/type query, Enter to search results  
3. **Product** — Tab to a product card → Enter → PDP  
4. **Variant** — Tab through option inputs; price/ATC update without mouse  
5. **ATC** — Enter on Add to cart → drawer opens; focus manageable; Esc closes  
6. **Checkout** — Tab to Checkout in drawer → activates checkout URL  

Record pass/fail in QA report.

## Screen reader / axe notes

- Run axe DevTools on home, collection, PDP, cart drawer open.  
- Confirm wishlist buttons expose `aria-pressed` after toggle.  
- Confirm sold-out ATC is `disabled` with clear text.  
- Confirm mobile sticky ATC does not trap focus when hidden (`aria-hidden` / CSS).

## Color / contrast

- Primary CTA `#E85D04` on white — verify WCAG AA for button text.  
- Sale badge / muted text — spot-check on cream background `#fffdf9`.

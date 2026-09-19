# Reference theme policy (read-only)

## Path

`referance-theme/clothing/` — Hongo clothing demo (ThemeZaa), used **only** as UX / architecture reference.

## Rules

1. **Do not modify** files under `referance-theme/` for Payedaar features.
2. **Do not copy** proprietary Liquid, JS, CSS, or assets into `payedaar/`.
3. **Do** study patterns: section schemas, cart drawer UX, product blocks, filters, deals, mobile sticky nav.
4. **Do** implement original Payedaar code under `payedaar/` using the design sheet + implementation plan.
5. Pull requests that change `referance-theme/**` should be rejected unless fixing accidental local corruption (restore from clean copy).

## Verification (P0-AC5)

```bash
# From repo root — should show no local edits to reference theme once committed
git status referance-theme
```

Expected: clean / no modifications during Payedaar development.

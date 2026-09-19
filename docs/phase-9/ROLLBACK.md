# Phase 9 — Rollback plan (P9-AC7)

## Principle

Keep the **previous live theme unpublished** (or as a duplicate) so rollback is one click.

## Before publish

1. Note current live theme name + ID: ________________  
2. Duplicate it: Admin → Online Store → Themes → **… → Duplicate** → rename `Payedaar-backup-YYYY-MM-DD`.  
3. Confirm Payedaar preview UAT passed (`UAT-SCRIPT.md`).  
4. Record publish time in `LAUNCH-SIGNOFF.md`.

## Publish Payedaar

1. Themes → Payedaar → **Publish**.  
2. Do **not** delete the previous theme.  
3. Soft launch: leave password ON; full launch: disable password.

## Rollback (emergency)

1. Themes → previous backup theme → **Publish**.  
2. Verify homepage + checkout.  
3. Notify stakeholders; file incident notes (what broke, when).  
4. Fix Payedaar on unpublished copy; re-UAT; re-publish.

## CLI note

```powershell
# List themes
shopify theme list --store cwvavv-yb.myshopify.com

# Push only to unpublished Payedaar (never --live unless intentional)
shopify theme push --theme "Payedaar" --store cwvavv-yb.myshopify.com
```

## Data note

Rollback restores **theme** only — products, orders, apps, and payments stay. Theme settings in `settings_data` on the live theme are independent of the backup’s saved customizer state; keep a screenshot or export of critical Theme Editor settings if heavily customized.

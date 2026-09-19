# Phase 0 — Acceptance criteria tracker

| ID | Criteria | Status | Evidence |
|----|----------|--------|----------|
| P0-AC1 | Store currency is PKR; primary market Pakistan | ⏳ Merchant action | `STORE-BASELINE.md` checklist |
| P0-AC2 | Unpublished Payedaar theme exists and `shopify theme dev` runs | ⏳ Requires store auth | Theme skeleton in `payedaar/`; steps in `PUSH.md`. Local Theme Check run documented in `PHASE-0-COMPLETE.md` |
| P0-AC3 | Metafield definitions created (or ticketed with owners) | ✅ Spec ready / apply to store | `METAFIELDS.md`, `metafield-definitions.json`, `.graphql` |
| P0-AC4 | Stakeholders signed off on color tokens, IA, and phase plan | ✅ Defaults locked | `DECISIONS.md`, `IA-AND-HOMEPAGE-WIRE.md` — stakeholder signature boxes remain for formal OK |
| P0-AC5 | Reference theme remains unmodified source of truth | ✅ Policy + structure | `REFERENCE-POLICY.md`; reference not edited in Phase 0 |

## Deliverables

| Deliverable | Status |
|-------------|--------|
| Shopify store baseline configured | Checklist delivered (`STORE-BASELINE.md`) — merchant completes Admin toggles |
| Empty theme skeleton (CLI-ready) | ✅ `payedaar/` |
| Asset checklist for design team | ✅ `ASSET-CHECKLIST.md` |
| Implementation doc / phase plan approved for kickoff | ✅ Decisions locked; plan remains source of truth |

## Exit

Phase 0 engineering exit is **ready for Phase 1** when:

1. This tracker’s engineering items are done (AC3–AC5 + skeleton).
2. Merchant has started AC1 Admin config (can finish in parallel with Phase 1).
3. First `theme push --unpublished` attempted when store credentials available (AC2).

**Next phase:** Phase 1 — Design tokens, layout shell & global styles.

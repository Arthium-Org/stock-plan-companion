# Requirements: Stock Plan Companion — Marketing Site

**Defined:** 2026-07-06
**Core Value:** A visitor can understand what the app does and download the correct, working build after registering — with every registration reliably captured (no monthly submission cap).

## v1 Requirements

Launch-polish scope. Each maps to a roadmap phase.

### Downloads

- [x] **DL-01**: Visitor can download the signed macOS (Apple Silicon / arm64) DMG after registering, via a button clearly labeled "macOS (Apple Silicon)"
- [x] **DL-02**: The macOS download resolves to the DMG asset published in a GitHub Release of `Arthium-Org/stock-plan-companion-app`
- [x] **DL-03**: Windows download appears as a non-broken "coming soon" state until the `.exe` is published
- [x] **DL-04**: Download URLs (tag + filename) live in a single config location, updatable per release without editing page logic

### Registration

- [ ] **REG-01**: Visitor can submit their email through the existing inline registration form
- [x] **REG-02**: Each submission is recorded to a Google Sheet via a Google Apps Script endpoint (no monthly submission cap)
- [ ] **REG-03**: On successful submission, the download options are revealed (existing behavior preserved)
- [x] **REG-04**: A failed submission shows an inline error without discarding the entered email (existing behavior preserved)

### Links & Contact

- [ ] **LINK-01**: Footer contact email links to `contact@arthium.org`
- [ ] **LINK-02**: All repository links point to `github.com/Arthium-Org/stock-plan-companion-app`
- [ ] **LINK-03**: The prominent GitHub call-to-action near Register/hero is removed
- [ ] **LINK-04**: A single GitHub repository link remains in the footer

## v2 Requirements

Deferred to a future cycle.

### Downloads

- **DL-05**: Windows `.exe` download wired to a live GitHub Release asset (once the Windows build is published)

### Registration

- **REG-05**: Automated confirmation email to registrants ("thanks for registering / here's your download")

## Out of Scope

| Feature | Reason |
|---------|--------|
| Hard-gating downloads (private releases / signed URLs) | Repo is public — releases stay reachable; friction-only footer link is accepted for launch |
| Swapping the light landing site for the `/new-12345` dark theme | Separate effort, not part of launch polish |
| Building the Windows `.exe` | Handled outside this site work; site only accommodates it |
| Intel macOS build | Only an arm64 DMG exists |
| Analytics / error tracking (GA, Plausible, Sentry) | Not required for launch |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| DL-01 | Phase 1 | Complete |
| DL-02 | Phase 1 | Complete |
| DL-03 | Phase 1 | Complete |
| DL-04 | Phase 1 | Complete |
| REG-01 | Phase 2 | Pending |
| REG-02 | Phase 2 | Complete |
| REG-03 | Phase 2 | Pending |
| REG-04 | Phase 2 | Complete |
| LINK-01 | Phase 3 | Pending |
| LINK-02 | Phase 3 | Pending |
| LINK-03 | Phase 3 | Pending |
| LINK-04 | Phase 3 | Pending |

**Coverage:**

- v1 requirements: 12 total
- Mapped to phases: 12 (Phase 1: 4, Phase 2: 4, Phase 3: 4)
- Unmapped: 0 ✓

---
*Requirements defined: 2026-07-06*
*Last updated: 2026-07-06 after roadmap creation*

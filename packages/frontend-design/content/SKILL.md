---
name: frontend-design
version: 0.2.0
description: >-
  Frontend design guidance: anti-patterns, C.L.E.A.R., CCD, product-UI craft,
  and surface-fit lenses. Use when building or reviewing UI components, pages,
  or flows.
---

# Frontend Design

Combines C.L.E.A.R., CCD, and anti-patterns inspired by [Impeccable](https://github.com/pbakaus/impeccable), plus product-UI craft (system, not screenshot).

Read `.cursor/DESIGN_PRINCIPLES.md` for project-specific rules.

**Craft playbook:** `reference.md` in this skill (failure classes, extra checks, mobile/desktop/web, finish gate).

## Anti-patterns (avoid)

| Category | Don't | Do |
|----------|-------|-----|
| **Typography** | Inter, Arial, Roboto, system defaults as the brand voice | Distinctive, readable fonts chosen for the product |
| **Color** | Gray text on colored bg; pure #000/#fff by default | Tinted neutrals; shade of background |
| **Layout** | Cards in cards; wrap everything in cards | Flatten hierarchy; not everything needs a container |
| **Motion** | Bounce/elastic easing; animate width/height | ease-out-quart/quint; transform + opacity |
| **General** | Glassmorphism everywhere; every button primary | Purposeful effects; clear hierarchy |
| **Media chrome** | Icons dropped on a photo with no chip/scrim | Overlay controls own their contrast on any asset |
| **Copy chrome** | Redundant “Price:”, ALL CAPS primary buttons, noisy badges | Let currency speak; one idea per badge; refined CTA |

## Defaults (override via DESIGN_PRINCIPLES)

- One primary CTA per section
- Feedback on every action (loading, success, error)
- Touch targets sized for the product’s devices
- Accessible contrast and focus states
- Design the **catalog and states**, not one pretty frame
- Trust, cost/status, and identity sit in one first-read cluster when the job is to decide
- Pair controls that are one decision (quantity + commit); put the consequence on the button

## Focused command passes

When installed: `ui-critique`, `ui-polish`, `ui-clarify`, `ui-visual-system`, `ui-decision-flow`, `ui-surface-fit`.

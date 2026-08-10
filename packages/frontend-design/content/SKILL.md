---
name: frontend-design
version: 0.1.0
description: >-
  Frontend design guidance. Anti-patterns, C.L.E.A.R., CCD. Use when building
  or reviewing UI components, pages, or flows.
---

# Frontend Design

Combines C.L.E.A.R., CCD, and anti-patterns inspired by [Impeccable](https://github.com/pbakaus/impeccable).

Read `.cursor/DESIGN_PRINCIPLES.md` for project-specific rules.

## Anti-patterns (avoid)

| Category | Don't | Do |
|----------|-------|-----|
| **Typography** | Inter, Arial, Roboto, system defaults as the brand voice | Distinctive, readable fonts chosen for the product |
| **Color** | Gray text on colored bg; pure #000/#fff by default | Tinted neutrals; shade of background |
| **Layout** | Cards in cards; wrap everything in cards | Flatten hierarchy; not everything needs a container |
| **Motion** | Bounce/elastic easing; animate width/height | ease-out-quart/quint; transform + opacity |
| **General** | Glassmorphism everywhere; every button primary | Purposeful effects; clear hierarchy |

## Defaults (override via DESIGN_PRINCIPLES)

- One primary CTA per section
- Feedback on every action (loading, success, error)
- Touch targets sized for the product’s devices
- Accessible contrast and focus states

## Focused command passes

When installed: `ui-critique`, `ui-polish`, `ui-clarify` (and further UI commands as added).

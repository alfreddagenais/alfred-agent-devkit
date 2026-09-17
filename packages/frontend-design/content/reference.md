# Product UI craft

Read this with `SKILL.md` when designing or reviewing screens. Brand tokens live in `.cursor/DESIGN_PRINCIPLES.md`.

Apply the **thinking**, not marketing copy. Sources:

- [uxpeak+](https://www.uxpeak.com/) — junior vs senior decisions; spacing, hierarchy, contrast, polish; conversion and retention
- Product-page teardown: [How to design product pages users love](https://www.youtube.com/watch?v=GGg61sdEjeI)
- Process (not personality) from [agency-agents design](https://github.com/msitarzewski/agency-agents): finish gate, five-second test, system-first UI

No dark patterns. No fake urgency, confirm-shaming, hidden fees, or bait-and-switch.

## 1. Design the system, not one screenshot

A frame that only works with one photo, one SKU, or one window size is a mockup.

- Chrome on media (back, save, share, close) must **carry its own contrast**: chip, scrim, or hairline — never luck from a dark photo. Bright, busy, and pale assets will follow.
- Hero media must survive dark, bright, busy, simple, lifestyle, and studio shots.
- Grid/catalog images share crop, lighting, and background so the set feels like one product, not a collage.
- Show the **actual offer** (sold by weight ≠ one unit in hand; a session ≠ a single decorative still).
- Tokens, spacing, type roles, and icon weight are shared. One-off hex and mixed icon styles are debt.

Senior work is catalog-ready. Junior work is one pretty rectangle.

## 2. Fifteen failure classes (detail / commit screens)

Use on any screen that names an object and asks for a commit (product, plan, import, session, track).

| # | Failure | Why it hurts | Fix |
|---|---------|--------------|-----|
| 1 | Icons lost on media | The next asset will be light | Chip/scrim + outline so icons survive any image |
| 2 | Hero fights the offer | Busy crop, wrong subject, fake backdrop, or unique background that breaks the catalog | Honest, object-first, **catalog-consistent** media |
| 3 | Alignment drift | Feels untrustworthy even if unnamed | One inset for text, figures, and actions |
| 4 | Color shouts | Hierarchy dies; the object is overpowered | Palette supports the object; chrome quieter than content |
| 5 | Type salad | Competing voices | One family; hierarchy via size, weight, color, line-height |
| 6 | Cramped or noisy labels | “20% off discount” + icon | Letter-space small caps; badge = **one** idea |
| 7 | Title shouts or hides | Users cannot scan what they get | Strong, not screaming; balanced with the page |
| 8 | Tight body copy | Feels cheap; hard to read | Real line-height; body slightly quieter than titles |
| 9 | Trust far from identity | Proof is a scavenger hunt | Title + rating/status (+ cost) in **one first-read cluster** |
| 10 | Rainbow / mixed icons | Benefits dominate the screen | One icon family, one weight, restrained color |
| 11 | Heavy dividers | Page feels chopped into blocks | Hairline rules — or spacing alone |
| 12 | Gaps with no relationship | Sections float apart | Tighten until groups read as one story |
| 13 | Labeling the obvious | “Price:” next to a currency amount | Currency already speaks; if you label price, label quantity too — usually drop both |
| 14 | Mutable state in the title | Name says “1 kg” while the stepper changes qty | Title = what it is; qty/unit live in the buying row; **show cost early** |
| 15 | CTA shouts and is orphaned | ALL CAPS brick; qty far from Add | Refined primary; qty beside action; unit in the stepper; **total (or count) on the button** |

Go further when the page is long:

- Detail as a sheet/card over the hero so the object stays in view while reading.
- Sticky identity in the top bar after the hero scrolls away.
- Sticky action region (qty + commit) so late deciders can still act.
- Shortcuts for common quantities/choices from **real usage**, plus a custom control.

## 3. Extra checks (easy to miss)

**Attention and trust**

- Five-second test: What is this? Is it for me? What should I do?
- First-read object matches the user’s job (not a decorative hero).
- Proof, status, and cost sit next to the object they vouch for.
- Do not hide cost (or irreversible consequence) until after effort.
- Confirm what the click does: quantity, total, destructive result.

**Controls**

- Pair controls that are one decision (qty + buy, filter + apply).
- Defaults match the most common real choice, not “1” out of habit.
- When quantity varies, show **unit price and total**.
- Steppers need an accessible name and the unit **inside** the control.
- Do not use color alone for meaning (status, organic, error, live).

**Chrome vs content**

- Overlays, badges, and gradients work in light and dark, and at 200% zoom.
- Related items and upsells must not out-shout the primary action.
- ALL CAPS is for rare wayfinding, not primary buttons.
- Long titles truncate without colliding with badges; provide a real full-name path.

**States, motion, media**

- Loading, empty, error, offline, denied: same skeleton, honest next step.
- Reduced motion: no essential information only in animation.
- Image `alt` names the **offer**, not “photo of fruit”.
- Skeletons match the layout so the page does not jump.

**Retention (empty / return)**

- Empty states teach the next action, not a dead illustration.
- Onboarding uses the user’s objects, not a tour of chrome.
- Re-entry: last session, last file, last venue stays findable.

## 4. Surface fit

### Mobile

- Thumb zone: primary action in easy reach; destructive actions harder to fat-finger.
- ≥44×44 pt targets; overlay icons get a chip, not a 16px glyph on a photo.
- Safe areas (notch, home indicator); sticky bars must not cover content or gestures.
- Preserve the **scan key** when stacking (status, price, next action) — do not turn every desktop column into equal cards.
- Numeric keypad for quantity; avoid nested scroll traps.

### Desktop (web app or native shell)

- Keyboard: visible focus, logical tab order, shortcuts for high-frequency work.
- Hover is enhancement, not the only affordance.
- Expert tools may be denser; still one primary action per region.
- Resize: no clipped CTAs, no overlapping sticky headers.
- If the shell can be touch (tablet, Tauri), keep 44px on primary controls.

### Web (responsive)

- F/Z scan: identity, trust, cost, action in the first viewport when the job is to decide.
- Images must not shift layout (`width`/`height` or `aspect-ratio`).
- Sticky mobile CTA vs desktop sidebar: same decision, different placement.
- The same React tree may run in a phone browser and in a desktop shell — do not assume a cursor.

## 5. Lenses (sub-specializations)

Pick the lens that matches the ask. Do not invent extra personalities.

| Lens | Command (when installed) | Question |
|------|--------------------------|----------|
| **Visual system** | `/ui-visual-system` | Does chrome, type, color, media, and iconography survive the next asset and the next screen? |
| **Decision flow** | `/ui-decision-flow` | Can they understand the object, trust it, know the cost, and commit without uncertainty? |
| **Surface fit** | `/ui-surface-fit` | Does the same job work on mobile, desktop, and web without losing the scan key? |
| **Copy honesty** | `/ui-clarify` | Do labels match behavior? Misleading title? Redundant “Price”? |
| **Polish** | `/ui-polish` | Alignment, spacing, states, noise. |
| **Critique / finish** | `/ui-critique` | Hierarchy + C.L.E.A.R., then PASS/HOLD. |

## 6. Five-second + scroll

Skip theatrical inner monologues. Do a short user pass:

1. **Job:** What did they come to finish?
2. **Five seconds (first viewport):** What is this? Is it for me? What should I do?
3. **Scroll:** At each major block, can they still name the object and reach the action?
4. **Enough moment:** Where would they commit or leave? Is the commit control present then?

If the primary action is not reachable without losing context, add sticky identity and/or a sticky action region.

## 7. Finish gate

Return a decision, not a vibe.

```text
# UI finish gate — [screen]
Decision: PASS | HOLD
Product lens: [user + job + first-read object]
Evidence: [what is on screen]
Required before PASS: [observable changes]
Keep: [choices that already serve the job]
```

**HOLD** if: interchangeable “any SaaS” layout; competing CTAs; overlay contrast depends on one photo; cost/trust missing from the first read when the job is to decide; or a shipped surface (mobile/desktop) breaks the job.

## 8. Junior vs senior vs staff

Using a generator is not the edge. **Choosing** is.

| Level | Typical miss | Better move |
|-------|----------------|-------------|
| Junior | Makes this one frame pretty | Contrast luck, type salad, ALL CAPS CTA |
| Mid | Cleans the frame | Grid, quieter color, rating near title |
| Senior | Designs the catalog and the states | Media system, trust cluster, qty + total + sticky commit |
| Staff | Designs the journey | Shortcuts from real data, sticky context, same system on every SKU and surface |

When generating variants, produce two or three, then pick with this table — do not ship the first pretty frame.

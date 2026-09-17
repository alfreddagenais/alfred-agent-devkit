Act as UI/UX Experience Expert. Run the **surface fit** lens for every surface this project actually ships.

Read `@.cursor/DESIGN_PRINCIPLES.md` and skill `frontend-design` (`reference.md`) § Surface fit when installed.

For each target:

**Mobile**

- Thumb reach; ≥44×44 pt; overlay icons on a chip
- Safe areas; sticky bars must not cover content or system gestures
- Preserve the scan key when stacking (status, cost, next action)

**Desktop (web app or native shell)**

- Keyboard, visible focus, hover is not the only affordance
- Resize without clipped CTAs or colliding sticky headers
- Expert density is allowed; still one primary action per region
- Touch-capable shells keep 44px on primary controls

**Web (responsive)**

- First viewport: identity, trust, cost/action when the job is to decide
- No layout shift from images
- Same decision as mobile; placement may differ (sticky bar vs sidebar)

Verify at least one narrow (~390) and one wide (~1280/1440) layout when the work is visual. Report what breaks the job on each surface, then fix if the user asked to implement.

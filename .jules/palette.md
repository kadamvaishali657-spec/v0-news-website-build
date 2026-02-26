## 2026-02-26 - Improving Interactivity and Accessibility with Standard UI Components

**Learning:** Replacing manual hover-based dropdowns with accessible `DropdownMenu` components (like Radix-based ones) and adding toast feedback for asynchronous actions (like saving or copying links) significantly improves both accessibility (keyboard/screen reader support) and the overall user sense of agency. Manual `group-hover` menus are often inaccessible and provide no feedback on touch devices.

**Action:** Always prefer accessible component primitives for menus and provide visual/auditory feedback (toasts) for destructive or background-running actions.

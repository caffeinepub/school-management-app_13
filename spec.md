# School Management App — AIC

## Current State
App uses a deep navy (hue ~260) + gold OKLCH theme. All role cards, headers, buttons, and components are styled with muted navy backgrounds and gold accents. The UI is functional but the blue feels dark/muted.

## Requested Changes (Diff)

### Add
- Brighter, more vivid blue tones to backgrounds, cards, and navigation elements
- Stronger gold contrast on buttons, badges, borders, and highlights
- Blue gradient headers in all dashboards (PrincipalDashboard, TeacherDashboard, StudentView, PublicTeacherSchedule)
- Gold shimmer on primary headings already exists; enhance usage

### Modify
- index.css: Update OKLCH tokens — shift background/card to a richer royal blue (hue ~240, higher chroma), keep gold primary/accent (hue ~80-85)
- Increase muted-foreground lightness for better visibility
- Button and badge colors: primary gold, secondary blue
- Role cards on home page: blue card with gold icon borders and gold badge/hint text
- Tab active states in dashboards: gold indicator on blue background

### Remove
- Nothing removed

## Implementation Plan
1. Update OKLCH CSS tokens in index.css — royal blue backgrounds, vivid gold accents
2. Ensure all dashboards and components inherit new colors via CSS variables (no hardcoded colors to change)
3. Add blue gradient utility class for headers
4. Validate build

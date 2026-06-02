# Pitch Lock flash artwork — 9∶16 master spec

Source-of-truth canvas for `pitchlock-flash.mp4`. Production intro uses **`object-fit: contain`** — the full frame is always visible; letterboxing uses black (and optional baked edge glow). **Never use `cover`** on this asset; cover crops logo and portal buttons on several viewports.

## Why rebuild from ~1080×1215

| Legacy asset | New master |
|--------------|------------|
| ~1080 × 1215 (~8∶9) | **2160 × 3840** (9∶16) |
| UI fills frame; feels tight on desktop | UI cluster centered; **~35% more negative space** between elements |
| Works on phone only “by accident” | **Mobile-first** + premium on tablet/desktop |

## Master canvas

| Property | Value |
|----------|--------|
| Aspect ratio | **9∶16** |
| Target resolution | **2160 × 3840** px |
| Color space | sRGB |
| Video | H.264, yuv420p, even dimensions |

**Designer template:** `public/brand/flash-artwork-master-9x16.svg`  
**Creative brief:** `docs/flash-artwork-creative-brief.md`

## Safe zone (70% centered)

| | Fraction | Pixels @ 2160×3840 |
|---|----------|---------------------|
| Edge inset | 15% each side | 324 px |
| Safe size | 70% × 70% | **1512 × 2688** |
| Safe origin | (15%, 15%) | **(324, 576)** |

Normalized: `x ∈ [0.15, 0.85]`, `y ∈ [0.15, 0.85]`

## Content cluster (+35% negative space)

Stack all critical UI on the **vertical centerline**, grouped near **y ≈ 0.50** (not top-heavy). Internal gaps between logo → tagline → status → portals should be **~35% larger** than the legacy 1080×1215 spacing.

| Element | Target center (x, y) | Max width (of safe) |
|---------|----------------------|---------------------|
| Logo | (0.50, 0.36) | ~48% |
| Pitch. Protect. Progress. | (0.50, 0.44) | ~70% |
| Status labels | (0.50, 0.52) | ~80% |
| Investor Portal | (0.34, 0.62) | ~32% pill |
| Presenter Portal | (0.66, 0.62) | ~32% pill |

Use ~**45–50%** of safe-zone height for the stack; remaining safe area is intentional padding (not filler text).

## Outer 15% — atmospheric only

Cyan and purple **energy fields**, particles, soft vignette. No logos, buttons, or readable status copy in corners or edges.

## Hotspot defaults (code — re-tune after MP4)

`flash-portal-hit-layout.ts`:

- Investor: `x: 0.17, y: 0.585, w: 0.30, h: 0.07`
- Presenter: `x: 0.53, y: 0.585, w: 0.30, h: 0.07`

## Display contract (app)

- `object-fit: contain; object-position: center`
- `FLASH_MEDIA_ASPECT = 9/16`
- `computeContainPortalLayout()`

### QA viewports

| Viewport | Contain behavior |
|----------|------------------|
| 390×844, 430×932 | Full width; small top/bottom bars |
| 768×1024, 1024×1366 | Full width; vertical letterbox |
| 1440×900, 1920×1080, 2560×1440, 3440×1440 | Full height; side letterbox |

## Export checklist

- [ ] Comp **2160×3840**, 9∶16
- [ ] +35% negative space vs legacy; cluster centered in safe zone
- [ ] All critical UI inside 70% safe zone
- [ ] Cyan/purple atmosphere in outer 15% only
- [ ] Replace `public/brand/pitchlock-flash.mp4`
- [ ] Re-tune hotspots; QA all viewports above

## Colors

Black, obsidian, white, muted white, cyan `#00F0FF`, purple `#9D00FF` — **no gold**.

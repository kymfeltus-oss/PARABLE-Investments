# Pitch Lock flash — creative brief (master rebuild)

**For:** Motion / static artwork export → `public/brand/pitchlock-flash.mp4`  
**App display:** `object-fit: contain` only (never `cover` — cover crops logo and buttons on many devices)

---

## Problem with the current asset

The live loop is closer to **1080 × 1215** (~**8∶9**), not **9∶16**.

| | Legacy (now) | New master |
|---|-------------|------------|
| Size | ~1080 × 1215 | **2160 × 3840** |
| Aspect | ~0.89 (squarish) | **0.5625 (9∶16)** |
| Feel on phone | Acceptable | Premium launch screen |
| Feel on laptop/desktop | **Cramped, oversized UI** | Calm, cinematic letterbox |

On wide screens, `contain` scales the short frame to full height; a squat asset fills the screen with huge UI. A tall **9∶16** master adds vertical breathing room and keeps the center cluster elegant.

---

## Master canvas (non-negotiable)

- **2160 × 3840 px**
- **9∶16** aspect ratio
- **Mobile-first** composition, vertically centered
- Maintain current Pitch Lock branding (no gold)

---

## Layout rules

### 1. Safe zone — center 70%

All important content lives in the **centered 70% × 70%** rectangle:

- Inset **15%** from every edge
- At 2160×3840: rectangle **(324, 576)** size **1512 × 2688**

**Required inside safe zone:**

- Pitch Lock logo
- **Pitch. Protect. Progress.**
- Status labels
- Investor Portal button
- Presenter Portal button

**Never** place critical text or CTAs in corners or in the outer 15% band.

### 2. Increase negative space by ~35%

Compared to the legacy 1080×1215 layout:

- **+35% more space** between logo, tagline, status row, and portal buttons
- Keep the **content cluster vertically centered** in the safe zone (not pinned to the top)
- Use only ~**45–50%** of safe-zone height for the UI stack; the rest is intentional calm space inside the safe area
- Portal pills slightly smaller relative to canvas — premium, not “dashboard cramped”

### 3. Atmospheric edges (outer 15%)

Outer band is **energy field only**:

- Soft **cyan** (#00F0FF) and **purple** (#9D00FF) nebula, particles, light trails
- Dark obsidian / black falloff toward edges
- No readable copy, no buttons, no logo fragments in corners
- Must still look intentional when `contain` adds black bars on ultrawide desktops

### 4. Premium launch-screen tone

- One master asset that scales on: 390×844, 430×932, 768×1024, 1024×1366, 1440×900, 1920×1080, 2560×1440, 3440×1440
- Full frame always visible; app letterboxes with black (and subtle glow if baked into side bleed)
- Feels like entering a **private app**, not a cropped poster

---

## Designer deliverables

1. **After Effects / Premiere / etc.** — comp **2160×3840**, 9∶16  
2. **MP4** — replace `public/brand/pitchlock-flash.mp4` (H.264, even dimensions)  
3. Optional **PNG** still at 2160×3840 for marketing  
4. Use template: `public/brand/flash-artwork-master-9x16.svg`  
5. Full spec: `docs/flash-artwork-9x16-spec.md`

After export, engineering re-measures portal button positions in `src/components/landing/flash-portal-hit-layout.ts`.

---

## App contract (already implemented)

```css
object-fit: contain;
object-position: center center;
```

```ts
FLASH_MEDIA_ASPECT = 9 / 16;
computeContainPortalLayout();
```

Do **not** switch the intro back to `cover`.

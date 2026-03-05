# mialyk // portfolio — Art Direction & Memory
> Last updated: March 2026 · Version 2.0 · Pre-deploy snapshot

---

## 1. Concept & Tone

**Core idea:** A playable portfolio. The homepage is a game — the user *discovers* work by playing, not scrolling.

**Aesthetic:** 8-bit retro-futurism meets editorial minimalism.
- Game canvas = playful, pixel-art, warm orange
- UI chrome (nav, popup, footer) = clean, monospaced, restrained
- The contrast is intentional — game world vs. professional frame

**Personality:** Creative Lead who codes. Warm but precise. Playful but not childish.

---

## 2. Colour System

| Token | Hex | Role |
|---|---|---|
| `--white` | `#FEFEFE` | Background, surfaces (70%) |
| `--grey-l` | `#A8B0B2` | Subtle text, hints |
| `--grey-m` | `#88888C` | Secondary text, nav links |
| `--black` | `#181818` | Primary text |
| `--brand` | `#FFB742` | Orange — CTA, mouse, score |
| `--effect1` | `#DA6628` | Deep orange — hover, shading |
| `--effect2` | `#F3FF97` | Acid yellow — accent only, never bg |

**Rules:** No gradients. Flat colour only. Footer = white + `border-top: 1px solid rgba(24,24,24,0.1)`.

---

## 3. Typography

| Font | Usage |
|---|---|
| **Press Start 2P** | Logo, score, popup titles, pts — game moments only |
| **DM Mono** | Everything else |

### Scale
| Token | Size | Usage |
|---|---|---|
| `--fs-24` | clamp(20→24px) | Score display, sub-headings |
| `--fs-16` | 16px | Logo (mialyk), popup title |
| `--fs-12` | 12px | **Body** — nav, descriptions, buttons, footer |
| `--fs-10` | 10px | **Sub-body only** — labels, hints, btn--sm, pw-sub/error |

**Rule: minimum 10px. Body = 12px. Never go below 10px.**

---

## 4. Icons

- All inline SVG, `fill="currentColor"` — zero CDN
- Social: official brand paths (LinkedIn, Instagram, ArtStation, X)
- UI: custom pixel-art `<rect>` (close, lock) or stroke (arrow)

| Class | Size | Usage |
|---|---|---|
| `.pxi--sm` | 14px | Inline button icons |
| `.pxi--md` | 18px | UI icons, social links |
| `.pxi--lg` | 24px | Display icons |

**View Project arrow:** diagonal only, `stroke-width: 2.5`, `stroke-linecap: square`, `margin-top: 3.4px`

---

## 5. Game & Cursor

### Mouse character (game + cursor — identical design)
- Body: `#FFB742`, shading `#DA6628`, highlight `#FFF8E0`
- Ears: upper + lower on left side (behind travel direction), outer orange + `#FFD4A8` inner
- Tail: 3 dots, arc wiggle on movement
- Cursor: body lags 0.22 lerp, rotates toward cursor 0.25 lerp

### Homepage cursor
- Dot: `#FFB742` 5px / `#DA6628` 12px hover

### Candies
- Small +1 / Medium +5 / Large +10
- 16% initial density, refills to 12% on eat

### Experience Beans
- Always 5 on screen, 5s watchdog refill
- Cycles through all projects (no lock-out after seen)
- Diamond sprite, project accent colour, label below

---

## 6. Components

### Buttons — 3 fixed sizes
| Class | Font | H | W | Usage |
|---|---|---|---|---|
| `.btn--sm` | 10px | 36px | auto | Password modal |
| `.btn--md` | 12px | 44px | 172px | Popup (fixed width) |
| `.btn--lg` | 12px | 52px | auto | Hero CTAs |

- Variants: default (transparent) / primary (`--brand` bg)
- Sharp corners always. `appearance: none` reset.

### Popup Windows — 3 sizes
| | SM | MD | LG |
|---|---|---|---|
| Max-width | 360px | 560px | 760px |
| Padding | 32px | 48px top / 160px bottom | 64px |
| Usage | Password | Experience | Future |

### Experience Popup layout
Fixed `560 × 520px`, 3-section flex column:
1. **`.popup-top`** — tag + title + company + period, `padding: 48px 48px 0`
2. **`.popup-mid`** — desc + pts, `flex: 1`, vertically centred
3. **`.popup-btns`** — `height: 160px`, bottom-snapped, centred

---

## 7. Layout

| Element | Value |
|---|---|
| Nav height | 60px |
| Nav / footer padding | 40px horizontal |
| Footer | White bg, top border divider |
| Popup backdrop | `rgba(24,24,24,0.4)` + `blur(4px)` |
| Popup entry | scale `0.92→1` + `translateY 16→0`, spring easing |

---

## 8. Animation

- **Spring** `cubic-bezier(0.34, 1.56, 0.64, 1)` — popups only
- **Ease-out** — nav underline
- Hint: `0.3↔0.9` opacity breathing / playing state: brand orange, solid
- Tick: `200ms` auto / `140ms` player

---

## 9. Project Colours

| Project | Hex |
|---|---|
| ORA | `#00F6FF` |
| Helpurr | `#C0FFEE` |
| Le.social | `#03442D` — password protected |
| Meed | `#F87C56` |
| Cheddar Verse | `#FFBF56` |
| Hamartia | `#FF4444` |
| DeBox | `#00C454` |
| Illustration | `#88888C` |
| VFX | `#181818` |

---

## 10. Do / Don't

**Do:** Sharp corners everywhere · Body 12px min · Single font pair · `--brand` as sole warmth · Fixed popup dimensions

**Don't:** Below 10px font · Gradients · Third font · Rounded corners · Spring on nav · `--effect2` as bg · CDN icon dependencies

---

## 11. Memory — Decision Log

| Session | Decision |
|---|---|
| 1 | Single HTML file, canvas snake game as homepage |
| 1 | Password protection for Le.social |
| 2 | Dual cursor: dot on game, mouse character on other pages |
| 2 | Beans: always 5 on screen, cycle all projects |
| 2 | Candy density: 16% initial / 12% maintain |
| 3 | Footer: white bg + top divider |
| 3 | Hint stays visible when playing, turns brand orange |
| 3 | OOB watchdog: 1s → teleport to opposite edge |
| 4 | Icons: all inline SVG, no CDN, brand paths for socials |
| 4 | Button: 3 fixed sizes, `appearance: none` reset, `<a>` = `<button>` |
| 4 | Popup: 3-section flex, fixed 560×520, 160px button zone |
| 4 | Typography: body 12px, sub-body 10px, logo 16px |
| 4 | Mouse: body lag + direction tracking + tail arc wiggle |
| 4 | Footer cursor: same dot as homepage (isOnGame = true) |

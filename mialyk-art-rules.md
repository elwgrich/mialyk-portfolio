# mialyk // portfolio ??Art Direction & Memory
> Last updated: March 2026 ??Version 2.0 ??Pre-deploy snapshot

---

## 1. Concept & Tone

**Core idea:** A playable portfolio. The homepage is a game ??the user *discovers* work by playing, not scrolling.

**Aesthetic:** 8-bit retro-futurism meets editorial minimalism.
- Game canvas = playful, pixel-art, warm orange
- UI chrome (nav, popup, footer) = clean, monospaced, restrained
- The contrast is intentional ??game world vs. professional frame

**Personality:** Creative Lead who codes. Warm but precise. Playful but not childish.

---

## 2. Colour System

| Token | Hex | Role |
|---|---|---|
| `--white` | `#FEFEFE` | Background, surfaces (70%) |
| `--grey-l` | `#A8B0B2` | Subtle text, hints |
| `--grey-m` | `#88888C` | Secondary text, nav links |
| `--black` | `#181818` | Primary text |
| `--brand` | `#FFB742` | Orange warmth for CTA, score, yellow ratseal body |
| `--effect1` | `#DA6628` | Deep orange shading for ratseal body |
| `--effect2` | `#F3FF97` | Acid yellow accent only, never as a large background |
| `--cyan` | `#00e6c8` | Hover / focus accent, homepage cursor hover, interactive states |
| `--candy-sm` | `#DCE0E2` | Small candy (+1) |
| `--candy-md` | `#C9CDCE` | Medium candy (+5) |
| `--candy-lg` | `#FFB742` | Large candy (+10) |
| `--candy-exp` | `--brand` | Experience bean (+50) |

**Rules:** No gradients. Flat colour only. Footer = white + `border-top: 1px solid rgba(24,24,24,0.1)`.

---

## 3. Typography

| Font | Usage |
|---|---|
| **Press Start 2P** | H1, logo, score, popup titles, pts |
| **DM Mono** | Everything else |

### Scale
| Token | Size | Usage |
|---|---|---|
| `--fs-24` | clamp(20??4px) | Score display, sub-headings |
| `--fs-16` | 16px | Logo (mialyk), popup title |
| `--fs-12` | 12px | **Body** ??nav, descriptions, buttons, footer |
| `--fs-10` | 10px | **Sub-body only** ??labels, hints, btn--sm, pw-sub/error |

**Rule: minimum 10px. Body = 12px. Never go below 10px.**

---

## 4. Icons

- All inline SVG, `fill="currentColor"` ??zero CDN
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

### Yellow ratseal design
- Character family: sharp pixel ratseal, front-heavy rectangular body, never rounded or plush.
- Body: `#FFB742`; shade: `#DA6628`; outline: `#181818`; highlight: `#FFF8E0`.
- Ears: two square ears on the rear side of movement, cream fill `#FFD4A8`, tiny warm highlight.
- Tail: grey dot-chain tail (`#A8B0B2`) with a slight wiggle when moving.
- Nose: white; whisker strokes: grey; eye reads as a black forward-facing block.
- Cursor ratseal and in-game ratseal must stay in the same silhouette family, but scale and spacing can be adjusted for readability.

### Cursor system
- Homepage / header / footer / popup cursor: brand dot.
- Default dot: `#FFB742`, radius `5px`.
- Hover / interactive dot: `#00e6c8`, radius `12px`, alpha about `0.7`.
- Non-home cursor: yellow ratseal sprite with body lag `0.22` lerp and facing rotation `0.25` lerp.
- Hover on interactive targets enlarges the non-home ratseal cursor.

### Candies
- Small +1 / Medium +5 / Large +10.
- 16% initial density, refills to 12% on eat.

### Experience Beans / Nodes
- Always 5 on screen, 5s watchdog refill.
- Cycles through all projects (no lock-out after seen).
- Diamond sprite, project accent colour, label below.
- Do not place nodes under the homepage HUD / `Clean Pixel Explorer` panel.

---

## 6. Components

### Buttons ??3 fixed sizes
| Class | Font | H | W | Usage |
|---|---|---|---|---|
| `.btn--sm` | 10px | 36px | auto | Password modal |
| `.btn--md` | 12px | 44px | 172px | Popup (fixed width) |
| `.btn--lg` | 12px | 52px | auto | Hero CTAs |

- Variants: default (transparent) / primary (`--brand` bg)
- Sharp corners always. `appearance: none` reset.

### Popup Windows ??3 sizes
| | SM | MD | LG |
|---|---|---|---|
| Max-width | 360px | 560px | 760px |
| Padding | 32px | 40px interior system | 64px |
| Usage | Password | Experience | Future |

- Popup windows are flat white panels with shadow only. No outer border line.
- Experience popup footer area has no divider line.

### Experience Popup layout
Fixed `560 x 420px`, 3-section flex / grid column:
1. **`.popup-top`** ??tag + title + company + period, `padding: 36px 40px 0`
2. **`.popup-mid`** ??desc + pts, scrollable when needed, `padding: 14px 40px 0`
3. **`.popup-btns`** ??bottom-snapped action row, centered, `padding: 16px 40px 28px`

---

## 7. Layout

| Element | Value |
|---|---|
| Nav height | 60px |
| Nav / footer padding | 40px horizontal |
| Page content max-width | 1200px centered on all pages except index.html |
| Footer | White bg, top border divider |
| Popup backdrop | `rgba(24,24,24,0.4)` + `blur(4px)` |
| Popup entry | scale `0.92??` + `translateY 16??`, spring easing |

### Hero section

- Default project hero = eyebrow + optional year chip + H1 + meta row. Do not add hero tags or hero deck copy unless explicitly requested.
- Placement = first section under header, `margin-top: 60px`.
- Frame = `padding: 32px 24px`, white background, `border-bottom: 1px solid rgba(24,24,24,0.1)`, fixed hero height `238px`.
- Inner wrap = max-width `1200px`, centered.
- Eyebrow = `DM Mono`, `10px`, uppercase, brand orange, `letter-spacing: .12em`, with a `16px x 2px` orange rule before the text.
- Year chip = `Press Start 2P`, `9px`, `color: --grey-m`, `border: 1px solid rgba(24,24,24,0.15)`, `padding: 4px 10px`, white background.
- H1 = always `Press Start 2P`, `clamp(26px, 4.5vw, 50px)`, black by default.
- H1 accent = use sparingly; default secondary tone is `--grey-m`, not a new colour.
- Meta row = flex layout with `48px` gap and wrap enabled.
- Meta label = `10px`, uppercase, `--grey-l`, `letter-spacing: .1em`, `line-height: 13px`.
- Meta value = `12px`, `--black`, `line-height: 16px`.

| Hero item | H | Padding | Font size |
|---|---|---|---|
| Hero frame | `238px` | `32px 24px` | n/a |
| Eyebrow | `19px` line-height | `0` | `10px` |
| Year chip | auto | `4px 10px` | `9px` |
| H1 | auto | `0` | `clamp(26px, 4.5vw, 50px)` |
| Meta item | auto | `0` | n/a |
| Meta label | `13px` line-height | `0` | `10px` |
| Meta value | `16px` line-height | `0` | `12px` |


---

## 8. Animation

- **Spring** `cubic-bezier(0.34, 1.56, 0.64, 1)` ??popups only
- **Ease-out** ??nav underline
- Hint: `0.3??.9` opacity breathing / playing state: brand orange, solid
- Tick: `200ms` auto / `140ms` player

---

## 9. Project Colours

| Project | Hex |
|---|---|
| ORA | `#00F6FF` |
| Helpurr | `#C0FFEE` |
| Le.social | `#03442D` ??password protected |
| Meed | `#F87C56` |
| Cheddar Verse | `#FFBF56` |
| Hamartia | `#FF4444` |
| Illustration | `#88888C` |
| VFX | `#181818` |

---

## 10. Do / Don't

**Do:** Sharp corners everywhere ??Body 12px min ??Single font pair ??`--brand` as sole warmth ??Fixed popup dimensions

**Don't:** Below 10px font ??Gradients ??Third font ??Rounded corners ??Spring on nav ??`--effect2` as bg ??CDN icon dependencies

---

## 11. Memory ??Decision Log

| Session | Decision |
|---|---|
| 1 | Single HTML file, canvas snake game as homepage |
| 1 | Password protection for Le.social |
| 2 | Dual cursor: dot on game, mouse character on other pages |
| 2 | Beans: always 5 on screen, cycle all projects |
| 2 | Candy density: 16% initial / 12% maintain |
| 3 | Footer: white bg + top divider |
| 3 | Hint stays visible when playing, turns brand orange |
| 3 | OOB watchdog: 1s ??teleport to opposite edge |
| 4 | Icons: all inline SVG, no CDN, brand paths for socials |
| 4 | Button: 3 fixed sizes, `appearance: none` reset, `<a>` = `<button>` |
| 4 | Popup: 3-section flex, fixed 560?520, 160px button zone |
| 4 | Typography: body 12px, sub-body 10px, logo 16px |
| 4 | Mouse: body lag + direction tracking + tail arc wiggle |
| 4 | Footer cursor: same dot as homepage (isOnGame = true) |

---

## 12. Standard Templates

> Copy these verbatim for every new static page. Use relative `.html` routes in the header, keep nav-logo at `href="index.html"`, and mark the current page link with class `active`.

### Header

Header hover = brand orange underline + dropdown hover background `rgba(255,183,66,0.08)`.


```html
<!-- HEADER -->
<header>
  <a href="index.html" class="nav-logo">
    mialyk<span class="slash">//</span><sub>building something creative</sub>
  </a>
  <nav>
    <div class="nav-item">
      <a href="#" class="nav-link">Projects</a>
      <div class="nav-dropdown">
        <a href="helpurr.html" class="dropdown-item"><span class="dropdown-dot"></span>Helpurr</a>
        <a href="#" class="dropdown-item dropdown-locked" onclick="showPasswordModal(event)"><span class="dropdown-dot"></span>Le.social <svg class="pxi pxi--sm" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <rect x="8" y="4" width="8" height="2"/><rect x="6" y="6" width="2" height="4"/>
  <rect x="16" y="6" width="2" height="4"/><rect x="4" y="10" width="16" height="2"/>
  <rect x="4" y="10" width="2" height="10"/><rect x="18" y="10" width="2" height="10"/>
  <rect x="4" y="20" width="16" height="2"/>
  <rect x="10" y="14" width="4" height="2"/><rect x="11" y="16" width="2" height="2"/>
 style="margin-left:4px;opacity:0.5"></svg></a>
        <a href="ora.html" class="dropdown-item"><span class="dropdown-dot"></span>ORA</a>
        <a href="meed.html" class="dropdown-item"><span class="dropdown-dot"></span>Meed</a>
        <a href="cheddar.html" class="dropdown-item"><span class="dropdown-dot"></span>Cheddar Verse</a>
        <a href="illustration.html" class="dropdown-item"><span class="dropdown-dot"></span>Illustration</a>
        <a href="vfx.html" class="dropdown-item"><span class="dropdown-dot"></span>VFX</a>
        <a href="hamartia.html" class="dropdown-item"><span class="dropdown-dot"></span>Hamartia <span style="font-size:10px;color:var(--grey-m)">Game</span></a>
      </div>
    </div>
    <a href="about.html" class="nav-link">About</a>
    <!-- Add class="active" to current page's nav link -->
  </nav>
</header>
```

### Footer

```html
<!-- FOOTER -->
<footer>
  <div class="footer-copy">??2026 <span>mialyk</span> ??All rights reserved</div>
  <div class="footer-socials">
    <!-- LinkedIn -->
    <a href="https://www.linkedin.com/in/mia-lyk" target="_blank" class="social-link" title="LinkedIn"><svg class="pxi pxi--md" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>
    <!-- Instagram -->
    <a href="https://www.instagram.com/mia_lyk" target="_blank" class="social-link" title="Instagram"><svg class="pxi pxi--md" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg></a>
    <!-- ArtStation -->
    <a href="https://www.artstation.com/mialyk" target="_blank" class="social-link" title="ArtStation"><svg class="pxi pxi--md" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M0 17.723l2.027 3.505h.001a2.424 2.424 0 0 0 2.164 1.333h13.457l-2.792-4.838H0zm24 .025c0-.484-.143-.935-.388-1.314L15.728 2.728a2.424 2.424 0 0 0-2.164-1.333H9.419L21.598 22.54l1.92-3.325c.378-.637.482-.919.482-1.467zm-11.129-3.462L7.428 4.858l-5.444 9.428h10.887z"/></svg></a>
    <!-- X / Twitter -->
    <a href="https://x.com/elwgrich/" target="_blank" class="social-link" title="X"><svg class="pxi pxi--md" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.213 5.567 5.95-5.567zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
  </div>
</footer>
```

### Password Modal (required on every page with Le.social in nav)

```html
<!-- PASSWORD MODAL -->
<div id="pw-modal">
  <div id="pw-inner">
    <div class="pw-title"><svg class="pxi pxi--md" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <rect x="8" y="4" width="8" height="2"/><rect x="6" y="6" width="2" height="4"/>
  <rect x="16" y="6" width="2" height="4"/><rect x="4" y="10" width="16" height="2"/>
  <rect x="4" y="10" width="2" height="10"/><rect x="18" y="10" width="2" height="10"/>
  <rect x="4" y="20" width="16" height="2"/>
  <rect x="10" y="14" width="4" height="2"/><rect x="11" y="16" width="2" height="2"/>
 style="margin-right:8px;vertical-align:middle"></svg> Le.social</div>
    <div class="pw-sub">This project is password protected.<br>Enter password to view.</div>
    <input class="pw-input" type="password" id="pw-input" placeholder="Password" onkeydown="if(event.key==='Enter')checkPassword()">
    <div class="pw-error" id="pw-error"></div>
    <div class="pw-btns">
      <button class="btn btn--sm primary" onclick="checkPassword()">Enter ??/button>
      <button class="btn btn--sm" onclick="closePwModal()">Cancel</button>
    </div>
  </div>
</div>
```

### Password Modal JS (add to every page)

```js
const LE_SOCIAL_PASSWORD = 'mialyk2024'; // update when ready
function showPasswordModal(e) {
  e.preventDefault();
  document.getElementById('pw-input').value = '';
  document.getElementById('pw-error').textContent = '';
  document.getElementById('pw-input').classList.remove('error');
  document.getElementById('pw-modal').classList.add('active');
  setTimeout(() => document.getElementById('pw-input').focus(), 100);
}
function closePwModal() { document.getElementById('pw-modal').classList.remove('active'); }
function checkPassword() {
  const val = document.getElementById('pw-input').value;
  if (val === LE_SOCIAL_PASSWORD) {
    closePwModal();
    window.location.href = 'lesocial.html';
  } else {
    document.getElementById('pw-input').classList.add('error');
    document.getElementById('pw-error').textContent = '??Incorrect password';
    document.getElementById('pw-input').value = '';
    setTimeout(() => document.getElementById('pw-input').classList.remove('error'), 1500);
  }
}
document.getElementById('pw-modal').addEventListener('click', function(e) {
  if (e.target === this) closePwModal();
});
```

### Page URL Map

| Page | File | Nav active |
|---|---|---|
| Homepage | `index.html` | ??|
| About | `about.html` | `About` |
| Helpurr | `helpurr.html` | `Projects` |
| Le.social | `lesocial.html` | `Projects` (password) |
| ORA | `ora.html` | `Projects` |
| Meed | `meed.html` | `Projects` |
| Cheddar Verse | `cheddar.html` | `Projects` |
| Illustration | `illustration.html` | `Projects` |
| VFX | `vfx.html` | `Projects` |
| Hamartia | `hamartia.html` | `Projects` |

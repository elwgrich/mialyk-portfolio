
// Mouse Cursor Canvas
const cursorCanvas = document.getElementById('cursor-canvas');
const cursorCtx    = cursorCanvas.getContext('2d');
cursorCanvas.width  = window.innerWidth;
cursorCanvas.height = window.innerHeight;
window.addEventListener('resize', () => {
  resize();
  if (snake.length > 0) {
    snake.forEach(s => {
      s.x = Math.max(0, Math.min(COLS - 1, ((s.x % COLS) + COLS) % COLS));
      s.y = Math.max(0, Math.min(ROWS - 1, ((s.y % ROWS) + ROWS) % ROWS));
    });
  }
  if (!gameStarted) {
    autoDemo();
    return;
  }
  syncBeanLayout();
  renderProjectNodes();
  updateHud();
  draw();
});

let mouseX = -100, mouseY = -100;
let isHovering = false;
let isOnGame   = true; // homepage = dot cursor, elsewhere = mouse cursor
const HOME_SECTION = document.getElementById('home');

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  // Use elementFromPoint to precisely detect if cursor is over the game canvas
  const el = document.elementFromPoint(mouseX, mouseY);
  isOnGame = el === canvas || HOME_SECTION.contains(el);
  // Footer and nav always use dot cursor too
  if (el && (el.closest("footer") || el.closest("header"))) isOnGame = true;
});

document.querySelectorAll('a, button, .nav-link').forEach(el => {
  el.addEventListener('mouseenter', () => { isHovering = true; });
  el.addEventListener('mouseleave', () => { isHovering = false; });
});

// Click ripple + cursor pop
document.addEventListener('click', e => {
  // Only show ripple outside game area
  if (isOnGame) return;
  const ripple = document.createElement('div');
  ripple.className = 'click-ripple';
  const size = isHovering ? 32 : 20;
  ripple.style.cssText = `
    width:${size}px; height:${size}px;
    left:${e.clientX}px; top:${e.clientY}px;
    border: 2px solid #FFB742;
    background: rgba(255,183,66,0.15);
  `;
  document.body.appendChild(ripple);
  setTimeout(() => ripple.remove(), 520);
});

// Cursor State
// Body lags behind cursor; head points toward cursor direction
let bodyX = -100, bodyY = -100;       // smoothed body position
let curAngle = 0, targetAngle = 0;    // facing angle in radians
let legPhase = 0;                     // animation cycle for running legs
let lastBodyX = -100, lastBodyY = -100;
let cursorScale = 2, targetScale = 2;

// Draw directional pixel ratseal - matches game drawMouse exactly
function drawMouseCursor(P, angle, moving) {
  const RAT_BODY = '#FFB742';
  const RAT_SHADE = '#DA6628';
  const RAT_EAR = '#FFD4A8';
  const RAT_OUTLINE = '#181818';
  const RAT_HL = '#FFF8E0';
  const RAT_TAIL = '#A8B0B2';
  const RAT_NOSE = '#FEFEFE';

  function p(rx, ry, w, h, col) {
    cursorCtx.fillStyle = col;
    cursorCtx.fillRect(Math.round(rx - w / 2), Math.round(ry - h / 2), Math.round(w), Math.round(h));
  }

  cursorCtx.save();
  cursorCtx.rotate(angle);

  const tailArc = moving ? Math.sin(legPhase * 1.4) * P * 1.6 : P * 1.1;
  p(-P * 10.5, tailArc * 0.15, P * 2, P * 2, RAT_TAIL);
  p(-P * 13.2, tailArc * 0.7, P * 1.5, P * 1.5, RAT_TAIL);
  p(-P * 7.4, -P * 4.8, P * 3, P * 3, RAT_OUTLINE);
  p(-P * 7.4, P * 4.8, P * 3, P * 3, RAT_OUTLINE);
  p(-P * 7.0, -P * 4.4, P * 2, P * 2, RAT_EAR);
  p(-P * 7.0, P * 4.4, P * 2, P * 2, RAT_EAR);
  p(-P * 6.7, -P * 4.2, P, P, RAT_HL);
  p(-P * 6.7, P * 4.2, P, P, RAT_HL);

  p(-P * 0.6, 0, P * 11, P * 9, RAT_OUTLINE);
  p(-P * 0.4, 0, P * 9, P * 7, RAT_BODY);
  p(P * 1.4, P * 2.0, P * 4.5, P, RAT_SHADE);
  p(P * 1.4, P * 2.0, P, P * 4, RAT_SHADE);
  p(-P * 2.4, -P * 2.0, P * 3, P, RAT_HL);
  p(-P * 2.4, -P * 2.0, P, P * 3, RAT_HL);

  p(P * 1.2, -P * 1.8, P, P * 1.4, RAT_OUTLINE);
  p(P * 1.2, P * 1.8, P, P * 1.4, RAT_OUTLINE);
  p(P * 1.5, -P * 2.0, P * 0.7, P * 0.7, RAT_HL);
  p(P * 1.5, P * 1.5, P * 0.7, P * 0.7, RAT_HL);
  p(P * 4.0, 0, P * 2.2, P * 2.2, RAT_OUTLINE);
  p(P * 4.2, 0, P * 1.6, P * 1.6, RAT_NOSE);
  p(P * 5.0, 0, P, P, RAT_SHADE);

  cursorCtx.fillStyle = 'rgba(136,136,140,0.6)';
  cursorCtx.fillRect(Math.round(P * 2.8), Math.round(-P * 0.9), Math.round(P * 3), 1);
  cursorCtx.fillRect(Math.round(P * 2.8), Math.round(P * 1.2), Math.round(P * 3), 1);

  cursorCtx.restore();
}

// Cursor animation loop
function cursorLoop() {
  cursorCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
  cursorCtx.imageSmoothingEnabled = false;

  targetScale = isHovering ? 2.8 : 2;
  cursorScale += (targetScale - cursorScale) * 0.18;

  if (isOnGame) {
    // Homepage: simple brand dot
    cursorCtx.fillStyle = isHovering ? '#00e6c8' : '#FFB742';
    const r = isHovering ? 12 : 5;
    cursorCtx.globalAlpha = isHovering ? 0.7 : 1;
    cursorCtx.beginPath();
    cursorCtx.arc(mouseX, mouseY, r, 0, Math.PI * 2);
    cursorCtx.fill();
    cursorCtx.globalAlpha = 1;
  } else {
    // Body smoothly follows cursor with lag
    bodyX += (mouseX - bodyX) * 0.22;
    bodyY += (mouseY - bodyY) * 0.22;

    // Velocity from body movement
    const vx = bodyX - lastBodyX;
    const vy = bodyY - lastBodyY;
    const speed = Math.sqrt(vx*vx + vy*vy);
    const moving = speed > 0.4;
    lastBodyX = bodyX;
    lastBodyY = bodyY;

    // Update facing angle toward cursor (from body position)
    const dx = mouseX - bodyX;
    const dy = mouseY - bodyY;
    if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
      targetAngle = Math.atan2(dy, dx);
    }
    // Smooth angle interpolation (shortest path)
    let da = targetAngle - curAngle;
    while (da >  Math.PI) da -= Math.PI * 2;
    while (da < -Math.PI) da += Math.PI * 2;
    curAngle += da * 0.25;

    // Advance leg animation when moving
    if (moving) legPhase += 0.28;

    cursorCtx.save();
    cursorCtx.translate(Math.round(bodyX), Math.round(bodyY));
    drawMouseCursor(cursorScale, curAngle, moving);
    cursorCtx.restore();
  }
  requestAnimationFrame(cursorLoop);
}
cursorLoop();

function scrollToTop(e) { e.preventDefault(); window.scrollTo({top:0}); }

// Canvas Setup
const canvas  = document.getElementById('gameCanvas');
const ctx     = canvas.getContext('2d');
const NAV_H   = 60;
const CELL    = 28;
let COLS, ROWS;

function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  COLS = Math.floor(canvas.width  / CELL);
  ROWS = Math.floor(canvas.height / CELL);
}
window.addEventListener('resize', () => {
  resize();
  if (snake.length > 0) {
    snake.forEach(s => {
      s.x = Math.max(0, Math.min(COLS - 1, ((s.x % COLS) + COLS) % COLS));
      s.y = Math.max(0, Math.min(ROWS - 1, ((s.y % ROWS) + ROWS) % ROWS));
    });
  }
  if (!gameStarted) {
    autoDemo();
    return;
  }
  syncBeanLayout();
  renderProjectNodes();
  updateHud();
  draw();
});
resize();

// Forbidden zones (HUD areas; no beans/candies allowed)
// Returns true if grid cell (gx,gy) overlaps any UI element
function isForbidden(gx, gy) {
  const NAV_ROWS = Math.ceil(NAV_H / CELL);
  if (gy < NAV_ROWS) return true;

  const hudLeft = window.innerWidth <= 640 ? 16 : window.innerWidth <= 900 ? 20 : 40;
  const hudWidth = window.innerWidth <= 900 ? Math.min(window.innerWidth - hudLeft * 2, 320) : 360;
  const hudHeight = window.innerWidth <= 900 ? 214 : 176;
  const hudColEnd = Math.ceil((hudLeft + hudWidth) / CELL);
  const hudRowEnd = NAV_ROWS + Math.ceil((24 + hudHeight) / CELL);
  if (gx >= 0 && gx <= hudColEnd && gy >= NAV_ROWS && gy < hudRowEnd) return true;

  if (gy >= ROWS - 3) return true;

  return false;
}

// Colors
const WHITE  = '#FEFEFE';
const GREY_L = '#A8B0B2';
const GREY_M = '#88888C';
const BLACK  = '#181818';
const BRAND  = '#FFB742';
const EFF1   = '#DA6628';
const EFF2   = '#F3FF97';
const CYAN   = '#00e6c8';
const popupViewBtn = document.getElementById('popup-view-btn');
const popupPtsEl = document.getElementById('popup-pts');
const nodeLayer = document.getElementById('node-layer');
const hudModeEl = document.getElementById('hud-mode');
const hudStatusEl = document.getElementById('hud-status');
const hudProjectCountEl = document.getElementById('hud-project-count');
const hudSelectedEl = document.getElementById('hud-selected');
const hudSelectedMetaEl = document.getElementById('hud-selected-meta');
const popupArrowIcon = ' <svg class="pxi pxi--sm" style="margin-top:3.4px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square" xmlns="http://www.w3.org/2000/svg"><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>';
const ABOUT_POPUP = {
  tag: 'Seal Encounter',
  title: 'About',
  company: 'Explorer Log',
  period: 'The studio behind the map',
  desc: 'The white seal found the ratseal explorer. Open About to see the profile, skill tree, and contact links.',
  pts: 0,
  url: 'about.html',
  buttonLabel: 'Open About',
  newTab: false,
};

const PROJECT_LAYOUTS = {
  desktop: {
    lesocial:     { x: 0.20, y: 0.36 },
    debox:        { x: 0.23, y: 0.63 },
    illustration: { x: 0.42, y: 0.24 },
    vfx:          { x: 0.44, y: 0.56 },
    ora:          { x: 0.66, y: 0.22 },
    helpurr:      { x: 0.81, y: 0.38 },
    meed:         { x: 0.61, y: 0.49 },
    cheddar:      { x: 0.60, y: 0.74 },
    hamartia:     { x: 0.80, y: 0.68 },
  },
  compact: {
    illustration: { x: 0.28, y: 0.26 },
    ora:          { x: 0.74, y: 0.24 },
    lesocial:     { x: 0.22, y: 0.41 },
    helpurr:      { x: 0.76, y: 0.41 },
    meed:         { x: 0.28, y: 0.56 },
    debox:        { x: 0.74, y: 0.56 },
    vfx:          { x: 0.24, y: 0.72 },
    cheddar:      { x: 0.76, y: 0.72 },
    hamartia:     { x: 0.50, y: 0.84 },
  }
};

const PROJECT_LINKS = [
  ['lesocial', 'ora'],
  ['lesocial', 'helpurr'],
  ['ora', 'meed'],
  ['ora', 'debox'],
  ['meed', 'cheddar'],
  ['meed', 'hamartia'],
  ['helpurr', 'illustration'],
  ['illustration', 'vfx'],
  ['cheddar', 'illustration'],
  ['hamartia', 'vfx'],
];

const EXPERIENCES = [
  {
    id: 'ora', label: 'ORA',
    tag: 'Experience Unlocked',
    title: 'Creative Lead',
    company: 'ORA Protocol',
    period: 'Jun 2024 - Feb 2025 // Full-time',
    desc: 'Built ORA\'s visual identity and brand system from zero. Led art direction for Chain Reaction, Token Launches, and ETH - AI initiatives - videos, products, merchandise.',
    pts: 50,
    url: 'https://ora.io',
    color: BRAND,
  },
  {
    id: 'helpurr', label: 'HELPURR',
    tag: 'Experience Unlocked',
    title: 'Brand Builder',
    company: 'Helpurr',
    period: '2025 - 2026',
    desc: 'Early team member shaping the art direction and brand identity for an AI-powered pet care app. Built the visual language from zero - character design, UI aesthetic, and brand system for Helpurr\'s launch.',
    pts: 50,
    url: 'https://helpurr.com',
    color: BRAND,
  },
  {
    id: 'meed', label: 'MEED',
    tag: 'Experience Unlocked',
    title: 'Senior Designer',
    company: 'Meed (ex-Super Ultra)',
    period: 'Jun 2022 - Jul 2024 // Full-time',
    desc: 'Designed Meed\'s AI-enhanced digital rewards platform - web app and dashboard. Built hype casual mobile games and co-designed "Skysurfer". Won Moralis - Google & Cronos Labs hackathons.',
    pts: 50,
    url: 'https://meed.com',
    color: BRAND,
  },
  {
    id: 'hamartia', label: 'HAMARTIA',
    tag: 'Project Unlocked',
    title: 'Game Project',
    company: 'Hamartia',
    period: '2023 - 2024',
    desc: 'Game design, art direction and visual development for Hamartia.',
    pts: 50,
    url: '/hamartia.html',
    color: BRAND,
  },
  {
    id: 'cheddar', label: 'CHEDDAR',
    tag: 'Project Unlocked',
    title: '2D / 3D Artist',
    company: 'Cheddar Verse',
    period: 'Jan 2021 - May 2022 // Full-time',
    desc: 'Branding for NFT projects "Cheddar Verse", 3D assets for blind box, illustrations for social media.',
    pts: 50,
    url: '/cheddar.html',
    color: BRAND,
  },
  {
    id: 'debox', label: 'DEBOX',
    tag: 'Experience Unlocked',
    title: 'Community Manager',
    company: 'DeBox',
    period: '2022 - 2023',
    desc: 'Grew DeBox HK community from 0 to 2600 in 4 months. Hosted Twitter Spaces, member meetups, and organised the first IRL event and happy hour.',
    pts: 50,
    url: '/debox.html',
    color: BRAND,
  },
  {
    id: 'lesocial', label: 'LE.SOCIAL',
    tag: 'Project Unlocked',
    title: 'Builder',
    company: 'Le.social',
    period: '2025 - 2026 // Self-initiated',
    desc: 'Conceived and built Le.social - the best tool for your social name card. A passion project exploring digital identity, minimal design, and how people present themselves online.',
    pts: 50,
    url: '/lesocial.html',
    color: BRAND,
  },
  {
    id: 'illustration', label: 'ILLUST.',
    tag: 'Project Unlocked',
    title: 'Illustrator',
    company: 'Illustration',
    period: '2020 - Present',
    desc: 'Personal illustration work spanning character design, editorial, and world-building.',
    pts: 50,
    url: '/illustration.html',
    color: BRAND,
  },
  {
    id: 'vfx', label: 'VFX',
    tag: 'Project Unlocked',
    title: 'VFX Artist',
    company: 'VFX',
    period: '2021 - 2023',
    desc: 'Motion graphics and visual effects for film and digital media projects.',
    pts: 50,
    url: '/vfx.html',
    color: BRAND,
  },
];

// Game State
let snake       = [];
let dir         = { x: 1, y: 0 };
let nextDir     = { x: 1, y: 0 };
let candies     = [];
let expBeans    = [];
let score       = 0;
let gameStarted = false; // false = auto demo mode
let gameLoop;
let unlockedExp = new Set(); // tracks which popups have been shown
let popupOpen   = false;
let beanWatchdog = null; // 5s interval to guarantee bean count
let selectedExpId = null;
const projectNodeEls = new Map();

// Auto-wander AI
let autoTarget  = null;
let autoTimer   = 0;
let sealEnemy   = null;
let sealMoveTimer = 0;
const SEAL_SIZE_CELLS = 2;

// Helpers
function ri(max) { return Math.floor(Math.random() * max); }
function gridX(col) { return col * CELL + CELL / 2; }
function gridY(row) { return row * CELL + CELL / 2; }
function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
function isCompactMap() { return window.innerWidth <= 900; }
function getExperience(id) { return EXPERIENCES.find(exp => exp.id === id); }
function getNodeIcon(id) {
  const icons = {
    ora: 'signal',
    helpurr: 'spark',
    meed: 'stack',
    hamartia: 'frame',
    cheddar: 'orbit',
    debox: 'signal',
    lesocial: 'frame',
    illustration: 'spark',
    vfx: 'stack',
  };
  return icons[id] || 'signal';
}

function projectAnchorFor(expId) {
  const map = isCompactMap() ? PROJECT_LAYOUTS.compact : PROJECT_LAYOUTS.desktop;
  const point = map[expId] || { x: 0.5, y: 0.5 };
  const minX = isCompactMap() ? 3 : 4;
  const maxX = Math.max(minX, COLS - 4);
  const minY = Math.ceil((NAV_H + (isCompactMap() ? 170 : 120)) / CELL);
  const maxY = Math.max(minY, ROWS - (isCompactMap() ? 5 : 4));
  return {
    x: clamp(Math.round(point.x * (COLS - 1)), minX, maxX),
    y: clamp(Math.round(point.y * (ROWS - 1)), minY, maxY),
  };
}

function beanSlotAvailable(gx, gy, planned = [], excludeId = null) {
  if (gx < 0 || gx >= COLS || gy < 0 || gy >= ROWS - 1) return false;
  if (isForbidden(gx, gy) || isForbidden(gx, gy + 1)) return false;
  if (snake.some(s => s.x === gx && s.y === gy)) return false;
  if (candies.some(c => Math.abs(c.x - gx) <= 1 && Math.abs(c.y - gy) <= 1)) return false;
  if (sealOccupies(gx, gy)) return false;
  const allBeans = [...expBeans, ...planned];
  if (allBeans.some(e => e.exp.id !== excludeId && Math.abs(e.x - gx) <= 2 && Math.abs(e.y - gy) <= 1)) return false;
  return true;
}

function findCuratedBeanPosition(exp, planned = []) {
  const anchor = projectAnchorFor(exp.id);
  if (beanSlotAvailable(anchor.x, anchor.y, planned, exp.id)) return anchor;

  for (let radius = 1; radius <= 5; radius++) {
    for (let dx = -radius; dx <= radius; dx++) {
      for (let dy = -radius; dy <= radius; dy++) {
        if (Math.abs(dx) !== radius && Math.abs(dy) !== radius) continue;
        const tx = anchor.x + dx;
        const ty = anchor.y + dy;
        if (beanSlotAvailable(tx, ty, planned, exp.id)) {
          return { x: tx, y: ty };
        }
      }
    }
  }

  return anchor;
}

function syncBeanLayout() {
  const planned = [];
  expBeans = expBeans.map(bean => {
    const pos = findCuratedBeanPosition(bean.exp, planned);
    const next = { ...pos, exp: bean.exp };
    planned.push(next);
    return next;
  });
}

function updateHud() {
  hudModeEl.textContent = gameStarted ? 'manual control' : 'auto roam';
  hudStatusEl.textContent = popupOpen ? 'project focus' : gameStarted ? 'explorer active' : 'map scanning';
  hudProjectCountEl.textContent = `${String(expBeans.length).padStart(2, '0')} curated`;

  const exp = selectedExpId ? getExperience(selectedExpId) : null;
  if (exp) {
    hudSelectedEl.textContent = exp.label;
    hudSelectedMetaEl.textContent = `${exp.title} // ${exp.company}`;
  } else {
    hudSelectedEl.textContent = 'Hover or collect a node';
    hudSelectedMetaEl.textContent = gameStarted
      ? 'Explorer ratseal moving through the archive'
      : 'Curated portfolio map online';
  }
}

function createProjectNode(exp) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'project-node';
  button.dataset.icon = getNodeIcon(exp.id);
  button.setAttribute('aria-label', `${exp.label}, ${exp.title}, ${exp.company}`);
  button.innerHTML = `
    <span class="project-node__badge" aria-hidden="true">
      <span class="project-node__glyph"></span>
    </span>
    <span class="project-node__label">${exp.label}</span>
    <span class="project-node__tooltip" role="presentation">
      <span class="project-node__tooltip-title">${exp.label}</span>
      <span class="project-node__tooltip-meta">${exp.title} // ${exp.company}</span>
    </span>
  `;

  button.addEventListener('mouseenter', () => {
    isHovering = true;
    setSelectedProject(exp.id);
  });
  button.addEventListener('mouseleave', () => {
    isHovering = false;
    if (!popupOpen && selectedExpId === exp.id) setSelectedProject(null);
  });
  button.addEventListener('focus', () => setSelectedProject(exp.id));
  button.addEventListener('blur', () => {
    if (!popupOpen && selectedExpId === exp.id) setSelectedProject(null);
  });
  button.addEventListener('click', event => {
    event.stopPropagation();
    setSelectedProject(exp.id);
    showPopup(exp);
  });
  return button;
}

function renderProjectNodes() {
  if (!nodeLayer) return;

  const visibleIds = new Set(expBeans.map(bean => bean.exp.id));
  projectNodeEls.forEach((el, id) => {
    if (!visibleIds.has(id)) {
      el.remove();
      projectNodeEls.delete(id);
    }
  });

  expBeans.forEach(bean => {
    let el = projectNodeEls.get(bean.exp.id);
    if (!el) {
      el = createProjectNode(bean.exp);
      projectNodeEls.set(bean.exp.id, el);
      nodeLayer.appendChild(el);
    }

    const x = gridX(bean.x);
    const y = gridY(bean.y);
    const alignLeft = x > canvas.width * (isCompactMap() ? 0.56 : 0.68);
    el.classList.toggle('project-node--left', alignLeft);
    el.classList.toggle('is-active', bean.exp.id === selectedExpId);
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
  });
}

function setSelectedProject(expOrId) {
  const nextId = typeof expOrId === 'string' ? expOrId : expOrId?.id || null;
  const changed = selectedExpId !== nextId;
  selectedExpId = nextId;
  updateHud();
  renderProjectNodes();
  if (changed && typeof draw === 'function') draw();
}

function occupied(pos) {
  return isForbidden(pos.x, pos.y)
    || snake.some(s => s.x === pos.x && s.y === pos.y)
    || candies.some(c => c.x === pos.x && c.y === pos.y)
    || nearProjectAnchor(pos.x, pos.y, 1)
    || sealOccupies(pos.x, pos.y);
}

function safeSpawn() {
  let pos, tries = 0;
  do {
    pos = { x: ri(COLS), y: ri(ROWS) };
    tries++;
  } while (occupied(pos) && tries < 200);
  return pos;
}

// Init
function wrapDelta(from, to, size) {
  let delta = to - from;
  if (Math.abs(delta) > size / 2) delta = -Math.sign(delta) * (size - Math.abs(delta));
  return delta;
}

function sealOccupies(gx, gy, enemy = sealEnemy) {
  if (!enemy) return false;
  return gx >= enemy.x && gx < enemy.x + SEAL_SIZE_CELLS
    && gy >= enemy.y && gy < enemy.y + SEAL_SIZE_CELLS;
}

function safeSpawnSealEnemy() {
  let pos;
  let tries = 0;
  const maxX = Math.max(0, COLS - SEAL_SIZE_CELLS);
  const maxY = Math.max(0, ROWS - SEAL_SIZE_CELLS);
  const minY = maxY >= 2 ? 2 : 0;
  do {
    pos = {
      x: ri(maxX + 1),
      y: minY + ri(Math.max(1, maxY - minY + 1))
    };
    tries++;
  } while (
    tries < 300 && (
      !sealCellFree(pos.x, pos.y, false) ||
      Math.abs((pos.x + 1) - snake[0].x) + Math.abs((pos.y + 1) - snake[0].y) < 8
    )
  );
  return pos;
}

function sealCellFree(gx, gy, allowHead) {
  if (gx < 0 || gx + SEAL_SIZE_CELLS > COLS || gy < 0 || gy + SEAL_SIZE_CELLS > ROWS) return false;
  const body = allowHead ? snake.slice(1) : snake;
  for (let y = gy; y < gy + SEAL_SIZE_CELLS; y++) {
    for (let x = gx; x < gx + SEAL_SIZE_CELLS; x++) {
      if (isForbidden(x, y)) return false;
      if (body.some(s => s.x === x && s.y === y)) return false;
      if (candies.some(c => c.x === x && c.y === y)) return false;
      if (expBeans.some(e => e.x === x && (e.y === y || e.y + 1 === y))) return false;
    }
  }
  return true;
}

function spawnSealEnemy() {
  sealEnemy = safeSpawnSealEnemy();
  sealMoveTimer = 0;
}

function moveSealEnemy() {
  if (!sealEnemy || snake.length === 0) return;
  sealMoveTimer--;
  if (sealMoveTimer > 0) return;
  sealMoveTimer = 2;

  const head = snake[0];
  const dx = head.x - sealEnemy.x;
  const dy = head.y - sealEnemy.y;
  const candidates = [];

  if (Math.abs(dx) >= Math.abs(dy)) {
    if (dx !== 0) candidates.push({ x: sealEnemy.x + Math.sign(dx), y: sealEnemy.y });
    if (dy !== 0) candidates.push({ x: sealEnemy.x, y: sealEnemy.y + Math.sign(dy) });
  } else {
    if (dy !== 0) candidates.push({ x: sealEnemy.x, y: sealEnemy.y + Math.sign(dy) });
    if (dx !== 0) candidates.push({ x: sealEnemy.x + Math.sign(dx), y: sealEnemy.y });
  }

  [
    { x: sealEnemy.x + 1, y: sealEnemy.y },
    { x: sealEnemy.x - 1, y: sealEnemy.y },
    { x: sealEnemy.x, y: sealEnemy.y + 1 },
    { x: sealEnemy.x, y: sealEnemy.y - 1 }
  ].forEach(option => candidates.push(option));

  for (const option of candidates) {
    const nx = Math.max(0, Math.min(COLS - SEAL_SIZE_CELLS, option.x));
    const ny = Math.max(0, Math.min(ROWS - SEAL_SIZE_CELLS, option.y));
    if (sealCellFree(nx, ny, true)) {
      sealEnemy = { x: nx, y: ny };
      break;
    }
  }

  if (sealOccupies(head.x, head.y)) {
    showAboutPopup();
  }
}

function showAboutPopup() {
  if (popupOpen) return;
  spawnSealEnemy();
  showPopup(ABOUT_POPUP);
}

function initGame() {
  const cx = Math.floor(COLS / 2);
  const cy = Math.floor(ROWS / 2);
  snake = [
    { x: cx,     y: cy },
    { x: cx - 1, y: cy },
    { x: cx - 2, y: cy },
    { x: cx - 3, y: cy },
  ];
  dir     = { x: 1, y: 0 };
  nextDir = { x: 1, y: 0 };
  score   = 0;
  candies = [];
  expBeans = [];
  unlockedExp = new Set();
  sealEnemy = null;
  sealMoveTimer = 0;
  selectedExpId = null;
  projectNodeEls.forEach(el => el.remove());
  projectNodeEls.clear();
  updateScore(0);

  for (let i = 0; i < candyInitial(); i++) spawnCandy();
  spawnExpBeans();
  spawnSealEnemy();
  updateHud();
  renderProjectNodes();

  clearInterval(gameLoop);
  gameLoop = setInterval(tick, gameStarted ? 140 : 200);
  startBeanWatchdog();
}

// Candy size: 70% small(+1), 10% medium(+5), 20% large(+10)
function spawnCandy() {
  const pos = safeSpawn();
  const r = Math.random();
  const size = r < 0.70 ? 1 : r < 0.80 ? 5 : 10;
  candies.push({ ...pos, size });
}

function candyTarget()  { return Math.floor(COLS * ROWS * 0.06); } // 6% maintain
function candyInitial() { return Math.floor(COLS * ROWS * 0.08); } // 8% initial

function maintainCandies() {
  const target = candyTarget();
  if (candies.length < target) {
    const toAdd = target - candies.length;
    for (let i = 0; i < toAdd; i++) spawnCandy();
  }
}

const MAX_EXP_BEANS = EXPERIENCES.length;

function spawnExpBeans() {
  const onScreen = new Set(expBeans.map(bean => bean.exp.id));
  const planned = [];

  EXPERIENCES.forEach(exp => {
    if (onScreen.has(exp.id)) return;
    const pos = findCuratedBeanPosition(exp, planned);
    const bean = { ...pos, exp };
    planned.push(bean);
    expBeans.push(bean);
  });

  renderProjectNodes();
  updateHud();
}

function maintainExpBeans() {
  if (expBeans.length < MAX_EXP_BEANS) {
    spawnExpBeans();
  } else {
    renderProjectNodes();
    updateHud();
  }
}

let oobTimer = null; // out-of-bounds timer

function startBeanWatchdog() {
  if (beanWatchdog) clearInterval(beanWatchdog);
  beanWatchdog = setInterval(() => {
    if (!popupOpen && expBeans.length < MAX_EXP_BEANS) {
      spawnExpBeans();
      draw();
    }
  }, 5000);
}

function checkSnakeInBounds() {
  if (!gameStarted || snake.length === 0) { oobTimer = null; return; }
  const h = snake[0];
  if (h.x < 0 || h.x >= COLS || h.y < 0 || h.y >= ROWS) {
    if (!oobTimer) {
      oobTimer = setTimeout(() => {
        // Still out of bounds after 1s - teleport to opposite edge
        if (snake.length > 0) {
          const head = snake[0];
          // Wrap to opposite side based on exit direction
          const nx = ((head.x % COLS) + COLS) % COLS;
          const ny = ((head.y % ROWS) + ROWS) % ROWS;
          // Shift whole snake so head lands at (nx, ny)
          const dx = nx - head.x;
          const dy = ny - head.y;
          snake.forEach(s => { s.x += dx; s.y += dy; });
          // Clamp all segments
          snake.forEach(s => {
            s.x = Math.max(0, Math.min(COLS - 1, s.x));
            s.y = Math.max(0, Math.min(ROWS - 1, s.y));
          });
        }
        oobTimer = null;
        draw();
      }, 1000);
    }
  } else {
    if (oobTimer) { clearTimeout(oobTimer); oobTimer = null; }
  }
}

// Tick
function tick() {
  if (popupOpen) return;

  // Guard: if snake head is out of bounds (e.g. after resize), teleport back to centre
  if (snake.length > 0) {
    const h = snake[0];
    if (h.x < 0 || h.x >= COLS || h.y < 0 || h.y >= ROWS) {
      snake.forEach(s => {
        s.x = ((s.x % COLS) + COLS) % COLS;
        s.y = ((s.y % ROWS) + ROWS) % ROWS;
      });
    }
  }

  if (!gameStarted) {
    autoSteer();
  }

  dir = nextDir;
  const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

  // Wrap (no walls)
  head.x = (head.x + COLS) % COLS;
  head.y = (head.y + ROWS) % ROWS;

  // Self collision only in player mode
  if (gameStarted && snake.some(s => s.x === head.x && s.y === head.y)) {
    initGame(); return;
  }

  snake.unshift(head);

  if (sealOccupies(head.x, head.y)) {
    showAboutPopup();
    draw();
    return;
  }

  // Eat candy
  const ci = candies.findIndex(c => c.x === head.x && c.y === head.y);
  if (ci !== -1) {
    score += candies[ci].size;
    floatScore('+' + candies[ci].size, head.x, head.y);
    candies.splice(ci, 1);
    maintainCandies(); // refill if below 12%
    updateScore(score);
  } else {
    // Eat exp bean
    const ei = expBeans.findIndex(e => e.x === head.x && e.y === head.y);
    if (ei !== -1) {
      const exp = expBeans[ei].exp;
      score += exp.pts;
      expBeans.splice(ei, 1);
      unlockedExp.add(exp.id);
      updateScore(score);
      showPopup(exp);
      // Grow snake
    } else {
      snake.pop();
    }
  }
  // Always maintain beans - one per project, no duplicates
  maintainExpBeans();
  moveSealEnemy();
  if (popupOpen) {
    draw();
    return;
  }

  checkSnakeInBounds();
  draw();
}

// Mouse hover push candies only (when not playing)
let hoverGridX = -1, hoverGridY = -1;
canvas.addEventListener('mousemove', e => {
  if (gameStarted) return;
  const rect = canvas.getBoundingClientRect();
  hoverGridX = Math.floor((e.clientX - rect.left) / CELL);
  hoverGridY = Math.floor((e.clientY - rect.top) / CELL);
  pushBeansFromMouse();
});
canvas.addEventListener('mouseleave', () => { hoverGridX = -1; hoverGridY = -1; });

function nearProjectAnchor(gx, gy, padding = 1) {
  return expBeans.some(e => Math.abs(e.x - gx) <= padding && Math.abs(e.y - gy) <= padding);
}

function cellFreeForBean(gx, gy, excludeBean) {
  if (isForbidden(gx, gy) || isForbidden(gx, gy + 1)) return false;
  if (gx < 0 || gx >= COLS || gy < 0 || gy >= ROWS - 1) return false;
  if (snake.some(s => s.x === gx && s.y === gy)) return false;
  if (candies.some(c => Math.abs(c.x - gx) <= 1 && Math.abs(c.y - gy) <= 1)) return false;
  if (sealOccupies(gx, gy)) return false;
  if (expBeans.some(e => e !== excludeBean && Math.abs(e.x - gx) <= 2 && Math.abs(e.y - gy) <= 1)) return false;
  return true;
}

function cellFreeForCandy(gx, gy) {
  if (isForbidden(gx, gy)) return false;
  if (gx < 0 || gx >= COLS || gy < 0 || gy >= ROWS) return false;
  if (snake.some(s => s.x === gx && s.y === gy)) return false;
  if (candies.some(c => c.x === gx && c.y === gy)) return false;
  if (sealOccupies(gx, gy)) return false;
  if (nearProjectAnchor(gx, gy, 1)) return false;
  return true;
}

function pushBeansFromMouse() {
  if (hoverGridX < 0) return;

  candies.forEach(candy => {
    const dx = candy.x - hoverGridX;
    const dy = candy.y - hoverGridY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 1.5 && dist > 0) {
      const nx = dx / dist;
      const ny = dy / dist;
      const rawX = Math.round(candy.x + nx);
      const rawY = Math.round(candy.y + ny);
      if (cellFreeForCandy(rawX, rawY)) {
        candy.x = rawX;
        candy.y = rawY;
      }
    }
  });

  draw();
}
// Auto-wander AI
function autoSteer() {
  autoTimer--;
  if (autoTimer > 0) return;
  autoTimer = ri(6) + 3;

  // Pick a random target: candy or exp bean
  const targets = [...candies, ...expBeans.map(e => e)];
  if (targets.length && Math.random() > 0.3) {
    const t = targets[ri(targets.length)];
    const tx = t.x, ty = t.y;
    const hx = snake[0].x, hy = snake[0].y;

    // Wrap-aware delta
    let dx = tx - hx;
    let dy = ty - hy;
    if (Math.abs(dx) > COLS / 2) dx = -Math.sign(dx) * (COLS - Math.abs(dx));
    if (Math.abs(dy) > ROWS / 2) dy = -Math.sign(dy) * (ROWS - Math.abs(dy));

    const candidates = [];
    if (Math.abs(dx) >= Math.abs(dy)) {
      candidates.push({ x: Math.sign(dx) || 1, y: 0 });
      candidates.push({ x: 0, y: Math.sign(dy) || 1 });
    } else {
      candidates.push({ x: 0, y: Math.sign(dy) || 1 });
      candidates.push({ x: Math.sign(dx) || 1, y: 0 });
    }
    for (const c of candidates) {
      if (c.x !== -dir.x || c.y !== -dir.y) { nextDir = c; break; }
    }
  } else {
    // Random turn
    const options = [
      {x:1,y:0},{x:-1,y:0},{x:0,y:1},{x:0,y:-1}
    ].filter(d => d.x !== -dir.x || d.y !== -dir.y);
    nextDir = options[ri(options.length)];
  }
}

// Pixel helpers
function px(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

function noiseAt(x, y) {
  const value = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function drawBackgroundNoise() {
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS; r++) {
      if (isForbidden(c, r)) continue;
      const n = noiseAt(c, r);
      const pxX = c * CELL + CELL / 2 - 1;
      const pxY = r * CELL + CELL / 2 - 1;

      if ((c + r) % 2 === 0 && n < 0.36) {
        px(pxX, pxY, 2, 2, 'rgba(136,136,140,0.09)');
      } else if ((c + r) % 3 === 0 && n > 0.84 && n < 0.88) {
        px(pxX - 1, pxY, 4, 1, 'rgba(168,176,178,0.10)');
        px(pxX, pxY - 1, 1, 4, 'rgba(168,176,178,0.10)');
      }
    }
  }
}

function drawPixelTrack(x1, y1, x2, y2, color) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const steps = Math.max(1, Math.ceil(Math.max(Math.abs(dx), Math.abs(dy)) / 6));
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    px(x1 + dx * t - 1, y1 + dy * t - 1, 2, 2, color);
  }
}

function drawNodePaths() {
  PROJECT_LINKS.forEach(([fromId, toId]) => {
    const from = expBeans.find(bean => bean.exp.id === fromId);
    const to = expBeans.find(bean => bean.exp.id === toId);
    if (!from || !to) return;

    const active = selectedExpId && (selectedExpId === fromId || selectedExpId === toId);
    const color = active ? 'rgba(0,230,200,0.24)' : 'rgba(168,176,178,0.22)';
    const startX = gridX(from.x);
    const startY = gridY(from.y);
    const endX = gridX(to.x);
    const endY = gridY(to.y);
    const bendX = startX + Math.round(((endX - startX) * 0.5) / CELL) * CELL;

    drawPixelTrack(startX, startY, bendX, startY, color);
    drawPixelTrack(bendX, startY, bendX, endY, color);
    drawPixelTrack(bendX, endY, endX, endY, color);
  });
}

function drawPopupConnection() {
  if (!popupOpen || !selectedExpId) return;
  const bean = expBeans.find(item => item.exp.id === selectedExpId);
  if (!bean) return;

  const startX = gridX(bean.x);
  const startY = gridY(bean.y);
  const popupHalf = Math.min(280, Math.floor(canvas.width * 0.22));
  const targetX = startX < canvas.width / 2 ? canvas.width / 2 - popupHalf : canvas.width / 2 + popupHalf;
  const targetY = canvas.height / 2 - 42;

  drawPixelTrack(startX, startY, targetX, startY, 'rgba(0,230,200,0.28)');
  drawPixelTrack(targetX, startY, targetX, targetY, 'rgba(255,183,66,0.20)');
}

function drawProjectAnchor(bean) {
  const centerX = gridX(bean.x);
  const centerY = gridY(bean.y);
  const P = Math.max(2, Math.floor(CELL / 10));
  const active = selectedExpId === bean.exp.id;
  const halo = active ? 'rgba(0,230,200,0.14)' : 'rgba(168,176,178,0.08)';

  px(centerX - P * 3, centerY - P * 3, P * 6, P * 6, halo);
  if (active) {
    px(centerX - P * 4, centerY, P * 8, 1, 'rgba(0,230,200,0.28)');
    px(centerX, centerY - P * 4, 1, P * 8, 'rgba(255,183,66,0.22)');
  }
}

function draw() {
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = WHITE;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawBackgroundNoise();
  drawNodePaths();
  drawPopupConnection();

  candies.forEach(c => {
    const ox = c.x * CELL;
    const oy = c.y * CELL;
    const S = CELL;

    if (c.size === 1) {
      const p = Math.max(1, Math.round(S * 0.08));
      px(ox + S / 2 - p, oy + S / 2 - p, p * 2, p * 2, 'rgba(220,224,226,0.82)');
    } else if (c.size === 5) {
      const p = Math.max(1, Math.round(S * 0.1));
      const cross = [
        [0,1,0],
        [1,1,1],
        [0,1,0],
      ];
      const offX = ox + Math.floor(S / 2) - p * 1.5;
      const offY = oy + Math.floor(S / 2) - p * 1.5;
      cross.forEach((row, ry) => row.forEach((v, rx) => {
        if (v) px(offX + rx * p, offY + ry * p, p, p, 'rgba(201,205,206,0.78)');
      }));
    } else {
      const p = Math.max(1, Math.round(S * 0.11));
      const star = [
        [0,0,1,0,0],
        [0,1,1,1,0],
        [1,1,1,1,1],
        [0,1,1,1,0],
        [0,0,1,0,0],
      ];
      const offX = ox + Math.floor(S / 2) - p * 2.5;
      const offY = oy + Math.floor(S / 2) - p * 2.5;
      star.forEach((row, ry) => row.forEach((v, rx) => {
        if (v) px(offX + rx * p, offY + ry * p, p, p, 'rgba(255,183,66,0.55)');
      }));
    }
  });

  expBeans.forEach(drawProjectAnchor);
  drawSealEnemy();

  for (let i = snake.length - 1; i >= 1; i--) {
    const seg = snake[i];
    const ox = seg.x * CELL;
    const oy = seg.y * CELL;
    const S = CELL;
    const pad = Math.round(S * 0.36);
    const t = i / snake.length;
    const alpha = Math.max(0.08, 0.24 - t * 0.14);
    ctx.fillStyle = `rgba(255,183,66,${alpha})`;
    ctx.fillRect(ox + pad, oy + pad, S - pad * 2, S - pad * 2);
    ctx.fillStyle = `rgba(218,102,40,${alpha * 0.55})`;
    ctx.fillRect(ox + pad, oy + pad, S - pad * 2, 2);
    ctx.fillRect(ox + pad, oy + pad, 2, S - pad * 2);
  }

  if (snake[0]) drawMouse(snake[0], dir);
  renderProjectNodes();
}

function drawMouse(pos, d) {
  const ox = pos.x * CELL;
  const oy = pos.y * CELL;
  const S = CELL;
  const P = Math.max(2, Math.floor(S / 10));
  const cx = ox + S / 2;
  const cy = oy + S / 2;

  let angle = 0;
  if (d.x === 1) angle = 0;
  if (d.x === -1) angle = Math.PI;
  if (d.y === -1) angle = -Math.PI / 2;
  if (d.y === 1) angle = Math.PI / 2;

  px(cx - P * 4, cy + P * 4, P * 8, P, 'rgba(255,183,66,0.24)');

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);

  const p = (rx, ry, w, h, col) => {
    px(Math.round(rx - w / 2), Math.round(ry - h / 2), Math.round(w), Math.round(h), col);
  };

  const RAT_BODY = BRAND;
  const RAT_SHADE = EFF1;
  const RAT_OUTLINE = BLACK;
  const RAT_EAR = '#FFD4A8';
  const RAT_HL = '#FFF8E0';
  const RAT_TAIL = GREY_L;
  const RAT_NOSE = WHITE;

  p(-P * 6.2, 0, P * 2, P * 2, RAT_TAIL);
  p(-P * 8.6, P * 1.1, P * 1.5, P * 1.5, RAT_TAIL);

  p(-P * 4.2, -P * 4.2, P * 2.5, P * 2.5, RAT_OUTLINE);
  p(-P * 4.2, P * 4.2, P * 2.5, P * 2.5, RAT_OUTLINE);
  p(-P * 4.0, -P * 4.0, P * 2, P * 2, RAT_EAR);
  p(-P * 4.0, P * 4.0, P * 2, P * 2, RAT_EAR);
  p(-P * 3.8, -P * 3.8, P, P, RAT_HL);
  p(-P * 3.8, P * 3.8, P, P, RAT_HL);

  p(-P * 0.4, 0, P * 10, P * 8, RAT_OUTLINE);
  p(-P * 0.2, 0, P * 8, P * 6, RAT_BODY);
  p(P * 1.3, P * 1.7, P * 4, P, RAT_SHADE);
  p(P * 1.3, P * 1.7, P, P * 3.5, RAT_SHADE);
  p(-P * 2.0, -P * 1.8, P * 3, P, RAT_HL);
  p(-P * 2.0, -P * 1.8, P, P * 3, RAT_HL);

  p(P * 1.0, -P * 1.5, P, P * 1.4, RAT_OUTLINE);
  p(P * 1.0, P * 1.5, P, P * 1.4, RAT_OUTLINE);
  p(P * 1.2, -P * 1.8, P * 0.7, P * 0.7, RAT_HL);
  p(P * 1.2, P * 1.2, P * 0.7, P * 0.7, RAT_HL);
  p(P * 3.2, 0, P * 2, P * 2, RAT_OUTLINE);
  p(P * 3.4, 0, P * 1.4, P * 1.4, RAT_NOSE);
  p(P * 4.0, 0, P, P, RAT_SHADE);

  ctx.fillStyle = 'rgba(136,136,140,0.7)';
  ctx.fillRect(Math.round(P * 2.1), Math.round(-P * 0.8), Math.round(P * 3), 1);
  ctx.fillRect(Math.round(P * 2.1), Math.round(P * 1.2), Math.round(P * 3), 1);

  ctx.restore();
}
// Score floater
function drawSealEnemy() {
  if (!sealEnemy) return;

  const ox = sealEnemy.x * CELL;
  const oy = sealEnemy.y * CELL;
  const S = CELL * SEAL_SIZE_CELLS;
  const P = Math.max(2, Math.floor(S / 10));
  const target = snake[0] || { x: sealEnemy.x - 1, y: sealEnemy.y };
  const centerX = sealEnemy.x + SEAL_SIZE_CELLS / 2;
  const centerY = sealEnemy.y + SEAL_SIZE_CELLS / 2;
  const dx = target.x - centerX;
  const dy = target.y - centerY;

  let angle = 0;
  if (Math.abs(dx) >= Math.abs(dy)) {
    angle = dx >= 0 ? 0 : Math.PI;
  } else {
    angle = dy >= 0 ? Math.PI / 2 : -Math.PI / 2;
  }

  const MOUSE_BODY = '#F4F1EA';
  const MOUSE_DARK = GREY_L;
  const MOUSE_EAR = '#E9E3DA';
  const MOUSE_INNER = '#FFD4D1';
  const MOUSE_EYE = BLACK;
  const MOUSE_NOSE = '#C98E8A';
  const MOUSE_HL = WHITE;

  ctx.save();
  ctx.translate(ox + S / 2, oy + S / 2);
  ctx.rotate(angle);

  const p = (rx, ry, w, h, col) => {
    px(Math.round(rx - w / 2), Math.round(ry - h / 2), Math.round(w), Math.round(h), col);
  };

  const tailBase = -P * 5;
  p(tailBase - P * 1, P * 0.2, P * 2, P * 2, GREY_M);
  p(tailBase - P * 4, P * 0.8, P * 1.5, P * 1.5, '#D8C0BA');
  p(tailBase - P * 7, P * 0.3, P, P, '#D8C0BA');

  const earSize = P * 3;
  const earInner = P * 2;
  const earX = -P * 1;
  const earTopY = -P * 4.5;
  const earBotY = P * 4.5;
  p(earX, earTopY, earSize, earSize, MOUSE_EAR);
  p(earX, earBotY, earSize, earSize, MOUSE_EAR);
  p(earX - earSize / 2, earTopY, P, earSize, MOUSE_DARK);
  p(earX - earSize / 2, earBotY, P, earSize, MOUSE_DARK);
  p(earX + P * 0.3, earTopY, earInner, earInner, MOUSE_INNER);
  p(earX + P * 0.3, earBotY, earInner, earInner, MOUSE_INNER);

  const hSize = P * 8;
  p(0, 0, hSize, hSize, MOUSE_BODY);
  p(P * 2.5, P * 2.5, P * 5, P, MOUSE_DARK);
  p(P * 2.5, P * 2.5, P, P * 5, MOUSE_DARK);
  p(-P * 2, -P * 2, P * 3, P, MOUSE_HL);
  p(-P * 2, -P * 2, P, P * 3, MOUSE_HL);
  p(P * 1.5, -P * 1.8, P * 1.5, P * 1.5, MOUSE_EYE);
  p(P * 1.5, P * 1.8, P * 1.5, P * 1.5, MOUSE_EYE);
  p(P * 1.8, -P * 2.1, P, P, MOUSE_HL);
  p(P * 1.8, P * 1.5, P, P, MOUSE_HL);
  p(P * 3.5, 0, P * 1.5, P * 1.5, MOUSE_NOSE);

  ctx.fillStyle = GREY_M + 'aa';
  ctx.fillRect(Math.round(P * 1.7), Math.round(-P * 0.3), Math.round(P * 3), 1);
  ctx.fillRect(Math.round(P * 1.7), Math.round(P * 0.8), Math.round(P * 3), 1);
  ctx.restore();
}

function floatScore(text, col, row) {
  const el = document.createElement('div');
  el.className = 'score-float';
  el.textContent = text;
  el.style.left = (gridX(col)) + 'px';
  el.style.top  = (gridY(row)) + 'px';
  document.getElementById('home').appendChild(el);
  setTimeout(() => el.remove(), 800);
}

function updateScore(val) {
  const el = document.getElementById('pts-value');
  el.textContent = String(val).padStart(3, '0');
  el.classList.add('flash');
  setTimeout(() => el.classList.remove('flash'), 300);
  updateHud();
}

// Popup
function showPopup(exp) {
  popupOpen = true;
  isOnGame  = true;
  setSelectedProject(exp);
  document.getElementById('popup-tag').textContent    = exp.tag;
  document.getElementById('popup-title').textContent  = exp.title;
  document.getElementById('popup-company').textContent = exp.company;
  document.getElementById('popup-period').textContent = exp.period;
  document.getElementById('popup-desc').textContent   = exp.desc;
  popupPtsEl.style.display = exp.pts ? 'block' : 'none';
  popupPtsEl.textContent    = exp.pts ? '+' + exp.pts + ' pts' : '';
  popupViewBtn.href = exp.url;
  popupViewBtn.target = exp.newTab === false ? '_self' : '_blank';
  popupViewBtn.innerHTML = (exp.buttonLabel || 'View Project') + popupArrowIcon;
  document.getElementById('popup').classList.add('active');
  updateHud();
}

function closePopup() {
  popupOpen = false;
  document.getElementById('popup').classList.remove('active');
  spawnExpBeans();
  setSelectedProject(null);
}

// Pause toggle
function setHintState(playing) {
  const hint = document.getElementById('hint');
  if (playing) {
    hint.textContent = 'manual control // space or click to switch';
    hint.classList.add('playing');
  } else {
    hint.textContent = 'arrow keys to explore // space or click to switch modes';
    hint.classList.remove('playing');
  }
  updateHud();
}

function togglePause() {
  if (popupOpen) return;

  if (gameStarted) {
    // Player mode - hand back to auto-wander
    gameStarted = false;
    clearInterval(gameLoop);
    gameLoop = setInterval(tick, 200);
    setHintState(false);
  } else {
    // Auto-wander - player mode
    gameStarted = true;
    clearInterval(gameLoop);
    gameLoop = setInterval(tick, 140);
    setHintState(true);
  }
}

// Controls
const DIRS = {
  ArrowUp:    {x:0,y:-1}, ArrowDown:  {x:0,y:1},
  ArrowLeft:  {x:-1,y:0}, ArrowRight: {x:1,y:0},
  w:{x:0,y:-1}, s:{x:0,y:1}, a:{x:-1,y:0}, d:{x:1,y:0},
  W:{x:0,y:-1}, S:{x:0,y:1}, A:{x:-1,y:0}, D:{x:1,y:0},
};

document.addEventListener('keydown', e => {
  // Space = pause/resume toggle
  if (e.key === ' ' || e.code === 'Space') {
    e.preventDefault();
    togglePause();
    return;
  }
  if (DIRS[e.key]) {
    e.preventDefault();
    const nd = DIRS[e.key];
    if (nd.x !== -dir.x || nd.y !== -dir.y) {
      nextDir = nd;
      if (!gameStarted) {
        gameStarted = true;
        setHintState(true);
        clearInterval(gameLoop);
        gameLoop = setInterval(tick, 140);
      }
    }
  }
});

// Click on canvas = pause toggle (only direct canvas clicks)
canvas.addEventListener('click', e => {
  if (popupOpen) return;
  if (e.target !== canvas) return;
  togglePause();
});

// Touch
let touchStart = null;
document.addEventListener('touchstart', e => { touchStart = e.touches[0]; }, {passive:true});
document.addEventListener('touchend', e => {
  if (!touchStart) return;
  const dx = e.changedTouches[0].clientX - touchStart.clientX;
  const dy = e.changedTouches[0].clientY - touchStart.clientY;
  const dist = Math.sqrt(dx*dx + dy*dy);
  // Tap (no swipe) = pause
  if (dist < 10) { togglePause(); touchStart = null; return; }
  let nd;
  if (Math.abs(dx) > Math.abs(dy)) nd = dx > 0 ? {x:1,y:0} : {x:-1,y:0};
  else nd = dy > 0 ? {x:0,y:1} : {x:0,y:-1};
  if (nd.x !== -dir.x || nd.y !== -dir.y) {
    nextDir = nd;
    if (!gameStarted) {
      gameStarted = true;
      setHintState(true);
      clearInterval(gameLoop);
      gameLoop = setInterval(tick, 140);
    }
  }
  touchStart = null;
});

// Password Modal
const LE_SOCIAL_PASSWORD = 'mialyk2024'; // change this to real password

function showPasswordModal(e) {
  e.preventDefault();
  document.getElementById('pw-input').value = '';
  document.getElementById('pw-error').textContent = '';
  document.getElementById('pw-input').classList.remove('error');
  document.getElementById('pw-modal').classList.add('active');
  setTimeout(() => document.getElementById('pw-input').focus(), 100);
}

function closePwModal() {
  document.getElementById('pw-modal').classList.remove('active');
}

function checkPassword() {
  const val = document.getElementById('pw-input').value;
  if (val === LE_SOCIAL_PASSWORD) {
    closePwModal();
    // Navigate to Le.social project - update URL when ready
    window.location.href = '/lesocial.html';
  } else {
    document.getElementById('pw-input').classList.add('error');
    document.getElementById('pw-error').textContent = 'Incorrect password';
    document.getElementById('pw-input').value = '';
    setTimeout(() => {
      document.getElementById('pw-input').classList.remove('error');
    }, 1500);
  }
}

// Close modal on backdrop click
document.getElementById('pw-modal').addEventListener('click', function(e) {
  if (e.target === this) closePwModal();
});

// Start
function autoDemo() {
  initGame();
}
autoDemo();

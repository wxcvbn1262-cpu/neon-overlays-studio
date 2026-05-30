// Overlay configuration: the single source of truth shared by editor + overlay.
// Serializes to URL params (for OBS) and localStorage (for the editor).

export function defaultConfig() {
  return {
    name: 'YOUR NAME',
    theme: 'cyber',
    social: '@yourhandle',
    social2: '',
    goalLabel: 'FOLLOWER GOAL',
    goalCur: 740,
    goalTarget: 1000,
    showGoal: 1,
    showSocial: 1,
    showClock: 1,
    showCam: 1,
    showTicker: 1,
    scene: 'live',
    title: 'STARTING SOON',
    subtitle: 'STREAM BEGINS IN',
    cdMin: 5,
    demo: 0
  };
}

const NUM = new Set(['goalCur', 'goalTarget', 'showGoal', 'showSocial', 'showClock', 'showCam', 'showTicker', 'cdMin', 'demo']);

export function encodeConfig(cfg) {
  const p = new URLSearchParams();
  Object.keys(cfg).forEach(k => {
    if (cfg[k] !== '' && cfg[k] != null) p.set(k, cfg[k]);
  });
  return p.toString();
}

export function decodeConfig(search) {
  const cfg = defaultConfig();
  const p = new URLSearchParams(search);
  p.forEach((v, k) => {
    if (!(k in cfg)) { cfg[k] = v; return; }
    cfg[k] = NUM.has(k) ? Number(v) : v;
  });
  return cfg;
}

const KEY = 'neon-overlay-config';

export function saveLocal(cfg) {
  try { localStorage.setItem(KEY, JSON.stringify(cfg)); } catch (e) {}
}

export function loadLocal() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? Object.assign(defaultConfig(), JSON.parse(raw)) : null;
  } catch (e) { return null; }
}

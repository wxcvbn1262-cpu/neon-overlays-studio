// The Studio editor: binds controls, syncs a live preview iframe and exports
// ready-to-paste OBS browser-source URLs.
import { defaultConfig, encodeConfig, loadLocal, saveLocal } from './core/config.js';
import { THEMES, THEME_ORDER } from './core/themes.js';

let cfg = loadLocal() || defaultConfig();
const urlTheme = new URLSearchParams(location.search).get('theme');
if (urlTheme && THEMES[urlTheme]) cfg.theme = urlTheme;

const pv = document.getElementById('pv');
let bc = null;
try { bc = new BroadcastChannel('neon-overlay'); } catch (e) {}

function overlayUrl(extra) {
  const c = Object.assign({}, cfg, extra || {});
  return 'overlay.html?' + encodeConfig(c);
}
function absUrl(rel) { return new URL(rel, location.href).href; }

function refreshPreview(reload) {
  if (reload || !pv.src) { pv.src = overlayUrl({ preview: 1 }); return; }
  try { pv.contentWindow.postMessage({ type: 'config', cfg }, '*'); } catch (e) {}
  if (bc) bc.postMessage({ type: 'config', cfg });
}
function commit() { saveLocal(cfg); refreshPreview(false); }

function bindText(id, key) {
  const el = document.getElementById(id);
  if (!el) return;
  el.value = cfg[key] != null ? cfg[key] : '';
  el.addEventListener('input', () => {
    cfg[key] = el.type === 'number' ? Number(el.value) : el.value;
    commit();
  });
}

['f-name:name', 'f-social:social', 'f-social2:social2', 'f-goalLabel:goalLabel', 'f-goalCur:goalCur', 'f-goalTarget:goalTarget', 'f-title:title', 'f-subtitle:subtitle', 'f-cdMin:cdMin'].forEach(pair => {
  const [id, key] = pair.split(':');
  bindText(id, key);
});

// Theme swatches
const themeRow = document.getElementById('themeRow');
THEME_ORDER.forEach(id => {
  const t = THEMES[id];
  const b = document.createElement('div');
  b.className = 'sw' + (cfg.theme === id ? ' active' : '');
  b.style.background = 'linear-gradient(135deg,' + t.c1 + ',' + t.c2 + ')';
  b.title = t.name;
  b.onclick = () => {
    cfg.theme = id; cfg.c1 = ''; cfg.c2 = ''; cfg.accent = '';
    themeRow.querySelectorAll('.sw').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    commit();
  };
  themeRow.appendChild(b);
});

// Toggles
document.querySelectorAll('.switch').forEach(sw => {
  const key = sw.dataset.key;
  if (Number(cfg[key])) sw.classList.add('on');
  sw.onclick = () => {
    sw.classList.toggle('on');
    cfg[key] = sw.classList.contains('on') ? 1 : 0;
    commit();
  };
});

// Scene selector
const sceneFields = document.getElementById('sceneFields');
document.querySelectorAll('.seg button[data-scene]').forEach(btn => {
  if (cfg.scene === btn.dataset.scene) btn.classList.add('active');
  btn.onclick = () => {
    document.querySelectorAll('.seg button[data-scene]').forEach(x => x.classList.remove('active'));
    btn.classList.add('active');
    cfg.scene = btn.dataset.scene;
    sceneFields.style.display = cfg.scene === 'starting' ? 'block' : 'none';
    commit();
  };
});
sceneFields.style.display = cfg.scene === 'starting' ? 'block' : 'none';

// Test alerts
const ALERTS = {
  follow: { type: 'follow', user: 'NewViewer' },
  sub: { type: 'sub', user: 'PixelWolf' },
  donation: { type: 'donation', user: 'GhostRider', amount: '$10' },
  raid: { type: 'raid', user: 'QueenBee', amount: '128 viewers' }
};
document.querySelectorAll('[data-alert]').forEach(btn => {
  btn.onclick = () => {
    const alert = ALERTS[btn.dataset.alert];
    try { pv.contentWindow.postMessage({ type: 'alert', alert }, '*'); } catch (e) {}
    if (bc) bc.postMessage({ type: 'alert', alert });
  };
});

// Copy buttons
function copy(text, badgeId) {
  const done = () => {
    const c = document.getElementById(badgeId);
    if (c) { c.classList.add('show'); setTimeout(() => c.classList.remove('show'), 1600); }
  };
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, done);
  else { const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch (e) {} ta.remove(); done(); }
}
document.getElementById('copyLive').onclick = () => copy(absUrl(overlayUrl({ scene: 'live' })), 'copied1');
document.getElementById('copyStarting').onclick = () => copy(absUrl(overlayUrl({ scene: 'starting' })), 'copied2');
document.getElementById('copyBrb').onclick = () => copy(absUrl(overlayUrl({ scene: 'brb' })), 'copied2');
document.getElementById('copyEnding').onclick = () => copy(absUrl(overlayUrl({ scene: 'ending' })), 'copied2');

refreshPreview(true);

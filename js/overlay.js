// The OBS browser source. Renders a transparent overlay (or full scene) from a
// config carried in the URL, and live-updates via postMessage / BroadcastChannel.
import { decodeConfig, defaultConfig } from './core/config.js';
import { resolveTheme } from './core/themes.js';
import { createAlertManager, SAMPLE } from './alerts.js';
import { initParticles } from './core/particles.js';

let cfg = decodeConfig(location.search);
const root = document.getElementById('overlay');
const fxbg = document.getElementById('fxbg');
let alerts = null;
let clockTimer = null, cdTimer = null, demoTimer = null, cdEnd = 0;

if (fxbg) initParticles(fxbg, { count: 80 });

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}
function isScene() { return cfg.scene === 'starting' || cfg.scene === 'brb' || cfg.scene === 'ending'; }

function applyTheme() {
  const t = resolveTheme(cfg);
  const r = document.documentElement.style;
  r.setProperty('--c1', t.c1);
  r.setProperty('--c2', t.c2);
  r.setProperty('--accent', t.accent);
  r.setProperty('--pink', t.pink);
}

function liveHtml() {
  const initial = (String(cfg.name || 'A').trim().charAt(0) || 'A').toUpperCase();
  let h = '';
  if (Number(cfg.showCam)) h += '<div class="cam"><span class="liveb"><i></i>LIVE</span><span class="tagline">CAMERA</span></div>';
  if (Number(cfg.showClock)) h += '<div class="oclock"><div class="t" id="oc-t">--:--</div><div class="d" id="oc-d">--</div></div>';
  h += '<div class="botbar">';
  h += '<div class="idcard"><div class="av">' + initial + '</div><div><div class="nm">' + esc(cfg.name) + '</div>';
  if (Number(cfg.showSocial)) h += '<div class="soc">' + esc(cfg.social) + (cfg.social2 ? '  \u2022  ' + esc(cfg.social2) : '') + '</div>';
  h += '</div></div>';
  if (Number(cfg.showGoal)) {
    h += '<div class="goal"><div class="gtop"><span>' + esc(cfg.goalLabel) + '</span><b><span id="g-cur">' + cfg.goalCur + '</span> / ' + cfg.goalTarget + '</b></div><div class="gbar"><i id="g-bar"></i></div></div>';
  }
  h += '</div>';
  if (Number(cfg.showTicker)) h += '<div class="ticker" id="ticker">Welcome to the stream \u2728</div>';
  h += '<div id="alertLayer"></div>';
  return h;
}

function sceneHtml() {
  const titleMap = { starting: cfg.title || 'STARTING SOON', brb: 'BE RIGHT BACK', ending: 'THANKS FOR WATCHING' };
  const subMap = { starting: cfg.subtitle || 'STREAM BEGINS IN', brb: 'GRAB A DRINK \u2014 BACK IN A MOMENT', ending: 'SEE YOU NEXT TIME' };
  let h = '<div class="scene"><div class="ring"></div><div class="ring"></div>';
  h += '<div class="ttl grad-text">' + esc(titleMap[cfg.scene]) + '</div>';
  h += '<div class="sub">' + esc(subMap[cfg.scene]) + '</div>';
  if (cfg.scene === 'starting') h += '<div class="cd num" id="cd">--:--</div>';
  if (Number(cfg.showSocial)) h += '<div class="soc">' + esc(cfg.social) + (cfg.social2 ? '   ' + esc(cfg.social2) : '') + '</div>';
  h += '</div>';
  h += '<div id="alertLayer"></div>';
  return h;
}

function startClock() {
  if (clockTimer) clearInterval(clockTimer);
  const tick = () => {
    const t = document.getElementById('oc-t'), d = document.getElementById('oc-d');
    if (!t) return;
    const now = new Date();
    t.textContent = now.toTimeString().slice(0, 5);
    d.textContent = now.toDateString().toUpperCase();
  };
  tick(); clockTimer = setInterval(tick, 1000);
}

function animateGoal() {
  const bar = document.getElementById('g-bar');
  if (!bar) return;
  const pct = Math.min(100, (cfg.goalCur / Math.max(1, cfg.goalTarget)) * 100);
  setTimeout(() => { bar.style.width = pct + '%'; }, 220);
}

function startCountdown() {
  if (cdTimer) clearInterval(cdTimer);
  if (cfg.scene !== 'starting') return;
  cdEnd = Date.now() + Number(cfg.cdMin) * 60000;
  const tick = () => {
    const el = document.getElementById('cd');
    if (!el) return;
    const s = Math.max(0, Math.round((cdEnd - Date.now()) / 1000));
    const mm = String(Math.floor(s / 60)).padStart(2, '0');
    const ss = String(s % 60).padStart(2, '0');
    el.textContent = mm + ':' + ss;
  };
  tick(); cdTimer = setInterval(tick, 1000);
}

function startDemo() {
  if (demoTimer) clearInterval(demoTimer);
  let i = 0;
  const fire = () => {
    if (alerts) alerts.push(SAMPLE[i % SAMPLE.length]);
    i++;
    const cur = document.getElementById('g-cur'), bar = document.getElementById('g-bar');
    if (cur && bar) {
      cfg.goalCur = Math.min(cfg.goalTarget, cfg.goalCur + Math.ceil(Math.random() * 6));
      cur.textContent = cfg.goalCur;
      bar.style.width = Math.min(100, (cfg.goalCur / Math.max(1, cfg.goalTarget)) * 100) + '%';
    }
  };
  setTimeout(fire, 1200);
  demoTimer = setInterval(fire, 3600);
}

function build() {
  applyTheme();
  document.body.dataset.scene = cfg.scene;
  if (clockTimer) { clearInterval(clockTimer); clockTimer = null; }
  if (cdTimer) { clearInterval(cdTimer); cdTimer = null; }
  if (demoTimer) { clearInterval(demoTimer); demoTimer = null; }
  if (fxbg) fxbg.style.opacity = isScene() ? '0.55' : '0';
  root.innerHTML = isScene() ? sceneHtml() : liveHtml();
  alerts = createAlertManager(document.getElementById('alertLayer') || root);
  if (isScene()) startCountdown();
  else { startClock(); animateGoal(); }
  if (Number(cfg.demo)) startDemo();
}

function applyConfig(next) {
  cfg = Object.assign(defaultConfig(), next);
  build();
}

addEventListener('message', e => {
  const d = e.data || {};
  if (d.type === 'config') applyConfig(d.cfg);
  else if (d.type === 'alert' && alerts) alerts.push(d.alert);
});
try {
  const bc = new BroadcastChannel('neon-overlay');
  bc.onmessage = e => {
    const d = e.data || {};
    if (d.type === 'config') applyConfig(d.cfg);
    else if (d.type === 'alert' && alerts) alerts.push(d.alert);
  };
} catch (e) {}

build();

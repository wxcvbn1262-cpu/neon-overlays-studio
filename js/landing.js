// Landing page: particle hero, theme gallery, reveals, counters, mobile nav.
import { initParticles } from './core/particles.js';
import { THEMES, THEME_ORDER } from './core/themes.js';

const fx = document.getElementById('fx');
if (fx) initParticles(fx, { count: 90 });

// Nav
const nav = document.querySelector('.nav');
if (nav) addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 40));
const burger = document.querySelector('.burger');
const links = document.querySelector('.links');
if (burger && links) {
  burger.addEventListener('click', () => { links.classList.toggle('open'); burger.classList.toggle('active'); });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { links.classList.remove('open'); burger.classList.remove('active'); }));
}

// Build theme gallery
const gallery = document.getElementById('gallery');
if (gallery) {
  THEME_ORDER.forEach(id => {
    const t = THEMES[id];
    const card = document.createElement('a');
    card.className = 'theme-card';
    card.href = 'editor.html?theme=' + id;
    card.innerHTML =
      '<div class="swatch" style="background:radial-gradient(120% 120% at 20% 10%,' + t.c1 + '33,transparent 60%),radial-gradient(120% 120% at 90% 90%,' + t.c2 + '40,transparent 60%),linear-gradient(135deg,#0a0d18,#05070e)"></div>' +
      '<div class="label"><b style="color:' + t.c1 + '">' + t.name + '</b><span class="go">USE \u2192</span></div>';
    gallery.appendChild(card);
  });
}

// Reveal on scroll
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Counters
const cio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { count(e.target); cio.unobserve(e.target); } }), { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => cio.observe(el));
function count(el) {
  const to = parseFloat(el.dataset.count);
  const dec = parseInt(el.dataset.dec || '0', 10);
  const start = performance.now();
  (function f(now) {
    const p = Math.min(1, (now - start) / 1500);
    el.textContent = (to * (1 - Math.pow(1 - p, 3))).toFixed(dec);
    if (p < 1) requestAnimationFrame(f);
  })(start);
}

const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();

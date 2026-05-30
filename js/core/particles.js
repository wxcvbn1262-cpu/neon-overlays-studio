// Lightweight neon particle network drawn on a canvas. Reused on landing + overlay.
export function initParticles(canvas, opts = {}) {
  const ctx = canvas.getContext('2d');
  const colors = opts.colors || ['#22e1ff', '#8a5cff', '#ff4d9d'];
  const count = opts.count || 70;
  const linkDist = opts.linkDist || 130;
  let w = 0, h = 0, parts = [];

  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    w = canvas.width = canvas.offsetWidth * dpr;
    h = canvas.height = canvas.offsetHeight * dpr;
    canvas._dpr = dpr;
  }
  function make() {
    const dpr = canvas._dpr || 1;
    parts = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2.2 * dpr + 0.6,
      vx: (Math.random() - 0.5) * 0.25 * dpr,
      vy: (Math.random() - 0.5) * 0.25 * dpr,
      c: colors[Math.floor(Math.random() * colors.length)]
    }));
  }
  resize(); make();
  addEventListener('resize', () => { resize(); make(); });

  function frame() {
    const dpr = canvas._dpr || 1;
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.c;
      ctx.shadowColor = p.c;
      ctx.shadowBlur = 12 * dpr;
      ctx.fill();
      for (let j = i + 1; j < parts.length; j++) {
        const q = parts[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const d = Math.hypot(dx, dy);
        if (d < linkDist * dpr) {
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1 - d / (linkDist * dpr);
          ctx.strokeStyle = p.c;
          ctx.lineWidth = 0.6 * dpr;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

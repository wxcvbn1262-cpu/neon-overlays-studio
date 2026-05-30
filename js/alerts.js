// Animated alert queue. One alert shows at a time; the rest wait in line.
const ICONS = { follow: '\u2764\uFE0F', sub: '\u2B50', donation: '\uD83D\uDC8E', raid: '\uD83D\uDE80', host: '\uD83D\uDCE1' };
const VERB = { follow: 'just followed!', sub: 'just subscribed!', donation: 'donated', raid: 'is raiding with', host: 'is hosting!' };

export function createAlertManager(root) {
  const queue = [];
  let busy = false;

  function render(a) {
    busy = true;
    const card = document.createElement('div');
    card.className = 'alert';
    const extra = a.amount ? ' <b>' + a.amount + '</b>' : '';
    card.innerHTML =
      '<div class="alert-glow"></div>' +
      '<div class="alert-ico">' + (ICONS[a.type] || '\u2728') + '</div>' +
      '<div class="alert-body">' +
        '<div class="alert-user">' + escapeHtml(a.user || 'Someone') + '</div>' +
        '<div class="alert-text">' + (VERB[a.type] || 'did something') + extra + '</div>' +
      '</div>';
    root.appendChild(card);
    requestAnimationFrame(() => card.classList.add('show'));
    setTimeout(() => {
      card.classList.remove('show');
      card.classList.add('hide');
      setTimeout(() => { card.remove(); busy = false; next(); }, 650);
    }, 4200);
  }
  function next() { if (!busy && queue.length) render(queue.shift()); }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  }
  return { push(a) { queue.push(a); next(); } };
}

// Random sample events for demo mode / preview.
export const SAMPLE = [
  { type: 'follow', user: 'NovaByte' },
  { type: 'sub', user: 'PixelWolf' },
  { type: 'donation', user: 'GhostRider', amount: '$5' },
  { type: 'raid', user: 'QueenBee', amount: '128 viewers' },
  { type: 'follow', user: 'Zenith' },
  { type: 'donation', user: 'Lumen', amount: '$20' }
];

// Theme presets. Each defines a primary, secondary and accent neon color.
export const THEMES = {
  cyber:   { name: 'Cyber Neon', c1: '#22e1ff', c2: '#8a5cff', accent: '#3dff9e', pink: '#ff4d9d' },
  synth:   { name: 'Synthwave',  c1: '#ff4d9d', c2: '#8a5cff', accent: '#ffd24d', pink: '#ff7ad1' },
  toxic:   { name: 'Toxic',      c1: '#3dff9e', c2: '#22e1ff', accent: '#caff4d', pink: '#3dff9e' },
  crimson: { name: 'Crimson',    c1: '#ff4d5e', c2: '#ff9a3d', accent: '#ffd24d', pink: '#ff6b8a' },
  aurora:  { name: 'Aurora',     c1: '#22e1ff', c2: '#3dff9e', accent: '#8a5cff', pink: '#7af0ff' },
  gold:    { name: 'Gold Lux',   c1: '#ffd24d', c2: '#ff9a3d', accent: '#fff3c4', pink: '#ffd24d' }
};

export const THEME_ORDER = ['cyber', 'synth', 'toxic', 'crimson', 'aurora', 'gold'];

export function resolveTheme(cfg) {
  const t = THEMES[cfg.theme] || THEMES.cyber;
  return {
    name: t.name,
    c1: cfg.c1 || t.c1,
    c2: cfg.c2 || t.c2,
    accent: cfg.accent || t.accent,
    pink: t.pink
  };
}

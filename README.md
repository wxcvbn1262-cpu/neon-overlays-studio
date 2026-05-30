# ⚡ NEON Overlays Studio

Create **broadcast-grade, animated stream overlays** for Twitch, YouTube & Kick — no design skills, no extra software, 100% in your browser.

> "Make your stream look like a $10k production."

---

## ✨ Features

- 🎨 **6 hand-crafted neon themes** (Cyber, Synthwave, Toxic, Crimson, Aurora, Gold Lux)
- 🖥️ **Transparent OBS browser source** — drops straight on top of your gameplay
- 🔔 **Animated alerts** — follow / sub / donation / raid with neon pop-in
- 🎯 **Animated follower-goal bar**
- 🎬 **Full scenes** — *Starting Soon* (live countdown), *Be Right Back*, *Stream Ending*
- 🕒 Live clock, social handles, animated camera frame
- 🧪 **Demo mode** + a live **test-alert control panel** in the editor
- ⚙️ **Zero backend** — deploy free on GitHub Pages

## 🚀 Use it in OBS (60 seconds)

1. Open `editor.html`, pick a theme and customize your overlay.
2. Click **Copy Overlay URL**.
3. In OBS: **Sources → + → Browser**, paste the URL, set size to **1920×1080**, hit OK.
4. (Optional) Add the **scene URLs** below as extra browser sources for your intermission screens.

## 🎬 Scene URLs

| Scene | URL suffix |
|-------|------------|
| Live overlay | `overlay.html?...&scene=live` |
| Starting Soon | `overlay.html?...&scene=starting&cdMin=5` |
| Be Right Back | `overlay.html?...&scene=brb` |
| Stream Ending | `overlay.html?...&scene=ending` |

The editor builds these URLs for you automatically.

## 🧪 Demo mode

Append `?demo=1` to any overlay URL to auto-fire sample alerts and animate the goal bar — perfect for screenshots and previews.

## 🗂️ Project structure

```
neon-overlays-studio/
├─ index.html          # Landing page + theme gallery + pricing
├─ editor.html         # The Studio: customize + live preview + control panel
├─ overlay.html        # The OBS browser source (transparent)
├─ css/
│  ├─ base.css         # Design tokens, fonts, shared UI
│  ├─ landing.css
│  ├─ editor.css
│  └─ overlay.css
└─ js/
   ├─ core/
   │  ├─ config.js     # Encode/decode overlay config <-> URL + localStorage
   │  ├─ themes.js     # Theme presets
   │  └─ particles.js  # Reusable neon particle background
   ├─ landing.js
   ├─ editor.js        # Controls, live preview, copy URLs, test alerts
   ├─ overlay.js       # Renders the overlay + scenes from config
   └─ alerts.js        # Animated alert queue
```

## 🌐 Deploy free (GitHub Pages)

**Settings → Pages → Branch: `main` / root → Save.** Your studio goes live at:
`https://wxcvbn1262-cpu.github.io/neon-overlays-studio/`

## 💰 Monetization roadmap

- **Free** — all themes, scenes, manual/demo alerts, OBS export.
- **Pro ($9/mo)** — live Twitch/YouTube alert integration (OAuth), alert sounds, custom fonts.
- **Studio ($19/mo)** — logo upload, unlimited saved overlays, multi-scene packs, priority support.

## 🛠️ Tech

Vanilla JS (ES modules), Canvas, BroadcastChannel + postMessage live sync, pure CSS animations. No build step, no dependencies.

## 📄 License

MIT © 2026 wxcvbn1262-cpu

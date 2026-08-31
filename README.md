# Cyber Threat Intelligence Dashboard
### Abhimanyu Kumar — Portfolio Website

---

## Setup

```bash
npm install
npm run dev
# Open http://localhost:3000
```

---

## Architecture Overview

### Globe System
- **GlobeScene.tsx** — R3F Canvas with `EffectComposer` post-processing (Bloom, Vignette, ChromaticAberration, Noise)
- **GlobeMesh.tsx** — Ocean `SphereGeometry(5, 64, 64)` + single merged `LineSegments` for GeoJSON coastlines + 30° graticule. Zero individual `Line` objects.
- **AtmosphereShader.tsx** — Custom GLSL Fresnel vertex/fragment shader as an additive-blended sphere at `r=5.02`. Gives the globe a cyan atmospheric halo.
- **ThreatArcs.tsx** — 14 threat vectors as `QuadraticBezierCurve3` + `TubeGeometry` with custom GLSL `uProgress` arc-draw shader and traveling pulse.
- **GlobeNodes.tsx** — 6 geographic navigation anchors with `RingGeometry` radar-ping rings and `drei <Html>` hover labels.
- **CoordinateTracker.tsx** — Real-time lat/lon from Three.js Raycaster on globe hover.

### Camera System
- **CameraRig.tsx** — GSAP `power3.inOut` camera fly-to with globe rotation and scale dip on section change. Fires chromatic aberration callback on transition.
- **cameraPresets.ts** — Exact `[x, y, z]` positions for all 6 section views.

### Panel System
- **PanelManager.tsx** — Shows/hides panels with Framer Motion exit animations.
- Each panel: `glass-panel` glassmorphism + Framer Motion entry animation.
- **HeroOverlay** — GSAP `TextPlugin` name typing, live stat ticker, compass.
- **SkillsPanel** — Animated capability bars with GSAP stagger.
- **ProjectsPanel** — Incident report cards + full-screen classified operation modal.
- **ExperiencePanel** — Accordion mission log timeline + CSS 3D flip cert keycards.
- **ContactPanel** — Encrypted transmission form with progress animation.

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `← ArrowLeft` | Previous section |
| `→ ArrowRight` | Next section |
| `Ctrl + \`` | Toggle cyber terminal |
| `Escape` | Close terminal / modal |

---

## Terminal Commands (Ctrl + `)

| Command | Output |
|---------|--------|
| `help` | All available commands |
| `whoami` | Analyst profile summary |
| `scan` | Fake threat scan with progress |
| `ls projects` | List 3 deployed projects |
| `cat skills.txt` | All skills by category |
| `ping abhimanyu` | Ping home station node |
| `sudo hire me` | Hiring access request |
| `globe status` | Globe system diagnostics |
| `threat map` | ASCII world map with India pin |
| `clear` | Clear terminal output |
| `exit` | Close terminal |

---

## Updating Candidate Data

All candidate content lives in these files:

| File | Content |
|------|---------|
| `components/panels/HeroOverlay.tsx` | Name, title, status |
| `components/panels/AboutPanel.tsx` | Bio, stats, location |
| `components/panels/SkillsPanel.tsx` | Skill bars and tooltips |
| `components/panels/ProjectsPanel.tsx` | Project cards and modal details |
| `components/panels/ExperiencePanel.tsx` | Timeline and certifications |
| `components/panels/ContactPanel.tsx` | Email, LinkedIn, GitHub |
| `components/terminal/commands.ts` | Terminal command outputs |
| `lib/threatArcs.ts` | Threat arc origins, destinations, types |
| `lib/globeNodes.ts` | Node coordinates |
| `app/layout.tsx` | SEO metadata and JSON-LD schema |

---

## Deployment (Vercel)

```bash
npm run build   # verify zero errors
vercel          # deploy
```

Set environment variables in Vercel if needed (none required for static portfolio).

---

## Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript strict mode
- **3D**: Three.js + React Three Fiber + @react-three/drei + @react-three/postprocessing
- **Shaders**: Custom GLSL (atmosphere Fresnel, arc pulse with uProgress)
- **Animation**: GSAP (TextPlugin, camera tweens) + Framer Motion (panel transitions)
- **Styling**: Tailwind CSS v3 + CSS custom properties
- **Fonts**: Orbitron (display) + Inter (body) via next/font
- **Icons**: Lucide React

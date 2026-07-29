# Reza Shakourzad Landing

A cinematic Persian landing page for an educational website focused on **Artificial Intelligence** and **Mathematics**.

This project is the first public-facing layer of the website: a polished RTL landing page that introduces the learning paths, guides the visitor toward the next step, and creates a modern visual identity for the platform.

The design uses a dark, immersive interface with animated WebGL visuals, smooth motion, Persian typography, and interactive cards for the two main learning paths.

Repository: [github.com/MrAshki/reza-shakourzad-landing](https://github.com/MrAshki/reza-shakourzad-landing)

---

## What this project is

This repository contains the current version of the landing page for Reza Shakourzad’s educational website.

The page is designed for Persian-speaking users and is fully right-to-left. It introduces two learning tracks:

- **Artificial Intelligence** — for learning AI concepts and building practical AI projects.
- **Mathematics** — for strengthening the mathematical foundation needed for applied problem solving.

The current version is focused on presentation, visual identity, and user entry flow. It is ready to be reviewed as a landing page, but it is not yet a complete learning platform.

---

## Current status

The landing page is implemented, cleaned up, tested, and pushed to GitHub.

Current repository state:

```text
Branch: master
Latest README update: 3f0e700
Previous stable cleanup commit: 879948d
```

Implemented features:

- Persian RTL landing page
- Cinematic dark visual style
- Interactive Three.js background
- Hero section with Persian messaging
- Primary CTA: “Start now for free”
- Smooth scroll from the hero CTA to the learning paths section
- Header that fades away while scrolling down
- AI learning path card
- Mathematics learning path card with animated math symbols
- Motion-based UI transitions
- Basic render tests and quality checks

---

## What is not included yet

This project is currently only the landing page.

The following parts are not implemented in this version:

- Backend API
- Database
- Authentication or user accounts
- Dashboard
- Admin panel
- Payment or subscription system
- Real assessment pages
- Assessment logic or question flow

The assessment links are currently reserved for the next development phase:

```text
/assessment?path=ai
/assessment?path=math
```

They show where the future AI and Mathematics assessment flows can be connected later.

---

## Technical stack

The project is built with a modern frontend stack:

- **React** for the user interface
- **TypeScript** for type-safe development
- **Vinext / Vite** for the application and build workflow
- **Three.js** for WebGL-based interactive visuals
- **Motion** for UI animation and transitions
- **Vazirmatn** for Persian typography
- **Lucide React** for lightweight icons
- **ESLint, TypeScript, Prettier, and Node test runner** for quality checks

The project also includes Cloudflare-related tooling, so Cloudflare is a possible deployment direction if desired.

---

## Where the processing happens

Most of the visible interaction happens in the visitor’s browser.

The server or hosting provider mainly serves the built files. The animated background, Three.js scenes, scroll effects, card visuals, and UI transitions all run on the client side.

This means the hosting server does not need heavy CPU or GPU resources. The smoothness of the experience depends more on the visitor’s device, browser, and GPU support.

In short:

- The **server** serves the website.
- The **browser** runs the animations and Three.js scenes.
- There is currently **no backend processing**, database, or user-specific server logic.

---

## Build size and performance

The latest local production build is approximately:

```text
dist: about 5.7 MB
client assets: about 1.2 MB raw
```

The largest client-side file is Three.js:

```text
three.module: about 516 KB
```

That is expected because the landing page uses WebGL visuals. The build currently shows a non-blocking warning that one client chunk is larger than 500 KB. The project still builds successfully and all tests pass.

If performance becomes a priority in the next phase, the best improvement would be to lazy-load the Three.js sections and reduce animation complexity on weaker mobile devices.

---

## Recommended client devices

Because Three.js runs in the browser, the visitor’s device matters.

The site should work on modern devices with WebGL enabled. For a comfortable experience, a reasonably recent phone or laptop is recommended.

Minimum practical target:

- Modern Chrome, Edge, Safari, or Firefox
- WebGL enabled
- 4 GB RAM on desktop/laptop
- 3–4 GB RAM on mobile
- A reasonably recent integrated GPU

Recommended target:

- 8 GB RAM on desktop/laptop
- Quad-core CPU or better
- Modern integrated GPU or any dedicated GPU
- iPhone XS/XR or newer
- Android mid-range devices from around 2019 or newer

On older or weaker devices, the website should still load, but animations may be less smooth and battery usage may be higher.

---

## Hosting recommendation

Since this version is a frontend landing page, it can be deployed on a lightweight hosting setup.

A simple production setup can be:

- Node.js `>= 22.13.0`
- 1 vCPU
- 1 GB RAM
- HTTPS enabled
- CDN recommended
- gzip or Brotli compression enabled

A more comfortable production setup would be:

- 2 vCPU
- 2 GB RAM
- Node.js `>= 22.13.0`
- Nginx or Caddy if using a VPS
- HTTPS, CDN, and compression enabled

Cloudflare is also a good option because the project already includes Cloudflare-related tooling. A final deployment script/config may still be needed depending on the chosen hosting platform.

---

## Running the project

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Start the production server using the project script:

```bash
npm run start
```

---

## Quality checks

Before delivery or deployment, run:

```bash
npm run format
npm run lint
npm run type-check
npm run build
npm test
```

The latest version has passed all of these checks.

---

## Suggested next phase

The next phase should turn the landing page into a real product flow.

Recommended next steps:

1. Build the real assessment pages.
2. Design the AI and Mathematics question flows.
3. Store user results.
4. Add backend/API if persistent user data is needed.
5. Optimize Three.js loading for production performance.
6. Deploy the site with domain, HTTPS, CDN, and monitoring.

---

## Short message for review

You can share the repository with this message:

> Hello Professor, I prepared the first version of the Persian landing page for your educational website. It is a React/TypeScript/Vinext project with a dark RTL design, interactive Three.js visuals, AI and Mathematics learning path cards, and a clear CTA flow. The current version is only the landing page; backend, assessment logic, authentication, database, and dashboard can be developed in the next phase. The README includes the technical stack, deployment notes, performance details, and device requirements.
>
> Repository: https://github.com/MrAshki/reza-shakourzad-landing

# LandingPage6

A modern, static landing page built with semantic HTML, hand-written CSS, and a small
TypeScript layer for interactive components. The page composes three self-contained
sections — **Hero**, **Features**, and **Contact** — each accessible, responsive, and
ready to ship.

## What the project does

LandingPage6 is a production-quality marketing page that loads instantly, has no
client-side framework dependencies, and showcases three independently composed
sections that can be reused or reordered without touching the others:

- **Hero** — headline, supporting subheadline, primary call-to-action, and a
  polished background treatment with clear typographic hierarchy.
- **Features** — a grid of feature cards, each with a visual, title, and short
  description, styled with consistent spacing and accessible typography.
- **Contact** — a fully accessible contact form with client-side validation,
  inline error messaging, and a graceful success state on submit.

All styling is hand-written (no Tailwind, no CSS-in-JS), all interactivity is
implemented in plain TypeScript, and every section is keyboard- and
screen-reader-friendly.

## Run it locally

Requirements: **Node.js ≥ 18** (Node 20 LTS recommended).

```bash
# 1. Install the single dev dependency (the static file server)
npm install

# 2. Serve the static site from ./public on http://localhost:3000
npm start
# equivalent to:
npx --yes serve public -l 3000
```

Open <http://localhost:3000> in your browser. No build step, no bundler — the
TypeScript in `src/features/` is loaded directly by the browser as ES modules.

## Project structure
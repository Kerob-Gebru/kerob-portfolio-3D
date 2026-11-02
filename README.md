# Kerob Gebru — Portfolio

A dark, scroll-driven personal portfolio built with Next.js 14, TypeScript and Tailwind CSS. The page opens behind a veil of dust that clears onto a ridgeline where an amber orb rises under a widely tracked **KEROB** title, then flies through a pinned timeline, a drawn "source → production" stack trajectory, a project grid, and a contact section with a live Addis Ababa clock.

## How it works

- **One rAF loop runs the page.** `lib/scroll.ts` advances [Lenis](https://github.com/darkroomengineering/lenis), then every scroll-driven component reads its own position and writes styles directly. Nothing scroll-driven goes through React state, so the page never re-renders mid-scroll. There is no animation library.
- **The hero is six SVG layers**, stacked and pinned, each moved at its own rate by the scroll (sky, orb, far ridges, cliffs, acacia, ground). No images to download.
- **The stack is drawn, not animated on a timer.** `components/Stack.tsx` pins and inks four legs in order (languages → frameworks → data & messaging → delivery) with a capsule riding the active leg.
- **The timeline is a reel.** `components/Timeline.tsx` pins and slides sideways; the frame nearest the focus line is in focus, the rest dim back.

Type: Michroma (display), Manrope (text), IBM Plex Mono (telemetry), loaded with `next/font`.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint     # tsc --noEmit
npm run build
```

## Editing content

Everything on the page lives in two files:

- `data/content.ts` — name, links, about text, timeline, stack legs, contact copy
- `data/projects.ts` — project cards (title, description, stack, links, category, status)

Checks worth doing after changes: no sideways scroll at 390, 768, 1280 and 1920 px; the dust clears before the orb starts to rise; the reel's centre frame is the one in focus.

## Deploying

Import the repo at [vercel.com/new](https://vercel.com/new) — no configuration needed.

## License

MIT

# Impostor — Pass-and-Play Party Game

A PWA (Progressive Web App) for the "Impostor" social deduction party game. One phone, passed around the room. No installs, no accounts, no internet required after first load.

## The Game

Everyone gets a secret word except the impostor. Players give one-word clues, then debate and vote on who the impostor is. The impostor tries to blend in.

## Tech Stack

- **Pure HTML/CSS/JS** — no frameworks, no build step
- **PWA** with service worker for offline play
- **Hosted on GitHub Pages** — free, simple deployment
- **Local Storage** for persisting settings and custom words

## Game Modes (MVP)

1. **Classic** — Civilians see a word, impostor sees "IMPOSTOR"
2. **Undercover** — Civilians get word A, impostor gets a similar word B (harder, more fun)
3. **Mr. White** — One player gets absolutely nothing and must pure-bluff

## Key UX Decisions

- **Hold-to-reveal** for peeking at your word (proven best pattern)
- **< 30 seconds from open to playing** — minimal setup friction
- **Offline-first** — service worker caches everything
- **Mobile-first design** — optimized for passing a phone around
- **No ads, no accounts, no tracking**

## Status

- [x] Research complete (see `research.md`)
- [ ] Build MVP
- [ ] Deploy to GitHub Pages
- [ ] Playtest with friends

## Files

- `research.md` — Deep research on existing games, mechanics, word lists, UI patterns
- `README.md` — This file (project overview)

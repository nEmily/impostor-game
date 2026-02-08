# Impostor

A pass-and-play party game for your phone. One device, passed around the room — no installs, no accounts, no internet needed after first load.

Everyone gets a secret word except the impostor. Take turns giving one-word clues, debate who's faking it, and vote. The impostor tries to blend in without knowing the word.

## Play it

Hosted on GitHub Pages: **https://nemily.github.io/impostor-game/**

Or run it locally — it's just static files, no build step:

```
npx http-server . -p 8080
```

Then open http://localhost:8080 on your phone.

## How it works

1. Add 3+ players
2. Pick word categories (Brain Rot, Movies, Music, etc.) or make your own
3. Pass the phone around — each player holds a button to peek at their word
4. One player is secretly the impostor and doesn't know the word
5. Take turns giving one-word clues, discuss, vote on who's faking it

## Features

- **Hold-to-reveal** — peek at your word without anyone else seeing
- **15 built-in word packs** with 500+ words and hints
- **Custom word packs** — add your own
- **Timer** — optional round timer (1–10 min)
- **1 or 2 impostors** — scale the chaos
- **Offline-first** — works without internet after first load (PWA with service worker)
- **Installable** — add to home screen for an app-like experience

## Tech

Pure HTML/CSS/JS. No frameworks, no build step, no dependencies. Hosted on GitHub Pages.

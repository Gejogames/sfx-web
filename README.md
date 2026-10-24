# sfx-web

A zero-asset sound effects kit for the browser. Every sound is synthesized with the Web Audio API — no audio files, no loading screens, no dependencies. ~100 lines, ~2 KB.

Made for small web games and apps that need a handful of bleeps and chimes without shipping an asset folder.

## Use it

It's one file. Copy `sfx.js` into your project and import it:

```html
<script type="module">
  import { sfx } from "./sfx.js"
  button.onclick = () => sfx.coin()
</script>
```

Or via npm-style tools — just point your bundler at the file. TypeScript types are included in `sfx.d.ts`.

## Sounds

| Call | Feel |
|------|------|
| `sfx.blip()` | soft confirm — buttons, taps |
| `sfx.confirm()` | rising two-note yes |
| `sfx.coin()` | bright pickup/collect |
| `sfx.success()` | three-note win |
| `sfx.error()` | falling two-note no |
| `sfx.thud()` | low impact |
| `sfx.whoosh()` | downward swipe/water |
| `sfx.launch()` | upward whoosh — jumps |
| `sfx.tick()` | tiny UI tick |
| `sfx.start()` | ascending "go" phrase |
| `sfx.over()` | descending game-over phrase |

## Compose your own

```js
sfx.custom([
  [440, 0.1, "triangle", 0.06],        // freq, dur, type, vol
  [660, 0.1, "triangle", 0.06, 0.09],  // + start delay in seconds
])

// or go raw
sfx.tone(880, 0.2, "square", 0.05)
sfx.sweep(300, 1200, 0.25, "sine", 0.05)
```

## Mute

```js
sfx.muted = true   // persisted in localStorage automatically
```

The AudioContext unlocks itself on the first user gesture, so autoplay policies are satisfied — just call sounds from event handlers as usual.

## Demo

Open `demo/index.html` (serve the folder with any static server, e.g. `npx serve .`).

## License

MIT

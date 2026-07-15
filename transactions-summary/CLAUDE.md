# Transaction Summary

Static browser tool. See [README.md](README.md) and [SPEC.md](SPEC.md) for full behavior.

## Architecture

- `core.mjs` — parsing and formatting (tested in Node)
- `ui.js` — DOM rendering and event handlers (browser only)
- `build.js` — concatenates `core.mjs` + `ui.js` into `app.js` (strips `export` keywords)
- `app.js` — generated bundle loaded by `index.html`; do not edit by hand

## Development

```bash
npm run build   # regenerate app.js after editing core.mjs or ui.js
npm test        # build + run Node unit tests (imports from core.mjs)
```

## Domain rules

- Amounts default to **INR** unless a line has an explicit currency marker (`$`, `€`, `£`, etc.).
- Grand total is omitted when mixed currencies are detected; per-line amounts still display.
- No exchange-rate conversion, persistence, or backend.
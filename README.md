# LandingPage6

A modern, static landing page built with semantic HTML, hand-written CSS, and a small
TypeScript layer for interactive components. The page composes three self-contained
sections — **Hero**, **Features**, and **Contact** — each accessible, responsive, and
ready to ship.

## Troubleshooting

### `npm install` / `npx serve` fails with `EPERM: operation not permitted, uv_cwd`

This happens on macOS when `node_modules` was created by a different user
(often `root` from an earlier `sudo` invocation) or when a leftover `serve`
process is still holding the working directory. Fix it with:

```bash
npm run fix:eperm
# or directly:
bash scripts/fix-npm-eperm.sh
```

The script will:
1. Kill any lingering `serve` / `npx` processes holding the CWD.
2. Remove the stale `node_modules` (using Finder Trash as a fallback when `rm` is denied).
3. Strip macOS quarantine / extended attributes on the project directory.
4. Reinstall dependencies as the current user.
5. Verify `process.chdir` succeeds so `npm` / `npx` no longer throw `uv_cwd`.

## Project structure

### `npm install` / `npx serve` fails with `EPERM: operation not permitted, uv_cwd`

This happens on macOS when `node_modules` was created by a different user
(often `root` from an earlier `sudo` invocation) or when a leftover `serve`
process is still holding the working directory. Fix it with:


## Project structure
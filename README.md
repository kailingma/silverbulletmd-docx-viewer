# silverbullet-docxviewer

A [SilverBullet](https://silverbullet.md) plug that renders `.docx` files in-place using [docx-preview](https://github.com/VolodymyrBaydalka/docxjs). The titlebar stays visible; the viewer replaces only the editor area.

Supports `.docx`, `.docm`, `.dotx`. Legacy binary `.doc` files are not supported by the underlying library.

> Requires network access to jsDelivr to load the docx-preview library on first open.

## Install

Add to your `PLUGS` page (or via `config.set` in Space Lua):

```yaml
plugs:
  - "github:kailingma/silverbullet-docxviewer/docxviewer.plug.js"
```

Then run **Plugs: Update**.

For a pinned release:

```yaml
plugs:
  - "ghr:kailingma/silverbullet-docxviewer"
```

## Releases

Commits whose message matches `v<semver>` (e.g. `v0.2.0`) are automatically built and published as a GitHub Release with the compiled plug attached.

## Building locally

```bash
npm install
npm run build
```
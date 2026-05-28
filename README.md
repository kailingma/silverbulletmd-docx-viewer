# silverbullet-docxviewer

A [SilverBullet](https://silverbullet.md) plug that renders `.docx` files in-place using [docx-preview](https://github.com/VolodymyrBaydalka/docxjs). The titlebar stays visible; the viewer replaces only the editor area.

Supports `.docx`, `.docm`, `.dotx`. Legacy binary `.doc` files are not supported by the underlying library.

> Requires network access to jsDelivr to load the docx-preview library on first open.

## Install via Library Manager (recommended)

Run **Library: Install** and paste:

```
https://github.com/yourusername/silverbullet-docxviewer/blob/main/PLUG.md
```

## Install manually

Add to a page tagged `meta/config` in your space:

```yaml
plugs:
  - "github:yourusername/silverbullet-docxviewer/docxviewer.plug.js"
```

For a pinned release: `ghr:yourusername/silverbullet-docxviewer`

## Releases

Commits whose message starts with `v<semver>` (e.g. `v0.2.0`) are automatically built and published as a GitHub Release.

## Building locally

```bash
npm install
npm run build
```
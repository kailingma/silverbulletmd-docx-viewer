# silverbulletmd-docx-viewer

A [SilverBullet](https://silverbullet.md) plug that renders `.docx` files in-place using [docx-preview](https://github.com/VolodymyrBaydalka/docxjs). The titlebar stays visible; the viewer replaces only the editor area.

Supports `.docx`, `.docm`, `.dotx`. Legacy binary `.doc` files are not supported by the underlying library.

> Requires network access to jsDelivr to load the docx-preview library on first open.

## Install via Library Manager (recommended)

Run **Library: Install** and paste:

```
https://github.com/kailingma/silverbulletmd-docx-viewer/blob/main/PLUG.md
```

## Install manually

Add to a page tagged `meta/config` in your space:

```yaml
plugs:
  - "github:kailingma/silverbulletmd-docx-viewer/docxviewer.plug.js"
```

For a pinned release: `ghr:kailingma/silverbulletmd-docx-viewer`

## Releases

Commits whose message starts with `v<semver>` (e.g. `v0.2.0`) are automatically built and published as a GitHub Release.

## Building locally

```bash
npm install
npm run build
```

# Todo
- Make the docx-viewer open in the same tab, similar to [silverbullet-pdf](https://github.com/MrMugame/silverbullet-pdf)
- Integrate greater features into the viewer (dependent on using a different viewer than docx-preview)
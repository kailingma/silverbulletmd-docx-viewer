export async function editor(): Promise<{ html: string; script: string }> {
  return {
    html: `
      <style>
        /* ─── Reset & base ─────────────────────────────────────────────── */
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          /* Light theme — mirrors SB theme.scss html {} block exactly */
          --sb-bg:          #fff;
          --sb-fg:          #111;
          --sb-page-bg:     #fff;
          --sb-canvas-bg:   #e1e1e1;
          --sb-accent:      #464cfc;
          --sb-subtle:      #676767;
          --sb-subtle-bg:   rgba(72,72,72,0.1);
          --sb-border:      #cacaca;
          --sb-ui-font:     -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
                            "Helvetica Neue", Arial, "Noto Sans", sans-serif;
          --sb-shadow:      0 2px 8px rgba(0,0,0,0.12);
          --sb-page-w:      800px;
          --sb-page-pad:    40px 48px;
          --sb-page-margin: 24px auto;
          --sb-link:        #0330cb;
          --sb-code-bg:     rgba(72,72,72,0.1);
          --sb-code-fg:     #7c828e;
          --sb-table-head:  #333;
          --sb-table-head-fg: #eee;
          --sb-table-even:  #f3f3f3;
          --sb-blockquote-border: rgb(74,74,74);
        }

        @media (prefers-color-scheme: dark) {
          :root {
            /* Dark theme — mirrors SB theme.scss html[data-theme="dark"] {} */
            --sb-bg:          #111;
            --sb-fg:          #fff;
            --sb-page-bg:     #1a1a1a;
            --sb-canvas-bg:   #262626;
            --sb-accent:      #7e99fc;
            --sb-subtle:      #959595;
            --sb-subtle-bg:   rgba(105,105,105,0.1);
            --sb-border:      rgb(62,62,62);
            --sb-shadow:      0 2px 8px rgba(0,0,0,0.45);
            --sb-link:        #7e99fc;
            --sb-code-bg:     rgba(105,105,105,0.1);
            --sb-code-fg:     #aaa;
            --sb-table-head:  rgba(72,72,72,0.4);
            --sb-table-head-fg: #eee;
            --sb-table-even:  rgba(72,72,72,0.3);
            --sb-blockquote-border: rgb(74,74,74);
          }
        }

        html, body {
          height: 100%;
          background: var(--sb-canvas-bg);
          color: var(--sb-fg);
          font-family: var(--sb-ui-font);
        }

        /* ─── Scroll container ─────────────────────────────────────────── */
        #docx-container {
          height: 100%;
          overflow-y: auto;
          background: var(--sb-canvas-bg);
          padding: 0;
        }

        /* ─── Loading / error states ────────────────────────────────────── */
        #docx-loading {
          display: none;
          padding: 24px;
          color: var(--sb-subtle);
          font-size: 14px;
        }

        #docx-error {
          display: none;
          color: #c00;
          padding: 24px;
          font-size: 14px;
        }

        /* ─── Page card ─────────────────────────────────────────────────── */
        #docx-render {
          min-height: 100%;
          background: var(--sb-page-bg);
          max-width: var(--sb-page-w);
          margin: var(--sb-page-margin);
          box-shadow: var(--sb-shadow);
          padding: var(--sb-page-pad);
        }

        /* ─── docx-preview emitted classes (className="docx-preview") ──── */
        /* The library prefixes all its classes with the className option.
           We set className:"docx-preview", so classes are:
           .docx-preview-wrapper, .docx-preview-page, .docx-preview-body,
           .docx-preview-header, .docx-preview-footer, etc.
           We also cover the default prefix "docx" as a fallback.          */

        .docx-preview-wrapper, .docx-wrapper {
          background: transparent !important;
          padding: 0 !important;
        }

        .docx-preview-page, .docx-page {
          background: var(--sb-page-bg) !important;
          color: var(--sb-fg) !important;
          box-shadow: none !important;
          margin: 0 0 1px 0 !important;
          padding: 0 !important;
        }

        /* Headers and footers — keep them muted like SB's meta text */
        .docx-preview-header, .docx-header,
        .docx-preview-footer, .docx-footer {
          color: var(--sb-subtle) !important;
          font-size: 0.85em !important;
          border-color: var(--sb-border) !important;
        }

        /* Body text inherits SB's fg colour */
        .docx-preview-body, .docx-body {
          color: var(--sb-fg) !important;
        }

        /* Hyperlinks */
        .docx-preview-wrapper a, .docx-wrapper a {
          color: var(--sb-link) !important;
          text-decoration: underline;
          pointer-events: none; /* prevent navigation inside viewer */
        }

        /* Tables — match SB editor table styles */
        .docx-preview-wrapper table, .docx-wrapper table {
          border-collapse: collapse;
          width: 100%;
        }
        .docx-preview-wrapper th, .docx-wrapper th {
          background: var(--sb-table-head) !important;
          color: var(--sb-table-head-fg) !important;
        }
        .docx-preview-wrapper tr:nth-child(even) td,
        .docx-wrapper tr:nth-child(even) td {
          background: var(--sb-table-even) !important;
        }

        /* Inline code / pre */
        .docx-preview-wrapper code, .docx-wrapper code,
        .docx-preview-wrapper pre,  .docx-wrapper pre {
          background: var(--sb-code-bg) !important;
          color: var(--sb-code-fg) !important;
          font-family: "iA-Mono", "Menlo", monospace;
          font-size: 0.9em;
          border-radius: 3px;
          padding: 0.1em 0.3em;
        }

        /* Blockquotes */
        .docx-preview-wrapper blockquote, .docx-wrapper blockquote {
          border-left: 3px solid var(--sb-blockquote-border);
          background: var(--sb-subtle-bg);
          color: var(--sb-subtle);
          padding: 0.5em 1em;
          margin: 0.5em 0;
        }

        /* Page break dividers */
        .docx-preview-page-break, .docx-page-break {
          border: none !important;
          border-top: 1px solid var(--sb-border) !important;
          margin: 0 !important;
        }
      </style>

      <div id="docx-container">
        <div id="docx-loading">Loading document…</div>
        <div id="docx-render"></div>
        <div id="docx-error"></div>
      </div>
    `,

    script: `
      (function () {
        const DOCX_ESM = "https://esm.sh/docx-preview@0.3.7";
        let docxModule = null;

        function showError(msg) {
          document.getElementById("docx-error").style.display  = "block";
          document.getElementById("docx-error").textContent    = "Error: " + msg;
          document.getElementById("docx-render").style.display = "none";
          document.getElementById("docx-loading").style.display = "none";
        }

        function setLoading(on) {
          document.getElementById("docx-loading").style.display = on ? "block" : "none";
        }

        // Intercept ALL clicks inside the rendered document so links never
        // trigger navigation (which opens a new tab in PWA mode).
        document.addEventListener("click", function (e) {
          const a = e.target.closest("a");
          if (a) { e.preventDefault(); e.stopPropagation(); }
        }, true);

        async function getModule() {
          if (!docxModule) docxModule = await import(DOCX_ESM);
          return docxModule;
        }

        async function render(data) {
          const container = document.getElementById("docx-render");
          if (!container) return;

          setLoading(true);
          document.getElementById("docx-error").style.display  = "none";
          document.getElementById("docx-render").style.display = "";

          let mod;
          try {
            mod = await getModule();
          } catch (e) {
            showError("Could not load docx-preview. Check network access to esm.sh.");
            return;
          }

          try {
            container.innerHTML = "";
            const blob = new Blob([data], {
              type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            });

            await mod.renderAsync(blob, container, null, {
              className:                    "docx-preview",
              inWrapper:                    true,
              ignoreWidth:                  false,
              ignoreHeight:                 false,
              ignoreFonts:                  false,
              breakPages:                   true,
              ignoreLastRenderedPageBreak:  true,
              renderHeaders:                true,
              renderFooters:                true,
              renderFootnotes:              true,
              renderEndnotes:               true,
              renderChanges:                false,
              useBase64URL:                 true,
            });
          } catch (e) {
            showError(e.message || "Failed to render document.");
          } finally {
            setLoading(false);
          }
        }

        globalThis.silverbullet.addEventListener("file-open",   e => render(e.detail.data));
        globalThis.silverbullet.addEventListener("file-update", e => render(e.detail.data));
      })();
    `,
  };
}
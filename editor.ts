export async function editor(): Promise<{ html: string; script: string }> {
  return {
    html: `
      <div id="docx-container" style="
        height: 100%;
        overflow-y: auto;
        background: #f0f0f0;
        padding: 0;
        box-sizing: border-box;
      ">
        <div id="docx-render" style="
          min-height: 100%;
          background: white;
          max-width: 900px;
          margin: 24px auto;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          padding: 40px 48px;
          box-sizing: border-box;
        "></div>
        <div id="docx-error" style="
          display: none;
          color: #c00;
          padding: 24px;
          font-family: sans-serif;
        "></div>
      </div>
    `,
    script: `
      (function () {
        const DOCX_PREVIEW_CDN =
          "https://cdn.jsdelivr.net/npm/docx-preview@0.3.5/dist/docx-preview.min.js";

        function showError(msg) {
          const el = document.getElementById("docx-error");
          const render = document.getElementById("docx-render");
          if (el) { el.style.display = "block"; el.textContent = "Error: " + msg; }
          if (render) render.style.display = "none";
        }

        function loadScript(src) {
          return new Promise((resolve, reject) => {
            if (document.querySelector('script[src="' + src + '"]')) {
              resolve();
              return;
            }
            const s = document.createElement("script");
            s.src = src;
            s.onload = resolve;
            s.onerror = () => reject(new Error("Failed to load " + src));
            document.head.appendChild(s);
          });
        }

        async function renderDocx(data) {
          try {
            await loadScript(DOCX_PREVIEW_CDN);
          } catch (e) {
            showError("Could not load docx-preview library. Check network access.");
            return;
          }

          const container = document.getElementById("docx-render");
          if (!container) return;

          try {
            const blob = new Blob([data], {
              type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            });

            container.innerHTML = "";
            document.getElementById("docx-error").style.display = "none";
            container.style.display = "";

            await docx.renderAsync(blob, container, null, {
              className: "docx-preview",
              inWrapper: false,
              ignoreWidth: false,
              ignoreHeight: false,
              ignoreFonts: false,
              breakPages: true,
              renderHeaders: true,
              renderFooters: true,
              renderFootnotes: true,
              renderEndnotes: true,
              renderChanges: false,
              useBase64URL: true,
            });
          } catch (e) {
            showError(e.message || "Failed to render document.");
          }
        }

        globalThis.silverbullet.addEventListener("file-open", (event) => {
          renderDocx(event.detail.data);
        });

        globalThis.silverbullet.addEventListener("file-update", (event) => {
          renderDocx(event.detail.data);
        });

        // This is a read-only viewer — no save handling needed.
        // If you want to signal to SB that no edits are possible, simply
        // never emit "file-changed" or "file-saved".
      })();
    `,
  };
}

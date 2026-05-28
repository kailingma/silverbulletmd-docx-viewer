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
        <div id="docx-loading" style="
          display: none;
          padding: 24px;
          font-family: sans-serif;
          color: #666;
        ">Loading...</div>
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
        // Use dynamic import() with an ESM CDN — avoids injecting <script> tags
        // which can trigger new-tab navigation in SB's PWA iframe sandbox.
        // esm.sh bundles jszip as a dependency so no separate load needed.
        const DOCX_PREVIEW_ESM = "https://esm.sh/docx-preview@0.3.7";

        let docxModule = null;

        function showError(msg) {
          const el = document.getElementById("docx-error");
          const render = document.getElementById("docx-render");
          const loading = document.getElementById("docx-loading");
          if (el) { el.style.display = "block"; el.textContent = "Error: " + msg; }
          if (render) render.style.display = "none";
          if (loading) loading.style.display = "none";
        }

        function showLoading(visible) {
          const el = document.getElementById("docx-loading");
          if (el) el.style.display = visible ? "block" : "none";
        }

        async function getDocxModule() {
          if (docxModule) return docxModule;
          docxModule = await import(DOCX_PREVIEW_ESM);
          return docxModule;
        }

        async function renderDocx(data) {
          const container = document.getElementById("docx-render");
          if (!container) return;

          showLoading(true);
          document.getElementById("docx-error").style.display = "none";

          let mod;
          try {
            mod = await getDocxModule();
          } catch (e) {
            showError("Could not load docx-preview. Check network access to esm.sh.");
            return;
          }

          try {
            const blob = new Blob([data], {
              type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            });

            container.innerHTML = "";
            container.style.display = "";

            await mod.renderAsync(blob, container, null, {
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
            return;
          } finally {
            showLoading(false);
          }
        }

        globalThis.silverbullet.addEventListener("file-open", (event) => {
          renderDocx(event.detail.data);
        });

        globalThis.silverbullet.addEventListener("file-update", (event) => {
          renderDocx(event.detail.data);
        });
      })();
    `,
  };
}
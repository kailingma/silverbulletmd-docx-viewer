function m(e){let o=atob(e),r=o.length,t=new Uint8Array(r);for(let n=0;n<r;n++)t[n]=o.charCodeAt(n);return t}function b(e){typeof e=="string"&&(e=new TextEncoder().encode(e));let o="",r=e.byteLength;for(let t=0;t<r;t++)o+=String.fromCharCode(e[t]);return btoa(o)}var k=new Uint8Array(16),w=class{constructor(e="",o=1e3){this.prefix=e,this.maxCaptureSize=o,this.prefix=e,this.originalConsole={log:console.log.bind(console),info:console.info.bind(console),warn:console.warn.bind(console),error:console.error.bind(console),debug:console.debug.bind(console)},this.patchConsole()}originalConsole;logBuffer=[];patchConsole(){let e=o=>(...r)=>{let t=this.prefix?[this.prefix,...r]:r;this.originalConsole[o](...t),this.captureLog(o,r)};console.log=e("log"),console.info=e("info"),console.warn=e("warn"),console.error=e("error"),console.debug=e("debug")}captureLog(e,o){let r={level:e,timestamp:Date.now(),message:o.map(t=>{if(typeof t=="string")return t;try{return JSON.stringify(t)}catch{return String(t)}}).join(" ")};this.logBuffer.push(r),this.logBuffer.length>this.maxCaptureSize&&this.logBuffer.shift()}async postToServer(e,o){if(this.logBuffer.length>0){let t=[...this.logBuffer];this.logBuffer=[];try{if(!(await fetch(e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t.map(s=>({...s,source:o})))})).ok)throw new Error("Failed to post logs to server")}catch(n){console.warn("Could not post logs to server",n.message),this.logBuffer.unshift(...t)}}}},p;function v(e=""){return p=new w(e),p}var i=e=>{throw new Error("Not initialized yet")},l=typeof window>"u"&&typeof globalThis.WebSocketPair>"u",c=new Map,d=0;l&&(globalThis.syscall=async(e,...o)=>await new Promise((r,t)=>{d++,c.set(d,{resolve:r,reject:t}),i({type:"sys",id:d,name:e,args:o})}));function g(e,o,r){l&&(i=r,self.addEventListener("message",t=>{(async()=>{let n=t.data;switch(n.type){case"inv":{let s=e[n.name];if(!s)throw new Error(`Function not loaded: ${n.name}`);try{let a=await Promise.resolve(s(...n.args||[]));i({type:"invr",id:n.id,result:a})}catch(a){console.error("An exception was thrown as a result of invoking function",n.name,"error:",a.message),i({type:"invr",id:n.id,error:a.message})}}break;case"sysr":{let s=n.id,a=c.get(s);if(!a)throw Error("Invalid request id");c.delete(s),n.error?a.reject(new Error(n.error)):a.resolve(n.result)}break}})().catch(console.error)}),i({type:"manifest",manifest:o}),v(`[${o.name} plug]`))}async function x(e,o){if(typeof e!="string"){let r=new Uint8Array(await e.arrayBuffer()),t=r.length>0?b(r):void 0;o={method:e.method,headers:Object.fromEntries(e.headers.entries()),base64Body:t},e=e.url}return syscall("sandboxFetch.fetch",e,o)}globalThis.nativeFetch=globalThis.fetch;function y(){globalThis.fetch=async(e,o)=>{let r=o?.body?b(new Uint8Array(await new Response(o.body).arrayBuffer())):void 0,t=await x(e,o&&{method:o.method,headers:o.headers,base64Body:r});return new Response(t.base64Body?m(t.base64Body):null,{status:t.status,headers:t.headers})}}l&&y();async function f(){let e="";try{let r=await fetch("https://cdn.jsdelivr.net/npm/docx-preview@0.3.7/dist/docx-preview.min.js");if(!r.ok)throw new Error(`HTTP ${r.status}`);e=await r.text()}catch(r){e=`console.error("docx-preview failed to load: ${String(r).replace(/"/g,"'")}");`}let o="";try{let r=await fetch("https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js");if(!r.ok)throw new Error(`HTTP ${r.status}`);o=await r.text()}catch(r){o=`console.error("jszip failed to load: ${String(r).replace(/"/g,"'")}");`}return{html:`
      <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
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

        #docx-container {
          height: 100%;
          overflow-y: auto;
          background: var(--sb-canvas-bg);
        }

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

        #docx-render {
          background: var(--sb-page-bg);
          max-width: var(--sb-page-w);
          margin: var(--sb-page-margin);
          box-shadow: var(--sb-shadow);
          padding: var(--sb-page-pad);
          min-height: calc(100% - 48px);
        }

        /* docx-preview emitted classes (className: "docx-preview") */
        .docx-preview-wrapper, .docx-wrapper {
          background: transparent !important;
          padding: 0 !important;
        }
        .docx-preview-page, .docx-page {
          background: var(--sb-page-bg) !important;
          color: var(--sb-fg) !important;
          box-shadow: none !important;
          margin: 0 0 1px 0 !important;
        }
        .docx-preview-header, .docx-header,
        .docx-preview-footer, .docx-footer {
          color: var(--sb-subtle) !important;
          font-size: 0.85em !important;
          border-color: var(--sb-border) !important;
        }
        .docx-preview-body, .docx-body {
          color: var(--sb-fg) !important;
        }
        .docx-preview-wrapper a, .docx-wrapper a {
          color: var(--sb-link) !important;
          pointer-events: none;
        }
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
        .docx-preview-wrapper code, .docx-wrapper code,
        .docx-preview-wrapper pre,  .docx-wrapper pre {
          background: var(--sb-code-bg) !important;
          color: var(--sb-code-fg) !important;
          font-family: "iA-Mono", "Menlo", monospace;
          font-size: 0.9em;
          border-radius: 3px;
          padding: 0.1em 0.3em;
        }
        .docx-preview-wrapper blockquote, .docx-wrapper blockquote {
          border-left: 3px solid var(--sb-blockquote-border);
          background: var(--sb-subtle-bg);
          color: var(--sb-subtle);
          padding: 0.5em 1em;
          margin: 0.5em 0;
        }
        .docx-preview-page-break, .docx-page-break {
          border: none !important;
          border-top: 1px solid var(--sb-border) !important;
          margin: 0 !important;
        }
      </style>

      <div id="docx-container">
        <div id="docx-loading">Loading document\u2026</div>
        <div id="docx-render"></div>
        <div id="docx-error"></div>
      </div>
    `,script:`
      // jszip and docx-preview are inlined at plug-load time by the worker \u2014
      // the iframe makes zero outbound network requests, so the PWA never
      // has cause to open an external window.
      ${o}
      ${e}

      (function () {
        // Block all link clicks inside the rendered document.
        document.addEventListener("click", function (e) {
          const a = e.target && e.target.closest && e.target.closest("a");
          if (a) { e.preventDefault(); e.stopPropagation(); }
        }, true);

        function showError(msg) {
          document.getElementById("docx-error").style.display  = "block";
          document.getElementById("docx-error").textContent    = "Error: " + msg;
          document.getElementById("docx-render").style.display = "none";
          document.getElementById("docx-loading").style.display = "none";
        }

        function setLoading(on) {
          document.getElementById("docx-loading").style.display = on ? "block" : "none";
        }

        async function render(data) {
          if (typeof docx === "undefined" || typeof docx.renderAsync !== "function") {
            showError("docx-preview library not available.");
            return;
          }

          const container = document.getElementById("docx-render");
          if (!container) return;

          setLoading(true);
          document.getElementById("docx-error").style.display  = "none";
          document.getElementById("docx-render").style.display = "";

          try {
            container.innerHTML = "";
            const blob = new Blob([data], {
              type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            });

            await docx.renderAsync(blob, container, null, {
              className:                   "docx-preview",
              inWrapper:                   true,
              ignoreWidth:                 false,
              ignoreHeight:                false,
              ignoreFonts:                 false,
              breakPages:                  true,
              ignoreLastRenderedPageBreak: true,
              renderHeaders:               true,
              renderFooters:               true,
              renderFootnotes:             true,
              renderEndnotes:              true,
              renderChanges:               false,
              useBase64URL:                true,
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
    `}}var u={DOCXEditor:f},h={name:"docxviewer",functions:{DOCXEditor:{path:"./editor.ts:editor",editor:["doc","docx","dotx","docm"]}},assets:{}},T={manifest:h,functionMapping:u};g(u,h,self.postMessage);export{T as plug};
//# sourceMappingURL=docxviewer.plug.js.map

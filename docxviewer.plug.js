function m(e){let o=atob(e),n=o.length,t=new Uint8Array(n);for(let r=0;r<n;r++)t[r]=o.charCodeAt(r);return t}function u(e){typeof e=="string"&&(e=new TextEncoder().encode(e));let o="",n=e.byteLength;for(let t=0;t<n;t++)o+=String.fromCharCode(e[t]);return btoa(o)}var E=new Uint8Array(16),b=class{constructor(e="",o=1e3){this.prefix=e,this.maxCaptureSize=o,this.prefix=e,this.originalConsole={log:console.log.bind(console),info:console.info.bind(console),warn:console.warn.bind(console),error:console.error.bind(console),debug:console.debug.bind(console)},this.patchConsole()}originalConsole;logBuffer=[];patchConsole(){let e=o=>(...n)=>{let t=this.prefix?[this.prefix,...n]:n;this.originalConsole[o](...t),this.captureLog(o,n)};console.log=e("log"),console.info=e("info"),console.warn=e("warn"),console.error=e("error"),console.debug=e("debug")}captureLog(e,o){let n={level:e,timestamp:Date.now(),message:o.map(t=>{if(typeof t=="string")return t;try{return JSON.stringify(t)}catch{return String(t)}}).join(" ")};this.logBuffer.push(n),this.logBuffer.length>this.maxCaptureSize&&this.logBuffer.shift()}async postToServer(e,o){if(this.logBuffer.length>0){let t=[...this.logBuffer];this.logBuffer=[];try{if(!(await fetch(e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t.map(i=>({...i,source:o})))})).ok)throw new Error("Failed to post logs to server")}catch(r){console.warn("Could not post logs to server",r.message),this.logBuffer.unshift(...t)}}}},g;function w(e=""){return g=new b(e),g}var a=e=>{throw new Error("Not initialized yet")},c=typeof window>"u"&&typeof globalThis.WebSocketPair>"u",l=new Map,d=0;c&&(globalThis.syscall=async(e,...o)=>await new Promise((n,t)=>{d++,l.set(d,{resolve:n,reject:t}),a({type:"sys",id:d,name:e,args:o})}));function h(e,o,n){c&&(a=n,self.addEventListener("message",t=>{(async()=>{let r=t.data;switch(r.type){case"inv":{let i=e[r.name];if(!i)throw new Error(`Function not loaded: ${r.name}`);try{let s=await Promise.resolve(i(...r.args||[]));a({type:"invr",id:r.id,result:s})}catch(s){console.error("An exception was thrown as a result of invoking function",r.name,"error:",s.message),a({type:"invr",id:r.id,error:s.message})}}break;case"sysr":{let i=r.id,s=l.get(i);if(!s)throw Error("Invalid request id");l.delete(i),r.error?s.reject(new Error(r.error)):s.resolve(r.result)}break}})().catch(console.error)}),a({type:"manifest",manifest:o}),w(`[${o.name} plug]`))}async function x(e,o){if(typeof e!="string"){let n=new Uint8Array(await e.arrayBuffer()),t=n.length>0?u(n):void 0;o={method:e.method,headers:Object.fromEntries(e.headers.entries()),base64Body:t},e=e.url}return syscall("sandboxFetch.fetch",e,o)}globalThis.nativeFetch=globalThis.fetch;function v(){globalThis.fetch=async(e,o)=>{let n=o?.body?u(new Uint8Array(await new Response(o.body).arrayBuffer())):void 0,t=await x(e,o&&{method:o.method,headers:o.headers,base64Body:n});return new Response(t.base64Body?m(t.base64Body):null,{status:t.status,headers:t.headers})}}c&&v();async function f(){return{html:`
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
    `,script:`
      (function () {
        // Use dynamic import() with an ESM CDN \u2014 avoids injecting <script> tags
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
    `}}var p={DOCXEditor:f},y={name:"docxviewer",functions:{DOCXEditor:{path:"./editor.ts:editor",editor:["doc","docx","dotx","docm"]}},assets:{}},S={manifest:y,functionMapping:p};h(p,y,self.postMessage);export{S as plug};
//# sourceMappingURL=docxviewer.plug.js.map

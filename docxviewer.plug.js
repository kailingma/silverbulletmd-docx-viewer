function m(e){let o=atob(e),t=o.length,r=new Uint8Array(t);for(let n=0;n<t;n++)r[n]=o.charCodeAt(n);return r}function h(e){typeof e=="string"&&(e=new TextEncoder().encode(e));let o="",t=e.byteLength;for(let r=0;r<t;r++)o+=String.fromCharCode(e[r]);return btoa(o)}var E=new Uint8Array(16),b=class{constructor(e="",o=1e3){this.prefix=e,this.maxCaptureSize=o,this.prefix=e,this.originalConsole={log:console.log.bind(console),info:console.info.bind(console),warn:console.warn.bind(console),error:console.error.bind(console),debug:console.debug.bind(console)},this.patchConsole()}originalConsole;logBuffer=[];patchConsole(){let e=o=>(...t)=>{let r=this.prefix?[this.prefix,...t]:t;this.originalConsole[o](...r),this.captureLog(o,t)};console.log=e("log"),console.info=e("info"),console.warn=e("warn"),console.error=e("error"),console.debug=e("debug")}captureLog(e,o){let t={level:e,timestamp:Date.now(),message:o.map(r=>{if(typeof r=="string")return r;try{return JSON.stringify(r)}catch{return String(r)}}).join(" ")};this.logBuffer.push(t),this.logBuffer.length>this.maxCaptureSize&&this.logBuffer.shift()}async postToServer(e,o){if(this.logBuffer.length>0){let r=[...this.logBuffer];this.logBuffer=[];try{if(!(await fetch(e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r.map(i=>({...i,source:o})))})).ok)throw new Error("Failed to post logs to server")}catch(n){console.warn("Could not post logs to server",n.message),this.logBuffer.unshift(...r)}}}},g;function w(e=""){return g=new b(e),g}var a=e=>{throw new Error("Not initialized yet")},l=typeof window>"u"&&typeof globalThis.WebSocketPair>"u",c=new Map,d=0;l&&(globalThis.syscall=async(e,...o)=>await new Promise((t,r)=>{d++,c.set(d,{resolve:t,reject:r}),a({type:"sys",id:d,name:e,args:o})}));function u(e,o,t){l&&(a=t,self.addEventListener("message",r=>{(async()=>{let n=r.data;switch(n.type){case"inv":{let i=e[n.name];if(!i)throw new Error(`Function not loaded: ${n.name}`);try{let s=await Promise.resolve(i(...n.args||[]));a({type:"invr",id:n.id,result:s})}catch(s){console.error("An exception was thrown as a result of invoking function",n.name,"error:",s.message),a({type:"invr",id:n.id,error:s.message})}}break;case"sysr":{let i=n.id,s=c.get(i);if(!s)throw Error("Invalid request id");c.delete(i),n.error?s.reject(new Error(n.error)):s.resolve(n.result)}break}})().catch(console.error)}),a({type:"manifest",manifest:o}),w(`[${o.name} plug]`))}async function v(e,o){if(typeof e!="string"){let t=new Uint8Array(await e.arrayBuffer()),r=t.length>0?h(t):void 0;o={method:e.method,headers:Object.fromEntries(e.headers.entries()),base64Body:r},e=e.url}return syscall("sandboxFetch.fetch",e,o)}globalThis.nativeFetch=globalThis.fetch;function x(){globalThis.fetch=async(e,o)=>{let t=o?.body?h(new Uint8Array(await new Response(o.body).arrayBuffer())):void 0,r=await v(e,o&&{method:o.method,headers:o.headers,base64Body:t});return new Response(r.base64Body?m(r.base64Body):null,{status:r.status,headers:r.headers})}}l&&x();async function f(){return{html:`
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
    `,script:`
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

        // This is a read-only viewer \u2014 no save handling needed.
        // If you want to signal to SB that no edits are possible, simply
        // never emit "file-changed" or "file-saved".
      })();
    `}}var p={DOCXEditor:f},y={name:"docxviewer",functions:{DOCXEditor:{path:"./editor.ts:editor",editor:["doc","docx","dotx","docm"]}},assets:{}},T={manifest:y,functionMapping:p};u(p,y,self.postMessage);export{T as plug};
//# sourceMappingURL=docxviewer.plug.js.map

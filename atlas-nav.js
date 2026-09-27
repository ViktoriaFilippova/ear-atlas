/* Общая навигация атласа. Новый раздел = одна строка в SECTIONS. */
(function(){
const SECTIONS=[
 {g:{ru:"Голова",en:"Head"},items:[
   {id:"ear",href:"./",ru:"Ухо",en:"Ear"}]},
 {g:{ru:"Шея",en:"Neck"},items:[
   {id:"neck-back",href:"neck-back.html",ru:"Вид сзади",en:"Back view"},
   {id:"neck-side",soon:true,ru:"Вид сбоку",en:"Side view"}]}
];
const T={ru:{atlas:"Атлас точек",all:"Все разделы",soon:"скоро",find:"Найти раздел",none:"Ничего не нашлось",close:"Закрыть"},
         en:{atlas:"Point atlas",all:"All sections",soon:"soon",find:"Find a section",none:"Nothing found",close:"Close"}};
const css=`
.an{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:14px 0 0;font-size:14px;position:relative}
.an-crumbs{display:flex;align-items:center;gap:6px;color:var(--muted);min-width:0}
.an-crumbs a{color:var(--muted);text-decoration:none}.an-crumbs a:hover{color:var(--ink)}
.an-crumbs b{color:var(--ink);font-weight:600}
.an-btn{margin-left:auto;display:inline-flex;align-items:center;gap:8px;border:1px solid var(--line);background:var(--surface);color:var(--ink);border-radius:999px;padding:7px 14px;cursor:pointer;font:inherit}
.an-btn i{font-style:normal;font-size:12px;color:var(--muted);transition:transform .2s}.an-btn[aria-expanded="true"] i{transform:rotate(180deg)}
.an-pop{position:absolute;right:0;top:calc(100% + 8px);z-index:50;width:min(420px,calc(100vw - 32px));max-height:min(70vh,560px);overflow:auto;background:var(--surface);border:1px solid var(--line);border-radius:18px;box-shadow:0 24px 60px -20px rgba(0,0,0,.45);padding:12px;opacity:0;transform:translateY(-6px);pointer-events:none;transition:opacity .18s,transform .18s}
.an-pop.open{opacity:1;transform:none;pointer-events:auto}
.an-pop input{width:100%;box-sizing:border-box;border:1px solid var(--line);background:var(--bg);color:var(--ink);border-radius:10px;padding:9px 12px;font:inherit;margin-bottom:6px}
.an-grp{margin:10px 4px 4px;font-size:12px;color:var(--muted);letter-spacing:.04em;text-transform:uppercase}
.an-pop a,.an-pop span.an-soon{display:flex;justify-content:space-between;align-items:center;padding:9px 12px;border-radius:10px;text-decoration:none;color:var(--ink)}
.an-pop a:hover,.an-pop a:focus-visible{background:var(--bg)}
.an-pop a[aria-current="page"]{background:var(--ink);color:var(--bg)}
.an-pop span.an-soon{color:var(--muted)}.an-pop span.an-soon em{font-style:normal;font-size:12px;border:1px dashed var(--line);border-radius:999px;padding:1px 8px}
.an-empty{padding:10px 12px;color:var(--muted)}
@media(max-width:600px){.an-pop{position:fixed;left:0;right:0;top:auto;bottom:0;width:auto;max-height:80vh;border-radius:20px 20px 0 0;transform:translateY(20px);padding-bottom:calc(16px + env(safe-area-inset-bottom,0px))}}
@media(prefers-reduced-motion:reduce){.an-pop,.an-btn i{transition:none}}`;
function lang(){return (document.documentElement.lang||"ru").slice(0,2)==="en"?"en":"ru"}
function build(){
  const nav=document.getElementById("atlasnav");if(!nav)return;
  const cur=nav.dataset.current,L=lang(),t=T[L];
  let grp=null,item=null;SECTIONS.forEach(s=>s.items.forEach(i=>{if(i.id===cur){grp=s;item=i}}));
  const total=SECTIONS.reduce((n,s)=>n+s.items.filter(i=>!i.soon).length,0);
  const wasOpen=nav.querySelector(".an-pop.open");
  nav.className="an";
  nav.innerHTML=`<div class="an-crumbs"><span>${t.atlas}</span>${grp?` / <span>${grp.g[L]}</span>`:""}${item?` / <b>${item[L]}</b>`:""}</div>
   <button class="an-btn" aria-expanded="false" aria-controls="an-pop">${t.all} · ${total}<i aria-hidden="true">▾</i></button>
   <div class="an-pop" id="an-pop" role="dialog" aria-label="${t.all}">
     ${total>6?`<input type="search" placeholder="${t.find}" aria-label="${t.find}">`:""}
     <div class="an-list">${SECTIONS.map(s=>`<div class="an-g"><div class="an-grp">${s.g[L]}</div>${s.items.map(i=>i.soon
        ?`<span class="an-soon" data-q="${(s.g.ru+" "+s.g.en+" "+i.ru+" "+i.en).toLowerCase()}">${i[L]}<em>${t.soon}</em></span>`
        :`<a href="${i.href}" ${i.id===cur?'aria-current="page"':""} data-q="${(s.g.ru+" "+s.g.en+" "+i.ru+" "+i.en).toLowerCase()}">${i[L]}</a>`).join("")}</div>`).join("")}</div>
     <div class="an-empty" hidden>${t.none}</div>
   </div>`;
  const btn=nav.querySelector(".an-btn"),pop=nav.querySelector(".an-pop"),q=pop.querySelector("input");
  const set=o=>{pop.classList.toggle("open",o);btn.setAttribute("aria-expanded",o);if(o){(q||pop.querySelector("a"))?.focus()}};
  btn.onclick=e=>{e.stopPropagation();set(!pop.classList.contains("open"))};
  pop.onclick=e=>e.stopPropagation();
  document.addEventListener("click",()=>set(false));
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&pop.classList.contains("open")){set(false);btn.focus()}});
  pop.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{try{ym(110440302,"reachGoal","nav",{to:a.getAttribute("href"),from:cur})}catch(e){}}));
  if(q)q.oninput=()=>{const v=q.value.trim().toLowerCase();let n=0;
    pop.querySelectorAll(".an-g").forEach(g=>{let k=0;g.querySelectorAll("[data-q]").forEach(el=>{const ok=!v||el.dataset.q.includes(v);el.hidden=!ok;if(ok)k++});g.hidden=!k;n+=k});
    pop.querySelector(".an-empty").hidden=!!n};
  if(wasOpen)set(true);
}
const st=document.createElement("style");st.textContent=css;document.head.appendChild(st);
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",build);else build();
new MutationObserver(build).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
})();

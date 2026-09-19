(() => {
const TYPES = ["Normal","Fire","Water","Electric","Grass","Ice","Fighting","Poison","Ground","Flying","Psychic","Bug","Rock","Ghost","Dragon","Dark","Steel","Fairy"];
const DATA = window.USUM_COMPACT.map(([num,name,mask,form]) => ({num,name,types:TYPES.filter((_,i)=>(mask & (1<<i))!==0),speciesNum:num,form}));
const KEY = "usum-partner-draft-v2";
const blankPlayer = () => ({name:"", picks:Object.fromEntries(TYPES.map(t=>[t,{candidates:[],locked:null}]))});
let state;
try { state = JSON.parse(localStorage.getItem(KEY)) || {active:0, type:"Normal", players:[blankPlayer(),blankPlayer()]}; }
catch(e) { state={active:0,type:"Normal",players:[blankPlayer(),blankPlayer()]}; }
if(!state.players || state.players.length!==2) state={active:0,type:"Normal",players:[blankPlayer(),blankPlayer()]};
for(const p of state.players) {
  if(!p.picks) p.picks=blankPlayer().picks;
  for(const t of TYPES) if(!p.picks[t]) p.picks[t]={candidates:[],locked:null};
}
const $ = id => document.getElementById(id);
const save=()=>localStorage.setItem(KEY,JSON.stringify(state));
const activePlayer=()=>state.players[state.active];
const keyOf=p=>`${p.speciesNum}::${p.name}`;
const baseNumOfKey=k=>Number(String(k).split("::")[0]);

function byKey(k) { return DATA.find(p=>keyOf(p)===k); }
function lockedNums(p) {
  return new Set(TYPES.map(t=>p.picks[t].locked).filter(Boolean).map(baseNumOfKey));
}
function renderTabs() {
  $("tab0").classList.toggle("active",state.active===0);
  $("tab1").classList.toggle("active",state.active===1);
}
function renderTypes() {
  $("typeSelect").innerHTML=TYPES.map(t=>`<option ${t===state.type?"selected":""}>${t}</option>`).join("");
  $("typebar").innerHTML=TYPES.map(t=>{
    const done=!!activePlayer().picks[t].locked;
    return `<button type="button" class="typebtn ${t===state.type?"active":""} ${done?"done":""}" data-type="${t}">${t}${done?" ✓":""}</button>`;
  }).join("");
  document.querySelectorAll(".typebtn").forEach(b=>b.addEventListener("click",()=>{state.type=b.dataset.type;save();render();}));
}
function renderTop() {
  const p=activePlayer(), pick=p.picks[state.type];
  $("playerName").value=p.name||"";
  $("progress").textContent=`${TYPES.filter(t=>p.picks[t].locked).length} / 18 locked`;
  $("candCount").textContent=`${pick.candidates.length} / 2 candidates`;
  $("typeHeading").textContent=`${state.type} — choose two options`;
}
function renderCandidates() {
  const p=activePlayer(), pick=p.picks[state.type];
  const slots=[0,1].map(i=>{
    const k=pick.candidates[i], mon=k&&byKey(k);
    if(!mon) return `<div class="candidate empty">Candidate ${i+1}<br>not selected yet</div>`;
    const locked=pick.locked===k;
    return `<div class="candidate">
      <div class="name"><span class="dex">#${String(mon.num).padStart(3,"0")}</span>${mon.name}</div>
      <div class="types">${mon.types.join(" / ")}</div>
      <button type="button" class="pickbtn ${locked?"locked":""}" data-lock="${k.replace(/"/g,"&quot;")}">${locked?"✓ LOCKED":"Partner picks this"}</button>
    </div>`;
  }).join("");
  $("candidates").innerHTML=slots;
  document.querySelectorAll("[data-lock]").forEach(btn=>btn.addEventListener("click",()=>{
    const k=btn.dataset.lock, num=baseNumOfKey(k);
    const otherType=TYPES.find(t=>t!==state.type && p.picks[t].locked && baseNumOfKey(p.picks[t].locked)===num);
    if(otherType) {
      $("message").textContent=`That species is already locked for ${otherType}. Pick a different final Pokémon or unlock it there first.`;
      return;
    }
    pick.locked = pick.locked===k ? null : k;
    save(); render();
  }));
}
function renderList() {
  const p=activePlayer(), pick=p.picks[state.type];
  const q=$("search").value.trim().toLowerCase();
  let pool=DATA.filter(mon=>mon.types.includes(state.type));
  if(q) pool=pool.filter(mon=>mon.name.toLowerCase().includes(q)||String(mon.num).includes(q));
  $("poolCount").textContent=`${pool.length} shown`;
  const lockedElsewhere=lockedNums(p);
  $("pokeList").innerHTML=pool.map(mon=>{
    const k=keyOf(mon), checked=pick.candidates.includes(k);
    const usedElsewhere=lockedElsewhere.has(mon.speciesNum) && !(pick.locked && baseNumOfKey(pick.locked)===mon.speciesNum);
    const disabled=usedElsewhere && !checked;
    return `<label class="poke ${checked?"selected":""} ${disabled?"disabled":""}">
      <input type="checkbox" data-k="${k.replace(/"/g,"&quot;")}" ${checked?"checked":""} ${disabled?"disabled":""}>
      <div>
        <div class="name"><span class="dex">#${String(mon.num).padStart(3,"0")}</span>${mon.name}</div>
        <div class="types">${mon.types.join(" / ")}</div>
      </div>
      ${mon.form?`<span class="formtag">${mon.form}</span>`:""}
    </label>`;
  }).join("");
  document.querySelectorAll('#pokeList input[type="checkbox"]').forEach(cb=>cb.addEventListener("change",()=>{
    const k=cb.dataset.k;
    if(cb.checked) {
      if(pick.candidates.length>=2) {
        cb.checked=false;
        $("message").textContent="You already have two candidates for this type. Uncheck one first.";
        return;
      }
      pick.candidates.push(k);
    } else {
      pick.candidates=pick.candidates.filter(x=>x!==k);
      if(pick.locked===k) pick.locked=null;
    }
    $("message").textContent="";
    save(); render();
  }));
}
function renderSummary() {
  const p=activePlayer();
  $("summary").innerHTML=TYPES.map(t=>{
    const k=p.picks[t].locked, mon=k&&byKey(k);
    return `<div class="sumrow"><div class="t">${t}</div><div class="${mon?"good":""}">${mon?mon.name:"—"}</div></div>`;
  }).join("");
}
function render() {
  renderTabs(); renderTypes(); renderTop(); renderCandidates(); renderList(); renderSummary();
}
$("tab0").addEventListener("click",()=>{state.active=0;save();render();});
$("tab1").addEventListener("click",()=>{state.active=1;save();render();});
$("typeSelect").addEventListener("change",e=>{state.type=e.target.value;save();render();});
$("search").addEventListener("input",renderList);
$("playerName").addEventListener("input",e=>{activePlayer().name=e.target.value;save();});
$("downloadBackup").addEventListener("click",()=>{
  const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"});
  const a=document.createElement("a"); a.href=URL.createObjectURL(blob);
  a.download="USUM_Partner_Draft_Backup.json"; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),1000);
});
$("loadBackupBtn").addEventListener("click",()=>$("loadBackup").click());
$("loadBackup").addEventListener("change",e=>{
  const f=e.target.files[0]; if(!f)return;
  const r=new FileReader();
  r.onload=()=>{try{const x=JSON.parse(r.result);if(x.players&&x.players.length===2){state=x;save();render();}else alert("That file does not look like a USUM draft backup.");}catch(err){alert("Could not read that backup.");}};
  r.readAsText(f);
});
$("showText").addEventListener("click",()=>{
  const p=activePlayer();
  const lines=[`${p.name||`Player ${state.active+1}`} — USUM Draft`];
  for(const t of TYPES) {
    const pk=p.picks[t], a=pk.candidates.map(byKey).filter(Boolean).map(x=>x.name);
    const l=pk.locked&&byKey(pk.locked);
    lines.push(`${t}: ${a.length?a.join(" vs "):"—"}${l?` → ${l.name}`:""}`);
  }
  $("shareText").value=lines.join("\n"); $("shareText").classList.toggle("hidden");
});
$("reset").addEventListener("click",()=>{
  if(confirm(`Reset all selections for ${activePlayer().name||`Player ${state.active+1}`}?`)) {
    const name=activePlayer().name; state.players[state.active]=blankPlayer(); state.players[state.active].name=name; save(); render();
  }
});
render();
})();

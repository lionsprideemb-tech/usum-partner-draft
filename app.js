(() => {
const TYPES = ["Normal","Fire","Water","Electric","Grass","Ice","Fighting","Poison","Ground","Flying","Psychic","Bug","Rock","Ghost","Dragon","Dark","Steel","Fairy"];
const DATA = window.USUM_COMPACT.map(([num,name,mask,form]) => ({num,name,types:TYPES.filter((_,i)=>(mask & (1<<i))!==0),speciesNum:num,form}));
const KEY = "usum-partner-draft-v2";
const FORM_IDS = {
  "Rattata (Alolan)":"rattataalola","Raticate (Alolan)":"raticatealola","Raichu (Alolan)":"raichualola",
  "Sandshrew (Alolan)":"sandshrewalola","Sandslash (Alolan)":"sandslashalola","Vulpix (Alolan)":"vulpixalola","Ninetales (Alolan)":"ninetalesalola",
  "Diglett (Alolan)":"diglettalola","Dugtrio (Alolan)":"dugtrioalola","Meowth (Alolan)":"meowthalola","Persian (Alolan)":"persianalola",
  "Geodude (Alolan)":"geodudealola","Graveler (Alolan)":"graveleralola","Golem (Alolan)":"golemalola","Grimer (Alolan)":"grimeralola","Muk (Alolan)":"mukalola",
  "Exeggutor (Alolan)":"exeggutoralola","Marowak (Alolan)":"marowakalola","Wormadam (Sandy Cloak)":"wormadamsandy","Wormadam (Trash Cloak)":"wormadamtrash",
  "Rotom (Heat)":"rotomheat","Rotom (Wash)":"rotomwash","Rotom (Frost)":"rotomfrost","Rotom (Fan)":"rotomfan","Rotom (Mow)":"rotommow",
  "Shaymin (Sky Forme)":"shayminsky","Hoopa (Unbound)":"hoopaunbound","Oricorio (Baile Style)":"oricoriobaile","Oricorio (Pom-Pom Style)":"oricoriopompom",
  "Oricorio (Pa'u Style)":"oricoriopau","Oricorio (Sensu Style)":"oricoriosensu","Lycanroc (Midday Form)":"lycanroc","Lycanroc (Midnight Form)":"lycanrocmidnight",
  "Lycanroc (Dusk Form)":"lycanrocdusk","Necrozma (Dusk Mane)":"necrozmaduskmane","Necrozma (Dawn Wings)":"necrozmadawnwings"
};
const ABILITY_NICHES = {
  "Regenerator":"heals on switching, making it a strong pivot","Intimidate":"cuts the foe's Attack on entry","Speed Boost":"can snowball Speed every turn",
  "Huge Power":"doubles Attack","Pure Power":"doubles Attack","Magic Bounce":"reflects many hazards/status moves","Magic Guard":"ignores most indirect damage",
  "Prankster":"gives priority to status/support moves","Unaware":"ignores opposing stat boosts","Multiscale":"softens a hit at full HP","Sturdy":"can survive a hit from full HP",
  "Adaptability":"supercharges STAB damage","Technician":"boosts weaker moves","Sheer Force":"powers up many attacks","Guts":"turns status into extra Attack",
  "Poison Heal":"turns poison into strong passive recovery","Contrary":"reverses stat changes","Imposter":"copies the opponent on entry","Shadow Tag":"traps most opponents",
  "Drizzle":"sets rain automatically","Drought":"sets sun automatically","Sand Stream":"sets sand automatically","Snow Warning":"sets hail automatically",
  "Water Absorb":"gives Water immunity + healing","Volt Absorb":"gives Electric immunity + healing","Flash Fire":"gives Fire immunity + a Fire boost","Lightning Rod":"blocks Electric attacks and can boost SpA",
  "Storm Drain":"blocks Water attacks and can boost SpA","Moxie":"raises Attack after KOs","Defiant":"punishes stat drops with Attack","Competitive":"punishes stat drops with SpA",
  "Beast Boost":"raises its highest stat after a KO","Disguise":"usually buys one free hit","Stamina":"raises Defense whenever it is hit","Water Bubble":"greatly boosts Water damage and softens Fire damage",
  "Triage":"gives priority to healing/draining moves","Corrosion":"can poison Steel- and Poison-types","Dancer":"copies dance moves","Queenly Majesty":"blocks opposing priority",
  "Dazzling":"blocks opposing priority","Schooling":"becomes a huge-stat School Form while healthy","Shields Down":"starts protected, then becomes much faster offensively",
  "Fluffy":"halves most contact damage but fears Fire","Berserk":"raises SpA below half HP","Steelworker":"gives Steel moves a STAB-like boost","Wonder Guard":"blocks attacks that are not super effective",
  "Serene Grace":"doubles many secondary-effect chances","Skill Link":"makes multi-hit moves hit the maximum number","Simple":"doubles stat changes","Protean":"changes type to match its move",
  "Galvanize":"turns Normal moves Electric and boosts them","Pixilate":"turns Normal moves Fairy and boosts them","Refrigerate":"turns Normal moves Ice and boosts them","Gale Wings":"gives Flying moves priority at full HP in Gen 7",
  "Mold Breaker":"ignores many defensive abilities","Download":"can raise an offensive stat on entry","Trace":"can copy a useful opposing ability","Natural Cure":"clears status when switching out"
};
const SPECIAL_NICHES = {
  "Ditto":"Imposter can copy a boosted opponent and turn their own setup against them.",
  "Smeargle":"Sketch lets it learn almost any move, so it can fill extremely unusual support roles.",
  "Shedinja":"Wonder Guard creates hard matchup checks, but 1 HP and hazards/weather are serious risks.",
  "Wobbuffet":"Shadow Tag plus Counter/Mirror Coat can trap and trade with dangerous attackers.",
  "Slaking":"670 BST and 160 Attack are enormous, but Truant forces it to act only every other turn.",
  "Regigigas":"Huge 670 BST, but Slow Start cripples Attack and Speed for its first five turns.",
  "Archeops":"140 Attack, 112 SpA and 110 Speed are explosive; Defeatist is the catch below half HP.",
  "Wishiwashi":"School Form has monstrous stats while it stays above 25% HP.",
  "Mimikyu":"Disguise usually guarantees one safe action, which is fantastic for setup or emergency revenge-killing.",
  "Chansey":"Eviolite plus enormous HP/SpD makes it one of the best special walls available.",
  "Porygon2":"Eviolite makes it exceptionally bulky without giving up useful offensive coverage.",
  "Dusclops":"Eviolite gives it extreme mixed bulk for disruption and status play.",
  "Pikachu":"Light Ball doubles both offensive stats, so it hits far harder than its base stats suggest.",
  "Marowak":"Thick Club doubles Attack, turning its modest base Attack into serious power.",
  "Marowak (Alolan)":"Thick Club doubles Attack, and Fire/Ghost gives it a very different offensive niche.",
  "Clamperl":"Deep Sea Tooth doubles SpA; Deep Sea Scale doubles SpD, so its item can completely change its role.",
  "Unown":"Very limited movepool and low stats—mostly a deliberate challenge pick rather than a hidden gem.",
  "Azumarill":"Huge Power makes its physical damage vastly better than base 50 Attack suggests.",
  "Medicham":"Pure Power doubles Attack, so its real physical damage is far above its listed base stat.",
  "Breloom":"Spore plus either Poison Heal or Technician gives it a nasty mix of disruption and offense.",
  "Serperior":"Contrary turns Leaf Storm's SpA drop into a boost, letting it snowball quickly.",
  "Malamar":"Contrary can turn Superpower's self-drops into Attack and Defense boosts.",
  "Amoonguss":"Regenerator plus Spore makes it a durable sleep-spreading pivot.",
  "Talonflame":"Gale Wings gives priority Flying moves at full HP in Gen 7, and its Speed is already excellent.",
  "Klefki":"Prankster lets mediocre stats punch above their weight through priority disruption.",
  "Pyukumuku":"Unaware lets it ignore setup boosts, making it a very specific defensive answer.",
  "Kommo-o":"In USUM it gets the unique Clangorous Soulblaze Z-Move, which can boost every stat after attacking.",
  "Raichu (Alolan)":"Surge Surfer doubles Speed in Electric Terrain, creating a very fast terrain sweeper.",
  "Incineroar":"Hidden Ability Intimidate gives immediate defensive value and makes it a great bulky pivot.",
  "Toxapex":"Regenerator plus huge defenses makes it extremely hard to wear down.",
  "Araquanid":"Water Bubble gives its Water attacks huge effective power while softening Fire damage.",
  "Salazzle":"Corrosion lets it poison Steel- and Poison-types that normally ignore Toxic.",
  "Comfey":"Triage gives priority to healing and draining moves, creating a unique support/cleaner niche.",
  "Mudsdale":"Stamina raises Defense every time it is hit, so it can become very hard to break physically.",
  "Tsareena":"Queenly Majesty blocks priority attacks, useful for itself and a doubles partner.",
  "Dhelmise":"Steelworker effectively gives it a third offensive STAB on Steel moves.",
  "Bewear":"Fluffy makes it deceptively bulky against contact moves, though Fire becomes dangerous.",
  "Vikavolt":"145 SpA gives it enormous special damage even though its Speed is poor.",
  "Crabominable":"Very slow, but 132 Attack makes it a legitimate Trick Room-style wallbreaker.",
  "Ninetales (Alolan)":"Snow Warning plus Aurora Veil gives it one of the best team-support niches in Alola."
};

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
const escapeAttr=s=>String(s).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
const escapeHtml=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
function baseId(name){return String(name).normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/♀/g,"f").replace(/♂/g,"m").toLowerCase().replace(/[^a-z0-9]+/g,"");}
function spriteId(mon){if(FORM_IDS[mon.name])return FORM_IDS[mon.name];return baseId(mon.name.replace(/\s*\(.*?\)\s*/g,"").trim());}
function spriteHtml(mon,cls="pokeSprite"){
  const src=escapeAttr(`https://play.pokemonshowdown.com/sprites/dex/${spriteId(mon)}.png`);
  const fallback=escapeAttr(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${mon.speciesNum}.png`);
  return `<img class="${cls}" src="${src}" data-fallback="${fallback}" alt="${escapeAttr(mon.name)}" loading="lazy" decoding="async" onerror="if(this.dataset.fallback){const fb=this.dataset.fallback;this.dataset.fallback='';this.src=fb;}else{this.style.display='none';this.parentNode&&this.parentNode.classList&&this.parentNode.classList.add('spriteMissing');}">`;
}
function battleFor(mon){return window.USUM_BATTLE?.[spriteId(mon)]||window.USUM_BATTLE?.[baseId(mon.name.replace(/\s*\(.*?\)\s*/g,"").trim())]||null;}
function unpackBattle(mon){
  const b=battleFor(mon); if(!b)return null;
  const [hp,atk,def,spa,spd,spe,regular,hidden,special,unreleased,evolves]=b;
  return {hp,atk,def,spa,spd,spe,regular:regular||[],hidden:hidden||"",special:special||"",unreleased:!!unreleased,evolves:!!evolves,bst:hp+atk+def+spa+spd+spe};
}
function roleFromStats(b){
  if(!b)return "";
  if(b.evolves&&(b.hp+b.def+b.spd)>=220)return "Eviolite can make it much bulkier than the raw stats suggest";
  const physical=b.atk>=b.spa+15,special=b.spa>=b.atk+15;
  if(b.spe>=110&&Math.max(b.atk,b.spa)>=110)return `fast ${physical?"physical":special?"special":"mixed"} attacker`;
  if(b.spe<=55&&Math.max(b.atk,b.spa)>=120)return `slow ${physical?"physical":special?"special":"mixed"} wallbreaker / Trick Room candidate`;
  if(b.def>=120&&b.spd>=120)return "excellent mixed bulk";
  if(b.hp>=100&&b.def>=100&&b.spd>=90)return "bulky all-around tank";
  if(b.def>=120)return "strong physical wall potential";
  if(b.spd>=120)return "strong special wall potential";
  if(b.atk>=120)return "high physical wallbreaking power";
  if(b.spa>=120)return "high special wallbreaking power";
  if(b.spe>=115)return "excellent natural Speed for revenge-killing or support";
  if(b.atk>=100&&b.spa>=100)return "flexible mixed offensive stats";
  if(b.bst<380)return "low raw stats, so its value mostly comes from ability, item or utility tricks";
  return "balanced stats that can support more than one role";
}
function nicheText(mon){
  if(SPECIAL_NICHES[mon.name])return SPECIAL_NICHES[mon.name];
  const b=unpackBattle(mon); if(!b)return "No quick battle note available yet.";
  const abilities=[...b.regular,b.hidden,b.special].filter(Boolean);
  const abilityNote=abilities.map(a=>ABILITY_NICHES[a]).find(Boolean);
  return [abilityNote,roleFromStats(b)].filter(Boolean).slice(0,2).join(" • ");
}
function abilityLine(mon){
  const b=unpackBattle(mon); if(!b)return "";
  const bits=[];
  if(b.regular.length)bits.push(`Ability${b.regular.length>1?"ies":""}: ${b.regular.join(" / ")}`);
  if(b.hidden)bits.push(`HA: ${b.hidden}${b.unreleased?" (unreleased in Gen 7)":""}`);
  if(b.special)bits.push(`Special: ${b.special}`);
  return bits.join(" • ");
}
function statLine(mon){
  const b=unpackBattle(mon); if(!b)return "";
  return `BST ${b.bst} • HP ${b.hp} / Atk ${b.atk} / Def ${b.def} / SpA ${b.spa} / SpD ${b.spd} / Spe ${b.spe}`;
}
function quickInfoHtml(mon,compact=false){
  const abilities=abilityLine(mon),stats=statLine(mon);
  return `<div class="quickInfo ${compact?"compact":""}"><div class="nicheLine"><span class="nicheStar">★</span><span><strong>Why consider it:</strong> ${escapeHtml(nicheText(mon))}</span></div>${abilities?`<div class="abilityLine">${escapeHtml(abilities)}</div>`:""}${!compact&&stats?`<div class="statLine">${escapeHtml(stats)}</div>`:""}</div>`;
}


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
    return `<div class="candidate ${locked?"candidateLocked":""}">
      <div class="candidateHead">
        <div class="spriteWrap candidateSpriteWrap">${spriteHtml(mon,"candidateSprite")}</div>
        <div class="candidateText">
          <div class="name"><span class="dex">#${String(mon.num).padStart(3,"0")}</span>${escapeHtml(mon.name)}</div>
          <div class="types">${mon.types.map(escapeHtml).join(" / ")}</div>
          ${mon.form?`<div class="candidateForm"><span class="formtag">${escapeHtml(mon.form)}</span></div>`:""}
        </div>
      </div>
      ${quickInfoHtml(mon,false)}
      <button type="button" class="pickbtn ${locked?"locked":""}" data-lock="${escapeAttr(k)}">${locked?"✓ LOCKED":"Partner picks this"}</button>
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
      <input type="checkbox" data-k="${escapeAttr(k)}" ${checked?"checked":""} ${disabled?"disabled":""}>
      <div class="pokeInfo">
        <div class="spriteWrap">${spriteHtml(mon,"pokeSprite")}</div>
        <div>
          <div class="name"><span class="dex">#${String(mon.num).padStart(3,"0")}</span>${escapeHtml(mon.name)}</div>
          <div class="types">${mon.types.map(escapeHtml).join(" / ")}</div>
          ${quickInfoHtml(mon,true)}
        </div>
      </div>
      ${mon.form?`<span class="formtag">${escapeHtml(mon.form)}</span>`:""}
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
    return `<div class="sumrow"><div class="t">${t}</div><div class="${mon?"good":""}">${mon?`<div class="summaryChoice"><div class="spriteWrap summarySpriteWrap">${spriteHtml(mon,"summarySprite")}</div><span>${escapeHtml(mon.name)}</span></div>`:"—"}</div></div>`;
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

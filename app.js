/* Workplace First Aid Readiness Planner. Static, browser-only application.
   No submitted answers are stored by this application or sent to a server. */
(() => {
'use strict';
const app = document.getElementById('app');
const toastEl = document.getElementById('toast');
const printable = document.getElementById('printReport');
const INDUSTRIES = {
  general: 'General business', office: 'Professional office', automotive: 'Automotive / body shop',
  warehouse: 'Warehouse / distribution', manufacturing: 'Manufacturing / fabrication',
  restaurant: 'Restaurant / commercial kitchen', construction: 'Construction / field service',
  education: 'Government / education', other: 'Other workplace'
};
const HAZARDS = ['Cuts / lacerations','Minor burns','Serious bleeding','Eye exposures','Chemical contact','Slips, trips & falls','Heat-related illness','Electrical work','Powered equipment / tools','Lifting / material handling','Vehicle work','Other foreseeable hazards'];
const ACCESS = [
  'Supplies can be located and reached when needed',
  'Locations and quantities account for personnel, shifts, layout and usage',
  'Supplies reflect identified hazards; ANSI Class A/B considered where useful',
  'Corrosive exposures have been evaluated for emergency flushing requirements',
  'Higher-severity risks have been considered for equipment and trained response'
];
const RESPONSIBILITIES = [
  'Review workplace hazards','Inspect first aid supplies','Replenish used / expired supplies',
  'Keep emergency information current','Manage equipment checks','Coordinate training needs',
  'Review incidents / lessons learned'
];
const INVENTORY = [
  'Bandages / dressings','Gauze / compression','Gloves / barrier supplies','Wound care supplies',
  'Burn care supplies','Eye care items','Trauma / specialty items','Other'
];
const RESOURCES = [
  'First aid supplies','AED (if available)','Emergency eyewash / shower (if applicable)',
  'Emergency exits / meeting point','EMS entrance / access instructions','Nearby medical facility (if used)'
];
const TRAINING = [
  'First aid responder training','CPR / AED training','Bloodborne pathogens (when applicable)',
  'Emergency response procedures','Eyewash / chemical exposure procedures','Other training / competency'
];
const ACTIONS = [
  'Assign or confirm first aid oversight','Review supply locations and quantities',
  'Resolve identified hazards or questions','Review emergency response / training needs'
];
const industryExamples = {
  general: 'Area: reception | Potential injury: slips or minor cuts | Consider: accessible supplies and clear emergency contacts.',
  office: 'Area: front office | Potential injuries: minor cuts, slips and falls, sudden medical emergencies | Consider: supply access and how to call for help.',
  automotive: 'Area: paint mixing | Exposure: possible chemical splash | Consider: review SDS and emergency flushing requirements. Area: repair bays | Injuries: cuts, burns, bleeding | Consider: appropriate supplies and response.',
  warehouse: 'Area: loading dock | Injuries: material-handling incidents or falls | Consider: supply locations, serious-bleeding preparedness and all-shift access.',
  manufacturing: 'Area: grinding / fabrication | Injuries: cuts, eye injuries, burns | Consider: protective controls, first aid access and emergency response.',
  restaurant: 'Area: commercial kitchen | Injuries: burns, cuts and slips | Consider: burn supplies, dressings, slip prevention and accessible first aid.',
  construction: 'Area: active worksite | Injuries: cuts, falls and other serious trauma | Consider: mobile supplies, site access and specific construction rules.',
  education: 'Area: classrooms / maintenance / kitchens | Different exposures by activity | Consider: suitable resources and responsibilities across buildings and shifts.',
  other: 'Choose each actual work area and task; name the credible injury or exposure, then note the available resources or follow-up question.'
};
const guides = [
  {
    title:'Build the foundation',intro:'Define the process before evaluating products.',
    ask:['What happens today if an employee needs first aid?','Does one process cover every building, department and shift?','Who would know where the resources and contacts are?','When was the process last reviewed after a workplace change?'],
    self:['Write down your actual process, not what you wish were happening.','Include mobile staff, remote areas and overnight shifts if applicable.'],
    example:'Example: “Operations oversees first aid. Cabinets are in the lobby and shop. Supervisors report supply shortages to purchasing within one business day.”',
    caution:'A written first aid plan is useful, but not universally mandated for every office under federal OSHA.'
  },
  {
    title:'Make ownership unmistakable',intro:'Supplies only stay ready when responsibilities are clear.',
    ask:['Who currently owns the first aid process?','Is that an actively managed duty, or one of several tasks they handle?','If the last dressing is used on Tuesday, how is that communicated before the next inspection?','Who takes over when that person is off-site?'],
    self:['List a named role for each task. One person can own more than one task.','Describe what triggers a restock between routine inspections.'],
    example:'Example: “Shift lead checks supplies after significant use; office coordinator orders replacements; production manager verifies completion.”',
    caution:'Administrative program ownership does not automatically make a person a designated first aid responder.'
  },
  {
    title:'Match preparation to actual work',intro:'Discuss foreseeable injuries by task and how employees can access help.',
    ask:['What injuries or exposures could reasonably occur in each area?','Have injuries or near misses exposed a supply or response problem?','Can employees reach supplies on every shift and in distant work areas?','Are chemicals, SDS information or severe bleeding risks relevant here?'],
    self:['Walk through each distinct area: office, production, loading, vehicle, and chemical locations.','Separate known conditions from questions needing a qualified assessment.'],
    example:'',
    caution:'An ANSI Class A/B kit is a supply benchmark, not a complete hazard assessment. Suspected corrosive exposures warrant qualified review of emergency flushing requirements.'
  },
  {
    title:'Look beyond the stocked cabinet',intro:'Record location, availability, condition, and what happens after an item is used.',
    ask:['How frequently are supplies checked, and what triggers an extra check?','Do people order supplies by actual usage or only when someone complains?','Who checks condition, packaging, and applicable expiration dates?','Is tracking done per location or only for the facility as a whole?'],
    self:['Use a separate inventory check for each cabinet or kit.','Record quantities and next steps, not just “yes” or “no.”'],
    example:'Example: “Warehouse cabinet FA-02: compression dressings low; order six units; supervisor to confirm replenishment.”',
    caution:'This log is by supply category and does not independently verify complete ANSI Class A or B contents. No universal federal monthly inspection rule applies to all general-industry kits.'
  },
  {
    title:'Make the response understandable',intro:'Clarify how people obtain urgent assistance and locate resources.',
    ask:['If someone had a serious injury at the far end of the facility, what would happen?','Do all shifts know who calls 911 and how responders enter?','Is the street address, building, or gate information easy to provide?','Where are the AED and eyewash, if applicable?'],
    self:['Write an exact street address and EMS entrance details.','Never delay emergency care while waiting to notify management.'],
    example:'Example: “Call 911 immediately for a serious emergency; give Gate 2 at the south entrance; notify the shift lead; direct responders to the patient.”',
    caution:'This worksheet is not a complete Emergency Action Plan and is not a substitute for training or applicable facility-specific emergency procedures.'
  },
  {
    title:'Verify duties before assuming training',intro:'Training should reflect actual assigned duties and applicable rules.',
    ask:['Are any employees designated to render first aid?','What is the medical-response arrangement for each shift?','Do assigned responders have documented qualifications?','Are any jobs reasonably expected to involve occupational blood exposure?'],
    self:['Mark uncertain training duties as “To determine,” not “Not required.”','Record provider and review/renewal dates according to applicable requirements.'],
    example:'Example: “HR to determine whether designated first aid responders are covered by bloodborne pathogens requirements; verify CPR/AED certifications.”',
    caution:'Do not assume annual first aid/CPR training is mandatory for everyone. Covered employees under the bloodborne pathogens standard have specific initial and annual training duties.'
  },
  {
    title:'Turn discovery into action',intro:'Leave the business with useful priorities even if no purchase happens.',
    ask:['What is already working well and should be preserved?','Which uncertainties would benefit from qualified review?','What could be improved internally with clear ownership?','Where would it be useful to compare an outsourced service?'],
    self:['Record only findings you can support; call unknowns “open questions.”','Assign owners and deadlines; do not wait 30 days on an immediate serious hazard.'],
    example:'Example: “Strength: all shifts know where the cabinets are. Open question: whether mixing-room eyewash is suitable. Next step: EHS reviews SDS and facilities; target this week.”',
    caution:'Priority labels are planning aids, not OSHA citation categories or compliance determinations.'
  }
];
const sections = [
  { id:'program',label:'Program outline',title:'First Aid Program — Starter Outline',desc:'Define your workplace’s purpose, scope, current arrangements and review process.', blocks:[
    {type:'fields',title:'Program purpose and scope',caption:'Start with a plain-language statement. Customize what this plan covers.',fields:[
      ['purpose','Program purpose','textarea','Describe the goal of your first aid arrangements.'],
      ['scope','Locations, departments, shifts and people covered','textarea','E.g., front office, warehouse, drivers, evening shift.']
    ]},
    {type:'fields',title:'How this workplace manages first aid',caption:'Describe what actually happens today, or leave an open question.',fields:[
      ['hazardOwner','Hazard review owner / frequency','text','e.g., Safety manager; after major changes'],
      ['supplyLocations','Primary first aid supply locations','text','e.g., lobby, warehouse station A'],
      ['maintenance','Supply maintenance owner / frequency','text','e.g., Shift lead; every month and after use'],
      ['requestHelp','How workers request help / call 911','textarea','e.g., dial 911; alert supervisor; provide gate address'],
      ['responders','Trained responders, if required / medical access','textarea','e.g., assigned responders or nearby medical assistance'],
      ['equipment','Special equipment, if applicable','text','e.g., AED, eyewash, bleeding control'],
      ['communication','How employees learn the procedures','text','e.g., orientation and posted resource map'],
      ['reviewOwner','Program review owner / next review','text','e.g., Operations; January 2027']
    ]},
    {type:'notice',text:'For serious medical emergencies, call 911 promptly, follow facility procedures and avoid delaying professional care. Employees should assist within their training and capabilities.'}
  ]},
  { id:'ownership',label:'Responsibility & ownership',title:'Responsibility & Ownership',desc:'Specify who performs each recurring task, who backs them up and what triggers follow-up.',blocks:[
    {type:'fields',title:'Responsible people and coverage',fields:[
      ['owner','First aid program owner','text','Name or role'],['backup','Alternate / backup','text','Name or role'],
      ['coverage','Facility and shift coverage','textarea','Who covers second shift, off-site workers, or absences?']
    ]},
    {type:'fixedTable',id:'responsibilities',title:'Who does what?',caption:'A single person may perform several tasks. Define a frequency or trigger.',labels:RESPONSIBILITIES,cols:[['assigned','Assigned person / role','text'],['frequency','Frequency / trigger','text']]},
    {type:'checks',id:'ownershipChecks',title:'Questions to resolve',labels:[
      'Each shift knows who is responsible','A backup is available when the owner is absent','A defined restock-request process exists',
      'Employees know the locations of supplies','Contractors, visitors, remote areas and mobile employees were considered where applicable'
    ]},
    {type:'fields',title:'Normal inspection and follow-up process',fields:[['inspectionProcess','Describe the routine and what happens between inspections','textarea','e.g., Supervisor checks quarterly and after significant use; purchasing is notified of shortages.']]}
  ]},
  { id:'hazards',label:'Hazards & accessibility',title:'Workplace Hazard & Accessibility Review',desc:'Discuss credible injury scenarios by work area, then evaluate access to suitable resources.',blocks:[
    {type:'checks',id:'hazardsPresent',title:'Hazards present or reasonably foreseeable',caption:'Check only what applies; this does not replace a formal hazard assessment.',labels:HAZARDS},
    {type:'dynamicTable',id:'hazardAreas',title:'Review by area or task',caption:'Use one row per distinct work area or activity.',cols:[['area','Area / task','text'],['risk','Hazards / potential injuries','textarea'],['response','Supplies / response considerations','textarea']],initial:3},
    {type:'checks',id:'accessChecks',title:'Access and suitability considerations',caption:'Check points reviewed—not automatic compliance certifications.',labels:ACCESS},
    {type:'fields',title:'Qualified follow-up',fields:[['qualifiedFollowup','Items requiring qualified review','textarea','e.g., SDS review for possible corrosive exposure; eyewash suitability not yet determined.']]},
    {type:'notice',warning:true,text:'Do not label a facility compliant or noncompliant from this discussion. Refer specialized exposures and technical requirements to qualified personnel.'}
  ]},
  { id:'supplies',label:'Supply & replenishment',title:'Supply Inspection & Replenishment Log',desc:'Document availability, condition, replenishment needs and accountability for a specific supply location.',blocks:[
    {type:'fields',title:'Location and review details',fields:[
      ['kitLocation','Kit / cabinet ID and location','text','e.g., FA-02, warehouse west wall'],
      ['inspector','Inspector / assigned role','text','Name or role'],
      ['inspectionDate','Inspection date','date',''],['nextCheck','Next planned check','date',''],
      ['restockMethod','How supplies are replenished','textarea','e.g., purchasing order, internal stockroom, or managed service']
    ]},
    {type:'fixedTable',id:'inventory',title:'Supply category inspection',caption:'Use an item-by-item standard-specific inventory separately when required.',labels:INVENTORY,cols:[['available','Available?','availability'],['condition','Condition / applicable expiration','text'],['action','Action / quantity needed','text']]},
    {type:'dynamicTable',id:'corrective',title:'Restock / corrective action record',cols:[['date','Date','date'],['issue','Item or issue','text'],['owner','Owner','text'],['verified','Closed / verified','text']],initial:2},
    {type:'fields',title:'Inspection result',fields:[['outcome','Inspection outcome','select',['Select…','Ready for intended use','Restock requested','Follow-up needed']],['initials','Inspector initials','text',''],['followupDate','Follow-up date','date','']]}
  ]},
  { id:'emergency',label:'Emergency response',title:'Emergency Response Quick Plan',desc:'Keep basic emergency communication, site access and resource locations easy to find.',blocks:[
    {type:'fields',title:'Contact and site information',fields:[
      ['address','Exact site address','textarea','Include building, suite or gate information'],
      ['mainContact','Primary emergency contact / phone','text','Name, role, phone'],
      ['alternateContact','Alternate emergency contact / phone','text','Name, role, phone']
    ]},
    {type:'fixedTable',id:'resources',title:'Where are resources located?',labels:RESOURCES,cols:[['location','Location / access notes','textarea']]},
    {type:'notice',text:'General sequence: 1. Assess scene safety. 2. Call 911 immediately for serious or life-threatening emergencies and provide the exact address. 3. Alert the designated contact and request trained help. 4. Direct EMS to the patient. 5. Follow appropriate incident reporting procedures.'},
    {type:'fields',title:'Site-specific instructions',fields:[['accessDetails','Special access instructions / emergency details','textarea','e.g., Gate 2 on the south side; after-hours security must open the gate.']]}
  ]},
  { id:'training',label:'Training & competency',title:'Training & Competency Tracker',desc:'Review training based on assigned duties, hazards and applicable requirements—not assumptions.',blocks:[
    {type:'fields',title:'Training oversight',fields:[['coordinator','Training coordinator / role','text','e.g., HR coordinator'],['reviewDate','Date reviewed','date','']]},
    {type:'fixedTable',id:'trainingNeeds',title:'Training-needs review',caption:'Use “To determine” if further legal or safety review is needed.',labels:TRAINING,cols:[['applies','Applies?','yesnotbd'],['status','Owner / status','text']]},
    {type:'dynamicTable',id:'trainingRecords',title:'Personnel and refresher record',caption:'Do not include employee medical information.',cols:[['person','Employee / role','text'],['course','Training / provider','text'],['completed','Completed','date'],['renewal','Review / renewal','text']],initial:3},
    {type:'fields',title:'Outstanding training questions',fields:[['gap','Gap or follow-up to determine','textarea','e.g., Verify designated responder BBP coverage and annual training obligations'],['gapOwner','Assigned to','text',''],['gapDate','Target date','date','']]},
    {type:'notice',warning:true,text:'Do not assume all staff need annual CPR or first aid classes. OSHA bloodborne pathogens training requirements apply when the occupational-exposure criteria are met.'}
  ]},
  { id:'actions',label:'Findings & action plan',title:'Meeting Recap & 30-Day Action Plan',desc:'Document strengths, unresolved questions and a realistic next step—whether or not any service is purchased.',blocks:[
    {type:'fields',title:'What is working today?',caption:'Recognize the current strengths before discussing opportunities.',fields:[['strengths','Positive practices to preserve','textarea','e.g., Employees know where stations are; both shifts have designated contacts.']]},
    {type:'dynamicTable',id:'findings',title:'Observations or open questions',caption:'Distinguish observed facts from questions requiring additional investigation.',cols:[['observation','Observation / open question','textarea'],['next','Suggested next step','textarea'],['priority','Priority','priority']],initial:3},
    {type:'fixedTable',id:'actions',title:'Next 30 days',caption:'Modify the tasks as needed; act promptly on any immediate serious concern.',labels:ACTIONS,cols:[['owner','Assigned person','text'],['due','Due date','date'],['done','Done?','yesno']]},
    {type:'fields',title:'Next conversation',fields:[['followup','Proposed follow-up date','date',''],['preferred','Preferred contact / method','text','e.g., operations manager by email'],['extra','Additional notes / potential options to evaluate','textarea','e.g., internal restocking process or managed supply service, if relevant']]},
    {type:'notice',text:'The customer retains the completed record regardless of whether they buy. This is a planning aid, not a formal audit, OSHA certification or legal opinion.'}
  ]}
];
let state = freshState();
let toastTimer;
function freshState(){return {mode:'guided',industry:'general',step:0,started:false,dirty:false,answers:{},rows:{},visited:{},meta:{business:'',address:'',contact:'',facilitator:'',date:localISO()},hasConfirmed:false};}
function localISO(){const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')}
function esc(x){return String(x==null?'':x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function byKey(key){return state.answers[key] ?? ''}
function update(key,val){state.answers[key]=val;state.dirty=true;renderProgressOnly();}
function setMeta(k,v){state.meta[k]=v;state.dirty=true;}
function input(key,label,type='text',placeholder='',opts={}){
  const val=byKey(key); const id=`f-${key.replace(/[^a-z0-9]/gi,'-')}`;
  let ctrl;
  if(type==='textarea')ctrl=`<textarea data-field="${esc(key)}" id="${id}" rows="3" placeholder="${esc(placeholder)}">${esc(val)}</textarea>`;
  else if(type==='select')ctrl=`<select data-field="${esc(key)}" id="${id}">${placeholder.map((v,i)=>`<option value="${esc(i? v:'')}" ${val===(i?v:'')?'selected':''}>${esc(v)}</option>`).join('')}</select>`;
  else ctrl=`<input data-field="${esc(key)}" id="${id}" type="${type}" value="${esc(val)}" placeholder="${esc(placeholder)}" />`;
  return `<div class="field ${opts.span2?'span2':''}"><label for="${id}">${esc(label)}</label>${ctrl}</div>`;
}
function tableInput(key,type='text'){
  const val=byKey(key),common=`class="table-input" data-field="${esc(key)}" aria-label="${esc(key.split('.').slice(-1)[0])}"`;
  if(type==='textarea')return `<textarea ${common} rows="2">${esc(val)}</textarea>`;
  const choices={availability:['','Yes','No','Low','N/A'],yesnotbd:['','Yes','No','To determine'],yesno:['','Yes','No'],priority:['','High','Medium','Low']};
  if(choices[type])return `<select ${common}>${choices[type].map(v=>`<option value="${esc(v)}" ${v===val?'selected':''}>${esc(v||'— Choose —')}</option>`).join('')}</select>`;
  return `<input ${common} type="${type}" value="${esc(val)}"/>`;
}
function ensureRows(section){
  for(const b of section.blocks){if(b.type==='dynamicTable' && !state.rows[b.id])state.rows[b.id]=Array.from({length:b.initial||2},(_,i)=>`${b.id}-${i+1}`);}
}
function renderBlock(section,b){
  const sid=section.id;
  if(b.type==='fields'){
    const elements=b.fields.map((f,i)=>input(`${sid}.${f[0]}`,f[1],f[2],f[3],{span2:f[2]==='textarea'}));
    return `<div class="sheet-card"><h3 class="group-title">${esc(b.title)}</h3>${b.caption?`<p class="group-caption">${esc(b.caption)}</p>`:''}<div class="form-grid">${elements.join('')}</div></div>`;
  }
  if(b.type==='checks'){
    return `<div class="sheet-card"><h3 class="group-title">${esc(b.title)}</h3>${b.caption?`<p class="group-caption">${esc(b.caption)}</p>`:''}<div class="choice-grid">${b.labels.map((label,i)=>{const k=`${sid}.${b.id}.${i}`;return `<label class="choice"><input type="checkbox" data-field="${esc(k)}" ${byKey(k)?'checked':''}/><span>${esc(label)}</span></label>`}).join('')}</div></div>`;
  }
  if(b.type==='notice')return `<div class="callout ${b.warning?'warning':''}">${esc(b.text)}</div>`;
  if(b.type==='fixedTable'){
    return `<div class="sheet-card"><h3 class="group-title">${esc(b.title)}</h3>${b.caption?`<p class="group-caption">${esc(b.caption)}</p>`:''}<div class="data-table-wrap"><table class="data-table"><thead><tr><th>Function / category</th>${b.cols.map(c=>`<th>${esc(c[1])}</th>`).join('')}</tr></thead><tbody>${b.labels.map((row,i)=>`<tr><td class="row-name">${esc(row)}</td>${b.cols.map(c=>`<td>${tableInput(`${sid}.${b.id}.${i}.${c[0]}`,c[2])}</td>`).join('')}</tr>`).join('')}</tbody></table></div></div>`;
  }
  if(b.type==='dynamicTable'){
    const rowIds=state.rows[b.id]||[];
    return `<div class="sheet-card"><h3 class="group-title">${esc(b.title)}</h3>${b.caption?`<p class="group-caption">${esc(b.caption)}</p>`:''}<div class="data-table-wrap"><table class="data-table"><thead><tr>${b.cols.map(c=>`<th>${esc(c[1])}</th>`).join('')}<th> </th></tr></thead><tbody>${rowIds.map((r)=>`<tr>${b.cols.map(c=>`<td>${tableInput(`${sid}.${b.id}.${r}.${c[0]}`,c[2])}</td>`).join('')}<td style="min-width:48px"><button type="button" class="iconbtn" data-remove="${esc(b.id)}" data-row="${esc(r)}" title="Remove row" aria-label="Remove row">×</button></td></tr>`).join('')}</tbody></table></div><div class="row-actions"><button type="button" class="btn btn-soft" data-add="${esc(b.id)}">＋ Add another row</button></div></div>`;
  }
  return '';
}
function renderLanding(){
  state.started=false;
  app.innerHTML=`<div class="landing"><nav class="land-nav"><div class="brand"><div class="brandmark">＋</div><span>Workplace First Aid<br>Readiness Planner</span></div><span class="nav-note">Complimentary planning resource · No account required</span></nav>
    <main class="hero"><div><span class="eyebrow">PREPAREDNESS BEGINS WITH A PROCESS</span><h1>A better first aid plan starts with better questions.</h1><p class="hero-lead">Work through seven practical worksheets to document responsibilities, workplace hazards, supply readiness, emergency response and training. Keep a usable action plan—whether or not you purchase a service.</p>
    <div class="feature"><div class="feature-icon">✓</div><div><strong>Guided or self-service</strong><small>Conversation prompts for an appointment, with plain-language examples for doing it yourself.</small></div></div>
    <div class="feature"><div class="feature-icon">▤</div><div><strong>Seven editable worksheets</strong><small>Follow the full readiness framework or focus on the sections relevant today.</small></div></div>
    <div class="feature"><div class="feature-icon">↗</div><div><strong>Export and share</strong><small>Download a PDF, save a JSON backup, or use your device's share sheet.</small></div></div></div>
    <section class="launch-card"><span class="eyebrow">NEW SESSION</span><h2>Start a readiness review</h2><p class="subtext">Choose how you'll use the toolkit. All fields start blank for each new prospect.</p>
      <div class="mode-row"><button data-mode="guided" class="mode-option ${state.mode==='guided'?'active':''}" aria-pressed="${state.mode==='guided'}"><span>With a facilitator</span><small>Helpful questions for an advisor-led meeting</small></button><button data-mode="diy" class="mode-option ${state.mode==='diy'?'active':''}" aria-pressed="${state.mode==='diy'}"><span>Do it myself</span><small>Self-assessment tips and examples for each step</small></button></div>
      <form id="startForm"><div class="form-grid">
        <div class="field span2"><label for="business">Business / facility</label><input id="business" name="business" maxlength="150" placeholder="Business name (optional)" value="${esc(state.meta.business)}"></div>
        <div class="field span2"><label for="address">Site address</label><input id="address" name="address" maxlength="250" placeholder="Street address or site location" value="${esc(state.meta.address)}"></div>
        <div class="field"><label for="industry">Workplace type</label><select id="industry" name="industry">${Object.entries(INDUSTRIES).map(([k,v])=>`<option value="${k}" ${state.industry===k?'selected':''}>${esc(v)}</option>`).join('')}</select></div>
        <div class="field"><label for="date">Review date</label><input id="date" type="date" name="date" value="${esc(state.meta.date)}"></div>
        <div class="field"><label for="contact">Contact / title</label><input id="contact" name="contact" maxlength="150" placeholder="Optional"></div>
        <div class="field"><label for="facilitator">Prepared with / by</label><input id="facilitator" name="facilitator" maxlength="150" placeholder="Optional"></div>
      </div><div style="height:19px"></div><button class="btn btn-primary btn-full" type="submit">Begin the seven worksheets →</button></form>
      <div style="margin-top:10px"><button class="btn btn-quiet btn-full" id="importStart">Resume from a JSON backup</button></div>
      <p class="privacy"><strong>Privacy by design:</strong> This version does not store sessions online, run analytics, or automatically save answers. A refreshed or reopened page starts blank. Export your work before leaving.</p>
    </section></main></div>`;
}
function renderProgressOnly(){
  const touched=sections.filter(s=>Object.entries(state.answers).some(([k,v])=>k.startsWith(s.id+'.')&&!['program.purpose','emergency.address'].includes(k)&&(v===true||String(v).trim()!==''))).length;
  const progressEl=document.getElementById('progressFill'); if(progressEl)progressEl.style.width=`${Math.round(touched/7*100)}%`;
  const t=document.getElementById('progressText');if(t)t.textContent=`${touched} of 7 sections started`;
}
function renderApp(scroll=true){
  ensureRows(sections[state.step]);
  const section=sections[state.step]; const helper=guides[state.step];
  const touched=sections.filter(s=>Object.entries(state.answers).some(([k,v])=>k.startsWith(s.id+'.')&&!['program.purpose','emergency.address'].includes(k)&&(v===true||String(v).trim()!==''))).length;
  app.innerHTML=`<div class="app-shell"><header class="topbar"><div class="brand"><div class="brandmark">＋</div><span>First Aid Readiness<br>Planner</span></div><div class="top-right"><span class="site-label">${esc(state.meta.business || 'Unnamed facility')}</span><button class="btn btn-quiet" id="exportBtn">↓ PDF</button><button class="btn btn-quiet" id="shareBtn">↗ Share</button><button class="btn btn-primary" id="newBtn">＋ New prospect</button></div></header>
    <nav class="mobile-nav" aria-label="Worksheet selection">${sections.map((s,i)=>`<button class="${i===state.step?'active':''}" data-goto="${i}">${i+1}. ${esc(s.label)}</button>`).join('')}</nav>
    <aside class="side"><div class="nav-kicker">SEVEN WORKSHEETS</div>${sections.map((s,i)=>`<button class="step-link ${i===state.step?'active':''} ${state.visited[i]?'done':''}" data-goto="${i}" aria-current="${i===state.step?'step':'false'}"><span class="num">${state.visited[i]?'•':String(i+1).padStart(2,'0')}</span><span class="step-name">${esc(s.label)}</span></button>`).join('')}
    <div class="sidefoot"><strong id="progressText">${touched} of 7 sections started</strong><div class="progress" aria-label="Progress"><b id="progressFill" style="width:${Math.round(touched/7*100)}%"></b></div><p style="margin-top:9px">Blank fields are allowed. No compliance score is assigned.</p></div>
    <div class="sidefoot"><strong>Session tools</strong><button class="link" id="jsonSave">↓ Save editable JSON backup</button><br><button class="link" id="jsonImport">↑ Resume a JSON backup</button><br><button class="link" id="printBtn">↗ Print / Save as PDF</button><p style="margin-top:9px">Leaving or refreshing starts a new blank session unless you save a backup.</p></div></aside>
    <main class="main"><div class="workarea"><div class="sheet"><details class="mobile-help"><summary>Questions, examples & guidance for this worksheet</summary><div class="mobile-help-inner"><p>${esc(helper.intro)}</p><strong>${state.mode==='guided'?'Questions to ask':'Questions to ask yourself'}</strong>${helper.ask.map(q=>`<p>“${esc(q)}”</p>`).join('')}${state.mode==='diy'?helper.self.map(x=>`<p>${esc(x)}</p>`).join(''):''}<strong>Example</strong><p>${esc(state.step===2?industryExamples[state.industry]||industryExamples.general:helper.example)}</p><p><strong>Important:</strong> ${esc(helper.caution)}</p></div></details><div class="step-counter">WORKSHEET ${String(state.step+1).padStart(2,'0')} OF 07 · ${state.mode==='guided'?'FACILITATED REVIEW':'SELF-GUIDED REVIEW'}</div><h1 class="section-heading">${esc(section.title)}</h1><p class="section-desc">${esc(section.desc)}</p>${section.blocks.map(b=>renderBlock(section,b)).join('')}
    <div class="footer-actions"><div class="notice">Educational planning resource only. The employer is responsible for applicable requirements, site-specific safety decisions and qualified review as needed.</div><div class="button-set"><button class="btn btn-quiet" id="printMainBtn">Print / PDF fallback</button><button class="btn btn-quiet" id="prevBtn" ${state.step===0?'disabled':''}>← Previous</button><button class="btn btn-primary" id="nextBtn">${state.step===6?'View sharing options →':'Continue →'}</button></div></div>
    <div class="foot-links">Helpful source references: <a href="https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.151" target="_blank" rel="noopener noreferrer">OSHA 1910.151</a> · <a href="https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.151AppA" target="_blank" rel="noopener noreferrer">First aid supply guidance</a> · <a href="https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.1030" target="_blank" rel="noopener noreferrer">Bloodborne pathogens</a> · <a href="https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.50" target="_blank" rel="noopener noreferrer">Construction first aid</a>. State and other applicable standards may differ.</div>
    </div><aside class="helper-panel"><div class="helper-top"><div class="tiny">${state.mode==='guided'?'FACILITATOR NOTES':'DIY EXPLANATIONS'}</div><h3>${esc(helper.title)}</h3></div><div class="helper-body"><div><p class="helper-mini">${esc(helper.intro)}</p><h4>${state.mode==='guided'?'Questions to ask':'Questions to ask yourself'}</h4>${helper.ask.map(q=>`<div class="prompt-q">“${esc(q)}”</div>`).join('')}</div><div>${state.mode==='diy'?`<h4>How to complete it</h4>${helper.self.map(x=>`<div class="prompt-q">${esc(x)}</div>`).join('')}`:''}<div class="helper-example"><strong>Example</strong><br>${esc(state.step===2?industryExamples[state.industry]||industryExamples.general:helper.example)}</div><p class="helper-mini"><strong>Keep in mind:</strong> ${esc(helper.caution)}</p></div></div></aside></div></main></div>`;
  if(scroll)window.scrollTo({top:0,behavior:'instant'});
}
function toast(msg){clearTimeout(toastTimer);toastEl.textContent=msg;toastEl.classList.add('show');toastTimer=setTimeout(()=>toastEl.classList.remove('show'),4500);}
function goStep(i){state.visited[state.step]=true;state.step=Math.max(0,Math.min(6,Number(i)));renderApp();}
function newRow(table){const s=sections[state.step];const b=s.blocks.find(b=>b.id===table);if(!b)return;const id=table+'-'+Math.random().toString(36).slice(2,10);(state.rows[table] ||= []).push(id);state.dirty=true;renderApp(false);toast('Row added.');}
function removeRow(table,id){const list=state.rows[table];if(!list)return;state.rows[table]=list.filter(x=>x!==id);const prefix=`${sections[state.step].id}.${table}.${id}.`;Object.keys(state.answers).filter(k=>k.startsWith(prefix)).forEach(k=>delete state.answers[k]);state.dirty=true;renderApp(false);}
function confirmNew(){
 const m=document.createElement('div');m.className='modal-backdrop';m.id='newDialog';m.innerHTML=`<div class="modal" role="dialog" aria-modal="true" aria-labelledby="dialogtitle"><h2 id="dialogtitle">Start a new prospect?</h2><p>This clears the current answers from the screen. To keep this review, export the PDF and/or save an editable JSON backup first. Nothing is stored automatically.</p><div class="modal-actions"><button class="btn btn-quiet" id="cancelNew">Keep current work</button><button class="btn btn-danger" id="confirmNew">Clear and start fresh</button></div></div>`;document.body.append(m);
}
function fileName(ext='pdf'){
 const base=(state.meta.business||'Workplace').normalize('NFKD').replace(/[^A-Za-z0-9 -]/g,'').trim().replace(/\s+/g,'_').slice(0,58)||'Workplace';return `${base}_First_Aid_Readiness_${state.meta.date||localISO()}.${ext}`;
}
/* Customer-facing report: only recorded material is printed, with a concise
   summary of untouched sections. The worksheets themselves are unchanged. */
function hasReportValue(v){return v===true || (typeof v==='string' && v.trim().length>0);}
function normalPurpose(){return state.meta.business?`Support timely and appropriate first aid arrangements for injuries or sudden illness at ${state.meta.business}, considering the hazards and conditions of our operations.`:'';}
function isDraftPrefill(key,value){
 return key==='program.purpose' && value===normalPurpose() ||
        key==='emergency.address' && value===state.meta.address;
}
function buildReportModel(){
 const result=[];
 for(let si=0;si<sections.length;si++){
  const section=sections[si],groups=[];
  for(const b of section.blocks){
   if(b.type==='notice')continue;
   const entries=[];
   if(b.type==='fields'){
    for(const f of b.fields){const key=`${section.id}.${f[0]}`,value=byKey(key);
     if(hasReportValue(value) && !isDraftPrefill(key,value))entries.push({label:f[1],value:String(value)});
    }
   }else if(b.type==='checks'){
    const chosen=b.labels.filter((label,i)=>byKey(`${section.id}.${b.id}.${i}`)===true);
    if(chosen.length)entries.push({label:'Items marked during review',value:chosen.join('; ')});
   }else if(b.type==='fixedTable'){
    for(let i=0;i<b.labels.length;i++){
     const cells=b.cols.map(c=>({label:c[1],value:byKey(`${section.id}.${b.id}.${i}.${c[0]}`)})).filter(c=>hasReportValue(c.value));
     if(cells.length)entries.push({label:b.labels[i],parts:cells});
    }
   }else if(b.type==='dynamicTable'){
    for(const [i,rid] of (state.rows[b.id]||[]).entries()){
     const cells=b.cols.map(c=>({label:c[1],value:byKey(`${section.id}.${b.id}.${rid}.${c[0]}`)})).filter(c=>hasReportValue(c.value));
     if(cells.length)entries.push({label:`Entry ${entries.length+1}`,parts:cells});
    }
   }
   if(entries.length)groups.push({title:b.title,type:b.type,entries});
  }
  result.push({title:section.title,number:si+1,groups,hasContent:groups.length>0});
 }
 const findings=result[6].groups.find(x=>x.title==='Observations or open questions')?.entries||[];
 const followup=byKey('actions.followup');
 const unreviewed=result.filter(s=>!s.hasContent);
 const strengths=byKey('actions.strengths');
 return {facility:state.meta.business||'Facility not specified',industry:INDUSTRIES[state.industry]||'General business',
   address:state.meta.address,contact:state.meta.contact,facilitator:state.meta.facilitator,
   date:state.meta.date||localISO(),sections:result,findings,followup,strengths,unreviewed,
   documented:result.length-unreviewed.length};
}
function displayAnswer(v){return v===true?'Yes':v===false || v==null || String(v).trim()===''?'Not recorded':String(v);}
function reportPdfText(t){return String(t==null?'':t).replace(/[\u2013\u2014\u2015]/g,'-').replace(/[\u2018\u2019]/g,"'").replace(/[\u201c\u201d]/g,'"').replace(/\u2022/g,'-').replace(/\t/g,' ');}
function getPdf(){
 if(!window.jspdf?.jsPDF){toast('PDF library has not loaded. Use Print / Save as PDF, or check your internet connection.');return null;}
 const model=buildReportModel();
 const {jsPDF}=window.jspdf;
 const pdf=new jsPDF({orientation:'portrait',unit:'pt',format:'letter'});
 const W=612,H=792,M=46,CW=W-M*2,BOTTOM=733;
 const colors={deep:[20,64,64],green:[48,119,98],ink:[39,56,55],muted:[99,113,110],line:[216,228,221],pale:[238,246,241],soft:[249,251,249],white:[255,255,255]};
 let y=0,page=1;
 function color(arr){pdf.setTextColor(...arr);}
 function font(size,style='normal',c=colors.ink){pdf.setFont('helvetica',style);pdf.setFontSize(size);color(c);}
 function lines(text,width,size=9,style='normal'){
  font(size,style);return pdf.splitTextToSize(reportPdfText(text),width);
 }
 function newPage(){pdf.addPage();page++;header(false);}
 function ensure(height){if(y+height>BOTTOM)newPage();}
 function header(cover){
  if(cover){
   pdf.setFillColor(...colors.deep);pdf.rect(0,0,W,132,'F');
   font(8.5,'bold',[179,222,206]);pdf.text('WORKPLACE FIRST AID  /  READINESS REVIEW',M,38);
   font(23,'bold',colors.white);pdf.text('First Aid Readiness',M,76);pdf.text('Review & Action Plan',M,104);
   y=151;
  }else{
   font(8,'bold',colors.green);pdf.text('FIRST AID READINESS  /  WORKING REVIEW',M,38);
   font(8,'normal',colors.muted);pdf.text(reportPdfText(model.facility).slice(0,53),W-M,38,{align:'right'});
   pdf.setDrawColor(...colors.line);pdf.line(M,48,W-M,48);y=64;
  }
 }
 function barLabel(text){ensure(32);font(10,'bold',colors.deep);pdf.text(reportPdfText(text),M,y+11);y+=23;}
 function paragraph(text,{size=9,width=CW,leading=13,colorCode=colors.ink,indent=0,space=8}={}){
  const chunks=lines(text,width,size);font(size,'normal',colorCode);
  for(const ln of chunks){ensure(leading+2);pdf.text(ln,M+indent,y);y+=leading;}
  y+=space;
 }
 function keyValue(label,value){
  const LW=172,VW=CW-LW-18,lead=12.5;
  const labLines=lines(label,LW-9,8.6,'bold'),valueLines=lines(value,VW,9.2);
  const total=Math.max(labLines.length,valueLines.length);
  for(let start=0;start<total;){
   const count=Math.min(22,total-start);
   const height=Math.max(27,count*lead+13);ensure(height+1);
   pdf.setFillColor(...colors.soft);pdf.rect(M,y,CW,height,'F');
   pdf.setDrawColor(...colors.line);pdf.line(M,y+height,W-M,y+height);
   font(8.5,'bold',colors.deep);
   labLines.slice(start,start+count).forEach((ln,i)=>pdf.text(ln,M+11,y+17+i*lead));
   font(9.2,'normal',colors.ink);
   valueLines.slice(start,start+count).forEach((ln,i)=>pdf.text(ln,M+LW+5,y+17+i*lead));
   y+=height+1;start+=count;
  }
 }
 function entry(label,parts){
  ensure(42);
  pdf.setDrawColor(...colors.line);pdf.line(M,y,W-M,y);
  y+=15;font(9.2,'bold',colors.deep);pdf.text(reportPdfText(label),M+5,y);y+=12;
  for(const p of parts)keyValue(p.label,String(p.value));
  y+=7;
 }
 function callout(label,text){
  if(!hasReportValue(text))return;
  const txtLines=lines(text,CW-30,9.4),h=txtLines.length*14+38;
  if(h<490){ensure(h+8);pdf.setFillColor(...colors.pale);pdf.roundedRect(M,y,CW,h,8,8,'F');
   font(8.4,'bold',colors.green);pdf.text(reportPdfText(label.toUpperCase()),M+15,y+19);
   font(9.4,'normal',colors.ink);txtLines.forEach((ln,i)=>pdf.text(ln,M+15,y+40+i*14));y+=h+12;
  }else{barLabel(label);paragraph(text);}
 }
 function sectionHead(title){
  ensure(60);y+=5;
  pdf.setFillColor(...colors.deep);pdf.roundedRect(M,y,CW,35,6,6,'F');
  font(11,'bold',colors.white);pdf.text(reportPdfText(title),M+15,y+22);y+=46;
 }
 function miniHead(text){ensure(41);font(9.8,'bold',colors.green);pdf.text(reportPdfText(text),M,y+11);y+=24;}
 function sectionBody(s){
  sectionHead(`${String(s.number).padStart(2,'0')}  ${s.title}`);
  for(const g of s.groups){miniHead(g.title);
   for(const item of g.entries){
    if(item.parts)entry(item.label,item.parts);
    else keyValue(item.label,item.value);
   }
   y+=10;
  }
 }
 header(true);
 // Cover metadata has no deliberately blank placeholders.
 const meta=[['Facility',model.facility],['Workplace type',model.industry],['Review date',model.date]];
 if(model.address)meta.push(['Site address',model.address]);
 if(model.contact)meta.push(['Primary contact',model.contact]);
 if(model.facilitator)meta.push(['Prepared with / by',model.facilitator]);
 for(const [a,b] of meta)keyValue(a,b);
 y+=11;
 barLabel('REVIEW AT A GLANCE');
 callout('Working review',`${model.documented} of 7 worksheets include documented responses. This is a discussion record, not a compliance score or certification.`);
 if(model.strengths)callout('Existing strengths',model.strengths);
 if(model.findings.length){
  miniHead('OBSERVATIONS & AGREED NEXT STEPS');
  for(const f of model.findings.slice(0,4)){
   const obs=f.parts.find(x=>x.label==='Observation / open question')?.value;
   const action=f.parts.find(x=>x.label==='Suggested next step')?.value;
   const priority=f.parts.find(x=>x.label==='Priority')?.value;
   if(obs)paragraph(`${priority?`[${priority}] `:''}${obs}`,{size:9.1,space:3});
   if(action)paragraph(`Next step: ${action}`,{size:8.8,colorCode:colors.green,space:7});
  }
  if(model.findings.length>4)paragraph(`${model.findings.length-4} additional item(s) appear in Worksheet 07.`,{size:8,colorCode:colors.muted});
 }
 if(model.followup)paragraph(`Proposed follow-up: ${model.followup}`,{size:9.2,colorCode:colors.green});
 if(model.unreviewed.length){
  miniHead('STILL TO BE DOCUMENTED');
  paragraph(model.unreviewed.map(s=>s.title).join('  /  '),{size:8.7,colorCode:colors.muted,space:10});
 }
 if(!model.documented)paragraph('No worksheet responses have been documented yet.',{colorCode:colors.muted});
 // Details start on a clean page for easy handoff and clear hierarchy.
 const documented=model.sections.filter(s=>s.hasContent);
 if(documented.length){newPage();barLabel('DETAILED WORKSHEET NOTES');for(const s of documented)sectionBody(s);}
 ensure(75);y+=8;pdf.setDrawColor(...colors.line);pdf.line(M,y,W-M,y);y+=17;
 paragraph('Planning aid only. Not an OSHA/ANSI certification, a full hazard assessment, medical protocol, or legal opinion. The employer should verify site-specific requirements with qualified personnel.',{size:8,colorCode:colors.muted,space:4});
 paragraph('Reference starting points: OSHA 29 CFR 1910.151 and Appendix A; 1910.1030; and 1926.50 where applicable.',{size:8,colorCode:colors.muted,space:4});
 const pages=pdf.internal.getNumberOfPages();
 for(let p=1;p<=pages;p++){
  pdf.setPage(p);pdf.setDrawColor(...colors.line);pdf.line(M,H-42,W-M,H-42);
  font(7.8,'normal',colors.muted);pdf.text(reportPdfText(model.facility).slice(0,48),M,H-28);
  pdf.text(`Working review  |  Page ${p} of ${pages}`,W-M,H-28,{align:'right'});
 }
 return pdf;
}
function downloadPdf(){const pdf=getPdf();if(pdf){pdf.save(fileName('pdf'));toast('PDF saved. Attach it to an email or use Share on supported devices.');}}
async function sharePdf(){
 const pdf=getPdf();if(!pdf)return;
 const file=new File([pdf.output('blob')],fileName('pdf'),{type:'application/pdf'});
 if(navigator.canShare?.({files:[file]}) && navigator.share){
  try{await navigator.share({files:[file],title:'Workplace First Aid Readiness Review',text:`First aid readiness review for ${state.meta.business||'the facility'}.`});return;}
  catch(err){if(err?.name==='AbortError')return;}
 }
 pdf.save(fileName('pdf'));
 const subj=`First aid readiness review — ${state.meta.business||'facility'}`;
 const body=`Attached is the workplace first aid readiness review.\n\nPlease attach the PDF saved to your device.\n\nReview date: ${state.meta.date||'Not entered'}\n\nThis is a planning resource and not an OSHA compliance certification.`;
 toast('PDF downloaded. Your email composer will open; attach the PDF manually.');
 const url=`mailto:?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}`;
 window.location.href=url;
}
function downloadJSON(){
 const data={app:'workplace-first-aid-readiness',version:1,mode:state.mode,industry:state.industry,answers:state.answers,rows:state.rows,meta:state.meta,visited:state.visited};
 const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
 const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=fileName('json');document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);toast('Editable backup saved. Keep the JSON private; it may contain business contact details.');
}
function importJSON(){
 const f=document.createElement('input');f.type='file';f.accept='.json,application/json';
 f.addEventListener('change',async()=>{
   const file=f.files?.[0];if(!file)return;
   if(file.size>1_000_000){toast('Backup too large.');return;}
   try{
     const data=JSON.parse(await file.text());
     if(data.app!=='workplace-first-aid-readiness'||data.version!==1||typeof data.answers!=='object'||!data.answers||Array.isArray(data.answers))throw Error('Unrecognized file');
     const clean=freshState();clean.mode=data.mode==='diy'?'diy':'guided';clean.industry=INDUSTRIES[data.industry]?data.industry:'general';
     clean.answers=Object.fromEntries(Object.entries(data.answers).filter(([k,v])=>/^[a-zA-Z0-9.\-_]+$/.test(k)&&(typeof v==='string'||typeof v==='boolean')).map(([k,v])=>[k,typeof v==='string'?v.slice(0,10000):v]));
     clean.rows=(data.rows&&typeof data.rows==='object')?Object.fromEntries(Object.entries(data.rows).filter(([k,v])=>/^[a-zA-Z0-9_-]+$/.test(k)&&Array.isArray(v)).map(([k,v])=>[k,v.filter(x=>typeof x==='string'&&/^[a-zA-Z0-9_-]+$/.test(x)).slice(0,100)])):{};
     for(const k of ['business','address','contact','facilitator','date'])clean.meta[k]=typeof data.meta?.[k]==='string'?data.meta[k].slice(0,250):'';
     clean.visited=(data.visited&&typeof data.visited==='object')?data.visited:{};
     clean.started=true;clean.dirty=true;state=clean;renderApp();toast('Backup loaded.');
   }catch(err){toast('Could not read that backup. Choose a JSON file exported from this app.');}
 });f.click();
}
function printReport(){
 const r=buildReportModel();
 const simple=(label,value)=>`<div class="r-pair"><div class="r-label">${esc(label)}</div><div class="r-value">${esc(value).replace(/\n/g,'<br>')}</div></div>`;
 const details=r.sections.filter(s=>s.hasContent).map(s=>`<section class="r-section"><h2>${String(s.number).padStart(2,'0')} &nbsp; ${esc(s.title)}</h2>${s.groups.map(g=>`<div class="r-group"><h3>${esc(g.title)}</h3>${g.entries.map(e=>e.parts?`<div class="r-entry"><strong>${esc(e.label)}</strong>${e.parts.map(p=>simple(p.label,p.value)).join('')}</div>`:simple(e.label,e.value)).join('')}</div>`).join('')}</section>`).join('');
 printable.innerHTML=`<div class="r-cover"><div class="r-overline">WORKPLACE FIRST AID / READINESS REVIEW</div><h1>First Aid Readiness<br>Review &amp; Action Plan</h1></div><div class="r-meta">${simple('Facility',r.facility)}${simple('Workplace type',r.industry)}${simple('Review date',r.date)}${r.address?simple('Site address',r.address):''}${r.contact?simple('Primary contact',r.contact):''}${r.facilitator?simple('Prepared with / by',r.facilitator):''}</div><h2>Review at a glance</h2><div class="r-highlight"><strong>WORKING REVIEW</strong><p>${r.documented} of 7 worksheets include documented responses. This is not a compliance score or certification.</p></div>${r.strengths?`<div class="r-highlight"><strong>EXISTING STRENGTHS</strong><p>${esc(r.strengths)}</p></div>`:''}${r.findings.length?`<h3>Observations &amp; next steps</h3>${r.findings.slice(0,4).map(f=>{const o=f.parts.find(x=>x.label==='Observation / open question')?.value;const n=f.parts.find(x=>x.label==='Suggested next step')?.value;const p=f.parts.find(x=>x.label==='Priority')?.value;return `<div class="r-action">${p?`<strong>${esc(p)} priority</strong>`:''}${o?`<p>${esc(o)}</p>`:''}${n?`<p>Next step: ${esc(n)}</p>`:''}</div>`;}).join('')}`:''}${r.followup?simple('Proposed follow-up',r.followup):''}${r.unreviewed.length?`<div class="r-incomplete"><strong>Still to be documented</strong><p>${r.unreviewed.map(s=>esc(s.title)).join(' · ')}</p></div>`:''}${details?`<div class="r-details"><h2>Detailed worksheet notes</h2>${details}</div>`:''}<div class="r-disclaimer">Planning aid only. Not an OSHA/ANSI certification, full hazard assessment, medical protocol, or legal opinion. Employers should verify site-specific requirements with qualified personnel.<p>Reference starting points: OSHA 29 CFR 1910.151 and Appendix A; 1910.1030; and 1926.50 where applicable.</p></div>`;
 window.print();
}
function startFromForm(form){
 const fd=new FormData(form);
 for(const key of ['business','address','contact','facilitator','date'])state.meta[key]=String(fd.get(key)||'').trim();
 state.industry=INDUSTRIES[fd.get('industry')]?fd.get('industry'):'general';
 state.answers['emergency.address']=state.meta.address;
 state.answers['program.purpose']=state.meta.business?`Support timely and appropriate first aid arrangements for injuries or sudden illness at ${state.meta.business}, considering the hazards and conditions of our operations.`:'';
 state.started=true;state.dirty=false;renderApp();
}
app.addEventListener('click',(e)=>{
 const el=e.target.closest('button');if(!el)return;
 if(el.dataset.mode){state.mode=el.dataset.mode;renderLanding();return;}
 if(el.dataset.goto!=null){goStep(el.dataset.goto);return;}
 if(el.dataset.add){newRow(el.dataset.add);return;}
 if(el.dataset.remove){removeRow(el.dataset.remove,el.dataset.row);return;}
 switch(el.id){
  case 'prevBtn':goStep(state.step-1);break;
  case 'nextBtn':if(state.step===6){showFinishDialog();state.visited[6]=true;}else goStep(state.step+1);break;
  case 'exportBtn':downloadPdf();break;
  case 'shareBtn':sharePdf();break;
  case 'newBtn':confirmNew();break;
  case 'importStart':case 'jsonImport':importJSON();break;
  case 'jsonSave':downloadJSON();break;
  case 'printBtn':case 'printMainBtn':printReport();break;
 }
});
app.addEventListener('input',e=>{
 const field=e.target.dataset.field;if(field){update(field,e.target.type==='checkbox'?e.target.checked:e.target.value);}
});
app.addEventListener('change',e=>{
 const field=e.target.dataset.field;if(field){update(field,e.target.type==='checkbox'?e.target.checked:e.target.value);}
});
app.addEventListener('submit',e=>{if(e.target.id==='startForm'){e.preventDefault();startFromForm(e.target);}});
document.addEventListener('click',e=>{
 const id=e.target.id;
 if(id==='cancelNew'||id==='cancelFinish'){document.getElementById('newDialog')?.remove();document.getElementById('finishDialog')?.remove();}
 if(id==='confirmNew'){document.getElementById('newDialog')?.remove();state=freshState();renderLanding();toast('New blank session ready.');}
 if(id==='finishPdf'){document.getElementById('finishDialog')?.remove();downloadPdf();}
 if(id==='finishShare'){document.getElementById('finishDialog')?.remove();sharePdf();}
 if(id==='finishJSON'){document.getElementById('finishDialog')?.remove();downloadJSON();}
 if(id==='finishPrint'){document.getElementById('finishDialog')?.remove();printReport();}
 if(e.target.classList?.contains('modal-backdrop'))e.target.remove();
});
function showFinishDialog(){
 const m=document.createElement('div');m.id='finishDialog';m.className='modal-backdrop';m.innerHTML=`<div class="modal" role="dialog" aria-modal="true" aria-labelledby="finishTitle"><span class="eyebrow">REVIEW COMPLETE OR IN PROGRESS</span><h2 id="finishTitle">Your review is ready to share</h2><p>The report includes entered answers and lists sections not yet documented. Download the PDF for the prospect, use your device's share sheet if supported, or save an editable JSON backup to continue later.</p><div class="button-set" style="margin:20px 0"><button class="btn btn-primary" id="finishPdf">↓ Export PDF</button><button class="btn btn-soft" id="finishShare">↗ Share PDF</button><button class="btn btn-quiet" id="finishJSON">↓ Save JSON backup</button><button class="btn btn-quiet" id="finishPrint">Print fallback</button></div><div class="modal-actions"><button class="btn btn-quiet" id="cancelFinish">Keep editing</button></div><p class="privacy">Direct automatic emailing of attachments from a static website is not supported. On compatible devices, the Share button opens the native share sheet so you can choose Mail.</p></div>`;document.body.append(m);
}
window.addEventListener('beforeunload',e=>{if(state.started&&state.dirty){e.preventDefault();e.returnValue='';}});
renderLanding();
})();

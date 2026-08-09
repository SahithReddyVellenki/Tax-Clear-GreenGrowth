// RENDER

//  ICONS (inline SVG) 
const IC = {
  dash:   `<svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="1" width="6" height="6" rx="1.5"/><rect x="9" y="1" width="6" height="6" rx="1.5"/><rect x="1" y="9" width="6" height="6" rx="1.5"/><rect x="9" y="9" width="6" height="6" rx="1.5"/></svg>`,
  file:   `<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 1H4a1 1 0 00-1 1v12a1 1 0 001 1h8a1 1 0 001-1V5L9 1z"/><path d="M9 1v4h4"/><line x1="5" y1="8" x2="11" y2="8"/><line x1="5" y1="11" x2="11" y2="11"/></svg>`,
  msg:    `<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 10a2 2 0 01-2 2H5l-3 3V4a2 2 0 012-2h8a2 2 0 012 2v6z"/></svg>`,
  folder: `<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 4a1 1 0 011-1h4l2 2h6a1 1 0 011 1v7a1 1 0 01-1 1H2a1 1 0 01-1-1V4z"/></svg>`,
  user:   `<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="5" r="3"/><path d="M1 14c0-3 3-5 7-5s7 2 7 5"/></svg>`,
  gear:   `<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="8" r="2.5"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41"/></svg>`,
  search: `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="6.5" cy="6.5" r="4.5"/><line x1="10.5" y1="10.5" x2="14" y2="14"/></svg>`,
  logo:   `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect width="16" height="16" rx="4" fill="white" fill-opacity=".2"/><path d="M3 5h10M3 8h7M3 11h9" stroke="white" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  spark:  `✦`,
};

const PO  = { o:0, u:1, p:2, a:3, f:4 };
const PL  = { o:'Overdue', u:'Needs review', p:'In progress', a:'Awaiting client', f:'Filed' };
const PC  = { o:'ac-o', u:'ac-u', p:'ac-p', a:'ac-a', f:'ac-f' };
const SP  = { o:'pill-o', u:'pill-u', p:'pill-p', a:'pill-a', f:'pill-f' };
const OL  = { y:'Your turn', c:'Client', p:'Preparer', n:'' };
const OC  = { y:'op-y', c:'op-c', p:'op-p', n:'op-n' };
const CC  = { 'W-2':'dtb-w2', '1099-INT':'dtb-1099', '1099-DIV':'dtb-1099', '1099-B':'dtb-b', 'Computed':'dtb-sys', 'IRS Table':'dtb-sys' };
const STC = { 'W-2':'st-w2','1099-INT':'st-1099','1099-DIV':'st-1099','1099-B':'st-b','Computed':'st-comp','IRS Table':'st-irs' };

function fmt(n)      { return (n<0?'−':'')+'$'+Math.abs(n).toLocaleString('en-US'); }
function pct(c)      { return Math.round(c*100)+'%'; }
function confCls(c)  { return c>=.9?'conf-high':c>=.8?'conf-med':'conf-low'; }
function cmCls(c)    { return c>=.9?'conf-high':c>=.8?'conf-med':'conf-low'; }
function dueStr(r)   { if(r.p==='f') return 'Filed '+r.due; return r.dl<0?Math.abs(r.dl)+'d overdue':r.dl===0?'Due today':r.dl===1?'Due tomorrow':'Due '+r.due; }
function stCls(s)    { return STC[s]||'st-comp'; }

//  MAIN ENTRY ─
function render() {
  // Capture scroll positions BEFORE destroying the DOM
  const fpScroll = document.querySelector('.fields-panel')?.scrollTop || 0;
  const ctScroll = document.querySelector('.content')?.scrollTop      || 0;

  const views = { dashboard: rDashboard, detail: rDetail, portal: rPortal, docs: rDocsLibrary };
  document.getElementById('app').innerHTML = views[S.view]
    ? rLayout(views[S.view]())
    : rLayout(rDashboard());

  // Restore scroll + animate confidence bars after DOM is painted
  requestAnimationFrame(() => {
    // Restore fields-panel scroll so clicking a field doesn't jump to top
    const fp = document.querySelector('.fields-panel');
    if (fp) fp.scrollTop = fpScroll;
    // Restore content scroll (dashboard)
    const ct = document.querySelector('.content');
    if (ct) ct.scrollTop = ctScroll;
    // Animate confidence bars
    document.querySelectorAll('[data-cw]').forEach(el => { el.style.width = el.dataset.cw; });
  });
}

//  LAYOUT SHELL ─
function rLayout(mainHtml) {
  return `<div class="layout">${rSidebar()}${mainHtml}</div>`;
}

// Sidebar
function rSidebar() {
  const navs = [
    { id:'dashboard', icon:IC.dash,   label:'Dashboard', badge:null },
    { id:'detail',    icon:IC.file,   label:'Returns',   badge:null },
    { id:'msg-stub',  icon:IC.msg,    label:'Messages',  badge:4 },
    { id:'docs',      icon:IC.folder, label:'Documents', badge:null },
    { id:'clients',   icon:IC.user,   label:'Clients',   badge:null },
    { id:'settings',  icon:IC.gear,   label:'Settings',  badge:null },
  ];
  const activeNav = S.view==='detail'?'detail':S.view==='docs'?'docs':S.view==='portal'?'dashboard':S.view;
  return `<aside class="sidebar">
    <div class="s-logo">
      <div class="s-logo-mark">${IC.logo}</div>
      <div>
        <div class="s-logo-text">Tax<span>Clear</span></div>
        <div class="s-firm">GreenGrowth Advisory</div>
      </div>
    </div>
    <div class="s-section">Workspace</div>
    <div class="s-nav">
      ${navs.map(n => `<button class="ni${n.id===activeNav?' active':''}" data-action="nav" data-id="${n.id}" aria-label="${n.label}">
        ${n.icon}<span>${n.label}</span>${n.badge?`<span class="ni-badge">${n.badge}</span>`:''}
      </button>`).join('')}
    </div>
    <div class="s-divider"></div>
    <div class="s-footer">
      <div class="s-user">
        <div class="s-ava">SRV</div>
        <div><div class="s-name">Sahith R. Vellenki</div><div class="s-role">Manager · CPA</div></div>
      </div>
    </div>
  </aside>`;
}

//  DASHBOARD (Challenge 07) 
function rDashboard() {
  const all = RETURNS;
  const you = all.filter(r=>r.owner==='y');
  const od  = all.filter(r=>r.p==='o');
  const aw  = all.filter(r=>r.owner==='c');
  const fi  = all.filter(r=>r.p==='f');
  const filtered = getFiltered();
  const visible  = filtered.slice(0, S.showCount);
  const hero     = all.filter(r=>r.p==='o'||r.p==='u').sort((a,b)=>PO[a.p]-PO[b.p])[0];
  const unresolved = FINDINGS.filter(f=>S.findingStatuses[f.id]==='unreviewed').length;

  return `<div class="main">
    <div class="topbar">
      <div class="tb-info">
        <div class="tb-title">Dashboard</div>
        <div class="tb-sub">Aug 6, 2026 &mdash; ${you.length} return${you.length!==1?'s':''} need your action · ${unresolved} AI finding${unresolved!==1?'s':''} pending</div>
      </div>
      <div class="tb-right">
        <div class="role-sw">
          <button class="rs-opt active" data-action="noop">CPA &mdash; Sahith R. Vellenki</button>
          <button class="rs-opt" data-action="go-portal">Client view</button>
        </div>
        <div class="search-wrap">${IC.search}<input id="q-search" placeholder="Search client, ID, type&hellip;" value="${S.search}" autocomplete="off"></div>
        <label class="toggle-row">
          <div class="t-sw${S.managerMode?' on':''}" data-action="toggle-manager"><div class="t-knob"></div></div>
          All preparers
        </label>
        <select class="sel" data-action="set-sort">
          <option value="priority"${S.sortBy==='priority'?' selected':''}>Priority</option>
          <option value="due"${S.sortBy==='due'?' selected':''}>Due date</option>
          <option value="client"${S.sortBy==='client'?' selected':''}>Client name</option>
        </select>
      </div>
    </div>
    <div class="content">
      <div class="metrics">
        ${rMetric('Needs your action', you.length,  'red',   you.length>0?'Act on these now':'All clear', 'yours',   S.filter==='yours')}
        ${rMetric('Overdue',           od.length,   'red',   od.length>0?'Past deadline':'All on time', 'overdue',  S.filter==='overdue')}
        ${rMetric('Awaiting client',   aw.length,   'amber', 'Sent — waiting on reply',             'awaiting',  S.filter==='awaiting')}
        ${rMetric('Filed this season', fi.length,   'green', 'Accepted by IRS',                     'filed',     S.filter==='filed')}
      </div>

      ${!S.search && S.filter==='all' && hero ? rHero(hero) : ''}

      <div class="queue-card">
        <div class="q-tabs">
          ${rQTab('All', filtered.length, 'all', '')}
          ${rQTab('Your turn', you.length, 'yours', 'd')}
          ${rQTab('Awaiting client', aw.length, 'awaiting', 'w')}
          ${rQTab('Overdue', od.length, 'overdue', 'd')}
          ${rQTab('Filed', fi.length, 'filed', '')}
        </div>
        <div class="q-sort-bar">Sort:
          <span class="sq${S.sortBy==='priority'?' active':''}" data-action="set-sort" data-id="priority">Priority</span>
          <span class="sq${S.sortBy==='due'?' active':''}" data-action="set-sort" data-id="due">Due date</span>
          <span class="sq${S.sortBy==='client'?' active':''}" data-action="set-sort" data-id="client">Client name</span>
        </div>
        ${visible.length ? visible.map(rRow).join('') : rEmpty()}
        ${filtered.length > S.showCount
          ? `<div class="r-load"><button class="btn btn-sm" data-action="load-more">Show ${Math.min(10,filtered.length-S.showCount)} more <span style="color:var(--hint);margin-left:4px">(${filtered.length-S.showCount} remaining)</span></button></div>`
          : ''}
      </div>
    </div>
  </div>`;
}

function rMetric(label, val, color, sub, filterId, selected) {
  return `<div class="metric${selected?' selected':''}" data-action="metric-click" data-id="${filterId}">
    <div class="m-label">${label}</div>
    <div class="m-val ${color}">${val}</div>
    <div class="m-sub">${sub}</div>
  </div>`;
}

function rHero(r) {
  return `<div class="focus-hero">
    <div class="fh-stripe"></div>
    <div class="fh-body">
      <div class="fh-pulse"></div>
      <div>
        <div class="fh-eyebrow">Highest priority &mdash; needs your action now</div>
        <div class="fh-client">${r.client}</div>
        <div class="fh-meta">${r.id} &middot; ${r.type} &middot; ${r.year} &middot; ${r.prep}</div>
        <div class="fh-action">${r.action}</div>
      </div>
      <div class="fh-right">
        <span class="fh-due">${dueStr(r)}</span>
        <button class="btn btn-danger btn-sm" data-action="open-return" data-id="${r.id}">Open return &rarr;</button>
      </div>
    </div>
  </div>`;
}

function rQTab(label, cnt, filter, cntCls) {
  return `<div class="qt${S.filter===filter?' active':''}" data-action="set-filter" data-id="${filter}">
    ${label} <span class="qt-cnt${cntCls?' '+cntCls:''}">${cnt}</span>
  </div>`;
}

function rRow(r) {
  return `<div class="r-row" data-action="open-return" data-id="${r.id}" role="button" tabindex="0" aria-label="Open ${r.client}">
    <div class="accent ${PC[r.p]}"></div>
    <div class="r-info">
      <div class="r-client">${r.client}</div>
      <div class="r-meta">${r.id} &middot; ${r.type} &middot; ${r.year} &middot; ${r.prep}</div>
      <div class="r-action">${r.action}</div>
    </div>
    <div class="r-col"><span class="pill ${SP[r.p]}">${PL[r.p]}</span></div>
    <div class="r-col"><span class="own-pill ${OC[r.owner]}">${OL[r.owner]}</span></div>
    <div class="r-due${r.dl<0&&r.p!=='f'?' od':''}">${dueStr(r)}</div>
    <div class="r-arr">&rsaquo;</div>
  </div>`;
}

function rEmpty() {
  const msgs = {
    yours:    ['No returns need your action right now', 'Check back when a preparer completes a return for your review.'],
    awaiting: ['No returns waiting on clients', 'All client action items are resolved.'],
    overdue:  ['No overdue returns — great work', 'All active returns are within their deadlines.'],
    filed:    ['No returns filed yet', 'Filed returns will appear here.'],
  };
  if (S.search) return `<div class="empty"><span class="empty-icon">🔍</span><div class="empty-title">No results for "${S.search}"</div><div class="empty-sub">Try a different client name, return ID, or preparer</div></div>`;
  const [t,s] = msgs[S.filter] || ['No returns in this view', ''];
  return `<div class="empty"><span class="empty-icon">📋</span><div class="empty-title">${t}</div><div class="empty-sub">${s}</div></div>`;
}

//  DETAIL VIEW (Challenges 01 + 10) ─
function rDetail() {
  const ret = DETAIL;
  const unresolved = FINDINGS.filter(f=>S.findingStatuses[f.id]==='unreviewed').length;
  const steps = [
    { label:'Docs uploaded', s:'done' },
    { label:'AI extracted',  s:'done' },
    { label:'CPA review',    s:'current' },
    { label:'Sign & file',   s:'pending' },
  ];

  return `<div class="main">
    <div class="dt-top">
      <div class="breadcrumb">
        <span class="bc-link" data-action="go-dash">&larr; Dashboard</span>
        <span>&rsaquo;</span>
        <span class="bc-link" data-action="go-dash">Returns</span>
        <span>&rsaquo;</span>
        <span>${ret.client}</span>
      </div>
      <div class="dt-header">
        <div>
          <div class="dt-client">${ret.client}</div>
          <div class="dt-meta">
            <span class="pill ${SP[ret.p]}">${PL[ret.p]}</span>
            <span class="dt-meta-tag">${ret.id}</span>
            <span class="dt-meta-tag">${ret.type} &middot; ${ret.year}</span>
            <span class="dt-meta-tag">Preparer: ${ret.prep}</span>
            <span class="dt-meta-tag">Due: ${ret.due}</span>
          </div>
        </div>
        <div class="dt-right">
          <button class="btn btn-sm" data-action="go-dash">&larr; Back</button>
          <button class="btn btn-sm" data-action="go-portal">Client view</button>
          <button class="btn btn-primary btn-sm" data-action="sign-file">Sign &amp; file</button>
        </div>
      </div>
      <div class="dt-tabs">
        <div class="dt-tab${S.detailTab==='fields'?' active':''}" data-action="set-detail-tab" data-id="fields">Source Traceability</div>
        <div class="dt-tab${S.detailTab==='ai'?' active':''}${unresolved?' dt-tab-dot':''}" data-action="set-detail-tab" data-id="ai">AI Insights${unresolved?` (${unresolved})`:''}</div>
        <div class="dt-tab${S.detailTab==='messages'?' active':''}" data-action="set-detail-tab" data-id="messages">Messages</div>
        <div class="dt-tab${S.detailTab==='history'?' active':''}" data-action="set-detail-tab" data-id="history">History</div>
      </div>
    </div>
    <div class="ret-progress">
      ${steps.map((st,i) => `
        <div class="rp-step">
          <div class="rp-dot ${st.s}">${st.s==='done'?'✓':i+1}</div>
          <span class="rp-lbl ${st.s}">${st.label}</span>
        </div>${i<steps.length-1?`<div class="rp-line${st.s==='done'?' done':''}"></div>`:''}`).join('')}
    </div>
    ${S.detailTab==='fields'   ? rTracePane()       :
      S.detailTab==='ai'       ? rAIPanel()         :
      S.detailTab==='messages' ? rDetailMessages()  :
      rStub(S.detailTab)}
  </div>`;
}

//  TRACEABILITY (Challenge 01) ─
function rTracePane() {
  const cats = [...new Set(DETAIL.fields.map(f=>f.cat))];
  return `<div class="trace-layout">
    <div class="fields-panel">
      <div class="fp-ai-legend">
        <span class="src-tag st-ai">${IC.spark} AI</span>
        <span>= Value was extracted or computed by AI and requires your review before filing</span>
        <span class="fp-legend-dot fsd-accepted" title="Accepted"></span> Accepted
        <span class="fp-legend-dot fsd-pending" title="Pending"></span> Pending
        <span class="fp-legend-dot fsd-flagged" title="Flagged"></span> Flagged
      </div>
      ${cats.map(cat => `
        <div class="fp-cat">${cat}</div>
        ${DETAIL.fields.filter(f=>f.cat===cat).map(rFieldItem).join('')}
      `).join('')}
    </div>
    <div class="doc-panel">
      ${rDocPanel()}
    </div>
  </div>`;
}

function rFieldItem(f) {
  const st   = S.fieldStatuses[f.id] || 'pending';
  const act  = S.selectedFieldId === f.id;
  const cls  = ['fp-item', act?'active':'', f.ai?'ai-item':'', f.warn?'warn-item':''].filter(Boolean).join(' ');
  const sdot = { accepted:'fsd-accepted', pending:'fsd-pending', overridden:'fsd-overridden', flagged:'fsd-flagged' }[st] || '';
  return `<div class="${cls}" data-action="select-field" data-id="${f.id}">
    <div class="fp-label">
      <span class="fp-line">${f.line}</span>
      ${f.label}
      ${f.ai ? `<span class="src-tag st-ai">${IC.spark} AI</span>` : ''}
      ${f.warn ? `<span style="color:#F59E0B;font-size:10px">⚠</span>` : ''}
      <span class="fp-status-dot ${sdot}" title="${st}" style="margin-left:auto"></span>
    </div>
    <div class="fp-val${f.neg?' neg':''}">${fmt(f.val)}</div>
    <div class="fp-src-row">
      <span class="src-tag ${stCls(f.src)}">${f.src}</span>
      ${!f.computed && f.conf != null ? `<div class="conf-row">
        <div class="conf-track"><div class="conf-fill ${confCls(f.conf)}" data-cw="${pct(f.conf)}" style="width:0"></div></div>
        <span class="conf-pct">${pct(f.conf)}</span>
      </div>` : ''}
    </div>
  </div>`;
}

function rDocPanel() {
  const f   = DETAIL.fields.find(x=>x.id===S.selectedFieldId);
  if (!f) return `<div class="doc-placeholder">Select a field on the left to see its source document and derivation.</div>`;
  const st  = S.fieldStatuses[f.id] || 'pending';
  const ov  = S.fieldOverrides[f.id];
  const doc = DOCS[f.src];

  return `
    <div class="fdb">
      <div class="fdb-head">
        <div>
          <div class="fdb-title">Line ${f.line} — ${f.label}</div>
          <div style="font-size:11px;color:var(--hint);margin-top:2px">
            Value: <span style="font-family:var(--mono);font-weight:700;color:${f.neg?'var(--red)':'var(--ink)'}">${fmt(f.val)}</span>
            ${f.neg?' <span style="color:var(--hint)">(loss)</span>':''}
          </div>
        </div>
        ${f.ai ? `<span class="ai-badge" title="This value was extracted or computed by TaxClear AI — not typed manually. It has been automatically derived from source documents using machine learning. Review the evidence below and Accept, Override, or Flag.">${IC.spark} AI-generated — hover for info</span>` : ''}
        <span class="pill ${SP[DETAIL.p]}" style="margin-left:auto">
          ${{accepted:'Accepted',pending:'Awaiting review',overridden:'Overridden',flagged:'Flagged'}[st]}
        </span>
      </div>
      <div class="fdb-body">
        <div class="dr"><span class="dr-lbl">Source</span><span class="dr-val">${f.srcFull}${f.srcPage?`, page ${f.srcPage}`:''}</span></div>
        ${f.srcSection ? `<div class="dr"><span class="dr-lbl">Field</span><span class="dr-val">${f.srcSection}</span></div>` : ''}
        ${f.raw ? `<div class="dr"><span class="dr-lbl">Raw value</span><span class="dr-val mono">${f.raw}</span></div>` : ''}
        ${f.conf != null ? `<div class="dr"><span class="dr-lbl">Confidence</span><span class="dr-val mono">${pct(f.conf)}${f.conf<.85?' — below 85% threshold':f.conf>=.95?' — high':''}</span></div>` : ''}
        ${f.aiNote ? `<div class="ai-note"><span>${IC.spark}</span><span>${f.aiNote}</span></div>` : ''}
        ${ov ? `<div class="override-banner">&#10003; Override logged by Sahith R. Vellenki, Aug 6 &mdash; &ldquo;${ov.reason}&rdquo;</div>` : ''}
      </div>
      <div class="fdb-actions">
        ${st==='accepted'
          ? `<div class="accepted-banner" style="flex:1">&#10003; Accepted by Sahith R. Vellenki, Aug 6, 2026</div>
             <button class="btn btn-sm btn-ghost" data-action="undo-field" data-id="${f.id}">Undo</button>`
          : `<button class="btn btn-primary btn-sm btn-accept" data-action="accept-field" data-id="${f.id}">Accept value</button>
             <button class="btn btn-sm btn-override" data-action="show-field-ov" data-id="${f.id}">Override</button>
             <button class="btn btn-sm btn-flag" data-action="flag-field" data-id="${f.id}">Flag</button>`}
      </div>
      ${S.fieldOvForm===f.id ? `
        <div class="ov-form">
          <label>Override value (optional — leave blank to keep ${fmt(f.val)})</label>
          <input id="fov-val-${f.id}" type="text" placeholder="${fmt(f.val)}" style="margin-bottom:8px">
          <label>Reason (required)</label>
          <textarea id="fov-rsn-${f.id}" placeholder="Explain why this value is being changed…" rows="2"></textarea>
          <div class="ov-form-actions">
            <button class="btn btn-primary btn-sm" data-action="submit-field-ov" data-id="${f.id}">Save override</button>
            <button class="btn btn-sm btn-ghost" data-action="cancel-field-ov" data-id="${f.id}">Cancel</button>
          </div>
        </div>` : ''}
    </div>

    ${!doc.system ? `
      <div class="doc-card">
        <div class="doc-card-head">
          <span class="doc-type-badge ${CC[f.src]||'dtb-sys'}">${doc.type}</span>
          <div>
            <div class="doc-name">${doc.name}</div>
            <div class="doc-meta">Page ${f.srcPage||1} of ${doc.pages} &middot; Uploaded ${doc.uploaded}${doc.multi?' &middot; Multi-page':''}</div>
          </div>
        </div>
        ${(() => {
          const activeIdx = doc.fields.findIndex(df => df.fid === f.id);
          if (activeIdx === -1) {
            return doc.fields.map(df => `<div class="doc-field-row"><span class="dfl">${df.label}</span><span class="dfv">${df.val}</span></div>`).join('');
          }
          const CONTEXT = 3; // rows shown above and below
          const before  = doc.fields.slice(Math.max(0, activeIdx - CONTEXT), activeIdx);
          const after   = doc.fields.slice(activeIdx + 1, Math.min(doc.fields.length, activeIdx + CONTEXT + 1));
          const active  = doc.fields[activeIdx];
          const hasMore = { top: activeIdx > CONTEXT, bottom: activeIdx + CONTEXT + 1 < doc.fields.length };
          return `
            <div class="doc-ctx-header">
              Source excerpt &mdash; <strong>${active.label}</strong>
            </div>
            ${hasMore.top ? `<div class="doc-ctx-ellipsis">&hellip; ${activeIdx - CONTEXT} more field${activeIdx-CONTEXT!==1?'s':''} above</div>` : ''}
            ${before.map(df => `
              <div class="doc-field-row doc-ctx-row">
                <span class="dfl">${df.label}</span>
                <span class="dfv ctx-val">${df.val}</span>
              </div>`).join('')}
            <div class="doc-field-row doc-active-row">
              <div>
                <div class="doc-active-eyebrow">&#9658; EXTRACTED VALUE &mdash; USED IN RETURN</div>
                <span class="dfl" style="font-weight:600;color:var(--amber-text)">${active.label}</span>
              </div>
              <div style="display:flex;align-items:center;gap:8px">
                <span class="dfv" style="font-size:16px">${active.val}</span>
                <span class="dfv-used">&larr; Line ${f.line}</span>
              </div>
            </div>
            ${after.map(df => `
              <div class="doc-field-row doc-ctx-row">
                <span class="dfl">${df.label}</span>
                <span class="dfv ctx-val">${df.val}</span>
              </div>`).join('')}
            ${hasMore.bottom ? `<div class="doc-ctx-ellipsis">&hellip; ${doc.fields.length - activeIdx - CONTEXT - 1} more field${doc.fields.length-activeIdx-CONTEXT-1!==1?'s':''} below</div>` : ''}
          `;
        })()}
        ${f.transform ? `
          <div class="transform-section">
            <div class="tl">Derivation from source to return field</div>
            <pre class="tb2">${f.transform}</pre>
          </div>` : ''}
      </div>` : `
      <div class="doc-card">
        <div class="doc-card-head">
          <span class="doc-type-badge dtb-sys">${doc.icon} System</span>
          <div><div class="doc-name">${doc.label}</div><div class="doc-meta">No source document &mdash; computed from return data</div></div>
        </div>
        <div class="doc-sys-body">${doc.sub}</div>
        ${f.transform ? `
          <div class="transform-section">
            <div class="tl">Computation formula</div>
            <pre class="tb2">${f.transform}</pre>
          </div>` : ''}
      </div>`}
  `;
}

//  AI PANEL (Challenge 10) ─
function rAIPanel() {
  let findings = FINDINGS;
  if (S.aiFilter !== 'all') findings = findings.filter(f=>f.sev===S.aiFilter);
  const unresolved    = FINDINGS.filter(f=>S.findingStatuses[f.id]==='unreviewed').length;
  const infoUnresolved = FINDINGS.filter(f=>f.sev==='info' && S.findingStatuses[f.id]==='unreviewed').length;
  const sevCnts = {
    critical: FINDINGS.filter(f=>f.sev==='critical').length,
    warning:  FINDINGS.filter(f=>f.sev==='warning').length,
    info:     FINDINGS.filter(f=>f.sev==='info').length,
  };
  return `<div class="ai-panel-wrap">
    <div class="ai-panel-head">
      <div>
        <div class="ai-panel-title">${IC.spark} AI Insights &mdash; ${DETAIL.client}</div>
        <div class="ai-panel-sub">${unresolved} of ${FINDINGS.length} finding${FINDINGS.length!==1?'s':''} pending review &middot; Extracted Aug 5, 2026 at 3:42 PM</div>
      </div>
      <div class="ai-filters">
        ${['all','critical','warning','info'].map(sv => `
          <button class="aif${S.aiFilter===sv?' active':''}" data-action="set-ai-filter" data-id="${sv}">
            ${sv==='all'?'All ':sv.charAt(0).toUpperCase()+sv.slice(1)} ${sv!=='all'?`(${sevCnts[sv]})`:''}</button>`).join('')}
      </div>
    </div>

    ${infoUnresolved>0 && (S.aiFilter==='all'||S.aiFilter==='info') ? `
      <div class="batch-bar">
        <div><div class="batch-txt">Accept all low-risk findings?</div><div class="batch-sub">${infoUnresolved} info-level finding${infoUnresolved!==1?'s':''} with ≥99% confidence can be accepted in one click</div></div>
        <button class="btn btn-sm" data-action="batch-accept">Accept all low-risk</button>
      </div>` : ''}

    ${!findings.length ? `<div class="empty"><span class="empty-icon">🔍</span><div class="empty-title">No ${S.aiFilter==='all'?'':''+S.aiFilter+' '}findings</div></div>` : findings.map(rFinding).join('')}

    ${unresolved===0 ? `
      <div class="all-clear">
        <span class="ac-icon">✓</span>
        <div class="ac-title">All AI findings reviewed</div>
        <div class="ac-sub">This return is clear for CPA sign-off and e-filing</div>
      </div>` : ''}
  </div>`;
}

function rFinding(f) {
  const st       = S.findingStatuses[f.id] || 'unreviewed';
  const expanded = S.expandedFindings.has(f.id);
  const ov       = S.findingOverrides[f.id];
  const resolved = st !== 'unreviewed';
  const stLabel  = { unreviewed:'Unreviewed', accepted:'Accepted', overridden:'Overridden', flagged:'Flagged' }[st];
  const stCls2   = { unreviewed:'fst-unreviewed', accepted:'fst-accepted', overridden:'fst-overridden', flagged:'fst-flagged' }[st];
  const lf       = f.linkedField ? DETAIL.fields.find(x=>x.id===f.linkedField) : null;

  return `<div class="finding ${f.sev}${resolved?' resolved':''}">
    <div class="f-head" data-action="toggle-finding" data-id="${f.id}">
      <div class="f-dot ${f.sev}"></div>
      <div class="f-title">${f.title}</div>
      <span class="f-conf">${pct(f.conf)}</span>
      <span class="f-stag ${stCls2}">${stLabel}</span>
      <span class="f-chev${expanded?' open':''}">&rsaquo;</span>
    </div>
    <div class="f-body${expanded?' open':''}">
      <div class="f-desc">${f.desc}</div>
      <div class="ev-box">
        <div class="ev-title">Evidence</div>
        ${f.evidence.map(e=>`<div class="ev-item">${e}</div>`).join('')}
      </div>
      <div class="conf-meter">
        <span class="cm-label">AI confidence</span>
        <div class="cm-track"><div class="cm-fill ${cmCls(f.conf)}" data-cw="${pct(f.conf)}" style="width:0"></div></div>
        <span class="cm-pct" style="color:${f.conf>=.9?'var(--green)':f.conf>=.8?'var(--amber)':'var(--red)'}">${pct(f.conf)}</span>
      </div>
      <div class="f-rec">${f.rec}</div>
      ${lf ? `<div style="font-size:11px;color:var(--muted);margin-bottom:10px">Linked to field: <span class="linked-hint" data-action="jump-to-field" data-id="${f.linkedField}">Line ${lf.line} — ${lf.label} &rarr;</span></div>` : ''}

      ${st==='accepted'
        ? `<div class="accepted-banner">&#10003; Accepted by Sahith R. Vellenki, Aug 6, 2026</div>
           <button class="btn btn-sm btn-ghost" data-action="undo-finding" data-id="${f.id}" style="margin-top:7px">Undo accept</button>`
        : st==='overridden' && ov
        ? `<div class="override-banner">Overridden &mdash; &ldquo;${ov.reason}&rdquo;</div>
           <div class="audit-trail">Audit log: Override by Sahith R. Vellenki &middot; Aug 6, 2026 10:41 AM &middot; Reason: "${ov.reason}"${ov.note?'\nNote: '+ov.note:''}</div>
           <button class="btn btn-sm btn-ghost" data-action="undo-finding" data-id="${f.id}" style="margin-top:7px">Undo override</button>`
        : st==='flagged'
        ? `<div style="background:var(--amber-lt);border:1px solid #FDE68A;border-radius:6px;padding:8px 12px;font-size:11px;color:var(--amber-text)">
             &#9888; Flagged for senior review by Sahith R. Vellenki, Aug 6, 2026
           </div>
           <button class="btn btn-sm btn-ghost" data-action="undo-finding" data-id="${f.id}" style="margin-top:7px">Undo flag</button>`
        : `<div class="f-actions">
             <button class="f-btn f-btn-accept" data-action="accept-finding" data-id="${f.id}">&#10003; Accept</button>
             <button class="f-btn f-btn-override" data-action="show-ov-form" data-id="${f.id}">Override</button>
             <button class="f-btn f-btn-flag" data-action="flag-finding" data-id="${f.id}">&#9888; Flag</button>
           </div>`}

      ${S.ovFormId===f.id && st==='unreviewed' ? `
        <div class="ov-form2">
          <label>Override reason (required)</label>
          <textarea id="ov-r-${f.id}" placeholder="Explain why you're overriding this AI finding…" rows="2"></textarea>
          <label style="margin-top:8px">Note for audit trail (optional)</label>
          <input id="ov-n-${f.id}" placeholder="e.g. Client confirmed no second W-2 exists for 2024">
          <div class="ov-form2-actions">
            <button class="f-btn f-btn-override" data-action="submit-ov" data-id="${f.id}">Save override</button>
            <button class="btn btn-sm btn-ghost" data-action="cancel-ov" data-id="${f.id}">Cancel</button>
          </div>
        </div>` : ''}
    </div>
  </div>`;
}

//  CLIENT PORTAL (Challenge 05 + 06) 
function rPortal() {
  const d = CLIENT_DATA;
  const tab = S.clientTab || 'status';
  return `<div class="main">
    <div class="topbar">
      <div class="tb-info">
        <div class="tb-title">Client Portal</div>
        <div class="tb-sub">Maria Delgado &mdash; viewing as client</div>
      </div>
      <div class="tb-right">
        <div class="role-sw">
          <button class="rs-opt" data-action="go-dash">CPA view</button>
          <button class="rs-opt active" data-action="noop">Client &mdash; Maria Delgado</button>
        </div>
        <button class="btn btn-sm" data-action="go-detail">View full return &rarr;</button>
      </div>
    </div>
    <div class="portal-layout">
      <div class="portal-hero">
        <div class="portal-greeting">Hi Maria — your 2024 return is under review</div>
        <div class="portal-sub">Sahith R. Vellenki at GreenGrowth Advisory is preparing your return. We&rsquo;ll notify you when it&rsquo;s ready to sign.</div>
        <div class="portal-refund-box">
          <div>
            <div class="prb-label">Original estimate</div>
            <div class="prb-val" style="text-decoration:line-through;opacity:.6">${fmt(d.originalRefund)}</div>
          </div>
          <div class="prb-divider"></div>
          <div>
            <div class="prb-label">Revised estimate</div>
            <div class="prb-val">${fmt(d.revisedRefund)} refund</div>
          </div>
          <div style="font-size:11px;opacity:.65;margin-left:4px">Updated Aug 6 &mdash; see messages for details</div>
        </div>
      </div>

      <div class="portal-tabs">
        ${['status','documents','messages'].map(t => `<div class="pt-tab${tab===t?' active':''}" data-action="set-client-tab" data-id="${t}">${t.charAt(0).toUpperCase()+t.slice(1)}</div>`).join('')}
      </div>

      <div class="portal-body">
        ${tab==='status'    ? rPortalStatus(d)    : ''}
        ${tab==='documents' ? rPortalDocs(d)       : ''}
        ${tab==='messages'  ? rPortalMessages(d)   : ''}
      </div>
    </div>
  </div>`;
}

function rPortalStatus(d) {
  return `
    <div class="status-timeline">
      <div class="st-title">Your return status</div>
      <div class="st-steps">
        ${d.stages.map((label, i) => {
          const s = i < d.stage ? 'done' : i === d.stage ? 'current' : 'pending';
          return `<div class="st-step ${s}">
            <div class="st-dot ${s}">${s==='done'?'✓':i+1}</div>
            <div class="st-step-label ${s}">${label}</div>
          </div>`;
        }).join('')}
      </div>
    </div>

    <div class="checklist-card">
      <div class="cl-header">
        <div class="cl-title">Your to-do list</div>
        <span style="font-size:12px;color:var(--muted)">${d.checklist.filter(c=>c.done).length} of ${d.checklist.length} done</span>
      </div>
      ${d.checklist.map(c => `
        <div class="cl-item${c.urgent&&!c.done?' urgent':''}">
          <div class="cl-cb${c.done?' done':''}"></div>
          <div>
            <div class="cl-label${c.done?' done':''}">${c.label}${c.urgent&&!c.done?`<span class="cl-urgent-tag">Action needed</span>`:''}</div>
            ${c.done&&c.note ? `<div class="cl-note">&#10003; ${c.note}</div>` : ''}
            ${!c.done&&c.hint ? `<div class="cl-note">${c.hint}</div>` : ''}
          </div>
        </div>`).join('')}
    </div>`;
}

function rPortalDocs(d) {
  const dtb = { 'W-2':'dtb-w2', '1099-INT':'dtb-1099', '1099-DIV':'dtb-1099', '1099-B':'dtb-b' };
  return `<div class="doc-grid">
    ${d.documents.map(doc => `
      <div class="doc-thumb" data-action="noop">
        <div class="doc-thumb-icon ${dtb[doc.type]||'dtb-sys'}" style="width:36px;height:44px;font-size:11px;font-weight:700;border-radius:4px;display:flex;align-items:center;justify-content:center">
          ${doc.type}
        </div>
        <div class="doc-thumb-name">${doc.name}</div>
        <div class="doc-thumb-meta">
          <span class="doc-status-dot ${doc.status==='extracted'?'dsd-ok':'dsd-rev'}"></span>
          ${doc.status==='extracted'?'AI extracted':'Needs review'} &middot; ${doc.pages}p &middot; ${doc.date}
        </div>
      </div>`).join('')}
  </div>`;
}

function rPortalMessages(d) {
  return `<div class="portal-messages">
    <div class="pm-header"><div class="pm-title">Messages from your CPA</div></div>
    <div class="pm-body">
      ${d.messages.map(m => `
        <div class="msg from-${m.from==='cpa'?'cpa':'client'}">
          <div class="msg-ava ${m.from==='cpa'?'cpa':'client'}">${m.avatar}</div>
          <div>
            <div class="msg-bubble">${m.text}</div>
            <div class="msg-time">${m.name} &middot; ${m.time}</div>
          </div>
        </div>`).join('')}
    </div>
    <div class="pm-reply">
      <input placeholder="Reply to Sarah…" id="pm-input">
      <button class="btn btn-primary btn-sm" data-action="send-msg">Send</button>
    </div>
  </div>`;
}

//  DOCUMENT LIBRARY ─
function rDocsLibrary() {
  const allDocs = [
    ...Object.values(DOCS).filter(d=>!d.system).map(d=>({...d,returnId:'R-002',client:'Delgado, Maria'})),
    { name:'W-2 — Beacon Staffing (flagged)', type:'W-2', typeCls:'dtb-w2', uploaded:'Aug 3, 2026', pages:1, client:'Delgado, Maria', returnId:'R-002', flagged:true },
  ];
  return `<div class="main">
    <div class="topbar">
      <div class="tb-info"><div class="tb-title">Documents</div><div class="tb-sub">${allDocs.length} documents for active returns</div></div>
      <div class="tb-right">
        <button class="btn btn-primary btn-sm" data-action="noop">&#43; Upload documents</button>
      </div>
    </div>
    <div class="content">
      <div class="queue-card" style="border-radius:var(--r-lg)">
        ${allDocs.map(d => `
          <div class="doc-field-row" style="padding:13px 18px;cursor:pointer" data-action="go-detail">
            <div style="display:flex;align-items:center;gap:12px">
              <span class="doc-type-badge ${d.typeCls||'dtb-sys'}" style="font-size:10px">${d.type}</span>
              <div>
                <div style="font-size:13px;font-weight:500">${d.name}${d.flagged?` <span style="font-size:10px;background:var(--red-lt);color:var(--red-text);border-radius:3px;padding:1px 6px;font-weight:700">Flagged</span>`:''}</div>
                <div style="font-size:11px;color:var(--hint);font-family:var(--mono);margin-top:2px">${d.client} &middot; ${d.returnId} &middot; ${d.pages} page${d.pages!==1?'s':''} &middot; Uploaded ${d.uploaded}</div>
              </div>
            </div>
            <div style="font-size:11px;color:var(--muted)">View extraction &rarr;</div>
          </div>`).join('')}
      </div>
    </div>
  </div>`;
}

// Messages
function rDetailMessages() {
  const notes = CLIENT_DATA.internalNotes || [];
  const msgs  = CLIENT_DATA.messages;
  return `<div class="cpa-msg-wrap">
    <div class="cpa-msg-section">
      <div class="msg-section-label">
        <span class="msl-dot" style="background:var(--amber)"></span>
        Internal notes &mdash; team only
      </div>
      <div class="pm-body">
        ${notes.map(m => `<div class="msg from-cpa">
          <div class="msg-ava cpa" style="background:var(--amber);font-size:10px">${m.avatar}</div>
          <div>
            <div class="msg-bubble" style="background:var(--amber-lt);border-color:#FDE68A">${m.text}</div>
            <div class="msg-time">${m.name} &middot; ${m.time} &middot; <em>Internal</em></div>
          </div>
        </div>`).join('')}
      </div>
      <div class="pm-reply" style="border-top:1px solid #FDE68A;background:var(--amber-lt)">
        <input placeholder="Add an internal note (not visible to client)…" id="int-note-input">
        <button class="btn btn-sm" style="background:var(--amber-lt);border-color:#FDE68A;color:var(--amber-text)" data-action="send-internal-note">Add note</button>
      </div>
    </div>
    <div class="cpa-msg-section">
      <div class="msg-section-label">
        <span class="msl-dot" style="background:var(--blue)"></span>
        Client communication &mdash; ${CLIENT_DATA.name}
      </div>
      <div class="pm-body">
        ${msgs.map(m => `<div class="msg from-${m.from==='cpa'?'cpa':'client'}">
          <div class="msg-ava ${m.from==='cpa'?'cpa':'client'}">${m.avatar}</div>
          <div>
            <div class="msg-bubble">${m.text}</div>
            <div class="msg-time">${m.name} &middot; ${m.time}</div>
          </div>
        </div>`).join('')}
      </div>
      <div class="pm-reply">
        <input placeholder="Message ${CLIENT_DATA.name}…" id="client-msg-input">
        <button class="btn btn-primary btn-sm" data-action="send-client-msg">Send to client</button>
      </div>
    </div>
  </div>`;
}

// Stub
function rStub(tab) {
  const info = {
    history: { icon:'📋', title:'Return history', sub:'Full audit log of every change, acceptance, and override with timestamps and user attribution.' },
  };
  const { icon, title, sub } = info[tab] || { icon:'🔧', title:tab, sub:'Coming soon in this prototype.' };
  return `<div class="stub">
    <div class="stub-svg" style="font-size:40px">${icon}</div>
    <div class="stub-title">${title}</div>
    <div class="stub-sub">${sub}</div>
  </div>`;
}

//  DATA HELPERS (used by render) ─
function getFiltered() {
  let rows = [...RETURNS];
  if (!S.managerMode) rows = rows.filter(r => r.owner!=='p' || r.prep==='Sahith R.');
  if (S.search) {
    const q = S.search.toLowerCase();
    rows = rows.filter(r => r.client.toLowerCase().includes(q) || r.id.toLowerCase().includes(q) || r.type.toLowerCase().includes(q) || r.prep.toLowerCase().includes(q));
  }
  if (S.filter==='yours')    rows = rows.filter(r=>r.owner==='y');
  else if (S.filter==='awaiting') rows = rows.filter(r=>r.owner==='c');
  else if (S.filter==='overdue')  rows = rows.filter(r=>r.p==='o');
  else if (S.filter==='filed')    rows = rows.filter(r=>r.p==='f');
  if (S.sortBy==='priority') rows.sort((a,b)=>PO[a.p]-PO[b.p]||a.dl-b.dl);
  else if (S.sortBy==='due') rows.sort((a,b)=>a.dl-b.dl);
  else if (S.sortBy==='client') rows.sort((a,b)=>a.client.localeCompare(b.client));
  return rows;
}

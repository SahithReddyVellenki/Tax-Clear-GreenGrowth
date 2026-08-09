// APP

//  STATE 
const S = {
  // Navigation
  view: 'dashboard',   // 'dashboard' | 'detail' | 'portal' | 'docs'

  // Dashboard
  filter:      'all',  // 'all' | 'yours' | 'awaiting' | 'overdue' | 'filed'
  search:      '',
  managerMode: false,
  sortBy:      'priority',
  showCount:   10,

  // Detail tabs
  detailTab:  'fields',   // 'fields' | 'ai' | 'messages' | 'history'
  clientTab:  'status',   // 'status' | 'documents' | 'messages'

  // Traceability (Ch.01)
  selectedFieldId: 'wages',
  fieldStatuses:   Object.fromEntries(
    ['wages','fed_tax','interest','dividends','cap_gains','agi','std_ded','tax_income','tax_owed','refund']
      .map(id => [id, id==='wages'||id==='fed_tax'||id==='dividends'||id==='agi'||id==='std_ded'||id==='tax_income' ? 'accepted' : 'pending'])
  ),
  fieldOverrides:  {},
  fieldOvForm:     null,   // field id showing override form

  // AI Panel (Ch.10)
  findingStatuses: Object.fromEntries(FINDINGS.map(f => [f.id, 'unreviewed'])),
  findingOverrides:{},
  expandedFindings: new Set(),
  ovFormId:        null,   // finding id showing override form
  aiFilter:        'all',  // 'all' | 'critical' | 'warning' | 'info'
};

//  TOAST 
function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className   = `toast ${type} show`;
  clearTimeout(window._toastT);
  window._toastT = setTimeout(() => { t.className = 'toast'; }, 3200);
}

//  DISPATCH ─
// All actions flow through here.
function dispatch(action, id) {
  switch (action) {

    // Navigation
    case 'nav':
      if      (id === 'dashboard') { S.view = 'dashboard'; render(); }
      else if (id === 'detail')    { S.view = 'detail';    render(); }
      else if (id === 'docs')      { S.view = 'docs';      render(); }
      else if (id === 'msg-stub')  { showToast('Messages panel coming in the next sprint.', 'warning'); }
      else                         { showToast('This section is part of the full build.', 'warning'); }
      break;

    case 'go-dash':
    case 'go-dashboard':
      S.view = 'dashboard'; render(); break;

    case 'go-detail':
      S.view = 'detail'; S.detailTab = 'fields'; S.fieldOvForm = null; S.ovFormId = null; render(); break;

    case 'go-portal':
      S.view = 'portal'; S.clientTab = 'status'; render(); break;

    case 'open-return':
      S.view = 'detail'; S.detailTab = 'fields'; S.selectedFieldId = 'wages';
      S.fieldOvForm = null; S.ovFormId = null; render(); break;

    // Dashboard controls
    case 'set-filter':
      S.filter = id; S.showCount = 10; render(); break;

    case 'metric-click':
      S.filter = S.filter === id ? 'all' : id; S.showCount = 10; render(); break;

    case 'set-sort':
      S.sortBy = id || document.querySelector('select[data-action="set-sort"]')?.value || S.sortBy;
      render(); break;

    case 'toggle-manager':
      S.managerMode = !S.managerMode; render(); break;

    case 'load-more':
      S.showCount += 10; render(); break;

    // Detail tabs
    case 'set-detail-tab':
      S.detailTab = id; S.ovFormId = null; render(); break;

    case 'set-client-tab':
      S.clientTab = id; render(); break;

    // Traceability — field actions
    case 'select-field':
      S.selectedFieldId = id; S.fieldOvForm = null; render(); break;

    case 'accept-field':
      S.fieldStatuses[id] = 'accepted';
      showToast('Value accepted and logged.'); render(); break;

    case 'undo-field':
      S.fieldStatuses[id] = 'pending'; render(); break;

    case 'show-field-ov':
      S.fieldOvForm = S.fieldOvForm === id ? null : id; render(); break;

    case 'cancel-field-ov':
      S.fieldOvForm = null; render(); break;

    case 'submit-field-ov': {
      const reason = (document.getElementById(`fov-rsn-${id}`) || {}).value || '';
      if (!reason.trim()) { showToast('A reason is required to override.', 'error'); return; }
      const val = (document.getElementById(`fov-val-${id}`) || {}).value || '';
      S.fieldStatuses[id]  = 'overridden';
      S.fieldOverrides[id] = { reason: reason.trim(), val: val.trim() };
      S.fieldOvForm        = null;
      showToast('Override saved and logged.'); render(); break;
    }

    case 'flag-field':
      S.fieldStatuses[id] = 'flagged';
      showToast('Field flagged for senior review.', 'warning'); render(); break;

    // AI panel actions
    case 'toggle-finding':
      S.expandedFindings.has(id) ? S.expandedFindings.delete(id) : S.expandedFindings.add(id);
      render(); break;

    case 'accept-finding':
      S.findingStatuses[id] = 'accepted';
      showToast('Finding accepted and logged.'); render(); break;

    case 'undo-finding':
      S.findingStatuses[id] = 'unreviewed'; render(); break;

    case 'show-ov-form':
      S.ovFormId = S.ovFormId === id ? null : id;
      if (!S.expandedFindings.has(id)) S.expandedFindings.add(id);
      render(); break;

    case 'cancel-ov':
      S.ovFormId = null; render(); break;

    case 'submit-ov': {
      const reason = (document.getElementById(`ov-r-${id}`) || {}).value || '';
      if (!reason.trim()) { showToast('A reason is required to override.', 'error'); return; }
      const note = (document.getElementById(`ov-n-${id}`) || {}).value || '';
      S.findingStatuses[id]  = 'overridden';
      S.findingOverrides[id] = { reason: reason.trim(), note: note.trim() };
      S.ovFormId             = null;
      showToast('Override saved with audit trail.'); render(); break;
    }

    case 'flag-finding':
      S.findingStatuses[id] = 'flagged';
      showToast('Flagged for senior review.', 'warning'); render(); break;

    case 'batch-accept':
      FINDINGS.filter(f => f.sev==='info' && S.findingStatuses[f.id]==='unreviewed')
               .forEach(f => { S.findingStatuses[f.id] = 'accepted'; });
      showToast('All low-risk findings accepted.'); render(); break;

    case 'set-ai-filter':
      S.aiFilter = id; render(); break;

    case 'jump-to-field':
      S.detailTab      = 'fields';
      S.selectedFieldId = id;
      S.fieldOvForm    = null;
      render(); break;

    case 'sign-file': {
      const unresolved = FINDINGS.filter(f=>S.findingStatuses[f.id]==='unreviewed').length;
      if (unresolved > 0) showToast(`Resolve ${unresolved} AI finding${unresolved!==1?'s':''} before signing.`, 'warning');
      else showToast('Return signed by Sahith R. Vellenki — queued for e-file. Confirmation: TX-2024-8734.');
      break;
    }

    case 'send-msg':
    case 'send-client-msg': {
      const inp = document.getElementById('client-msg-input') || document.getElementById('pm-input');
      if (inp && inp.value.trim()) { showToast('Message sent to Maria Delgado.'); inp.value = ''; }
      break;
    }

    case 'send-internal-note': {
      const inp = document.getElementById('int-note-input');
      if (inp && inp.value.trim()) { showToast('Internal note saved.'); inp.value = ''; }
      break;
    }

    case 'noop': break; // intentional no-op for display-only buttons

    default:
      console.warn('[TaxClear] Unknown action:', action);
  }
}

// Init
function init() {
  document.addEventListener('click', function(e) {
    const el = e.target.closest('[data-action]');
    if (el && !el.disabled) {
      dispatch(el.dataset.action, el.dataset.id || el.dataset.val || '');
    }
  });

  document.addEventListener('input', function(e) {
    if (e.target.id === 'q-search') {
      S.search    = e.target.value;
      S.showCount = 10;
      // Re-render but keep search input focused
      const sel = e.target.selectionStart;
      render();
      const inp = document.getElementById('q-search');
      if (inp) { inp.focus(); try { inp.setSelectionRange(sel, sel); } catch(_) {} }
    }
  });

  document.addEventListener('change', function(e) {
    const el = e.target.closest('select[data-action]');
    if (el) dispatch(el.dataset.action, el.value);
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      if (S.view !== 'dashboard') { S.view = 'dashboard'; render(); }
      else if (S.filter !== 'all') { S.filter = 'all'; render(); }
      else if (S.search) { S.search = ''; render(); }
    }
  });

  setTimeout(() => { render(); }, 800);
}

// Start the app
init();

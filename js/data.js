// DATA

const RETURNS = [
  { id:'R-001', client:'Harmon Industries',    type:'1120-S', year:2024, p:'o', owner:'y', due:'Aug 1',  dl:-5,  prep:'James R.',   action:'Sign and file — deadline passed Aug 1' },
  { id:'R-002', client:'Delgado, Maria',       type:'1040',   year:2024, p:'u', owner:'y', due:'Aug 8',  dl:2,   prep:'Sahith R.',  action:'AI flagged possible second W-2 — review before filing' },
  { id:'R-003', client:'Park, Soo-Jin',        type:'1040',   year:2024, p:'u', owner:'y', due:'Aug 7',  dl:1,   prep:'Rachel M.', action:'Final CPA review before e-file' },
  { id:'R-004', client:'Westbrook LLC',        type:'1065',   year:2024, p:'u', owner:'y', due:'Aug 10', dl:4,   prep:'James R.',  action:'Approve AI-extracted Schedule K-1 values' },
  { id:'R-005', client:'Chen, David & Lisa',   type:'1040',   year:2024, p:'a', owner:'c', due:'Aug 12', dl:6,   prep:'Sahith R.', action:'Client to upload Q4 brokerage statements' },
  { id:'R-006', client:'Meridian Partners',    type:'1065',   year:2024, p:'a', owner:'c', due:'Aug 15', dl:9,   prep:'James R.', action:'Pending signed engagement letter from client' },
  { id:'R-007', client:'Thornton Auto Group',  type:'1120',   year:2024, p:'a', owner:'c', due:'Aug 20', dl:14,  prep:'James R.', action:'Missing asset depreciation schedules from client' },
  { id:'R-008', client:'Nguyen, Thomas',       type:'1040',   year:2024, p:'p', owner:'p', due:'Aug 18', dl:12,  prep:'Rachel M.',action:'Preparer completing Schedule C — self-employment' },
  { id:'R-009', client:'Coastal Realty LLC',   type:'1065',   year:2024, p:'p', owner:'p', due:'Sep 2',  dl:27,  prep:'James R.', action:'Partner basis calculations in progress' },
  { id:'R-010', client:'Okonkwo, Emeka',       type:'1040',   year:2024, p:'p', owner:'p', due:'Sep 5',  dl:30,  prep:'Rachel M.',action:'Itemized deductions being compiled' },
  { id:'R-011', client:'Sunrise Bakery Inc.',  type:'1120-S', year:2024, p:'f', owner:'n', due:'Aug 2',  dl:-4,  prep:'Sahith R.', action:'Filed Aug 2, 2026 — IRS acceptance confirmed' },
  { id:'R-012', client:'Castillo, Roberto',    type:'1040',   year:2024, p:'f', owner:'n', due:'Aug 4',  dl:-2,  prep:'Rachel M.',action:'Filed Aug 4, 2026 — IRS acceptance confirmed' },
  { id:'R-013', client:'Rosenberg & Stein',    type:'1065',   year:2024, p:'f', owner:'n', due:'Jul 28', dl:-9,  prep:'James R.', action:'Filed Jul 28, 2026 — IRS acceptance confirmed' },
  { id:'R-014', client:'Patel, Ravi & Priya',  type:'1040',   year:2024, p:'f', owner:'n', due:'Aug 1',  dl:-5,  prep:'David L.', action:'Filed Aug 1, 2026 — IRS acceptance confirmed' },
  { id:'R-015', client:'Blue Mesa Ventures',   type:'1065',   year:2024, p:'f', owner:'n', due:'Jul 30', dl:-7,  prep:'Rachel M.',action:'Filed Jul 30, 2026 — IRS acceptance confirmed' },
];

// Detail
const DETAIL = {
  id:'R-002', client:'Delgado, Maria', type:'1040', year:2024,
  prep:'Sahith R.', reviewer:'Sahith R. Vellenki (You)', due:'Aug 8, 2026', p:'u',
  fields: [
    {
      id:'wages', cat:'Income', label:'Wages, salaries, tips', line:'1a',
      val:87450, neg:false, ai:false, conf:0.98, status:'accepted',
      src:'W-2', srcFull:'W-2 — Meridian Corp (2024)', srcPage:1,
      srcSection:'Box 1 — Wages, tips, other compensation',
      raw:'$87,450.00',
      transform:'Direct extraction — no calculation applied\nRaw value: $87,450.00\nReturn field: $87,450',
    },
    {
      id:'fed_tax', cat:'Income', label:'Federal income tax withheld', line:'25a',
      val:15240, neg:false, ai:false, conf:0.97, status:'accepted',
      src:'W-2', srcFull:'W-2 — Meridian Corp (2024)', srcPage:1,
      srcSection:'Box 2 — Federal income tax withheld',
      raw:'$15,240.00',
      transform:'Direct extraction — no calculation applied\nRaw value: $15,240.00\nReturn field: $15,240',
    },
    {
      id:'interest', cat:'Income', label:'Taxable interest', line:'2b',
      val:1247, neg:false, ai:true, conf:0.94, status:'pending',
      src:'1099-INT', srcFull:'1099-INT — Chase Bank (2024)', srcPage:1,
      srcSection:'Box 1 — Interest income',
      raw:'$1,247.32',
      transform:'IRS Publication 17 rounding applied:\nRaw value: $1,247.32\nRule: cents < $0.50 → round down\nReturn field: $1,247',
      aiNote:'AI applied standard IRS rounding. Difference is $0.32 — no tax impact.',
    },
    {
      id:'dividends', cat:'Income', label:'Ordinary dividends', line:'3b',
      val:3840, neg:false, ai:false, conf:0.96, status:'accepted',
      src:'1099-DIV', srcFull:'1099-DIV — Fidelity Investments (2024)', srcPage:1,
      srcSection:'Box 1a — Total ordinary dividends',
      raw:'$3,840.00',
      transform:'Direct extraction — no calculation applied\nRaw value: $3,840.00\nReturn field: $3,840',
    },
    {
      id:'cap_gains', cat:'Income', label:'Capital gain or (loss)', line:'7',
      val:-1500, neg:true, ai:true, conf:0.72, status:'pending', warn:true,
      src:'1099-B', srcFull:'1099-B — Fidelity Investments (2024)', srcPage:3,
      srcSection:'14 transactions across 3 pages',
      raw:'14 separate transactions',
      transform:'AI aggregated 14 transactions from 1099-B:\n  Short-term realized: −$3,200 (4 transactions)\n  Long-term realized:  +$1,700 (10 transactions)\n  Net gain/(loss):     −$1,500\nIRS §1211 loss cap:  −$3,000 max; carryforward: $0\nSchedule D required — manual verification recommended',
      aiNote:'Low confidence (72%). High transaction volume. AI-computed net may miss adjusted cost basis corrections. Manual Schedule D verification strongly recommended.',
    },
    {
      id:'agi', cat:'Summary', label:'Adjusted gross income', line:'11',
      val:91037, neg:false, ai:false, conf:0.99, status:'accepted',
      src:'Computed', srcFull:'TaxClear computation engine', computed:true,
      transform:'Sum of income lines:\n  Wages:       $87,450\n  Interest:    $ 1,247\n  Dividends:   $ 3,840\n  Capital G/L: −$ 1,500\n             \n  AGI:         $91,037',
    },
    {
      id:'std_ded', cat:'Deductions', label:'Standard deduction', line:'12a',
      val:14600, neg:false, ai:false, conf:0.99, status:'accepted',
      src:'IRS Table', srcFull:'IRS Pub. 501 — 2024 Standard Deductions', computed:true,
      transform:'2024 Standard Deduction — Single filer\nSource: IRS Publication 501, Table 7-1\nAmount: $14,600',
    },
    {
      id:'tax_income', cat:'Summary', label:'Taxable income', line:'15',
      val:76437, neg:false, ai:false, conf:0.99, status:'accepted',
      src:'Computed', srcFull:'TaxClear computation engine', computed:true,
      transform:'AGI minus standard deduction:\n  $91,037 − $14,600 = $76,437',
    },
    {
      id:'tax_owed', cat:'Summary', label:'Total tax owed', line:'24',
      val:12847, neg:false, ai:true, conf:0.89, status:'pending',
      src:'Computed', srcFull:'TaxClear tax engine', computed:true,
      transform:'2024 tax brackets — Single filer (taxable income: $76,437):\n  10%:  $0 – $11,600          → $1,160\n  12%:  $11,601 – $47,150     → $4,266\n  22%:  $47,151 – $76,437     → $6,443\n                               \n  Income tax subtotal:          $11,869\n  SE tax (Schedule C net ~$9,789 × 15.3% × 0.9235):\n                                $   978\n  AMT check:              Not applicable\n  Net investment income tax:    $     0\n                               \n  Total federal tax:            $12,847',
      aiNote:'Accept only after capital gains figure (Line 7) is verified. Tax owed changes if additional W-2 income is included.',
    },
    {
      id:'refund', cat:'Summary', label:'Refund amount', line:'35a',
      val:2393, neg:false, ai:true, conf:0.89, status:'pending',
      src:'Computed', srcFull:'TaxClear computation engine', computed:true,
      transform:'Payments minus tax owed:\n  Federal withheld: $15,240\n  Tax owed:        −$12,847\n               \n  Refund:           $2,393',
      aiNote:'Contingent on capital gains verification and potential Beacon Staffing W-2. Do not file until all AI findings are resolved.',
    },
  ]
};

// Docs
const DOCS = {
  'W-2': {
    name:'W-2 — Meridian Corp (2024)', type:'W-2', typeCls:'dtb-w2',
    uploaded:'Aug 3, 2026', pages:1,
    fields:[
      { label:'a — Employee SSN',                    val:'***-**-8734',  fid:null },
      { label:'b — Employer EIN',                    val:'45-1234567',   fid:null },
      { label:'c — Employer',                        val:'Meridian Corp', fid:null },
      { label:'1 — Wages, tips, other compensation', val:'$87,450.00',   fid:'wages' },
      { label:'2 — Federal income tax withheld',     val:'$15,240.00',   fid:'fed_tax' },
      { label:'3 — Social security wages',           val:'$87,450.00',   fid:null },
      { label:'4 — Social security tax withheld',    val:'$5,421.90',    fid:null },
      { label:'5 — Medicare wages and tips',         val:'$87,450.00',   fid:null },
      { label:'6 — Medicare tax withheld',           val:'$1,268.03',    fid:null },
      { label:'12a — 401(k) contributions (Code D)', val:'$6,500.00',    fid:null },
      { label:'15 — State / 16 — State wages',       val:'TX / $87,450', fid:null },
    ]
  },
  '1099-INT': {
    name:'1099-INT — Chase Bank (2024)', type:'1099-INT', typeCls:'dtb-1099',
    uploaded:'Aug 3, 2026', pages:1,
    fields:[
      { label:'1 — Interest income',             val:'$1,247.32', fid:'interest' },
      { label:'4 — Federal income tax withheld', val:'$0.00',     fid:null },
      { label:'8 — Tax-exempt interest',         val:'$0.00',     fid:null },
      { label:'Payer — Chase Bank N.A.',         val:'EIN 13-4994650', fid:null },
    ]
  },
  '1099-DIV': {
    name:'1099-DIV — Fidelity Investments (2024)', type:'1099-DIV', typeCls:'dtb-1099',
    uploaded:'Aug 3, 2026', pages:1,
    fields:[
      { label:'1a — Total ordinary dividends',           val:'$3,840.00', fid:'dividends' },
      { label:'1b — Qualified dividends',                val:'$2,910.00', fid:null },
      { label:'2a — Total capital gain distributions',   val:'$0.00',     fid:null },
      { label:'4 — Federal income tax withheld',         val:'$0.00',     fid:null },
    ]
  },
  '1099-B': {
    name:'1099-B — Fidelity Investments (2024)', type:'1099-B', typeCls:'dtb-b',
    uploaded:'Aug 3, 2026', pages:3, multi:true,
    fields:[
      { label:'Short-term net gain/(loss)',       val:'−$3,200.00', fid:null },
      { label:'Long-term net gain/(loss)',        val:'+$1,700.00', fid:null },
      { label:'Combined net [Schedule D]',        val:'−$1,500.00', fid:'cap_gains' },
      { label:'Total proceeds',                   val:'$28,450.00', fid:null },
      { label:'Total cost basis',                 val:'$29,950.00', fid:null },
      { label:'Transactions',                     val:'14 total',   fid:null },
    ]
  },
  'Computed': {
    system:true, icon:'⚙', label:'TaxClear computation engine',
    sub:'This value was derived from other return fields using IRS-defined formulas. No source document applies.'
  },
  'IRS Table': {
    system:true, icon:'📋', label:'IRS Publication 501 — 2024',
    sub:'Standard deduction amounts set by the IRS for tax year 2024. Single filer: $14,600.'
  },
};

// Findings
const FINDINGS = [
  {
    id:'af-001', sev:'critical',
    title:'Possible second W-2 not captured in return',
    desc:'AI detected a second W-2 (Beacon Staffing, EIN 52-8841023) on page 2 of uploaded documents. This W-2 shows $4,200 in wages and $630 in withheld federal tax. It does not appear to be included on the current return.',
    evidence:[
      'W-2 from Meridian Corp captured — $87,450 wages, $15,240 withheld',
      'Second W-2 from Beacon Staffing detected on document page 2 — $4,200 wages, $630 withheld',
      'Current return Line 1a: $87,450 (Meridian Corp only — Beacon Staffing not reflected)',
      '2023 prior-year return included income from both Meridian Corp and Beacon Staffing',
    ],
    conf:0.91, linkedField:'wages', canFix:false,
    rec:'Confirm with Maria Delgado whether the Beacon Staffing W-2 is valid for 2024. If yes, update Line 1a (+$4,200) and recompute AGI, total tax, and refund before filing.',
  },
  {
    id:'af-002', sev:'warning',
    title:'Home office deduction missing — prior year: $3,400',
    desc:"Client filed Form 8829 (Home Office Deduction) in 2023, claiming $3,400 tied to Schedule C income. The 2024 return has Schedule C income but no Form 8829. The client questionnaire does not note any change in home office use.",
    evidence:[
      '2023 return: Form 8829 filed — deduction $3,400 (210 sq ft / 1,400 sq ft = 15%)',
      '2024 return: Schedule C present — no Form 8829 attached',
      "Client questionnaire item 'Home office use changed?' — left blank",
      'Square footage and usage percentage unchanged per 2023 records',
    ],
    conf:0.78, linkedField:null, canFix:false,
    rec:'Contact Maria to confirm home office use continues in 2024. If yes, prepare Form 8829 and attach to return before filing.',
  },
  {
    id:'af-003', sev:'warning',
    title:'Capital gains confidence below 85% firm threshold',
    desc:"AI confidence on the net capital gain/loss figure (−$1,500, Line 7) is 72%, below the firm's 85% auto-accept threshold. The figure was computed across 14 1099-B transactions. No manually prepared Schedule D was found in the document set.",
    evidence:[
      '1099-B spans 3 pages with 14 separate transactions',
      'AI scanned all pages: short-term −$3,200, long-term +$1,700, net −$1,500',
      "Firm confidence threshold for auto-accept: 85% — current: 72%",
      'No manually prepared Schedule D found in uploaded documents',
    ],
    conf:0.72, linkedField:'cap_gains', canFix:false,
    rec:'Manually prepare Schedule D to verify AI-computed capital gain/loss totals. High transaction volume warrants human reconciliation.',
  },
  {
    id:'af-004', sev:'info',
    title:'Interest income rounded per IRS rules — $1,247.32 → $1,247',
    desc:"Chase Bank 1099-INT Box 1 shows $1,247.32. AI applied standard IRS whole-dollar rounding per Publication 17. Rounding difference: $0.32. No material tax impact.",
    evidence:[
      '1099-INT Box 1 (raw): $1,247.32',
      'IRS Publication 17: use whole-dollar amounts; drop cents under $0.50',
      'Applied: $0.32 < $0.50 → round down to $1,247',
      'Tax impact of $0.32 rounding difference: $0',
    ],
    conf:0.99, linkedField:'interest', canFix:true,
    rec:'No action needed. Accept to confirm rounding is correct, or override if exact-cent reporting is preferred.',
  },
];

// Client portal
const CLIENT_DATA = {
  name:'Maria Delgado', returnId:'R-002', type:'1040', year:2024,
  cpa:'Sahith R. Vellenki', firm:'GreenGrowth Advisory',
  stage:2,
  stages:['Documents requested','Documents received','Under CPA review','Ready to sign','Filed'],
  originalRefund:2393,
  revisedRefund:1763,
  checklist:[
    { id:'c1', label:'Upload W-2 from Meridian Corp',            done:true, note:'Uploaded Aug 3' },
    { id:'c2', label:'Upload 1099-INT from Chase Bank',           done:true, note:'Uploaded Aug 3' },
    { id:'c3', label:'Upload 1099-DIV from Fidelity Investments', done:true, note:'Uploaded Aug 3' },
    { id:'c4', label:'Upload 1099-B from Fidelity Investments',   done:true, note:'Uploaded Aug 3' },
    { id:'c5', label:'Confirm: Did you work at any other employer in 2024?', done:false, urgent:true,
      hint:'Your CPA noticed a possible second W-2 from Beacon Staffing.' },
    { id:'c6', label:'Confirm: Did you use a home office for business in 2024?', done:false,
      hint:'This may apply a deduction that was on your 2023 return.' },
  ],
  internalNotes:[
    { from:'preparer', name:'James R.', time:'Aug 5, 2:15 PM', avatar:'JR',
      text:'Found a possible second W-2 (Beacon Staffing) on page 2 of the uploaded document set. Flagged for review — may affect wages and refund amount. Running AI scan now.' },
    { from:'preparer', name:'James R.', time:'Aug 5, 3:42 PM', avatar:'JR',
      text:'AI extraction complete. Capital gains calculation is 72% confidence — 14 transactions across 3 pages of the 1099-B. Recommend manual Schedule D before sign-off.' },
  ],
  messages:[
    { from:'cpa',    name:'Sahith R. Vellenki', time:'Aug 5, 4:22 PM',  avatar:'SRV',
      text:"Hi Maria! We've received all your documents and have started processing your 2024 return. We'll have it ready for your review by Aug 8." },
    { from:'cpa',    name:'Sahith R. Vellenki', time:'Aug 6, 9:15 AM',  avatar:'SRV',
      text:"Quick question: We noticed what appears to be a W-2 from Beacon Staffing in your uploaded documents. Did you work there in 2024, even briefly? Please confirm so we can include it correctly." },
    { from:'client', name:'Maria',              time:'Aug 6, 10:05 AM', avatar:'MD',
      text:"Hi Sahith! Yes, I did some freelance work through Beacon in Q1, but it was only about 3 months. I didn't realize I'd get a W-2 for that. What does this mean for my refund?" },
    { from:'cpa',    name:'Sahith R. Vellenki', time:'Aug 6, 10:42 AM', avatar:'SRV',
      text:"Thanks for confirming! We'll add the Beacon W-2 income ($4,200). This will slightly reduce your refund — estimated from $2,393 to ~$1,763 due to the additional federal taxes owed. We'll update your return and share the revised summary shortly." },
  ],
  documents:[
    { name:'W-2 — Meridian Corp',            type:'W-2',      pages:1, date:'Aug 3', status:'extracted' },
    { name:'1099-INT — Chase Bank',           type:'1099-INT', pages:1, date:'Aug 3', status:'extracted' },
    { name:'1099-DIV — Fidelity',            type:'1099-DIV', pages:1, date:'Aug 3', status:'extracted' },
    { name:'1099-B — Fidelity (14 txns)',    type:'1099-B',   pages:3, date:'Aug 3', status:'review' },
  ],
};

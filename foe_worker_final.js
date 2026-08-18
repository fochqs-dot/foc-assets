const htmlTemplate = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>FOE Operations Center</title>
<style>
* { box-sizing: border-box; }
:root {
  --foc-bg: #07111f; --foc-bg-deep: #040b14; --foc-panel: #0d1b2a;
  --foc-border: #25445f; --foc-border-bright: #3c6382; --foc-text: #e8f1f8;
  --foc-muted: #8da5b8; --foc-gold: #d6a84c; --foc-gold-soft: #f0c96a;
  --foc-blue: #4aa3ff; --foc-cyan: #43d5e6; --foc-green: #42d392;
  --foc-yellow: #f5c451; --foc-red: #ff6b6b; --foc-radius: 12px;
  --foc-shadow: 0 8px 20px rgba(0,0,0,0.22); --foc-rail-width: 168px;
}
html { width: 100%; min-height: 100%; background: var(--foc-bg-deep); }
body { margin: 0; min-height: 100vh; font-family: Inter, "Segoe UI", Arial, sans-serif;
  background: radial-gradient(circle at top left, rgba(30,77,112,0.22), transparent 30%),
    linear-gradient(180deg, #081421 0%, var(--foc-bg) 45%, var(--foc-bg-deep) 100%);
  color: var(--foc-text); overflow-x: hidden; }
button, input, select, textarea { font: inherit; }
button { transition: border-color 0.18s ease, background 0.18s ease, transform 0.18s ease; }
button:hover { transform: translateY(-1px); }
#foc-app { display: flex; flex-direction: column; min-height: 100vh; }

/* ===== HEADER — COMPACT SINGLE ROW ===== */
.foc-header { display: flex; justify-content: space-between; align-items: center; gap: 10px;
  flex-wrap: wrap; padding: 8px 16px;
  background: linear-gradient(135deg, rgba(14,33,51,0.96), rgba(7,18,31,0.98));
  border-bottom: 1px solid var(--foc-border); box-shadow: 0 3px 12px rgba(0,0,0,0.25);
  position: relative; z-index: 100; }
.foc-header::before { content: ""; position: absolute; left: 0; top: 0; width: 4px; height: 100%;
  background: linear-gradient(180deg, var(--foc-gold-soft), var(--foc-gold)); }
.foc-header-left { display: flex; align-items: center; gap: 10px; flex: 0 0 auto; }
.foc-logo { display: flex; flex-direction: column; }
.foc-logo h1 { margin: 0; color: var(--foc-gold-soft); font-size: 16px;
  letter-spacing: 0.03em; line-height: 1.1; white-space: nowrap; font-weight: 800; }
.foc-logo .subtitle { margin-top: 1px; font-size: 9px; color: var(--foc-muted);
  letter-spacing: 0.08em; text-transform: uppercase; font-weight: 600; }
.foc-header-controls { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; justify-content: flex-end; flex: 1 1 auto; }
.foc-status { padding: 6px 12px; background: rgba(12,37,47,0.9); border: 1px solid rgba(66,211,146,0.48);
  border-radius: 999px; font-weight: 700; font-size: 11px; white-space: nowrap; color: #b9f5d8; }
.foc-dot { color: var(--foc-green); text-shadow: 0 0 8px rgba(66,211,146,0.8); }
#enable-sound { padding: 6px 12px; border: 1px solid rgba(74,163,255,0.48); border-radius: 999px;
  background: rgba(15,42,67,0.9); color: #cde6ff; cursor: pointer; font-weight: 700; font-size: 11px; white-space: nowrap; }
#enable-sound:hover { border-color: var(--foc-blue); background: rgba(25,61,94,0.95); }
.foc-tz-selector { display: flex; align-items: center; gap: 6px; padding: 5px 10px;
  background: rgba(15,35,53,0.9); border: 1px solid var(--foc-border); border-radius: 8px; }
.foc-tz-selector label { font-size: 10px; color: var(--foc-muted); font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; }
#foc-tz-select { padding: 3px 6px; background: #081a2a; border: 1px solid #35526c; border-radius: 5px;
  color: var(--foc-text); font-size: 11px; cursor: pointer; outline: none; }
#foc-tz-select:focus { border-color: var(--foc-cyan); }
#foc-tz-display { font-size: 12px; font-weight: 700; color: var(--foc-cyan); white-space: nowrap; min-width: 200px; }

/* ===== P&H MONITOR — COMPACT ===== */
.foc-ph-monitor { position: relative; display: flex; align-items: center; gap: 8px; padding: 6px 12px;
  background: rgba(15,35,53,0.9); border: 1px solid var(--foc-border); border-radius: 8px; cursor: pointer; transition: border-color 0.2s ease; }
.foc-ph-monitor:hover { border-color: var(--foc-cyan); }
.foc-ph-monitor-icon { font-size: 16px; }
.foc-ph-monitor-data { display: flex; flex-direction: column; gap: 1px; }
.foc-ph-monitor-label { font-size: 9px; color: var(--foc-muted); text-transform: uppercase; letter-spacing: 0.06em; font-weight: 700; }
.foc-ph-monitor-values { display: flex; gap: 8px; font-size: 12px; font-weight: 700; }
.foc-ph-monitor-pop { color: var(--foc-text); }
.foc-ph-monitor-hap { color: var(--foc-green); }
.foc-ph-monitor-pop::before { content: "Avail Pop: "; color: var(--foc-muted); font-size: 10px; font-weight: 600; }
.foc-ph-monitor-hap::before { content: "Add'l Hap: "; color: var(--foc-muted); font-size: 10px; font-weight: 600; }
.foc-ph-hover { display: none; position: absolute; top: calc(100% + 8px); right: 0; width: 320px;
  background: linear-gradient(180deg, rgba(15,35,53,0.98), rgba(8,23,37,0.98));
  border: 1px solid var(--foc-border-bright); border-radius: 12px; box-shadow: 0 16px 40px rgba(0,0,0,0.5);
  padding: 16px 18px; z-index: 200; cursor: default; }
.foc-ph-monitor:hover .foc-ph-hover { display: block; }
.foc-ph-hover-title { font-size: 12px; font-weight: 800; color: var(--foc-gold-soft); text-transform: uppercase;
  letter-spacing: 0.08em; margin-bottom: 10px; padding-bottom: 6px; border-bottom: 1px solid var(--foc-border); }
.foc-ph-hover-section { font-size: 10px; font-weight: 800; color: var(--foc-cyan); text-transform: uppercase; letter-spacing: 0.08em; margin: 8px 0 4px; }
.foc-ph-hover-row { display: flex; justify-content: space-between; align-items: center; padding: 4px 0; font-size: 12px; }
.foc-ph-hover-row .label { color: var(--foc-muted); }
.foc-ph-hover-row .value { font-weight: 700; color: var(--foc-text); }
.foc-ph-hover-divider { height: 1px; background: var(--foc-border); margin: 8px 0; }
.foc-ph-hover-mood { text-align: center; padding: 8px; font-size: 13px; font-weight: 700; border-radius: 8px; margin: 6px 0; }
.foc-ph-hover-mood.enthusiastic { background: rgba(66,211,146,0.15); color: var(--foc-green); border: 1px solid rgba(66,211,146,0.3); }
.foc-ph-hover-mood.happy { background: rgba(245,196,81,0.15); color: var(--foc-yellow); border: 1px solid rgba(245,196,81,0.3); }
.foc-ph-hover-mood.angry { background: rgba(255,107,107,0.15); color: var(--foc-red); border: 1px solid rgba(255,107,107,0.3); }

/* ===== NAVIGATION — COMPACT GROUP ===== */
.foc-workspace-nav { display: flex; gap: 3px; align-items: center; }
.foc-nav-btn { padding: 6px 12px; background: rgba(15,35,53,0.7); border: 1px solid var(--foc-border);
  border-radius: 7px; color: var(--foc-muted); font-size: 11px; font-weight: 700; cursor: pointer; white-space: nowrap; transition: all 0.18s ease; }
.foc-nav-btn:hover { border-color: var(--foc-cyan); color: var(--foc-text); }
.foc-nav-btn.active { background: rgba(67,213,230,0.12); border-color: var(--foc-cyan); color: var(--foc-cyan); }

/* ===== BODY — PETITE RAILS + LARGE CENTER ===== */
.foc-body { display: flex; flex: 1; min-height: 0; gap: 0; }
.foc-rail-left { width: var(--foc-rail-width); flex-shrink: 0; background: linear-gradient(180deg, rgba(9,24,38,0.92), rgba(5,17,28,0.96));
  border-right: 1px solid var(--foc-border); padding: 10px 8px; overflow-y: auto; }
.foc-rail-title { font-size: 9px; font-weight: 800; color: var(--foc-gold); text-transform: uppercase;
  letter-spacing: 0.1em; margin-bottom: 8px; padding-bottom: 5px; border-bottom: 1px solid var(--foc-border); }
.foc-rail-item { position: relative; display: flex; align-items: center; gap: 7px; padding: 6px 8px; margin-bottom: 4px;
  background: rgba(13,27,42,0.8); border: 1px solid rgba(37,68,95,0.5); border-radius: 8px; cursor: pointer; transition: border-color 0.2s ease; }
.foc-rail-item:hover { border-color: var(--foc-cyan); }
.foc-rail-item-icon { font-size: 14px; flex-shrink: 0; }
.foc-rail-item-data { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
.foc-rail-item-label { font-size: 9px; color: var(--foc-muted); font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.foc-rail-item-value { font-size: 13px; font-weight: 700; color: var(--foc-text); }

/* Rail Hover — expands inward over center */
.foc-rail-hover { display: none; position: absolute; left: calc(100% + 6px); top: 0; width: 240px;
  background: linear-gradient(180deg, rgba(15,35,53,0.98), rgba(8,23,37,0.98));
  border: 1px solid var(--foc-border-bright); border-radius: 10px; box-shadow: 0 12px 32px rgba(0,0,0,0.45);
  padding: 12px 14px; z-index: 200; }
.foc-rail-item:hover .foc-rail-hover { display: block; }
.foc-rail-right .foc-rail-hover { left: auto; right: calc(100% + 6px); }
.foc-rail-hover-title { font-size: 11px; font-weight: 800; color: var(--foc-gold-soft); text-transform: uppercase;
  letter-spacing: 0.08em; margin-bottom: 8px; padding-bottom: 5px; border-bottom: 1px solid var(--foc-border); }
.foc-rail-hover-row { display: flex; justify-content: space-between; padding: 3px 0; font-size: 11px; }
.foc-rail-hover-row .label { color: var(--foc-muted); }
.foc-rail-hover-row .value { font-weight: 700; color: var(--foc-text); }

/* Combat paired monitors */
.foc-combat-pair { display: flex; gap: 4px; align-items: center; }
.foc-combat-stat { display: flex; flex-direction: column; gap: 0; min-width: 0; }
.foc-combat-stat-label { font-size: 8px; color: var(--foc-muted); font-weight: 600; text-transform: uppercase; }
.foc-combat-stat-value { font-size: 12px; font-weight: 700; color: var(--foc-text); }

.foc-center { flex: 1; min-width: 0; overflow-y: auto; padding: 16px 20px; }
.foc-workspace { display: none; }
.foc-workspace.active { display: block; }
.foc-rail-right { width: var(--foc-rail-width); flex-shrink: 0; background: linear-gradient(180deg, rgba(9,24,38,0.92), rgba(5,17,28,0.96));
  border-left: 1px solid var(--foc-border); padding: 10px 8px; overflow-y: auto; }

/* ===== CENTER TYPOGRAPHY — REFINED ===== */
h2 { color: var(--foc-cyan); margin-top: 16px; margin-bottom: 4px; font-size: 17px; letter-spacing: 0.02em; font-weight: 700; }
.sync { font-size: 11px; color: var(--foc-muted); margin-bottom: 10px; }
.card { background: linear-gradient(180deg, rgba(15,35,53,0.98), rgba(8,23,37,0.98));
  padding: 12px; border-radius: var(--foc-radius); border: 1px solid var(--foc-border);
  box-shadow: var(--foc-shadow); overflow-x: auto; margin-bottom: 12px; }
.monitor-grid { display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr); gap: 12px; align-items: start; }
.monitor-panel { min-width: 0; }
.manual-header { display: flex; justify-content: space-between; align-items: center; gap: 10px; margin-bottom: 6px; }
.manual-header h2 { margin: 0; }
table { width: 100%; border-collapse: separate; border-spacing: 0; color: var(--foc-text); }
th { padding: 8px 10px; border-bottom: 1px solid var(--foc-border); background: rgba(8,27,43,0.96);
  color: #cfe8f7; text-align: left; font-size: 12px; font-weight: 700; letter-spacing: 0.03em; }
td { padding: 7px 10px; border-bottom: 1px solid rgba(51,82,107,0.48); font-size: 13px;
  color: var(--foc-text); background: rgba(11,29,45,0.64); }
tbody tr:last-child td { border-bottom: none; }
tbody tr:hover td { background: rgba(24,52,77,0.82); }
#add-monitor, #editor-run, #editor-delete, #inventory-delete { min-height: 34px; border: 1px solid var(--foc-border-bright);
  border-radius: 7px; background: #132b42; color: var(--foc-text); cursor: pointer; font-weight: 700; font-size: 12px; }
#add-monitor { padding: 6px 12px; border-color: rgba(74,163,255,0.56); color: #cde8ff; }
#add-monitor:hover { background: #1b3c59; }
input, select, textarea { max-width: 100%; padding: 7px 8px; color: var(--foc-text); background: #081a2a;
  border: 1px solid #35526c; border-radius: 6px; outline: none; font-size: 13px; }
input:focus, select:focus, textarea:focus { border-color: var(--foc-blue); box-shadow: 0 0 0 2px rgba(74,163,255,0.12); }
.operations-heading { margin-top: 12px; margin-bottom: 10px; }
.operations-eyebrow { color: var(--foc-gold); font-size: 10px; font-weight: 800; letter-spacing: 0.14em; }
.panel-heading { min-height: 44px; display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 6px; padding: 0 2px; }
.panel-title { color: var(--foc-cyan); font-size: 14px; font-weight: 800; letter-spacing: 0.02em; }
.panel-subtitle { margin-top: 2px; color: var(--foc-muted); font-size: 11px; }
.foc-kpi-strip { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px; }
.foc-kpi-mini { flex: 1; min-width: 100px; padding: 8px 10px; border-radius: 8px; border: 1px solid rgba(67,213,230,0.25);
  background: linear-gradient(180deg, rgba(14,45,61,0.9), rgba(8,27,40,0.9)); }
.foc-kpi-mini-label { font-size: 9px; color: var(--foc-muted); font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; }
.foc-kpi-mini-value { margin-top: 3px; font-size: 15px; font-weight: 800; color: #d9fbff; }
.foc-mode-tabs { display: flex; gap: 5px; margin-bottom: 12px; }
.foc-mode-tab { padding: 6px 14px; border: 1px solid var(--foc-border); border-radius: 7px; background: rgba(15,35,53,0.7);
  color: var(--foc-muted); font-size: 11px; font-weight: 700; cursor: pointer; white-space: nowrap; transition: all 0.18s ease; }
.foc-mode-tab:hover { border-color: var(--foc-cyan); color: var(--foc-text); }
.foc-mode-tab.active { background: rgba(67,213,230,0.12); border-color: var(--foc-cyan); color: var(--foc-cyan); }
.foc-comparison-table th { background: rgba(11,32,49,0.98); }
.foc-comparison-table .delta-pos { color: var(--foc-green); font-weight: 700; }
.foc-comparison-table .delta-neg { color: var(--foc-red); font-weight: 700; }
.foc-override-indicator { color: var(--foc-yellow); font-size: 13px; }
.foc-workspace-placeholder { padding: 30px 16px; text-align: center; color: var(--foc-muted); }
.foc-workspace-placeholder h2 { color: var(--foc-cyan); margin-bottom: 6px; }
#foc-alert { width: min(92vw, 400px) !important; top: 20px !important;
  background: linear-gradient(180deg, #12263a 0%, #081521 100%) !important; color: #e8f1f8 !important;
  border: 1px solid #d6a84c !important; border-radius: 12px !important; padding: 18px 22px !important; text-align: center !important; font-size: 15px !important; }
#foc-alert strong { display: block; margin-bottom: 8px; color: #f0c96a; font-size: 16px; letter-spacing: 0.06em; }
.btn-sm { padding: 5px 10px; border: 1px solid var(--foc-border-bright); border-radius: 6px; background: #132b42; color: var(--foc-text); cursor: pointer; font-size: 11px; font-weight: 700; }
.btn-sm:hover { background: #1b3c59; }
.btn-sm.danger { border-color: rgba(255,107,107,0.45); color: #ffc0c0; }
.btn-sm.danger:hover { background: #5c242c; }
.btn-sm.success { border-color: rgba(66,211,146,0.5); color: #aef0cf; }
.btn-sm.success:hover { background: #1b3c2f; }
@media (max-width: 1100px) { .foc-rail-left, .foc-rail-right { display: none; } .foc-body { flex-direction: column; } }
@media (max-width: 900px) { .monitor-grid { grid-template-columns: 1fr; } .foc-kpi-strip { flex-direction: column; } }
</style>
</head>
<body>
<div id="foc-app">
<div class="foc-header">
  <div class="foc-header-left"><div class="foc-logo"><h1>FOE OPERATIONS CENTER</h1><div class="subtitle">FOC Cloudflare DEV</div></div></div>
  <div class="foc-header-controls">
    <div class="foc-status"><span class="foc-dot">●</span> SYSTEM ONLINE</div>
    <button id="enable-sound">🔊 Enable FOE Sound</button>
    <div class="foc-tz-selector"><label>DATE &amp; TIME</label>
      <select id="foc-tz-select"><option value="Asia/Manila">Manila (UTC+8)</option><option value="UTC">UTC</option><option value="America/New_York">New York (ET)</option><option value="America/Los_Angeles">Los Angeles (PT)</option><option value="Europe/London">London (GMT)</option><option value="Europe/Berlin">Berlin (CET)</option><option value="Asia/Tokyo">Tokyo (JST)</option><option value="Australia/Sydney">Sydney (AEDT)</option></select>
      <span id="foc-tz-display">--:--</span></div>
    <div class="foc-ph-monitor" id="foc-ph-monitor-trigger">
      <div class="foc-ph-monitor-icon">👥</div>
      <div class="foc-ph-monitor-data">
        <div class="foc-ph-monitor-label">P&amp;H</div>
        <div class="foc-ph-monitor-values">
          <span class="foc-ph-monitor-pop" id="ph-pop-available">—</span>
          <span class="foc-ph-monitor-hap" id="ph-additional-happiness">—</span>
        </div>
      </div>
      <div class="foc-ph-hover" id="foc-ph-hover-panel">
        <div class="foc-ph-hover-title">Population &amp; Happiness — LIVE</div>
        <div class="foc-ph-hover-section">Population</div>
        <div class="foc-ph-hover-row"><span class="label">Total Population</span><span class="value" id="ph-hover-total-pop">—</span></div>
        <div class="foc-ph-hover-row"><span class="label">Available Population</span><span class="value" id="ph-hover-available-pop">—</span></div>
        <div class="foc-ph-hover-divider"></div>
        <div class="foc-ph-hover-section">Happiness</div>
        <div class="foc-ph-hover-mood" id="ph-hover-mood">—</div>
        <div class="foc-ph-hover-row"><span class="label">Provided Happiness</span><span class="value" id="ph-hover-provided-hap">—</span></div>
        <div class="foc-ph-hover-row"><span class="label">Demand for Happiness</span><span class="value" id="ph-hover-demand-hap">—</span></div>
        <div class="foc-ph-hover-row"><span class="label">Productivity</span><span class="value" id="ph-hover-productivity">—</span></div>
        <div class="foc-ph-hover-row"><span class="label">Additional Happiness</span><span class="value" id="ph-hover-additional-hap">—</span></div>
      </div>
    </div>
    <div class="foc-workspace-nav">
      <button class="foc-nav-btn active" data-workspace="qlotd">QLOTD</button>
      <button class="foc-nav-btn" data-workspace="inventory">Inventory</button>
      <button class="foc-nav-btn" data-workspace="ph">P&amp;H</button>
      <button class="foc-nav-btn" data-workspace="buildings">Buildings</button>
    </div>
  </div>
</div>
<div class="foc-body">

  <!-- ===== PETITE LEFT RAIL: PRODUCTION ===== -->
  <div class="foc-rail-left" id="foc-rail-production"><div class="foc-rail-title">Production</div><div id="foc-production-rail-items">
    <div class="foc-rail-item"><div class="foc-rail-item-icon">🪙</div><div class="foc-rail-item-data"><div class="foc-rail-item-label">Coins</div><div class="foc-rail-item-value foc-rail-loading">—</div></div>
      <div class="foc-rail-hover"><div class="foc-rail-hover-title">Coins</div><div class="foc-rail-hover-row"><span class="label">Total</span><span class="value" id="rail-coins-total">—</span></div></div></div>
    <div class="foc-rail-item"><div class="foc-rail-item-icon">📦</div><div class="foc-rail-item-data"><div class="foc-rail-item-label">Supplies</div><div class="foc-rail-item-value foc-rail-loading">—</div></div>
      <div class="foc-rail-hover"><div class="foc-rail-hover-title">Supplies</div><div class="foc-rail-hover-row"><span class="label">Total</span><span class="value" id="rail-supplies-total">—</span></div></div></div>
    <div class="foc-rail-item"><div class="foc-rail-item-icon">🔷</div><div class="foc-rail-item-data"><div class="foc-rail-item-label">Forge Points</div><div class="foc-rail-item-value foc-rail-loading">—</div></div>
      <div class="foc-rail-hover"><div class="foc-rail-hover-title">Forge Points</div><div class="foc-rail-hover-row"><span class="label">Total</span><span class="value" id="rail-fp-total">—</span></div></div></div>
    <div class="foc-rail-item"><div class="foc-rail-item-icon">🏛️</div><div class="foc-rail-item-data"><div class="foc-rail-item-label">Goods</div><div class="foc-rail-item-value foc-rail-loading">—</div></div>
      <div class="foc-rail-hover"><div class="foc-rail-hover-title">Goods</div><div class="foc-rail-hover-row"><span class="label">Total</span><span class="value" id="rail-goods-total">—</span></div></div></div>
    <div class="foc-rail-item"><div class="foc-rail-item-icon">⭐</div><div class="foc-rail-item-data"><div class="foc-rail-item-label">Special Goods</div><div class="foc-rail-item-value foc-rail-loading">—</div></div>
      <div class="foc-rail-hover"><div class="foc-rail-hover-title">Special Goods</div><div class="foc-rail-hover-row"><span class="label">Total</span><span class="value" id="rail-special-total">—</span></div></div></div>
    <div class="foc-rail-item"><div class="foc-rail-item-icon">🛡️</div><div class="foc-rail-item-data"><div class="foc-rail-item-label">Guild Goods</div><div class="foc-rail-item-value foc-rail-loading">—</div></div>
      <div class="foc-rail-hover"><div class="foc-rail-hover-title">Guild Goods</div><div class="foc-rail-hover-row"><span class="label">Total</span><span class="value" id="rail-guild-total">—</span></div></div></div>
  </div></div>

  <!-- ===== LARGE EXCLUSIVE CENTER ===== -->
  <div class="foc-center">

    <!-- WORKSPACE: QLOTD (DEFAULT) -->
    <div class="foc-workspace active" id="workspace-qlotd">
      <div class="operations-heading"><div class="operations-eyebrow">FOE LIVE OPERATIONS</div><h2>Operations Monitor</h2><div class="sync">Automatic and manual activity monitoring</div></div>
      <div class="monitor-grid">
        <div class="monitor-panel"><div class="panel-heading"><div><div class="panel-title">Quick Look — Operation Timers</div><div class="panel-subtitle">Live automatic timers • Cloudflare connected</div></div></div><div class="card"><table id="cloudflare-qlotd-table"><thead><tr><th>Activity</th><th>Time Remaining</th><th>Status</th><th>Resource</th></tr></thead><tbody id="cloudflare-qlotd-body"><tr><td colspan="4">Loading Cloudflare timers...</td></tr></tbody></table></div></div>
        <div class="monitor-panel"><div class="panel-heading"><div><div class="panel-title">Manual Priority Monitor</div><div class="panel-subtitle">User-managed activities and countdowns</div></div><button id="add-monitor">+ Add Monitor</button></div><div class="card"><table id="manual-monitor-table"><thead><tr><th>Activity</th><th>Time Remaining</th><th>Notes</th><th></th></tr></thead><tbody id="manual-monitor-body"><tr><td colspan="4">Loading...</td></tr></tbody></table></div></div>
      </div>
      <div class="card"><div class="manual-header"><div><h2>QLOTD Timer Editor</h2><div class="sync">Automatic Timer Engine • Create, edit, start and pause activities</div></div></div><table id="qlotd-editor-table"><thead><tr><th>Activity / Due / ID</th><th>Duration</th><th>Primary</th><th>Secondary</th><th>Building Item</th><th>Notes</th><th>Action</th></tr></thead><tbody><tr><td><input id="editor-activity" list="editor-activity-list" placeholder="Select existing or type new activity" style="width:100%; min-width:280px;"><datalist id="editor-activity-list"></datalist></td><td><input id="editor-duration" placeholder="0d 00:00:00" style="width:120px;"></td><td><input id="editor-primary" placeholder="Primary" style="width:90px;"></td><td><input id="editor-secondary" placeholder="Secondary" style="width:90px;"></td><td><input id="editor-building" placeholder="Building" style="width:90px;"></td><td><input id="editor-notes" placeholder="Notes" style="width:100%; min-width:130px;"></td><td style="white-space:nowrap;"><button id="editor-run" title="Start / Pause">▶</button><button id="editor-delete" title="Delete">🗑</button></td></tr></tbody></table></div>
      <div class="card"><div class="manual-header"><div><h2>Inventory Editor</h2><div class="sync">Resource Control • Manage availability and QLOTD resource references</div></div></div><table id="inventory-editor-table"><thead><tr><th>Item / Code</th><th>Available</th><th>Category</th><th>Notes</th><th>Action</th></tr></thead><tbody><tr><td><input id="inventory-selector" list="inventory-selector-list" placeholder="Select Item [Code] or type new" style="width:100%; min-width:300px;"><datalist id="inventory-selector-list"></datalist></td><td><input id="inventory-available" type="number" min="0" step="1" placeholder="0" style="width:100px;"></td><td><input id="inventory-category" placeholder="Category" style="width:130px;"></td><td><input id="inventory-notes" placeholder="Notes" style="width:100%; min-width:180px;"></td><td><button id="inventory-delete" title="Delete">🗑</button></td></tr></tbody></table></div>
    </div>

    <!-- WORKSPACE: INVENTORY -->
    <div class="foc-workspace" id="workspace-inventory">
      <div class="operations-heading"><div class="operations-eyebrow">FOE RESOURCE CONTROL</div><h2>Inventory Status</h2></div>
      <div class="card"><table><thead><tr><th>Item</th><th>Code</th><th>Available</th><th>Category</th></tr></thead><tbody id="inventory-list-body"><tr><td colspan="4">Loading...</td></tr></tbody></table></div>
    </div>

    <!-- WORKSPACE: P&H EDITOR / SIMEX -->
    <div class="foc-workspace" id="workspace-ph">
      <div class="operations-heading"><div class="operations-eyebrow">FOE CITY STATUS</div><h2>Population &amp; Happiness</h2><div class="sync" id="ph-sync-center">FOE Resolver • Loading...</div></div>
      <div class="foc-mode-tabs">
        <button class="foc-mode-tab active" data-ph-mode="live">LIVE</button>
        <button class="foc-mode-tab" data-ph-mode="override">MANUAL OVERRIDE</button>
        <button class="foc-mode-tab" data-ph-mode="simex">PLANNING-SIMEX</button>
      </div>
      <div class="foc-kpi-strip" id="ph-kpi-strip">
        <div class="foc-kpi-mini"><div class="foc-kpi-mini-label">Total Population</div><div class="foc-kpi-mini-value" id="ph-kpi-total-pop">—</div></div>
        <div class="foc-kpi-mini"><div class="foc-kpi-mini-label">Available Population</div><div class="foc-kpi-mini-value" id="ph-kpi-available-pop">—</div></div>
        <div class="foc-kpi-mini"><div class="foc-kpi-mini-label">Provided Happiness</div><div class="foc-kpi-mini-value" id="ph-kpi-provided-hap">—</div></div>
        <div class="foc-kpi-mini"><div class="foc-kpi-mini-label">Demand for Happiness</div><div class="foc-kpi-mini-value" id="ph-kpi-demand-hap">—</div></div>
        <div class="foc-kpi-mini"><div class="foc-kpi-mini-label">Additional Happiness</div><div class="foc-kpi-mini-value" id="ph-kpi-additional-hap">—</div></div>
        <div class="foc-kpi-mini"><div class="foc-kpi-mini-label">Productivity</div><div class="foc-kpi-mini-value" id="ph-kpi-productivity">—</div></div>
        <div class="foc-kpi-mini"><div class="foc-kpi-mini-label">Mood</div><div class="foc-kpi-mini-value" id="ph-kpi-mood">—</div></div>
      </div>
      <div id="ph-mode-live" class="ph-mode-content">
        <div class="card"><div class="manual-header"><h2>Building Contribution — LIVE</h2></div>
          <table id="ph-contribution-table"><thead><tr><th>Building</th><th>Type</th><th>Total Pop</th><th>Available Pop</th><th>Provided Happiness</th><th>State</th><th>Source Rule</th><th>Era</th></tr></thead><tbody id="ph-contribution-body"><tr><td colspan="8">Loading...</td></tr></tbody></table></div>
      </div>
      <div id="ph-mode-override" class="ph-mode-content" style="display:none;">
        <div class="card"><div class="manual-header"><h2>Manual Override</h2><div class="sync">LIVE value → optional override → effective value. Original LIVE values remain visible.</div></div>
          <table id="ph-override-table"><thead><tr><th>Building</th><th>LIVE Pop</th><th>Override Pop</th><th>LIVE Happiness</th><th>Override Happiness</th><th>Polished</th><th>Aid State</th><th>Action</th></tr></thead><tbody id="ph-override-body"><tr><td colspan="8">Loading...</td></tr></tbody></table></div>
      </div>
      <div id="ph-mode-simex" class="ph-mode-content" style="display:none;">
        <div class="card"><div class="manual-header"><h2>Planning SIMEX</h2><div class="sync">Hypothetical city changes applied on top of LIVE resolved city. LIVE data is never modified.</div></div>
          <div style="display:flex;gap:8px;align-items:center;margin-bottom:10px;flex-wrap:wrap;">
            <label style="font-size:11px;color:var(--foc-muted);font-weight:700;">Scenario:</label>
            <select id="simex-scenario-select" style="min-width:180px;"></select>
            <button class="btn-sm success" id="simex-new-scenario">+ New Scenario</button>
            <button class="btn-sm danger" id="simex-delete-scenario">Delete Scenario</button>
          </div>
          <table id="ph-simex-table"><thead><tr><th>Building</th><th>Operation</th><th>Type</th><th>Level</th><th>Era</th><th>Pop Prov</th><th>Hap Prov</th><th>Notes</th><th>Action</th></tr></thead><tbody id="ph-simex-body"><tr><td colspan="9">No scenario selected.</td></tr></tbody></table>
          <div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap;">
            <button class="btn-sm" id="simex-add-op">+ Add Building</button>
            <button class="btn-sm" id="simex-add-from-live">+ Add from LIVE City</button>
          </div>
        </div>
        <div class="card" id="ph-comparison-card" style="display:none;">
          <div class="manual-header"><h2>LIVE vs PLANNED Comparison</h2></div>
          <table class="foc-comparison-table"><thead><tr><th>Metric</th><th>LIVE</th><th>PLANNED</th><th>Delta</th></tr></thead><tbody id="ph-comparison-body"></tbody></table>
        </div>
      </div>
    </div>

    <!-- WORKSPACE: BUILDINGS -->
    <div class="foc-workspace" id="workspace-buildings">
      <div class="foc-workspace-placeholder"><h2>General City Buildings</h2><p>The General City Buildings Editor will be available in a future phase.</p></div>
    </div>

  </div>

  <!-- ===== PETITE RIGHT RAIL: COMBAT ===== -->
  <div class="foc-rail-right" id="foc-rail-combat"><div class="foc-rail-title">Combat</div><div id="foc-combat-rail-items">
    <div class="foc-rail-item"><div class="foc-rail-item-icon">⚔️</div><div class="foc-rail-item-data"><div class="foc-rail-item-label">Attacking Units</div>
      <div class="foc-combat-pair"><div class="foc-combat-stat"><div class="foc-combat-stat-label">ATK</div><div class="foc-combat-stat-value" id="rail-atk-atk">—</div></div><div class="foc-combat-stat"><div class="foc-combat-stat-label">DEF</div><div class="foc-combat-stat-value" id="rail-atk-def">—</div></div></div></div>
      <div class="foc-rail-hover"><div class="foc-rail-hover-title">Attacking Units</div><div class="foc-rail-hover-row"><span class="label">Attack</span><span class="value" id="hover-atk-atk">—</span></div><div class="foc-rail-hover-row"><span class="label">Defense</span><span class="value" id="hover-atk-def">—</span></div></div></div>
    <div class="foc-rail-item"><div class="foc-rail-item-icon">🏰</div><div class="foc-rail-item-data"><div class="foc-rail-item-label">City Defenders</div>
      <div class="foc-combat-pair"><div class="foc-combat-stat"><div class="foc-combat-stat-label">ATK</div><div class="foc-combat-stat-value" id="rail-def-atk">—</div></div><div class="foc-combat-stat"><div class="foc-combat-stat-label">DEF</div><div class="foc-combat-stat-value" id="rail-def-def">—</div></div></div></div>
      <div class="foc-rail-hover"><div class="foc-rail-hover-title">City Defenders</div><div class="foc-rail-hover-row"><span class="label">Attack</span><span class="value" id="hover-def-atk">—</span></div><div class="foc-rail-hover-row"><span class="label">Defense</span><span class="value" id="hover-def-def">—</span></div></div></div>
    <div class="foc-rail-item"><div class="foc-rail-item-icon">🏆</div><div class="foc-rail-item-data"><div class="foc-rail-item-label">Guild Battlegrounds</div>
      <div class="foc-combat-pair"><div class="foc-combat-stat"><div class="foc-combat-stat-label">ATK</div><div class="foc-combat-stat-value" id="rail-gbg-atk">—</div></div><div class="foc-combat-stat"><div class="foc-combat-stat-label">DEF</div><div class="foc-combat-stat-value" id="rail-gbg-def">—</div></div></div></div>
      <div class="foc-rail-hover"><div class="foc-rail-hover-title">Guild Battlegrounds</div><div class="foc-rail-hover-row"><span class="label">Attack</span><span class="value" id="hover-gbg-atk">—</span></div><div class="foc-rail-hover-row"><span class="label">Defense</span><span class="value" id="hover-gbg-def">—</span></div></div></div>
    <div class="foc-rail-item"><div class="foc-rail-item-icon">⛰️</div><div class="foc-rail-item-data"><div class="foc-rail-item-label">Guild Expedition</div>
      <div class="foc-combat-pair"><div class="foc-combat-stat"><div class="foc-combat-stat-label">ATK</div><div class="foc-combat-stat-value" id="rail-ge-atk">—</div></div><div class="foc-combat-stat"><div class="foc-combat-stat-label">DEF</div><div class="foc-combat-stat-value" id="rail-ge-def">—</div></div></div></div>
      <div class="foc-rail-hover"><div class="foc-rail-hover-title">Guild Expedition</div><div class="foc-rail-hover-row"><span class="label">Attack</span><span class="value" id="hover-ge-atk">—</span></div><div class="foc-rail-hover-row"><span class="label">Defense</span><span class="value" id="hover-ge-def">—</span></div></div></div>
    <div class="foc-rail-item"><div class="foc-rail-item-icon">🌀</div><div class="foc-rail-item-data"><div class="foc-rail-item-label">Quantum Incursions</div>
      <div class="foc-combat-pair"><div class="foc-combat-stat"><div class="foc-combat-stat-label">ATK</div><div class="foc-combat-stat-value" id="rail-qi-atk">—</div></div><div class="foc-combat-stat"><div class="foc-combat-stat-label">DEF</div><div class="foc-combat-stat-value" id="rail-qi-def">—</div></div></div></div>
      <div class="foc-rail-hover"><div class="foc-rail-hover-title">Quantum Incursions</div><div class="foc-rail-hover-row"><span class="label">Attack</span><span class="value" id="hover-qi-atk">—</span></div><div class="foc-rail-hover-row"><span class="label">Defense</span><span class="value" id="hover-qi-def">—</span></div></div></div>
    <div class="foc-rail-item"><div class="foc-rail-item-icon">💎</div><div class="foc-rail-item-data"><div class="foc-rail-item-label">QI Boost</div>
      <div class="foc-combat-pair"><div class="foc-combat-stat"><div class="foc-combat-stat-label">ATK</div><div class="foc-combat-stat-value" id="rail-qib-atk">—</div></div><div class="foc-combat-stat"><div class="foc-combat-stat-label">DEF</div><div class="foc-combat-stat-value" id="rail-qib-def">—</div></div></div></div>
      <div class="foc-rail-hover"><div class="foc-rail-hover-title">QI Boost</div><div class="foc-rail-hover-row"><span class="label">Attack</span><span class="value" id="hover-qib-atk">—</span></div><div class="foc-rail-hover-row"><span class="label">Defense</span><span class="value" id="hover-qib-def">—</span></div></div></div>
  </div></div>

</div>
</div>
<script>
let focAudioContext=null,focAudioBuffer=null,focAudioSource=null;
async function enableFOCSound(){const c=window.AudioContext||window.webkitAudioContext;if(!focAudioContext)focAudioContext=new c();if(focAudioContext.state==="suspended")await focAudioContext.resume();if(!focAudioBuffer){const r=await fetch("https://fochqs-dot.github.io/foc-assets/FOC_Digidi_Alert_28s.mp3");const ab=await r.arrayBuffer();focAudioBuffer=await focAudioContext.decodeAudioData(ab);}playFOCSound();setTimeout(function(){stopFOCSound();},500);document.getElementById("enable-sound").textContent="🔊 FOE Sound Enabled";}
function playFOCSound(){if(!focAudioContext||!focAudioBuffer)return;stopFOCSound();focAudioSource=focAudioContext.createBufferSource();focAudioSource.buffer=focAudioBuffer;focAudioSource.connect(focAudioContext.destination);focAudioSource.start(0);}
function stopFOCSound(){if(!focAudioSource)return;try{focAudioSource.stop();}catch(e){}focAudioSource.disconnect();focAudioSource=null;}
document.getElementById("enable-sound").addEventListener("click",enableFOCSound);
function showFOCAlert(a,m){const o=document.getElementById("foc-alert");if(o)o.remove();const b=document.createElement("div");b.id="foc-alert";b.innerHTML="<strong>🔔 FOE ALERT</strong><br>"+a+"<br>"+m+"<br><br>";const k=document.createElement("button");k.textContent="OK";k.addEventListener("click",function(){stopFOCSound();b.remove();});b.appendChild(k);b.style.position="fixed";b.style.top="20px";b.style.left="50%";b.style.transform="translateX(-50%)";b.style.zIndex="9999";document.body.appendChild(b);playFOCSound();}
function formatFOCTime(t){t=Math.max(0,t);const d=Math.floor(t/86400);const h=Math.floor((t%86400)/3600);const m=Math.floor((t%3600)/60);const s=t%60;return d+"d "+String(h).padStart(2,"0")+":"+String(m).padStart(2,"0")+":"+String(s).padStart(2,"0");}
function parseManualDuration(text){if(!text)return null;const c=String(text).trim();const di=c.toLowerCase().indexOf("d");if(di<=0)return null;const dt=c.slice(0,di).trim();const tt=c.slice(di+1).trim();const tp=tt.split(":");if(tp.length!==3)return null;const d=Number(dt),h=Number(tp[0]),m=Number(tp[1]),s=Number(tp[2]);if(!Number.isInteger(d)||!Number.isInteger(h)||!Number.isInteger(m)||!Number.isInteger(s)||d<0||h<0||h>23||m<0||m>59||s<0||s>59)return null;const ts=d*86400+h*3600+m*60+s;return ts>0?ts:null;}
function setText(id,v){const el=document.getElementById(id);if(el)el.textContent=v;}
let focSelectedTZ="Asia/Manila";
document.getElementById("foc-tz-select").addEventListener("change",function(){focSelectedTZ=this.value;updateTZDisplay();});
function updateTZDisplay(){var el=document.getElementById("foc-tz-display");if(!el)return;var now=new Date();try{var dateStr=now.toLocaleDateString("en-US",{timeZone:focSelectedTZ,month:"short",day:"numeric",year:"numeric"});var timeStr=now.toLocaleTimeString("en-US",{timeZone:focSelectedTZ,hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false});var tzShort=now.toLocaleTimeString("en-US",{timeZone:focSelectedTZ,timeZoneName:"short"}).split(" ").slice(-1)[0];el.textContent=dateStr+" · "+timeStr+" "+tzShort;}catch(e){el.textContent=now.toLocaleString();}}
setInterval(updateTZDisplay,1000);
document.querySelectorAll(".foc-nav-btn").forEach(function(btn){btn.addEventListener("click",function(){var ws=this.dataset.workspace;document.querySelectorAll(".foc-workspace").forEach(function(w){w.classList.remove("active");});document.querySelectorAll(".foc-nav-btn").forEach(function(b){b.classList.remove("active");});var target=document.getElementById("workspace-"+ws);if(target)target.classList.add("active");this.classList.add("active");if(ws==="ph")loadPHWorkspace();});});
document.querySelectorAll(".foc-mode-tab").forEach(function(tab){tab.addEventListener("click",function(){var mode=this.dataset.phMode;document.querySelectorAll(".foc-mode-tab").forEach(function(t){t.classList.remove("active");});this.classList.add("active");document.querySelectorAll(".ph-mode-content").forEach(function(c){c.style.display="none";});var target=document.getElementById("ph-mode-"+mode);if(target)target.style.display="block";if(mode==="live")loadPHContribution();if(mode==="override")loadPHOverrides();if(mode==="simex")loadSimexScenarios();});});
async function loadPopulationHappiness(){try{const r=await fetch("/api/resolver-summary",{cache:"no-store"});if(!r.ok)throw new Error("unavailable");const d=await r.json();if(!d.success)throw new Error("failed");const dp=d.dashboard_ph||{};const pop=dp.population||{};const hap=dp.happiness||{};const totalPop=Number(pop.provided||0);const availPop=Number(pop.available||0);const provHap=Number(hap.provided_effective||0);const demandHap=Number(hap.demand||0);const addHap=Math.round(Number(hap.additional||0));const productivity=hap.productivity!=null?hap.productivity+"%":"—";const mood=hap.mood||"UNKNOWN";setText("ph-pop-available",availPop.toLocaleString());setText("ph-additional-happiness",addHap.toLocaleString());setText("ph-hover-total-pop",totalPop.toLocaleString());setText("ph-hover-available-pop",availPop.toLocaleString());setText("ph-hover-provided-hap",provHap.toLocaleString());setText("ph-hover-demand-hap",demandHap.toLocaleString());setText("ph-hover-productivity",productivity);setText("ph-hover-additional-hap",addHap.toLocaleString());var moodEl=document.getElementById("ph-hover-mood");if(moodEl){moodEl.textContent=mood==="ENTHUSIASTIC"?"Your citizens are enthusiastic!":mood==="HAPPY"?"Your citizens are happy.":mood==="ANGRY"?"Your citizens are angry!":mood;moodEl.className="foc-ph-hover-mood "+(mood||"").toLowerCase();}setText("ph-kpi-total-pop",totalPop.toLocaleString());setText("ph-kpi-available-pop",availPop.toLocaleString());setText("ph-kpi-provided-hap",provHap.toLocaleString());setText("ph-kpi-demand-hap",demandHap.toLocaleString());setText("ph-kpi-additional-hap",addHap.toLocaleString());setText("ph-kpi-productivity",productivity);setText("ph-kpi-mood",mood==="ENTHUSIASTIC"?"Enthusiastic":mood==="HAPPY"?"Happy":mood==="ANGRY"?"Angry":mood);setText("ph-sync","FOE Resolver • Live");setText("ph-sync-center","FOE Resolver • Live");var mil=d.military||{};updateCombatRail(mil);}catch(error){setText("ph-sync","FOE Resolver • Unavailable");setText("ph-sync-center","FOE Resolver • Unavailable");}}
function updateCombatRail(mil){var atk=Number(mil.attack_attacker||0);var def=Number(mil.defense_defender||0);setText("rail-atk-atk",atk);setText("rail-atk-def",def);setText("hover-atk-atk",atk);setText("hover-atk-def",def);setText("rail-def-atk",atk);setText("rail-def-def",def);setText("hover-def-atk",atk);setText("hover-def-def",def);setText("rail-gbg-atk",atk);setText("rail-gbg-def",def);setText("hover-gbg-atk",atk);setText("hover-gbg-def",def);setText("rail-ge-atk",atk);setText("rail-ge-def",def);setText("hover-ge-atk",atk);setText("hover-ge-def",def);setText("rail-qi-atk",atk);setText("rail-qi-def",def);setText("hover-qi-atk",atk);setText("hover-qi-def",def);setText("rail-qib-atk",atk);setText("rail-qib-def",def);setText("hover-qib-atk",atk);setText("hover-qib-def",def);}
async function loadPHContribution(){try{const r=await fetch("/api/ph-contribution",{cache:"no-store"});const d=await r.json();const b=document.getElementById("ph-contribution-body");b.innerHTML="";if(!d.length){b.innerHTML='<tr><td colspan="8">No resolved buildings.</td></tr>';return;}d.forEach(function(item){const tr=document.createElement("tr");const popContrib=Number(item.population_provided||0)-Number(item.population_required||0);tr.innerHTML="<td>"+(item.building_name||"—")+"</td><td>"+(item.building_type||"—")+"</td><td>"+(item.population_provided||0).toLocaleString()+"</td><td>"+popContrib.toLocaleString()+"</td><td>"+(item.happiness_provided||0).toLocaleString()+"</td><td>"+(item.current_state||"—")+"</td><td>"+(item.source_rule||"—")+"</td><td>"+(item.resolved_era||"—")+"</td>";b.appendChild(tr);});}catch(e){document.getElementById("ph-contribution-body").innerHTML="<tr><td colspan=8>Error loading.</td></tr>";}}
async function loadPHOverrides(){try{const r=await fetch("/api/ph-overrides",{cache:"no-store"});const d=await r.json();const b=document.getElementById("ph-override-body");b.innerHTML="";if(!d.length){b.innerHTML='<tr><td colspan="8">No overrides active. LIVE values are authoritative.</td></tr>';return;}d.forEach(function(item){const tr=document.createElement("tr");var overrideIcon=item.override_population_provided!=null||item.override_happiness_provided!=null?'<span class="foc-override-indicator">⚡</span> ':"";tr.innerHTML="<td>"+overrideIcon+(item.building_name||item.instance_id)+"</td><td>"+(item.live_population_provided||0).toLocaleString()+"</td><td>"+(item.override_population_provided!=null?item.override_population_provided:"—")+"</td><td>"+(item.live_happiness_provided||0).toLocaleString()+"</td><td>"+(item.override_happiness_provided!=null?item.override_happiness_provided:"—")+"</td><td>"+(item.override_polished||"—")+"</td><td>"+(item.override_aid_state||"—")+"</td><td>"+'<button class="btn-sm danger" onclick="clearOverride(\\x27'+item.instance_id+'\\x27)">Clear</button>'+"</td>";b.appendChild(tr);});}catch(e){document.getElementById("ph-override-body").innerHTML="<tr><td colspan=8>Error loading overrides.</td></tr>";}}
async function clearOverride(instanceId){if(!confirm("Clear override for this building?"))return;await fetch("/api/ph-overrides",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({instance_id:instanceId})});loadPHOverrides();}
async function loadSimexScenarios(){try{const r=await fetch("/api/ph-simex-scenarios",{cache:"no-store"});const d=await r.json();const sel=document.getElementById("simex-scenario-select");sel.innerHTML="";if(!d.length){sel.innerHTML="<option>No scenarios</option>";document.getElementById("ph-simex-body").innerHTML="<tr><td colspan=9>No scenarios. Create one to start planning.</td></tr>";document.getElementById("ph-comparison-card").style.display="none";return;}d.forEach(function(s){const o=document.createElement("option");o.value=s.scenario_id;o.textContent=s.name;sel.appendChild(o);});if(d.length>0)loadSimexOperations(d[0].scenario_id);}catch(e){document.getElementById("ph-simex-body").innerHTML="<tr><td colspan=9>Error loading scenarios.</td></tr>";}}
async function loadSimexOperations(scenarioId){try{const r=await fetch("/api/ph-simex-buildings?scenario_id="+scenarioId,{cache:"no-store"});const d=await r.json();const b=document.getElementById("ph-simex-body");b.innerHTML="";if(!d.length){b.innerHTML="<tr><td colspan=9>No operations in this scenario.</td></tr>";document.getElementById("ph-comparison-card").style.display="none";return;}d.forEach(function(op){const tr=document.createElement("tr");tr.innerHTML="<td>"+(op.building_name||"—")+"</td><td>"+(op.operation_type||"—")+"</td><td>"+(op.building_type||"—")+"</td><td>"+(op.level||"—")+"</td><td>"+(op.resolved_era||"—")+"</td><td>"+(op.population_provided||0)+"</td><td>"+(op.happiness_provided||0)+"</td><td>"+(op.notes||"")+"</td><td>"+'<button class="btn-sm danger" onclick="deleteSimexOp('+op.id+')">🗑</button>'+"</td>";b.appendChild(tr);});loadPHComparison(scenarioId);}catch(e){document.getElementById("ph-simex-body").innerHTML="<tr><td colspan=9>Error loading operations.</td></tr>";}}
async function deleteSimexOp(id){if(!confirm("Delete this operation?"))return;await fetch("/api/ph-simex-buildings",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:id})});var sel=document.getElementById("simex-scenario-select");if(sel.value)loadSimexOperations(sel.value);}
async function loadPHComparison(scenarioId){try{const r=await fetch("/api/ph-comparison?scenario_id="+scenarioId,{cache:"no-store"});const d=await r.json();if(!d.live){document.getElementById("ph-comparison-card").style.display="none";return;}document.getElementById("ph-comparison-card").style.display="block";const b=document.getElementById("ph-comparison-body");b.innerHTML="";var rows=[["Total Population","total_population"],["Available Population","available_population"],["Provided Happiness","provided_happiness"],["Demand for Happiness","demand_for_happiness"],["Additional Happiness","additional_happiness"],["Productivity","productivity"],["Mood","mood"]];rows.forEach(function(row){var liveVal=d.live[row[1]];var plannedVal=d.planned[row[1]];var delta=plannedVal-liveVal;var deltaClass=delta>0?"delta-pos":delta<0?"delta-neg":"";var deltaStr=delta>0?"+"+delta:delta;b.appendChild(function(){var tr=document.createElement("tr");tr.innerHTML="<td>"+row[0]+"</td><td>"+liveVal+"</td><td>"+plannedVal+"</td><td class='"+deltaClass+"'>"+deltaStr+"</td>";return tr;}());});}catch(e){document.getElementById("ph-comparison-card").style.display="none";}}
async function loadPHWorkspace(){loadPHContribution();}
document.getElementById("simex-scenario-select").addEventListener("change",function(){if(this.value&&this.value!=="No scenarios")loadSimexOperations(this.value);});
document.getElementById("simex-new-scenario").addEventListener("click",async function(){var name=prompt("Scenario name:");if(!name)return;await fetch("/api/ph-simex-scenarios",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:name})});loadSimexScenarios();});
document.getElementById("simex-delete-scenario").addEventListener("click",async function(){var sel=document.getElementById("simex-scenario-select");if(!sel.value||sel.value==="No scenarios")return;if(!confirm("Delete this scenario and all its operations?"))return;await fetch("/api/ph-simex-scenarios",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({scenario_id:Number(sel.value)})});loadSimexScenarios();});
document.getElementById("simex-add-op").addEventListener("click",async function(){var name=prompt("Building name:");if(!name)return;var sel=document.getElementById("simex-scenario-select");if(!sel.value||sel.value==="No scenarios")return;await fetch("/api/ph-simex-buildings",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({scenario_id:Number(sel.value),operation_type:"add",building_name:name,building_type:"residential",population_provided:0,happiness_provided:0})});loadSimexOperations(sel.value);});
document.getElementById("simex-add-from-live").addEventListener("click",async function(){var instId=prompt("Enter LIVE instance ID to add/remove:");if(!instId)return;var sel=document.getElementById("simex-scenario-select");if(!sel.value||sel.value==="No scenarios")return;await fetch("/api/ph-simex-buildings",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({scenario_id:Number(sel.value),operation_type:"remove",target_instance_id:instId})});loadSimexOperations(sel.value);});
async function loadCloudflareQLOTD(){try{const r=await fetch("/api/qlotd",{cache:"no-store"});if(!r.ok)throw new Error("load failed");const d=await r.json();const b=document.getElementById("cloudflare-qlotd-body");b.innerHTML="";if(!d.length){b.innerHTML='<tr><td colspan="4">No active timers.</td></tr>';return;}d.forEach(function(item){const row=document.createElement("tr");row.innerHTML="<td>"+(item.activity||"")+"</td><td>"+(item.remaining||"")+"</td><td>"+(item.status||"")+"</td><td>"+(item.resource_display||"")+"</td>";b.appendChild(row);});}catch(error){document.getElementById("cloudflare-qlotd-body").innerHTML='<tr><td colspan="4">CLOUDFLARE CONNECTION ERROR</td></tr>';}}
async function loadManualMonitor(){try{const r=await fetch("/api/manual-monitor",{cache:"no-store"});const d=await r.json();const b=document.getElementById("manual-monitor-body");b.innerHTML="";if(!d.length){b.innerHTML='<tr><td colspan="4">No manual monitors.</td></tr>';return;}d.forEach(function(item){const row=document.createElement("tr");row.innerHTML="<td>"+(item.activity||"")+"</td><td>"+(item.target_time?formatFOCTime(Math.ceil((new Date(item.target_time).getTime()-Date.now())/1000)):"—")+"</td><td>"+(item.notes||"")+"</td><td>"+'<button class="btn-sm danger" onclick="deleteMonitor('+item.id+')">🗑</button>'+"</td>";b.appendChild(row);});}catch(error){document.getElementById("manual-monitor-body").innerHTML="<tr><td colspan=4>Error</td></tr>";}}
async function deleteMonitor(id){if(!confirm("Delete this monitor?"))return;await fetch("/api/manual-monitor",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:id})});loadManualMonitor();}
document.getElementById("add-monitor").addEventListener("click",async function(){const na=prompt("Activity:");if(!na)return;const nd=prompt("Duration (0d 00:00:00):","");if(!nd)return;const ns=parseManualDuration(nd);if(!ns){alert("Invalid duration. Use format: 0d 00:10:10");return;}const nn=prompt("Notes:")||"";const r=await fetch("/api/manual-monitor",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({activity:na.trim(),duration_seconds:ns,notes:nn.trim()})});const res=await r.json();if(!res.success){alert(res.error||"Monitor could not be added.");return;}await loadManualMonitor();});
async function loadQLOTDEditor(){try{const r=await fetch("/api/automatic-timers",{cache:"no-store"});const d=await r.json();const l=document.getElementById("editor-activity-list");l.innerHTML="";d.forEach(function(item){const o=document.createElement("option");o.value=item.activity+" [ID "+item.id+"]";l.appendChild(o);});}catch(e){}}
async function loadInventoryEditor(){try{const r=await fetch("/api/inventory",{cache:"no-store"});const d=await r.json();const l=document.getElementById("inventory-selector-list");l.innerHTML="";d.forEach(function(item){const o=document.createElement("option");o.value=item.item+" ["+item.code+"]";l.appendChild(o);});const lb=document.getElementById("inventory-list-body");if(lb){lb.innerHTML="";if(!d.length){lb.innerHTML="<tr><td colspan=4>No inventory items.</td></tr>";return;}d.forEach(function(item){const tr=document.createElement("tr");tr.innerHTML="<td>"+(item.item||"")+"</td><td>"+(item.code||"")+"</td><td>"+(item.available||0)+"</td><td>"+(item.category||"")+"</td>";lb.appendChild(tr);});}}catch(e){}}
loadCloudflareQLOTD();loadPopulationHappiness();loadManualMonitor();loadQLOTDEditor();loadInventoryEditor();updateTZDisplay();
setInterval(loadCloudflareQLOTD,60000);setInterval(loadPopulationHappiness,60000);
</script>
</body>
</html>`;

const ERA_ORDER=["StoneAge","BronzeAge","IronAge","EarlyMiddleAge","HighMiddleAge","LateMiddleAge","ColonialAge","IndustrialAge","ProgressiveEra","ModernEra","PostModernEra","ContemporaryEra","TomorrowEra","FutureEra","ArcticFuture","OceanicFuture","VirtualFuture","SpaceAgeMars","SpaceAgeAsteroidBelt","SpaceAgeVenus","SpaceAgeJupiterMoon","SpaceAgeTitan","SpaceAgeSpaceHub"];

function getEntityLevelData(d,l){if(!d||l==null)return null;const lv=d.entity_levels;if(Array.isArray(lv))return lv[l]??null;if(lv&&typeof lv==="object")return lv[l]??lv[String(l)]??null;return null;}
function resolveEraFromDefinition(d,l){if(!d||l==null)return null;const ld=getEntityLevelData(d,l);if(ld?.era)return ld.era;const ce=ERA_ORDER[l]??null;if(ce&&d.components?.[ce])return ce;return null;}

function resolveBuildingState(input){
  const state=input.state??{};const instanceId=input.id??null;const entityId=input.cityentity_id??null;const buildingType=input.type??null;const level=input.level??null;
  let sourceRule="DIRECT_ENTITY";let currentState="ACTIVE";
  if(input.decayedFromCityEntityId){sourceRule="DECAYED_ENTITY";currentState="DECAYED";}
  else if(buildingType==="greatbuilding"){sourceRule="GREAT_BUILDING_LEVEL";}
  else if(typeof entityId==="string"&&entityId.includes("_MultiAge_")){sourceRule="MULTI_AGE_LEVEL";}
  const productionTime=state.current_product?.production_time??state.productionOption?.time??null;
  let happinessProvided=0;
  if(buildingType==="greatbuilding"&&input.bonus?.type==="happiness"){happinessProvided=Number(input.bonus.value)||0;}
  return{instance_id:instanceId,entity_id:entityId,building_name:null,building_type:buildingType,level,source_rule:sourceRule,resolved_era:null,current_state:currentState,population_required:0,population_provided:0,happiness_required:0,happiness_provided:happinessProvided,attack_attacker:0,defense_attacker:0,attack_defender:0,defense_defender:0,production_time:productionTime,next_transition_at:state.next_state_transition_at??null,decays_at:state.decaysAt??null,source_updated_at:new Date().toISOString()};
}

async function ensureSimexTables(env) {
  try {
    await env.DB.prepare("CREATE TABLE IF NOT EXISTS ph_simex_scenarios (scenario_id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, description TEXT DEFAULT NULL, created_at TEXT NOT NULL, updated_at TEXT DEFAULT NULL)").run();
    await env.DB.prepare("CREATE TABLE IF NOT EXISTS ph_simex_operations (id INTEGER PRIMARY KEY AUTOINCREMENT, scenario_id INTEGER NOT NULL, operation_type TEXT NOT NULL, target_instance_id TEXT DEFAULT NULL, entity_id TEXT DEFAULT NULL, building_name TEXT DEFAULT NULL, building_type TEXT DEFAULT NULL, level INTEGER DEFAULT NULL, resolved_era TEXT DEFAULT NULL, source_rule TEXT DEFAULT NULL, population_required INTEGER NOT NULL DEFAULT 0, population_provided INTEGER NOT NULL DEFAULT 0, happiness_required INTEGER NOT NULL DEFAULT 0, happiness_provided INTEGER NOT NULL DEFAULT 0, attack_attacker INTEGER NOT NULL DEFAULT 0, defense_attacker INTEGER NOT NULL DEFAULT 0, attack_defender INTEGER NOT NULL DEFAULT 0, defense_defender INTEGER NOT NULL DEFAULT 0, quantity INTEGER NOT NULL DEFAULT 1, notes TEXT DEFAULT NULL, created_at TEXT NOT NULL, FOREIGN KEY (scenario_id) REFERENCES ph_simex_scenarios(scenario_id) ON DELETE CASCADE)").run();
    await env.DB.prepare("CREATE TABLE IF NOT EXISTS ph_overrides (instance_id TEXT PRIMARY KEY, override_population_provided INTEGER DEFAULT NULL, override_happiness_provided INTEGER DEFAULT NULL, override_polished TEXT DEFAULT NULL, override_aid_state TEXT DEFAULT NULL, override_active INTEGER NOT NULL DEFAULT 1, notes TEXT DEFAULT NULL, updated_at TEXT DEFAULT NULL)").run();
  } catch(e) {}
}

function aggregatePH(rows) {
  let totalPopReq=0,totalPopProv=0,totalHapReq=0,totalHapProv=0;
  for (const r of rows) {
    totalPopReq+=Number(r.population_required||0);
    totalPopProv+=Number(r.population_provided||0);
    totalHapReq+=Number(r.happiness_required||0);
    totalHapProv+=Number(r.happiness_provided||0);
  }
  const availablePop=totalPopProv-totalPopReq;
  const providedHap=totalHapProv;
  const demandHap=totalHapReq;
  const additionalHap=providedHap-demandHap;
  const enthusiasticThreshold=totalPopProv*1.4;
  const productivity=additionalHap>=enthusiasticThreshold?120:additionalHap>=demandHap?100:100;
  const mood=additionalHap>=enthusiasticThreshold?"ENTHUSIASTIC":additionalHap>=demandHap?"HAPPY":"ANGRY";
  return {total_population:totalPopProv,available_population:availablePop,provided_happiness:providedHap,demand_for_happiness:demandHap,additional_happiness:additionalHap,productivity:productivity,mood:mood};
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/resolve-buildings" && request.method === "POST") {return Response.json({success:false,deprecated:true,message:"Use /api/resolver-refresh instead"},{status:410});}

    if (url.pathname === "/api/resolver-refresh" && request.method === "POST") {
      const raw = await request.json();const cityEntities = raw?.CityEntities ?? {};const cityMapData = raw?.CityMapData;
      if (!cityMapData || typeof cityMapData !== "object" || Array.isArray(cityMapData)) {return Response.json({success:false,error:"CityMapData object not found."},{status:400});}
      const instances = Object.values(cityMapData);let resolved = 0; let skipped = 0;
      for (const instance of instances) {
        if (!instance || instance.id == null || !instance.cityentity_id || instance.type === "street") {skipped++; continue;}
        const state = resolveBuildingState(instance);const definition = cityEntities[state.entity_id] ?? null;
        if (definition?.name) state.building_name = definition.name;
        if (definition?.type && !state.building_type) state.building_type = definition.type;
        if (state.source_rule === "MULTI_AGE_LEVEL" && definition) {
          const era = resolveEraFromDefinition(definition, state.level);if (era) state.resolved_era = era;
          const levelData = getEntityLevelData(definition, state.level);
          if (levelData?.provided_population != null) {state.population_required = 0; state.population_provided = Number(levelData.provided_population) || 0;}
          else if (levelData?.required_population != null) {state.population_required = Math.abs(Number(levelData.required_population) || 0); state.population_provided = 0;}
          const eraData = state.resolved_era ? definition.components?.[state.resolved_era] ?? null : null;
          if (eraData?.happiness) {state.happiness_provided = Number(eraData.happiness.provided) || 0; state.happiness_required = Number(eraData.happiness.demanded) || 0;}
        }
        if (state.source_rule === "DIRECT_ENTITY") {
          const master = await env.DB.prepare("SELECT name,population_required,population_provided,happiness_required,happiness_provided FROM building_master WHERE entity_id = ? LIMIT 1").bind(state.entity_id).first();
          if (master) {state.building_name = master.name ?? state.building_name;state.population_required = Number(master.population_required) || 0;state.population_provided = Number(master.population_provided) || 0;state.happiness_required = Number(master.happiness_required) || 0;state.happiness_provided = Number(master.happiness_provided) || 0;}
        }
        await env.DB.prepare("INSERT INTO resolved_building_state(instance_id,entity_id,building_name,building_type,level,source_rule,resolved_era,current_state,population_required,population_provided,happiness_required,happiness_provided,attack_attacker,defense_attacker,attack_defender,defense_defender,production_time,next_transition_at,decays_at,source_updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(instance_id) DO UPDATE SET entity_id=excluded.entity_id,building_name=excluded.building_name,building_type=excluded.building_type,level=excluded.level,source_rule=excluded.source_rule,resolved_era=excluded.resolved_era,current_state=excluded.current_state,population_required=excluded.population_required,population_provided=excluded.population_provided,happiness_required=excluded.happiness_required,happiness_provided=excluded.happiness_provided,attack_attacker=excluded.attack_attacker,defense_attacker=excluded.defense_attacker,attack_defender=excluded.attack_defender,defense_defender=excluded.defense_defender,production_time=excluded.production_time,next_transition_at=excluded.next_transition_at,decays_at=excluded.decays_at,source_updated_at=excluded.source_updated_at").bind(state.instance_id,state.entity_id,state.building_name,state.building_type,state.level,state.source_rule,state.resolved_era,state.current_state,state.population_required,state.population_provided,state.happiness_required,state.happiness_provided,state.attack_attacker,state.defense_attacker,state.attack_defender,state.defense_defender,state.production_time,state.next_transition_at,state.decays_at,state.source_updated_at).run();
        resolved++;
      }
      return Response.json({success:true,resolved,skipped});
    }

    if (url.pathname === "/api/resolver-summary" && request.method === "GET") {
      const ph = await env.DB.prepare("SELECT SUM(population_required) AS required, SUM(population_provided) AS provided FROM resolved_building_state").first();
      const mil = await env.DB.prepare("SELECT SUM(attack_attacker) AS attack_attacker, SUM(defense_defender) AS defense_defender FROM resolved_building_state").first();
      const req = Number(ph?.required || 0); const prov = Number(ph?.provided || 0);
      const demand = req; const provided = prov;
      const additional = provided - demand;
      const enthusiasticThreshold = prov * 1.4;
      const productivity = additional >= enthusiasticThreshold ? 120 : additional >= demand ? 100 : 100;
      const mood = additional >= enthusiasticThreshold ? "ENTHUSIASTIC" : additional >= demand ? "HAPPY" : "ANGRY";
      return Response.json({success:true,dashboard_ph:{population:{required:req,provided:prov,available:prov-req},happiness:{provided_effective:provided,additional:additional,demand:demand,productivity:productivity,mood:mood}},military:{attack_attacker:Number(mil?.attack_attacker||0),defense_defender:Number(mil?.defense_defender||0)},production:[]});
    }

    if (url.pathname === "/api/ph-contribution" && request.method === "GET") {
      const rows = await env.DB.prepare("SELECT instance_id,building_name,building_type,level,source_rule,resolved_era,current_state,population_required,population_provided,happiness_required,happiness_provided FROM resolved_building_state ORDER BY building_name").all();
      return Response.json(rows.results || []);
    }

    if (url.pathname === "/api/ph-overrides" && request.method === "GET") {
      await ensureSimexTables(env);
      const rows = await env.DB.prepare("SELECT o.*, r.building_name, r.population_provided AS live_population_provided, r.happiness_provided AS live_happiness_provided FROM ph_overrides o LEFT JOIN resolved_building_state r ON o.instance_id = r.instance_id WHERE o.override_active = 1").all();
      return Response.json(rows.results || []);
    }
    if (url.pathname === "/api/ph-overrides" && request.method === "PUT") {
      await ensureSimexTables(env);
      const b = await request.json();
      await env.DB.prepare("INSERT INTO ph_overrides (instance_id,override_population_provided,override_happiness_provided,override_polished,override_aid_state,override_active,notes,updated_at) VALUES (?,?,?,?,?,1,?,?) ON CONFLICT(instance_id) DO UPDATE SET override_population_provided=excluded.override_population_provided,override_happiness_provided=excluded.override_happiness_provided,override_polished=excluded.override_polished,override_aid_state=excluded.override_aid_state,notes=excluded.notes,updated_at=excluded.updated_at").bind(b.instance_id,b.override_population_provided??null,b.override_happiness_provided??null,b.override_polished??null,b.override_aid_state??null,b.notes??null,new Date().toISOString()).run();
      return Response.json({success:true});
    }
    if (url.pathname === "/api/ph-overrides" && request.method === "DELETE") {
      await ensureSimexTables(env);
      const b = await request.json();
      await env.DB.prepare("DELETE FROM ph_overrides WHERE instance_id = ?").bind(b.instance_id).run();
      return Response.json({success:true});
    }

    if (url.pathname === "/api/ph-simex-scenarios" && request.method === "GET") {
      await ensureSimexTables(env);
      const rows = await env.DB.prepare("SELECT * FROM ph_simex_scenarios ORDER BY scenario_id DESC").all();
      return Response.json(rows.results || []);
    }
    if (url.pathname === "/api/ph-simex-scenarios" && request.method === "POST") {
      await ensureSimexTables(env);
      const b = await request.json();
      const r = await env.DB.prepare("INSERT INTO ph_simex_scenarios (name,description,created_at) VALUES (?,?,?) RETURNING scenario_id").bind(b.name,b.description||"",new Date().toISOString()).first();
      return Response.json({success:true,scenario_id:r?.scenario_id});
    }
    if (url.pathname === "/api/ph-simex-scenarios" && request.method === "DELETE") {
      await ensureSimexTables(env);
      const b = await request.json();
      await env.DB.prepare("DELETE FROM ph_simex_scenarios WHERE scenario_id = ?").bind(b.scenario_id).run();
      await env.DB.prepare("DELETE FROM ph_simex_operations WHERE scenario_id = ?").bind(b.scenario_id).run();
      return Response.json({success:true});
    }

    if (url.pathname === "/api/ph-simex-buildings" && request.method === "GET") {
      await ensureSimexTables(env);
      const scenarioId = url.searchParams.get("scenario_id");
      const rows = await env.DB.prepare("SELECT * FROM ph_simex_operations WHERE scenario_id = ? ORDER BY id").bind(scenarioId).all();
      return Response.json(rows.results || []);
    }
    if (url.pathname === "/api/ph-simex-buildings" && request.method === "POST") {
      await ensureSimexTables(env);
      const b = await request.json();
      const r = await env.DB.prepare("INSERT INTO ph_simex_operations (scenario_id,operation_type,target_instance_id,entity_id,building_name,building_type,level,resolved_era,source_rule,population_required,population_provided,happiness_required,happiness_provided,attack_attacker,defense_attacker,attack_defender,defense_defender,quantity,notes,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) RETURNING id").bind(b.scenario_id,b.operation_type,b.target_instance_id??null,b.entity_id??null,b.building_name??null,b.building_type??null,b.level??null,b.resolved_era??null,b.source_rule??null,b.population_required||0,b.population_provided||0,b.happiness_required||0,b.happiness_provided||0,b.attack_attacker||0,b.defense_attacker||0,b.attack_defender||0,b.defense_defender||0,b.quantity||1,b.notes??null,new Date().toISOString()).first();
      return Response.json({success:true,id:r?.id});
    }
    if (url.pathname === "/api/ph-simex-buildings" && request.method === "DELETE") {
      await ensureSimexTables(env);
      const b = await request.json();
      await env.DB.prepare("DELETE FROM ph_simex_operations WHERE id = ?").bind(b.id).run();
      return Response.json({success:true});
    }

    if (url.pathname === "/api/ph-comparison" && request.method === "GET") {
      await ensureSimexTables(env);
      const scenarioId = url.searchParams.get("scenario_id");
      const liveRows = await env.DB.prepare("SELECT population_required,population_provided,happiness_required,happiness_provided FROM resolved_building_state").all();
      const liveAgg = aggregatePH(liveRows.results || []);
      const ops = await env.DB.prepare("SELECT * FROM ph_simex_operations WHERE scenario_id = ?").bind(scenarioId).all();
      const plannedRows = [...(liveRows.results || [])];
      for (const op of (ops.results || [])) {
        if (op.operation_type === "remove") {
          const idx = plannedRows.findIndex(r => r.instance_id === op.target_instance_id);
          if (idx >= 0) plannedRows.splice(idx, 1);
        } else if (op.operation_type === "add") {
          for (let i = 0; i < (op.quantity || 1); i++) {
            plannedRows.push({population_required:op.population_required,population_provided:op.population_provided,happiness_required:op.happiness_required,happiness_provided:op.happiness_provided});
          }
        } else if (op.operation_type === "change") {
          const idx = plannedRows.findIndex(r => r.instance_id === op.target_instance_id);
          if (idx >= 0) {
            plannedRows[idx] = {...plannedRows[idx], population_required: op.population_required || plannedRows[idx].population_required, population_provided: op.population_provided || plannedRows[idx].population_provided, happiness_required: op.happiness_required || plannedRows[idx].happiness_required, happiness_provided: op.happiness_provided || plannedRows[idx].happiness_provided};
          }
        }
      }
      const plannedAgg = aggregatePH(plannedRows);
      return Response.json({live:liveAgg, planned:plannedAgg});
    }

    if (url.pathname === "/api/qlotd" && request.method === "GET") {const rows = await env.DB.prepare("SELECT id, activity, duration_seconds, target_time, status, primary_resource, secondary_resource FROM automatic_timer ORDER BY id").all();return Response.json(rows.results || []);}
    if (url.pathname === "/api/automatic-timers" && request.method === "GET") {const rows = await env.DB.prepare("SELECT * FROM automatic_timer ORDER BY id").all();return Response.json(rows.results || []);}
    if (url.pathname === "/api/automatic-timers" && request.method === "POST") {const b = await request.json();const r = await env.DB.prepare("INSERT INTO automatic_timer (activity, duration_seconds, primary_resource, secondary_resource, building_item, notes) VALUES (?, ?, ?, ?, ?, ?) RETURNING id").bind(b.activity, b.duration_seconds, b.primary_resource||"", b.secondary_resource||"", b.building_item||"", b.notes||"").first();return Response.json({success:true, id: r?.id});}
    if (url.pathname === "/api/automatic-timers" && request.method === "PUT") {const b = await request.json();await env.DB.prepare("UPDATE automatic_timer SET activity=?, duration_seconds=?, primary_resource=?, secondary_resource=?, building_item=?, notes=? WHERE id=?").bind(b.activity, b.duration_seconds, b.primary_resource||"", b.secondary_resource||"", b.building_item||"", b.notes||"", b.id).run();return Response.json({success:true});}
    if (url.pathname === "/api/automatic-timers" && request.method === "DELETE") {const b = await request.json();await env.DB.prepare("DELETE FROM automatic_timer WHERE id=?").bind(b.id).run();return Response.json({success:true});}
    if (url.pathname === "/api/manual-monitor" && request.method === "GET") {const rows = await env.DB.prepare("SELECT * FROM manual_monitor ORDER BY id").all();return Response.json(rows.results || []);}
    if (url.pathname === "/api/manual-monitor" && request.method === "POST") {const b = await request.json();const r = await env.DB.prepare("INSERT INTO manual_monitor (activity, duration_seconds, notes) VALUES (?, ?, ?) RETURNING id").bind(b.activity, b.duration_seconds, b.notes||"").first();return Response.json({success:true, id: r?.id});}
    if (url.pathname === "/api/manual-monitor" && request.method === "PUT") {const b = await request.json();await env.DB.prepare("UPDATE manual_monitor SET activity=?, duration_seconds=?, notes=? WHERE id=?").bind(b.activity, b.duration_seconds, b.notes||"", b.id).run();return Response.json({success:true});}
    if (url.pathname === "/api/manual-monitor" && request.method === "DELETE") {const b = await request.json();await env.DB.prepare("DELETE FROM manual_monitor WHERE id=?").bind(b.id).run();return Response.json({success:true});}
    if (url.pathname === "/api/inventory" && request.method === "GET") {const rows = await env.DB.prepare("SELECT * FROM inventory ORDER BY item").all();return Response.json(rows.results || []);}
    if (url.pathname === "/api/inventory" && request.method === "POST") {const b = await request.json();await env.DB.prepare("INSERT INTO inventory (code, item, available, category, notes) VALUES (?, ?, ?, ?, ?) ON CONFLICT(code) DO UPDATE SET item=excluded.item, available=excluded.available, category=excluded.category, notes=excluded.notes").bind(b.code, b.item, b.available, b.category||"", b.notes||"").run();return Response.json({success:true, code: b.code});}
    if (url.pathname === "/api/inventory" && request.method === "DELETE") {const b = await request.json();await env.DB.prepare("DELETE FROM inventory WHERE code=?").bind(b.code).run();return Response.json({success:true});}

    if (url.pathname === "/" || url.pathname === "/dashboard") {return new Response(htmlTemplate, { headers: { "Content-Type": "text/html; charset=UTF-8" } });}
    return Response.json({ error: "FOE route not found." }, { status: 404 });
  }
};
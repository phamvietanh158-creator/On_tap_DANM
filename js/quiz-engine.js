// ═══════════════════════════════════════════════════════════════════
//  quiz-engine.js — NenMong Quiz Runtime Engine
//  Điều phối luồng làm bài 4 bước, SVG Trụ địa chất, Chấm điểm & Rubric
// ═══════════════════════════════════════════════════════════════════

let currentQuestion = null;
let currentStepIndex = 1; // 1 -> 4
let stepScoreState = { s1: 0, s2: 0, s3: 0, s4: 0 };
let stepDoneState = [false, false, false, false];
let step1Detail = null;
let step2Detail = null;
let isGradingCompleted = false;
let m1Inputs = { s1: [], s2: [], s3: '', s4: null };   // bài làm thô gửi máy chủ chấm lại

// ── SOIL PATTERNS & COLORS ──
function getSoilPattern(soilName) {
  const n = (soilName || '').toLowerCase();
  if (n.includes('bùn')) return 'url(#pat-bun)';
  if (n.includes('cuội') || n.includes('sỏi')) return 'url(#pat-cuoi)';
  if (n.includes('cát pha') || n.includes('á cát')) return 'url(#pat-catpha)';
  if (n.includes('cát')) return 'url(#pat-cat)';
  if (n.includes('sét pha') || n.includes('á sét')) return 'url(#pat-setpha)';
  return 'url(#pat-set)';
}

function getSoilColor(soilName) {
  const n = (soilName || '').toLowerCase();
  if (n.includes('bùn')) return '#A8C8E8';
  if (n.includes('cuội') || n.includes('sỏi')) return '#B0B8C0';
  if (n.includes('cát pha') || n.includes('á cát')) return '#E8D5A0';
  if (n.includes('cát')) return '#F5E06A';
  if (n.includes('sét pha') || n.includes('á sét')) return '#D4B896';
  return '#C4A882';
}

// ── RENDER SVG SOIL PROFILE ──
function renderSoilProfileSVG(question, showBadges = false) {
  const svg = document.getElementById('soil-svg');
  if (!svg || !question || !question.layers) return;

  const SVG_W = 260;
  const LEFT = 48;
  const BAR_W = 160;
  const layers = question.layers;

  // Tính toán tỉ lệ chiều cao
  const definedLayers = layers.filter(l => l.day);
  const totalDefinedDepth = definedLayers.reduce((s, l) => s + l.day, 0);
  const lastLayerHeight = totalDefinedDepth > 0 ? totalDefinedDepth * 0.45 : 6;
  const totalH = totalDefinedDepth + lastLayerHeight;
  const SCALE = Math.min(280 / totalH, 20); // px mỗi mét
  const SVG_H = Math.max(320, totalH * SCALE + 50);

  svg.setAttribute('viewBox', `0 0 ${SVG_W} ${SVG_H}`);

  // Đường mặt đất tự nhiên
  let svgContent = `
    <line x1="${LEFT}" y1="24" x2="${LEFT + BAR_W}" y2="24" stroke="#333333" stroke-width="2.5"/>
    <text x="${LEFT + BAR_W / 2}" y="16" text-anchor="middle" font-size="11" fill="#333333" font-family="sans-serif" font-weight="bold">▼ ±0.00m (Mặt đất)</text>
  `;

  let currentY = 24;
  let accumDepth = 0;

  layers.forEach((layer, idx) => {
    const layerH = layer.day ? layer.day * SCALE : lastLayerHeight * SCALE;
    const pat = getSoilPattern(layer.ten);

    // Hình chữ nhật từng lớp đất
    svgContent += `
      <rect x="${LEFT}" y="${currentY}" width="${BAR_W}" height="${layerH}" fill="${pat}" stroke="#444444" stroke-width="1.2"/>
    `;

    // Tên lớp đất ở giữa
    const midY = currentY + layerH / 2;
    svgContent += `
      <rect x="${LEFT + 10}" y="${midY - 14}" width="${BAR_W - 20}" height="28" rx="4" fill="rgba(255,255,255,0.85)"/>
      <text x="${LEFT + BAR_W / 2}" y="${midY - 2}" text-anchor="middle" font-size="11" fill="#0D47A1" font-family="sans-serif" font-weight="bold">Lớp ${idx + 1}: ${layer.ten}</text>
    `;

    // Chỉ tiêu cơ lý
    const ct = layer.chiTieu || {};
    let ctStr = '';
    if (ct.w !== undefined) ctStr = `w=${ct.w}% wL=${ct.wL}% wP=${ct.wP}%`;
    else if (ct.NSPT !== undefined) ctStr = `NSPT = ${ct.NSPT}`;
    if (ct.qc !== undefined) ctStr += (ctStr ? ' · ' : '') + `qc = ${ct.qc} MPa`;

    svgContent += `
      <text x="${LEFT + BAR_W / 2}" y="${midY + 10}" text-anchor="middle" font-size="9.5" fill="#37474F" font-family="monospace">${ctStr}</text>
    `;

    // Mốc chiều sâu bên trái
    accumDepth += (layer.day || 0);
    const bottomY = currentY + layerH;

    if (layer.day) {
      svgContent += `
        <line x1="${LEFT - 8}" y1="${bottomY}" x2="${LEFT}" y2="${bottomY}" stroke="#546E7A" stroke-width="1.5"/>
        <text x="${LEFT - 12}" y="${bottomY + 4}" text-anchor="end" font-size="10.5" fill="#37474F" font-family="monospace" font-weight="bold">-${accumDepth.toFixed(1)}m</text>
        <text x="${LEFT + BAR_W + 6}" y="${midY + 3}" text-anchor="start" font-size="10" fill="#546E7A" font-family="sans-serif">h${idx + 1}=${layer.day}m</text>
      `;
    } else {
      // Lớp cuối cùng kéo dài vô cùng
      svgContent += `
        <line x1="${LEFT}" y1="${bottomY}" x2="${LEFT + BAR_W}" y2="${bottomY}" stroke="#78909C" stroke-width="1.5" stroke-dasharray="5,4"/>
        <text x="${LEFT + BAR_W / 2}" y="${bottomY + 14}" text-anchor="middle" font-size="11" fill="#78909C" font-family="sans-serif">∞</text>
      `;
    }

    // Badge đánh giá sau khi kiểm tra Bước 1/2
    if (showBadges && step1Detail && step1Detail.results && step1Detail.results[idx]) {
      const res = step1Detail.results[idx];
      const icon = (res.nameOk && res.stateOk) ? '✅' : (res.nameOk || res.stateOk ? '⚠️' : '❌');
      svgContent += `
        <text x="${LEFT + BAR_W - 8}" y="${midY - 2}" text-anchor="end" font-size="16">${icon}</text>
      `;
    }

    currentY += layerH;
  });

  const svgLayersEl = document.getElementById('svg-layers');
  if (svgLayersEl) {
    svgLayersEl.innerHTML = svgContent;
  }
}

// ── KHỞI TẠO BÀI LÀM (INITIALIZE QUIZ) ──
function initQuiz(question) {
  if (!question) return;
  currentQuestion = question;
  currentStepIndex = 1;
  stepScoreState = { s1: 0, s2: 0, s3: 0, s4: 0 };
  stepDoneState = [false, false, false, false];
  m1Inputs = { s1: [], s2: [], s3: '', s4: null };
  step1Detail = null;
  step2Detail = null;
  isGradingCompleted = false;

  // Render header info
  const titleEl = document.getElementById('quiz-title');
  if (titleEl) titleEl.textContent = question.title;

  const typeEl = document.getElementById('quiz-type-badge');
  if (typeEl) {
    typeEl.textContent = question.buoc === 2 ? 'Dạng CLO (Phân tích C4)' : 'Dạng Thuận (Phương án)';
  }

  // Render SVG Trụ địa chất
  renderSoilProfileSVG(question, false);

  // Render Step 1
  renderStep1Form(question);

  // Render Step 2
  renderStep2Form(question);

  // Render Step 3
  renderStep3Form(question);

  // Render Step 4 (Thuận hoặc CLO C4)
  if (question.buoc === 2) {
    renderStep4CLOForm(question);
  } else {
    renderStep4ThuanForm(question);
  }

  // Chuyển sang Bước 1
  navigateToStep(1);
}

// ── ĐIỀU HƯỚNG BƯỚC (STEP NAVIGATION) ──
function navigateToStep(stepNum) {
  currentStepIndex = stepNum;

  // Cập nhật panels
  for (let i = 1; i <= 4; i++) {
    const p = document.getElementById(`step${i}-panel`);
    if (p) p.classList.toggle('active', i === stepNum);

    const dot = document.getElementById(`step-dot-${i}`);
    if (dot) {
      dot.className = 'step-dot' + (i < stepNum ? ' done' : (i === stepNum ? ' active' : ''));
    }
  }

  const stepLabels = [
    'Bước 1: Xác định tên đất & trạng thái từng lớp',
    'Bước 2: Đánh giá chất lượng lớp đất (Tốt / Xấu)',
    'Bước 3: Xác định dạng địa tầng tổng thể',
    currentQuestion && currentQuestion.buoc === 2
      ? 'Bước 4: Phân tích, so sánh phương án theo chuẩn CLO (C4)'
      : 'Bước 4: Đề xuất phương án móng cho 3 cấp tải trọng'
  ];

  const labelEl = document.getElementById('step-tracker-text');
  if (labelEl) labelEl.textContent = stepLabels[stepNum - 1];

  // Cuộn mượt lên đầu khung câu hỏi trên mobile
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── STEP 1: FORM & CHECK ──
const SOIL_NAMES = [
  'Sét', 'Sét pha', 'Cát pha', 'Cát bụi', 'Cát hạt mịn', 'Cát hạt nhỏ',
  'Cát hạt vừa', 'Cát hạt trung', 'Cát hạt thô', 'Cát sỏi', 'Cuội sỏi', 'Cuội sỏi lẫn cát',
  'Bùn sét', 'Bùn sét pha', 'Bùn cát pha'
];

const SOIL_STATES = [
  'Chảy', 'Dẻo chảy', 'Dẻo mềm', 'Nửa cứng', 'Cứng', 'Rất cứng',
  'Rất rời', 'Rời', 'Chặt vừa', 'Chặt', 'Rất chặt'
];

function renderStep1Form(question) {
  const container = document.getElementById('step1-layers-container');
  if (!container) return;

  let html = '';
  question.layers.forEach((l, i) => {
    const ct = l.chiTieu || {};
    let ctStr = '';
    if (ct.w !== undefined) ctStr = `w = ${ct.w}%, wL = ${ct.wL}%, wP = ${ct.wP}%`;
    else if (ct.NSPT !== undefined) ctStr = `NSPT = ${ct.NSPT}`;
    if (ct.qc !== undefined) ctStr += (ctStr ? ' · ' : '') + `qc = ${ct.qc} MPa`;

    html += `
      <div class="layer-card-item" id="step1-layer-${i}">
        <div class="layer-item-head">
          <span class="layer-item-title">Lớp ${i + 1}: ${l.ten} (${l.day ? `dày ${l.day}m` : 'kéo dài'})</span>
          <span class="badge badge-primary" id="step1-badge-${i}">Chưa kiểm tra</span>
        </div>
        <div class="layer-item-props">📊 Chỉ tiêu: ${ctStr}</div>
        <div class="layer-select-grid">
          <div class="form-group" style="margin-bottom:0">
            <label class="form-label">Tên phân loại</label>
            <select class="form-select" id="s1-name-${i}">
              <option value="">-- Chọn tên đất --</option>
              ${SOIL_NAMES.map(n => `<option value="${n}">${n}</option>`).join('')}
            </select>
          </div>
          <div class="form-group" style="margin-bottom:0">
            <label class="form-label">Trạng thái đất</label>
            <select class="form-select" id="s1-state-${i}">
              <option value="">-- Chọn trạng thái --</option>
              ${SOIL_STATES.map(s => `<option value="${s}">${s}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="alert alert-info hidden" id="step1-lydo-${i}" style="margin-top:8px;margin-bottom:0"></div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function handleCheckStep1() {
  const q = currentQuestion;
  const userInputs = [];
  let isMissing = false;

  q.layers.forEach((l, i) => {
    const nameVal = document.getElementById(`s1-name-${i}`).value;
    const stateVal = document.getElementById(`s1-state-${i}`).value;
    if (!nameVal || !stateVal) isMissing = true;
    userInputs.push({ ten: nameVal, trangThai: stateVal });
  });

  if (isMissing) {
    showToast('⚠️ Vui lòng chọn đầy đủ tên và trạng thái cho cả 4 lớp đất!');
    return;
  }

  m1Inputs.s1 = userInputs;
  const maxScore = (q.buoc === 2) ? 20 : 30;
  step1Detail = gradeStep1(q.layers, userInputs, maxScore);
  stepScoreState.s1 = step1Detail.score;
  stepDoneState[0] = true;

  // Cập nhật giao diện từng lớp
  step1Detail.results.forEach((res, i) => {
    const card = document.getElementById(`step1-layer-${i}`);
    const badge = document.getElementById(`step1-badge-${i}`);
    const lydo = document.getElementById(`step1-lydo-${i}`);

    if (res.nameOk && res.stateOk) {
      card.className = 'layer-card-item correct';
      badge.className = 'badge badge-pass';
      badge.textContent = `✅ Đúng (+${res.earnedScore}đ)`;
    } else if (res.nameOk || res.stateOk) {
      card.className = 'layer-card-item partial';
      badge.className = 'badge badge-warning';
      badge.textContent = `⚠️ Đúng 1 phần (+${res.earnedScore}đ)`;
    } else {
      card.className = 'layer-card-item wrong';
      badge.className = 'badge badge-fail';
      badge.textContent = '❌ Sai (0đ)';
    }

    lydo.classList.remove('hidden');
    lydo.innerHTML = `💡 <b>Đáp án chuẩn:</b> ${res.expectedName} – ${res.expectedState}<br><small>${res.lyDo}</small>`;

    document.getElementById(`s1-name-${i}`).disabled = true;
    document.getElementById(`s1-state-${i}`).disabled = true;
  });

  // Cập nhật SVG Soil Profile với icon kết quả
  renderSoilProfileSVG(q, true);

  // Hiển thị feedback tổng
  const fb = document.getElementById('step1-feedback');
  if (fb) {
    fb.className = `alert ${step1Detail.score >= maxScore * 0.8 ? 'alert-success' : 'alert-warning'}`;
    fb.classList.remove('hidden');
    fb.innerHTML = `🎯 <b>Điểm Bước 1:</b> ${step1Detail.score}/${maxScore} điểm. Đã mở khóa Bước 2!`;
  }

  const btn = document.getElementById('btn-check-step1');
  if (btn) {
    btn.textContent = '▶ Chuyển sang Bước 2';
    btn.className = 'btn btn-success btn-block';
    btn.onclick = () => navigateToStep(2);
  }
}

// ── STEP 2: FORM & CHECK ──
function renderStep2Form(question) {
  const container = document.getElementById('step2-layers-container');
  if (!container) return;

  let html = '';
  question.layers.forEach((l, i) => {
    html += `
      <div class="layer-card-item" id="step2-layer-${i}">
        <div class="layer-item-head">
          <span class="layer-item-title">Lớp ${i + 1}: ${l.ten}</span>
          <span class="badge badge-primary" id="step2-badge-${i}">Chưa kiểm tra</span>
        </div>
        <div class="radio-group-box">
          <label class="radio-btn-label">
            <input type="radio" name="s2-good-${i}" value="true">
            <span>✅ Lớp đất TỐT (T)</span>
          </label>
          <label class="radio-btn-label">
            <input type="radio" name="s2-good-${i}" value="false">
            <span>❌ Lớp đất YẾU (X)</span>
          </label>
        </div>
        <div class="alert alert-info hidden" id="step2-lydo-${i}" style="margin-top:8px;margin-bottom:0"></div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function handleCheckStep2() {
  const q = currentQuestion;
  const userInputs = [];
  let isMissing = false;

  q.layers.forEach((l, i) => {
    const radio = document.querySelector(`input[name="s2-good-${i}"]:checked`);
    if (!radio) isMissing = true;
    userInputs.push(radio ? radio.value === 'true' : null);
  });

  if (isMissing) {
    showToast('⚠️ Vui lòng đánh giá Tốt / Yếu cho tất cả 4 lớp đất!');
    return;
  }

  m1Inputs.s2 = userInputs;
  step2Detail = gradeStep2(q.layers, userInputs, 10);
  stepScoreState.s2 = step2Detail.score;
  stepDoneState[1] = true;

  step2Detail.results.forEach((res, i) => {
    const card = document.getElementById(`step2-layer-${i}`);
    const badge = document.getElementById(`step2-badge-${i}`);
    const lydo = document.getElementById(`step2-lydo-${i}`);

    if (res.isCorrect) {
      card.className = 'layer-card-item correct';
      badge.className = 'badge badge-pass';
      badge.textContent = `✅ Đúng (+${res.earnedScore}đ)`;
    } else {
      card.className = 'layer-card-item wrong';
      badge.className = 'badge badge-fail';
      badge.textContent = '❌ Sai (0đ)';
    }

    lydo.classList.remove('hidden');
    lydo.innerHTML = `💡 <b>Đánh giá:</b> ${res.expectedGood ? 'TỐT (T)' : 'YẾU (X)'} — ${res.lyDo}`;

    document.querySelectorAll(`input[name="s2-good-${i}"]`).forEach(r => r.disabled = true);
  });

  // Tự động gợi ý sơ đồ địa tầng ở Bước 3
  const suggestedPattern = step2Detail.results.map(r => r.expectedGood ? 'T' : 'X').join('-');
  const suggestEl = document.getElementById('step3-pattern-suggest');
  if (suggestEl) {
    suggestEl.innerHTML = `💡 <b>Gợi ý từ kết quả Bước 2:</b> Sơ đồ địa tầng chuẩn là <code>${suggestedPattern}</code>`;
  }

  const fb = document.getElementById('step2-feedback');
  if (fb) {
    fb.className = 'alert alert-success';
    fb.classList.remove('hidden');
    fb.innerHTML = `🎯 <b>Điểm Bước 2:</b> ${step2Detail.score}/10 điểm. Đã mở khóa Bước 3!`;
  }

  const btn = document.getElementById('btn-check-step2');
  if (btn) {
    btn.textContent = '▶ Chuyển sang Bước 3';
    btn.className = 'btn btn-success btn-block';
    btn.onclick = () => navigateToStep(3);
  }
}

// ── STEP 3: FORM & CHECK ──
function renderStep3Form(question) {
  const sel = document.getElementById('sel-pattern');
  if (sel) {
    sel.value = '';
    sel.disabled = false;
  }
}

function handleCheckStep3() {
  const q = currentQuestion;
  const sel = document.getElementById('sel-pattern');
  if (!sel || !sel.value) {
    showToast('⚠️ Vui lòng chọn sơ đồ địa tầng tổng thể!');
    return;
  }

  m1Inputs.s3 = sel.value;
  const res = gradeStep3(q.dang || q.answer.pattern, sel.value, 10);
  stepScoreState.s3 = res.score;
  stepDoneState[2] = true;
  sel.disabled = true;

  const fb = document.getElementById('step3-feedback');
  if (fb) {
    fb.className = `alert ${res.isCorrect ? 'alert-success' : 'alert-danger'}`;
    fb.classList.remove('hidden');
    fb.innerHTML = res.isCorrect
      ? `✅ <b>Chính xác!</b> Sơ đồ địa tầng <b>${res.expectedPattern}</b> nhận trọn 10 điểm.`
      : `❌ <b>Chưa đúng!</b> Sơ đồ địa tầng đúng là <b>${res.expectedPattern}</b> (bạn đã chọn ${res.givenPattern}).`;
  }

  const btn = document.getElementById('btn-check-step3');
  if (btn) {
    btn.textContent = '▶ Chuyển sang Bước 4 (Quyết định)';
    btn.className = 'btn btn-success btn-block';
    btn.onclick = () => navigateToStep(4);
  }
}

// ── STEP 4: FORM THUẬN ──
function renderStep4ThuanForm(question) {
  const formArea = document.getElementById('step4-form-container');
  if (!formArea) return;

  const tt = question.taiTrong || { nho: 300, trungBinh: 1000, lon: 3000 };

  formArea.innerHTML = `
    <div class="alert alert-info">
      ⚡ <b>3 Cấp tải trọng chân cột tính toán:</b><br>
      • Tải nhỏ (nhà 2-3 tầng): <b>N = ${tt.nho} kN</b><br>
      • Tải trung bình (nhà 5-7 tầng): <b>N = ${tt.trungBinh} kN</b><br>
      • Tải lớn (nhà 10-15 tầng): <b>N = ${tt.lon} kN</b>
    </div>

    <div class="form-group">
      <label class="form-label">1. Tải trọng NHỎ (N = ${tt.nho} kN)</label>
      <select class="form-select" id="s4-opt-nho">
        <option value="">-- Chọn giải pháp móng --</option>
        ${FOUNDATION_OPTIONS.nho.map((o, i) => `<option value="${i}">${o}</option>`).join('')}
      </select>
    </div>

    <div class="form-group">
      <label class="form-label">2. Tải trọng TRUNG BÌNH (N = ${tt.trungBinh} kN)</label>
      <select class="form-select" id="s4-opt-tb">
        <option value="">-- Chọn giải pháp móng --</option>
        ${FOUNDATION_OPTIONS.trungBinh.map((o, i) => `<option value="${i}">${o}</option>`).join('')}
      </select>
    </div>

    <div class="form-group">
      <label class="form-label">3. Tải trọng LỚN (N = ${tt.lon} kN)</label>
      <select class="form-select" id="s4-opt-lon">
        <option value="">-- Chọn giải pháp móng --</option>
        ${FOUNDATION_OPTIONS.lon.map((o, i) => `<option value="${i}">${o}</option>`).join('')}
      </select>
    </div>

    <div class="alert alert-info hidden" id="step4-feedback"></div>
    <button class="btn btn-primary btn-block" id="btn-check-step4" onclick="handleCheckStep4Thuan()">
      🏁 Kiểm tra & Hoàn thành bài làm (50đ)
    </button>
  `;
}

function handleCheckStep4Thuan() {
  const q = currentQuestion;
  const optNho = document.getElementById('s4-opt-nho').value;
  const optTb = document.getElementById('s4-opt-tb').value;
  const optLon = document.getElementById('s4-opt-lon').value;

  if (optNho === '' || optTb === '' || optLon === '') {
    showToast('⚠️ Vui lòng chọn giải pháp móng cho cả 3 cấp tải trọng!');
    return;
  }

  m1Inputs.s4 = { nho: optNho, trungBinh: optTb, lon: optLon };
  const expSols = q.answer.solutions || { nho: 0, trungBinh: 0, lon: 0 };
  const res = gradeStep4Thuan(expSols, { nho: optNho, trungBinh: optTb, lon: optLon }, 50);
  stepScoreState.s4 = res.score;
  stepDoneState[3] = true;

  ['s4-opt-nho', 's4-opt-tb', 's4-opt-lon'].forEach(id => {
    document.getElementById(id).disabled = true;
  });

  const fb = document.getElementById('step4-feedback');
  if (fb) {
    fb.className = 'alert alert-info';
    fb.classList.remove('hidden');
    fb.innerHTML = `
      <b>Kết quả Bước 4:</b> ${res.score}/50 điểm<br>
      • Tải nhỏ: ${res.detail.nho.isCorrect ? '✅ Đúng' : '❌ Sai'} (ĐA chuẩn: ${FOUNDATION_OPTIONS.nho[expSols.nho]})<br>
      • Tải TB: ${res.detail.trungBinh.isCorrect ? '✅ Đúng' : '❌ Sai'} (ĐA chuẩn: ${FOUNDATION_OPTIONS.trungBinh[expSols.trungBinh]})<br>
      • Tải lớn: ${res.detail.lon.isCorrect ? '✅ Đúng' : '❌ Sai'} (ĐA chuẩn: ${FOUNDATION_OPTIONS.lon[expSols.lon]})<br>
      <hr style="margin:8px 0;border:0;border-top:1px solid #BBDEFB">
      💡 <b>Lời giải kỹ thuật:</b> ${q.answer.explanation ? q.answer.explanation.b4 : ''}
    `;
  }

  finishQuiz();
}

// ── STEP 4: FORM CLO C4 (TỰ LUẬN + RUBRIC) ──
function renderStep4CLOForm(question) {
  const formArea = document.getElementById('step4-form-container');
  if (!formArea) return;

  const clo = question.cloQuestion || { context: '', subQuestions: [] };
  const mcq = (window.M1_CLO || {})[question.id] || [];
  const mcqHtml = mcq.map((x, i) => `
      <div class="sub-question-card">
        <label class="sub-q-label">Câu ${i + 1}. ${x.q}</label>
        ${x.o.map((t, k) => `<label style="display:flex;gap:8px;align-items:flex-start;margin:6px 0;cursor:pointer"><input type="radio" name="clo-mcq-${i}" value="${k}" style="margin-top:4px"> <span>${t}</span></label>`).join('')}
      </div>`).join('');

  formArea.innerHTML = `
    <div class="clo-question-box">
      📋 <b>Tình huống kỹ thuật CLO (C4 - Phân tích):</b><br>
      ${clo.context}
    </div>

    ${mcqHtml}

    <div class="alert alert-info hidden" id="step4-feedback"></div>
    <button class="btn btn-primary btn-block" id="btn-check-step4" style="margin-top:14px" onclick="handleCheckStep4CLO()">
      🏁 Nộp bài phân tích CLO (60đ, mỗi câu 15đ)
    </button>
  `;
}

function handleCheckStep4CLO() {
  const q = currentQuestion;
  const mcq = (window.M1_CLO || {})[q.id] || [];
  const picked = [];
  let isMissing = false;
  mcq.forEach((x, i) => {
    const r = document.querySelector(`input[name="clo-mcq-${i}"]:checked`);
    if (!r) isMissing = true;
    picked.push(r ? parseInt(r.value) : -1);
  });
  if (isMissing) {
    showToast('⚠️ Vui lòng trả lời đủ các câu trắc nghiệm trước khi nộp!');
    return;
  }
  m1Inputs.s4 = picked;
  const ok = mcq.filter((x, i) => picked[i] === x.a).length;
  stepScoreState.s4 = mcq.length ? Math.round(60 * ok / mcq.length * 10) / 10 : 0;
  stepDoneState[3] = true;

  mcq.forEach((x, i) => document.querySelectorAll(`input[name="clo-mcq-${i}"]`).forEach(r => r.disabled = true));

  const fb = document.getElementById('step4-feedback');
  if (fb) {
    fb.className = 'alert alert-info';
    fb.classList.remove('hidden');
    fb.innerHTML = `
      <b>Kết quả Bước 4:</b> ${stepScoreState.s4}/60 điểm (${ok}/${mcq.length} câu đúng)<br>
      ${mcq.map((x, i) => `• Câu ${i + 1}: ${picked[i] === x.a ? '✅ Đúng' : '❌ Sai'} — đáp án: ${x.o[x.a]}`).join('<br>')}
      <hr style="margin:8px 0;border:0;border-top:1px solid #BBDEFB">
      📖 <b>Lời giải mẫu:</b><br>
      • ${q.answer.modelAnalysis ? q.answer.modelAnalysis.a : ''}<br>
      • ${q.answer.modelAnalysis ? q.answer.modelAnalysis.b : ''}
    `;
  }

  finishQuiz();
}

// ── HOÀN TẤT BÀI LÀM & TỔNG KẾT ĐIỂM ──
function finishQuiz() {
  isGradingCompleted = true;
  const q = currentQuestion;
  const totalScore = Math.round(stepScoreState.s1 + stepScoreState.s2 + stepScoreState.s3 + stepScoreState.s4);
  const passThreshold = (window.APP_CONFIG && window.APP_CONFIG.PASS_SCORE) || 80;
  const isPass = totalScore >= passThreshold;

  // Gửi điểm lên server & lưu LocalStorage
  const payload = {
    module: q.module || 1,
    baiId: q.id,
    dang: 'grade_m1',
    buoc: q.buoc,
    score: totalScore,
    detail: {
      qId: q.id,
      inputs: m1Inputs,
      step1: stepScoreState.s1,
      step2: stepScoreState.s2,
      step3: stepScoreState.s3,
      step4: stepScoreState.s4,
      isPass
    }
  };

  let shown = false;
  const showOnce = (sc, pass) => { if (shown) return; shown = true; showResultModal(sc, pass); };
  submitScoreToServer(payload).then(res => {
    showToast(res.message, 4000);
    if (res.server && res.server.steps) {                      // điểm chính thức do máy chủ tính
      stepScoreState = Object.assign({}, res.server.steps);
      const t = res.server.score100;
      saveScoreLocally(q.module || 1, q.id, t, { official: true });
      showOnce(t, t >= passThreshold);
    }
  });

  const checkBtn = document.getElementById('btn-check-step4');
  if (checkBtn) {
    checkBtn.textContent = '📊 Xem bảng điểm tổng kết';
    checkBtn.className = 'btn btn-success btn-block';
    checkBtn.onclick = () => showResultModal(totalScore, isPass);
  }

  setTimeout(() => {
    showOnce(totalScore, isPass);                              // offline hoặc máy chủ chậm: hiện điểm tạm tính ở trình duyệt
  }, 4000);
}

function showResultModal(totalScore, isPass) {
  const modal = document.getElementById('result-modal');
  if (!modal) {
    window.location.href = `result.html?q=${currentQuestion.id}&score=${totalScore}`;
    return;
  }

  document.getElementById('modal-score-num').textContent = totalScore;
  document.getElementById('modal-verdict').innerHTML = isPass
    ? '<span class="text-success">🎉 XUẤT SẮC – ĐẠT CHUẨN ĐẦU RA!</span>'
    : '<span class="text-danger">⚠️ CHƯA ĐẠT (Cần ≥ 80 điểm)</span>';

  document.getElementById('modal-s1-pts').textContent = `${stepScoreState.s1}đ`;
  document.getElementById('modal-s2-pts').textContent = `${stepScoreState.s2}đ`;
  document.getElementById('modal-s3-pts').textContent = `${stepScoreState.s3}đ`;
  document.getElementById('modal-s4-pts').textContent = `${stepScoreState.s4}đ`;

  modal.classList.add('show');
}

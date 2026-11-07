// ═══════════════════════════════════════════════════════════════════
//  scoring.js — Geotechnical Classification & Quiz Scoring Engine
//  Đại học Xây dựng Hà Nội — Bộ môn Cơ học đất – Nền móng
// ═══════════════════════════════════════════════════════════════════

// ── BÙN (ƯU TIÊN KIỂM TRA TRƯỚC HẾT) ──
function laBun(layer) {
  const name = (layer.ten || '').toLowerCase();
  const ct = layer.chiTieu || {};

  if (name.includes('bùn')) return true;
  if (ct.NSPT !== undefined && ct.NSPT < 2) return true;
  if (ct.qc !== undefined && ct.qc < 0.5) return true;
  if (ct.w !== undefined && ct.wL !== undefined && ct.w > ct.wL) return true;
  return false;
}

// ── ĐẤT DÍNH (THEO TCVN 9362:2012) ──
function phanLoaiDatDinh(w, wL, wP) {
  const A = wL - wP; // Chỉ số dẻo (%)
  const B = A > 0 ? (w - wP) / A : 0; // Chỉ số sệt

  // Xác định tên đất theo A
  let ten;
  if (A > 17)      ten = "Sét";
  else if (A >= 7) ten = "Sét pha";
  else             ten = "Cát pha";

  // Xác định trạng thái theo B
  let trangThai, tot;
  if (B > 1.0)        { trangThai = "Chảy";      tot = false; }
  else if (B > 0.5)   { trangThai = "Dẻo chảy";  tot = false; }
  else if (B > 0.25)  { trangThai = "Dẻo mềm";   tot = false; }
  else if (B > 0)     { trangThai = "Nửa cứng";  tot = true;  }
  else if (B > -0.5)  { trangThai = "Cứng";       tot = true;  }
  else                { trangThai = "Rất cứng";   tot = true;  }

  return {
    A: parseFloat(A.toFixed(1)),
    B: parseFloat(B.toFixed(2)),
    ten,
    trangThai,
    tot
  };
}

// ── ĐẤT RỜI THEO NSPT (TCVN) ──
function phanLoaiCatNSPT(NSPT) {
  if (NSPT < 4)   return { trangThai: "Rất rời",   tot: false };
  if (NSPT < 10)  return { trangThai: "Rời",        tot: false };
  if (NSPT < 30)  return { trangThai: "Chặt vừa",  tot: true  };
  if (NSPT < 50)  return { trangThai: "Chặt",       tot: true  };
  return                 { trangThai: "Rất chặt",  tot: true  };
}

// ── ĐẤT RỜI THEO CPT qc (MPa) ──
function phanLoaiCatQc(qc) {
  if (qc < 4)   return { trangThai: "Rất rời / Rời", tot: false };
  if (qc < 12)  return { trangThai: "Chặt vừa",      tot: true  };
  if (qc < 20)  return { trangThai: "Chặt",           tot: true  };
  return               { trangThai: "Rất chặt",      tot: true  };
}

// ── PHÂN LOẠI TỔNG HỢP 1 LỚP ĐẤT ──
function phanLoaiLopDat(layer) {
  const ct = layer.chiTieu || {};

  // 1. Kiểm tra Bùn trước
  if (laBun(layer)) {
    return {
      ten: layer.ten,
      trangThai: "Chảy",
      tot: false,
      isBun: true,
      lyDo: "Bùn có NSPT < 2 hoặc qc < 0.5 MPa (hoặc w > wL) → Trạng thái chảy, đất rất yếu"
    };
  }

  // 2. Kiểm tra đất dính (có đủ w, wL, wP)
  if (ct.w !== undefined && ct.wL !== undefined && ct.wP !== undefined) {
    const res = phanLoaiDatDinh(ct.w, ct.wL, ct.wP);
    const tenChuan = layer.ten || res.ten;
    const lyDo = `A = wL - wP = ${res.A}% (${res.ten}); B = (w - wP)/A = ${res.B} → ${res.trangThai} (${res.tot ? 'Tốt' : 'Yếu'})`;
    return {
      ten: tenChuan,
      trangThai: res.trangThai,
      tot: res.tot,
      A: res.A,
      B: res.B,
      lyDo
    };
  }

  // 3. Kiểm tra đất rời theo NSPT
  if (ct.NSPT !== undefined) {
    const res = phanLoaiCatNSPT(ct.NSPT);
    const lyDo = `NSPT = ${ct.NSPT} → ${res.trangThai} (${res.tot ? 'Tốt' : 'Yếu'})`;
    return {
      ten: layer.ten,
      trangThai: res.trangThai,
      tot: res.tot,
      lyDo
    };
  }

  // 4. Kiểm tra đất rời theo qc
  if (ct.qc !== undefined) {
    const res = phanLoaiCatQc(ct.qc);
    const lyDo = `qc = ${ct.qc} MPa → ${res.trangThai} (${res.tot ? 'Tốt' : 'Yếu'})`;
    return {
      ten: layer.ten,
      trangThai: res.trangThai,
      tot: res.tot,
      lyDo
    };
  }

  return {
    ten: layer.ten,
    trangThai: "Không xác định",
    tot: false,
    lyDo: "Không đủ chỉ tiêu để phân loại"
  };
}

// ── XỬ LÝ TỪ ĐỒNG NGHĨA KỸ THUẬT ──
const SYNONYMS_TEN = {
  "sét": ["sét"],
  "sét pha": ["sét pha", "á sét"],
  "á sét": ["sét pha", "á sét"],
  "cát pha": ["cát pha", "á cát"],
  "á cát": ["cát pha", "á cát"],
  "bùn sét": ["bùn sét", "bùn", "bùn sét pha"],
  "bùn sét pha": ["bùn sét pha", "bùn sét", "bùn"]
};

function checkTenDongNghia(chuan, input) {
  if (!input) return false;
  const c = chuẩnHóaChuỗi(chuan);
  const inp = chuẩnHóaChuỗi(input);
  if (c === inp) return true;

  const syns = SYNONYMS_TEN[c];
  if (syns && syns.some(s => chuẩnHóaChuỗi(s) === inp)) return true;

  return c.includes(inp) || inp.includes(c);
}

function checkTrangThaiDongNghia(chuan, input) {
  if (!input) return false;
  const c = chuẩnHóaChuỗi(chuan);
  const inp = chuẩnHóaChuỗi(input);
  if (c === inp) return true;

  // Chảy <-> Dẻo chảy
  if ((c === "dẻo chảy" || c === "chảy") && (inp === "dẻo chảy" || inp === "chảy")) return true;
  // Nửa cứng <-> Cứng
  if (c.includes("nửa cứng") && inp.includes("nửa cứng")) return true;
  if (c.includes("chặt vừa") && inp.includes("chặt vừa")) return true;
  if (c.includes("rất rời") && (inp.includes("rất rời") || inp.includes("rời"))) return true;

  return false;
}

function chuẩnHóaChuỗi(str) {
  return (str || '').toLowerCase().trim().replace(/\s+/g, ' ');
}

// ── BẢNG TÙY CHỌN PHƯƠNG ÁN MÓNG (BƯỚC 4 THUẬN) ──
const FOUNDATION_OPTIONS = {
  nho: [
    "Móng nông trong lớp 1 (nền tự nhiên)",
    "Móng nông trong lớp 2 (bỏ qua lớp 1 yếu)",
    "Móng nông lớp 1-2 (nền tự nhiên)",
    "Đệm cát thay thế lớp yếu + móng nông",
    "Gia cố nền (cọc đất-XM) + móng nông",
    "Móng cọc ngắn vào lớp 3"
  ],
  trungBinh: [
    "Móng nông trong lớp 1 (kiểm tra ảnh hưởng lớp yếu)",
    "Móng nông trong lớp 2 (bỏ qua lớp 1 yếu)",
    "Móng nông lớp 1-2 (nền tự nhiên)",
    "Gia cố nền hoặc cọc ngắn",
    "Móng cọc mũi vào lớp 3",
    "Móng cọc mũi vào lớp 4"
  ],
  lon: [
    "Móng cọc mũi vào lớp 3 (chặt vừa)",
    "Móng cọc mũi vào lớp 4 (rất chặt/rất tốt)",
    "Móng cọc xuyên qua lớp yếu, mũi vào lớp 4",
    "Cọc khoan nhồi đường kính lớn vào lớp 4",
    "Cọc đất-XM toàn chiều sâu + móng nông"
  ]
};

// ── HÀM CHẤM BƯỚC 1 (30đ hoặc 20đ) ──
function gradeStep1(layers, userInputs, maxScore = 30) {
  const ptsPerLayer = maxScore / layers.length;
  const ptsName = ptsPerLayer * 0.45;
  const ptsState = ptsPerLayer * 0.55;

  let totalScore = 0;
  const results = [];

  layers.forEach((l, i) => {
    const input = userInputs[i] || {};
    const evalData = phanLoaiLopDat(l);

    const nameOk = checkTenDongNghia(evalData.ten, input.ten);
    const stateOk = checkTrangThaiDongNghia(evalData.trangThai, input.trangThai);

    const earned = (nameOk ? ptsName : 0) + (stateOk ? ptsState : 0);
    totalScore += earned;

    results.push({
      layerIndex: i,
      layerNum: i + 1,
      expectedName: evalData.ten,
      expectedState: evalData.trangThai,
      givenName: input.ten || '',
      givenState: input.trangThai || '',
      nameOk,
      stateOk,
      earnedScore: parseFloat(earned.toFixed(1)),
      maxScore: parseFloat(ptsPerLayer.toFixed(1)),
      lyDo: evalData.lyDo
    });
  });

  return {
    score: parseFloat(totalScore.toFixed(1)),
    maxScore,
    results
  };
}

// ── HÀM CHẤM BƯỚC 2 (10đ) ──
function gradeStep2(layers, userInputs, maxScore = 10) {
  const ptsPerLayer = maxScore / layers.length;
  let totalScore = 0;
  const results = [];

  layers.forEach((l, i) => {
    const evalData = phanLoaiLopDat(l);
    const expectedGood = evalData.tot;
    const givenGood = userInputs[i] !== undefined ? userInputs[i] : null;

    const isCorrect = (givenGood === expectedGood);
    const earned = isCorrect ? ptsPerLayer : 0;
    totalScore += earned;

    results.push({
      layerIndex: i,
      expectedGood,
      givenGood,
      isCorrect,
      earnedScore: parseFloat(earned.toFixed(1)),
      lyDo: evalData.lyDo
    });
  });

  return {
    score: parseFloat(totalScore.toFixed(1)),
    maxScore,
    results
  };
}

// ── HÀM CHẤM BƯỚC 3 (10đ) ──
function gradeStep3(expectedPattern, givenPattern, maxScore = 10) {
  const isCorrect = chuẩnHóaChuỗi(expectedPattern) === chuẩnHóaChuỗi(givenPattern);
  return {
    isCorrect,
    expectedPattern,
    givenPattern,
    score: isCorrect ? maxScore : 0,
    maxScore
  };
}

// ── HÀM CHẤM BƯỚC 4 THUẬN (50đ) ──
function gradeStep4Thuan(expectedSolutions, givenSolutions, maxScore = 50) {
  const ptsPerCase = maxScore / 3;
  let total = 0;
  const detail = {};

  ['nho', 'trungBinh', 'lon'].forEach(k => {
    const exp = expectedSolutions[k];
    const giv = parseInt(givenSolutions[k]);
    const ok = (exp === giv);
    const earned = ok ? ptsPerCase : 0;
    total += earned;
    detail[k] = {
      expectedIndex: exp,
      givenIndex: giv,
      isCorrect: ok,
      earned: parseFloat(earned.toFixed(1))
    };
  });

  return {
    score: parseFloat(total.toFixed(1)),
    maxScore,
    detail
  };
}

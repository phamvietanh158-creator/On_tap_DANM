// ═══════════════════════════════════════════════════════════════════
//  app.js — NenMong Quiz Main Coordinator & Dashboard Controller
//  Trường Đại học Xây dựng Hà Nội — Bộ môn Cơ học đất – Nền móng
// ═══════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  const student = getStudent();
  const loginSection = document.getElementById('login-section');
  const dashboardSection = document.getElementById('dashboard-section');

  if (!student || !student.maSV) {
    if (loginSection) loginSection.classList.remove('hidden');
    if (dashboardSection) dashboardSection.classList.add('hidden');
    populateClassSelect();
  } else {
    if (loginSection) loginSection.classList.add('hidden');
    if (dashboardSection) dashboardSection.classList.remove('hidden');
    renderDashboard(student);
  }
}

// ── POPULATE CLASS SELECT DROPDOWN ──
function populateClassSelect() {
  const sel = document.getElementById('login-class');
  if (!sel) return;

  const config = window.APP_CONFIG || {};
  const classList = config.CLASS_LIST || [];

  sel.innerHTML = '<option value="">-- Chọn lớp học phần --</option>' +
    classList.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
}

// ── LOGIN HANDLER ──
function handleLogin(e) {
  if (e) e.preventDefault();

  const name = (document.getElementById('login-name').value || '').trim();
  const mssv = (document.getElementById('login-mssv').value || '').trim();
  const classId = document.getElementById('login-class').value;
  const sode = (document.getElementById('login-sode').value || '').trim();

  if (!name || !mssv || !classId) {
    showToast('⚠️ Vui lòng nhập đầy đủ Họ tên, Mã sinh viên và chọn Lớp!');
    return false;
  }

  // Validate MSSV cơ bản (chữ số)
  if (!/^\d{4,12}$/.test(mssv)) {
    showToast('⚠️ Mã sinh viên phải là dãy số hợp lệ!');
    return false;
  }

  const studentData = {
    maSV: mssv,
    hoTen: name,
    lop: classId,
    soDe: sode,
    loginAt: new Date().toISOString()
  };

  saveStudent(studentData);
  showToast(`Xin chào sinh viên ${name}! Chúc bạn ôn tập tốt.`, 3000);

  initApp();
  return false;
}

// ── LOGOUT HANDLER ──
function handleLogout() {
  if (!confirm('Bạn có chắc chắn muốn đăng xuất tài khoản?')) return;
  clearStudent();
  initApp();
}

// ── RENDER DASHBOARD ──
function renderDashboard(student) {
  const config = window.APP_CONFIG || {};

  // 1. Cập nhật User Info Bar
  const nameEl = document.getElementById('dash-user-name');
  if (nameEl) nameEl.textContent = student.hoTen;

  const metaEl = document.getElementById('dash-user-meta');
  if (metaEl) {
    metaEl.textContent = `MSSV: ${student.maSV} · Lớp: ${student.lop}${student.soDe ? ` · Số đề: ${student.soDe}` : ''}`;
  }

  const avatarEl = document.getElementById('dash-user-avatar');
  if (avatarEl && student.hoTen) {
    avatarEl.textContent = student.hoTen.charAt(0).toUpperCase();
  }

  // 2. Thống kê tổng
  const modules = config.MODULES || [];
  let totalPassed = 0;
  let totalCompletedQuestions = 0;
  let allScores = [];

  // 5 phần xét điều kiện bảo vệ: M1, Móng nông (M2, M3 chung trang), Móng cọc (M4, M5 chung trang), Bản vẽ (M6), Ngân hàng câu hỏi (mã 7).
  // M3, M5 không đếm riêng để khỏi đếm trùng.
  const PARTS = [{ id: 1, ten: 'Module 1' }, { id: 2, ten: 'Móng nông' }, { id: 4, ten: 'Móng cọc' }, { id: 6, ten: 'Bản vẽ' }, { id: 7, ten: 'Ngân hàng câu hỏi' }];
  const partStats = PARTS.map(p => Object.assign({ ten: p.ten, id: p.id }, getModuleStats(p.id)));
  partStats.forEach(st => {
    if (st.isPassed) totalPassed++;
    totalCompletedQuestions += st.completedCount;
    allScores = allScores.concat(Object.values(st.bestScores || {}));
  });

  const avgScore = allScores.length ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : 0;

  const statPassedEl = document.getElementById('stat-modules-passed');
  if (statPassedEl) statPassedEl.textContent = `${totalPassed}/${PARTS.length}`;

  const statAvgEl = document.getElementById('stat-avg-score');
  if (statAvgEl) statAvgEl.textContent = allScores.length ? `${avgScore}đ` : '—';

  const statCountEl = document.getElementById('stat-questions-count');
  if (statCountEl) statCountEl.textContent = totalCompletedQuestions;

  // Tình trạng điều kiện bảo vệ (theo dữ liệu trên máy này; bảng chính thức là tab TongHop trong Google Sheet)
  const defEl = document.getElementById('defense-status');
  if (defEl) {
    const thieu = partStats.filter(st => !st.isPassed);
    defEl.className = 'alert ' + (thieu.length ? 'alert-warning' : 'alert-success');
    defEl.innerHTML = thieu.length
      ? '<b>Chưa đủ điều kiện bảo vệ.</b> Cần đạt ≥ ' + ((config.PASS_SCORE) || 80) + ' điểm ở cả ' + PARTS.length + ' phần. Còn thiếu: ' + thieu.map(st => st.ten + (st.id === 1 ? ' (mới ' + st.soBaiDat + '/' + st.minBai + ' bài ≥ 80)' : (st.completedCount ? ' (cao nhất ' + st.maxScore + 'đ)' : ' (chưa làm)'))).join('; ') + '.'
      : '<b>🎉 Đã đủ điều kiện bảo vệ</b> (cả ' + PARTS.length + ' phần đều ≥ ' + ((config.PASS_SCORE) || 80) + ' điểm trên máy này). Giảng viên xác nhận theo bảng điểm chính thức.';
  }
  const bankEl = document.getElementById('bank-status');
  if (bankEl) {
    const bk = partStats[4];
    bankEl.innerHTML = bk.isPassed ? '<span class="text-success">✅ Đã đạt chuẩn (cao nhất ' + bk.maxScore + 'đ)</span>' : (bk.completedCount ? 'Điểm cao nhất ' + bk.maxScore + 'đ / cần ≥ ' + ((config.PASS_SCORE) || 80) : 'Chưa nộp bài');
  }

  // 3. Render 6 Module Cards
  const gridEl = document.getElementById('modules-grid-container');
  if (!gridEl) return;

  let gridHtml = '';
  modules.forEach(mod => {
    const stats = getModuleStats(mod.id);
    // M1 làm đủ bộ 15 bài; M2–M6 mỗi sinh viên chỉ có 1 đề theo số đề, nên % tính theo điểm cao nhất so với ngưỡng đạt.
    const passScore = (config.PASS_SCORE || 80);
    const pct = mod.id === 1
      ? Math.min(100, Math.round((stats.soBaiDat / stats.minBai) * 100))
      : (stats.isPassed ? 100 : (stats.completedCount > 0 ? Math.min(99, Math.round((stats.maxScore / passScore) * 100)) : 0));
    const progressLabel = mod.id === 1
      ? `Đạt ${stats.soBaiDat}/${stats.minBai} bài ≥ ${passScore}đ (đã làm ${stats.completedCount}/${mod.totalQuestions} bài)`
      : (stats.isPassed ? 'Đã đạt chuẩn' : (stats.completedCount > 0 ? `Điểm cao nhất ${stats.maxScore}/${passScore}` : 'Chưa nộp bài'));

    let statusPill = '<span class="status-pill status-empty">⚪ Chưa luyện tập</span>';
    if (stats.isPassed) {
      statusPill = '<span class="status-pill status-pass">✅ ĐẠT CHUẨN (≥80đ)</span>';
    } else if (stats.completedCount > 0) {
      statusPill = `<span class="status-pill status-fail">⚠️ Điểm cao nhất: ${stats.maxScore}đ</span>`;
    }

    gridHtml += `
      <div class="module-card ${!mod.active ? 'locked' : ''}">
        <div class="module-card-head">
          <div class="module-icon-badge">${mod.code}</div>
          <div class="module-head-info">
            <h3 class="module-title">Module ${mod.id}: ${mod.title}</h3>
            <span class="module-clo-tag">🎯 ${mod.clo} · ${mod.bloom}</span>
          </div>
        </div>

        <p class="module-desc">${mod.desc}</p>

        <div class="module-progress-box">
          <div class="progress-meta">
            <span>${progressLabel}</span>
            <span>${pct}%</span>
          </div>
          <div class="progress-bar-track">
            <div class="progress-bar-fill" style="width: ${pct}%"></div>
          </div>
        </div>

        <div class="module-subtypes">
          ${(mod.subTypes || []).map(st => `<span class="subtype-pill">📌 ${st.name} (${st.count} bài)</span>`).join('')}
        </div>

        <div class="module-card-footer">
          <div>${statusPill}</div>
          <div>
            <button class="btn btn-primary btn-sm" onclick="startModulePractice(${mod.id})">
              🚀 Vào luyện tập
            </button>
          </div>
        </div>
      </div>
    `;
  });

  gridEl.innerHTML = gridHtml;

  // 4. Lịch sử làm bài
  renderHistoryList();
}

// ── BẮT ĐẦU LUYỆN TẬP MODULE ──
function startModulePractice(moduleId, type = null) {
  // M2, M3 → trang Móng nông; M4, M5 → Móng cọc; M6 → Đọc bản vẽ (trang mới, chấm ở máy chủ). M1 vẫn dùng quiz.html.
  const NEW_PAGES = { 2: 'm2_sv.html', 3: 'm2_sv.html', 4: 'm4_sv.html', 5: 'm4_sv.html', 6: 'banve_sv.html' };
  if (NEW_PAGES[moduleId]) {
    const st = getStudent(), dm = st && String(st.soDe || '').match(/(\d+)/);
    window.location.href = NEW_PAGES[moduleId] + (dm && moduleId !== 6 ? `?de=${dm[1]}` : '');
    return;
  }
  let url = `quiz.html?mod=${moduleId}`;
  if (type) url += `&type=${type}`;
  window.location.href = url;
}

// ── LỊCH SỬ LÀM BÀI GẦN ĐÂY ──
function renderHistoryList() {
  const container = document.getElementById('recent-history-container');
  if (!container) return;

  const progress = getProgress();
  const items = [];

  Object.keys(progress).forEach(modKey => {
    const modId = parseInt(modKey.replace('module_', ''));
    const mData = progress[modKey];
    if (!mData || !mData.bestScores) return;

    Object.keys(mData.bestScores).forEach(qId => {
      items.push({
        moduleId: modId,
        qId,
        score: mData.bestScores[qId],
        lastPlayed: mData.lastPlayed
      });
    });
  });

  if (!items.length) {
    container.innerHTML = '<p class="text-muted" style="font-size:13px">Chưa có lịch sử làm bài. Hãy chọn một module ở trên để bắt đầu ôn tập!</p>';
    return;
  }

  // Sắp xếp bài mới nhất lên đầu
  items.sort((a, b) => new Date(b.lastPlayed || 0) - new Date(a.lastPlayed || 0));

  let html = '<div style="display:flex;flex-direction:column;gap:8px">';
  items.slice(0, 5).forEach(item => {
    const isPass = item.score >= 80;
    html += `
      <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:#FAFCFF;border:1px solid var(--border);border-radius:8px">
        <div>
          <b style="color:var(--primary-dark)">Module ${item.moduleId} – ${item.qId}</b>
          <div style="font-size:11.5px;color:var(--muted)">Thời gian: ${formatDate(item.lastPlayed)}</div>
        </div>
        <span class="badge ${isPass ? 'badge-pass' : 'badge-fail'}" style="font-size:13px;padding:5px 10px">
          ${item.score} điểm
        </span>
      </div>
    `;
  });
  html += '</div>';

  container.innerHTML = html;
}

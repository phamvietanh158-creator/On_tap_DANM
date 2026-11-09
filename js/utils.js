// ═══════════════════════════════════════════════════════════════════
//  utils.js — NenMong Quiz Utility Functions
//  Quản lý LocalStorage, Toast, Modal, Random questions & Formatters
// ═══════════════════════════════════════════════════════════════════

const STORAGE_KEYS = {
  STUDENT: 'nenMong_student_v2',
  PROGRESS: 'nenMong_progress_v2',
  SESSION_USED: 'nenMong_session_used_v2'
};

// ── STUDENT AUTH UTILITIES ──
function getStudent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENT);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error('Error reading student from localStorage', e);
    return null;
  }
}

function saveStudent(studentData) {
  try {
    localStorage.setItem(STORAGE_KEYS.STUDENT, JSON.stringify(studentData));
    return true;
  } catch (e) {
    console.error('Error saving student to localStorage', e);
    return false;
  }
}

function clearStudent() {
  localStorage.removeItem(STORAGE_KEYS.STUDENT);
}

// ── PROGRESS & SCORES UTILITIES ──
function getProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error('Error reading progress', e);
    return {};
  }
}

// M3 làm chung trang M2, M5 làm chung trang M4: điểm lưu ở module gốc.
const MERGED_MODULES = { 3: 2, 5: 4 };

function getModuleStats(moduleId) {
  const progress = getProgress();
  const modData = progress[`module_${MERGED_MODULES[moduleId] || moduleId}`] || {
    completed: [],
    bestScores: {},
    passed: false,
    lastPlayed: null
  };
  
  const scores = Object.values(modData.bestScores || {});
  const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const maxScore = scores.length ? Math.max(...scores) : 0;
  const passThreshold = (window.APP_CONFIG && window.APP_CONFIG.PASS_SCORE) || 80;
  const cfg = window.APP_CONFIG || {};
  const goiY = cfg.M1_BAI_GOI_Y || [];
  const soBaiDat = Object.keys(modData.bestScores || {}).filter(id => modData.bestScores[id] >= passThreshold && !(moduleId === 1 && goiY.includes(id))).length;
  const minBai = moduleId === 1 ? (cfg.M1_MIN_BAI || 5) : 1;
  const isPassed = soBaiDat >= minBai;      // M1: đủ số bài đạt; các phần khác: một bài/lần nộp đạt

  return {
    completedCount: modData.completed.length,
    completedList: modData.completed,
    bestScores: modData.bestScores,
    avgScore,
    maxScore,
    soBaiDat,
    minBai,
    isPassed,
    lastPlayed: modData.lastPlayed
  };
}

function saveScoreLocally(moduleId, qId, score, detail) {
  const progress = getProgress();
  const modKey = `module_${moduleId}`;
  if (!progress[modKey]) {
    progress[modKey] = {
      completed: [],
      bestScores: {},
      passed: false,
      lastPlayed: null
    };
  }

  const modData = progress[modKey];
  if (!modData.completed.includes(qId)) {
    modData.completed.push(qId);
  }

  const currentBest = modData.bestScores[qId] || 0;
  if (score > currentBest || modData.bestScores[qId] === undefined) {
    modData.bestScores[qId] = score;
  }

  const passThreshold = (window.APP_CONFIG && window.APP_CONFIG.PASS_SCORE) || 80;
  if (score >= passThreshold) {
    modData.passed = true;
  }

  modData.lastPlayed = new Date().toISOString();
  localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
}

function resetAllProgress() {
  localStorage.removeItem(STORAGE_KEYS.PROGRESS);
  sessionStorage.removeItem(STORAGE_KEYS.SESSION_USED);
}

// ── SESSION QUESTION RANDOMIZER ──
function pickQuestion(moduleBank, moduleId, preferredType = null) {
  let usedInSession = [];
  try {
    const raw = sessionStorage.getItem(STORAGE_KEYS.SESSION_USED);
    usedInSession = raw ? JSON.parse(raw) : [];
  } catch (e) {}

  let pool = moduleBank;
  if (preferredType) {
    pool = pool.filter(q => q.buoc === preferredType);
  }

  // Ưu tiên câu chưa làm trong session
  let available = pool.filter(q => !usedInSession.includes(q.id));
  if (!available.length) {
    // Nếu đã làm hết trong session -> reset session used cho module này
    usedInSession = usedInSession.filter(id => !pool.some(q => q.id === id));
    available = pool;
  }

  const selected = available[Math.floor(Math.random() * available.length)];
  if (selected) {
    usedInSession.push(selected.id);
    sessionStorage.setItem(STORAGE_KEYS.SESSION_USED, JSON.stringify(usedInSession));
  }
  return selected;
}

// ── TOAST NOTIFICATION ──
let toastTimer = null;
function showToast(message, duration = 3000) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = message;
  toast.classList.add('show');
  
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

// ── URL PARAMS HELPER ──
function getUrlParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// ── FORMATTERS ──
function formatDate(isoString) {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit'
    });
  } catch (e) {
    return isoString;
  }
}

// ═══════════════════════════════════════════════════════════════════
//  submit.js — NenMong Quiz Score Submission & Offline Sync
//  Gửi kết quả bài làm: Frontend → Cloudflare Worker → Google Sheet
// ═══════════════════════════════════════════════════════════════════

const OFFLINE_QUEUE_KEY = 'nenMong_offline_queue_v2';

/**
 * Gửi điểm số lên Cloudflare Worker
 * @param {Object} scoreData Dữ liệu bài làm chi tiết
 * @returns {Promise<{success: boolean, message: string, offline?: boolean}>}
 */
async function submitScoreToServer(scoreData) {
  const student = getStudent() || {};
  const config = window.APP_CONFIG || {};
  const workerUrl = config.WORKER_URL;

  const payload = {
    maSV: student.maSV || student.mssv || 'Unknown',
    hoTen: student.hoTen || student.name || 'Unknown',
    lop: student.lop || student.classId || 'Unknown',
    soDe: student.soDe || student.stt || '',
    module: scoreData.module || 1,
    baiId: scoreData.baiId || scoreData.qId,
    dang: scoreData.dang || '',
    buoc: scoreData.buoc || 1,
    score: Number(scoreData.score) || 0,
    ketQua: (Number(scoreData.score) >= (config.PASS_SCORE || 80)) ? 'ĐẠT' : 'CHƯA ĐẠT',
    timestamp: new Date().toISOString(),
    detail: scoreData.detail || {}
  };

  // 1. Luôn lưu local trước
  saveScoreLocally(payload.module, payload.baiId, payload.score, payload.detail);

  // 2. Kiểm tra kết nối mạng
  if (!navigator.onLine || !workerUrl || workerUrl.includes('REPLACE_WITH')) {
    saveToOfflineQueue(payload);
    return {
      success: true,
      offline: true,
      message: '⚠️ Đang ở chế độ offline. Điểm đã lưu cục bộ và sẽ tự động gửi khi có kết nối.'
    };
  }

  // 3. Gửi lên Cloudflare Worker
  try {
    const response = await fetch(workerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Worker HTTP Error ${response.status}`);
    }

    const data = await response.json();
    if (data.success || data.ok) {
      return {
        success: true,
        offline: false,
        message: '✅ Điểm đã được ghi nhận thành công vào bảng điểm của GV!',
        server: (data.steps ? { steps: data.steps, score100: data.score100 } : null)
      };
    } else {
      if (data.error && /danh sách/.test(data.error)) {          // lỗi nghiệp vụ (MSSV không có trong danh sách): báo thẳng, không đưa vào hàng đợi
        return { success: false, offline: false, message: '❌ ' + data.error };
      }
      throw new Error(data.error || 'Server error');
    }
  } catch (err) {
    console.warn('Lỗi gửi điểm trực tiếp, đưa vào hàng đợi offline:', err);
    saveToOfflineQueue(payload);
    return {
      success: true,
      offline: true,
      message: '⚠️ Tạm thời không kết nối được máy chủ. Điểm đã được lưu trong máy và sẽ gửi lại sau.'
    };
  }
}

// ── QUẢN LÝ HÀNG ĐỢI OFFLINE ──
function saveToOfflineQueue(payload) {
  try {
    const raw = localStorage.getItem(OFFLINE_QUEUE_KEY);
    const queue = raw ? JSON.parse(raw) : [];
    queue.push(payload);
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
  } catch (e) {
    console.error('Error saving to offline queue', e);
  }
}

async function flushOfflineQueue() {
  if (!navigator.onLine) return;
  const config = window.APP_CONFIG || {};
  const workerUrl = config.WORKER_URL;
  if (!workerUrl || workerUrl.includes('REPLACE_WITH')) return;

  try {
    const raw = localStorage.getItem(OFFLINE_QUEUE_KEY);
    if (!raw) return;
    const queue = JSON.parse(raw);
    if (!queue || !queue.length) return;

    const remaining = [];
    for (const item of queue) {
      try {
        const res = await fetch(workerUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item)
        });
        if (!res.ok) remaining.push(item);
      } catch (e) {
        remaining.push(item);
      }
    }

    if (remaining.length) {
      localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(remaining));
    } else {
      localStorage.removeItem(OFFLINE_QUEUE_KEY);
      console.log('✅ Đã đồng bộ toàn bộ điểm offline thành công!');
    }
  } catch (e) {
    console.error('Error flushing offline queue', e);
  }
}

// Lắng nghe sự kiện online để tự động đồng bộ
window.addEventListener('online', flushOfflineQueue);

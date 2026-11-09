// ═══════════════════════════════════════════════════════════════════
//  config.js — NenMong Quiz (ĐH Xây dựng Hà Nội)
//  ► GV chỉ cần chỉnh sửa file này để cập nhật cài đặt toàn hệ thống
//  ► Tương thích 100% GitHub Pages (Static hosting)
// ═══════════════════════════════════════════════════════════════════

window.APP_CONFIG = {
  // Tên trường & bộ môn
  UNIVERSITY: "TRƯỜNG ĐẠI HỌC XÂY DỰNG HÀ NỘI",
  DEPARTMENT: "BỘ MÔN CƠ HỌC ĐẤT – NỀN MÓNG",
  APP_NAME: "NenMong Quiz",
  APP_SUBTITLE: "Hệ thống Ôn tập & Kiểm tra Đồ án Nền móng Online",

  // Cloudflare Worker URL (nhận điểm -> Google Sheets của GV)
  WORKER_URL: "https://danm.phamvietanh158.workers.dev/", // Cập nhật URL Worker thực tế khi deploy

  // Ngưỡng điểm ĐẠT theo quy định của bộ môn để được bảo vệ đồ án
  PASS_SCORE: 80, // 80/100 điểm
  // Module 1: cần ít nhất M1_MIN_BAI bài KHÁC NHAU đạt ≥ PASS_SCORE; bài có gợi ý (liệt kê id ở M1_BAI_GOI_Y) không được tính. Hiện M1 chưa có chế độ gợi ý.
  M1_MIN_BAI: 5,
  M1_BAI_GOI_Y: [],
  // Tỷ trọng các phần khi tổng hợp điểm môn [GĐ: tác giả chỉnh]. CLO4 (đọc bản vẽ) tỷ trọng thấp. Tổng = 100.
  MODULE_WEIGHTS: { M1: 20, M2: 35, M4: 35, M6: 5, NGAN_HANG: 5 },

  // Danh sách lớp sinh viên tham gia ôn tập
  CLASS_LIST: [
    { id: "XD01", name: "XD01" },
    { id: "XD02", name: "XD02" },
    { id: "XD03", name: "XD03" },
    { id: "XD04", name: "XD04" },
    { id: "XD05", name: "XD05" },
    { id: "XD06", name: "XD06" },
    { id: "XD07", name: "XD07" },
    { id: "XD08", name: "XD08" },
    { id: "XD09", name: "XD09" },
    { id: "XD10", name: "XD10" },
    { id: "CD1", name: "CD1" },
    { id: "CD2", name: "CD2" },
    { id: "CD3", name: "CD3" },
    { id: "CD4", name: "CD4" },
    { id: "CDS", name: "CDS" },
    { id: "TH1", name: "TH1" },
    { id: "TH2", name: "TH2" },
    { id: "TH3", name: "TH3" },
    { id: "TH4", name: "TH4" },
    { id: "CB", name: "CB" },
    { id: "CTT", name: "CTT" },
    { id: "NV01", name: "NV01" },
    { id: "NV02", name: "NV02" },
    { id: "NV03", name: "NV03" },
    { id: "NV04", name: "NV04" },
    { id: "NV05", name: "NV05" },
    { id: "NV06", name: "NV06" },
    { id: "NV07", name: "NV07" },
    { id: "NV08", name: "NV08" },
    { id: "NV09", name: "NV09" },
    { id: "NV10", name: "NV10" }
  ],

  // Cấu hình 6 Module ôn tập đồ án
  MODULES: [
    {
      id: 1,
      code: "M1",
      title: "Phương án móng",
      clo: "CLO1",
      bloom: "C4 (Phân tích)",
      desc: "Phân tích trụ địa chất 4 lớp, đánh giá địa tầng và lựa chọn giải pháp móng cho 3 cấp tải trọng.",
      totalQuestions: 15,
      subTypes: [
        { name: "Bước 1 (Thuận)", count: 8, desc: "Bài toán thuận phân tích địa chất & giải pháp móng" },
        { name: "Bước 2 (CLO)", count: 7, desc: "Tình huống C4, so sánh phương án, xử lý lớp đất yếu" }
      ],
      active: true,
      badge: "Mở đầy đủ"
    },
    {
      id: 2,
      code: "M2",
      title: "Móng nông: tính và tình huống",
      clo: "CLO2",
      bloom: "C4 (Tính toán & Kiểm tra)",
      desc: "Hệ thống đề xuất một phương án móng đơn; bạn tự tính áp lực đáy móng, sức chịu tải, lún, chọc thủng, thép rồi trả lời hơn 30 câu tình huống.",
      totalQuestions: 10,
      subTypes: [],
      active: true,
      badge: "Sẵn sàng"
    },
    {
      id: 3,
      code: "M3",
      title: "Chiều cao và cốt thép móng nông (làm trong Module 2)",
      clo: "CLO2",
      bloom: "C4 (Tính toán & Kiểm tra)",
      desc: "Đâm thủng, chiều cao làm việc h0 và cốt thép đã nằm trong bài Móng nông ở Module 2.",
      totalQuestions: 10,
      subTypes: [],
      active: true,
      badge: "Sẵn sàng"
    },
    {
      id: 4,
      code: "M4",
      title: "Móng cọc: tính và tình huống",
      clo: "CLO3",
      bloom: "C4 (Phân tích & Tính toán)",
      desc: "Hệ thống đề xuất một móng cọc đóng/ép; bạn tự tính sức chịu tải, tải lên cọc, đài, độ lún khối quy ước rồi trả lời hơn 30 câu tình huống.",
      totalQuestions: 10,
      subTypes: [],
      active: true,
      badge: "Sẵn sàng"
    },
    {
      id: 5,
      code: "M5",
      title: "Đài cọc (làm trong Module 4)",
      clo: "CLO3",
      bloom: "C4 (Kiểm tra & Cấu tạo)",
      desc: "Chọc thủng và cốt thép đài đã nằm trong bài Móng cọc ở Module 4.",
      totalQuestions: 10,
      subTypes: [],
      active: true,
      badge: "Sẵn sàng"
    },
    {
      id: 6,
      code: "M6",
      title: "Đọc hiểu bản vẽ móng",
      clo: "CLO4",
      bloom: "C2 (Đọc hiểu & Cấu tạo)",
      desc: "Đọc kích thước, ký hiệu, bố trí thép và tọa độ cọc trên bản vẽ móng đơn và móng cọc (tỷ trọng nhỏ).",
      totalQuestions: 10,
      subTypes: [],
      active: true,
      badge: "Sẵn sàng"
    }
  ]
};

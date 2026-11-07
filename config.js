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
  WORKER_URL: "https://nen-mong.workers.dev/submit", // Cập nhật URL Worker thực tế khi deploy

  // Ngưỡng điểm ĐẠT theo quy định của bộ môn để được bảo vệ đồ án
  PASS_SCORE: 80, // 80/100 điểm
  // Tỷ trọng các phần khi tổng hợp điểm môn [GĐ: tác giả chỉnh]. CLO4 (đọc bản vẽ) tỷ trọng thấp. Tổng = 100.
  MODULE_WEIGHTS: { M1: 20, M2: 35, M4: 35, M6: 5, NGAN_HANG: 5 },

  // Danh sách lớp sinh viên tham gia ôn tập
  CLASS_LIST: [
    { id: "64XDDD1", name: "64XDDD1" },
    { id: "64XDDD2", name: "64XDDD2" },
    { id: "64XDDD3", name: "64XDDD3" },
    { id: "65XDDD1", name: "65XDDD1" },
    { id: "65XDDD2", name: "65XDDD2" },
    { id: "65XDDD3", name: "65XDDD3" },
    { id: "66XDDD1", name: "66XDDD1" },
    { id: "66XDDD2", name: "66XDDD2" },
    { id: "66XDDD3", name: "66XDDD3" },
    { id: "66KT1",   name: "66KT1" },
    { id: "66KT2",   name: "66KT2" },
    { id: "66CDT1",  name: "66CDT1" },
    { id: "66CDT2",  name: "66CDT2" },
    { id: "66NV1",   name: "66NV1" },
    { id: "66NV2",   name: "66NV2" },
    { id: "KHAC",    name: "Lớp khác / Tự do" }
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
      desc: "Hệ thống đề xuất một phương án móng đơn; bạn tự tính áp lực đáy móng, sức chịu tải, lún, chọc thủng, thép rồi trả lời 26 câu tình huống.",
      totalQuestions: 10,
      subTypes: [
        { name: "Móng đơn", count: 5, desc: "Xác định B, L móng đúng tâm & lệch tâm" },
        { name: "Móng băng", count: 5, desc: "Xác định bề rộng b bản móng băng" }
      ],
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
      subTypes: [
        { name: "Đâm thủng", count: 5, desc: "Kiểm tra cường độ bê tông chống đâm thủng" },
        { name: "Cốt thép", count: 5, desc: "Kiểm tra diện tích cốt thép Fa móng" }
      ],
      active: true,
      badge: "Sẵn sàng"
    },
    {
      id: 4,
      code: "M4",
      title: "Móng cọc: tính và tình huống",
      clo: "CLO3",
      bloom: "C4 (Phân tích & Tính toán)",
      desc: "Hệ thống đề xuất một móng cọc đóng/ép; bạn tự tính sức chịu tải, tải lên cọc, đài, độ lún khối quy ước rồi trả lời 26 câu tình huống.",
      totalQuestions: 10,
      subTypes: [
        { name: "Cọc đơn", count: 5, desc: "SCT theo đất nền Rcu và vật liệu Pvl" },
        { name: "Nhóm cọc", count: 5, desc: "Kiểm tra tải trọng cọc lớn nhất Pmax và cọc đơn trong nhóm" }
      ],
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
      subTypes: [
        { name: "Chọc thủng", count: 5, desc: "Chọc thủng tháp cột & cọc góc đài" },
        { name: "Cốt thép đài", count: 5, desc: "Tính cốt thép 2 phương mặt đáy đài" }
      ],
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
      subTypes: [
        { name: "Mặt bằng", count: 5, desc: "Khoảng cách tim cọc, mép đài, lưới cột" },
        { name: "Chi tiết thép", count: 5, desc: "Đường kính, bước thép, chiều dài neo và nối cọc" }
      ],
      active: true,
      badge: "Sẵn sàng"
    }
  ]
};

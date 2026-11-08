// ═══════════════════════════════════════════════════════════════════
//  module1.js — Ngân hàng 15 bài Module 1: Phương Án Móng (CLO1 - C4)
//  Trường ĐH Xây dựng Hà Nội — Bộ môn Cơ học đất – Nền móng
// ═══════════════════════════════════════════════════════════════════

window.MODULE1_DATA = [
  // ─────────────────────────────────────────────────────────────────
  // DẠNG 1: BÀI TOÁN THUẬN (8 BÀI B01 - B08)
  // ─────────────────────────────────────────────────────────────────
  {
    id: "M1_B01",
    module: 1,
    dang: "X-T-T-T",
    buoc: 1, // 1 = Thuận
    title: "Bài 1 – Lớp 1 yếu dẻo chảy (Dạng X-T-T-T)",
    layers: [
      { so: 1, ten: "Sét", day: 3.0, chiTieu: { w: 51, wL: 55, wP: 28 } },
      { so: 2, ten: "Sét", day: 7.0, chiTieu: { w: 27, wL: 50, wP: 26 } },
      { so: 3, ten: "Cát hạt trung", day: 6.0, chiTieu: { NSPT: 25 } },
      { so: 4, ten: "Cát hạt thô", day: null, chiTieu: { NSPT: 48 } }
    ],
    taiTrong: { nho: 300, trungBinh: 1100, lon: 3200 },
    answer: {
      step1: ["Sét", "Sét", "Cát hạt trung", "Cát hạt thô"],
      states: ["Dẻo chảy", "Nửa cứng", "Chặt vừa", "Chặt"],
      good: [false, true, true, true],
      pattern: "X-T-T-T",
      solutions: { nho: 1, trungBinh: 1, lon: 1 }, // 1: móng nông L2, 1: cọc vào L4
      explanation: {
        b1: [
          "A = 27% → Sét; B = (51-28)/27 = 0.85 > 0.5 → Dẻo chảy ❌",
          "A = 24% → Sét; B = (27-26)/24 = 0.04 → Nửa cứng ✅",
          "NSPT = 25 ∈ [10, 30) → Chặt vừa ✅",
          "NSPT = 48 ∈ [30, 50) → Chặt ✅"
        ],
        b4: "L1 dẻo chảy yếu dày 3m → bỏ qua, đặt móng nông vào L2 nửa cứng (Df ≥ 3.3m). Tải lớn 3200 kN: dùng móng cọc vào L3-L4."
      }
    }
  },
  {
    id: "M1_B02",
    module: 1,
    dang: "T-T-T-T",
    buoc: 1,
    title: "Bài 2 – Nền tốt đồng đều (Dạng T-T-T-T)",
    layers: [
      { so: 1, ten: "Sét pha", day: 4.0, chiTieu: { w: 27, wL: 42, wP: 22 } },
      { so: 2, ten: "Sét pha", day: 4.0, chiTieu: { w: 25, wL: 40, wP: 20 } },
      { so: 3, ten: "Cát hạt nhỏ", day: 5.0, chiTieu: { NSPT: 28 } },
      { so: 4, ten: "Cát hạt thô", day: null, chiTieu: { qc: 22 } }
    ],
    taiTrong: { nho: 310, trungBinh: 1280, lon: 3900 },
    answer: {
      step1: ["Sét pha", "Sét pha", "Cát hạt nhỏ", "Cát hạt thô"],
      states: ["Nửa cứng", "Nửa cứng", "Chặt vừa", "Rất chặt"],
      good: [true, true, true, true],
      pattern: "T-T-T-T",
      solutions: { nho: 0, trungBinh: 2, lon: 0 },
      explanation: {
        b1: [
          "A = 20% → Sét pha; B = (27-22)/20 = 0.25 → Nửa cứng ✅",
          "A = 20% → Sét pha; B = (25-20)/20 = 0.25 → Nửa cứng ✅",
          "NSPT = 28 ∈ [10, 30) → Chặt vừa ✅",
          "qc = 22 MPa ≥ 20 MPa → Rất chặt ✅"
        ],
        b4: "Tất cả 4 lớp đất đều tốt. Tải nhỏ 310 kN: móng nông L1. Tải TB 1280 kN: móng nông L1-L2. Tải lớn 3900 kN: móng cọc vào L3-L4."
      }
    }
  },
  {
    id: "M1_B03",
    module: 1,
    dang: "X-T-T-T",
    buoc: 1,
    title: "Bài 3 – Lớp 1 sét pha mềm yếu (Dạng X-T-T-T)",
    layers: [
      { so: 1, ten: "Sét pha", day: 3.5, chiTieu: { w: 38, wL: 44, wP: 22 } },
      { so: 2, ten: "Sét pha", day: 6.0, chiTieu: { w: 24, wL: 41, wP: 21 } },
      { so: 3, ten: "Cát hạt nhỏ", day: 5.0, chiTieu: { NSPT: 22 } },
      { so: 4, ten: "Cát hạt thô", day: null, chiTieu: { NSPT: 45 } }
    ],
    taiTrong: { nho: 280, trungBinh: 800, lon: 3000 },
    answer: {
      step1: ["Sét pha", "Sét pha", "Cát hạt nhỏ", "Cát hạt thô"],
      states: ["Dẻo chảy", "Nửa cứng", "Chặt vừa", "Chặt"],
      good: [false, true, true, true],
      pattern: "X-T-T-T",
      solutions: { nho: 1, trungBinh: 1, lon: 1 },
      explanation: {
        b1: [
          "A = 22% → Sét pha; B = (38-22)/22 = 0.73 > 0.5 → Dẻo chảy ❌",
          "A = 20% → Sét pha; B = (24-21)/20 = 0.15 → Nửa cứng ✅",
          "NSPT = 22 ∈ [10, 30) → Chặt vừa ✅",
          "NSPT = 45 ∈ [30, 50) → Chặt ✅"
        ],
        b4: "L1 dẻo chảy dày 3.5m → bỏ qua L1, đặt móng nông vào L2 nửa cứng. Tải lớn 3000 kN: cọc vào L3 hoặc L4."
      }
    }
  },
  {
    id: "M1_B04",
    module: 1,
    dang: "X-X-T-T",
    buoc: 1,
    title: "Bài 4 – 2 lớp trên yếu dày (Dạng X-X-T-T)",
    layers: [
      { so: 1, ten: "Sét", day: 4.0, chiTieu: { w: 57, wL: 60, wP: 30 } },
      { so: 2, ten: "Cát bụi", day: 5.0, chiTieu: { NSPT: 6 } },
      { so: 3, ten: "Cát hạt trung", day: 6.0, chiTieu: { qc: 7.9 } },
      { so: 4, ten: "Cát hạt thô", day: null, chiTieu: { NSPT: 46 } }
    ],
    taiTrong: { nho: 290, trungBinh: 980, lon: 2900 },
    answer: {
      step1: ["Sét", "Cát bụi", "Cát hạt trung", "Cát hạt thô"],
      states: ["Dẻo chảy", "Rời", "Chặt vừa", "Chặt"],
      good: [false, false, true, true],
      pattern: "X-X-T-T",
      solutions: { nho: 4, trungBinh: 3, lon: 1 },
      explanation: {
        b1: [
          "A = 30% → Sét; B = (57-30)/30 = 0.90 → Dẻo chảy ❌",
          "NSPT = 6 ∈ [4, 10) → Rời ❌",
          "qc = 7.9 MPa ∈ [4, 12) → Chặt vừa ✅",
          "NSPT = 46 ∈ [30, 50) → Chặt ✅"
        ],
        b4: "L1+L2 đều yếu (tổng 9m). Tải nhỏ 290 kN: gia cố cọc đất-XM. Tải TB 980 kN: gia cố hoặc cọc ngắn. Tải lớn 2900 kN: cọc vào L4."
      }
    }
  },
  {
    id: "M1_B05",
    module: 1,
    dang: "T-X-T-T",
    buoc: 1,
    title: "Bài 5 – Lớp 2 bùn sét yếu xen kẹp (Dạng T-X-T-T)",
    layers: [
      { so: 1, ten: "Sét", day: 4.5, chiTieu: { w: 32, wL: 55, wP: 28 } },
      { so: 2, ten: "Bùn sét", day: 3.0, chiTieu: { NSPT: 1, qc: 0.38 } },
      { so: 3, ten: "Cát hạt vừa", day: 6.0, chiTieu: { qc: 8.5 } },
      { so: 4, ten: "Cuội sỏi lẫn cát", day: null, chiTieu: { qc: 16.8 } }
    ],
    taiTrong: { nho: 350, trungBinh: 1200, lon: 3500 },
    answer: {
      step1: ["Sét", "Bùn sét", "Cát hạt vừa", "Cuội sỏi lẫn cát"],
      states: ["Nửa cứng", "Chảy", "Chặt vừa", "Chặt"],
      good: [true, false, true, true],
      pattern: "T-X-T-T",
      solutions: { nho: 0, trungBinh: 0, lon: 2 },
      explanation: {
        b1: [
          "A = 27% → Sét; B = (32-28)/27 = 0.15 → Nửa cứng ✅",
          "NSPT = 1 < 2, qc = 0.38 < 0.5 MPa → Bùn chảy ❌",
          "qc = 8.5 MPa ∈ [4, 12) → Chặt vừa ✅",
          "qc = 16.8 MPa ∈ [12, 20) → Chặt ✅"
        ],
        b4: "L1 tốt đặt móng nông (tải nhỏ/TB), nhưng cần kiểm tra lún qua L2 bùn. Tải lớn 3500 kN: bắt buộc dùng cọc xuyên L2 vào L3-L4."
      }
    }
  },
  {
    id: "M1_B06",
    module: 1,
    dang: "T-X-T-T",
    buoc: 1,
    title: "Bài 6 – Lớp 2 dẻo chảy xen kẹp (Dạng T-X-T-T)",
    layers: [
      { so: 1, ten: "Sét", day: 5.0, chiTieu: { w: 28, wL: 52, wP: 26 } },
      { so: 2, ten: "Sét pha", day: 4.5, chiTieu: { w: 30, wL: 38, wP: 20 } },
      { so: 3, ten: "Cát hạt vừa", day: 3.5, chiTieu: { qc: 12 } },
      { so: 4, ten: "Cát hạt trung", day: null, chiTieu: { NSPT: 48 } }
    ],
    taiTrong: { nho: 430, trungBinh: 1700, lon: 4200 },
    answer: {
      step1: ["Sét", "Sét pha", "Cát hạt vừa", "Cát hạt trung"],
      states: ["Nửa cứng", "Dẻo chảy", "Chặt", "Chặt"],
      good: [true, false, true, true],
      pattern: "T-X-T-T",
      solutions: { nho: 0, trungBinh: 0, lon: 2 },
      explanation: {
        b1: [
          "A = 26% → Sét; B = (28-26)/26 = 0.08 → Nửa cứng ✅",
          "A = 18% → Sét pha; B = (30-20)/18 = 0.56 > 0.5 → Dẻo chảy (Yếu) ❌",
          "qc = 12 MPa ∈ [12, 20) → Chặt ✅",
          "NSPT = 48 ∈ [30, 50) → Chặt ✅"
        ],
        b4: "L1 nửa cứng phù hợp móng nông cho tải nhỏ/TB. L2 dẻo chảy gây lún lớn → tải lớn 4200 kN: cọc xuyên qua L2 vào L3-L4."
      }
    }
  },
  {
    id: "M1_B07",
    module: 1,
    dang: "X-X-T-T",
    buoc: 1,
    title: "Bài 7 – Cát rời và sét pha dẻo chảy (Dạng X-X-T-T)",
    layers: [
      { so: 1, ten: "Cát bụi", day: 3.5, chiTieu: { NSPT: 5 } },
      { so: 2, ten: "Sét pha", day: 6.0, chiTieu: { w: 36, wL: 42, wP: 22 } },
      { so: 3, ten: "Cát hạt thô", day: 7.0, chiTieu: { qc: 16 } },
      { so: 4, ten: "Cuội sỏi lẫn cát", day: null, chiTieu: { qc: 28 } }
    ],
    taiTrong: { nho: 320, trungBinh: 1050, lon: 3100 },
    answer: {
      step1: ["Cát bụi", "Sét pha", "Cát hạt thô", "Cuội sỏi lẫn cát"],
      states: ["Rời", "Dẻo chảy", "Chặt", "Rất chặt"],
      good: [false, false, true, true],
      pattern: "X-X-T-T",
      solutions: { nho: 3, trungBinh: 3, lon: 1 },
      explanation: {
        b1: [
          "NSPT = 5 ∈ [4, 10) → Rời ❌",
          "A = 20% → Sét pha; B = (36-22)/20 = 0.70 → Dẻo chảy ❌",
          "qc = 16 MPa ∈ [12, 20) → Chặt ✅",
          "qc = 28 MPa ≥ 20 MPa → Rất chặt ✅"
        ],
        b4: "L1+L2 yếu (tổng 9.5m). Tải nhỏ/TB: gia cố nền hoặc cọc ngắn. Tải lớn: móng cọc vào L3 (qc=16 MPa) hoặc L4."
      }
    }
  },
  {
    id: "M1_B08",
    module: 1,
    dang: "T-X-T-T",
    buoc: 1,
    title: "Bài 8 – Sét pha dẻo chảy xen kẹp L2 (Dạng T-X-T-T)",
    layers: [
      { so: 1, ten: "Sét pha", day: 4.0, chiTieu: { w: 27, wL: 42, wP: 22 } },
      { so: 2, ten: "Sét pha", day: 4.0, chiTieu: { w: 34, wL: 40, wP: 22 } },
      { so: 3, ten: "Cát hạt nhỏ", day: 5.0, chiTieu: { NSPT: 28 } },
      { so: 4, ten: "Cát hạt thô", day: null, chiTieu: { qc: 22 } }
    ],
    taiTrong: { nho: 310, trungBinh: 1280, lon: 3900 },
    answer: {
      step1: ["Sét pha", "Sét pha", "Cát hạt nhỏ", "Cát hạt thô"],
      states: ["Nửa cứng", "Dẻo chảy", "Chặt vừa", "Rất chặt"],
      good: [true, false, true, true],
      pattern: "T-X-T-T",
      solutions: { nho: 0, trungBinh: 0, lon: 2 },
      explanation: {
        b1: [
          "A = 20% → Sét pha; B = (27-22)/20 = 0.25 → Nửa cứng ✅",
          "A = 18% → Sét pha; B = (34-22)/18 = 0.67 → Dẻo chảy ❌",
          "NSPT = 28 ∈ [10, 30) → Chặt vừa ✅",
          "qc = 22 MPa ≥ 20 MPa → Rất chặt ✅"
        ],
        b4: "L1 tốt, L2 dẻo chảy xen kẹp → móng nông trong L1 cho tải nhỏ/TB. Tải lớn 3900 kN: cọc xuyên L2 vào L3-L4."
      }
    }
  },

  // ─────────────────────────────────────────────────────────────────
  // DẠNG 2: BÀI TẬP CLO C4 (7 BÀI B13 - B19)
  // ─────────────────────────────────────────────────────────────────
  {
    id: "M1_B13",
    module: 1,
    dang: "X-T-T-T",
    buoc: 2, // 2 = CLO C4
    title: "Bài 13 – CLO: So sánh 2 phương án xử lý lớp yếu (X-T-T-T)",
    layers: [
      { so: 1, ten: "Sét pha", day: 3.5, chiTieu: { w: 38, wL: 44, wP: 22 } },
      { so: 2, ten: "Sét pha", day: 6.0, chiTieu: { w: 24, wL: 41, wP: 21 } },
      { so: 3, ten: "Cát hạt nhỏ", day: 5.0, chiTieu: { NSPT: 22 } },
      { so: 4, ten: "Cát hạt thô", day: null, chiTieu: { NSPT: 45 } }
    ],
    taiTrong: { nho: 300, trungBinh: 800, lon: 3000 },
    cloQuestion: {
      context: "Kỹ sư A đề xuất: đặt móng nông vào lớp 2 (Df = 4.0m). Kỹ sư B đề xuất: đặt móng nông vào lớp 2 với đệm cát dày 0.5m thay thế phần dưới lớp 1 (Df = 1.5m). Tải trọng công trình N = 800 kN/cột (~6 tầng).",
      subQuestions: [
        { id: "a", label: "a) Phương án nào hợp lý hơn về mặt kỹ thuật? Giải thích dựa trên số liệu địa chất.", placeholder: "Phân tích trạng thái L1, L2 và tính an toàn của từng phương án..." },
        { id: "b", label: "b) Phương án nào kinh tế hơn? Tại sao?", placeholder: "So sánh chi phí đào sâu vs thi công đệm cát..." }
      ]
    },
    answer: {
      step1: ["Sét pha", "Sét pha", "Cát hạt nhỏ", "Cát hạt thô"],
      states: ["Dẻo chảy", "Nửa cứng", "Chặt vừa", "Chặt"],
      good: [false, true, true, true],
      pattern: "X-T-T-T",
      modelAnalysis: {
        a: "L1 là sét pha dẻo chảy (B = 0.73 > 0.5) dày tới 3.5m. Phương án A (Df = 4.0m) bỏ hoàn toàn L1 để cắm sâu 0.5m vào L2 nửa cứng (B = 0.15), đảm bảo an toàn kỹ thuật cao nhất. Phương án B chỉ đệm cát 0.5m là chưa đủ thay thế 3.5m đất yếu dẻo chảy bên dưới.",
        b: "Phương án B có Df nông hơn giúp giảm khối lượng đào đất nhưng phát sinh chi phí vật liệu cát đệm, đầm chặt kiểm tra K. Phương án A đào sâu hơn nhưng tận dụng trực tiếp nền tự nhiên L2 tốt. Kết luận: Phương án A an toàn và tối ưu hơn."
      },
      rubric: [
        { level: "Xuất sắc (55-60đ)", desc: "Phân tích đủ 2 chiều (kỹ thuật & kinh tế), dẫn chứng B=0.73 và B=0.15, lý giải chuẩn tại sao PA A vượt trội." },
        { level: "Đạt yêu cầu (42-54đ)", desc: "Chọn đúng PA A, giải thích được bản chất kỹ thuật của việc vượt qua lớp dẻo chảy." },
        { level: "Cần cải thiện (25-41đ)", desc: "Chọn đúng PA A nhưng giải thích chung chung, thiếu số liệu chỉ tiêu cơ lý." },
        { level: "Chưa đạt (0-24đ)", desc: "Chọn sai phương án hoặc không đưa ra lập luận kỹ thuật." }
      ]
    }
  },
  {
    id: "M1_B14",
    module: 1,
    dang: "X-X-T-T",
    buoc: 2,
    title: "Bài 14 – CLO: Phân tích đồng bộ giải pháp móng (X-X-T-T)",
    layers: [
      { so: 1, ten: "Bùn sét", day: 4.0, chiTieu: { NSPT: 1, qc: 0.3 } },
      { so: 2, ten: "Sét pha", day: 5.5, chiTieu: { w: 35, wL: 43, wP: 22 } },
      { so: 3, ten: "Cát hạt vừa", day: 7.0, chiTieu: { qc: 10 } },
      { so: 4, ten: "Cát hạt thô", day: null, chiTieu: { NSPT: 42 } }
    ],
    taiTrong: { nho: 300, trungBinh: 1000, lon: 3200 },
    cloQuestion: {
      context: "Cho biết chi phí cọc đất-XM cho tải nhỏ (300 kN) bằng 60% chi phí móng cọc BTCT. Tuy nhiên Chủ nhiệm đồ án yêu cầu dùng móng cọc cho cả tải nhỏ lẫn tải lớn để thống nhất biện pháp thi công.",
      subQuestions: [
        { id: "a", label: "a) Đề xuất ban đầu của bạn cho tải nhỏ là gì? Tại sao bị thay đổi?", placeholder: "Giải thích lựa chọn kỹ thuật ban đầu..." },
        { id: "b", label: "b) Phân tích quyết định thống nhất móng cọc về mặt kỹ thuật và kinh tế.", placeholder: "Đánh giá tính đồng bộ thi công vs chi phí..." }
      ]
    },
    answer: {
      step1: ["Bùn sét", "Sét pha", "Cát hạt vừa", "Cát hạt thô"],
      states: ["Chảy", "Dẻo chảy", "Chặt vừa", "Chặt"],
      good: [false, false, true, true],
      pattern: "X-X-T-T",
      modelAnalysis: {
        a: "Tải nhỏ 300 kN trên nền 9.5m đất yếu (L1 bùn sét + L2 sét pha dẻo chảy B=0.62) ban đầu đề xuất cọc đất-XM gia cố + móng nông để tiết kiệm chi phí. Bị thay đổi do yêu cầu đồng bộ thiết bị thi công trên công trường.",
        b: "Kỹ thuật: Móng cọc cho toàn bộ công trình đảm bảo an toàn tuyệt đối, độ lún đồng đều, không cần huy động 2 dây chuyền máy móc khác nhau. Kinh tế: Chi phí cọc BTCT cao hơn cọc đất-XM nhưng bù đắp bằng giảm chi phí quản lý và thời gian thi công."
      },
      rubric: [
        { level: "Xuất sắc (55-60đ)", desc: "Phân tích thấu đáo bài toán kinh tế - kỹ thuật và tính tổ chức thi công thực tế." },
        { level: "Đạt yêu cầu (42-54đ)", desc: "Nêu được sự đánh đổi giữa giá thành vật liệu và sự thuận tiện trong thi công cọc." }
      ]
    }
  },
  {
    id: "M1_B15",
    module: 1,
    dang: "T-X-T-T",
    buoc: 2,
    title: "Bài 15 – CLO: Nhận định rủi ro lớp yếu xen kẹp (T-X-T-T)",
    layers: [
      { so: 1, ten: "Sét pha", day: 5.5, chiTieu: { w: 23, wL: 40, wP: 21 } },
      { so: 2, ten: "Bùn sét pha", day: 2.5, chiTieu: { NSPT: 1, qc: 0.28 } },
      { so: 3, ten: "Cát hạt trung", day: 6.0, chiTieu: { qc: 9 } },
      { so: 4, ten: "Cuội sỏi", day: null, chiTieu: { qc: 24 } }
    ],
    taiTrong: { nho: 350, trungBinh: 1500, lon: 4000 },
    cloQuestion: {
      context: "Sinh viên X kết luận: 'Lớp 1 nửa cứng (dày 5.5m) → đặt móng nông trong L1, Df = 2.0m là đủ an toàn'. Sinh viên Y kết luận: 'Bắt buộc phải dùng móng cọc vì lớp 2 là bùn'. Tải trọng cột N = 1500 kN.",
      subQuestions: [
        { id: "a", label: "a) Sinh viên X đã bỏ qua bước kiểm tra quan trọng nào?", placeholder: "Phân tích điều kiện biến dạng và bóng ứng suất..." },
        { id: "b", label: "b) Với N = 1500 kN, kết luận của ai đúng và phương án tối ưu là gì?", placeholder: "Đánh giá lựa chọn móng cọc..." }
      ]
    },
    answer: {
      step1: ["Sét pha", "Bùn sét pha", "Cát hạt trung", "Cuội sỏi"],
      states: ["Nửa cứng", "Chảy", "Chặt vừa", "Rất chặt"],
      good: [true, false, true, true],
      pattern: "T-X-T-T",
      modelAnalysis: {
        a: "Sinh viên X chỉ nhìn vào sức chịu tải của L1 (nửa cứng) mà bỏ qua KIỂM TRA ĐỘ LÚN và KIỂM TRA ÁP LỰC ĐẾN LỚP ĐẤT YẾU DƯỚI ĐÁY MÓNG (TCVN 9362). Vùng bulb ứng suất của móng dưới tải N=1500 kN sẽ xuyên sâu vào lớp 2 bùn sét gây lún vượt giới hạn cho phép.",
        b: "Sinh viên Y đúng. Với tải trung bình - lớn N = 1500 kN, bắt buộc phải dùng móng cọc xuyên qua lớp 2 bùn sét (dày 2.5m), ngàm mũi cọc vào L3 (qc=9 MPa) hoặc L4 (qc=24 MPa)."
      },
      rubric: [
        { level: "Xuất sắc (55-60đ)", desc: "Chỉ rõ sai lầm bỏ qua kiểm tra lún và áp lực tầng đệm đất yếu L2, kết luận chuẩn xác." },
        { level: "Đạt yêu cầu (42-54đ)", desc: "Hiểu được rủi ro lớp bùn L2 bên dưới dù móng đặt trong L1 tốt." }
      ]
    }
  },
  {
    id: "M1_B16",
    module: 1,
    dang: "X-X-X-T",
    buoc: 2,
    title: "Bài 16 – CLO: So sánh 3 phương án cho nền rất yếu ĐBSCL (X-X-X-T)",
    layers: [
      { so: 1, ten: "Bùn sét", day: 5.0, chiTieu: { w: 72, wL: 58, wP: 30 } },
      { so: 2, ten: "Sét pha", day: 8.0, chiTieu: { w: 40, wL: 44, wP: 23 } },
      { so: 3, ten: "Cát hạt mịn", day: 3.5, chiTieu: { NSPT: 8 } },
      { so: 4, ten: "Cát hạt trung", day: null, chiTieu: { NSPT: 38 } }
    ],
    taiTrong: { nho: 450, trungBinh: 1200, lon: 3200 },
    cloQuestion: {
      context: "Địa tầng X-X-X-T dày 16.5m đất yếu. Với tải nhỏ N = 450 kN (~4 tầng), có 3 phương án đề xuất: (1) Cọc đất-XM gia cố L1+L2 + móng nông; (2) Cọc ép BTCT 250x250 mũi vào L4; (3) Đệm cát thay thế L1 + móng nông trong L2.",
      subQuestions: [
        { id: "a", label: "a) Phương án (3) có khả thi không? Tại sao?", placeholder: "Đánh giá tính khả thi đào sâu thay đất..." },
        { id: "b", label: "b) So sánh phương án (1) và (2) và đưa ra lựa chọn hợp lý nhất.", placeholder: "So sánh kỹ thuật, kinh tế và thiết bị thi công..." }
      ]
    },
    answer: {
      step1: ["Bùn sét", "Sét pha", "Cát hạt mịn", "Cát hạt trung"],
      states: ["Chảy", "Dẻo chảy", "Rời", "Chặt"],
      good: [false, false, false, true],
      pattern: "X-X-X-T",
      modelAnalysis: {
        a: "Phương án (3) hoàn toàn KHÔNG KHẢ THI. Lớp 1 bùn sét dày tới 5m không thể đào bỏ do khối lượng đất đào quá lớn, nguy cơ sạt lở hố đào và lớp 2 bên dưới vẫn là sét pha dẻo chảy (B=0.81) không chịu được tải trọng.",
        b: "Phương án (1) cọc đất-XM phù hợp cho tải nhỏ nhưng chiều sâu gia cố tới 13m giá thành cao. Phương án (2) cọc ép BTCT hạ mũi vào L4 (NSPT=38) là phương án tối ưu, triệt để, kiểm soát hoàn toàn độ lún công trình."
      },
      rubric: [
        { level: "Xuất sắc (55-60đ)", desc: "Bác bỏ phương án 3 với lập luận kỹ thuật vững chắc, so sánh chi tiết ưu nhược PA 1 và 2." },
        { level: "Đạt yêu cầu (42-54đ)", desc: "Nắm được nguyên tắc không đào đệm cát quá sâu và chọn đúng cọc BTCT vào L4." }
      ]
    }
  },
  {
    id: "M1_B17",
    module: 1,
    dang: "T-T-T-T",
    buoc: 2,
    title: "Bài 17 – CLO: Ảnh hưởng chiều sâu đặt móng Df và MNN (T-T-T-T)",
    layers: [
      { so: 1, ten: "Sét pha", day: 6.0, chiTieu: { w: 24, wL: 41, wP: 21 } },
      { so: 2, ten: "Cát hạt nhỏ", day: 5.0, chiTieu: { NSPT: 24 } },
      { so: 3, ten: "Cát hạt vừa", day: 6.0, chiTieu: { qc: 14 } },
      { so: 4, ten: "Cuội sỏi", day: null, chiTieu: { qc: 26 } }
    ],
    taiTrong: { nho: 300, trungBinh: 600, lon: 2500 },
    cloQuestion: {
      context: "Nền T-T-T-T rất tốt, mực nước ngầm (MNN) xuất hiện ở độ sâu 1.5m. Kỹ sư A đề xuất Df = 1.0m (trên MNN). Kỹ sư B đề xuất Df = 2.5m (dưới MNN) để tăng chiều sâu chôn móng cho tải N = 600 kN.",
      subQuestions: [
        { id: "a", label: "a) Mực nước ngầm ở độ sâu 1.5m ảnh hưởng như thế nào đến tính toán và thi công móng?", placeholder: "Ảnh hưởng đẩy nổi, áp lực tiêu chuẩn Rtc, biện pháp hạ mực nước ngầm..." },
        { id: "b", label: "b) Đánh giá ưu nhược điểm của Df = 1.0m và Df = 2.5m.", placeholder: "So sánh chi phí bơm nước hố đào vs kích thước đáy móng..." }
      ]
    },
    answer: {
      step1: ["Sét pha", "Cát hạt nhỏ", "Cát hạt vừa", "Cuội sỏi"],
      states: ["Nửa cứng", "Chặt vừa", "Chặt", "Rất chặt"],
      good: [true, true, true, true],
      pattern: "T-T-T-T",
      modelAnalysis: {
        a: "MNN ở 1.5m làm đất dưới MNN chịu lực đẩy nổi Archimedes (γ' = γ - 10 kN/m³), làm giảm sức chịu tải Rtc của nền và yêu cầu thi công phải có biện pháp bơm hút nước hố móng tránh bùng nền.",
        b: "Df = 1.0m (trên MNN) giúp thi công khô ráo, không tốn chi phí bơm nước hố móng, tuy nhiên kích thước đáy móng lớn hơn một chút. Df = 2.5m tuy tăng Rtc nhưng chi phí thoát nước hố móng đắt đỏ. Kết luận: Với L1 nửa cứng dày 6m, Df = 1.2 - 1.4m (trên MNN) là kinh tế và hợp lý nhất."
      },
      rubric: [
        { level: "Xuất sắc (55-60đ)", desc: "Nêu rõ ảnh hưởng dung trọng đẩy nổi γ' và chi phí thi công hố móng có nước ngầm." },
        { level: "Đạt yêu cầu (42-54đ)", desc: "Hiểu được lợi thế đặt móng trên mực nước ngầm khi đất bề mặt đủ tốt." }
      ]
    }
  },
  {
    id: "M1_B18",
    module: 1,
    dang: "T-X-T-T",
    buoc: 2,
    title: "Bài 18 – CLO: Xử lý mâu thuẫn giữa 2 hố khoan khảo sát (T-X-T-T)",
    layers: [
      { so: 1, ten: "Sét", day: 4.0, chiTieu: { w: 31, wL: 53, wP: 27 } },
      { so: 2, ten: "Bùn sét (LK2) / Sét pha (LK1)", day: 5.0, chiTieu: { NSPT: 1, qc: 0.4 } },
      { so: 3, ten: "Cát hạt trung", day: 6.0, chiTieu: { NSPT: 26 } },
      { so: 4, ten: "Cát hạt thô", day: null, chiTieu: { NSPT: 44 } }
    ],
    taiTrong: { nho: 300, trungBinh: 900, lon: 3200 },
    cloQuestion: {
      context: "Hồ sơ khảo sát địa chất gồm 2 lỗ khoan cách nhau 10m: Lỗ khoan LK1 cho thấy L2 là Sét pha dẻo mềm; Lỗ khoan LK2 cho thấy L2 là BÙN SÉT chảy rất yếu. Tải trọng cột N = 900 kN.",
      subQuestions: [
        { id: "a", label: "a) Điều này phản ánh đặc điểm gì của địa tầng công trình?", placeholder: "Đánh giá tính dị hướng, thấu kính bùn..." },
        { id: "b", label: "b) Với tư cách kỹ sư thiết kế, bạn đề xuất giải pháp gì để đảm bảo an toàn tuyệt đối?", placeholder: "Nguyên tắc thiết kế theo trường hợp bất lợi nhất..." }
      ]
    },
    answer: {
      step1: ["Sét", "Bùn sét", "Cát hạt trung", "Cát hạt thô"],
      states: ["Nửa cứng", "Chảy", "Chặt vừa", "Chặt"],
      good: [true, false, true, true],
      pattern: "T-X-T-T",
      modelAnalysis: {
        a: "Điều này chứng tỏ địa tầng có tính không đồng nhất cao theo phương ngang, xuất hiện túi/thấu kính bùn sét cục bộ ở vị trí LK2.",
        b: "Nguyên tắc thiết kế địa kỹ thuật: Phải thiên về an toàn, tính toán móng theo kịch bản bất lợi nhất (LK2 - có bùn sét). Đối với tải N = 900 kN, không được dùng móng nông mà bắt buộc thiết kế móng cọc xuyên qua L2 vào L3/L4, đồng thời kiến nghị Chủ đầu tư khoan bổ sung 1 lỗ khoan khống chế."
      },
      rubric: [
        { level: "Xuất sắc (55-60đ)", desc: "Nhận diện đúng hiện tượng thấu kính bùn và áp dụng chuẩn nguyên tắc thiết kế theo trường hợp xấu nhất." },
        { level: "Đạt yêu cầu (42-54đ)", desc: "Hiểu được cần chọn móng cọc để đề phòng rủi ro lún lệch không đều." }
      ]
    }
  },
  {
    id: "M1_B19",
    module: 1,
    dang: "X-T-T-T",
    buoc: 2,
    title: "Bài 19 – CLO: Thay đổi giải pháp móng khi thay đổi công năng (X-T-T-T)",
    layers: [
      { so: 1, ten: "Sét pha", day: 4.0, chiTieu: { w: 37, wL: 43, wP: 22 } },
      { so: 2, ten: "Sét", day: 6.0, chiTieu: { w: 29, wL: 50, wP: 26 } },
      { so: 3, ten: "Cát hạt thô", day: 7.0, chiTieu: { qc: 15 } },
      { so: 4, ten: "Cuội sỏi", day: null, chiTieu: { qc: 28 } }
    ],
    taiTrong: { nho: 400, trungBinh: 800, lon: 2000 },
    cloQuestion: {
      context: "Công trình ban đầu 5 tầng (N = 800 kN/cột). Trong quá trình thiết kế, CĐT đưa ra 2 phương án điều chỉnh: (1) Tăng lên 10 tầng (N = 2000 kN); (2) Giữ 5 tầng nhưng đào thêm tầng hầm (Df tăng từ 1.5m lên 5.0m).",
      subQuestions: [
        { id: "a", label: "a) Trong tình huống 1 (10 tầng, N = 2000 kN), phương án móng thay đổi như thế nào?", placeholder: "Giải pháp cho tải lớn..." },
        { id: "b", label: "b) Trong tình huống 2 (thêm tầng hầm, Df = 5.0m), giải pháp móng có thuận lợi gì đặc biệt?", placeholder: "Đánh giá vị trí đáy móng so với L1 và L2..." }
      ]
    },
    answer: {
      step1: ["Sét pha", "Sét", "Cát hạt thô", "Cuội sỏi"],
      states: ["Dẻo chảy", "Nửa cứng", "Chặt", "Rất chặt"],
      good: [false, true, true, true],
      pattern: "X-T-T-T",
      modelAnalysis: {
        a: "Tình huống 1: Tải tăng lên 2000 kN (tải lớn) → Bắt buộc chuyển từ móng nông sang MÓNG CỌC BTCT, hạ mũi cọc sâu vào L3 (qc=15 MPa) hoặc L4 (qc=28 MPa).",
        b: "Tình huống 2: Có tầng hầm Df = 5.0m > h1 (4m) → Đáy hầm đã vượt qua hoàn toàn lớp 1 sét pha dẻo chảy và cắm sâu 1.0m vào L2 sét nửa cứng (B=0.13 rất tốt). Đây là lợi thế cực lớn, cho phép dùng móng bè / móng đơn tự nhiên trong L2 mà không cần gia cố lớp 1."
      },
      rubric: [
        { level: "Xuất sắc (55-60đ)", desc: "Phân tích sắc bén lợi ích việc đào hầm bỏ qua lớp 1 yếu và đưa móng vào L2 tốt." },
        { level: "Đạt yêu cầu (42-54đ)", desc: "Nắm được nguyên tắc đổi sang móng cọc cho nhà cao tầng và tận dụng chiều sâu hầm." }
      ]
    }
  }
];

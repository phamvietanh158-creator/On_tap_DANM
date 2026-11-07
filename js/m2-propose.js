// M2 — máy tự đề xuất kích thước móng nông cho một lần làm (không phải sinh viên chọn).
// propose(de, attempt) xác định theo (số đề, lần làm); trang sinh viên và máy chủ cho cùng kết quả. Đề xuất "bất kỳ": có thể đạt hoặc không đạt.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./whatif-gen.js'));
  else root.M2Propose = factory(root.WhatIfGen);
})(typeof self !== 'undefined' ? self : this, function (G) {
  'use strict';
  function r1(x) { return Math.round(x * 10) / 10; }

  function propose(de, attempt) {
    var r = G.rng((Number(de[0]) * 7919 + Number(attempt) * 104729) >>> 0);
    var Ntc = Number(de[11]) / 1.15;                             // tải tiêu chuẩn (T)
    var p0 = 6 + r() * 12;                                       // áp lực trung bình mục tiêu 6–18 T/m²
    var ratio = 1 + Math.floor(r() * 7) / 10;                    // l/b = 1,0 … 1,6
    var b = Math.max(1.2, r1(Math.sqrt(Ntc / p0 / ratio)));
    var l = Math.max(b, r1(b * ratio));
    var h1 = Number(de[3]);                                      // bề dày lớp 1: đáy móng phải nằm trong lớp 1 (bảng lún chia phân tố theo lớp 1 ÷ 4, lớp 2 ÷ 8)
    var hmax = r1(Math.min(2.5, h1 - 0.3)), hmin = Math.min(1.0, hmax);
    var hm = r1(Math.max(0.5, hmin) + Math.floor(r() * (Math.round((hmax - Math.max(0.5, hmin)) * 10) + 1)) / 10);
    var h = Math.round((0.4 + Math.floor(r() * 11) * 0.05) * 100) / 100;   // 0,40 … 0,90
    var el = 3 + Math.floor(r() * 12);                           // phân tố sinh viên tính chi tiết (3…14: lớp 1 và lớp 2)
    // giá trị dùng trong câu tình huống (không vượt qua đáy lớp 1)
    var hmU = r1(Math.min(hm + 0.5, h1 - 0.1)), hmUU = r1(Math.min(hm + 1, h1 - 0.1)), hmD = r1(Math.max(0.5, hm - 0.3));
    return { hm: hm, b: b, l: l, h: h, el: el, hmU: hmU, hmUU: hmUU, hmD: hmD };
  }
  return { propose: propose };
});

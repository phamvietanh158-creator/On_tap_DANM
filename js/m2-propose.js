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
    var p0 = 10 + r() * 20;                                      // áp lực trung bình mục tiêu 10–30 T/m²
    var ratio = 1 + Math.floor(r() * 7) / 10;                    // l/b = 1,0 … 1,6
    var b = Math.max(1.2, r1(Math.sqrt(Ntc / p0 / ratio)));
    var l = Math.max(b, r1(b * ratio));
    var hm = r1(1 + Math.floor(r() * 16) / 10);                  // 1,0 … 2,5
    var h = Math.round((0.4 + Math.floor(r() * 11) * 0.05) * 100) / 100;   // 0,40 … 0,90
    return { hm: hm, b: b, l: l, h: h };
  }
  return { propose: propose };
});

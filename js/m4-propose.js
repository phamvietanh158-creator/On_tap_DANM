// M4 — máy tự đề xuất móng cọc (cọc đóng/ép) cho một lần làm. propose(de, attempt) xác định theo (số đề, lần làm).
// Đề xuất "bất kỳ": số cọc, đường kính, chiều dài, bố trí lưới cọc, đài; có thể đạt hoặc không đạt.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./whatif-gen.js'));
  else root.M4Propose = factory(root.WhatIfGen);
})(typeof self !== 'undefined' ? self : this, function (G) {
  'use strict';
  function r1(x) { return Math.round(x * 10) / 10; }
  function up1(x) { return Math.ceil(x * 10 - 1e-9) / 10; }
  var LAYOUT = { 2: [2, 1], 3: [3, 1], 4: [2, 2], 6: [3, 2], 8: [4, 2], 9: [3, 3] };      // n → [số cọc theo x, theo y]
  var SIZES = [2, 3, 4, 6, 8, 9];

  function propose(de, attempt) {
    var r = G.rng((Number(de[0]) * 6151 + Number(attempt) * 104729) >>> 0);
    var N0 = Number(de[12]);
    var Dc = [30, 35, 40][Math.floor(r() * 3)];
    var Lthuc = 12 + Math.floor(r() * 17);                         // 12 … 28 m
    var per = 45 + r() * 75;                                       // tải giả định mỗi cọc 45–120 T để chọn số cọc
    var want = Math.max(2, Math.ceil(N0 * 1.15 / per)), n = SIZES[SIZES.length - 1];
    for (var i = 0; i < SIZES.length; i++) if (SIZES[i] >= want) { n = SIZES[i]; break; }
    var nx = LAYOUT[n][0], ny = LAYOUT[n][1];
    var s = Math.round((3 * Dc / 100 + Math.floor(r() * 5) * 0.05) * 100) / 100;     // 3d … 3d + 0,2 m
    var e = Math.round((0.25 + Math.floor(r() * 3) * 0.05) * 100) / 100;             // khoảng từ mép cọc đến mép đài
    var coords = [];
    for (var a = 0; a < nx; a++) for (var b = 0; b < ny; b++)
      coords.push([Math.round((a - (nx - 1) / 2) * s * 100) / 100, Math.round((b - (ny - 1) / 2) * s * 100) / 100]);
    var l = up1((nx - 1) * s + Dc / 100 + 2 * e), bb = up1((ny - 1) * s + Dc / 100 + 2 * e);
    var hm = r1(1 + Math.floor(r() * 11) / 10);                    // 1,0 … 2,0
    var h = Math.round((0.6 + Math.floor(r() * 13) * 0.05) * 100) / 100;     // 0,60 … 1,20
    return { Lthuc: Lthuc, Dc: Dc, hm: hm, b: bb, l: l, h: h, coords: coords };
  }
  return { propose: propose };
});

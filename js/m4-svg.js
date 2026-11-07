// M4 — sơ đồ tính móng cọc (cho bài có gợi ý): hình đứng (các lớp đất, cọc, khối móng quy ước) và mặt bằng (đài, cột, cọc).
// key: 'tk' | 'spt' | 'cpt' | 'pmax' | 'pmin' | 'nen' | 'lun' | 'cot' | 'hang' | null. Minh họa, không đúng tỉ lệ tuyệt đối.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.M4Svg = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  var HI = '#d92d20', BASE = '#1b2430', LAYER = ['#e7d9b8', '#d9c9a0', '#cdbb8c', '#bfae7e'];

  function draw(r, o, key) {
    var W = 560, H = 300, s = '<svg viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Sơ đồ tính móng cọc" style="width:100%;max-width:640px;height:auto">';
    // ── hình đứng: x từ 10 đến 230 ──
    var Ltt = o.Lthuc - 0.5, zTip = o.hm + Ltt, gy = 40, sc = Math.min(11, 230 / (o.Lthuc + o.hm + 3));
    // độ dày lớp lấy từ độ dài cọc trong lớp và phần còn lại
    var y = gy, tops = [], z = 0;
    var thick = o.layerThick;                                  // [h1,h2,h3,20]
    for (var i = 0; i < 4; i++) { var hh = Math.min(thick[i], zTip + 3 - z); if (hh < 0) hh = 0; tops.push([y, hh * sc, i + 1]); y += hh * sc; z += hh; }
    tops.forEach(function (t) {
      s += '<rect x="10" y="' + t[0] + '" width="230" height="' + t[1] + '" fill="' + LAYER[t[2] - 1] + '" stroke="#9a8b64" stroke-width=".5"/>' +
        '<text x="14" y="' + (t[0] + 12) + '" font-size="10" fill="#4a3f22">Lớp ' + t[2] + '</text>';
    });
    s += '<line x1="10" y1="' + gy + '" x2="240" y2="' + gy + '" stroke="' + BASE + '"/>';
    // khối móng quy ước
    if (key === 'nen' || key === 'lun') {
      var bq = (o.b - 0.5 + 2 * Ltt * Math.tan(5 * Math.PI / 180)) * sc, cx = 125, yTip = gy + zTip * sc;   // minh họa với φtb/4 ≈ 5°
      s += '<polygon points="' + (cx - o.b * sc / 2) + ',' + (gy + o.hm * sc) + ' ' + (cx + o.b * sc / 2) + ',' + (gy + o.hm * sc) + ' ' + (cx + bq / 2) + ',' + yTip + ' ' + (cx - bq / 2) + ',' + yTip + '" fill="' + HI + '" opacity=".18" stroke="' + HI + '" stroke-dasharray="4 3"/>';
      s += '<text x="' + (cx + bq / 2 + 4) + '" y="' + (yTip - 4) + '" font-size="10" fill="' + HI + '">khối quy ước</text>';
      if (key === 'lun') s += '<rect x="' + (cx - bq / 2) + '" y="' + yTip + '" width="' + bq + '" height="' + (2.2 * sc) + '" fill="' + HI + '" opacity=".25"/>';
    }
    // đài và cọc
    var cx0 = 125, xW = o.b * sc;
    s += '<rect x="' + (cx0 - xW / 2) + '" y="' + (gy + (o.hm - o.h) * sc) + '" width="' + xW + '" height="' + (o.h * sc) + '" fill="#d6dbe1" stroke="' + BASE + '"/>';
    var colW = Math.max(6, o.bc * sc);
    s += '<rect x="' + (cx0 - colW / 2) + '" y="' + (gy - 22) + '" width="' + colW + '" height="' + (22 + (o.hm - o.h) * sc) + '" fill="#d6dbe1" stroke="' + BASE + '"/>';
    var dW = Math.max(4, o.Dc / 100 * sc), yEnd = gy + zTip * sc;
    [-0.3, 0.3].forEach(function (f) {
      var px = cx0 + f * xW;
      s += '<rect x="' + (px - dW / 2) + '" y="' + (gy + o.hm * sc) + '" width="' + dW + '" height="' + (yEnd - gy - o.hm * sc) + '" fill="' + (key === 'tk' || key === 'spt' || key === 'cpt' ? '#fbd0cc' : '#e8ecf1') + '" stroke="' + (key === 'tk' || key === 'spt' || key === 'cpt' ? HI : BASE) + '"/>';
    });
    if (key === 'tk' || key === 'spt' || key === 'cpt') {
      var lab = { tk: 'ti·li + Rn·Fc', spt: 'N·uc·L + N·Fc', cpt: 'qc/α·L + kn·qc·Fc' }[key];
      s += '<text x="14" y="' + (H - 6) + '" font-size="11" fill="' + HI + '">thân + mũi: ' + lab + '</text>';
    }
    // ── mặt bằng: x từ 270 đến 550 ──
    var pcx = 410, pcy = 150, ps = Math.min(120 / Math.max(o.l, 1), 80 / Math.max(o.b, 1));
    var l2 = o.l * ps, b2 = o.b * ps;
    s += '<rect x="' + (pcx - l2 / 2) + '" y="' + (pcy - b2 / 2) + '" width="' + l2 + '" height="' + b2 + '" fill="#eef1f5" stroke="' + BASE + '"/>';
    var lc = o.lc * ps, bc = o.bc * ps;
    if (key === 'cot') {
      var d = (o.h - 0.1) * ps;
      s += '<rect x="' + (pcx - lc / 2 - d) + '" y="' + (pcy - bc / 2 - d) + '" width="' + (lc + 2 * d) + '" height="' + (bc + 2 * d) + '" fill="' + HI + '" opacity=".15" stroke="' + HI + '" stroke-dasharray="4 3"/>';
    }
    if (key === 'hang') {
      var xs = o.coords.map(function (p) { return p[0]; }), c1 = Math.abs(Math.min.apply(null, xs)) - o.lc / 2 - o.Dc / 200, c3 = c1 + o.lc / 2;
      s += '<line x1="' + (pcx + c3 * ps) + '" y1="' + (pcy - b2 / 2) + '" x2="' + (pcx + c3 * ps) + '" y2="' + (pcy + b2 / 2) + '" stroke="' + HI + '" stroke-dasharray="4 3"/>';
    }
    s += '<rect x="' + (pcx - lc / 2) + '" y="' + (pcy - bc / 2) + '" width="' + lc + '" height="' + bc + '" fill="#c0c7d0" stroke="' + BASE + '"/>';
    var xsAll = o.coords.map(function (p) { return p[0]; }), imax = xsAll.indexOf(Math.max.apply(null, xsAll)), imin = xsAll.indexOf(Math.min.apply(null, xsAll));   // với M0 > 0: cọc xa nhất về phía +x nhận tải lớn nhất
    o.coords.forEach(function (p, i) {
      var cxp = pcx + p[0] * ps, cyp = pcy - p[1] * ps, hi = (key === 'pmax' && i === imax) || (key === 'pmin' && i === imin) ||
        (key === 'hang' && p[0] > c3);
      s += '<circle cx="' + cxp + '" cy="' + cyp + '" r="' + Math.max(5, o.Dc / 100 * ps / 2) + '" fill="' + (hi ? '#fbd0cc' : '#fff') + '" stroke="' + (hi ? HI : BASE) + '" stroke-width="' + (hi ? 2.5 : 1) + '"/>' +
        '<text x="' + cxp + '" y="' + (cyp + 3) + '" text-anchor="middle" font-size="9">' + (i + 1) + '</text>';
    });
    s += '<text x="' + pcx + '" y="' + (pcy + b2 / 2 + 16) + '" text-anchor="middle" font-size="10">mặt bằng đài: số trong cọc = số hiệu cọc</text>';
    return s + '</svg>';
  }
  return { draw: draw };
});

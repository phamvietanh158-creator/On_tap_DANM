// m6-draw.js — CLO4: bản vẽ móng sinh theo số đề (mặt bằng + mặt cắt, có chú thích số, kích thước, ký hiệu thép) và tham số để lập câu hỏi đọc bản vẽ.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.M6Draw = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function rng(seed) { var s = (seed >>> 0) || 1; return function () { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }
  function pick(r, a) { return a[Math.floor(r() * a.length)]; }
  function r2(x) { return Math.round(x * 100) / 100; }

  // ── tham số bản vẽ theo hạt giống (số đề) ──
  function params(seed) {
    var r = rng(seed * 2654435761 + 12345); r(); r();
    var p = {};
    // móng đơn: b, hm, h chọn để các giá trị trên bản vẽ khác nhau
    p.b = pick(r, [1.2, 1.4, 1.6, 1.8]); p.l = r2(p.b + pick(r, [0.4, 0.6, 0.8]));
    p.h = pick(r, [0.4, 0.5, 0.6]); p.hm = pick(r, [1.5, 1.9, 2.2, 2.5]); p.lot = 0.1;
    var cs = pick(r, [[0.3, 0.3], [0.3, 0.4], [0.4, 0.4]]); p.bc = cs[0]; p.lc = cs[1];
    p.dia = pick(r, [12, 14, 16]); p.sp = pick(r, [150, 200]); p.dia2 = pick(r, [10, 12, 14].filter(function (x) { return x !== p.dia; })); p.sp2 = pick(r, [150, 200].filter(function (x) { return x !== p.sp; }));
    p.cutDir = pick(r, ['l', 'b']);
    p.k = 1 + Math.floor(r() * 5);                                 // chú thích hỏi ở móng đơn
    p.nb = Math.floor((p.b * 1000 - 100) / p.sp) + 1;              // số thanh phương b trong bề rộng b (ước tính, trừ 50 mm bảo vệ mỗi bên)
    p.nbA = p.nb + 2; p.nbB = Math.max(1, p.nb - 2); p.nbC = p.nb + 5;
    p.scale = pick(r, [50, 100]); p.mm = pick(r, [30, 40, 50]);
    p.real = r2(p.mm * p.scale / 1000); p.real10 = r2(p.real / 10); p.real100 = r2(p.real * 10); p.realB = r2(p.real + 0.5);
    // móng cọc
    var nx = pick(r, [2, 3]), ny = 2; p.n = nx * ny; p.nx = nx; p.ny = ny;
    p.sx = pick(r, [0.9, 1.05, 1.2]); p.sy = pick(r, [0.9, 1.05, 1.2].filter(function (x) { return x !== p.sx; }));
    p.dc = pick(r, [0.3, 0.35]); p.edge = 0.3; p.hd = pick(r, [0.8, 0.9, 1.0]); p.hmc = pick(r, [1.2, 1.5]); p.Lc = pick(r, [12, 15, 18]); p.ngam = 0.1;
    p.lcoc = r2((nx - 1) * p.sx + 2 * p.edge); p.bcoc = r2((ny - 1) * p.sy + 2 * p.edge);
    p.piles = []; for (var iy = 0; iy < ny; iy++) for (var ix = 0; ix < nx; ix++) p.piles.push([r2((ix - (nx - 1) / 2) * p.sx), r2(((ny - 1) / 2 - iy) * p.sy)]);
    var cand = []; p.piles.forEach(function (q, i) { if (q[0] !== 0 && q[1] !== 0) cand.push(i); });
    p.kc = cand[Math.floor(r() * cand.length)] + 1; var q = p.piles[p.kc - 1];       // cọc hỏi tọa độ
    p.xk = q[0]; p.yk = q[1]; p.nxk = -q[0]; p.nyk = -q[1];
    p.kk = 1 + Math.floor(r() * 5);                                // chú thích hỏi ở móng cọc
    return p;
  }

  var NS = 'xmlns="http://www.w3.org/2000/svg"', INK = '#1b2430', DIM = '#1f6feb', RED = '#d92d20';
  function defs() {
    return '<defs>' +
      '<pattern id="hBT" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#e6e9ee"/><circle cx="2" cy="2" r="0.8" fill="#8a94a3"/><circle cx="6" cy="6" r="0.8" fill="#8a94a3"/></pattern>' +
      '<pattern id="hLOT" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#f4f1e6"/><path d="M0 0L8 8M8 0L0 8" stroke="#b9ad7e" stroke-width=".6"/></pattern>' +
      '<pattern id="hDAT" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#efe4cf"/><path d="M0 8L8 0" stroke="#b79d68" stroke-width=".7"/></pattern>' +
      '</defs>';
  }
  function dimH(x1, x2, y, label) {
    return '<g stroke="' + DIM + '" fill="' + DIM + '"><line x1="' + x1 + '" y1="' + y + '" x2="' + x2 + '" y2="' + y + '"/><line x1="' + x1 + '" y1="' + (y - 4) + '" x2="' + x1 + '" y2="' + (y + 4) + '"/><line x1="' + x2 + '" y1="' + (y - 4) + '" x2="' + x2 + '" y2="' + (y + 4) + '"/><text x="' + ((x1 + x2) / 2) + '" y="' + (y - 4) + '" text-anchor="middle" font-size="11" stroke="none">' + label + '</text></g>';
  }
  function dimV(x, y1, y2, label, right) {
    return '<g stroke="' + DIM + '" fill="' + DIM + '"><line x1="' + x + '" y1="' + y1 + '" x2="' + x + '" y2="' + y2 + '"/><line x1="' + (x - 4) + '" y1="' + y1 + '" x2="' + (x + 4) + '" y2="' + y1 + '"/><line x1="' + (x - 4) + '" y1="' + y2 + '" x2="' + (x + 4) + '" y2="' + y2 + '"/><text x="' + (right ? x + 6 : x - 6) + '" y="' + ((y1 + y2) / 2 + 4) + '" text-anchor="' + (right ? 'start' : 'end') + '" font-size="11" stroke="none">' + label + '</text></g>';
  }
  function callout(n, x, y, tx, ty) {
    return '<g><line x1="' + x + '" y1="' + y + '" x2="' + tx + '" y2="' + ty + '" stroke="' + INK + '" stroke-width=".8"/><circle cx="' + tx + '" cy="' + ty + '" r="9" fill="#fff" stroke="' + INK + '"/><text x="' + tx + '" y="' + (ty + 4) + '" text-anchor="middle" font-size="11" font-weight="700" fill="' + INK + '">' + n + '</text></g>';
  }
  function fm(x) { return String(r2(x)).replace('.', ','); }

  // ── bản vẽ 1: móng đơn (mặt bằng bên trái, mặt cắt A–A bên phải) ──
  function svgNong(p) {
    var W = 640, H = 330, s = '<svg viewBox="0 0 ' + W + ' ' + H + '" ' + NS + ' role="img" aria-label="Bản vẽ móng đơn" style="width:100%;max-width:700px;height:auto;background:#fff;border:1px solid #d5dae1">' + defs();
    // mặt bằng
    var ps = Math.min(150 / p.l, 120 / p.b), ox = 30, oy = 60, L = p.l * ps, B = p.b * ps;
    s += '<text x="' + (ox + L / 2) + '" y="22" text-anchor="middle" font-size="12" font-weight="700">MẶT BẰNG</text>';
    s += '<rect x="' + ox + '" y="' + oy + '" width="' + L + '" height="' + B + '" fill="url(#hBT)" stroke="' + INK + '"/>';
    for (var i = 1; i < 6; i++) { s += '<line x1="' + (ox + 8) + '" y1="' + (oy + i * B / 6) + '" x2="' + (ox + L - 8) + '" y2="' + (oy + i * B / 6) + '" stroke="#555" stroke-width=".6"/>'; s += '<line x1="' + (ox + i * L / 6) + '" y1="' + (oy + 8) + '" x2="' + (ox + i * L / 6) + '" y2="' + (oy + B - 8) + '" stroke="#555" stroke-width=".6"/>'; }
    var cw = p.lc * ps, ch = p.bc * ps;
    s += '<rect x="' + (ox + (L - cw) / 2) + '" y="' + (oy + (B - ch) / 2) + '" width="' + cw + '" height="' + ch + '" fill="#c0c7d0" stroke="' + INK + '"/>';
    s += '<text x="' + (ox + L + 6) + '" y="' + (oy + 12) + '" font-size="10">Ø' + p.dia + 'a' + p.sp + '</text><text x="' + (ox + L + 6) + '" y="' + (oy + B - 2) + '" font-size="10">Ø' + p.dia2 + 'a' + p.sp2 + '</text>';
    s += dimH(ox, ox + L, oy + B + 40, 'l = ' + fm(p.l)) + dimV(ox - 8, oy, oy + B, 'b = ' + fm(p.b));
    // đường cắt A–A
    if (p.cutDir === 'l') s += '<line x1="' + (ox - 10) + '" y1="' + (oy + B / 2) + '" x2="' + (ox + L + 10) + '" y2="' + (oy + B / 2) + '" stroke="' + RED + '" stroke-dasharray="6 3"/><text x="' + (ox - 14) + '" y="' + (oy + B / 2 + 4) + '" font-size="12" fill="' + RED + '" text-anchor="end">A</text><text x="' + (ox + L + 14) + '" y="' + (oy + B / 2 + 4) + '" font-size="12" fill="' + RED + '">A</text>';
    else s += '<line x1="' + (ox + L / 2) + '" y1="' + (oy - 10) + '" x2="' + (ox + L / 2) + '" y2="' + (oy + B + 10) + '" stroke="' + RED + '" stroke-dasharray="6 3"/><text x="' + (ox + L / 2) + '" y="' + (oy - 14) + '" font-size="12" fill="' + RED + '" text-anchor="middle">A</text><text x="' + (ox + L / 2) + '" y="' + (oy + B + 22) + '" font-size="12" fill="' + RED + '" text-anchor="middle">A</text>';
    // mặt cắt A–A
    var cut = p.cutDir === 'l' ? p.l : p.b, cutCol = p.cutDir === 'l' ? p.lc : p.bc;
    var vs = Math.min(60, 140 / p.hm), sx0 = 360, wS = Math.min(200, cut * 110), sc = wS / cut, x0 = sx0 + (240 - wS) / 2 - 10;
    var gy = 80, yb = gy + p.hm * vs - p.h * vs, yb2 = gy + p.hm * vs, ylot = yb2 + Math.max(7, p.lot * vs);
    s += '<text x="' + (sx0 + 120) + '" y="22" text-anchor="middle" font-size="12" font-weight="700">MẶT CẮT A–A</text>';
    s += '<rect x="' + (sx0 - 10) + '" y="' + gy + '" width="270" height="' + (ylot - gy + 50) + '" fill="url(#hDAT)"/>';
    s += '<line x1="' + (sx0 - 10) + '" y1="' + gy + '" x2="' + (sx0 + 260) + '" y2="' + gy + '" stroke="' + INK + '" stroke-width="1.4"/><text x="' + (sx0 - 12) + '" y="' + (gy - 4) + '" font-size="10" text-anchor="end">±0,00</text>';
    s += '<rect x="' + x0 + '" y="' + yb + '" width="' + wS + '" height="' + (p.h * vs) + '" fill="url(#hBT)" stroke="' + INK + '"/>';
    var ccw = cutCol * sc;
    s += '<rect x="' + (x0 + (wS - ccw) / 2) + '" y="' + (gy - 45) + '" width="' + ccw + '" height="' + (yb - gy + 45) + '" fill="url(#hBT)" stroke="' + INK + '"/>';
    s += '<rect x="' + (x0 - 6) + '" y="' + yb2 + '" width="' + (wS + 12) + '" height="' + (ylot - yb2) + '" fill="url(#hLOT)" stroke="' + INK + '"/>';
    s += '<line x1="' + (x0 + 6) + '" y1="' + (yb2 - 6) + '" x2="' + (x0 + wS - 6) + '" y2="' + (yb2 - 6) + '" stroke="#222" stroke-width="2.2"/>';
    s += '<text x="' + (x0 + wS / 2) + '" y="' + (yb2 + 14 + 9) + '" font-size="10" text-anchor="middle" fill="' + INK + '">Ø' + (p.cutDir === 'l' ? p.dia : p.dia2) + 'a' + (p.cutDir === 'l' ? p.sp : p.sp2) + '</text>';
    s += dimV(x0 - 16, yb, yb2, 'h = ' + fm(p.h)) + dimV(x0 - 74, gy, yb2, 'hm = ' + fm(p.hm)) + dimH(x0, x0 + wS, ylot + 40, (p.cutDir === 'l' ? 'l' : 'b') + ' = ' + fm(cut));
    var tx = x0 + wS + 40;
    s += callout(1, x0 + wS / 2 + ccw / 2, gy - 25, tx, gy - 34) + callout(2, x0 + wS - 6, yb + p.h * vs / 2, tx, yb - 18) + callout(4, x0 + wS - 14, yb2 - 6, tx, yb2 + 2) + callout(3, x0 + wS - 4, ylot - 3, tx, ylot + 22) +
         callout(5, x0 - 8, ylot + 14, x0 - 40, ylot + 34);
    s += '<text x="16" y="' + (H - 14) + '" font-size="10" fill="#444">Tỉ lệ 1:' + p.scale + ' · Kích thước tính bằng m, thép tính bằng mm</text>';
    return s + '</svg>';
  }

  // ── bản vẽ 2: móng cọc (mặt bằng đài + mặt cắt) ──
  function svgCoc(p) {
    var W = 640, H = 340, s = '<svg viewBox="0 0 ' + W + ' ' + H + '" ' + NS + ' role="img" aria-label="Bản vẽ móng cọc" style="width:100%;max-width:700px;height:auto;background:#fff;border:1px solid #d5dae1">' + defs();
    var ps = Math.min(170 / p.lcoc, 110 / p.bcoc), ox = 50, oy = 60, L = p.lcoc * ps, B = p.bcoc * ps, cx = ox + L / 2, cy = oy + B / 2;
    s += '<text x="' + cx + '" y="22" text-anchor="middle" font-size="12" font-weight="700">MẶT BẰNG ĐÀI CỌC</text>';
    s += '<rect x="' + ox + '" y="' + oy + '" width="' + L + '" height="' + B + '" fill="url(#hBT)" stroke="' + INK + '"/>';
    s += '<rect x="' + (cx - 0.15 * ps) + '" y="' + (cy - 0.15 * ps) + '" width="' + (0.3 * ps) + '" height="' + (0.3 * ps) + '" fill="#c0c7d0" stroke="' + INK + '"/>';
    p.piles.forEach(function (q, i) {
      var px = cx + q[0] * ps, py = cy - q[1] * ps;
      s += '<circle cx="' + px + '" cy="' + py + '" r="' + (p.dc * ps / 2) + '" fill="#fff" stroke="' + INK + '"/><text x="' + px + '" y="' + (py + 4) + '" text-anchor="middle" font-size="11" font-weight="700">C' + (i + 1) + '</text>';
    });
    var x1 = cx + p.piles[0][0] * ps, y1 = cy - p.piles[0][1] * ps, y2 = cy - p.piles[p.nx][1] * ps;
    s += dimH(x1, cx + p.piles[1][0] * ps, oy - 14, fm(p.sx)) + dimV(ox - 10, y1, y2, fm(p.sy)) + dimH(ox, x1, oy + B + 16, fm(p.edge)) + dimH(ox, ox + L, oy + B + 36, 'l = ' + fm(p.lcoc)) + dimV(ox + L + 56, oy, oy + B, 'b = ' + fm(p.bcoc));
    s += '<text x="' + ox + '" y="' + (oy + B + 62) + '" font-size="11">Cọc tiết diện tròn Ø' + fm(p.dc * 100) + ' cm</text>';
    // mặt cắt
    var sx0 = 380, vs = 28, gy = 70, yb = gy + p.hmc * vs, yd = yb + p.hd * 30, ylot = yd + 8, wS = 190, x0 = sx0 + 20, pw = Math.max(10, p.dc * 34), emb = 10;
    s += '<text x="' + (sx0 + 120) + '" y="22" text-anchor="middle" font-size="12" font-weight="700">MẶT CẮT</text>';
    s += '<rect x="' + (sx0 - 10) + '" y="' + gy + '" width="270" height="' + (H - gy - 30) + '" fill="url(#hDAT)"/><line x1="' + (sx0 - 10) + '" y1="' + gy + '" x2="' + (sx0 + 260) + '" y2="' + gy + '" stroke="' + INK + '" stroke-width="1.4"/><text x="' + (sx0 - 12) + '" y="' + (gy - 4) + '" font-size="10" text-anchor="end">±0,00</text>';
    s += '<rect x="' + x0 + '" y="' + yb + '" width="' + wS + '" height="' + (yd - yb) + '" fill="url(#hBT)" stroke="' + INK + '"/>';
    s += '<rect x="' + (x0 + wS / 2 - 14) + '" y="' + (gy - 40) + '" width="28" height="' + (yb - gy + 40) + '" fill="url(#hBT)" stroke="' + INK + '"/>';
    s += '<rect x="' + (x0 - 6) + '" y="' + yd + '" width="' + (wS + 12) + '" height="' + (ylot - yd) + '" fill="url(#hLOT)" stroke="' + INK + '"/>';
    [-0.3, 0.3].forEach(function (f) { var px = x0 + wS / 2 + f * wS; s += '<rect x="' + (px - pw / 2) + '" y="' + (yd - emb) + '" width="' + pw + '" height="' + (H - 40 - yd + emb) + '" fill="#fff" stroke="' + INK + '"/><path d="M' + (px - pw / 2) + ' ' + (H - 80) + ' l' + pw + ' 8 M' + (px - pw / 2) + ' ' + (H - 74) + ' l' + pw + ' 8" stroke="' + INK + '" stroke-width="1.2"/>'; });
    var pxr = x0 + wS / 2 + 0.3 * wS;
    s += dimV(x0 - 16, yb, yd, fm(p.hd)) + dimV(x0 - 56, gy, yb, fm(p.hmc)) + dimV(x0 + wS + 52, yd, H - 40, 'Lc = ' + fm(p.Lc)) + dimV(pxr - pw / 2 - 12, yd - emb, yd, fm(p.ngam));
    s += callout(1, x0 + wS / 2 + 14, gy - 26, x0 + wS / 2 + 44, gy - 34) + callout(2, x0 + wS - 4, yb + 10, x0 + wS + 24, yb - 14) + callout(5, pxr + pw / 2, yd - 3, x0 + wS + 24, yd + 10) +
         callout(3, pxr + pw / 2, yd + 80, x0 + wS + 24, yd + 60) + callout(4, x0 + 10, ylot - 3, x0 - 30, ylot + 22);
    s += '<text x="16" y="' + (H - 12) + '" font-size="10" fill="#444">Cọc vẽ đứt đoạn (không theo tỉ lệ chiều dài) · Kích thước tính bằng m</text>';
    return s + '</svg>';
  }

  return { params: params, svgNong: svgNong, svgCoc: svgCoc };
});

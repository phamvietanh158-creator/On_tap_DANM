// M2 — sơ đồ tính SVG (cho bài có gợi ý): tô vùng ứng với điều kiện cột A mà sinh viên chọn.
// key: 'ptx' | 'pmax' | 'pmin' | 'S' | 'punch' | null.  Sơ đồ minh họa, không đúng tỉ lệ tuyệt đối.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.M2Svg = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  var HI = '#d92d20', BASE = '#1b2430', SOIL = '#c9b08a';

  function draw(r, o, key) {
    var W = 360, H = 300, cx = 180, gy = 70;                 // gy: cao độ mặt đất
    var bw = Math.max(70, Math.min(200, o.b * 80));          // bề rộng đáy móng vẽ
    var hm = Math.max(30, Math.min(70, o.hm * 30)), x0 = cx - bw / 2, x1 = cx + bw / 2, yb = gy + hm;
    var hf = Math.max(14, Math.min(40, o.h * 50)), colW = 28;
    var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Sơ đồ tính móng nông" style="width:100%;max-width:420px;height:auto">';
    s += '<rect x="0" y="' + gy + '" width="' + W + '" height="' + (H - gy) + '" fill="' + SOIL + '" opacity=".35"/>';
    s += '<line x1="0" y1="' + gy + '" x2="' + W + '" y2="' + gy + '" stroke="' + BASE + '"/>';
    // vùng chịu nén cho điều kiện lún
    if (key === 'S') s += '<polygon points="' + x0 + ',' + yb + ' ' + x1 + ',' + yb + ' ' + (x1 + 20) + ',' + (yb + 100) + ' ' + (x0 - 20) + ',' + (yb + 100) + '" fill="' + HI + '" opacity=".25"/>' +
      '<text x="' + cx + '" y="' + (yb + 55) + '" text-anchor="middle" font-size="11" fill="' + HI + '">vùng chịu nén (σz ≥ 0,2σbt)</text>';
    // thân móng + cột
    s += '<rect x="' + x0 + '" y="' + (yb - hf) + '" width="' + bw + '" height="' + hf + '" fill="#d6dbe1" stroke="' + BASE + '"/>';
    s += '<rect x="' + (cx - colW / 2) + '" y="' + (gy - 40) + '" width="' + colW + '" height="' + (yb - hf - gy + 40) + '" fill="#d6dbe1" stroke="' + BASE + '"/>';
    // tháp chọc thủng 45°
    if (key === 'punch') {
      var d = hf, yt = yb - hf;
      s += '<polygon points="' + (cx - colW / 2) + ',' + yt + ' ' + (cx + colW / 2) + ',' + yt + ' ' + (cx + colW / 2 + d) + ',' + yb + ' ' + (cx - colW / 2 - d) + ',' + yb + '" fill="' + HI + '" opacity=".3" stroke="' + HI + '"/>' +
        '<text x="' + (x1 + 4) + '" y="' + (yt + 4) + '" font-size="11" fill="' + HI + '">tháp 45°</text>';
    }
    // tải
    s += '<line x1="' + cx + '" y1="' + (gy - 55) + '" x2="' + cx + '" y2="' + (gy - 42) + '" stroke="' + BASE + '" stroke-width="2"/><text x="' + (cx + 6) + '" y="' + (gy - 45) + '" font-size="11">N0, M0</text>';
    // biểu đồ áp lực: hình thang dưới đáy móng
    var pm = Math.max(r.pmax, 1e-6), scale = 50 / pm, hL = Math.max(0, r.pmin) * scale, hR = r.pmax * scale, yp = yb + 6;
    var colL = key === 'pmin' ? HI : '#1f6feb', colR = key === 'pmax' ? HI : '#1f6feb', colM = key === 'ptx' ? HI : '#1f6feb';
    s += '<polygon points="' + x0 + ',' + yp + ' ' + x1 + ',' + yp + ' ' + x1 + ',' + (yp + hR) + ' ' + x0 + ',' + (yp + hL) + '" fill="' + (key === 'ptx' ? HI : '#1f6feb') + '" opacity=".22" stroke="' + colM + '"/>';
    s += '<line x1="' + x0 + '" y1="' + yp + '" x2="' + x0 + '" y2="' + (yp + hL) + '" stroke="' + colL + '" stroke-width="' + (key === 'pmin' ? 4 : 2) + '"/>';
    s += '<line x1="' + x1 + '" y1="' + yp + '" x2="' + x1 + '" y2="' + (yp + hR) + '" stroke="' + colR + '" stroke-width="' + (key === 'pmax' ? 4 : 2) + '"/>';
    s += '<text x="' + (x0 - 4) + '" y="' + (yp + hL + 12) + '" text-anchor="end" font-size="11" fill="' + colL + '">pmin</text>';
    s += '<text x="' + (x1 + 4) + '" y="' + (yp + hR + 12) + '" font-size="11" fill="' + colR + '">pmax</text>';
    s += '<text x="' + cx + '" y="' + (yp + Math.max(hL, hR) + 28) + '" text-anchor="middle" font-size="11" fill="' + colM + '">ptx = N/(b·l) + 2hm</text>';
    // kích thước
    s += '<text x="' + (x0 - 6) + '" y="' + ((gy + yb) / 2 + 4) + '" text-anchor="end" font-size="11">hm</text>';
    s += '<text x="' + cx + '" y="' + (yp + Math.max(hL, hR) + 46) + '" text-anchor="middle" font-size="11">b = ' + o.b + ' m, hm = ' + o.hm + ' m</text>';
    return s + '</svg>';
  }
  return { draw: draw };
});

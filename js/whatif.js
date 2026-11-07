// whatif.js — khung câu hỏi tình huống "nếu thay đổi … thì …" sinh từ chính số liệu của sinh viên; đáp án do engine tính (chỉ ở máy chủ/bản thử).
// Mẫu câu (TPL) gồm: id, text (có chỗ {tên} hoặc {tên+số}), o (các lựa chọn), multi, truth(ctx) → mảng chỉ số lựa chọn đúng.
// Phần công khai (describe) không chứa truth.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.WhatIf = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  var KEYS = 'abcdefgh';

  function num(x) { return String(Math.round(x * 100) / 100).replace('.', ','); }
  function fmt(text, dims) {                                  // {b} → giá trị; {b+0.6} → giá trị + 0,6
    return text.replace(/\{(\w+)(?:([+-])([\d.]+))?\}/g, function (_, k, sg, add) { return num(Number(dims[k]) + (add ? (sg === '-' ? -1 : 1) * Number(add) : 0)); });
  }
  // tpls: danh sách mẫu; trả các câu cho một bộ kích thước (không có đáp án)
  function describe(tpls, dims) {
    return tpls.map(function (t) {
      return { id: t.id, q: fmt(t.text, dims), multi: !!t.multi, matrix: !!t.matrix, rows: t.rows ? t.rows.map(function (x) { return fmt(x, dims); }) : null, draw: t.draw, o: t.o.map(function (x, i) { return { k: KEYS[i], t: fmt(x, dims) }; }) };
    });
  }
  // ctx do module M2/M4 dựng; trả {id: [khóa đúng]}
  function truthMap(tpls, ctx) {
    var out = {};
    tpls.forEach(function (t) { out[t.id] = t.truth(ctx).map(function (i) { return KEYS[i]; }); });
    return out;
  }
  function score(good, picked) {                               // một đáp án: 1/0; nhiều đáp án: (đúng − sai)/số đúng
    var p = (picked || []).filter(function (x, i, a) { return a.indexOf(x) === i; });
    if (!p.length) return 0;
    var ok = p.filter(function (k) { return good.indexOf(k) >= 0; }).length, bad = p.length - ok;
    if (good.length === 1) return ok === 1 && bad === 0 ? 1 : 0;
    return Math.max(0, (ok - bad) / good.length);
  }
  function scoreMatrix(good, picked) {                         // nối từng điều kiện: điểm = tỉ lệ dòng đúng
    var ok = 0; for (var i = 0; i < good.length; i++) if (picked && picked[i] === good[i]) ok++;
    return good.length ? ok / good.length : 0;
  }
  function grade(tpls, ctx, answers, dims) {
    var truth = truthMap(tpls, ctx), items = [], sum = 0;
    tpls.forEach(function (t) {
      var s = t.matrix ? scoreMatrix(truth[t.id], (answers || {})[t.id]) : score(truth[t.id], (answers || {})[t.id]); sum += s;
      items.push({ id: t.id, q: fmt(t.text, dims), matrix: !!t.matrix, rows: t.rows ? t.rows.map(function (x) { return fmt(x, dims); }) : null, score: s, correct: truth[t.id], picked: (answers || {})[t.id] || [], o: t.o.map(function (x, i) { return { k: KEYS[i], t: fmt(x, dims) }; }), why: t.why, note: t.note ? t.note(ctx) : '' });
    });
    return { n: tpls.length, sum: sum, mean: tpls.length ? sum / tpls.length : 0, items: items };
  }
  return { KEYS: KEYS, fmt: fmt, describe: describe, truthMap: truthMap, score: score, grade: grade };
});

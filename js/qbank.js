// qbank.js — chọn câu hỏi, xáo lựa chọn và chấm câu chọn đáp án (một đáp án hoặc nhiều đáp án).
// Câu một đáp án: đúng 1 điểm. Câu nhiều đáp án: (số lựa chọn đúng − số lựa chọn sai)/số đáp án đúng, không âm.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.QBank = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function rng(seed) { var s = (seed >>> 0) || 1; return function () { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }
  function shuffle(arr, seed) {
    var a = arr.slice(), r = rng(seed);
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  // f: {clo, mod, tp, lv}; chọn n câu theo hạt giống, xen kẽ theo chủ đề để bộ câu đa dạng
  function select(bank, f, n, seed) {
    f = f || {};
    var pool = bank.filter(function (q) {
      return (!f.clo || q.clo === +f.clo) && (!f.mod || q.mod === f.mod) && (!f.tp || q.tp === f.tp) && (!f.lv || q.lv === +f.lv);
    });
    var sh = shuffle(pool, seed), byTp = {}, order = [];
    sh.forEach(function (q) { if (!byTp[q.tp]) { byTp[q.tp] = []; order.push(q.tp); } byTp[q.tp].push(q); });
    var out = [], k = 0;
    while (out.length < Math.min(n, pool.length)) {                  // vòng tròn qua các chủ đề
      var tp = order[k % order.length];
      if (byTp[tp].length) out.push(byTp[tp].shift());
      k++;
      if (k > 100000) break;
    }
    return out;
  }
  function score(item, picked) {                                       // item.a: mảng khóa đúng; picked: mảng khóa đã chọn
    var good = item.a, p = (picked || []).filter(function (x, i, arr) { return arr.indexOf(x) === i; });
    if (!p.length) return 0;
    var ok = p.filter(function (k) { return good.indexOf(k) >= 0; }).length, bad = p.length - ok;
    if (good.length === 1) return ok === 1 && bad === 0 ? 1 : 0;
    return Math.max(0, (ok - bad) / good.length);
  }
  // full: bộ câu có đáp án; answers: {id: [khóa,...]}; trả điểm từng câu và tổng hợp theo chủ đề
  function grade(full, ids, answers) {
    var byId = {}; full.forEach(function (q) { byId[q.id] = q; });
    var items = [], sum = 0, topic = {};
    ids.forEach(function (id) {
      var q = byId[id]; if (!q) return;
      var s = score(q, answers[id]); sum += s;
      var t = topic[q.tp] || (topic[q.tp] = { n: 0, s: 0 }); t.n++; t.s += s;
      items.push({ id: id, score: s, picked: answers[id] || [], correct: q.a, why: q.w, tp: q.tp });
    });
    return { n: items.length, sum: sum, mean: items.length ? sum / items.length : 0, items: items, topic: topic };
  }
  return { shuffle: shuffle, select: select, score: score, grade: grade };
});

// whatif-gen.js — sinh hàng trăm câu tình huống "nếu thay đổi … thì …" từ một bản mô tả (spec) của module.
// Mỗi mẫu câu: { id, fam, vk, mk, text, o[], multi, why, truth(ctx) → mảng chỉ số đúng, note(ctx) → chuỗi số liệu thật }.
// Mỗi lần làm bài chọn một bộ (select) theo seed; trang sinh viên chỉ có text/o (không có truth), máy chủ có đủ.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.WhatIfGen = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function rng(seed) {                                         // mulberry32
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0; var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function shuffled(arr, seed) {
    var a = arr.slice(), r = rng(seed);
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function rel(a, b) { return (b - a) / Math.max(Math.abs(a), Math.abs(b), 1e-9); }
  function argmax(a) { var b = 0; for (var i = 1; i < a.length; i++) if (a[i] > a[b]) b = i; return b; }
  function argmin(a) { var b = 0; for (var i = 1; i < a.length; i++) if (a[i] < a[b]) b = i; return b; }
  function n2(x) { return (Math.round(x * 100) / 100).toFixed(2).replace('.', ','); }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function pc(x) { return (x >= 0 ? '+' : '') + (Math.round(x * 1000) / 10).toFixed(1).replace('.', ',') + '%'; }

  var QUOTA = [['D', 6], ['G', 3], ['M', 5], ['R', 3], ['C', 2], ['K', 3], ['F', 2], ['H', 2]];

  // spec: { vars:[{id,text,why,group,ov(c)→{d,de}}], metrics:[{id,name,unit,get(r),why}], conds:[{id,name,ratio(r)}],
  //         changeMetrics:[ids], ranks:[{metric,mode,vars:[ids]}], pairMetrics:[ids], hand:[tpl...] }
  function build(spec) {
    var V = {}, M = {}, out = [];
    spec.vars.forEach(function (v) { V[v.id] = v; });
    spec.metrics.forEach(function (m) { M[m.id] = m; });
    function run(c, v) { var o = v.ov(c); return c.run(o.d, o.de); }
    function metricsNote(c, r1, m) { return cap(m.name) + ': ' + n2(m.get(c.r0)) + ' → ' + n2(m.get(r1)) + ' ' + m.unit + ' (' + pc(rel(m.get(c.r0), m.get(r1))) + ').'; }

    // D — chiều thay đổi của một đại lượng
    spec.vars.forEach(function (v) {
      spec.metrics.forEach(function (m) {
        out.push({ id: 'D.' + v.id + '.' + m.id, fam: 'D', vk: v.id, mk: m.id,
          text: 'Giữ nguyên mọi số liệu khác, ' + v.text + '. ' + cap(m.name) + ' thay đổi thế nào?',
          o: ['Giảm rõ rệt (hơn 5%)', 'Gần như không đổi (trong ±5%)', 'Tăng rõ rệt (hơn 5%)'],
          why: cap(m.why) + ' ' + v.why,
          truth: function (c) { var x = rel(m.get(c.r0), m.get(run(c, v))); return [x < -0.05 ? 0 : (x > 0.05 ? 2 : 1)]; },
          note: function (c) { return metricsNote(c, run(c, v), m); } });
      });
    });

    // G — điều kiện có hệ số sử dụng lớn nhất sau thay đổi
    spec.vars.forEach(function (v) {
      out.push({ id: 'G.' + v.id, fam: 'G', vk: v.id, mk: 'G',
        text: 'Giữ nguyên mọi số liệu khác, ' + v.text + '. Sau thay đổi, điều kiện nào có hệ số sử dụng (giá trị tính / giá trị giới hạn) LỚN NHẤT?',
        o: spec.conds.map(function (k) { return k.name; }),
        why: 'Hệ số sử dụng càng gần hoặc vượt 1 thì điều kiện càng khống chế thiết kế. ' + v.why,
        truth: function (c) { var r1 = run(c, v); return [argmax(spec.conds.map(function (k) { return k.ratio(r1); }))]; },
        note: function (c) { var r1 = run(c, v); return 'Hệ số sử dụng sau thay đổi: ' + spec.conds.map(function (k) { return k.name + ' = ' + n2(k.ratio(r1)); }).join('; ') + '.'; } });
    });

    // M — NỐI toàn bộ điều kiện: mỗi câu là một kịch bản (một hoặc hai thay đổi), sinh viên chọn trạng thái cho TẤT CẢ điều kiện
    var STATES = ['Thỏa, còn dư (hệ số sử dụng dưới 0,9)', 'Thỏa nhưng sát giới hạn (từ 0,9 đến 1,0)', 'Không thỏa (vượt 1,0)'];
    function ax(v) { return v.axis || v.id; }
    function scen(list) {                                     // list: 1 hoặc 2 thay đổi
      var txt = list.map(function (v) { return v.text; }).join(', đồng thời ');
      var why = list.map(function (v) { return v.why; }).join(' ');
      var ov = function (c) { var d = {}, e = {}; list.forEach(function (v) { var o = v.ov(c); Object.keys(o.d || {}).forEach(function (k) { d[k] = o.d[k]; }); Object.keys(o.de || {}).forEach(function (k) { e[k] = o.de[k]; }); }); return { d: d, de: e }; };
      return { txt: txt, why: why, ov: ov };
    }
    function pushM(list, id) {
      var sc = scen(list);
      out.push({ id: 'M.' + id, fam: 'M', vk: list[0].id, mk: 'M', matrix: true,
        text: 'Giữ nguyên mọi số liệu khác, ' + sc.txt + '. Với phương án sau khi thay đổi, hãy NỐI từng điều kiện với trạng thái của nó.',
        rows: spec.conds.map(function (k) { return k.name; }), o: STATES,
        why: 'Điều kiện thỏa khi hệ số sử dụng ≤ 1. ' + sc.why,
        truth: function (c) { var o = sc.ov(c), r1 = c.run(o.d, o.de); return spec.conds.map(function (k) { var x = k.ratio(r1); return x > 1 ? 2 : (x >= 0.9 ? 1 : 0); }); },
        note: function (c) { var o = sc.ov(c), r1 = c.run(o.d, o.de); return 'Hệ số sử dụng sau thay đổi: ' + spec.conds.map(function (k) { return k.name + ' = ' + n2(k.ratio(r1)); }).join('; ') + '.'; } });
    }
    spec.vars.forEach(function (v) { pushM([v], v.id); });
    spec.vars.forEach(function (va, i) { spec.vars.forEach(function (vb, j) {
      if (j <= i || ax(va) === ax(vb)) return;
      pushM([va, vb], va.id + '+' + vb.id);
    }); });

    // R — xếp hạng bốn thay đổi (áp dụng riêng)
    (spec.ranks || []).forEach(function (rk) {
      var m = M[rk.metric], vs = rk.vars.map(function (id) { return V[id]; }), low = rk.mode === 'min';
      out.push({ id: 'R.' + rk.metric + '.' + rk.mode + '.' + rk.vars.join('+'), fam: 'R', vk: rk.vars[0], mk: rk.metric,
        text: 'Áp dụng RIÊNG từng thay đổi sau (mỗi lần chỉ đổi một thứ, mọi số liệu khác giữ nguyên). Thay đổi nào làm ' + m.name + (low ? ' GIẢM NHIỀU NHẤT?' : ' TĂNG NHIỀU NHẤT?'),
        o: vs.map(function (v) { return cap(v.text); }).concat(['Các thay đổi cho kết quả như nhau (chênh nhau dưới 1%)']),
        why: cap(m.why) + ' Muốn so sánh phải tính từng phương án, không suy đoán theo độ lớn của thay đổi.',
        truth: function (c) {
          var d = vs.map(function (v) { return rel(m.get(c.r0), m.get(run(c, v))); }), idx = low ? argmin(d) : argmax(d);
          var rest = d.filter(function (x, i) { return i !== idx; }), best = d[idx], second = low ? Math.min.apply(null, rest) : Math.max.apply(null, rest);
          return [Math.abs(best - second) < 0.01 ? 4 : idx];
        },
        note: function (c) { return 'Thay đổi từng thay đổi: ' + vs.map(function (v, i) { return (i + 1) + ') ' + pc(rel(m.get(c.r0), m.get(run(c, v)))); }).join('; ') + '.'; } });
    });

    // C — chọn tất cả đại lượng có thay đổi
    spec.vars.forEach(function (v) {
      var ms = spec.changeMetrics.map(function (id) { return M[id]; });
      out.push({ id: 'C.' + v.id, fam: 'C', vk: v.id, mk: 'C', multi: true,
        text: 'Giữ nguyên mọi số liệu khác, ' + v.text + '. Chọn TẤT CẢ đại lượng CÓ thay đổi giá trị (thay đổi hơn 0,5%).',
        o: ms.map(function (m) { return cap(m.name); }).concat(['Không đại lượng nào thay đổi']),
        why: 'Mỗi đại lượng chỉ phụ thuộc vào một số thông số; đổi thông số không liên quan thì đại lượng giữ nguyên. ' + v.why,
        truth: function (c) { var r1 = run(c, v), o = []; ms.forEach(function (m, i) { if (Math.abs(rel(m.get(c.r0), m.get(r1))) > 0.005) o.push(i); }); return o.length ? o : [ms.length]; },
        note: function (c) { var r1 = run(c, v); return ms.map(function (m) { return cap(m.name) + ' ' + pc(rel(m.get(c.r0), m.get(r1))); }).join('; ') + '.'; } });
    });

    // K — so sánh hai phương án
    var groupOf = function (v) { return v.group; };
    spec.vars.forEach(function (va, i) { spec.vars.forEach(function (vb, j) {
      if (j <= i) return;
      var a = va, b = vb;
      if (groupOf(a) !== 'geo' || groupOf(b) !== 'geo' || a.axis === b.axis || a.axis === 'h' || b.axis === 'h') return;
      if ((i + j) % 2) { var tmp = a; a = b; b = tmp; }                        // đổi chỗ để phương án đúng không dồn vào một phía
      (spec.pairMetrics || []).forEach(function (mid) {
        var m = M[mid];
        out.push({ id: 'K.' + a.id + '.' + b.id + '.' + mid, fam: 'K', vk: a.id, mk: mid,
          text: 'Hai phương án sửa móng (mỗi phương án chỉ đổi một thứ, mọi số liệu khác giữ nguyên). Phương án 1: ' + a.text + '. Phương án 2: ' + b.text + '. Phương án nào cho ' + m.name + ' NHỎ HƠN?',
          o: ['Phương án 1', 'Phương án 2', 'Như nhau (chênh nhau dưới 1%)'],
          why: cap(m.why) + ' Hai thay đổi tác động lên đại lượng này với mức khác nhau nên phải tính từng phương án.',
          truth: function (c) { var x = m.get(run(c, a)), y = m.get(run(c, b)); return [Math.abs(rel(x, y)) < 0.01 ? 2 : (x < y ? 0 : 1)]; },
          note: function (c) { return 'Phương án 1: ' + n2(m.get(run(c, a))) + ' ' + m.unit + '; phương án 2: ' + n2(m.get(run(c, b))) + ' ' + m.unit + '.'; } });
      });
    }); });

    // F — điều kiện đầu tiên bị vi phạm
    spec.vars.forEach(function (v) {
      out.push({ id: 'F.' + v.id, fam: 'F', vk: v.id, mk: 'F',
        text: 'Giữ nguyên mọi số liệu khác, ' + v.text + '. Điều kiện nào bị vi phạm NẶNG NHẤT (hệ số sử dụng lớn nhất và vượt 1,0)?',
        o: spec.conds.map(function (k) { return k.name; }).concat(['Không điều kiện nào bị vi phạm']),
        why: 'Điều kiện vi phạm nặng nhất là điều kiện có hệ số sử dụng lớn nhất khi hệ số đó vượt 1,0. ' + v.why,
        truth: function (c) { var x = spec.conds.map(function (k) { return k.ratio(run(c, v)); }), i = argmax(x); return [x[i] > 1 ? i : spec.conds.length]; },
        note: function (c) { var r1 = run(c, v); return 'Hệ số sử dụng: ' + spec.conds.map(function (k) { return k.name + ' = ' + n2(k.ratio(r1)); }).join('; ') + '.'; } });
    });

    // H — câu viết tay
    (spec.hand || []).forEach(function (t) { t.fam = 'H'; t.vk = t.vk || t.id; t.mk = t.mk || 'H'; out.push(t); });
    return out;
  }

  // Chọn bộ câu cho một lần làm: theo họ, ngẫu nhiên theo seed, hạn chế lặp cùng thông số / cùng đại lượng
  function select(tpls, seed, quota, triv) {
    var res = []; triv = triv || {};
    (quota || QUOTA).forEach(function (q, qi) {
      var pool = shuffled(tpls.filter(function (t) { return t.fam === q[0]; }), seed * 31 + qi * 977 + 5), got = [], usedV = {}, usedM = {}, nTriv = 0, maxTriv = q[0] === 'D' ? 2 : 1;
      for (var pass = 0; pass < 2 && got.length < q[1]; pass++) {
        pool.forEach(function (t) {
          if (got.length >= q[1] || got.indexOf(t) >= 0) return;
          if (pass === 0 && ((usedV[t.vk] || 0) >= 1 || (usedM[t.mk] || 0) >= 2)) return;
          if (q[0] !== 'H' && triv[t.id] && nTriv >= maxTriv && (pass === 0 || nTriv >= q[1])) return;
          if (triv[t.id]) nTriv++;
          got.push(t); usedV[t.vk] = (usedV[t.vk] || 0) + 1; usedM[t.mk] = (usedM[t.mk] || 0) + 1;
        });
      }
      res = res.concat(got);
    });
    return shuffled(res, seed * 7 + 3);
  }

  // Tính lại có nhớ kết quả (nhiều câu dùng cùng một thay đổi)
  function memoRun(fn) {
    var cache = {};
    return function (dOver, deOver) {
      var k = JSON.stringify([dOver || null, deOver || null]);
      return cache[k] || (cache[k] = fn(dOver, deOver));
    };
  }

  return { rng: rng, shuffled: shuffled, build: build, select: select, memoRun: memoRun, QUOTA: QUOTA, rel: rel, argmax: argmax, argmin: argmin, n2: n2 };
});

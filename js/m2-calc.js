// M2 — chấm phần TÍNH: sinh viên tự điền đáp số (không hiện sẵn kết quả). Đáp số đúng tính từ kích thước sinh viên đề xuất.
// "Sai truyền tiếp": pmax và pgl được chấp nhận nếu khớp với ptx mà sinh viên đã điền (không phạt hai lần).
// Kết luận đạt/không đạt chấm theo số của chính sinh viên.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.M2Calc = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var FIELDS = [
    { key: 'P',    label: '[P] = pgh/Fs',                         unit: 'T/m²' },
    { key: 'ptx',  label: 'ptx (áp lực trung bình đáy móng)',      unit: 'T/m²' },
    { key: 'pmax', label: 'pmax',                                  unit: 'T/m²' },
    { key: 'pmin', label: 'pmin',                                  unit: 'T/m²' },
    { key: 'pgl',  label: 'pgl (áp lực gây lún)',                  unit: 'T/m²' },
    { key: 'S',    label: 'Độ lún S',                              unit: 'cm' },
    { key: 'Pdt',  label: 'Pđt (lực đâm thủng)',                   unit: 'T' },
    { key: 'Pcdt', label: 'Pcđt (khả năng chống đâm thủng)',       unit: 'T' },
    { key: 'As',   label: 'As cạnh dài',                           unit: 'cm²' }
  ];
  var VERDICTS = [
    { key: 'ptx',   label: 'ptx ≤ [P]' },
    { key: 'pmax',  label: 'pmax ≤ 1,2[P]' },
    { key: 'pmin',  label: 'pmin ≥ 0' },
    { key: 'S',     label: 'S ≤ [S] = 8 cm' },
    { key: 'punch', label: 'Pđt ≤ Pcđt (chọc thủng)' }
  ];
  var OVERALL = [
    { id: 'hoply', text: 'Đạt mọi điều kiện và kích thước hợp lý (khai thác nền ≥ 70%)' },
    { id: 'du',    text: 'Đạt mọi điều kiện nhưng kích thước còn dư nhiều (lãng phí)' },
    { id: 'khong', text: 'Chưa đạt: có ít nhất một điều kiện không thỏa' }
  ];

  function near(got, want, rel, abs) { return isFinite(got) && Math.abs(got - want) <= Math.max(rel * Math.abs(want), abs); }

  // r: kết quả engine tính từ kích thước của sinh viên; calc: {key: số}; verdict: {key: 'dat'|'khong'}; overall: id
  function grade(r, calc, verdict, overall) {
    var num = function (k) { var v = calc && calc[k]; return (v === '' || v === null || v === undefined) ? NaN : Number(v); };
    var truth = { P: r.P, ptx: r.ptx, pmax: r.pmax, pmin: r.pmin, pgl: r.pgl, S: r.S * 100, Pdt: r.punch.Pdt, Pcdt: r.punch.Pcdt, As: r.thep.As_dai };
    var sPtx = num('ptx'), fields = [], credit = 0;
    FIELDS.forEach(function (f) {
      var got = num(f.key), t = truth[f.key], ok = false, expect = [t], rel = 0.02, abs = 0.05;
      if (f.key === 'S') { rel = 0.04; abs = 0.15; }
      if (f.key === 'pmin') abs = 0.2;
      if (f.key === 'pmax' && isFinite(sPtx)) expect.push(sPtx + (r.pmax - r.ptx));          // truyền tiếp từ ptx của sinh viên
      if (f.key === 'pgl' && isFinite(sPtx)) expect.push(sPtx - (r.ptx - r.pgl));
      if (f.key === 'As') expect.push(r.thep.As_dai_chinhxac);                                // chấp nhận cả mômen gần đúng và chính xác
      expect.forEach(function (e) { if (near(got, e, rel, abs)) ok = true; });
      if (ok) credit++;
      fields.push({ key: f.key, label: f.label, unit: f.unit, got: isFinite(got) ? got : null, truth: t, ok: ok });
    });
    // kết luận từng điều kiện theo số của sinh viên
    var sP = num('P'), own = {
      ptx: num('ptx') <= sP, pmax: num('pmax') <= 1.2 * sP, pmin: num('pmin') >= 0, S: num('S') <= 8, punch: num('Pdt') <= num('Pcdt')
    };
    var vres = [], vcredit = 0;
    VERDICTS.forEach(function (v) {
      var given = verdict && verdict[v.key], valid = given === 'dat' || given === 'khong';
      var expect = own[v.key] ? 'dat' : 'khong', ok = valid && given === expect;
      if (ok) vcredit++;
      vres.push({ key: v.key, label: v.label, given: valid ? given : null, expectOwn: expect, truthDat: v.key === 'punch' ? r.punch.ok : (v.key === 'S' ? r.dkLun : r.dk[v.key]), ok: ok });
    });
    // hợp lý: đạt mọi điều kiện (thực) và hệ số sử dụng lớn nhất ≥ 0,7
    var allOk = r.dk.ptx && r.dk.pmax && r.dk.pmin && r.dkLun && r.punch.ok;
    var mx = Math.max(r.ptx / r.P, r.pmax / (1.2 * r.P), (r.pmax - r.pmin) / (r.pmax + r.pmin), r.S / 0.08);
    var truthOverall = !allOk ? 'khong' : (mx >= 0.7 ? 'hoply' : 'du'), ovOk = overall === truthOverall;
    var total = FIELDS.length + VERDICTS.length + 1, got = credit + vcredit + (ovOk ? 1 : 0);
    return { score: got / total, got: got, total: total, fields: fields, verdicts: vres, overall: { given: overall || null, truth: truthOverall, ok: ovOk, maxRatio: mx } };
  }

  // Trọng số điểm [GĐ: tác giả có thể đổi]: phần tính 40%, câu nối A–B 20%, câu tình huống 40% (nhiều câu, mục đích luyện hiểu bản chất).
  var WEIGHTS = { tinh: 0.4, ab: 0.2, tt: 0.4 };
  function combine(tinh, ab, tt) { return Math.round((tinh * WEIGHTS.tinh + ab * WEIGHTS.ab + tt * WEIGHTS.tt) * 100); }
  return { FIELDS: FIELDS, VERDICTS: VERDICTS, OVERALL: OVERALL, grade: grade, WEIGHTS: WEIGHTS, combine: combine };
});

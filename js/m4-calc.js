// M4 — chấm phần TÍNH móng cọc: sinh viên tự điền đáp số; đáp số đúng tính từ cọc/đài sinh viên đề xuất.
// Sai truyền tiếp: [P] chọn được chấp nhận nếu đúng với ba giá trị thống kê/SPT/CPT mà sinh viên đã điền.
// Kết luận đạt/không đạt chấm theo số của chính sinh viên. "Hợp lý": đạt mọi điều kiện và Pmax+gc ≥ 0,9[P] (kinh tế trong 10%).
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.M4Calc = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var FIELDS = [
    { key: 'Ptk',   label: 'Pgh theo thống kê (TCXD 205)',      unit: 'T' },
    { key: 'Pspt',  label: 'Pgh theo SPT',                      unit: 'T' },
    { key: 'Pcpt',  label: 'Pgh theo CPT',                      unit: 'T' },
    { key: 'Pvl',   label: 'Pgh theo vật liệu cọc',             unit: 'T' },
    { key: 'Pchon', label: '[P] chọn (làm tròn lên)',           unit: 'T' },
    { key: 'Pmax',  label: 'Pmax (cọc chịu tải lớn nhất)',      unit: 'T' },
    { key: 'Pmin',  label: 'Pmin',                              unit: 'T' },
    { key: 'AsCoc', label: 'As thép dọc cọc (cẩu lắp)',        unit: 'cm²' },
    { key: 'PdtCot',  label: 'Pđt cột đâm thủng đài',          unit: 'T' },
    { key: 'PcdtCot', label: 'Pcđt cột đâm thủng đài',         unit: 'T' },
    { key: 'PdtHang',  label: 'Pđt hàng cọc đâm thủng',        unit: 'T' },
    { key: 'PcdtHang', label: 'Pcđt hàng cọc đâm thủng',       unit: 'T' },
    { key: 'AsDai', label: 'As đài theo phương cạnh dài',       unit: 'cm²' },
    { key: 'AsNgan', label: 'As đài theo phương cạnh ngắn',     unit: 'cm²' },
    { key: 'Bqu',   label: 'Bqu (khối móng quy ước)',           unit: 'm' },
    { key: 'ptx',   label: 'ptx dưới mũi cọc (khối quy ước)',   unit: 'T/m²' },
    { key: 'Pnen',  label: '[P] nền dưới mũi cọc',              unit: 'T/m²' },
    { key: 'sbtQu', label: 'σbt tại đáy khối móng quy ước',     unit: 'T/m²' },
    { key: 'pglQu', label: 'pgl = ptx − σbt (ứng suất gây lún dưới mũi cọc)', unit: 'T/m²' },
    { key: 'S',     label: 'Độ lún S',                          unit: 'cm' }
  ];
  var VERDICTS = [
    { key: 'Pmax',  label: 'Pmax + gc ≤ [P]' },
    { key: 'Pmin',  label: 'Pmin ≥ 0 (không nhổ)' },
    { key: 'AsCoc', label: 'Thép dọc cọc đủ khi cẩu lắp' },
    { key: 'cot',   label: 'Cột đâm thủng đài: Pđt < Pcđt' },
    { key: 'hang',  label: 'Hàng cọc đâm thủng: Pđt < Pcđt' },
    { key: 'nen',   label: 'ptx ≤ [P] nền' },
    { key: 'lun',   label: 'S ≤ 8 cm' }
  ];
  var OVERALL = [
    { id: 'hoply', text: 'Đạt mọi điều kiện và kinh tế (Pmax + gc ≥ 0,9[P])' },
    { id: 'du',    text: 'Đạt mọi điều kiện nhưng dư cọc (Pmax + gc < 0,9[P])' },
    { id: 'khong', text: 'Chưa đạt: có ít nhất một điều kiện không thỏa' }
  ];

  function near(got, want, rel, abs) { return isFinite(got) && Math.abs(got - want) <= Math.max(rel * Math.abs(want), abs); }

  function grade(r, calc, verdict, overall) {
    var num = function (k) { var v = calc && calc[k]; return (v === '' || v === null || v === undefined) ? NaN : Number(v); };
    var truth = { Ptk: r.Pthongke, Pspt: r.Pspt, Pcpt: r.Pcpt, Pvl: r.Pvl, Pchon: r.Pchon, Pmax: r.Pmax, Pmin: r.Pmin, AsCoc: r.thepCoc.As,
      PdtCot: r.dai.Pdt_cot, PcdtCot: r.dai.Pcdt_cot, PdtHang: r.dai.Pdt_hang, PcdtHang: r.dai.Pcdt_hang, AsDai: r.dai.As_dai, AsNgan: r.dai.As_ngan,
      Bqu: r.qu.Bqu, ptx: r.qu.ptx, Pnen: r.qu.Pgh, sbtQu: r.qu.sbt, pglQu: r.qu.pgl, S: r.qu.S };
    var fields = [], credit = 0;
    FIELDS.forEach(function (f) {
      var got = num(f.key), t = truth[f.key], expect = [t], rel = 0.02, abs = 0.05;
      if (f.key === 'S') { rel = 0.04; abs = 0.15; }
      if (f.key === 'pglQu' && isFinite(num('ptx')) && isFinite(num('sbtQu'))) expect.push(num('ptx') - num('sbtQu'));   // truyền tiếp từ ptx và σbt đã điền
      if (f.key === 'Pchon') {                                   // truyền tiếp từ ba giá trị sinh viên đã điền
        var a = [num('Ptk'), num('Pspt'), num('Pcpt')];
        if (a.every(isFinite)) expect.push(Math.ceil(Math.min(a[0], a[1], a[2]) - 1e-9));
        rel = 0; abs = 0.5;
      }
      var ok = expect.some(function (e) { return near(got, e, rel, abs); });
      if (ok) credit++;
      fields.push({ key: f.key, label: f.label, unit: f.unit, got: isFinite(got) ? got : null, truth: t, ok: ok });
    });
    var sP = num('Pchon');
    var own = {
      Pmax: num('Pmax') + r.gc <= sP, Pmin: num('Pmin') >= 0, AsCoc: num('AsCoc') <= r.thepCoc.AsChon,
      cot: num('PdtCot') < num('PcdtCot'), hang: num('PdtHang') < num('PcdtHang'), nen: num('ptx') <= num('Pnen'), lun: num('S') <= 8
    };
    var truthDat = { Pmax: r.dk.Pmax, Pmin: r.dk.Pmin, AsCoc: r.thepCoc.ok, cot: r.dai.ok_cot, hang: r.dai.ok_hang, nen: r.qu.ok, lun: r.qu.okLun };
    var vres = [], vcredit = 0;
    VERDICTS.forEach(function (v) {
      var given = verdict && verdict[v.key], valid = given === 'dat' || given === 'khong';
      var expect = own[v.key] ? 'dat' : 'khong', ok = valid && given === expect;
      if (ok) vcredit++;
      vres.push({ key: v.key, label: v.label, given: valid ? given : null, expectOwn: expect, truthDat: truthDat[v.key], ok: ok });
    });
    var allOk = Object.keys(truthDat).every(function (k) { return truthDat[k]; });
    var load = (r.Pmax + r.gc) / r.Pchon;
    var truthOverall = !allOk ? 'khong' : (load >= 0.9 ? 'hoply' : 'du'), ovOk = overall === truthOverall;
    var total = FIELDS.length + VERDICTS.length + 1, got = credit + vcredit + (ovOk ? 1 : 0);
    return { score: got / total, got: got, total: total, fields: fields, verdicts: vres, overall: { given: overall || null, truth: truthOverall, ok: ovOk, maxRatio: load } };
  }

  // Trọng số điểm [GĐ: tác giả có thể đổi]: phần tính 40%, câu nối A–B 20%, câu tình huống 40% (nhiều câu, mục đích luyện hiểu bản chất).
  var WEIGHTS = { tinh: 0.4, ab: 0.2, tt: 0.4 };
  function combine(tinh, ab, tt) { return Math.round((tinh * WEIGHTS.tinh + ab * WEIGHTS.ab + tt * WEIGHTS.tt) * 100); }
  return { FIELDS: FIELDS, VERDICTS: VERDICTS, OVERALL: OVERALL, grade: grade, WEIGHTS: WEIGHTS, combine: combine };
});

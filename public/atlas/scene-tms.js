/* How TMS works: coil, skull, induced field, cortical cells, the DLPFC to limbic links and the OCD loop. */
(function () {
  'use strict';
  var A = window.MNTC3D, T = window.THREE; if (!A || !T) return;
  var C = A.C, SKY = C.sky, AMBER = C.amber, CALM = C.calm;
  A.scenes.tms = function (S) {
    var q = S.quality, B = A.buildBrain(q), bust = A.buildBust(q), P = B.pts, G = B.glass.u;
    S.root.add(bust.group, B.group);
    var V = function (x, y, z) { return new T.Vector3(x, y, z); };

    /* the skull: a pale layer between scalp and brain, shown when we explain why a magnetic field is used */
    var SKS = V(0.955, 0.95, 0.95), skull = [SKS, V(0.915, 0.9, 0.9)].map(function (sc, i) {
      var b = A.buildBust(q, -0.34);
      b.group.scale.copy(sc);
      b.glass.u.uColor.value.set(0xf7eeda); b.glass.u.uRim.value.set(0xa98646); b.glass.u.uOpacity.value = i ? 0.18 : 0.26; b.glass.u.uRimPow.value = 1.5;
      b.group.children[0].renderOrder = 26 + i; b.group.children[1].renderOrder = 28 + i;
      S.root.add(b.group); return b;
    });

    /* coils on the scalp */
    var s1 = A.scalp(P.dlpfcL), s2 = A.scalp(P.dmpfc);
    var coil1 = A.buildCoil({ R: 0.165 }), coil2 = A.buildCoil({ R: 0.2, bend: 0.42 });
    coil1.place(s1.p, s1.n, V(0.3, 0.1, -1), 0.05); coil2.place(s2.p, s2.n, V(0, 0.25, -1), 0.09);
    S.root.add(coil1, coil2);
    var in1 = P.dlpfcL.clone().sub(coil1.position).normalize(), in2 = P.acc.clone().sub(coil2.position).normalize();

    var r1 = A.pulseRings(S.root, 3, SKY), r2 = A.pulseRings(S.root, 3, SKY);

    /* cortical cells under the coil */
    var N = q >= 1 ? 84 : 48, cells = A.particles(N, 0.017, C.cell), cd = [], seed = 7;
    function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    var nrm = P.dlpfcL.clone().normalize(), t1 = new T.Vector3().crossVectors(nrm, V(0, 1, 0)).normalize(), t2 = new T.Vector3().crossVectors(nrm, t1).normalize();
    for (var i = 0; i < N; i++) {
      var rr = Math.sqrt(rnd()) * 0.36, an = rnd() * 6.283, depth = 0.035 + rnd() * 0.12 + rr * rr * 0.55;
      var p = P.dlpfcL.clone().addScaledVector(t1, Math.cos(an) * rr).addScaledVector(t2, Math.sin(an) * rr).addScaledVector(nrm, -depth);
      cd.push({ p: p, w: 1 - A.smooth(0.13, 0.22, rr), ph: rnd() * 6.283 });
    }
    S.root.add(cells);
    var segs = [];
    for (i = 0; i < N; i++) for (var j = i + 1; j < N; j++) if (cd[i].w > 0.5 && cd[j].w > 0.5 && cd[i].p.distanceTo(cd[j].p) < 0.115) segs.push(cd[i].p, cd[j].p);
    var links = new T.LineSegments(new T.BufferGeometry().setFromPoints(segs), new T.LineBasicMaterial({ color: A.light ? C.sky : 0x9fd6ff, transparent: true, opacity: 0, blending: A.BLEND, depthWrite: false }));
    links.renderOrder = 23; S.root.add(links);

    /* network: DLPFC to the deeper mood centers (subgenual cingulate; the amygdala is added in the depression guide) */
    var dlIn = P.dlpfcL.clone().addScaledVector(nrm, -0.05);
    var sg = A.node(P.sgacc, AMBER, 0.05), dl = A.node(dlIn, SKY, 0.035), am = A.node(P.amyg, AMBER, 0.044);
    var link = A.pathway([dlIn.clone(), V(0.3, 0.27, 0.5), V(0.13, 0.12, 0.47), P.sgacc], SKY, { beads: 4, bead: 0.1 });
    var link2 = A.pathway([dlIn.clone(), V(0.37, 0.1, 0.4), V(0.33, -0.08, 0.24), P.amyg], SKY, { beads: 4, bead: 0.1 });
    S.root.add(sg, dl, am, link, link2);

    /* OCD: cortico-striato-thalamo-cortical loop */
    var loopPts = [P.ofc, V(0.17, -0.04, 0.36), P.caud, V(0.12, 0.09, 0.05), P.thal, V(0.07, 0.2, 0.03), V(0.04, 0.34, 0.24), P.acc, V(0.09, 0.06, 0.53)];
    var loop = A.pathway(loopPts, AMBER, { closed: true, beads: 7, bead: 0.1, radius: 0.013, segments: 120 });
    var ln = [A.node(P.ofc, AMBER, 0.032), A.node(P.caud, AMBER, 0.036), A.node(P.thal, AMBER, 0.04), A.node(P.acc, AMBER, 0.034)];
    S.root.add(loop); ln.forEach(function (n) { S.root.add(n); });

    S.def({ head: 1, coil1: 1, coil2: 0, pulse1: 1, pulse2: 0, hl1: 0.5, hl2: 0, cells: 0, sg: 0, link: 0, loop: 0, ghost: 0 });
    S.def({ plast: 0, calm: 0, lcalm: 0, dim: 0 }, 0.4);
    S.def({ deep: 0, skull: 0, ref: 0, flow: 0.3 });
    /* views written before these four existed leave them at rest */
    var EXTRA = { deep: 0, skull: 0, ref: 0, flow: 0.3 };
    function go(o) { for (var k in EXTRA) if (!(k in o)) o[k] = EXTRA[k]; S.go(o); }
    G.uHL.value[0].copy(P.dlpfcL); G.uHLc.value[0].set(SKY); G.uHLr.value[0] = 0.25;
    G.uHL.value[1].copy(P.dmpfc); G.uHLc.value[1].set(SKY); G.uHLr.value[1] = 0.3;
    /* two other areas that stay lit, so the left front area can be seen to dim beside them */
    var refA = A.hemiPoint(0.62, 0.62, -0.36), refB = A.hemiPoint(0.9, -0.12, -0.04);
    G.uHL.value[2].copy(refA); G.uHLc.value[2].set(SKY); G.uHLr.value[2] = 0.26;
    G.uHL.value[3].copy(refB); G.uHLc.value[3].set(SKY); G.uHLr.value[3] = 0.25;

    S.label('coil', 'Magnetic coil', 'Figure-8 coil', function () { return coil1.position; }, 'r');
    S.label('dl', 'Left front of the brain', 'Left DLPFC', P.dlpfcL.clone().addScaledVector(nrm, -0.1), 'l');
    S.label('skull', 'Pulses pass through the skull', 'Induced electric field', P.dlpfcL.clone().lerp(s1.p, 0.5), 'bl');
    S.label('fire', 'Cells under the coil fire', 'Neurons depolarize in the field', P.dlpfcL.clone().addScaledVector(nrm, -0.06), 'l');
    var far = cd[0]; cd.forEach(function (c) { if (c.w < 0.15 && c.p.y < far.p.y) far = c; });
    S.label('rest', 'Cells farther away stay at rest', 'Field falls off with distance', far.p, 'r');
    S.label('syn', 'Connections strengthen with repetition', 'LTP-like plasticity', P.dlpfcL.clone().addScaledVector(nrm, -0.08), 'l');
    S.label('sg', 'Deeper mood centers', 'Subgenual cingulate and amygdala', P.sgacc, 'b');
    S.label('dl2', 'Front area', 'DLPFC', P.dlpfcL, 't');
    S.label('loop', 'Overactive loop', 'CSTC loop', P.caud, 'l');
    S.label('ofc', '', 'Orbitofrontal cortex', P.ofc, 'b');
    S.label('thal', '', 'Thalamus', P.thal, 'r');
    S.label('acc', '', 'Anterior cingulate', P.acc, 't');
    S.label('coil2', 'Coil placed higher, toward the top', 'Double-cone coil (Cool D-B80)', function () { return coil2.position; }, 't');
    S.label('dm', 'Deeper target', 'dmPFC and anterior cingulate', P.acc, 'r');
    S.label('settle', 'The loop quiets', 'Reduced CSTC activity (proposed)', P.caud, 'l');
    S.label('awake', 'Awake, seated, no anesthesia', 'No anesthesia or sedation', A.bustPoint(-2.45, -0.3), 't');
    S.label('ear', 'Earplugs', 'Hearing protection', A.bustPoint(-0.35, -1.5), 'l');
    S.label('well', 'Back in balance', 'Normalized DLPFC and sgACC coupling (proposed)', P.sgacc, 'b');
    S.label('dur2', 'Around 20 minutes', 'Intensity set to leg motor threshold', function () { return coil2.position; }, 'r');
    S.label('dur', 'About 19 minutes', '10 Hz, about 19 minutes', function () { return coil1.position; }, 'r');
    S.label('keep', 'Helps keep mood in balance', 'Top-down regulation', link2.userData.curve.getPoint(0.42), 'r');
    S.label('deep', 'Deeper mood centers', 'Subgenual cingulate and amygdala', P.sgacc, 'l');
    S.label('others', 'Other areas stay active', 'Reference regions', refA, 't');
    S.label('bone', 'Skull', 'Skull', A.bustPoint(0.6, -0.7).multiply(SKS), 'l');

    var dlT = P.dlpfcL.clone().multiplyScalar(0.78), cA = new T.Color(AMBER), cC = new T.Color(CALM), cc = new T.Color();
    var all = [
      function () { go({ head: 1, coil1: 1, coil2: 0, pulse1: 1, pulse2: 0, hl1: 0.6, hl2: 0, cells: 0, plast: 0, sg: 0, link: 0, loop: 0, ghost: 0, cy: -0.45, cp: 0.14, cd: 5.3, tx: 0.05, ty: 0.0, tz: 0, ca: 1.3 }); S.show(['coil', 'dl', 'skull']); S.chip(''); },
      function () { go({ head: 0.3, coil1: 1, coil2: 0, pulse1: 1, pulse2: 0, hl1: 0.3, hl2: 0, cells: 1, plast: 0, sg: 0, link: 0, loop: 0, ghost: 0.6, cy: -0.5, cp: 0.2, cd: 3.2, tx: dlT.x * 0.8, ty: dlT.y * 0.8, tz: dlT.z * 0.8, ca: 1.3 }); S.show(['fire', 'rest']); S.chip(''); },
      function () { S.P.plast = 0; go({ head: 0.25, coil1: 1, coil2: 0, pulse1: 0.8, pulse2: 0, hl1: 0.25, hl2: 0, cells: 1, plast: 1, sg: 0, link: 0, loop: 0, ghost: 0.6, cy: -0.32, cp: 0.3, cd: 3.0, tx: dlT.x * 0.8, ty: dlT.y * 0.8, tz: dlT.z * 0.8, ca: 1.3 }); S.show(['syn']); },
      function () { S.P.calm = 0; go({ head: 0, coil1: 0.9, coil2: 0, pulse1: 0.7, pulse2: 0, hl1: 0.75, hl2: 0, cells: 0, plast: 0, sg: 1, link: 1, deep: 1, flow: 0.42, calm: 1, loop: 0, ghost: 0.8, cy: 0.3, cp: 0.1, cd: 4.0, tx: 0.08, ty: 0.06, tz: 0.08, ca: 1.3 }); S.show(['dl2', 'deep']); S.chip(''); },
      function () { S.P.lcalm = 0; go({ head: 0, coil1: 0, coil2: 0, pulse1: 0, pulse2: 0, hl1: 0, hl2: 0, cells: 0, plast: 0, sg: 0, link: 0, loop: 1, lcalm: 0, ghost: 1, cy: 1.3, cp: 0.08, cd: 4.1, tx: 0.05, ty: 0.05, tz: 0.12, ca: 1.3 }); S.show(['loop', 'ofc', 'thal', 'acc']); S.chip(''); },
      function () { go({ head: 0.9, coil1: 0, coil2: 1, pulse1: 0, pulse2: 1, hl1: 0, hl2: 0.7, cells: 0, plast: 0, sg: 0, link: 0, loop: 0.7, lcalm: 0, ghost: 0.9, cy: 1.25, cp: 0.16, cd: 5.5, tx: 0, ty: 0.1, tz: 0, ca: 1.3 }); S.show(['coil2', 'dm']); S.chip(''); },
      function () { S.P.lcalm = 0; go({ head: 0.2, coil1: 0, coil2: 0.9, pulse1: 0, pulse2: 0.7, hl1: 0, hl2: 0.5, cells: 0, plast: 0, sg: 0, link: 0, loop: 1, lcalm: 1, ghost: 1, cy: 1.15, cp: 0.14, cd: 4.4, tx: 0.05, ty: 0.1, tz: 0.1, ca: 1.3 }); S.show(['settle']); S.chip(''); },
      function () { go({ head: 1, coil1: 1, coil2: 0, pulse1: 0.8, pulse2: 0, hl1: 0.5, hl2: 0, cells: 0, plast: 0, sg: 0, link: 0, loop: 0, ghost: 0, cy: -0.5, cp: 0.05, cd: 10.2, tx: 0, ty: -1.25, tz: 0, ca: 0.8 }); S.show(['awake', 'ear', 'dur']); S.chip(''); },
      /* 8 to 11: extra views for the OCD guide */
      function () { go({ head: 1, coil1: 0, coil2: 0, pulse1: 0, pulse2: 0, hl1: 0, hl2: 0, cells: 0, plast: 0, sg: 0, link: 0, loop: 0, ghost: 0, cy: 0.9, cp: 0.1, cd: 5.6, tx: 0, ty: 0.05, tz: 0, ca: 1.3 }); S.show([]); S.chip(''); },
      function () { S.P.lcalm = 0; go({ head: 0.35, coil1: 0, coil2: 0, pulse1: 0, pulse2: 0, hl1: 0, hl2: 0, cells: 0, plast: 0, sg: 0, link: 0, loop: 1, lcalm: 0, ghost: 0.9, cy: 0.75, cp: 0.14, cd: 5.0, tx: 0.03, ty: 0.06, tz: 0.06, ca: 1.3 }); S.show(['loop']); S.chip('Loop: overactive'); },
      function () { go({ head: 0.12, coil1: 0, coil2: 0.6, pulse1: 0, pulse2: 0.4, hl1: 0, hl2: 0.4, cells: 0, plast: 0, sg: 0, link: 0, loop: 1, lcalm: 1, ghost: 1, cy: 1.65, cp: 0.24, cd: 4.0, tx: 0.05, ty: 0.1, tz: 0.1, ca: 1.3 }); S.show(['settle']); S.chip('Loop: quieter'); },
      function () { go({ head: 1, coil1: 0, coil2: 1, pulse1: 0, pulse2: 0.8, hl1: 0, hl2: 0.5, cells: 0, plast: 0, sg: 0, link: 0, loop: 0, ghost: 0, cy: -0.5, cp: 0.05, cd: 10.2, tx: 0, ty: -1.25, tz: 0, ca: 0.8 }); S.show(['awake', 'ear', 'dur2']); S.chip(''); },
      /* 12, 13: results and the ending of the depression guide */
      function () { go({ head: 0.1, coil1: 0.5, coil2: 0, pulse1: 0.3, pulse2: 0, hl1: 0.7, hl2: 0, cells: 0, plast: 0, sg: 1, link: 1, deep: 1, calm: 1, loop: 0, ghost: 0.9, cy: 0.75, cp: 0.2, cd: 3.7, tx: 0.08, ty: 0.06, tz: 0.08, ca: 1.3 }); S.show(['dl2', 'sg']); S.chip('About 6 in 10 respond'); },
      function () { go({ head: 0.6, coil1: 0, coil2: 0, pulse1: 0, pulse2: 0, hl1: 0.55, hl2: 0, cells: 0, plast: 0, sg: 1, link: 1, deep: 1, calm: 1, loop: 0, ghost: 0.75, cy: -0.2, cp: 0.12, cd: 5.6, tx: 0.03, ty: 0.03, tz: 0, ca: 1.3 }); S.show(['well']); S.chip('Mood network: in balance'); },
      /* 14 to 16: why TMS exists. A quieter area, what it does, and the skull in the way */
      function () { S.P.dim = 0; go({ head: 0.22, coil1: 0, coil2: 0, pulse1: 0, pulse2: 0, hl1: 1.3, hl2: 0, cells: 0, ref: 1, dim: 1, plast: 0, sg: 0, link: 0, loop: 0, ghost: 0.1, cy: 1.12, cp: 0.2, cd: 4.5, tx: 0.05, ty: 0.02, tz: 0.02, ca: 1.3 }); S.show(['dl', 'others']); },
      function () { S.P.calm = 0; go({ head: 0, coil1: 0, coil2: 0, pulse1: 0, pulse2: 0, hl1: 0.35, hl2: 0, cells: 0, plast: 0, sg: 1, link: 0.55, deep: 1, flow: 0.12, calm: 0, loop: 0, ghost: 0.85, cy: 0.55, cp: 0.08, cd: 4.0, tx: 0.1, ty: 0.02, tz: 0.12, ca: 1.3 }); S.show(['dl2', 'keep', 'deep']); S.chip(''); },
      function () { go({ head: 0.85, skull: 1, coil1: 1, coil2: 0, pulse1: 1, pulse2: 0, hl1: 0.5, hl2: 0, cells: 0, plast: 0, sg: 0, link: 0, loop: 0, ghost: 0.2, cy: -0.25, cp: 0.16, cd: 4.6, tx: 0.12, ty: 0.12, tz: 0.1, ca: 1.3 }); S.show(['bone']); S.chip('Magnetic pulses pass straight through'); },
      /* 17 to 21: quiet backdrops for the steps whose picture is a figure laid over the stage */
      back({ cy: 0.5, cp: 0.16, cd: 4.6 }),
      back({ head: 1, coil1: 1, sg: 0, link: 0, deep: 0, hl1: 0.4, ghost: 0, cy: -0.7, cp: 0.1, cd: 5.6 }),
      back({ head: 1, coil1: 1, sg: 0, link: 0, deep: 0, hl1: 0.4, ghost: 0, cy: -0.2, cp: 0.14, cd: 5.2 }),
      back({ cy: 0.9, cp: 0.2, cd: 4.2 }),
      back({ head: 0.8, cy: -0.5, cp: 0.1, cd: 5.4 })
    ];
    function back(o) {
      return function () {
        var g = { head: 0.5, coil1: 0, coil2: 0, pulse1: 0, pulse2: 0, hl1: 0.55, hl2: 0, cells: 0, plast: 0, sg: 1, link: 1, deep: 1, calm: 1, loop: 0, ghost: 0.75, cy: -0.2, cp: 0.12, cd: 5.6, tx: 0.03, ty: 0.03, tz: 0, ca: 1.3 };
        for (var k in o) g[k] = o[k];
        go(g); S.show([]); S.chip('');
      };
    }
    /* the depression guide and the OCD guide share this scene; each shows its own steps */
    var ocd = !!document.querySelector('main[data-guide="tms-ocd"]');
    var order = ocd ? [8, 4, 9, 5, 6, 10, 11] : [0, 14, 15, 16, 1, 3, 2, 17, 18, 19, 20, 7, 21, 13];
    var steps = order.map(function (i) { return all[i]; });
    function at() { return order[S.step]; }

    function update(time, dt, p) {
      var train = A.train(time, S.reduce);
      bust.glass.u.uFade.value = p.head; bust.group.visible = p.head > 0.01;
      for (var si = 0; si < 2; si++) { skull[si].glass.u.uFade.value = p.skull; skull[si].group.visible = p.skull > 0.01; }
      G.uOpacity.value = A.lerp(0.36, 0.15, p.ghost); G.uSulc.value = A.lerp(0.62, 0.42, p.ghost);
      B.stemGlass.u.uOpacity.value = A.lerp(0.2, 0.12, p.ghost);
      A.fadeGroup(coil1, p.coil1); A.fadeGroup(coil2, p.coil2);
      coil1.userData.ringMat.opacity = p.pulse1 * train * 0.8; coil2.userData.ringMat.opacity = p.pulse2 * train * 0.8;
      r1.tick(coil1.position, in1, 0.5, 0.09, 0.2, p.pulse1 * p.coil1 * train, time);
      r2.tick(coil2.position, in2, 0.78, 0.12, 0.3, p.pulse2 * p.coil2 * train, time);
      G.uHLi.value[0] = p.hl1 * (0.7 + 0.3 * train * (p.pulse1 > 0.05 ? 1 : 0)) * (1 - 0.8 * p.ref * p.dim) * (1 + 0.1 * p.ref * Math.sin(time * 1.6));
      G.uHLi.value[2] = p.ref * (0.86 + 0.07 * Math.sin(time * 1.6 + 2)); G.uHLi.value[3] = p.ref * (0.84 + 0.07 * Math.sin(time * 1.6 + 4)); G.uHLi.value[1] = p.hl2 * (0.7 + 0.3 * train);
      /* cells */
      cells.visible = p.cells > 0.02;
      if (cells.visible) {
        cells.material.opacity = p.cells;
        var drive = Math.min(1, p.pulse1 * 1.25);
        for (var i = 0; i < N; i++) {
          var c = cd[i], f = c.w * train * drive * Math.pow(0.5 + 0.5 * Math.sin(time * 11 + c.ph), 3);
          cells.put(i, c.p.x, c.p.y, c.p.z, 1 + 1.5 * f);
          if (A.light) cc.setRGB(A.lerp(0.64 - 0.1 * c.w, 0.1, f), A.lerp(0.71 - 0.08 * c.w, 0.47, f), A.lerp(0.79 - 0.04 * c.w, 0.88, f));
          else cc.setRGB(0.36 + 0.64 * f + 0.1 * c.w, 0.5 + 0.44 * f + 0.1 * c.w, 0.66 + 0.34 * f + 0.1 * c.w);
          cells.tint(i, cc);
        }
        cells.flush();
      }
      links.visible = p.plast > 0.01;
      if (links.visible) { links.geometry.setDrawRange(0, Math.max(2, Math.floor((segs.length / 2) * p.plast) * 2)); links.material.opacity = 0.25 + 0.6 * p.plast; }
      if (at() === 2) S.chip('Session ' + Math.round(1 + p.plast * 35) + ' of about 36');
      /* network */
      A.settle(cc, cA, cC, p.calm);
      sg.set(p.sg, cc.getHex()); sg.pulse(1 + (1 - p.calm) * 0.35 * Math.sin(time * 7)); dl.set(p.link * 0.9);
      am.set(p.sg * p.deep, cc.getHex()); am.pulse(1 + (1 - p.calm) * 0.35 * Math.sin(time * 7 + 1.7));
      link.tick(p.link, p.flow, dt); link2.tick(p.link * p.deep, p.flow, dt);
      if (at() === 3) S.chip(p.calm < 0.6 ? 'Deeper mood centers: overactive' : 'Deeper mood centers: settling');
      if (at() === 14) S.chip(p.dim < 0.5 ? 'When you are well: active' : 'In depression: less active');
      A.settle(cc, cA, cC, p.lcalm);
      loop.tick(p.loop, A.lerp(0.75, 0.14, p.lcalm), dt, cc.getHex());
      for (var k = 0; k < ln.length; k++) { ln[k].set(p.loop * 0.9, cc.getHex()); ln[k].pulse(1 + (1 - p.lcalm) * 0.3 * Math.sin(time * 9 + k)); }
      if (at() === 6) S.chip(p.lcalm < 0.6 ? 'Loop: overactive' : 'Loop: quieter');
    }
    return { steps: steps, update: update };
  };
})();

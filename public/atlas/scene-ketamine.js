/* How ketamine and esketamine work: prefrontal cortex, then a three-cell microcircuit
   (inhibitory cell, signaling cell, receiving cell), then back out to the network. */
(function () {
  'use strict';
  var A = window.MNTC3D, T = window.THREE; if (!A || !T) return;
  var C = A.C, SKY = C.sky, AMBER = C.amber, CALM = C.calm, ROSE = C.rose;
  A.scenes.ketamine = function (S) {
    var q = S.quality, B = A.buildBrain(q), P = B.pts, G = B.glass.u, V = function (x, y, z) { return new T.Vector3(x, y, z); };
    S.root.add(B.group);
    var pfcR = P.pfcL.clone().multiply(V(-1, 1, 1));
    G.uHL.value[0].copy(P.pfcL); G.uHLc.value[0].set(SKY); G.uHLr.value[0] = 0.42;
    G.uHL.value[1].copy(pfcR); G.uHLc.value[1].set(SKY); G.uHLr.value[1] = 0.42;
    var netTargets = [P.sgacc, P.amyg, P.hipp, P.pari, P.amyg.clone().multiply(V(-1, 1, 1))], nets = [], netNodes = [];
    netTargets.forEach(function (t, i) {
      var from = i === 4 ? pfcR : P.pfcL, mid = from.clone().lerp(t, 0.5).multiplyScalar(0.72);
      var pw = A.pathway([from.clone().multiplyScalar(0.9), mid, t], SKY, { beads: 3, bead: 0.09 }); nets.push(pw); S.root.add(pw);
      var n = A.node(t, CALM, 0.035); netNodes.push(n); S.root.add(n);
    });

    /* ---- microcircuit ---- */
    var M = new T.Group(); S.root.add(M);
    var fades = [];
    function cell(geo, color, rim, op) { var g = A.glass({ color: color, rim: rim, opacity: op == null ? 0.78 : op, sulc: 0, rimPow: 1.8 }); fades.push(g.u); var m = A.glassMesh(geo, g, 12); m.userData.u = g.u; return m; }
    function tube(pts, r, color, rim) { return cell(new T.TubeGeometry(new T.CatmullRomCurve3(pts), 40, r, 12, false), color, rim); }
    var INH = [0x4f86cf, 0xa9d3ff], SIG = [0xd29a55, 0xffdfae], REC = [0x9a8fd4, 0xdcd6fb];
    // inhibitory cell
    var inhPos = V(-1.0, 0.62, 0), sigPos = V(0.05, 0.66, 0);
    var inh = cell(new T.SphereGeometry(0.25, 36, 26), INH[0], INH[1]); inh.position.copy(inhPos); M.add(inh);
    M.add(tube([V(-1.15, 0.8, 0), V(-1.35, 1.05, 0.08), V(-1.5, 1.4, 0.05)], 0.035, INH[0], INH[1]));
    M.add(tube([V(-1.1, 0.42, 0), V(-1.3, 0.2, -0.1), V(-1.55, 0.05, -0.05)], 0.03, INH[0], INH[1]));
    M.add(tube([V(-0.78, 0.66, 0), V(-0.55, 0.74, 0.05), V(-0.34, 0.7, 0.02)], 0.03, INH[0], INH[1]));
    var inhEnd = cell(new T.SphereGeometry(0.07, 20, 14), INH[0], INH[1]); inhEnd.position.set(-0.3, 0.69, 0.02); M.add(inhEnd);
    // signaling cell: teardrop soma, apical dendrite, axon to a terminal
    var prof = [], i; for (i = 0; i <= 24; i++) { var t = i / 24, a = t * Math.PI; prof.push(new T.Vector2(Math.sin(a) * (0.27 - 0.07 * t), 0.36 - 0.66 * t)); }
    var sig = cell(new T.LatheGeometry(prof, 36), SIG[0], SIG[1]); sig.position.copy(sigPos); sig.rotation.x = Math.PI; M.add(sig);
    M.add(tube([V(0.05, 0.98, 0), V(0.1, 1.3, 0.04), V(0.02, 1.7, 0)], 0.045, SIG[0], SIG[1]));
    M.add(tube([V(0.22, 0.5, 0), V(0.5, 0.42, 0.1), V(0.85, 0.5, 0.12)], 0.028, SIG[0], SIG[1]));
    M.add(tube([V(0.05, 0.34, 0), V(0.1, 0.12, 0.02), V(0.1, -0.08, 0)], 0.03, SIG[0], SIG[1]));
    var bout = cell(new T.SphereGeometry(0.15, 28, 20), SIG[0], SIG[1]); bout.position.set(0.1, -0.16, 0); bout.scale.set(1.15, 0.9, 1.15); M.add(bout);
    // receiving dendrite and its spines
    M.add(tube([V(-1.5, -0.74, 0.05), V(-0.6, -0.68, 0), V(0.4, -0.7, 0), V(1.5, -0.66, 0.06)], 0.1, REC[0], REC[1]));
    var spineGeo = (function () { var p = [new T.Vector2(0.001, 0), new T.Vector2(0.022, 0), new T.Vector2(0.02, 0.1), new T.Vector2(0.05, 0.14), new T.Vector2(0.058, 0.19), new T.Vector2(0.04, 0.235), new T.Vector2(0.001, 0.25)]; return new T.LatheGeometry(p, 18); })();
    var spines = [], spineDef = [[0.1, 0, 0], [-0.55, 0.15, 0], [0.75, -0.2, 0], [-0.22, -0.12, 1], [0.42, 0.18, 1], [-0.9, 0, 1], [1.08, 0.12, 1], [-1.2, -0.15, 1]];
    spineDef.forEach(function (d) {
      var sp = cell(spineGeo, d[2] ? 0x53b895 : REC[0], d[2] ? 0xc9ffe9 : REC[1]); sp.position.set(d[0], -0.61, 0); sp.rotation.z = d[1] * -1; sp.userData.isNew = !!d[2];
      sp.userData.head = V(d[0] + Math.sin(d[1]) * 0.2, -0.61 + Math.cos(d[1]) * 0.2, 0); M.add(sp); spines.push(sp);
    });
    // NMDA receptor on the inhibitory cell, and the medicine that plugs it
    var rec = new T.Group(); rec.position.set(-1.27, 0.62, 0); rec.rotation.z = Math.PI / 2; M.add(rec);
    var recBody = new T.Mesh(new T.CylinderGeometry(0.085, 0.065, 0.17, 24, 1, true), A.matte(C.indigo, { emissive: C.indigoDeep, opacity: A.light ? 0.5 : 0.62, depthWrite: false })); recBody.material.side = T.DoubleSide; recBody.renderOrder = 26;
    var recRim = new T.Mesh(new T.TorusGeometry(0.085, 0.014, 10, 28), A.matte(A.light ? 0x3a45a8 : 0xe6eaff, { emissive: A.light ? 0x141a44 : 0x2a3060 })); recRim.rotation.x = Math.PI / 2; recRim.position.y = 0.085;
    rec.add(recBody, recRim);
    var pore = V(-1.36, 0.62, 0);
    var ketGeo = new T.OctahedronGeometry(0.036, 0), ketMat = new T.MeshLambertMaterial({ color: ROSE, emissive: A.light ? 0x4a0f2a : 0x7a1e45 }), kets = [];
    for (i = 0; i < 5; i++) { var k = new T.Mesh(ketGeo, ketMat); k.userData = { home: V(-1.75 - 0.12 * (i % 2), 0.4 + 0.16 * i, 0.12 * ((i % 3) - 1)), ph: i * 1.7 }; M.add(k); kets.push(k); }
    // moving messengers
    var glu = A.particles(44, 0.02, AMBER), gaba = A.particles(14, 0.017, C.gaba), ions = A.particles(6, 0.012, C.ion), bdnf = A.particles(18, 0.02, CALM);
    M.add(glu, gaba, ions, bdnf);
    var boutB = V(0.1, -0.29, 0), gA = V(-0.25, 0.68, 0.02), gB = V(-0.12, 0.66, 0.02), seed = 11, rj = [];
    function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    for (i = 0; i < 64; i++) rj.push([rnd(), rnd(), rnd(), rnd()]);
    var inhGlow = A.halo(C.gaba, 1.1), sigGlow = A.halo(AMBER, 1.3), synGlow = A.halo(AMBER, 0.7);
    inhGlow.position.copy(inhPos); sigGlow.position.copy(sigPos); synGlow.position.set(0.1, -0.42, 0); M.add(inhGlow, sigGlow, synGlow);

    /* ---- the two mirror-image molecules of ketamine (coordinates: S form from its formula; the R form is its mirror) ---- */
    var MOL = {"atoms":[["C",-0.548,-2.615,0.457],["N",-0.584,-1.596,-0.576],["C",-0.257,-0.187,-0.192],["C",-0.924,0.189,1.165],["C",-2.449,0.269,1.11],["C",-2.886,1.27,0.052],["C",-2.404,0.858,-1.325],["C",-0.906,0.624,-1.374],["O",-0.28,0.917,-2.4],["C",1.27,0.115,-0.131],["C",2.229,-0.921,-0.217],["C",3.606,-0.674,-0.157],["C",4.076,0.622,-0.018],["C",3.168,1.672,0.051],["C",1.786,1.431,-0.009],["Cl",0.796,2.855,0.057],["H",-0.609,-3.602,-0.014],["H",-1.412,-2.54,1.123],["H",0.362,-2.595,1.061],["H",-0.024,-1.853,-1.39],["H",-0.572,1.158,1.53],["H",-0.622,-0.508,1.956],["H",-2.829,0.583,2.089],["H",-2.887,-0.714,0.902],["H",-3.979,1.349,0.049],["H",-2.494,2.264,0.302],["H",-2.656,1.644,-2.046],["H",-2.9,-0.064,-1.647],["H",1.936,-1.958,-0.348],["H",4.308,-1.502,-0.228],["H",5.144,0.818,0.023],["H",3.543,2.689,0.142]],"bonds":[[0,1,1],[1,2,1],[2,3,1],[3,4,1],[4,5,1],[5,6,1],[6,7,1],[7,8,2],[2,9,1],[9,10,1.5],[10,11,1.5],[11,12,1.5],[12,13,1.5],[13,14,1.5],[14,15,1],[7,2,1],[14,9,1.5],[0,16,1],[0,17,1],[0,18,1],[1,19,1],[3,20,1],[3,21,1],[4,22,1],[4,23,1],[5,24,1],[5,25,1],[6,26,1],[6,27,1],[10,28,1],[11,29,1],[12,30,1],[13,31,1]],"chiral":2};
    var E = new T.Group(), eMats = [], ECOL = { C: 0x8fa3b7, N: 0x3d6bd4, O: 0xd6407a, Cl: 0x17a077, H: 0xffffff }, ERAD = { C: 0.42, N: 0.42, O: 0.42, Cl: 0.56, H: 0.24 };
    function eMat(c, k) { var m2 = new T.MeshLambertMaterial({ color: c, transparent: true, opacity: 0 }); m2.userData.k = k || 1; eMats.push(m2); return m2; }
    function molecule(mirror) {
      var g = new T.Group(), bm = eMat(0xc3d0dc), up = V(0, 1, 0);
      MOL.atoms.forEach(function (a) { var sp = new T.Mesh(new T.SphereGeometry(ERAD[a[0]], q >= 1 ? 24 : 14, q >= 1 ? 16 : 10), eMat(ECOL[a[0]])); sp.position.set(a[1], a[2], a[3]); g.add(sp); });
      MOL.bonds.forEach(function (b) { var a0 = MOL.atoms[b[0]], a1 = MOL.atoms[b[1]], p0 = V(a0[1], a0[2], a0[3]), d = V(a1[1], a1[2], a1[3]).sub(p0), r = b[2] > 1 ? 0.15 : 0.1;
        var c = new T.Mesh(new T.CylinderGeometry(r, r, d.length(), 10), bm); c.position.copy(p0).addScaledVector(d, 0.5); c.quaternion.setFromUnitVectors(up, d.clone().normalize()); g.add(c); });
      if (mirror) g.scale.x = -1;
      var spin = new T.Group(); spin.add(g); spin.scale.setScalar(0.115); return spin;
    }
    var esk = molecule(false), ark = molecule(true); esk.position.set(0.62, 0.5, 0); ark.position.set(-0.62, 0.5, 0); E.add(esk, ark);
    var mirrorLine = new T.Mesh(new T.BoxGeometry(0.008, 1.5, 0.008), eMat(SKY, 0.8)); mirrorLine.position.set(0, 0.5, 0); E.add(mirrorLine);
    var eskGlow = A.halo(ROSE, 1.5); eskGlow.position.copy(esk.position); E.add(eskGlow);
    S.root.add(E);

    S.def({ brain: 1, micro: 0, enan: 0, hl: 0.7, net: 0, gaba: 1, glu: 0.15, block: 0, ket: 0, bdnf: 0 });
    S.def({ grow: 0 }, 0.35);

    S.legend([[A.css(AMBER), 'Glutamate'], [A.css(C.gaba), 'GABA'], [A.css(ROSE), 'Ketamine or esketamine'], [A.css(CALM), 'BDNF']]);
    S.label('pfc', 'Prefrontal cortex', 'Prefrontal cortex (PFC)', P.pfcL, 'r');
    S.label('inh', 'Inhibitory cell', 'GABA interneuron', V(-1.0, 0.9, 0), 't');
    S.label('sig', 'Signaling cell', 'Pyramidal neuron', V(0.3, 0.8, 0), 'r');
    S.label('recv', 'Receiving cell', 'Postsynaptic dendrite', V(1.0, -0.72, 0), 'b');
    S.label('glu0', 'Glutamate, held back', 'Glutamate release restrained', V(0.2, -0.3, 0), 'r');
    S.label('ark', 'Arketamine (R)', '(R)-ketamine', V(-0.62, -0.02, 0), 'b');
    S.label('esk', 'Esketamine (S)', '(S)-ketamine, higher affinity', V(0.62, -0.02, 0), 'b');
    S.label('nmda', 'NMDA receptor', 'NMDA receptor channel', V(-1.3, 0.72, 0), 't');
    S.label('ket', 'Ketamine or esketamine', 'Open-channel block', function () { return kets[0].position; }, 'b');
    S.label('quiet', 'Less inhibition', 'Disinhibition', V(-1.0, 0.9, 0), 't');
    S.label('surge', 'Burst of glutamate', 'Glutamate surge, AMPA activation', V(0.2, -0.36, 0), 'r');
    S.label('bdnf', 'Growth signal (BDNF)', 'BDNF, TrkB, mTORC1', V(-0.4, -0.72, 0), 'b');
    S.label('newsp', 'New connections', 'New dendritic spines', function () { return spines[4].userData.head; }, 't');
    S.label('net', 'Mood areas communicate', 'Prefrontal connectivity', P.sgacc, 'b');

    var steps = [
      function () { S.go({ enan: 0, brain: 1, micro: 0, hl: 0.75, net: 0, gaba: 1, glu: 0.15, block: 0, ket: 0, bdnf: 0, grow: 0, cy: 0.75, cp: 0.16, cd: 4.5, tx: 0, ty: 0.03, tz: 0.05 }); S.show(['pfc']); S.chip(''); },
      function () { S.go({ enan: 0, brain: 0, micro: 1, hl: 0, net: 0, gaba: 1, glu: 0.15, block: 0, ket: 0, bdnf: 0, grow: 0, cy: 0.05, cp: 0.06, cd: 5.6, tx: -0.1, ty: 0.25, tz: 0 }); S.show(['inh', 'sig', 'recv', 'glu0']); S.chip(''); },
      function () { S.go({ enan: 1, brain: 0, micro: 0, hl: 0, net: 0, gaba: 1, glu: 0.15, block: 0, ket: 0, bdnf: 0, grow: 0, cy: 0.35, cp: 0.08, cd: 3.5, tx: 0, ty: 0.42, tz: 0 }); S.show(['ark', 'esk']); S.chip(''); },
      function () { S.go({ enan: 0, brain: 0, micro: 1, hl: 0, net: 0, gaba: 0.5, glu: 0.15, block: 1, ket: 1, bdnf: 0, grow: 0, cy: 0.3, cp: 0.12, cd: 2.6, tx: -1.2, ty: 0.62, tz: 0 }); S.show(['nmda', 'ket']); S.chip(''); },
      function () { S.go({ enan: 0, brain: 0, micro: 1, hl: 0, net: 0, gaba: 0.08, glu: 1, block: 1, ket: 1, bdnf: 0, grow: 0, cy: 0.05, cp: 0.06, cd: 5.2, tx: -0.1, ty: 0.15, tz: 0 }); S.show(['quiet', 'surge']); S.chip(''); },
      function () { S.P.grow = 0; S.go({ enan: 0, brain: 0, micro: 1, hl: 0, net: 0, gaba: 0.08, glu: 0.55, block: 1, ket: 0.6, bdnf: 1, grow: 1, cy: -0.1, cp: 0.14, cd: 4.0, tx: 0, ty: -0.42, tz: 0 }); S.show(['bdnf', 'newsp']); S.chip('Hours to days'); },
      function () { S.go({ enan: 0, brain: 1, micro: 0, hl: 0.6, net: 1, gaba: 0.08, glu: 0.5, block: 1, ket: 0, bdnf: 0, cy: 1.0, cp: 0.1, cd: 4.5, tx: 0, ty: 0.03, tz: 0.05 }); S.show(['net']); S.chip('Onset: hours to days'); }
    ];

    var col = new T.Color();
    function update(time, dt, p) {
      /* brain */
      G.uFade.value = p.brain; B.stemGlass.u.uFade.value = p.brain; B.group.visible = p.brain > 0.01;
      G.uOpacity.value = A.lerp(0.36, 0.2, p.net); G.uHLi.value[0] = p.hl * p.brain * (0.75 + 0.25 * Math.sin(time * 2)); G.uHLi.value[1] = G.uHLi.value[0];
      for (var n = 0; n < nets.length; n++) { nets[n].tick(p.net * p.brain, 0.28 + n * 0.03, dt); netNodes[n].set(p.net * p.brain * 0.9); }
      /* the two forms of ketamine turn as mirror images */
      E.visible = p.enan > 0.01;
      if (E.visible) { for (var em = 0; em < eMats.length; em++) eMats[em].opacity = p.enan * eMats[em].userData.k; esk.rotation.y = time * 0.5; ark.rotation.y = -time * 0.5; eskGlow.material.opacity = p.enan * (0.16 + 0.06 * Math.sin(time * 2)); E.scale.setScalar(0.9 + 0.1 * p.enan); }
      /* micro */
      M.visible = p.micro > 0.01; if (!M.visible) return;
      M.scale.setScalar(0.86 + 0.14 * p.micro);
      for (var f = 0; f < fades.length; f++) fades[f].uFade.value = p.micro;
      var m = p.micro, i, e, r, j;
      inhGlow.material.opacity = m * (0.12 + 0.5 * p.gaba) * (0.8 + 0.2 * Math.sin(time * 6));
      sigGlow.material.opacity = m * (0.08 + 0.55 * p.glu) * (0.8 + 0.2 * Math.sin(time * 5 + 1));
      synGlow.material.opacity = m * p.glu * 0.8;
      /* glutamate: terminal to spine heads */
      var act = Math.round(44 * A.clamp(p.glu, 0, 1)), live = spines.filter(function (s) { return !s.userData.isNew || p.grow > 0.6; });
      for (i = 0; i < 44; i++) {
        if (i >= act) { glu.put(i, 0, -99, 0, 0.001); continue; }
        r = rj[i]; e = (time * (0.45 + 0.2 * r[0]) + r[1]) % 1; j = live[(i * 7) % live.length].userData.head;
        var tx = (i % 3 === 0) ? spines[0].userData.head : j, bx = boutB.x + (r[2] - 0.5) * 0.2;
        glu.put(i, A.lerp(bx, tx.x + (r[3] - 0.5) * 0.06, e), A.lerp(boutB.y, tx.y, e) + 0.03 * Math.sin(e * 9 + r[0] * 6), (r[2] - 0.5) * 0.18 * (1 - e), m * Math.sin(Math.PI * e));
      }
      glu.flush();
      /* GABA: inhibitory terminal onto the signaling cell */
      act = Math.round(14 * A.clamp(p.gaba, 0, 1));
      for (i = 0; i < 14; i++) {
        if (i >= act) { gaba.put(i, 0, -99, 0, 0.001); continue; }
        r = rj[i + 44]; e = (time * (0.8 + 0.3 * r[0]) + r[1]) % 1;
        gaba.put(i, A.lerp(gA.x, gB.x, e), gA.y + (r[2] - 0.5) * 0.1, gA.z + (r[3] - 0.5) * 0.1, m * Math.sin(Math.PI * e));
      }
      gaba.flush();
      /* ions through the open receptor */
      for (i = 0; i < 6; i++) { e = (time * 0.9 + i / 6) % 1; ions.put(i, A.lerp(-1.48, -1.2, e), 0.62 + 0.012 * Math.sin(i * 2.1), 0.012 * Math.cos(i * 2.1), m * (1 - p.block) * Math.sin(Math.PI * e)); }
      ions.flush();
      /* the medicine */
      for (i = 0; i < kets.length; i++) {
        var kk = kets[i], h = kk.userData.home;
        kk.visible = p.ket > 0.05; if (!kk.visible) continue;
        var bx2 = h.x + 0.05 * Math.sin(time * 0.9 + kk.userData.ph), by2 = h.y + 0.05 * Math.cos(time * 0.7 + kk.userData.ph);
        if (i === 0) kk.position.set(A.lerp(bx2, pore.x, p.block), A.lerp(by2, pore.y, p.block), A.lerp(h.z, pore.z, p.block));
        else kk.position.set(bx2 + 0.25, by2, h.z);
        kk.rotation.set(time * 0.6 + i, time * 0.4, 0); kk.scale.setScalar(m * Math.min(1, p.ket * 1.5) * (i === 0 ? 1 + 0.5 * p.block : 1));
      }
      /* growth */
      for (i = 0; i < 18; i++) {
        r = rj[i + 20]; e = (time * (0.16 + 0.1 * r[0]) + r[1]) % 1;
        bdnf.put(i, 0.1 + (i % 2 ? 1 : -1) * e * 1.25, -0.72 + 0.13 * Math.sin(e * 7 + r[2] * 6), 0.12 * Math.cos(e * 7 + r[3] * 6), m * p.bdnf * Math.sin(Math.PI * e));
      }
      bdnf.flush();
      for (i = 0; i < spines.length; i++) if (spines[i].userData.isNew) { var gsc = A.clamp(p.grow * 1.6 - (i - 3) * 0.14, 0, 1); spines[i].visible = gsc > 0.02; spines[i].scale.setScalar(gsc); }
      if (S.step === 5) S.chip(p.grow < 0.5 ? 'Hours' : 'About a day');
    }
    return { steps: steps, update: update };
  };
})();

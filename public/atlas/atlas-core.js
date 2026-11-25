/* McLean NTC Atlas: shared 3D toolkit.
   Procedural anatomy (no downloaded models), a glass material, labels, camera and
   an adaptive quality loop so the same page runs on a phone, a kiosk tablet and a desktop. */
(function () {
  'use strict';
  var T = window.THREE;
  var A = (window.MNTC3D = { scenes: {} });
  if (!T) return;

  /* ---------- small math ---------- */
  function clamp(x, a, b) { return x < a ? a : x > b ? b : x; }
  function smooth(a, b, x) { var t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); }
  function gauss(x, s) { return Math.exp(-(x * x) / (2 * s * s)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  A.clamp = clamp; A.smooth = smooth; A.gauss = gauss; A.lerp = lerp;

  /* ---------- theme ----------
     The stage sits on the page's own paper background, so everything is drawn as ink on paper:
     saturated mid-tones, ordinary alpha blending, darker rims. (A dark stage would use light,
     additive colours instead; set data-atlas-theme="dark" on <html> to get that.) */
  var LIGHT = document.documentElement.getAttribute('data-atlas-theme') !== 'dark';
  A.light = LIGHT;
  A.C = LIGHT ? {
    sky: 0x2a84d8, amber: 0xe2820c, calm: 0x17a077, gold: 0xc48a0c, blue: 0x3d6bd4, rose: 0xd6407a,
    indigo: 0x5a69d2, indigoDeep: 0x232a66, ion: 0x123a5a, cell: 0xa9a2dc, warm: 0xb9480a, gaba: 0x3f7fe0,
    steel: 0x8b9db0, steelDark: 0x3c5065, steelGlow: 0x0c1218, wire: 0x5f7286, plug: 0x16283b, plugGlow: 0x060b12, ring: 0x2a84d8
  } : {
    sky: 0x58b7ff, amber: 0xffb44a, calm: 0x5fe0b7, gold: 0xf2c14e, blue: 0x6aa8ff, rose: 0xff7fb0,
    indigo: 0xb7c0f0, indigoDeep: 0x23284f, ion: 0xffffff, cell: 0x6d8aa8, warm: 0xfff2d6, gaba: 0x7fb8ff,
    steel: 0xc8d3de, steelDark: 0x46596e, steelGlow: 0x1a232e, wire: 0xdfe7ef, plug: 0xf4f7fb, plugGlow: 0x5a6675, ring: 0x7fc4f5
  };
  A.css = function (hex) { return '#' + ('000000' + hex.toString(16)).slice(-6); };
  /* overactive (amber) settling to calm (green): on paper, pass through softened yellow-greens, not olive */
  var _hsl = {};
  A.settle = function (out, from, to, t) {
    if (!LIGHT) return out.copy(from).lerp(to, t);
    out.copy(from).lerpHSL(to, t).getHSL(_hsl);
    return out.setHSL(_hsl.h, _hsl.s * (1 - 0.34 * Math.sin(Math.PI * t)), _hsl.l + 0.04 * Math.sin(Math.PI * t));
  };
  A.BLEND = LIGHT ? T.NormalBlending : T.AdditiveBlending;

  /* ---------- seeded Perlin noise ---------- */
  var perm = new Uint8Array(512);
  (function () {
    var p = [], i, s = 1337;
    for (i = 0; i < 256; i++) p[i] = i;
    for (i = 255; i > 0; i--) {
      s = (s * 1664525 + 1013904223) >>> 0;
      var j = s % (i + 1), t = p[i]; p[i] = p[j]; p[j] = t;
    }
    for (i = 0; i < 512; i++) perm[i] = p[i & 255];
  })();
  function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
  function grad(h, x, y, z) {
    h &= 15; var u = h < 8 ? x : y, v = h < 4 ? y : (h === 12 || h === 14 ? x : z);
    return ((h & 1) ? -u : u) + ((h & 2) ? -v : v);
  }
  function noise3(x, y, z) {
    var X = Math.floor(x), Y = Math.floor(y), Z = Math.floor(z);
    x -= X; y -= Y; z -= Z; X &= 255; Y &= 255; Z &= 255;
    var u = fade(x), v = fade(y), w = fade(z);
    var a = perm[X] + Y, aa = perm[a] + Z, ab = perm[a + 1] + Z, b = perm[X + 1] + Y, ba = perm[b] + Z, bb = perm[b + 1] + Z;
    return lerp(
      lerp(lerp(grad(perm[aa], x, y, z), grad(perm[ba], x - 1, y, z), u), lerp(grad(perm[ab], x, y - 1, z), grad(perm[bb], x - 1, y - 1, z), u), v),
      lerp(lerp(grad(perm[aa + 1], x, y, z - 1), grad(perm[ba + 1], x - 1, y, z - 1), u), lerp(grad(perm[ab + 1], x, y - 1, z - 1), grad(perm[bb + 1], x - 1, y - 1, z - 1), u), v), w);
  }
  A.noise3 = noise3;

  /* ---------- indexed icosphere ---------- */
  function icosphere(n) {
    var t = (1 + Math.sqrt(5)) / 2;
    var V = [[-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]];
    var F = [[0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8], [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]];
    var pos = [], idx = [], map = new Map();
    function vid(x, y, z) {
      var l = Math.sqrt(x * x + y * y + z * z); x /= l; y /= l; z /= l;
      var k = Math.round(x * 2e4) + '_' + Math.round(y * 2e4) + '_' + Math.round(z * 2e4), i = map.get(k);
      if (i === undefined) { i = pos.length / 3; pos.push(x, y, z); map.set(k, i); }
      return i;
    }
    for (var f = 0; f < 20; f++) {
      var a = V[F[f][0]], b = V[F[f][1]], c = V[F[f][2]], rows = [], i, j, k;
      for (i = 0; i <= n; i++) {
        rows[i] = [];
        for (j = 0; j <= n - i; j++) { k = n - i - j; rows[i][j] = vid((a[0] * k + b[0] * i + c[0] * j) / n, (a[1] * k + b[1] * i + c[1] * j) / n, (a[2] * k + b[2] * i + c[2] * j) / n); }
      }
      for (i = 0; i < n; i++) for (j = 0; j < n - i; j++) {
        idx.push(rows[i][j], rows[i + 1][j], rows[i][j + 1]);
        if (j < n - i - 1) idx.push(rows[i + 1][j], rows[i + 1][j + 1], rows[i][j + 1]);
      }
    }
    return { pos: pos, idx: idx };
  }

  /* ---------- anatomy: cerebral hemisphere ----------
     Brain space: +x patient's left, +y up, +z anterior. Cerebrum is about 1.76 long. */
  var HA = 0.66, HB = 0.6, HC = 0.88;
  function segDist(pz, py, az, ay, bz, by) {
    var vz = bz - az, vy = by - ay, wz = pz - az, wy = py - ay;
    var t = clamp((wz * vz + wy * vy) / (vz * vz + vy * vy), 0, 1);
    var dz = pz - (az + vz * t), dy = py - (ay + vy * t);
    return Math.sqrt(dz * dz + dy * dy);
  }
  /* d: unit direction (lateral = +x). Returns [x,y,z,sulc] for the LEFT hemisphere. */
  function hemi(x, y, z, seed, detail, o) {
    var px = (x > 0 ? x : x * 0.06) * HA, py = y * HB, pz = z * HC;
    if (y < 0) py *= 0.82;
    var f = smooth(0.2, 1, z); px *= 1 - 0.22 * f; py *= 1 - 0.07 * f;
    var oc = smooth(0.3, 1, -z); px *= 1 - 0.16 * oc; py *= 1 - 0.1 * oc;
    px *= 1 + 0.05 * gauss(z + 0.2, 0.35);
    var lat = smooth(0.05, 0.55, x);
    var tl = smooth(0.05, 0.55, -y) * gauss(z - 0.16, 0.34) * lat;
    px += 0.08 * tl; py -= 0.2 * tl; pz += 0.05 * tl;
    var orb = smooth(0.3, 0.85, z) * smooth(0, 0.6, -y); py += 0.14 * orb;
    var cb = smooth(0.25, 0.9, -z) * smooth(0, 0.6, -y); py += 0.13 * cb;
    // outward direction (ellipsoid normal, medial wall faces -x)
    var nx = x > 0.02 ? x / HA : -1.6, ny = y / HB, nz = z / HC, nl = Math.sqrt(nx * nx + ny * ny + nz * nz);
    nx /= nl; ny /= nl; nz /= nl;
    // named fissures on the lateral surface
    var syl = gauss(segDist(pz, py, 0.4, -0.15, -0.22, 0.1), 0.03) * smooth(0.12, 0.42, x);
    var cen = gauss(segDist(pz, py, -0.02, 0.62, 0.12, 0.06), 0.022) * smooth(0.05, 0.35, x) * 0.8;
    // gyri: zero crossings of warped noise make long winding sulci
    var w = 1.6, wx = noise3(px * w + seed, py * w, pz * w), wy = noise3(px * w, py * w + seed + 9.1, pz * w), wz = noise3(px * w, py * w, pz * w + seed + 21.7);
    var qx = px + 0.15 * wx, qy = py + 0.15 * wy, qz = pz + 0.15 * wz, F = detail;
    var n = noise3(qx * F + seed, qy * F, qz * F) + 0.32 * noise3(qx * F * 2.1, qy * F * 2.1 + seed, qz * F * 2.1);
    var s = 1 - smooth(0.02, 0.3, Math.abs(n));
    var medial = x > 0.02 ? 1 : 0.45;
    var bulge = 0.014 * noise3(px * 2.3, py * 2.3 + seed, pz * 2.3);
    var sulc = Math.max(s * medial, syl, cen) + (x > 0.02 ? 0 : 2);
    var delta = -0.04 * s * medial - 0.055 * syl - 0.03 * cen + bulge;
    o[0] = px + nx * delta + 0.014; o[1] = py + ny * delta; o[2] = pz + nz * delta; o[3] = sulc; o[4] = nx; o[5] = ny; o[6] = nz;
    return o;
  }
  A.hemiPoint = function (x, y, z) { // surface point for a direction, left hemisphere
    var l = Math.sqrt(x * x + y * y + z * z), o = [0, 0, 0, 0];
    hemi(x / l, y / l, z / l, 3.3, 5.6, o); return new T.Vector3(o[0], o[1], o[2]);
  };

  function geom(pos, idx, extra, bn) {
    var g = new T.BufferGeometry();
    g.setAttribute('position', new T.Float32BufferAttribute(pos, 3));
    if (extra) g.setAttribute('sulc', new T.Float32BufferAttribute(extra, 1));
    g.setIndex(idx); g.computeVertexNormals();
    if (bn) g.setAttribute('bnormal', new T.Float32BufferAttribute(bn, 3));
    return g;
  }
  function hemiGeometry(side, n) {
    var ico = icosphere(n), P = ico.pos, pos = new Float32Array(P.length), bn = new Float32Array(P.length), sulc = new Float32Array(P.length / 3), o = [0, 0, 0, 0, 0, 0, 0];
    var seed = side > 0 ? 3.3 : 47.9;
    for (var i = 0, v = 0; i < P.length; i += 3, v++) {
      hemi(P[i], P[i + 1], P[i + 2], seed, 5.6, o);
      pos[i] = o[0] * side; pos[i + 1] = o[1]; pos[i + 2] = o[2]; sulc[v] = o[3];
      bn[i] = o[4] * side; bn[i + 1] = o[5]; bn[i + 2] = o[6];
    }
    var idx = ico.idx;
    if (side < 0) { idx = idx.slice(); for (var k = 0; k < idx.length; k += 3) { var t = idx[k + 1]; idx[k + 1] = idx[k + 2]; idx[k + 2] = t; } }
    return geom(pos, idx, sulc, bn);
  }
  function cerebellumGeometry(n) {
    var ico = icosphere(n), P = ico.pos, pos = new Float32Array(P.length), sulc = new Float32Array(P.length / 3);
    for (var i = 0, v = 0; i < P.length; i += 3, v++) {
      var x = P[i], y = P[i + 1], z = P[i + 2];
      var px = x * 0.5, py = y * 0.24, pz = z * 0.31;
      if (y > 0) py *= 0.72;                       // tucked under the occipital lobes
      px *= 1 - 0.1 * gauss(x, 0.12) * smooth(-0.2, 0.6, -z); // vermis notch
      var s = 1 - smooth(0, 0.45, Math.abs(Math.sin(y * 17 + 1.3 * noise3(px * 3, py * 3, pz * 3))));
      var d = -0.012 * s;
      pos[i] = px * (1 + d); pos[i + 1] = py * (1 + d * 2) - 0.43; pos[i + 2] = pz * (1 + d) - 0.45; sulc[v] = s * 0.8;
    }
    return geom(pos, ico.idx, sulc);
  }
  function stemGeometry() {
    var rings = 28, segs = 20, pos = [], sulc = [], idx = [];
    for (var r = 0; r <= rings; r++) {
      var t = r / rings, u = 1 - t;
      var cy = u * u * -0.08 + 2 * u * t * -0.48 + t * t * -0.94, cz = u * u * -0.08 + 2 * u * t * -0.17 + t * t * -0.33;
      var rad = lerp(0.15, 0.088, smooth(0.15, 1, t)) * (1 + 0.1 * gauss(t - 0.4, 0.13));
      for (var s = 0; s <= segs; s++) {
        var a = (s / segs) * Math.PI * 2, ca = Math.cos(a), sa = Math.sin(a);
        var bulge = 1 + 0.42 * gauss(t - 0.4, 0.12) * Math.max(0, sa); // pons, anterior
        pos.push(ca * rad, cy + sa * rad * 0.28 * bulge, cz + sa * rad * bulge); sulc.push(0);
      }
    }
    for (r = 0; r < rings; r++) for (s = 0; s < segs; s++) {
      var i0 = r * (segs + 1) + s, i1 = i0 + segs + 1;
      idx.push(i0, i0 + 1, i1, i0 + 1, i1 + 1, i1);
    }
    return geom(pos, idx, sulc);
  }

  /* ---------- glass material ---------- */
  var GV = [
    'attribute float sulc; attribute vec3 bnormal; varying vec3 vN; varying vec3 vB; varying vec3 vV; varying float vS; varying vec3 vP;',
    'void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0); vN = normalize(normalMatrix * normal); vB = normalize(normalMatrix * bnormal); vV = normalize(-mv.xyz); vS = sulc; vP = position; gl_Position = projectionMatrix * mv; }'
  ].join('\n');
  var GF = [
    'precision highp float;',
    'uniform vec3 uColor; uniform vec3 uRim; uniform float uOpacity; uniform float uRimPow; uniform float uSulc; uniform float uBack; uniform float uFade; uniform float uLight;',
    'uniform vec3 uHL[4]; uniform vec3 uHLc[4]; uniform float uHLr[4]; uniform float uHLi[4];',
    'varying vec3 vN; varying vec3 vB; varying vec3 vV; varying float vS; varying vec3 vP;',
    'void main(){',
    '  vec3 N = normalize(vN); vec3 V = normalize(vV); float med = step(1.5, vS); float sS = vS - 2.0*med;',
    '  float fres = pow(1.0 - abs(dot(normalize(vB),V)), uRimPow) + 0.16 * pow(1.0 - abs(dot(N,V)), 3.0);',
    '  float ndl = max(dot(N * (uBack > 0.5 ? -1.0 : 1.0), normalize(vec3(-0.45,0.75,0.5))), 0.0);',
    '  vec3 col; float a;',
    '  if(uLight > 0.5){',                                   // ink on paper: pale fill, darker rim and folds
    '    float sh = 1.0 - ndl; float fold = clamp(smoothstep(0.16, 0.78, sS) * uSulc * 1.4, 0.0, 1.0);',
    '    col = uColor * (1.0 - 0.12*sh);',
    '    col = mix(col, uRim, fold * 0.74);',
    '    col = mix(col, uRim, clamp(fres*0.9, 0.0, 1.0));',
    '    a = (uOpacity * (0.64 + 0.28*sh) + fres * 0.56 + fold * (0.3 - 0.08*sh)) * mix(1.0, 0.5, med);',
    '  } else {',
    '    col = uColor * (0.42 + 0.58*ndl);',
    '    col *= 1.0 - uSulc * sS;',
    '    col += uRim * fres * 0.85;',
    '    a = (uOpacity * (0.5 + 0.5*ndl) + fres * 0.55) * mix(1.0, 0.22, med);',
    '  }',
    '  for(int i=0;i<4;i++){',
    '    float d = distance(vP, uHL[i]);',
    '    float g = (1.0 - smoothstep(uHLr[i]*0.25, uHLr[i], d)) * uHLi[i];',
    '    col = mix(col, uHLc[i] * (uLight > 0.5 ? 1.0 : 0.75 + 0.5*ndl), clamp(g,0.0,1.0)*0.9); a += g * 0.5;',
    '  }',
    '  if(uBack > 0.5) a *= (uLight > 0.5 ? 0.14 : 0.35);',
    '  gl_FragColor = vec4(col, clamp(a,0.0,1.0) * uFade);',
    '}'
  ].join('\n');
  /* on paper the fill is a paler tint of the base colour and the rim a deeper one */
  function inkPair(o) {
    var base = new T.Color(o.color || 0x9db9d6), h = {}; base.getHSL(h);
    var fill = o.fill != null ? new T.Color(o.fill) : new T.Color().setHSL(h.h, Math.min(1, h.s * 0.95), Math.min(0.86, h.l + (1 - h.l) * 0.42));
    var rim = o.ink != null ? new T.Color(o.ink) : new T.Color().setHSL(h.h, Math.min(1, h.s * 1.15 + 0.08), Math.max(0.2, h.l * 0.52));
    return [fill, rim];
  }
  A.glass = function (o) {
    o = o || {};
    var pair = LIGHT ? inkPair(o) : [new T.Color(o.color || 0x9db9d6), new T.Color(o.rim || 0xcfe6fb)];
    var u = {
      uColor: { value: pair[0] }, uRim: { value: pair[1] }, uLight: { value: LIGHT ? 1 : 0 },
      uOpacity: { value: o.opacity == null ? 0.34 : o.opacity }, uRimPow: { value: o.rimPow || 2.2 }, uSulc: { value: o.sulc == null ? 0.6 : o.sulc },
      uBack: { value: 0 }, uFade: { value: 1 },
      uHL: { value: [new T.Vector3(), new T.Vector3(), new T.Vector3(), new T.Vector3()] },
      uHLc: { value: [new T.Color(), new T.Color(), new T.Color(), new T.Color()] },
      uHLr: { value: [0.2, 0.2, 0.2, 0.2] }, uHLi: { value: [0, 0, 0, 0] }
    };
    function mat(back) {
      var uu = {}; for (var k in u) uu[k] = u[k]; uu.uBack = { value: back ? 1 : 0 };
      return new T.ShaderMaterial({ uniforms: uu, vertexShader: GV, fragmentShader: GF, transparent: true, depthWrite: false, side: back ? T.BackSide : T.FrontSide });
    }
    return { u: u, front: mat(false), back: mat(true) };
  };
  /* add a geometry as a two-pass glass object */
  A.glassMesh = function (g, glass, order) {
    if (!g.getAttribute('sulc')) g.setAttribute('sulc', new T.Float32BufferAttribute(new Float32Array(g.getAttribute('position').count), 1));
    if (!g.getAttribute('bnormal')) g.setAttribute('bnormal', g.getAttribute('normal').clone());
    var grp = new T.Group(), b = new T.Mesh(g, glass.back), f = new T.Mesh(g, glass.front);
    b.renderOrder = (order || 10); f.renderOrder = (order || 10) + 5; grp.add(b, f); return grp;
  };

  /* ---------- brain ---------- */
  A.buildBrain = function (q) {
    var n = q >= 2 ? 60 : q === 1 ? 44 : 34;
    var glass = A.glass({ color: 0x8fb0d2, rim: 0xd6ebff, fill: 0xf9dfe8, ink: 0xcc6f96, opacity: 0.5, sulc: 0.44 });
    var stemGlass = A.glass({ color: 0x7493b4, rim: 0x86a9cc, fill: 0xf3ccda, ink: 0xb9597f, opacity: 0.32, sulc: 0.5, rimPow: 3.2 });
    var g = new T.Group();
    var L = A.glassMesh(hemiGeometry(1, n), glass, 20), R = A.glassMesh(hemiGeometry(-1, n), glass, 20);
    var cb = A.glassMesh(cerebellumGeometry(q >= 1 ? 34 : 24), stemGlass, 18), st = A.glassMesh(stemGeometry(), stemGlass, 16);
    g.add(L, R, cb, st);
    var pts = {
      dlpfcL: A.hemiPoint(0.66, 0.5, 0.56), dlpfcR: A.hemiPoint(0.66, 0.5, 0.56).multiply(new T.Vector3(-1, 1, 1)),
      dmpfc: new T.Vector3(0, A.hemiPoint(0.12, 0.82, 0.55).y, A.hemiPoint(0.12, 0.82, 0.55).z),
      fpole: A.hemiPoint(0.35, 0.2, 0.93), pfcL: A.hemiPoint(0.5, 0.42, 0.75),
      acc: new T.Vector3(0, 0.24, 0.42), sgacc: new T.Vector3(0, 0.0, 0.4), ofc: new T.Vector3(0.14, -0.2, 0.5),
      caud: new T.Vector3(0.13, 0.13, 0.2), thal: new T.Vector3(0.09, 0.02, -0.08), amyg: new T.Vector3(0.25, -0.2, 0.08), hipp: new T.Vector3(0.27, -0.2, -0.2),
      pari: A.hemiPoint(0.6, 0.6, -0.45), temp: A.hemiPoint(0.8, -0.35, 0.1), occ: A.hemiPoint(0.4, 0.2, -0.9),
      raphe: new T.Vector3(0, -0.3, -0.21), lc: new T.Vector3(0.035, -0.43, -0.3), nts: new T.Vector3(0.03, -0.78, -0.36), medulla: new T.Vector3(0.05, -0.92, -0.33)
    };
    return { group: g, glass: glass, stemGlass: stemGlass, pts: pts, cerebellum: cb, stem: st };
  };

  /* ---------- head, neck and chest (faceless bust) ---------- */
  var BUST = [ // y, half-width x, depth front, depth back, z centre, squareness (cranium above y=0.08 is an ellipsoid)
    [0.08, 0.78, 1.0, 1.0, 0, 2], [-0.22, 0.77, 1.01, 0.95, 0, 2], [-0.52, 0.71, 0.99, 0.8, 0, 2], [-0.82, 0.63, 0.93, 0.56, 0, 2], [-1.08, 0.5, 0.8, 0.4, 0, 2],
    [-1.24, 0.37, 0.52, 0.4, -0.02, 2], [-1.45, 0.33, 0.33, 0.4, -0.05, 2], [-1.75, 0.36, 0.34, 0.44, -0.07, 2], [-1.9, 0.78, 0.4, 0.5, -0.06, 2.2],
    [-2.05, 1.38, 0.5, 0.52, -0.04, 2.6], [-2.3, 1.56, 0.64, 0.54, -0.02, 2.8], [-2.8, 1.42, 0.7, 0.52, 0, 2.6], [-3.45, 1.24, 0.62, 0.5, 0, 2.4]
  ];
  function cr(a, b, c, d, t) { return 0.5 * ((2 * b) + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t * t + (-a + 3 * b - 3 * c + d) * t * t * t); }
  function bustRow(y, o) {
    if (y >= 0.08) { var k = Math.sqrt(Math.max(0.0004, 1 - Math.pow((y - 0.08) / 0.68, 2))); o[1] = 0.78 * k; o[2] = k; o[3] = k; o[4] = 0; o[5] = 2; return o; }
    var n = BUST.length, i = 0; while (i < n - 2 && y < BUST[i + 1][0]) i++;
    var a = BUST[Math.max(0, i - 1)], b = BUST[i], c = BUST[i + 1], d = BUST[Math.min(n - 1, i + 2)], t = clamp((b[0] - y) / (b[0] - c[0]), 0, 1);
    for (var j = 1; j < 6; j++) o[j] = cr(a[j], b[j], c[j], d[j], t);
    return o;
  }
  A.bustPoint = function (y, ang) { // ang 0 = front (+z), PI/2 = patient's left (+x)
    var o = bustRow(y, []), e = 2 / o[5], sx = Math.sin(ang), cz = Math.cos(ang);
    var X = Math.sign(sx) * Math.pow(Math.abs(sx), e) * o[1], Z = Math.sign(cz) * Math.pow(Math.abs(cz), e) * (cz > 0 ? o[2] : o[3]);
    var da = Math.atan2(sx, cz);
    Z += 0.11 * gauss(y + 0.5, 0.14) * gauss(da, 0.2) * (cz > 0 ? 1 : 0); // nose
    return new T.Vector3(X, y, Z + o[4]);
  };
  /* scalp point and outward normal over a point inside the head */
  A.scalp = function (pt) {
    var ang = Math.atan2(pt.x, pt.z), y = pt.y * 1.3, p, i;
    for (i = 0; i < 5; i++) { p = A.bustPoint(y, ang); y = p.length() * pt.y / pt.length(); }
    p = A.bustPoint(y, ang);
    var a = A.bustPoint(y + 0.02, ang), b = A.bustPoint(y, ang + 0.02);
    return { p: p, n: new T.Vector3().crossVectors(b.sub(p), a.sub(p)).normalize() };
  };
  A.buildBust = function (q, yMin) {
    var rows = q >= 1 ? 70 : 46, segs = q >= 1 ? 64 : 40, pos = [], idx = [], y0 = 0.76, y1 = yMin == null ? -3.45 : yMin;
    var top = Math.round(rows * 0.3);
    for (var r = 0; r <= rows; r++) {
      var y = r <= top ? 0.08 + 0.68 * Math.cos((r / top) * Math.PI / 2) : lerp(0.08, y1, (r - top) / (rows - top));
      for (var s = 0; s <= segs; s++) { var p = A.bustPoint(y, (s / segs) * Math.PI * 2); pos.push(p.x, p.y, p.z); }
    }
    for (r = 0; r < rows; r++) for (s = 0; s < segs; s++) { var i0 = r * (segs + 1) + s, i1 = i0 + segs + 1; idx.push(i0, i1, i0 + 1, i0 + 1, i1, i1 + 1); }
    var glass = A.glass({ color: 0x6f8fb0, rim: 0xbcd9f3, fill: 0xd3e7f9, ink: 0x6aa6dc, opacity: 0.07, sulc: 0, rimPow: 2.6 });
    var grp = A.glassMesh(geom(pos, idx), glass, 30);
    return { group: grp, glass: glass };
  };

  /* ---------- glow sprites, nodes, pathways ---------- */
  var glowTex;
  function glowTexture() {
    if (glowTex) return glowTex;
    var c = document.createElement('canvas'); c.width = c.height = 128;
    var x = c.getContext('2d'), g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.18, 'rgba(255,255,255,.55)'); g.addColorStop(0.45, 'rgba(255,255,255,.14)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g; x.fillRect(0, 0, 128, 128);
    glowTex = new T.CanvasTexture(c); return glowTex;
  }
  A.halo = function (color, size) {
    var s = new T.Sprite(new T.SpriteMaterial({ map: glowTexture(), color: color, transparent: true, blending: A.BLEND, depthWrite: false, depthTest: false }));
    s.scale.setScalar(size * (LIGHT ? 0.82 : 1)); s.renderOrder = 22; return s;
  };
  /* a glowing structure: solid core plus halo. set(intensity 0..1, colorHex?) */
  A.node = function (pos, color, r) {
    var g = new T.Group(); g.position.copy(pos);
    var core = new T.Mesh(new T.SphereGeometry(r, 20, 14), new T.MeshBasicMaterial({ color: color, transparent: true, depthWrite: false }));
    core.renderOrder = 21; var h = A.halo(color, r * 7); g.add(core, h);
    g.userData = { core: core, halo: h, r: r, c: new T.Color(color) };
    g.set = function (i, col) {
      if (col != null) { g.userData.c.set(col); }
      core.material.color.copy(g.userData.c); h.material.color.copy(g.userData.c);
      core.material.opacity = clamp(i, 0, 1); h.material.opacity = clamp(i, 0, 1) * 0.85; g.visible = i > 0.01;
    };
    g.pulse = function (k) { h.scale.setScalar(r * 7 * k * (LIGHT ? 0.82 : 1)); };
    return g;
  };
  /* a tube along points with beads travelling along it */
  A.pathway = function (points, color, o) {
    o = o || {};
    var curve = new T.CatmullRomCurve3(points, !!o.closed, 'catmullrom', 0.5);
    var g = new T.Group();
    var tube = new T.Mesh(new T.TubeGeometry(curve, o.segments || 64, o.radius || 0.012, 8, !!o.closed), new T.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.5, depthWrite: false, blending: A.BLEND }));
    tube.renderOrder = 21; g.add(tube);
    var n = o.beads == null ? 5 : o.beads, beads = [];
    for (var i = 0; i < n; i++) { var b = A.halo(color, (o.bead || 0.12)); g.add(b); beads.push(b); }
    g.userData = { curve: curve, tube: tube, beads: beads, phase: 0, c: new T.Color(color) };
    var tmp = new T.Vector3();
    /* intensity, bead speed (cycles/s), dt, optional color, optional reveal 0..1 */
    g.tick = function (inten, speed, dt, col) {
      g.visible = inten > 0.01; if (!g.visible) return;
      if (col != null) { g.userData.c.set(col); tube.material.color.copy(g.userData.c); }
      tube.material.opacity = (LIGHT ? 0.62 : 0.42) * inten;
      g.userData.phase = (g.userData.phase + dt * speed) % 1;
      for (var i = 0; i < beads.length; i++) {
        var t = (g.userData.phase + i / beads.length) % 1; if (t < 0) t += 1;
        curve.getPoint(t, tmp); beads[i].position.copy(tmp);
        var fadeEnds = o.closed ? 1 : Math.min(1, t * 8, (1 - t) * 8);
        beads[i].material.color.copy(g.userData.c); beads[i].material.opacity = inten * fadeEnds * (speed === 0 ? 0 : 1);
      }
    };
    return g;
  };
  A.tubeMesh = function (points, radius, mat, closed, segs) {
    return new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points, !!closed, 'catmullrom', 0.5), segs || 48, radius, 10, !!closed), mat);
  };
  /* soft matte material for devices and cell bodies */
  A.matte = function (color, o) {
    o = o || {};
    return new T.MeshLambertMaterial({ color: color, emissive: o.emissive || 0x000000, transparent: o.opacity != null && o.opacity < 1 || !!o.transparent, opacity: o.opacity == null ? 1 : o.opacity, depthWrite: o.depthWrite !== false });
  };

  /* ---------- TMS coil (figure 8; angle bends the wings for the deeper OCD coil) ---------- */
  A.buildCoil = function (o) {
    o = o || {};
    var g = new T.Group(), R = o.R || 0.2, bend = o.bend || 0;
    var body = A.matte(LIGHT ? 0x9ccdf3 : 0xaebccb), dark = A.matte(LIGHT ? 0x3f78ad : 0x46596e), ringM = new T.MeshBasicMaterial({ color: A.C.ring, transparent: true, opacity: 0.0, blending: A.BLEND, depthWrite: false });
    var rings = [];
    [-1, 1].forEach(function (sd) {
      var wing = new T.Group();
      var disc = new T.Mesh(new T.CylinderGeometry(R * 1.12, R * 1.12, 0.05, 44), body); disc.rotation.x = Math.PI / 2;
      var hole = new T.Mesh(new T.CylinderGeometry(R * 0.4, R * 0.4, 0.054, 28), dark); hole.rotation.x = Math.PI / 2;
      var ring = new T.Mesh(new T.TorusGeometry(R * 0.78, 0.02, 10, 48), ringM); ring.position.z = -0.045; rings.push(ring);
      wing.add(disc, hole, ring); wing.position.x = sd * R * 0.98; wing.rotation.y = -sd * bend; wing.position.z = Math.abs(Math.sin(bend)) * R * 0.9;
      g.add(wing);
    });
    var hub = new T.Mesh(new T.CylinderGeometry(0.06, 0.075, 0.09, 20), body); hub.rotation.x = Math.PI / 2; hub.position.z = 0.055; g.add(hub);
    var handle = new T.Mesh(new T.CylinderGeometry(0.034, 0.04, 0.44, 16), dark); handle.position.set(0, -0.27, 0.08); g.add(handle);
    var cable = A.tubeMesh([new T.Vector3(0, -0.48, 0.08), new T.Vector3(0, -0.64, 0.12), new T.Vector3(0.03, -0.78, 0.24), new T.Vector3(0.06, -0.86, 0.42)], 0.016, dark); g.add(cable);
    g.userData = { ringMat: ringM, mats: [body, dark] };
    /* place: tangent to a surface point p with outward normal n; the handle points along handleDir */
    g.place = function (p, n, handleDir, lift) {
      var z = n.clone().normalize(), q = new T.Quaternion().setFromUnitVectors(new T.Vector3(0, 0, 1), z);
      g.quaternion.copy(q);
      if (handleDir) {
        var lx = new T.Vector3(1, 0, 0).applyQuaternion(q), ly = new T.Vector3(0, 1, 0).applyQuaternion(q);
        var d = handleDir.clone().addScaledVector(z, -handleDir.dot(z)).normalize().multiplyScalar(-1);
        g.rotateZ(Math.atan2(-d.dot(lx), d.dot(ly)));
      }
      g.position.copy(p).addScaledVector(z, lift == null ? 0.06 : lift);
    };
    return g;
  };

  /* ---------- pulse fronts leaving a coil ---------- */
  A.pulseRings = function (parent, n, color) {
    var arr = [], geo = new T.RingGeometry(0.88, 1, 48), zAxis = new T.Vector3(0, 0, 1), qa = new T.Quaternion();
    for (var i = 0; i < n; i++) {
      var m = new T.Mesh(geo, new T.MeshBasicMaterial({ color: color, transparent: true, opacity: 0, blending: A.BLEND, depthWrite: false, side: T.DoubleSide }));
      m.renderOrder = 24; parent.add(m); arr.push(m);
    }
    return { tick: function (origin, dir, reach, r0, r1, inten, time) {
      qa.setFromUnitVectors(zAxis, dir);
      for (var i = 0; i < arr.length; i++) {
        var ph = (time * 0.85 + i / arr.length) % 1, m = arr[i];
        m.visible = inten > 0.01; if (!m.visible) continue;
        m.position.copy(origin).addScaledVector(dir, 0.05 + ph * reach); m.quaternion.copy(qa);
        m.scale.setScalar(r0 + ph * r1); m.material.opacity = inten * Math.pow(1 - ph, 1.3) * 0.9;
      }
    } };
  };
  /* stimulation comes in trains: a few seconds on, a pause, repeat */
  A.train = function (time, reduce) { if (reduce) return 1; var c = time % 3.4; return smooth(0, 0.25, c) * (1 - smooth(2.2, 2.6, c)); };
  A.fadeGroup = function (g, o) { g.visible = o > 0.02; g.scale.setScalar(0.6 + 0.4 * Math.min(1, o)); };

  /* ---------- instanced particles ---------- */
  A.particles = function (count, radius, color) {
    var m = new T.InstancedMesh(new T.SphereGeometry(radius, 10, 8), new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, depthWrite: false }), count);
    m.instanceMatrix.setUsage(T.DynamicDrawUsage); m.renderOrder = 23;
    var mat = new T.Matrix4(), c = new T.Color(color);
    for (var i = 0; i < count; i++) { mat.makeTranslation(0, -99, 0); m.setMatrixAt(i, mat); m.setColorAt(i, c); }
    m.put = function (i, x, y, z, s) { mat.makeScale(s, s, s); mat.setPosition(x, y, z); m.setMatrixAt(i, mat); };
    m.tint = function (i, col) { m.setColorAt(i, col); };
    m.flush = function () { m.instanceMatrix.needsUpdate = true; if (m.instanceColor) m.instanceColor.needsUpdate = true; };
    return m;
  };

  /* ---------- stage ---------- */
  A.supported = function () {
    try { var c = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl'))); } catch (e) { return false; }
  };
  A.create = function (el, opts) {
    opts = opts || {};
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var mem = navigator.deviceMemory || 4, cores = navigator.hardwareConcurrency || 4;
    var q = opts.quality != null ? opts.quality : (mem <= 2 || cores <= 2) ? 0 : (mem <= 4 && cores <= 4) ? 1 : 2;
    var renderer;
    try {
      renderer = new T.WebGLRenderer({ antialias: q > 0, alpha: true, powerPreference: 'high-performance' });
    } catch (e) { el.classList.add('no3d'); return null; }
    var canvas = renderer.domElement; canvas.className = 'atlas-canvas'; canvas.setAttribute('aria-hidden', 'true');
    el.appendChild(canvas);
    var labelLayer = document.createElement('div'); labelLayer.className = 'atlas-labels'; labelLayer.setAttribute('aria-hidden', 'true'); el.appendChild(labelLayer);
    var scene = new T.Scene(), camera = new T.PerspectiveCamera(30, 1, 0.1, 60), root = new T.Group();
    scene.add(root); scene.add(new T.HemisphereLight(LIGHT ? 0xffffff : 0xdcecff, LIGHT ? 0x8fa3b8 : 0x1a2738, LIGHT ? 1.0 : 0.95));
    var key = new T.DirectionalLight(0xffffff, 0.75); key.position.set(-2, 4, 3); scene.add(key);

    var S = { el: el, scene: scene, root: root, camera: camera, renderer: renderer, quality: q, reduce: reduce, time: 0, mode: 'plain', P: {}, G: {}, rate: {}, step: -1 };
    var W = 1, H = 1, dprCap = q >= 2 ? 2 : q === 1 ? 1.5 : 1;
    function resize() {
      var r = el.getBoundingClientRect(); W = Math.max(1, r.width); H = Math.max(1, r.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprCap)); renderer.setSize(W, H, false);
      camera.aspect = W / H; camera.updateProjectionMatrix(); dirty = 3;
    }
    /* eased parameters: scenes set goals, the loop moves values toward them */
    S.def = function (o, rate) { for (var k in o) { S.P[k] = o[k]; S.G[k] = o[k]; if (rate) S.rate[k] = rate; } };
    S.go = function (o) { for (var k in o) S.G[k] = o[k]; dirty = 3; };
    S.snap = function () { for (var k in S.G) S.P[k] = S.G[k]; };
    S.def({ cy: 0, cp: 0.12, cd: 4.6, tx: 0, ty: 0.05, tz: 0, uy: 0, up: 0, ca: 1.3 }, 2.6);

    /* labels: every label, chip and legend a scene writes is put into the page's language here (site.js holds the words) */
    var tr = function (s) { return window.mntcT ? window.mntcT(s) : s; };
    var labels = {};
    S.label = function (id, plain, sci, anchor, side) {
      var d = document.createElement('div'); d.className = 'atlas-label atlas-label--' + (side || 'r');
      d.innerHTML = '<i></i><span></span>'; labelLayer.appendChild(d);
      labels[id] = { el: d, plain: tr(plain), sci: sci == null ? tr(plain) : tr(sci), anchor: anchor, on: false, text: '', side: side || 'r' };
    };
    var chipEl = el.querySelector('.atlas-chip'), chipText = null;
    S.chip = function (t) { if (!chipEl || t === chipText) return; chipText = t; if (t) chipEl.textContent = tr(t); chipEl.classList.toggle('is-on', !!t); };
    S.legend = function (items) {
      var d = document.createElement('div'); d.className = 'atlas-legend';
      items.forEach(function (it) { var s = document.createElement('span'); s.innerHTML = '<i style="background:' + it[0] + '"></i>'; s.appendChild(document.createTextNode(tr(it[1]))); d.appendChild(s); });
      el.appendChild(d); return d;
    };
    S.show = function (ids) { for (var k in labels) labels[k].on = ids.indexOf(k) >= 0; dirty = 3; };
    S.setMode = function (m) { S.mode = m; dirty = 3; if (S.sceneObj && S.sceneObj.mode) S.sceneObj.mode(m); };
    var v3 = new T.Vector3();
    function placeLabels() {
      for (var k in labels) {
        var L = labels[k], txt = S.mode === 'sci' ? L.sci : L.plain;
        if (L.text !== txt) { L.el.lastChild.textContent = txt; L.text = txt; L.w = 0; }
        var vis = L.on && !!txt, side = L.side;
        if (vis) {
          v3.copy(typeof L.anchor === 'function' ? L.anchor() : L.anchor).project(camera);
          var x = (v3.x * 0.5 + 0.5) * W, y = (-v3.y * 0.5 + 0.5) * H;
          if (v3.z > 1 || v3.z < -1 || x < 4 || x > W - 4 || y < 4 || y > H - 4) vis = false;
          else {
            if (!L.w) L.w = L.el.lastChild.offsetWidth || 140;
            var roomR = W - x - 46, roomL = x - 46, mw = 0;
            if (side === 'r' && L.w > roomR) { if (roomL > roomR) side = 'l'; mw = Math.max(roomL, roomR); }
            else if (side === 'l' && L.w > roomL) { if (roomR > roomL) side = 'r'; mw = Math.max(roomL, roomR); }
            else if ((side === 't' || side === 'b') && L.w > W - x + 6) { if (x > W - x) side += 'l'; mw = Math.max(x, W - x) + 6; }
            else if ((side === 'tl' || side === 'bl') && L.w > x + 6) { if (W - x > x) side = side.charAt(0); mw = Math.max(x, W - x) + 6; }
            mw = mw ? Math.max(96, Math.floor(mw)) : 0;
            if (L.mw !== mw) { L.el.lastChild.style.maxWidth = mw ? mw + 'px' : ''; L.el.lastChild.style.whiteSpace = mw ? 'normal' : ''; L.mw = mw; }
            L.el.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
          }
        }
        if (L.vis !== vis || L.cur !== side) { L.el.className = 'atlas-label atlas-label--' + side + (vis ? ' is-on' : ''); L.vis = vis; L.cur = side; }
      }
    }

    /* pointer: drag to turn. Vertical swipes still scroll the page on touch. */
    var drag = null;
    canvas.addEventListener('pointerdown', function (e) { drag = { x: e.clientX, y: e.clientY, uy: S.G.uy, up: S.G.up }; try { canvas.setPointerCapture(e.pointerId); } catch (x) { } el.classList.add('is-grabbing'); S.touched = true; });
    canvas.addEventListener('pointermove', function (e) {
      if (!drag) return;
      S.G.uy = drag.uy - (e.clientX - drag.x) * 0.007; S.G.up = clamp(drag.up + (e.clientY - drag.y) * 0.004, -0.5, 0.6);
      S.P.uy = lerp(S.P.uy, S.G.uy, 0.5); S.P.up = lerp(S.P.up, S.G.up, 0.5); dirty = 3;
    });
    function endDrag() { drag = null; el.classList.remove('is-grabbing'); }
    canvas.addEventListener('pointerup', endDrag); canvas.addEventListener('pointercancel', endDrag); canvas.addEventListener('lostpointercapture', endDrag);
    S.resetView = function () { S.go({ uy: 0, up: 0 }); };

    /* loop */
    var updates = [], running = false, visible = true, last = 0, raf = 0, dirty = 3, slow = 0, frames = 0, acc = 0;
    S.onUpdate = function (f) { updates.push(f); };
    function frame(now) {
      raf = 0; if (!running) return;
      raf = requestAnimationFrame(frame);
      var dt = Math.min(0.05, (now - last) / 1000 || 0.016);
      if (S.quality === 0 && now - last < 30) return;   // about 30 fps on slow devices
      last = now;
      if (!visible || document.hidden) return;
      var still = (reduce || S.frozen) && dirty <= 0; if (still) return;
      if (dirty > 0) dirty -= dt;
      S.time += (reduce ? 0 : dt);
      var moving = false, k;
      for (k in S.G) { var d = S.G[k] - S.P[k]; if (Math.abs(d) > 1e-4) { S.P[k] += d * (1 - Math.exp(-dt * (S.rate[k] || 4))); moving = true; } else S.P[k] = S.G[k]; }
      if (moving) dirty = Math.max(dirty, 0.3);
      for (var i = 0; i < updates.length; i++) updates[i](S.time, dt, S.P);
      var P = S.P, sway = reduce || drag ? 0 : Math.sin(S.time * 0.25) * 0.06;
      var fit = clamp(P.ca / (W / H), 1, 1.9), yaw = P.cy + P.uy + sway, pitch = clamp(P.cp + P.up, -1.2, 1.2), dist = P.cd * fit;
      camera.position.set(P.tx + Math.sin(yaw) * Math.cos(pitch) * dist, P.ty + Math.sin(pitch) * dist, P.tz + Math.cos(yaw) * Math.cos(pitch) * dist);
      camera.lookAt(P.tx, P.ty, P.tz);
      renderer.render(scene, camera); placeLabels();
      /* adapt: if frames stay slow, drop resolution, then drop to the low tier */
      frames++; acc += dt;
      if (frames === 50) {
        var avg = acc / 50; frames = 0; acc = 0;
        if (avg > 0.045) { slow++; if (slow === 2 && dprCap > 1) { dprCap = 1; resize(); } else if (slow >= 4 && S.quality > 0) { S.quality = 0; } } else if (slow > 0) slow--;
      }
    }
    S.start = function () { if (running) return; running = true; last = performance.now(); if (!raf) raf = requestAnimationFrame(frame); };
    S.stop = function () { running = false; };
    S.render = function () { dirty = 3; };
    S.setStep = function (i, instant) {
      if (!S.sceneObj) return; i = clamp(i, 0, S.sceneObj.steps.length - 1); S.step = i;
      S.G.uy = 0; S.G.up = 0; S.sceneObj.steps[i](); if (instant) S.snap(); dirty = 3;
    };
    S.use = function (sceneFn, arg) { S.sceneObj = sceneFn(S, arg); if (S.sceneObj.update) S.onUpdate(S.sceneObj.update); return S.sceneObj; };
    if (window.ResizeObserver) new ResizeObserver(resize).observe(el); else window.addEventListener('resize', resize);
    if (window.IntersectionObserver) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible) dirty = 3; }, { rootMargin: '120px' }).observe(el);
    canvas.addEventListener('webglcontextlost', function (e) { e.preventDefault(); S.stop(); el.classList.add('no3d'); });
    resize(); el.classList.add('has3d');
    return S;
  };
})();

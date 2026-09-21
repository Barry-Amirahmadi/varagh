/**
 * Placeholder art direction generator — VARAGH.
 *
 * There is no photography yet. Rather than pulling unrelated stock, every slot
 * is filled with a generated "flat lay": hard-edged geometric masses on raw
 * concrete, one directional light from the upper right, hard shadows falling
 * to the lower left, film grain, and one hot vermilion accent on the plates
 * that call for it. Same treatment across all twenty-four, so the set reads as
 * one shoot rather than as twenty-four unrelated fills.
 *
 * ── WHY THIS WRITES REAL JPEGs, AND NOT SVG ──────────────────────────────
 * The engine's generator wrote SVG, and the content referenced `.svg`. Here
 * the real photographs will be `.jpg`, and the rule for this build is that a
 * placeholder must sit at **exactly** the path the real file will use, so
 * replacing it is a file swap and nothing else — no edit to `products.ts`, no
 * 24 one-character changes waiting to be got wrong.
 *
 * That rules out SVG and it rules out PNG bytes wearing a `.jpg` name. So the
 * encoder below is a baseline JPEG encoder, written out because this project
 * has three runtime dependencies and adding an image library to draw some
 * rectangles is a bad trade. It is ~160 lines and entirely standard: Annex K
 * quantization tables, Annex K Huffman tables, 4:4:4, no subsampling.
 *
 *   node scripts/generate-media.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, "..", "public", "media");
mkdirSync(outDir, { recursive: true });

/* ========================================================================== */
/*  Baseline JPEG encoder                                                     */
/* ========================================================================== */

const ZIGZAG = [
  0, 1, 8, 16, 9, 2, 3, 10, 17, 24, 32, 25, 18, 11, 4, 5, 12, 19, 26, 33, 40, 48, 41, 34, 27,
  20, 13, 6, 7, 14, 21, 28, 35, 42, 49, 56, 57, 50, 43, 36, 29, 22, 15, 23, 30, 37, 44, 51, 58,
  59, 52, 45, 38, 31, 39, 46, 53, 60, 61, 54, 47, 55, 62, 63,
];

const Q_LUMA = [
  16, 11, 10, 16, 24, 40, 51, 61, 12, 12, 14, 19, 26, 58, 60, 55, 14, 13, 16, 24, 40, 57, 69, 56,
  14, 17, 22, 29, 51, 87, 80, 62, 18, 22, 37, 56, 68, 109, 103, 77, 24, 35, 55, 64, 81, 104, 113,
  92, 49, 64, 78, 87, 103, 121, 120, 101, 72, 92, 95, 98, 112, 100, 103, 99,
];

const Q_CHROMA = [
  17, 18, 24, 47, 99, 99, 99, 99, 18, 21, 26, 66, 99, 99, 99, 99, 24, 26, 56, 99, 99, 99, 99, 99,
  47, 66, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99,
  99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99,
];

/** Annex K code-length counts and symbol lists. */
const HUFF = {
  dcLuma: {
    bits: [0, 0, 1, 5, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
    vals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  },
  dcChroma: {
    bits: [0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
    vals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  },
  acLuma: {
    bits: [0, 0, 2, 1, 3, 3, 2, 4, 3, 5, 5, 4, 4, 0, 0, 1, 0x7d],
    vals: [
      0x01, 0x02, 0x03, 0x00, 0x04, 0x11, 0x05, 0x12, 0x21, 0x31, 0x41, 0x06, 0x13, 0x51, 0x61,
      0x07, 0x22, 0x71, 0x14, 0x32, 0x81, 0x91, 0xa1, 0x08, 0x23, 0x42, 0xb1, 0xc1, 0x15, 0x52,
      0xd1, 0xf0, 0x24, 0x33, 0x62, 0x72, 0x82, 0x09, 0x0a, 0x16, 0x17, 0x18, 0x19, 0x1a, 0x25,
      0x26, 0x27, 0x28, 0x29, 0x2a, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3a, 0x43, 0x44, 0x45,
      0x46, 0x47, 0x48, 0x49, 0x4a, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59, 0x5a, 0x63, 0x64,
      0x65, 0x66, 0x67, 0x68, 0x69, 0x6a, 0x73, 0x74, 0x75, 0x76, 0x77, 0x78, 0x79, 0x7a, 0x83,
      0x84, 0x85, 0x86, 0x87, 0x88, 0x89, 0x8a, 0x92, 0x93, 0x94, 0x95, 0x96, 0x97, 0x98, 0x99,
      0x9a, 0xa2, 0xa3, 0xa4, 0xa5, 0xa6, 0xa7, 0xa8, 0xa9, 0xaa, 0xb2, 0xb3, 0xb4, 0xb5, 0xb6,
      0xb7, 0xb8, 0xb9, 0xba, 0xc2, 0xc3, 0xc4, 0xc5, 0xc6, 0xc7, 0xc8, 0xc9, 0xca, 0xd2, 0xd3,
      0xd4, 0xd5, 0xd6, 0xd7, 0xd8, 0xd9, 0xda, 0xe1, 0xe2, 0xe3, 0xe4, 0xe5, 0xe6, 0xe7, 0xe8,
      0xe9, 0xea, 0xf1, 0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0xf7, 0xf8, 0xf9, 0xfa,
    ],
  },
  acChroma: {
    bits: [0, 0, 2, 1, 2, 4, 4, 3, 4, 7, 5, 4, 4, 0, 1, 2, 0x77],
    vals: [
      0x00, 0x01, 0x02, 0x03, 0x11, 0x04, 0x05, 0x21, 0x31, 0x06, 0x12, 0x41, 0x51, 0x07, 0x61,
      0x71, 0x13, 0x22, 0x32, 0x81, 0x08, 0x14, 0x42, 0x91, 0xa1, 0xb1, 0xc1, 0x09, 0x23, 0x33,
      0x52, 0xf0, 0x15, 0x62, 0x72, 0xd1, 0x0a, 0x16, 0x24, 0x34, 0xe1, 0x25, 0xf1, 0x17, 0x18,
      0x19, 0x1a, 0x26, 0x27, 0x28, 0x29, 0x2a, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3a, 0x43, 0x44,
      0x45, 0x46, 0x47, 0x48, 0x49, 0x4a, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59, 0x5a, 0x63,
      0x64, 0x65, 0x66, 0x67, 0x68, 0x69, 0x6a, 0x73, 0x74, 0x75, 0x76, 0x77, 0x78, 0x79, 0x7a,
      0x82, 0x83, 0x84, 0x85, 0x86, 0x87, 0x88, 0x89, 0x8a, 0x92, 0x93, 0x94, 0x95, 0x96, 0x97,
      0x98, 0x99, 0x9a, 0xa2, 0xa3, 0xa4, 0xa5, 0xa6, 0xa7, 0xa8, 0xa9, 0xaa, 0xb2, 0xb3, 0xb4,
      0xb5, 0xb6, 0xb7, 0xb8, 0xb9, 0xba, 0xc2, 0xc3, 0xc4, 0xc5, 0xc6, 0xc7, 0xc8, 0xc9, 0xca,
      0xd2, 0xd3, 0xd4, 0xd5, 0xd6, 0xd7, 0xd8, 0xd9, 0xda, 0xe2, 0xe3, 0xe4, 0xe5, 0xe6, 0xe7,
      0xe8, 0xe9, 0xea, 0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0xf7, 0xf8, 0xf9, 0xfa,
    ],
  },
};

/** symbol -> { code, length }, built the way the spec derives canonical codes. */
function huffTable({ bits, vals }) {
  const table = new Map();
  let code = 0;
  let k = 0;
  for (let length = 1; length <= 16; length++) {
    for (let i = 0; i < bits[length]; i++) {
      table.set(vals[k++], { code, length });
      code++;
    }
    code <<= 1;
  }
  return table;
}

/** Scales a quantization table for a quality in 1..100, the libjpeg rule. */
function scaleQuant(base, quality) {
  const factor = quality < 50 ? 5000 / quality : 200 - quality * 2;
  return base.map((v) => Math.min(255, Math.max(1, Math.round((v * factor + 50) / 100))));
}

/** Separable 8-point float DCT-II, rows then columns. Naive and fast enough. */
const COS = (() => {
  const t = new Float64Array(64);
  for (let u = 0; u < 8; u++) {
    for (let x = 0; x < 8; x++) t[u * 8 + x] = Math.cos(((2 * x + 1) * u * Math.PI) / 16);
  }
  return t;
})();
const ALPHA = (u) => (u === 0 ? Math.SQRT1_2 : 1);

function fdct(block, out) {
  const tmp = new Float64Array(64);
  for (let y = 0; y < 8; y++) {
    for (let u = 0; u < 8; u++) {
      let sum = 0;
      for (let x = 0; x < 8; x++) sum += block[y * 8 + x] * COS[u * 8 + x];
      tmp[y * 8 + u] = 0.5 * ALPHA(u) * sum;
    }
  }
  for (let u = 0; u < 8; u++) {
    for (let v = 0; v < 8; v++) {
      let sum = 0;
      for (let y = 0; y < 8; y++) sum += tmp[y * 8 + u] * COS[v * 8 + y];
      out[v * 8 + u] = 0.5 * ALPHA(v) * sum;
    }
  }
}

/** MSB-first bit sink that byte-stuffs 0x00 after every 0xFF, as JPEG requires. */
class BitWriter {
  constructor() {
    this.bytes = [];
    this.acc = 0;
    this.n = 0;
  }
  write(code, length) {
    for (let i = length - 1; i >= 0; i--) {
      this.acc = (this.acc << 1) | ((code >> i) & 1);
      this.n++;
      if (this.n === 8) {
        this.bytes.push(this.acc);
        if (this.acc === 0xff) this.bytes.push(0x00);
        this.acc = 0;
        this.n = 0;
      }
    }
  }
  flush() {
    while (this.n !== 0) this.write(1, 1); // pad with 1s, per the spec
  }
}

/** Category (number of significant bits) and the value's JPEG bit pattern. */
function amplitude(value) {
  const magnitude = Math.abs(value);
  let category = 0;
  while (magnitude >> category) category++;
  return { category, bits: value > 0 ? value : (1 << category) + value - 1 };
}

function encodeJpeg(width, height, rgb, quality = 80) {
  const qy = scaleQuant(Q_LUMA, quality);
  const qc = scaleQuant(Q_CHROMA, quality);
  const tables = {
    dcLuma: huffTable(HUFF.dcLuma),
    dcChroma: huffTable(HUFF.dcChroma),
    acLuma: huffTable(HUFF.acLuma),
    acChroma: huffTable(HUFF.acChroma),
  };

  // Colour transform, full resolution on all three planes (4:4:4).
  const n = width * height;
  const Y = new Float32Array(n);
  const CB = new Float32Array(n);
  const CR = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const r = rgb[i * 3];
    const g = rgb[i * 3 + 1];
    const b = rgb[i * 3 + 2];
    Y[i] = 0.299 * r + 0.587 * g + 0.114 * b - 128;
    CB[i] = -0.168736 * r - 0.331264 * g + 0.5 * b;
    CR[i] = 0.5 * r - 0.418688 * g - 0.081312 * b;
  }

  const bw = new BitWriter();
  const block = new Float64Array(64);
  const coeffs = new Float64Array(64);
  const prevDc = [0, 0, 0];

  const planes = [
    { data: Y, q: qy, dc: tables.dcLuma, ac: tables.acLuma },
    { data: CB, q: qc, dc: tables.dcChroma, ac: tables.acChroma },
    { data: CR, q: qc, dc: tables.dcChroma, ac: tables.acChroma },
  ];

  for (let by = 0; by < height; by += 8) {
    for (let bx = 0; bx < width; bx += 8) {
      for (let p = 0; p < 3; p++) {
        const { data, q, dc, ac } = planes[p];

        // Edge replication: a partial block at the right or bottom edge repeats
        // its last real column/row rather than reading past the buffer.
        for (let y = 0; y < 8; y++) {
          const sy = Math.min(by + y, height - 1);
          for (let x = 0; x < 8; x++) {
            const sx = Math.min(bx + x, width - 1);
            block[y * 8 + x] = data[sy * width + sx];
          }
        }

        fdct(block, coeffs);

        const quantized = new Int16Array(64);
        for (let i = 0; i < 64; i++) quantized[i] = Math.round(coeffs[i] / q[i]);

        // DC, differentially coded against the previous block of this plane.
        const diff = quantized[0] - prevDc[p];
        prevDc[p] = quantized[0];
        if (diff === 0) {
          const e = dc.get(0);
          bw.write(e.code, e.length);
        } else {
          const { category, bits } = amplitude(diff);
          const e = dc.get(category);
          bw.write(e.code, e.length);
          bw.write(bits, category);
        }

        // AC, zigzag order, run-length over zeros.
        let lastNonZero = 0;
        for (let i = 63; i > 0; i--) {
          if (quantized[ZIGZAG[i]] !== 0) {
            lastNonZero = i;
            break;
          }
        }
        let run = 0;
        for (let i = 1; i <= lastNonZero; i++) {
          const value = quantized[ZIGZAG[i]];
          if (value === 0) {
            run++;
            continue;
          }
          while (run > 15) {
            const zrl = ac.get(0xf0); // ZRL: sixteen zeros
            bw.write(zrl.code, zrl.length);
            run -= 16;
          }
          const { category, bits } = amplitude(value);
          const e = ac.get((run << 4) | category);
          bw.write(e.code, e.length);
          bw.write(bits, category);
          run = 0;
        }
        if (lastNonZero < 63) {
          const eob = ac.get(0x00);
          bw.write(eob.code, eob.length);
        }
      }
    }
  }
  bw.flush();

  /* ---- Markers ---------------------------------------------------------- */
  const out = [];
  const u8 = (v) => out.push(v & 0xff);
  const u16 = (v) => {
    out.push((v >> 8) & 0xff);
    out.push(v & 0xff);
  };
  const marker = (m) => {
    u8(0xff);
    u8(m);
  };

  marker(0xd8); // SOI

  marker(0xe0); // APP0 / JFIF
  u16(16);
  for (const c of "JFIF") u8(c.charCodeAt(0));
  u8(0);
  u16(0x0101); // version 1.1
  u8(0); // no density units
  u16(1);
  u16(1);
  u8(0);
  u8(0);

  marker(0xdb); // DQT — both tables in one segment
  u16(2 + 2 * 65);
  u8(0x00);
  for (let i = 0; i < 64; i++) u8(qy[ZIGZAG[i]]);
  u8(0x01);
  for (let i = 0; i < 64; i++) u8(qc[ZIGZAG[i]]);

  marker(0xc0); // SOF0 — baseline, 3 components, no subsampling
  u16(8 + 3 * 3);
  u8(8);
  u16(height);
  u16(width);
  u8(3);
  for (const [id, q] of [
    [1, 0],
    [2, 1],
    [3, 1],
  ]) {
    u8(id);
    u8(0x11); // 1x1 sampling — 4:4:4
    u8(q);
  }

  for (const [cls, id, spec] of [
    [0, 0, HUFF.dcLuma],
    [0, 1, HUFF.dcChroma],
    [1, 0, HUFF.acLuma],
    [1, 1, HUFF.acChroma],
  ]) {
    marker(0xc4); // DHT
    u16(2 + 1 + 16 + spec.vals.length);
    u8((cls << 4) | id);
    for (let i = 1; i <= 16; i++) u8(spec.bits[i]);
    for (const v of spec.vals) u8(v);
  }

  marker(0xda); // SOS
  u16(6 + 2 * 3);
  u8(3);
  for (const [id, t] of [
    [1, 0x00],
    [2, 0x11],
    [3, 0x11],
  ]) {
    u8(id);
    u8(t);
  }
  u8(0);
  u8(63);
  u8(0);

  for (const b of bw.bytes) u8(b);

  marker(0xd9); // EOI

  return Buffer.from(out);
}

/* ========================================================================== */
/*  The art direction                                                         */
/* ========================================================================== */

/** Kept in sync with src/app/tokens.css. */
const PALETTE = {
  paper: [0xf2, 0xf2, 0xf0],
  ink: [0x0a, 0x0a, 0x0a],
  accent: [0xff, 0x3b, 0x00],
  /** Not a token: the concrete the objects are shot on. */
  concrete: [0x86, 0x85, 0x82],
};

/** Deterministic PRNG, so a rerun produces byte-identical files. */
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s ^= s << 13;
    s >>>= 0;
    s ^= s >> 17;
    s ^= s << 5;
    s >>>= 0;
    return s / 4294967296;
  };
}

const SIZE = 1024;
const clamp = (v) => (v < 0 ? 0 : v > 255 ? 255 : v);

/**
 * One plate.
 *
 * `roles` is the colour vocabulary this plate is allowed; `count` is how many
 * masses sit on the concrete. Nothing else varies — one light, one shadow
 * direction, one grain, across all twenty-four.
 */
function render({ seed, roles, count }) {
  const rand = rng(seed);
  const rgb = new Float32Array(SIZE * SIZE * 3);

  // 1 — the concrete, with the light falling from the upper right.
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const u = x / SIZE;
      const v = y / SIZE;
      const light = 1 + 0.34 * (u * 0.55 + (1 - v) * 0.45 - 0.5) * 2;
      const o = (y * SIZE + x) * 3;
      for (let c = 0; c < 3; c++) rgb[o + c] = PALETTE.concrete[c] * light;
    }
  }

  // 2 — the masses, each with a hard shadow thrown to the lower left.
  const shapes = [];
  for (let i = 0; i < count; i++) {
    const w = SIZE * (0.2 + rand() * 0.34);
    const h = SIZE * (0.14 + rand() * 0.34);
    shapes.push({
      cx: SIZE * (0.26 + rand() * 0.48),
      cy: SIZE * (0.26 + rand() * 0.48),
      w,
      h,
      angle: (rand() - 0.5) * 0.7,
      colour: PALETTE[roles[i % roles.length]],
    });
  }

  const SHADOW = SIZE * 0.035;
  for (const pass of ["shadow", "fill"]) {
    for (const s of shapes) {
      const dx = pass === "shadow" ? -SHADOW : 0;
      const dy = pass === "shadow" ? SHADOW : 0;
      const cos = Math.cos(-s.angle);
      const sin = Math.sin(-s.angle);
      const reach = Math.hypot(s.w, s.h) / 2 + 2;
      const x0 = Math.max(0, Math.floor(s.cx + dx - reach));
      const x1 = Math.min(SIZE - 1, Math.ceil(s.cx + dx + reach));
      const y0 = Math.max(0, Math.floor(s.cy + dy - reach));
      const y1 = Math.min(SIZE - 1, Math.ceil(s.cy + dy + reach));

      for (let y = y0; y <= y1; y++) {
        for (let x = x0; x <= x1; x++) {
          const px = x - (s.cx + dx);
          const py = y - (s.cy + dy);
          const rx = px * cos - py * sin;
          const ry = px * sin + py * cos;
          // One-pixel feather on the edge. Brutalist does not mean aliased.
          const ax = Math.min(1, Math.max(0, s.w / 2 - Math.abs(rx)));
          const ay = Math.min(1, Math.max(0, s.h / 2 - Math.abs(ry)));
          const a = ax * ay;
          if (a <= 0) continue;

          const o = (y * SIZE + x) * 3;
          if (pass === "shadow") {
            for (let c = 0; c < 3; c++) rgb[o + c] *= 1 - 0.55 * a;
          } else {
            for (let c = 0; c < 3; c++) rgb[o + c] += (s.colour[c] - rgb[o + c]) * a;
          }
        }
      }
    }
  }

  // 3 — film grain and a closing vignette.
  const out = Buffer.alloc(SIZE * SIZE * 3);
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const o = (y * SIZE + x) * 3;
      const grain = (rand() - 0.5) * 9;
      const u = x / SIZE - 0.5;
      const v = y / SIZE - 0.5;
      const vignette = 1 - 0.3 * Math.min(1, (u * u + v * v) * 2.1);
      for (let c = 0; c < 3; c++) out[o + c] = clamp((rgb[o + c] + grain) * vignette);
    }
  }
  return out;
}

/**
 * The slot list. One entry per file the site references, at exactly the path
 * and the 1:1 ratio the real photograph will use.
 *
 * The three plates of a work share a colour vocabulary and sit on consecutive
 * seeds, so a work reads as one object photographed three times rather than as
 * three unrelated fills.
 */
const slots = [
  { name: "work-01", seed: 101, roles: ["paper", "ink"], count: 4 },
  { name: "work-01-a", seed: 102, roles: ["paper", "ink"], count: 3 },
  { name: "work-01-b", seed: 103, roles: ["paper"], count: 2 },

  { name: "work-02", seed: 201, roles: ["paper", "ink", "accent"], count: 5 },
  { name: "work-02-a", seed: 202, roles: ["paper", "accent", "ink"], count: 3 },
  { name: "work-02-b", seed: 203, roles: ["ink", "accent", "paper"], count: 4 },

  { name: "work-03", seed: 301, roles: ["paper"], count: 2 },
  { name: "work-03-a", seed: 302, roles: ["paper", "ink"], count: 4 },
  { name: "work-03-b", seed: 303, roles: ["paper"], count: 2 },

  { name: "work-04", seed: 401, roles: ["paper"], count: 4 },
  { name: "work-04-a", seed: 402, roles: ["paper"], count: 2 },
  { name: "work-04-b", seed: 403, roles: ["paper", "ink"], count: 5 },

  { name: "work-05", seed: 501, roles: ["paper", "accent"], count: 3 },
  { name: "work-05-a", seed: 502, roles: ["paper", "accent"], count: 4 },
  { name: "work-05-b", seed: 503, roles: ["paper", "accent"], count: 3 },

  { name: "work-06", seed: 601, roles: ["paper", "ink"], count: 3 },
  { name: "work-06-a", seed: 602, roles: ["paper", "ink"], count: 3 },
  { name: "work-06-b", seed: 603, roles: ["ink", "paper"], count: 2 },

  { name: "archive-01", seed: 701, roles: ["ink", "paper"], count: 4 },
  { name: "archive-02", seed: 702, roles: ["paper", "ink", "accent"], count: 5 },
  { name: "archive-03", seed: 703, roles: ["paper"], count: 5 },
  { name: "archive-04", seed: 704, roles: ["ink", "paper"], count: 3 },
  { name: "archive-05", seed: 705, roles: ["accent", "ink", "paper"], count: 4 },
  { name: "archive-06", seed: 706, roles: ["paper"], count: 6 },
];

let count = 0;
let total = 0;
let largest = 0;
for (const slot of slots) {
  const pixels = render(slot);
  const jpeg = encodeJpeg(SIZE, SIZE, pixels, 80);
  writeFileSync(join(outDir, `${slot.name}.jpg`), jpeg);
  count += 1;
  total += jpeg.length;
  largest = Math.max(largest, jpeg.length);
}

console.log(
  `generated ${count} plates at ${SIZE}×${SIZE} → public/media/  ` +
    `total ${(total / 1024).toFixed(0)} KB, largest ${(largest / 1024).toFixed(0)} KB`,
);

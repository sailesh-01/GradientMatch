/**
 * Color Theory Mathematics & Gradient Generator Utility
 */

// Convert HEX to RGB
export function hexToRgb(hex) {
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c.split('').map(x => x + x).join('');
  }
  const num = parseInt(c, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

// Convert RGB to HEX
export function rgbToHex(r, g, b) {
  const toHex = (n) => {
    const hex = Math.max(0, Math.min(255, Math.round(n))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Convert RGB to HSL
export function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

// Convert HSL to HEX
export function hslToHex(h, s, l) {
  h = (h % 360 + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;

  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }

  return rgbToHex((r + m) * 255, (g + m) * 255, (b + m) * 255);
}

// Convert HEX to HSL
export function hexToHsl(hex) {
  const rgb = hexToRgb(hex);
  return rgbToHsl(rgb.r, rgb.g, rgb.b);
}

/**
 * Generate 6 complementary / harmonious gradients built from a base color
 * @param {string} baseHex - Primary base color in hex e.g. "#FF4B2B"
 * @param {string} mode - Harmony mode: "complementary", "analogous", "triadic", "split", "monochromatic"
 */
export function generateHarmoniousGradients(baseHex, mode = 'all') {
  const hsl = hexToHsl(baseHex);
  const { h, s, l } = hsl;
  const results = [];

  // Helper to format gradient object
  const createGradient = (id, name, harmonyType, stops, angle = 135) => ({
    id: `matched-${id}`,
    name,
    category: 'matcher',
    harmonyType,
    type: 'linear',
    angle,
    stops: stops.map((color, idx) => ({
      color,
      position: Math.round((idx / (stops.length - 1)) * 100)
    }))
  });

  // 1. Complementary (Opposite on color wheel: H + 180)
  const compHex = hslToHex(h + 180, s, l);
  const compLight = hslToHex(h + 180, Math.min(100, s + 15), Math.min(90, l + 20));
  const compDark = hslToHex(h + 180, Math.max(20, s - 10), Math.max(15, l - 25));

  results.push(createGradient('comp-1', 'Complementary Contrast', 'Complementary', [baseHex, compHex]));
  results.push(createGradient('comp-2', 'Vibrant Complement', 'Complementary', [baseHex, compLight, compDark], 45));

  // 2. Analogous (Adjacent colors: H ± 30, H ± 45)
  const ana1 = hslToHex(h - 35, s, l);
  const ana2 = hslToHex(h + 35, s, l);
  const anaLight = hslToHex(h + 45, Math.min(100, s + 10), Math.min(85, l + 15));

  results.push(createGradient('ana-1', 'Analogous Harmony', 'Analogous', [ana1, baseHex, ana2]));
  results.push(createGradient('ana-2', 'Warm Analogous Melt', 'Analogous', [baseHex, anaLight], 90));

  // 3. Triadic (Equidistant colors: H + 120, H + 240)
  const tri1 = hslToHex(h + 120, s, l);
  const tri2 = hslToHex(h + 240, s, l);

  results.push(createGradient('tri-1', 'Triadic Spectrum', 'Triadic', [baseHex, tri1, tri2], 120));

  // 4. Split-Complementary (H + 150, H + 210)
  const split1 = hslToHex(h + 150, s, l);
  const split2 = hslToHex(h + 210, s, l);

  results.push(createGradient('split-1', 'Split Complement', 'Split-Complementary', [baseHex, split1, split2], 160));

  // 5. Monochromatic (Same hue, varying lightness & saturation)
  const monoLight = hslToHex(h, Math.max(30, s - 15), Math.min(92, l + 30));
  const monoDeep = hslToHex(h, Math.min(100, s + 10), Math.max(12, l - 35));

  results.push(createGradient('mono-1', 'Monochromatic Shading', 'Monochromatic', [monoLight, baseHex, monoDeep], 135));

  if (mode !== 'all') {
    return results.filter(g => g.harmonyType.toLowerCase().startsWith(mode.toLowerCase()));
  }

  return results;
}

/**
 * Generate a completely random vibrant gradient configuration
 */
export function getRandomGradient() {
  const randomHue = Math.floor(Math.random() * 360);
  const sat = 75 + Math.floor(Math.random() * 25);
  const light = 45 + Math.floor(Math.random() * 20);

  const baseHex = hslToHex(randomHue, sat, light);
  const complementaryGradients = generateHarmoniousGradients(baseHex);
  const randomPick = complementaryGradients[Math.floor(Math.random() * complementaryGradients.length)];

  return {
    ...randomPick,
    id: `random-${Date.now()}`,
    name: `Surprise ${randomPick.harmonyType}`
  };
}

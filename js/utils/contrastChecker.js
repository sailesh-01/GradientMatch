/**
 * WCAG 2.1 Accessibility & Contrast Ratio Calculator Utility
 */

import { hexToRgb } from './colorTheory.js';

// Calculate relative luminance of a color
export function getLuminance(hex) {
  const rgb = hexToRgb(hex);
  const transform = (c) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };

  const r = transform(rgb.r);
  const g = transform(rgb.g);
  const b = transform(rgb.b);

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Calculate contrast ratio between two colors
export function getContrastRatio(hex1, hex2) {
  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  const ratio = (brightest + 0.05) / (darkest + 0.05);
  return Math.round(ratio * 100) / 100;
}

// Average luminance of a gradient by blending its stops
export function getGradientAverageHex(stops) {
  if (!stops || stops.length === 0) return '#000000';
  let totalR = 0, totalG = 0, totalB = 0;

  stops.forEach(s => {
    const rgb = hexToRgb(s.color);
    totalR += rgb.r;
    totalG += rgb.g;
    totalB += rgb.b;
  });

  const avgR = Math.round(totalR / stops.length);
  const avgG = Math.round(totalG / stops.length);
  const avgB = Math.round(totalB / stops.length);

  const toHex = n => n.toString(16).padStart(2, '0');
  return `#${toHex(avgR)}${toHex(avgG)}${toHex(avgB)}`;
}

/**
 * Evaluate WCAG 2.1 compliance score for text over a gradient
 * @param {Array} stops - Array of color stops [{color: "#...", position: 0}, ...]
 * @param {string} textColor - Text color hex e.g. "#FFFFFF" or "#000000"
 */
export function evaluateGradientContrast(stops, textColor = '#FFFFFF') {
  // Check contrast against each color stop as well as the average blend
  const ratios = stops.map(s => getContrastRatio(s.color, textColor));
  const avgHex = getGradientAverageHex(stops);
  const avgRatio = getContrastRatio(avgHex, textColor);

  const minRatio = Math.min(...ratios);
  const maxRatio = Math.max(...ratios);

  // Evaluate WCAG criteria based on the lowest contrast stop (worst-case scenario)
  let status = 'Fail';
  let ratingLabel = 'Low Contrast';
  let passAA = false;
  let passAAA = false;

  if (minRatio >= 7.0) {
    status = 'AAA Pass';
    ratingLabel = 'Excellent Contrast';
    passAA = true;
    passAAA = true;
  } else if (minRatio >= 4.5) {
    status = 'AA Pass';
    ratingLabel = 'Good Contrast';
    passAA = true;
    passAAA = false;
  } else if (minRatio >= 3.0) {
    status = 'AA Large Pass';
    ratingLabel = 'Large Text Only';
    passAA = false;
    passAAA = false;
  } else {
    status = 'Fail';
    ratingLabel = 'Poor Contrast Warning';
    passAA = false;
    passAAA = false;
  }

  return {
    textColor,
    minRatio,
    maxRatio,
    avgRatio,
    status,
    ratingLabel,
    passAA,
    passAAA
  };
}

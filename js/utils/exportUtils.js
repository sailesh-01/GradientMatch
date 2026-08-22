/**
 * Code Export & Generator Utility (CSS, Tailwind, SVG, PNG, Shareable URL)
 */

/**
 * Format gradient stops as a standard CSS string snippet
 * @param {Object} gradient - Gradient object { type, angle, stops }
 */
export function generateCss(gradient) {
  if (!gradient || !gradient.stops) return '';

  const { type = 'linear', angle = 135, stops = [] } = gradient;
  const sortedStops = [...stops].sort((a, b) => a.position - b.position);
  const stopStr = sortedStops.map(s => `${s.color} ${s.position}%`).join(', ');

  if (type === 'radial') {
    return `background: radial-gradient(circle at center, ${stopStr});`;
  } else if (type === 'conic') {
    return `background: conic-gradient(from ${angle}deg at 50% 50%, ${stopStr});`;
  } else {
    return `background: linear-gradient(${angle}deg, ${stopStr});`;
  }
}

/**
 * Generate Tailwind CSS classes or arbitrary Tailwind gradient utility
 * @param {Object} gradient
 */
export function generateTailwind(gradient) {
  if (!gradient || !gradient.stops) return '';
  const { type = 'linear', angle = 135, stops = [] } = gradient;

  const sortedStops = [...stops].sort((a, b) => a.position - b.position);

  // Map angle to standard Tailwind direction keyword if standard linear
  let directionClass = 'bg-gradient-to-r';
  if (type === 'linear') {
    if (angle >= 337.5 || angle < 22.5) directionClass = 'bg-gradient-to-t';
    else if (angle >= 22.5 && angle < 67.5) directionClass = 'bg-gradient-to-tr';
    else if (angle >= 67.5 && angle < 112.5) directionClass = 'bg-gradient-to-r';
    else if (angle >= 112.5 && angle < 157.5) directionClass = 'bg-gradient-to-br';
    else if (angle >= 157.5 && angle < 202.5) directionClass = 'bg-gradient-to-b';
    else if (angle >= 202.5 && angle < 247.5) directionClass = 'bg-gradient-to-bl';
    else if (angle >= 247.5 && angle < 292.5) directionClass = 'bg-gradient-to-l';
    else if (angle >= 292.5 && angle < 337.5) directionClass = 'bg-gradient-to-tl';

    if (sortedStops.length === 2) {
      return `${directionClass} from-[${sortedStops[0].color}] to-[${sortedStops[1].color}]`;
    } else if (sortedStops.length === 3) {
      return `${directionClass} from-[${sortedStops[0].color}] via-[${sortedStops[1].color}] to-[${sortedStops[2].color}]`;
    }
  }

  // Arbitrary Tailwind class fallback for radial, conic, or multi-stop
  const cssValue = generateCss(gradient).replace('background: ', '').replace(';', '');
  const arbitrary = `bg-[${cssValue.replaceAll(' ', '_')}]`;
  return arbitrary;
}

/**
 * Format gradient as standalone SVG file markup
 * @param {Object} gradient
 */
export function generateSvg(gradient) {
  if (!gradient || !gradient.stops) return '';
  const { type = 'linear', angle = 135, stops = [] } = gradient;

  const sortedStops = [...stops].sort((a, b) => a.position - b.position);
  const stopNodes = sortedStops
    .map(s => `    <stop offset="${s.position}%" stop-color="${s.color}" />`)
    .join('\n');

  let gradDef = '';
  if (type === 'radial') {
    gradDef = `<radialGradient id="gradient" cx="50%" cy="50%" r="50%">\n${stopNodes}\n  </radialGradient>`;
  } else {
    // Convert angle in degrees to x1, y1, x2, y2 vector
    const rad = (angle - 90) * (Math.PI / 180);
    const x1 = Math.round(50 + 50 * Math.cos(rad - Math.PI));
    const y1 = Math.round(50 + 50 * Math.sin(rad - Math.PI));
    const x2 = Math.round(50 + 50 * Math.cos(rad));
    const y2 = Math.round(50 + 50 * Math.sin(rad));

    gradDef = `<linearGradient id="gradient" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">\n${stopNodes}\n  </linearGradient>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
  <defs>
    ${gradDef}
  </defs>
  <rect width="100%" height="100%" fill="url(#gradient)" />
</svg>`;
}

/**
 * Render gradient to Canvas and trigger PNG file download
 * @param {Object} gradient
 * @param {string} filename
 */
export function downloadPng(gradient, filename = 'gradientmatch.png') {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 630;
  const ctx = canvas.getContext('2d');

  const { type = 'linear', angle = 135, stops = [] } = gradient;
  const sortedStops = [...stops].sort((a, b) => a.position - b.position);

  let grad;
  if (type === 'radial') {
    grad = ctx.createRadialGradient(600, 315, 0, 600, 315, 600);
  } else {
    const rad = (angle - 90) * (Math.PI / 180);
    const x1 = 600 + 600 * Math.cos(rad - Math.PI);
    const y1 = 315 + 315 * Math.sin(rad - Math.PI);
    const x2 = 600 + 600 * Math.cos(rad);
    const y2 = 315 + 315 * Math.sin(rad);

    grad = ctx.createLinearGradient(x1, y1, x2, y2);
  }

  sortedStops.forEach(s => {
    grad.addColorStop(s.position / 100, s.color);
  });

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1200, 630);

  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

/**
 * Generate Shareable URL query string
 * @param {Object} gradient
 */
export function generateShareUrl(gradient) {
  const { type = 'linear', angle = 135, stops = [], name = 'Custom' } = gradient;
  const stopParam = stops.map(s => `${s.color.replace('#', '')}:${s.position}`).join(',');
  const params = new URLSearchParams();

  params.set('g_name', name);
  params.set('g_type', type);
  params.set('g_angle', angle);
  params.set('g_stops', stopParam);

  return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
}

/**
 * Parse URL Query Params on load if present
 */
export function parseUrlGradient() {
  const params = new URLSearchParams(window.location.search);
  if (!params.has('g_stops')) return null;

  try {
    const name = params.get('g_name') || 'Shared Gradient';
    const type = params.get('g_type') || 'linear';
    const angle = parseInt(params.get('g_angle') || '135', 10);
    const rawStops = params.get('g_stops') || '';

    const stops = rawStops.split(',').map(s => {
      const [hex, pos] = s.split(':');
      return {
        color: `#${hex}`,
        position: parseInt(pos, 10) || 0
      };
    });

    if (stops.length < 2) return null;

    return {
      id: `shared-${Date.now()}`,
      name,
      type,
      angle,
      stops,
      category: 'custom'
    };
  } catch (err) {
    console.warn('Failed to parse share URL gradient', err);
    return null;
  }
}

/**
 * Curated Gradient Presets Database
 * 50 High quality gradients categorized across multiple aesthetics.
 */

export const CATEGORIES = [
  { id: 'all', name: 'All Gradients', icon: 'Sparkles' },
  { id: 'warm', name: 'Warm', icon: 'Flame' },
  { id: 'cool', name: 'Cool', icon: 'Snowflake' },
  { id: 'pastel', name: 'Pastel', icon: 'Feather' },
  { id: 'neon', name: 'Neon', icon: 'Zap' },
  { id: 'monochrome', name: 'Monochrome', icon: 'Moon' },
  { id: 'sunset', name: 'Sunset', icon: 'Sun' },
  { id: 'ocean', name: 'Ocean', icon: 'Waves' },
  { id: 'nature', name: 'Nature', icon: 'Trees' },
  { id: 'mesh', name: 'Mesh & Vibrant', icon: 'Palette' }
];

export const GRADIENTS = [
  // WARM (6)
  {
    id: 'g-warm-1',
    name: 'Solar Flare',
    category: 'warm',
    type: 'linear',
    angle: 135,
    stops: [
      { color: '#FF416C', position: 0 },
      { color: '#FF4B2B', position: 100 }
    ],
    tags: ['red', 'orange', 'vibrant', 'fire'],
    popular: true
  },
  {
    id: 'g-warm-2',
    name: 'Peach Blossom',
    category: 'warm',
    type: 'linear',
    angle: 45,
    stops: [
      { color: '#ED4264', position: 0 },
      { color: '#FFEDBC', position: 100 }
    ],
    tags: ['pink', 'peach', 'soft', 'warm']
  },
  {
    id: 'g-warm-3',
    name: 'Mango Tango',
    category: 'warm',
    type: 'linear',
    angle: 90,
    stops: [
      { color: '#FFE000', position: 0 },
      { color: '#799F0C', position: 100 }
    ],
    tags: ['yellow', 'green', 'citrus']
  },
  {
    id: 'g-warm-4',
    name: 'Fiery Ember',
    category: 'warm',
    type: 'linear',
    angle: 160,
    stops: [
      { color: '#F12711', position: 0 },
      { color: '#F5AF19', position: 100 }
    ],
    tags: ['orange', 'red', 'bold', 'amber'],
    popular: true
  },
  {
    id: 'g-warm-5',
    name: 'Cherry Blossom',
    category: 'warm',
    type: 'linear',
    angle: 120,
    stops: [
      { color: '#F857A6', position: 0 },
      { color: '#FF5858', position: 100 }
    ],
    tags: ['pink', 'rose', 'blossom']
  },
  {
    id: 'g-warm-6',
    name: 'Autumn Flame',
    category: 'warm',
    type: 'linear',
    angle: 135,
    stops: [
      { color: '#DA4453', position: 0 },
      { color: '#89216B', position: 100 }
    ],
    tags: ['crimson', 'purple', 'autumn']
  },

  // COOL (6)
  {
    id: 'g-cool-1',
    name: 'Hyper Drive',
    category: 'cool',
    type: 'linear',
    angle: 135,
    stops: [
      { color: '#654EA3', position: 0 },
      { color: '#EAAFC8', position: 100 }
    ],
    tags: ['purple', 'pink', 'retro', 'synth']
  },
  {
    id: 'g-cool-2',
    name: 'Cosmic Indigo',
    category: 'cool',
    type: 'linear',
    angle: 180,
    stops: [
      { color: '#0B8793', position: 0 },
      { color: '#360033', position: 100 }
    ],
    tags: ['indigo', 'teal', 'dark', 'cosmic'],
    popular: true
  },
  {
    id: 'g-cool-3',
    name: 'Nordic Frost',
    category: 'cool',
    type: 'linear',
    angle: 90,
    stops: [
      { color: '#00D2FF', position: 0 },
      { color: '#3A7BD5', position: 100 }
    ],
    tags: ['cyan', 'blue', 'ice', 'clean']
  },
  {
    id: 'g-cool-4',
    name: 'Electric Violet',
    category: 'cool',
    type: 'linear',
    angle: 135,
    stops: [
      { color: '#4776E6', position: 0 },
      { color: '#8E54E9', position: 100 }
    ],
    tags: ['blue', 'violet', 'electric'],
    popular: true
  },
  {
    id: 'g-cool-5',
    name: 'Midnight Bloom',
    category: 'cool',
    type: 'linear',
    angle: 150,
    stops: [
      { color: '#2B5876', position: 0 },
      { color: '#4E4376', position: 100 }
    ],
    tags: ['slate', 'purple', 'night']
  },
  {
    id: 'g-cool-6',
    name: 'Ultra Violet',
    category: 'cool',
    type: 'linear',
    angle: 45,
    stops: [
      { color: '#654EA3', position: 0 },
      { color: '#5B86E5', position: 100 }
    ],
    tags: ['purple', 'blue', 'modern']
  },

  // PASTEL (6)
  {
    id: 'g-pastel-1',
    name: 'Cotton Candy',
    category: 'pastel',
    type: 'linear',
    angle: 135,
    stops: [
      { color: '#FBC2EB', position: 0 },
      { color: '#A6C1EE', position: 100 }
    ],
    tags: ['pink', 'soft blue', 'dreamy'],
    popular: true
  },
  {
    id: 'g-pastel-2',
    name: 'Matcha Foam',
    category: 'pastel',
    type: 'linear',
    angle: 90,
    stops: [
      { color: '#D4FC79', position: 0 },
      { color: '#96E6A1', position: 100 }
    ],
    tags: ['green', 'lime', 'fresh']
  },
  {
    id: 'g-pastel-3',
    name: 'Lavender Fog',
    category: 'pastel',
    type: 'linear',
    angle: 120,
    stops: [
      { color: '#E0C3FC', position: 0 },
      { color: '#8EC5FC', position: 100 }
    ],
    tags: ['lavender', 'blue', 'soft']
  },
  {
    id: 'g-pastel-4',
    name: 'Rose Water',
    category: 'pastel',
    type: 'linear',
    angle: 135,
    stops: [
      { color: '#FFD1FF', position: 0 },
      { color: '#FAD0C4', position: 100 }
    ],
    tags: ['pink', 'rose', 'light']
  },
  {
    id: 'g-pastel-5',
    name: 'Vanilla Sky',
    category: 'pastel',
    type: 'linear',
    angle: 45,
    stops: [
      { color: '#FFEED9', position: 0 },
      { color: '#FAD0C4', position: 100 }
    ],
    tags: ['peach', 'cream', 'gentle']
  },
  {
    id: 'g-pastel-6',
    name: 'Minty Sorbet',
    category: 'pastel',
    type: 'linear',
    angle: 160,
    stops: [
      { color: '#C2E9FB', position: 0 },
      { color: '#A1C4FD', position: 100 }
    ],
    tags: ['sky', 'mint', 'pastel']
  },

  // NEON (6)
  {
    id: 'g-neon-1',
    name: 'Cyberpunk 2077',
    category: 'neon',
    type: 'linear',
    angle: 90,
    stops: [
      { color: '#00F2FE', position: 0 },
      { color: '#4FACFE', position: 100 }
    ],
    tags: ['cyan', 'neon', 'futuristic'],
    popular: true
  },
  {
    id: 'g-neon-2',
    name: 'Toxic Lime',
    category: 'neon',
    type: 'linear',
    angle: 135,
    stops: [
      { color: '#11FF7C', position: 0 },
      { color: '#00E5FF', position: 100 }
    ],
    tags: ['lime', 'cyan', 'acid']
  },
  {
    id: 'g-neon-3',
    name: 'Laser Pulse',
    category: 'neon',
    type: 'linear',
    angle: 120,
    stops: [
      { color: '#FF007F', position: 0 },
      { color: '#7928CA', position: 100 }
    ],
    tags: ['magenta', 'violet', 'glowing'],
    popular: true
  },
  {
    id: 'g-neon-4',
    name: 'Neon Matrix',
    category: 'neon',
    type: 'linear',
    angle: 45,
    stops: [
      { color: '#020024', position: 0 },
      { color: '#097969', position: 50 },
      { color: '#00D4FF', position: 100 }
    ],
    tags: ['matrix', 'emerald', 'dark neon']
  },
  {
    id: 'g-neon-5',
    name: 'Synthwave Sunset',
    category: 'neon',
    type: 'linear',
    angle: 135,
    stops: [
      { color: '#FF0080', position: 0 },
      { color: '#FF8C00', position: 50 },
      { color: '#40E0D0', position: 100 }
    ],
    tags: ['synth', 'tri-color', 'neon']
  },
  {
    id: 'g-neon-6',
    name: 'Electric Acid',
    category: 'neon',
    type: 'linear',
    angle: 90,
    stops: [
      { color: '#F700FF', position: 0 },
      { color: '#00F0FF', position: 100 }
    ],
    tags: ['fuchsia', 'cyan', 'vibrant']
  },

  // MONOCHROME (6)
  {
    id: 'g-mono-1',
    name: 'Obsidian Glass',
    category: 'monochrome',
    type: 'linear',
    angle: 135,
    stops: [
      { color: '#141E30', position: 0 },
      { color: '#243B55', position: 100 }
    ],
    tags: ['dark', 'charcoal', 'sleek'],
    popular: true
  },
  {
    id: 'g-mono-2',
    name: 'Silver Lining',
    category: 'monochrome',
    type: 'linear',
    angle: 90,
    stops: [
      { color: '#E0E0E0', position: 0 },
      { color: '#F5F5F5', position: 100 }
    ],
    tags: ['light', 'silver', 'minimal']
  },
  {
    id: 'g-mono-3',
    name: 'Midnight Stealth',
    category: 'monochrome',
    type: 'linear',
    angle: 180,
    stops: [
      { color: '#000000', position: 0 },
      { color: '#434343', position: 100 }
    ],
    tags: ['black', 'dark grey', 'stealth'],
    popular: true
  },
  {
    id: 'g-mono-4',
    name: 'Concrete Mist',
    category: 'monochrome',
    type: 'linear',
    angle: 45,
    stops: [
      { color: '#8E9EAB', position: 0 },
      { color: '#EEF2F3', position: 100 }
    ],
    tags: ['slate', 'grey', 'metallic']
  },
  {
    id: 'g-mono-5',
    name: 'Graphite Shift',
    category: 'monochrome',
    type: 'linear',
    angle: 135,
    stops: [
      { color: '#2C3E50', position: 0 },
      { color: '#000000', position: 100 }
    ],
    tags: ['dark', 'steel', 'minimal']
  },
  {
    id: 'g-mono-6',
    name: 'Parchment Chalk',
    category: 'monochrome',
    type: 'linear',
    angle: 120,
    stops: [
      { color: '#D9D9D9', position: 0 },
      { color: '#313131', position: 100 }
    ],
    tags: ['contrast', 'monochrome', 'clean']
  },

  // SUNSET (5)
  {
    id: 'g-sunset-1',
    name: 'Dusk Horizon',
    category: 'sunset',
    type: 'linear',
    angle: 135,
    stops: [
      { color: '#2C3E50', position: 0 },
      { color: '#FD746C', position: 100 }
    ],
    tags: ['twilight', 'salmon', 'dark sky'],
    popular: true
  },
  {
    id: 'g-sunset-2',
    name: 'Golden Hour',
    category: 'sunset',
    type: 'linear',
    angle: 90,
    stops: [
      { color: '#FF7E5F', position: 0 },
      { color: '#FEB47B', position: 100 }
    ],
    tags: ['amber', 'warm sunset', 'golden']
  },
  {
    id: 'g-sunset-3',
    name: 'Venice Dusk',
    category: 'sunset',
    type: 'linear',
    angle: 160,
    stops: [
      { color: '#614385', position: 0 },
      { color: '#516395', position: 100 }
    ],
    tags: ['purple', 'indigo', 'sunset']
  },
  {
    id: 'g-sunset-4',
    name: 'Malibu Mirage',
    category: 'sunset',
    type: 'linear',
    angle: 120,
    stops: [
      { color: '#4568DC', position: 0 },
      { color: '#B06AB3', position: 100 }
    ],
    tags: ['blue', 'magenta', 'twilight'],
    popular: true
  },
  {
    id: 'g-sunset-5',
    name: 'Sahara Twilight',
    category: 'sunset',
    type: 'linear',
    angle: 45,
    stops: [
      { color: '#F80759', position: 0 },
      { color: '#BC70A4', position: 100 }
    ],
    tags: ['magenta', 'coral', 'desert']
  },

  // OCEAN (5)
  {
    id: 'g-ocean-1',
    name: 'Abyssal Trench',
    category: 'ocean',
    type: 'linear',
    angle: 180,
    stops: [
      { color: '#00223E', position: 0 },
      { color: '#1D976C', position: 100 }
    ],
    tags: ['deep ocean', 'teal', 'dark'],
    popular: true
  },
  {
    id: 'g-ocean-2',
    name: 'Coral Reef',
    category: 'ocean',
    type: 'linear',
    angle: 135,
    stops: [
      { color: '#4AC29A', position: 0 },
      { color: '#BDFFF3', position: 100 }
    ],
    tags: ['turquoise', 'mint', 'shallow sea']
  },
  {
    id: 'g-ocean-3',
    name: 'Pacific Tide',
    category: 'ocean',
    type: 'linear',
    angle: 90,
    stops: [
      { color: '#1FA2FF', position: 0 },
      { color: '#12D8FA', position: 50 },
      { color: '#A6FFCB', position: 100 }
    ],
    tags: ['cyan', 'aqua', 'caribbean'],
    popular: true
  },
  {
    id: 'g-ocean-4',
    name: 'Bermuda Blue',
    category: 'ocean',
    type: 'linear',
    angle: 135,
    stops: [
      { color: '#1E3C72', position: 0 },
      { color: '#2A5298', position: 100 }
    ],
    tags: ['royal blue', 'navy', 'deep']
  },
  {
    id: 'g-ocean-5',
    name: 'Teal Lagoon',
    category: 'ocean',
    type: 'linear',
    angle: 45,
    stops: [
      { color: '#005C97', position: 0 },
      { color: '#363795', position: 100 }
    ],
    tags: ['sapphire', 'indigo', 'marine']
  },

  // NATURE (5)
  {
    id: 'g-nature-1',
    name: 'Emerald Canopy',
    category: 'nature',
    type: 'linear',
    angle: 135,
    stops: [
      { color: '#0575E6', position: 0 },
      { color: '#00F260', position: 100 }
    ],
    tags: ['green', 'emerald', 'forest'],
    popular: true
  },
  {
    id: 'g-nature-2',
    name: 'Autumn Forest',
    category: 'nature',
    type: 'linear',
    angle: 120,
    stops: [
      { color: '#B92B27', position: 0 },
      { color: '#1565C0', position: 100 }
    ],
    tags: ['crimson', 'blue', 'earth']
  },
  {
    id: 'g-nature-3',
    name: 'Wild Moss',
    category: 'nature',
    type: 'linear',
    angle: 90,
    stops: [
      { color: '#11998E', position: 0 },
      { color: '#38EF7D', position: 100 }
    ],
    tags: ['green', 'spring', 'fresh'],
    popular: true
  },
  {
    id: 'g-nature-4',
    name: 'Blooming Iris',
    category: 'nature',
    type: 'linear',
    angle: 160,
    stops: [
      { color: '#833AB4', position: 0 },
      { color: '#FD1D1D', position: 50 },
      { color: '#FCB045', position: 100 }
    ],
    tags: ['floral', 'multi-tone', 'botanical']
  },
  {
    id: 'g-nature-5',
    name: 'Bamboo Grove',
    category: 'nature',
    type: 'linear',
    angle: 45,
    stops: [
      { color: '#ADD100', position: 0 },
      { color: '#7B920A', position: 100 }
    ],
    tags: ['olive', 'bamboo', 'zen']
  },

  // MESH & VIBRANT (5)
  {
    id: 'g-mesh-1',
    name: 'Aurora Borealis',
    category: 'mesh',
    type: 'linear',
    angle: 135,
    stops: [
      { color: '#7F00FF', position: 0 },
      { color: '#E100FF', position: 100 }
    ],
    tags: ['violet', 'magenta', 'glowing'],
    popular: true
  },
  {
    id: 'g-mesh-2',
    name: 'Prism Dream',
    category: 'mesh',
    type: 'linear',
    angle: 45,
    stops: [
      { color: '#FA8BFF', position: 0 },
      { color: '#2BD2FF', position: 52 },
      { color: '#2BFF88', position: 100 }
    ],
    tags: ['rainbow', 'holographic', 'vibrant'],
    popular: true
  },
  {
    id: 'g-mesh-3',
    name: 'Cosmic Nebula',
    category: 'mesh',
    type: 'radial',
    angle: 0,
    stops: [
      { color: '#FF00A0', position: 0 },
      { color: '#4900FF', position: 60 },
      { color: '#0B001A', position: 100 }
    ],
    tags: ['radial', 'galaxy', 'neon']
  },
  {
    id: 'g-mesh-4',
    name: 'Solar Conic',
    category: 'mesh',
    type: 'conic',
    angle: 180,
    stops: [
      { color: '#FF0055', position: 0 },
      { color: '#FFAA00', position: 33 },
      { color: '#00E5FF', position: 66 },
      { color: '#FF0055', position: 100 }
    ],
    tags: ['conic', 'experimental', 'spectrum']
  },
  {
    id: 'g-mesh-5',
    name: 'Vapor Wave',
    category: 'mesh',
    type: 'linear',
    angle: 135,
    stops: [
      { color: '#FF71CE', position: 0 },
      { color: '#01CDFE', position: 33 },
      { color: '#05FFA1', position: 66 },
      { color: '#B967FF', position: 100 }
    ],
    tags: ['vaporwave', 'retro', 'quad-color'],
    popular: true
  }
];

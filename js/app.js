/**
 * GradientMatch - Main Web Application Logic & State Controller
 */

import { GRADIENTS, CATEGORIES } from './data/gradients.js';
import { generateHarmoniousGradients, getRandomGradient, hexToHsl } from './utils/colorTheory.js';
import { evaluateGradientContrast } from './utils/contrastChecker.js';
import {
  generateCss,
  generateTailwind,
  generateSvg,
  downloadPng,
  generateShareUrl,
  parseUrlGradient
} from './utils/exportUtils.js';

class GradientMatchApp {
  constructor() {
    // 1. Initial State
    this.gradients = [...GRADIENTS];
    this.favorites = this.loadFavorites();
    this.activeCategory = 'all';
    this.activeTab = 'gallery'; // 'gallery' | 'matcher' | 'builder' | 'favorites'
    this.searchQuery = '';
    this.sortBy = 'default';
    this.theme = localStorage.getItem('gm_theme') || 'dark';

    // Inspector Modal State
    this.selectedGradient = null;
    this.modalExportTab = 'css'; // 'css' | 'tailwind' | 'svg'

    // Matcher State
    this.matcherBaseColor = '#38BDF8';
    this.matcherHarmony = 'all';

    // Builder State
    this.builderGradient = {
      id: 'custom-builder-live',
      name: 'My Custom Gradient',
      type: 'linear',
      angle: 135,
      stops: [
        { color: '#F43F5E', position: 0 },
        { color: '#38BDF8', position: 100 }
      ]
    };

    // Full-Screen Immersive Experience State
    this.isFullscreen = false;
    this.fullscreenGradient = null;
    this.fullscreenList = [];
    this.fullscreenIndex = 0;
    this.isAmbientAnimated = false;
    this.showMockUi = false;
    this.clockInterval = null;

    // 2. Initialize App
    this.initTheme();
    this.initUrlState();
    this.bindEvents();
    this.render();
  }

  // --- Theme Controller ---
  initTheme() {
    const htmlEl = document.documentElement;
    if (this.theme === 'light') {
      htmlEl.classList.add('light');
      htmlEl.classList.remove('dark');
    } else {
      htmlEl.classList.add('dark');
      htmlEl.classList.remove('light');
    }
  }

  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('gm_theme', this.theme);
    this.initTheme();
    this.showToast(`Switched to ${this.theme} mode`);
  }

  // --- LocalStorage Favorites ---
  loadFavorites() {
    try {
      const saved = localStorage.getItem('gm_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  saveFavorites() {
    localStorage.setItem('gm_favorites', JSON.stringify(this.favorites));
  }

  toggleFavorite(id, e) {
    if (e) e.stopPropagation();
    const idx = this.favorites.indexOf(id);
    if (idx >= 0) {
      this.favorites.splice(idx, 1);
      this.showToast('Removed from favorites');
    } else {
      this.favorites.push(id);
      this.showToast('Saved to favorites! ❤️');
    }
    this.saveFavorites();
    this.render();
  }

  // --- Shared URL Init ---
  initUrlState() {
    const shared = parseUrlGradient();
    if (shared) {
      this.gradients.unshift(shared);
      this.selectedGradient = shared;
      this.openModal(shared);
      this.showToast('Loaded gradient from share link! 🚀');
    }
  }

  // --- Toast Notification ---
  showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      <span>${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  // --- Clipboard & Downloads ---
  async copyToClipboard(text, label = 'Copied to clipboard!') {
    try {
      await navigator.clipboard.writeText(text);
      this.showToast(label);
    } catch (err) {
      this.showToast('Failed to copy');
    }
  }

  // --- Event Listeners Binding ---
  bindEvents() {
    // Theme toggle
    document.getElementById('theme-toggle')?.addEventListener('click', () => this.toggleTheme());

    // Navigation tabs
    document.querySelectorAll('[data-tab]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.currentTarget.getAttribute('data-tab');
        this.activeTab = tab;
        this.render();
      });
    });

    // Random Surprise Me Button
    document.getElementById('btn-surprise')?.addEventListener('click', () => {
      const randomGrad = getRandomGradient();
      this.selectedGradient = randomGrad;
      this.openModal(randomGrad);
      this.showToast(`✨ Surprise: ${randomGrad.name}`);
    });

    // Search input
    const searchInput = document.getElementById('search-input');
    searchInput?.addEventListener('input', (e) => {
      this.searchQuery = e.target.value.toLowerCase().trim();
      this.renderGalleryGrid();
    });

    // Sort Select
    const sortSelect = document.getElementById('sort-select');
    sortSelect?.addEventListener('change', (e) => {
      this.sortBy = e.target.value;
      this.renderGalleryGrid();
    });

    // Matcher Input Listeners
    const baseColorInput = document.getElementById('matcher-color-picker');
    const baseHexInput = document.getElementById('matcher-hex-input');

    baseColorInput?.addEventListener('input', (e) => {
      this.setMatcherColor(e.target.value);
    });

    baseHexInput?.addEventListener('input', (e) => {
      let val = e.target.value.trim();
      if (!val.startsWith('#')) val = '#' + val;
      if (/^#([0-9A-F]{3}|[0-9A-F]{6})$/i.test(val)) {
        this.setMatcherColor(val);
      }
    });

    baseHexInput?.addEventListener('change', (e) => {
      let val = e.target.value.trim();
      if (!val.startsWith('#')) val = '#' + val;
      if (/^#([0-9A-F]{3}|[0-9A-F]{6})$/i.test(val)) {
        this.setMatcherColor(val);
      }
    });

    // Matcher Harmony Filter Buttons
    document.querySelectorAll('[data-harmony]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.matcherHarmony = e.currentTarget.getAttribute('data-harmony');
        document.querySelectorAll('[data-harmony]').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.renderMatcherResults();
      });
    });

    // Builder Controls
    this.bindBuilderEvents();

    // Modal Close
    document.getElementById('modal-close')?.addEventListener('click', () => this.closeModal());
    document.getElementById('modal-overlay')?.addEventListener('click', (e) => {
      if (e.target.id === 'modal-overlay') this.closeModal();
    });

    // Modal Fullscreen & Animate Triggers
    document.getElementById('modal-preview-fullscreen')?.addEventListener('click', () => {
      if (this.selectedGradient) this.openFullscreen(this.selectedGradient);
    });
    document.getElementById('modal-btn-fullscreen')?.addEventListener('click', () => {
      if (this.selectedGradient) this.openFullscreen(this.selectedGradient);
    });
    document.getElementById('modal-preview-animate')?.addEventListener('click', () => {
      this.toggleModalAnimation();
    });

    // Builder Fullscreen & Animate Triggers
    document.getElementById('builder-fullscreen-btn')?.addEventListener('click', () => {
      this.openFullscreen(this.builderGradient, [this.builderGradient]);
    });
    document.getElementById('builder-animate-btn')?.addEventListener('click', () => {
      this.toggleBuilderAnimation();
    });

    // Fullscreen Overlay Event Listeners
    this.bindFullscreenEvents();
  }

  // --- Custom Builder Controls ---
  bindBuilderEvents() {
    // Gradient Type (linear, radial, conic)
    document.querySelectorAll('[data-builder-type]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.builderGradient.type = e.currentTarget.getAttribute('data-builder-type');
        document.querySelectorAll('[data-builder-type]').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.updateBuilderPreview();
      });
    });

    // Angle Slider
    const angleSlider = document.getElementById('builder-angle-slider');
    const angleValueDisplay = document.getElementById('builder-angle-value');
    angleSlider?.addEventListener('input', (e) => {
      this.builderGradient.angle = parseInt(e.target.value, 10);
      if (angleValueDisplay) angleValueDisplay.textContent = `${this.builderGradient.angle}°`;
      this.updateBuilderPreview();
    });

    // Add Color Stop Button
    document.getElementById('builder-add-stop')?.addEventListener('click', () => {
      if (this.builderGradient.stops.length >= 5) {
        this.showToast('Maximum 5 stops allowed');
        return;
      }
      const randomColor = `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`;
      this.builderGradient.stops.push({
        color: randomColor.toUpperCase(),
        position: 50
      });
      this.renderBuilderStops();
      this.updateBuilderPreview();
    });

    // Randomize Builder Colors
    document.getElementById('builder-randomize')?.addEventListener('click', () => {
      this.builderGradient.stops.forEach(s => {
        s.color = `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`.toUpperCase();
      });
      this.renderBuilderStops();
      this.updateBuilderPreview();
    });

    // Save Custom Gradient to Preset List & Favorites
    document.getElementById('builder-save-btn')?.addEventListener('click', () => {
      const newCustom = {
        ...JSON.parse(JSON.stringify(this.builderGradient)),
        id: `custom-${Date.now()}`,
        name: `Custom ${this.builderGradient.stops.length}-Color`,
        category: 'custom'
      };
      this.gradients.unshift(newCustom);
      this.favorites.push(newCustom.id);
      this.saveFavorites();
      this.showToast('Custom gradient saved to Favorites! ❤️');
      this.activeTab = 'favorites';
      this.render();
    });
  }

  // Render Stop Inputs in Custom Builder
  renderBuilderStops() {
    const container = document.getElementById('builder-stops-list');
    if (!container) return;

    container.innerHTML = '';
    this.builderGradient.stops.forEach((stop, index) => {
      const stopRow = document.createElement('div');
      stopRow.className = 'glass-card p-3 flex items-center justify-between gap-3';
      stopRow.innerHTML = `
        <div class="flex items-center gap-3">
          <input type="color" value="${stop.color}" data-stop-idx="${index}" class="color-picker-input w-9 h-9 rounded cursor-pointer bg-transparent border-0">
          <span class="font-mono text-sm uppercase">${stop.color}</span>
        </div>
        <div class="flex items-center gap-3 flex-1 max-w-xs">
          <span class="text-xs text-muted">Position:</span>
          <input type="range" min="0" max="100" value="${stop.position}" data-pos-idx="${index}" class="flex-1">
          <span class="font-mono text-xs w-8 text-right">${stop.position}%</span>
        </div>
        ${this.builderGradient.stops.length > 2 ? `
          <button data-remove-stop="${index}" class="btn-icon text-red-400 hover:text-red-300" title="Remove stop">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        ` : ''}
      `;
      container.appendChild(stopRow);
    });

    // Attach listeners for color pickers & position sliders
    container.querySelectorAll('[data-stop-idx]').forEach(input => {
      input.addEventListener('input', (e) => {
        const idx = parseInt(e.target.getAttribute('data-stop-idx'), 10);
        this.builderGradient.stops[idx].color = e.target.value.toUpperCase();
        this.updateBuilderPreview();
        this.renderBuilderStops();
      });
    });

    container.querySelectorAll('[data-pos-idx]').forEach(input => {
      input.addEventListener('input', (e) => {
        const idx = parseInt(e.target.getAttribute('data-pos-idx'), 10);
        this.builderGradient.stops[idx].position = parseInt(e.target.value, 10);
        this.updateBuilderPreview();
        // Update label
        e.target.nextElementSibling.textContent = `${e.target.value}%`;
      });
    });

    container.querySelectorAll('[data-remove-stop]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.getAttribute('data-remove-stop'), 10);
        this.builderGradient.stops.splice(idx, 1);
        this.renderBuilderStops();
        this.updateBuilderPreview();
      });
    });
  }

  updateBuilderPreview() {
    const previewEl = document.getElementById('builder-live-preview');
    const cssCodeBox = document.getElementById('builder-css-output');
    const twCodeBox = document.getElementById('builder-tw-output');

    if (previewEl) {
      previewEl.style.cssText = generateCss(this.builderGradient);
    }

    const cssString = generateCss(this.builderGradient);
    const twString = generateTailwind(this.builderGradient);

    if (cssCodeBox) cssCodeBox.textContent = cssString;
    if (twCodeBox) twCodeBox.textContent = twString;

    // WCAG Contrast evaluate in builder
    const contrastReport = evaluateGradientContrast(this.builderGradient.stops, '#FFFFFF');
    const badgeEl = document.getElementById('builder-contrast-badge');
    if (badgeEl) {
      badgeEl.className = `px-3 py-1 text-xs font-semibold rounded-full ${contrastReport.passAA ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'}`;
      badgeEl.textContent = `${contrastReport.status} (${contrastReport.minRatio}:1)`;
    }
  }

  // --- Modal Inspector ---
  openModal(gradient) {
    if (!gradient) return;
    this.selectedGradient = gradient;
    const modalEl = document.getElementById('modal-overlay');
    if (!modalEl) return;

    // Render Modal Content
    document.getElementById('modal-title').textContent = gradient.name || 'Gradient';
    document.getElementById('modal-category-tag').textContent = (gradient.category || gradient.harmonyType || 'MATCHED').toUpperCase();
    
    const previewEl = document.getElementById('modal-preview-swatch');
    if (previewEl) {
      previewEl.style.cssText = generateCss(gradient);
      previewEl.classList.remove('preview-animated');
    }

    const modalAnimBtn = document.getElementById('modal-preview-animate');
    if (modalAnimBtn) modalAnimBtn.classList.remove('active');

    // Render Color Hex Badges
    const hexContainer = document.getElementById('modal-hex-badges');
    if (hexContainer) {
      hexContainer.innerHTML = gradient.stops.map(s => `
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-white/10 border border-white/10 text-white cursor-pointer hover:bg-white/20" onclick="app.copyToClipboard('${s.color}', 'Copied ${s.color}')">
          <span class="w-2.5 h-2.5 rounded-full" style="background: ${s.color}"></span>
          ${s.color} (${s.position}%)
        </span>
      `).join('');
    }

    // Render WCAG Accessibility Report
    const whiteContrast = evaluateGradientContrast(gradient.stops, '#FFFFFF');
    const blackContrast = evaluateGradientContrast(gradient.stops, '#000000');

    const contrastEl = document.getElementById('modal-contrast-report');
    if (contrastEl) {
      contrastEl.innerHTML = `
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="p-3 glass-card flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-6 h-6 rounded flex items-center justify-center font-bold text-xs bg-white text-black">A</span>
              <span class="text-xs text-muted">White Text</span>
            </div>
            <span class="text-xs font-semibold px-2.5 py-1 rounded-full ${whiteContrast.passAA ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}">
              ${whiteContrast.status} (${whiteContrast.minRatio}:1)
            </span>
          </div>
          <div class="p-3 glass-card flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-6 h-6 rounded flex items-center justify-center font-bold text-xs bg-black text-white">A</span>
              <span class="text-xs text-muted">Black Text</span>
            </div>
            <span class="text-xs font-semibold px-2.5 py-1 rounded-full ${blackContrast.passAA ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}">
              ${blackContrast.status} (${blackContrast.minRatio}:1)
            </span>
          </div>
        </div>
      `;
    }

    // Code Snippets Box
    this.renderModalCodeTab();

    // Export Buttons
    const btnCss = document.getElementById('modal-copy-css');
    if (btnCss) btnCss.onclick = () => this.copyToClipboard(generateCss(gradient), 'CSS copied to clipboard!');

    const btnTw = document.getElementById('modal-copy-tw');
    if (btnTw) btnTw.onclick = () => this.copyToClipboard(generateTailwind(gradient), 'Tailwind class copied!');

    const btnSvg = document.getElementById('modal-download-svg');
    if (btnSvg) btnSvg.onclick = () => this.copyToClipboard(generateSvg(gradient), 'SVG code copied!');

    const btnPng = document.getElementById('modal-download-png');
    if (btnPng) btnPng.onclick = () => downloadPng(gradient, `${gradient.name.toLowerCase().replace(/\s+/g, '-')}.png`);

    const btnShare = document.getElementById('modal-share-url');
    if (btnShare) btnShare.onclick = () => this.copyToClipboard(generateShareUrl(gradient), 'Share link copied to clipboard!');

    modalEl.classList.add('open');
  }

  renderModalCodeTab() {
    const codeBox = document.getElementById('modal-code-display');
    if (!codeBox || !this.selectedGradient) return;

    if (this.modalExportTab === 'css') {
      codeBox.textContent = generateCss(this.selectedGradient);
    } else if (this.modalExportTab === 'tailwind') {
      codeBox.textContent = generateTailwind(this.selectedGradient);
    } else if (this.modalExportTab === 'svg') {
      codeBox.textContent = generateSvg(this.selectedGradient);
    }
  }

  closeModal() {
    document.getElementById('modal-overlay')?.classList.remove('open');
  }

  // --- Main Render Engine ---
  render() {
    // Toggle Active Tab Content Views
    document.querySelectorAll('[data-view]').forEach(view => {
      const vName = view.getAttribute('data-view');
      if (vName === this.activeTab) {
        view.classList.remove('hidden');
      } else {
        view.classList.add('hidden');
      }
    });

    // Update Nav Tab Buttons state
    document.querySelectorAll('[data-tab]').forEach(btn => {
      const t = btn.getAttribute('data-tab');
      if (t === this.activeTab) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Render View Specific Sub-components
    if (this.activeTab === 'gallery') {
      this.renderCategoryPills();
      this.renderGalleryGrid();
    } else if (this.activeTab === 'matcher') {
      this.renderMatcherResults();
    } else if (this.activeTab === 'builder') {
      this.renderBuilderStops();
      this.updateBuilderPreview();
    } else if (this.activeTab === 'favorites') {
      this.renderFavoritesGrid();
    }
  }

  // Category Pills
  renderCategoryPills() {
    const container = document.getElementById('category-pills');
    if (!container) return;

    container.innerHTML = CATEGORIES.map(cat => `
      <button class="pill-btn ${this.activeCategory === cat.id ? 'active' : ''}" onclick="app.setCategory('${cat.id}')">
        <span>${cat.name}</span>
      </button>
    `).join('');
  }

  setCategory(catId) {
    this.activeCategory = catId;
    this.renderCategoryPills();
    this.renderGalleryGrid();
  }

  // Render Presets Gallery Grid
  renderGalleryGrid() {
    const grid = document.getElementById('gallery-grid');
    if (!grid) return;

    let filtered = this.gradients.filter(g => {
      const matchCat = this.activeCategory === 'all' || g.category === this.activeCategory;
      const matchQuery = !this.searchQuery ||
        g.name.toLowerCase().includes(this.searchQuery) ||
        g.stops.some(s => s.color.toLowerCase().includes(this.searchQuery)) ||
        (g.tags && g.tags.some(t => t.toLowerCase().includes(this.searchQuery)));
      return matchCat && matchQuery;
    });

    if (this.sortBy === 'popular') {
      filtered.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
    } else if (this.sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full p-12 text-center glass-card">
          <p class="text-lg text-muted mb-2">No gradients found matching your filter</p>
          <button class="btn-secondary" onclick="app.setCategory('all'); app.searchQuery=''; document.getElementById('search-input').value='';">Reset Filters</button>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(g => this.createCardHtml(g)).join('');
  }

  // Render Favorites View
  renderFavoritesGrid() {
    const grid = document.getElementById('favorites-grid');
    const emptyState = document.getElementById('favorites-empty');
    if (!grid) return;

    const favGradients = this.gradients.filter(g => this.favorites.includes(g.id));

    if (favGradients.length === 0) {
      if (emptyState) emptyState.classList.remove('hidden');
      grid.innerHTML = '';
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');
    grid.innerHTML = favGradients.map(g => this.createCardHtml(g)).join('');
  }

  // Render Matcher Results
  renderMatcherResults() {
    const resultsGrid = document.getElementById('matcher-results-grid');
    if (!resultsGrid) return;

    this.currentMatchedGradients = generateHarmoniousGradients(this.matcherBaseColor, this.matcherHarmony);
    resultsGrid.innerHTML = this.currentMatchedGradients.map(g => this.createCardHtml(g, true)).join('');
  }

  // Open modal by gradient ID
  openModalById(id) {
    let g = this.findGradientById(id);
    if (g) this.openModal(g);
  }

  // Open fullscreen by gradient ID
  openFullscreenById(id) {
    let g = this.findGradientById(id);
    if (g) {
      let list = this.gradients;
      if (this.activeTab === 'favorites') {
        list = this.gradients.filter(x => this.favorites.includes(x.id));
      } else if (this.activeTab === 'matcher' && this.currentMatchedGradients) {
        list = this.currentMatchedGradients;
      }
      this.openFullscreen(g, list);
    }
  }

  findGradientById(id) {
    let g = this.gradients.find(x => x.id === id);
    if (!g && this.currentMatchedGradients) {
      g = this.currentMatchedGradients.find(x => x.id === id);
    }
    if (!g && this.builderGradient && this.builderGradient.id === id) {
      g = this.builderGradient;
    }
    return g;
  }

  // --- Full-Screen Experience Controller ---
  bindFullscreenEvents() {
    // Close / Exit
    document.getElementById('fullscreen-btn-close')?.addEventListener('click', () => this.closeFullscreen());
    
    // Prev / Next Navigation
    document.getElementById('fullscreen-btn-prev')?.addEventListener('click', () => this.prevFullscreenGradient());
    document.getElementById('fullscreen-btn-next')?.addEventListener('click', () => this.nextFullscreenGradient());

    // Ambient Animation Toggle
    document.getElementById('fullscreen-btn-animate')?.addEventListener('click', () => this.toggleFullscreenAnimation());

    // Mock UI Overlay Toggle
    document.getElementById('fullscreen-btn-mockui')?.addEventListener('click', () => this.toggleMockUi());

    // Native Fullscreen Toggle
    document.getElementById('fullscreen-btn-native')?.addEventListener('click', () => this.toggleNativeFullscreen());

    // Export Quick Actions in Fullscreen
    document.getElementById('fullscreen-btn-copy-css')?.addEventListener('click', () => {
      if (this.fullscreenGradient) {
        this.copyToClipboard(generateCss(this.fullscreenGradient), 'CSS copied to clipboard!');
      }
    });

    document.getElementById('fullscreen-btn-download-png')?.addEventListener('click', () => {
      if (this.fullscreenGradient) {
        const fname = `${(this.fullscreenGradient.name || 'gradient').toLowerCase().replace(/\s+/g, '-')}-fullscreen.png`;
        downloadPng(this.fullscreenGradient, fname);
      }
    });

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      // If typing inside an input/textarea, ignore shortcuts
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;

      if (this.isFullscreen) {
        if (e.key === 'Escape') {
          this.closeFullscreen();
        } else if (e.key === 'ArrowRight') {
          this.nextFullscreenGradient();
        } else if (e.key === 'ArrowLeft') {
          this.prevFullscreenGradient();
        } else if (e.code === 'Space') {
          e.preventDefault();
          this.toggleFullscreenAnimation();
        } else if (e.key === 'u' || e.key === 'U') {
          this.toggleMockUi();
        } else if (e.key === 'f' || e.key === 'F') {
          this.toggleNativeFullscreen();
        }
      } else {
        // If Modal is open and user presses F, open Fullscreen
        const modalEl = document.getElementById('modal-overlay');
        if (modalEl?.classList.contains('open') && (e.key === 'f' || e.key === 'F')) {
          if (this.selectedGradient) this.openFullscreen(this.selectedGradient);
        }
      }
    });
  }

  openFullscreen(gradient, sourceList = null) {
    this.fullscreenGradient = gradient;
    this.fullscreenList = (sourceList && sourceList.length > 0) ? sourceList : this.gradients;
    this.fullscreenIndex = this.fullscreenList.findIndex(g => g.id === gradient.id);
    if (this.fullscreenIndex < 0) this.fullscreenIndex = 0;

    const overlay = document.getElementById('fullscreen-overlay');
    if (!overlay) return;

    this.updateFullscreenContent(gradient);
    overlay.classList.add('open');
    this.isFullscreen = true;

    if (this.showMockUi) {
      this.startClock();
    }
  }

  updateFullscreenContent(gradient) {
    this.fullscreenGradient = gradient;
    const canvas = document.getElementById('fullscreen-canvas');
    if (canvas) {
      canvas.style.cssText = generateCss(gradient);
    }

    const titleEl = document.getElementById('fullscreen-title');
    if (titleEl) titleEl.textContent = gradient.name;

    const tagEl = document.getElementById('fullscreen-category-tag');
    if (tagEl) tagEl.textContent = (gradient.category || 'CUSTOM').toUpperCase();

    const counterEl = document.getElementById('fullscreen-counter');
    if (counterEl) {
      counterEl.textContent = `${this.fullscreenIndex + 1} / ${this.fullscreenList.length}`;
    }

    // Render Hex Badges in Bottom HUD
    const hexContainer = document.getElementById('fullscreen-hex-badges');
    if (hexContainer && gradient.stops) {
      hexContainer.innerHTML = gradient.stops.map(s => `
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-black/50 border border-white/20 text-white cursor-pointer hover:bg-white/20 flex-shrink-0 transition" onclick="app.copyToClipboard('${s.color}', 'Copied ${s.color}')" title="Click to copy">
          <span class="w-2.5 h-2.5 rounded-full border border-white/30" style="background: ${s.color}"></span>
          ${s.color}
        </span>
      `).join('');
    }
  }

  closeFullscreen() {
    const overlay = document.getElementById('fullscreen-overlay');
    if (overlay) overlay.classList.remove('open');
    this.isFullscreen = false;
    this.stopClock();

    // Exit native fullscreen if active
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  }

  nextFullscreenGradient() {
    if (!this.fullscreenList || this.fullscreenList.length === 0) return;
    this.fullscreenIndex = (this.fullscreenIndex + 1) % this.fullscreenList.length;
    this.updateFullscreenContent(this.fullscreenList[this.fullscreenIndex]);
  }

  prevFullscreenGradient() {
    if (!this.fullscreenList || this.fullscreenList.length === 0) return;
    this.fullscreenIndex = (this.fullscreenIndex - 1 + this.fullscreenList.length) % this.fullscreenList.length;
    this.updateFullscreenContent(this.fullscreenList[this.fullscreenIndex]);
  }

  toggleFullscreenAnimation() {
    this.isAmbientAnimated = !this.isAmbientAnimated;
    const canvas = document.getElementById('fullscreen-canvas');
    const animBtn = document.getElementById('fullscreen-btn-animate');
    
    if (canvas) {
      canvas.classList.toggle('ambient-animated', this.isAmbientAnimated);
    }
    if (animBtn) {
      animBtn.classList.toggle('active', this.isAmbientAnimated);
    }

    this.showToast(this.isAmbientAnimated ? '✨ Ambient live motion enabled' : 'Ambient motion paused');
  }

  toggleMockUi() {
    this.showMockUi = !this.showMockUi;
    const mockEl = document.getElementById('fullscreen-mock-ui');
    const mockBtn = document.getElementById('fullscreen-btn-mockui');

    if (mockEl) {
      mockEl.classList.toggle('hidden', !this.showMockUi);
    }
    if (mockBtn) {
      mockBtn.classList.toggle('active', this.showMockUi);
    }

    if (this.showMockUi) {
      this.startClock();
    } else {
      this.stopClock();
    }
  }

  startClock() {
    this.stopClock();
    const updateTime = () => {
      const clockEl = document.getElementById('fullscreen-clock');
      if (clockEl) {
        const now = new Date();
        clockEl.textContent = now.toLocaleTimeString();
      }
    };
    updateTime();
    this.clockInterval = setInterval(updateTime, 1000);
  }

  stopClock() {
    if (this.clockInterval) {
      clearInterval(this.clockInterval);
      this.clockInterval = null;
    }
  }

  toggleNativeFullscreen() {
    const nativeBtn = document.getElementById('fullscreen-btn-native');
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        nativeBtn?.classList.add('active');
      }).catch(() => {
        this.showToast('Native fullscreen not supported');
      });
    } else {
      document.exitFullscreen().then(() => {
        nativeBtn?.classList.remove('active');
      }).catch(() => {});
    }
  }

  // Helper to set base color for matcher
  setMatcherColor(hex) {
    let val = hex.trim();
    if (!val.startsWith('#')) val = '#' + val;
    if (/^#([0-9A-F]{3}|[0-9A-F]{6})$/i.test(val)) {
      if (val.length === 4) {
        val = '#' + val[1] + val[1] + val[2] + val[2] + val[3] + val[3];
      }
      this.matcherBaseColor = val.toUpperCase();
      const baseColorInput = document.getElementById('matcher-color-picker');
      const baseHexInput = document.getElementById('matcher-hex-input');
      if (baseColorInput) baseColorInput.value = this.matcherBaseColor;
      if (baseHexInput) baseHexInput.value = this.matcherBaseColor;
      this.renderMatcherResults();
    }
  }

  // Handle color dot clicks on cards
  handleColorClick(color) {
    if (this.activeTab === 'matcher') {
      this.setMatcherColor(color);
      this.showToast(`Selected ${color} as base color! 🎨`);
    } else {
      this.copyToClipboard(color, `Copied ${color}`);
    }
  }

  // Toggle Live Animation in Builder
  toggleBuilderAnimation() {
    const previewEl = document.getElementById('builder-live-preview');
    const btn = document.getElementById('builder-animate-btn');
    if (!previewEl) return;

    const isAnim = previewEl.classList.toggle('preview-animated');
    if (btn) {
      btn.classList.toggle('active', isAnim);
      btn.classList.toggle('text-sky-400', isAnim);
      btn.classList.toggle('text-muted', !isAnim);
    }
    this.showToast(isAnim ? '✨ Builder preview animation active' : 'Builder animation paused');
  }

  // Toggle Live Animation in Modal
  toggleModalAnimation() {
    const previewEl = document.getElementById('modal-preview-swatch');
    const btn = document.getElementById('modal-preview-animate');
    if (!previewEl) return;

    const isAnim = previewEl.classList.toggle('preview-animated');
    if (btn) {
      btn.classList.toggle('active', isAnim);
      btn.classList.toggle('bg-sky-500/40', isAnim);
    }
    this.showToast(isAnim ? '✨ Modal preview animation active' : 'Modal animation paused');
  }

  // Template helper for Gradient Card HTML
  createCardHtml(g, isMatched = false) {
    const isFav = this.favorites.includes(g.id);
    const cssStyle = generateCss(g);

    return `
      <div class="swatch-card glass-card" onclick="app.openModalById('${g.id}')">
        <div class="swatch-preview-full relative" style="${cssStyle}">
          <button class="card-quick-fullscreen absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/60 hover:bg-black/85 text-white backdrop-blur-md border border-white/20 flex items-center justify-center shadow-md transition" onclick="event.stopPropagation(); app.openFullscreenById('${g.id}')" title="Experience Full Screen">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
          </button>
        </div>
        <div class="swatch-content">
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-base text-main truncate pr-2">${g.name}</h3>
            <button class="btn-icon ${isFav ? 'active' : ''}" onclick="app.toggleFavorite('${g.id}', event)" title="${isFav ? 'Remove Favorite' : 'Save Favorite'}">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </button>
          </div>
          <div class="flex items-center justify-between mt-2 text-xs text-muted">
            <div class="flex items-center gap-1.5 overflow-hidden">
              ${g.stops.map(s => `<span class="w-3.5 h-3.5 rounded-full border border-white/20 flex-shrink-0 cursor-pointer hover:scale-125 transition-transform" style="background:${s.color}" onclick="event.stopPropagation(); app.handleColorClick('${s.color}')" title="Use ${s.color}"></span>`).join('')}
              <span class="font-mono text-xs text-subtle truncate">${g.stops.map(s => s.color).join(' → ')}</span>
            </div>
            <button class="btn-secondary text-xs px-2.5 py-1 flex-shrink-0 ml-2" onclick="event.stopPropagation(); app.copyToClipboard('${generateCss(g)}', 'CSS Copied!')">
              Copy CSS
            </button>
          </div>
        </div>
      </div>
    `;
  }
}

// Instantiate App globally
window.app = new GradientMatchApp();


# 🎨 GradientMatch — Gradient Discovery, Matcher & Styling Tool

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-2.0.0-sky.svg)](package.json)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-v3-38bdf8.svg)](https://tailwindcss.com)

**GradientMatch** is a modern, high-performance web application designed for UI/UX designers and front-end developers to discover, compose, match, and export stunning CSS gradients with color theory harmony and WCAG accessibility contrast analysis.

---

## ✨ Key Features

### 🖼️ 1. Curated Gradient Gallery
* **Dynamic Search & Filtering:** Filter gradients by categories including *Vivid, Pastel, Dark, Neon, Mesh, Sunset, Ocean,* and *Minimal*.
* **Instant Copy:** One-click copying for CSS code, Tailwind CSS classes, inline SVG, and PNG image export.
* **Live Component Previews:** Test gradients on UI components such as buttons, cards, hero headers, and typography.

### ☯️ 2. Color Theory Matcher
* Input any base color (HEX/RGB) to generate color-harmonized gradients automatically using proven color relationships:
  * **Complementary**
  * **Analogous**
  * **Triadic**
  * **Tetradic**
  * **Split-Complementary**

### 🎛️ 3. Custom Multi-Stop Builder
* **Gradient Types:** Linear, Radial, and Conic gradients.
* **Fine-Grained Controls:** Adjust gradient angle ($0^\circ$ to $360^\circ$), color stop positions, opacity levels, and color blend modes.
* **Stop Management:** Add, remove, and reorder color stops dynamically.

### ♿ 4. WCAG Accessibility Contrast Checker
* Evaluates text readability over gradient backgrounds in real-time.
* Calculates contrast ratios against white (#FFFFFF) and dark (#0F172A) text.
* Displays explicit compliance ratings for **WCAG AA** and **WCAG AAA** (Normal & Large Text).

### 💖 5. Favorites & Local Storage
* Save your favorite gradients with persistent `localStorage` support.
* Export and import your saved collection anytime.

---

## 🚀 Quick Start

### Prerequisites
* [Node.js](https://nodejs.org/) installed (v16+ recommended).

### Running Locally

#### Option 1: Using `start.bat` (Windows)
Double-click `start.bat` or run in terminal:
```cmd
start.bat
```

#### Option 2: Using `npm`
```bash
npm start
```

The application will be served live at `http://localhost:3000`.

---

## 📁 Project Structure

```text
GradientMatch/
├── css/
│   └── styles.css          # Design tokens, custom glassmorphism & utility styles
├── js/
│   ├── data/
│   │   └── gradients.js    # Curated gradient catalog dataset
│   ├── utils/
│   │   ├── colorTheory.js  # Color conversion & harmony math algorithms
│   │   ├── contrastChecker.js # Relative luminance & WCAG contrast calculations
│   │   └── exportUtils.js  # CSS, Tailwind, SVG, and PNG exporter
│   └── app.js              # Core UI tab switcher, state management & DOM bindings
├── index.html              # Main application HTML structure
├── package.json            # Project configuration & start scripts
├── start.bat               # Windows batch launcher script
└── README.md               # Documentation
```

---

## 🛠️ Built With

* **HTML5 & Vanilla JavaScript (ES Modules)** — Zero heavy framework overhead.
* **Tailwind CSS** — Utility-first responsive design.
* **Color Theory Algorithms** — Custom mathematical color transformations (RGB, HSL, HEX).

---

## 📜 License

This project is licensed under the MIT License — see the `LICENSE` file for details.

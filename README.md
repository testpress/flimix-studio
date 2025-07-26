# Flimix Studio

**Flimix Studio** is a WYSIWYG block-based landing page builder tailored for OTT platforms like Netflix, Prime Video, etc.
It allows teams to visually build marketing and onboarding pages using configurable content blocks.
The editor outputs a clean, structured JSON schema, which can be rendered across web, mobile, and TV platforms.

## ✨ Features

* **Visual Block Editor** – Drag-and-drop interface with live preview
* **JSON Schema Output** – Cross-platform compatible content definitions
* **Responsive Layout** – Automatically adapts for mobile, desktop, and more
* **TypeScript + Tailwind** – Fast modern stack with scalable architecture
* **Schema-Driven UI** – All blocks follow strict RFC-style specs

## 🛠️ Tech Stack

* **Frontend**: React 18 + TypeScript
* **Build Tool**: Vite
* **Styling**: Tailwind CSS v4
* **State Management**: Coming soon (Zustand or similar)
* **Schema-Driven Rendering**: Fully declarative layout engine (JSON → UI)

## 📁 Project Structure

```txt
flimix-studio/
├── src/
│   ├── components/
│   │   ├── TopBar.tsx      # Top toolbar with global actions
│   │   ├── Canvas.tsx      # Main block rendering surface
│   │   └── Sidebar.tsx     # Block/property inspector
│   ├── App.tsx             # Main layout scaffold
│   ├── main.tsx            # App entry point
│   └── index.css           # Tailwind layers and globals
├── vite.config.ts
├── package.json
└── README.md
```

## 🌟 Current Implementation

### Layout Scaffolding

* ✅ `<TopBar />` for Save/Preview/Insert
* ✅ `<Canvas />` for rendering blocks visually
* ✅ `<Sidebar />` for inspecting and editing selected block
* ✅ Tailwind-powered responsive layout

## 📊 JSON Schema Structure

The editor outputs a **page-level JSON document** that can be rendered consistently across any OTT client.

### Root Schema

```json
{
  "title": "Flimix Landing Page",
  "theme": "dark",
  "visibility": {
    "platform": ["tv", "mobile", "desktop"]
  },
  "blocks": [ /* array of block objects */ ]
}
```

### Example Block (Hero)

```json
{
  "type": "hero",
  "id": "hero-001",
  "props": {
    "title": "Stream the Best",
    "subtitle": "Now playing on Flimix",
    "backgroundImage": "https://cdn.flimix.com/hero.jpg",
    "ctaButton": {
      "label": "Subscribe Now",
      "link": "/subscribe"
    }
  },
  "style": {
    "theme": "dark",
    "padding": "lg",
    "textColor": "#ffffff"
  },
  "visibility": {
    "platform": ["mobile", "desktop"]
  },
  "events": {
    "onCTAClick": "track-hero-cta"
  }
}
```

Each block follows a strict spec with fields like:

* `type` (required): block type (e.g., `hero`, `poster-grid`)
* `props`: block-specific content fields
* `style`: visual design tokens
* `events`: optional interaction tracking
* `visibility`: device/platform targeting

## 🔭 Roadmap

### Phase 1: Layout & Rendering Engine

* [x] Initialize project scaffold
* [x] Tailwind CSS setup
* [x] Layout: TopBar, Canvas, Sidebar
* [ ] JSON schema → block renderer
* [ ] Load sample schema and render block tree

### Phase 2: Editor Interactions

* [ ] Block selection, Sidebar editing
* [ ] Drag-and-drop reordering
* [ ] Block insertion & deletion
* [ ] Undo / Redo stack
* [ ] Live preview mode

### Phase 3: Schema Authoring

* [ ] Schema export (as JSON file)
* [ ] Schema import (from JSON)
* [ ] JSON validation rules
* [ ] Block-specific inspectors (e.g., Hero, Carousel)

### Phase 4: Utility

* [ ] Document overview panel
* [ ] Conditional visibility editor
* [ ] Platform simulator (TV, Mobile, Desktop viewports)
* [ ] Template manager (starter pages)

## 🎨 Design Philosophy

* **Schema-first**: Visual UI that outputs machine-readable config
* **Minimalist by default**: Authors only see what they need
* **Composable**: Every block is a leaf or parent — nothing hardcoded
* **Cross-platform**: Built to work for OTT apps on any device

## 🔧 Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build production assets
npm run build

# Preview production build
npm run preview
```

Then open: [http://localhost:5173](http://localhost:5173)

## 👍 Contributing

1. Fork this repository
2. Create a new branch (`feat/block-carousel`)
3. Commit and push changes
4. Open a Pull Request (PR) with context

## 📄 License

MIT License.
Crafted with ❤️ to power OTT landing pages with less code and more creativity.

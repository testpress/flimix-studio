# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Essential Commands
```bash
# Start development server (runs on http://localhost:5173)
npm run dev

# Build production assets
npm run build

# Type checking (TypeScript compilation)
tsc -b

# Lint code
npm run lint

# Preview production build
npm run preview
```

### Development Workflow
- Use `npm run dev` for live development with hot reloading
- Run `npm run lint` before commits to catch issues early
- Build command combines TypeScript compilation and Vite bundling

## Project Architecture

**Flimix Studio** is a WYSIWYG block-based landing page builder for OTT platforms, built with React 18 + TypeScript + Vite + Tailwind CSS v4.

### Core Architecture Patterns

**Schema-Driven Design**: The entire application revolves around a JSON schema that defines pages and blocks:
- `PageSchema` contains metadata and an array of `BlockType` objects
- Each block has `type`, `id`, `props`, `style`, `visibility`, and optional `children`
- All UI components are driven by this schema, enabling consistent cross-platform rendering

**Block System**: Highly modular block architecture:
- Each block type has its own folder in `src/blocks/` with `schema.ts`, `widget.tsx`, `form.tsx`, and `libraryItem.ts`
- Blocks are rendered through a central factory pattern (`blockFactory.ts`)
- Supports nested blocks (sections with children, tabs with content)

**Context-Driven State**: Three main React contexts manage application state:
- `HistoryContext`: Undo/redo functionality with page schema versioning
- `SelectionContext`: Block selection, editing, and manipulation operations
- `BlockInsertContext`: Block insertion and library management

### Key Directories

```
src/
├── blocks/           # Block definitions (hero, text, section, etc.)
│   ├── shared/      # Common types and utilities
│   └── [block-type]/ # Each block has schema, widget, form, libraryItem
├── context/         # React contexts for state management
│   └── domain/      # Business logic (blockFactory, blockTraversal)
├── layout/          # Main UI layout components (Canvas, Sidebar, etc.)
└── components/      # Reusable UI components
```

### Path Aliases
The project uses extensive TypeScript path aliases configured in `vite.config.ts` and `tsconfig.app.json`:
- `@/*` → `src/*`
- `@blocks/*` → `src/blocks/*`
- `@components/*` → `src/components/*`
- `@layout/*` → `src/layout/*`
- `@context/*` → `src/context/*`
- Plus specific block aliases like `@blocks/hero/*`, `@blocks/text/*`

### Block Development Pattern

When creating new blocks, follow this structure:
1. **Schema** (`schema.ts`): Define TypeScript interfaces for props and block structure
2. **Widget** (`widget.tsx`): React component that renders the block in the canvas
3. **Form** (`form.tsx`): Property editor interface for the settings panel
4. **Library Item** (`libraryItem.ts`): Block metadata and default props for the block library

### State Management Flow

1. **Page Schema** lives in `HistoryContext` with undo/redo capability
2. **Block Selection** is managed by `SelectionContext` which syncs with current schema
3. **Block Editing** updates flow through context methods that trigger history snapshots
4. **Live Preview** works because all components re-render from the central schema state

### Component Architecture

**Layout Components**:
- `TopBar`: Global actions (save, preview, insert)
- `LibraryPanel`: Block library for inserting new blocks
- `Canvas`: Main editing surface that renders the block tree
- `SettingsPanel`: Property inspector for selected blocks

**Block Rendering**: Uses recursive rendering pattern where each block can have children, and tabs blocks have special nested child handling.

## Technical Notes

### Tailwind CSS v4
- Uses `@tailwindcss/vite` plugin for Tailwind v4 integration
- Responsive design system for mobile/desktop/TV platforms
- Custom design tokens for OTT platform aesthetics

### TypeScript Configuration
- Strict mode enabled with comprehensive linting rules
- Uses project references with separate app and node configurations
- Path mapping for clean imports across the codebase

### Block Visibility System
Sophisticated conditional rendering system allowing blocks to show/hide based on:
- Platform (mobile, desktop, tv)
- User authentication status
- Subscription tier
- Geographic region
- Custom conditions

This enables OTT platforms to create targeted content experiences without multiple page versions.

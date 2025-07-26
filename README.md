# Flimix Studio

A WYSIWYG block-based landing page builder for OTT platforms. The editor outputs JSON schema representing structured page layouts.

## 🚀 Features

- **Block-based Editor**: Drag and drop interface for building landing pages
- **WYSIWYG Interface**: Real-time visual editing
- **JSON Schema Output**: Structured data representation of page layouts
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS
- **Responsive Design**: Works across different screen sizes

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Development**: Hot Module Replacement (HMR)

## 📁 Project Structure

```
flimix-studio/
├── src/
│   ├── components/
│   │   ├── TopBar.tsx      # Top toolbar with actions
│   │   ├── Canvas.tsx      # Block editor canvas
│   │   └── Sidebar.tsx     # Settings and configuration panel
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles with Tailwind
├── vite.config.ts          # Vite configuration
└── package.json            # Dependencies and scripts
```

## 🎯 Current Implementation

### Layout Components

1. **TopBar** - Contains the application title and action buttons (Save, Preview)
2. **Canvas** - Main editing area where blocks can be dragged and dropped
3. **Sidebar** - Settings panel with block properties and page configuration

### Styling

- Uses Tailwind CSS v4 with `@tailwindcss/vite` plugin
- Responsive flexbox layout
- Modern dark/light theme with proper contrast
- Clean, professional UI design

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd flimix-studio
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔧 Development

### Adding New Blocks

The editor is designed to support various block types:
- Hero Sections
- Content Blocks
- Media Galleries
- Call-to-Action Components

### JSON Schema Structure

The editor will output structured JSON representing the page layout:

```json
{
  "page": {
    "title": "Landing Page",
    "metaDescription": "Page description",
    "blocks": [
      {
        "type": "hero",
        "id": "hero-1",
        "properties": {
          "title": "Welcome to Flimix",
          "subtitle": "Your OTT platform",
          "backgroundImage": "url"
        }
      }
    ]
  }
}
```

## 📝 Git History

- `Initial scaffold: Vite + React + TypeScript setup`
- `Add Tailwind CSS with basic configuration`
- `Add editor layout: TopBar, Canvas, Sidebar with Tailwind`

## 🎨 Design Philosophy

Flimix Studio follows a clean, intuitive design approach:
- **Minimalist Interface**: Focus on content creation
- **Visual Feedback**: Clear indication of selected blocks and actions
- **Responsive Layout**: Adapts to different screen sizes
- **Accessibility**: Proper contrast and keyboard navigation support

## 🔮 Roadmap

- [ ] Block library implementation
- [ ] Drag and drop functionality
- [ ] Block property editing
- [ ] JSON schema generation
- [ ] Preview mode
- [ ] Export functionality
- [ ] Template system
- [ ] Collaboration features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ for OTT platform creators

# Flimix Studio

**Flimix Studio** is a powerful visual page builder designed specifically for OTT (Over-The-Top) platforms like Netflix, Amazon Prime, Disney+, and Hotstar. It provides a complete visual editing experience for creating marketing pages, landing pages, and content discovery interfaces.

## What is Flimix Studio?

Flimix Studio is a React-based visual editor that renders a complete page builder interface. It allows content creators and developers to:

- **Build visually** - Add and configure blocks to create pages
- **Edit in real-time** - See changes instantly as you build
- **Export structured data** - Get clean JSON schemas for rendering across platforms
- **Integrate seamlessly** - Embed the studio into any web application

## Key Features

- **16+ Pre-built Blocks** - Hero carousels, poster grids, text blocks, CTAs, and more
- **Real-time Visual Editing** - Live preview with instant updates
- **Cross-platform Output** - JSON schemas work on web, mobile, and TV
- **Responsive Design** - Automatically adapts to different screen sizes
- **Theme Support** - Dark/light themes with customizable styling
- **Platform Targeting** - Show/hide content based on device or region
- **Undo/Redo** - Full history management for safe editing
- **Block-based Architecture** - Modular, extensible block system

## Tech Stack

- **React 19** - Latest React with concurrent features
- **TypeScript** - Full type safety and IntelliSense
- **Tailwind CSS v4** - Modern utility-first styling
- **Vite** - Fast build tool and dev server
- **Lucide React** - Beautiful icon library

## Installation & Setup

Flimix Studio is distributed as a static JavaScript file that gets served from a cloud storage bucket. There's no npm package installation required.

## Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup
```bash
# Clone the repository
git clone https://github.com/your-org/flimix-studio.git
cd flimix-studio

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Project Structure
```
src/
├── blocks/           # Individual block implementations
│   ├── hero/         # Hero block (carousel, single)
│   ├── carousel/      # Content carousels
│   ├── text/          # Text content
│   └── ...           # Other blocks
├── components/        # Shared UI components
├── context/          # React context providers
├── layout/           # Main layout components
├── renderer/         # Block rendering engine
└── utils/            # Utility functions
```

### Deployment Options

#### Local Development with MinIO

For local development and testing, you can use a local MinIO bucket:

1. **Set up environment variables** (create `.env` file):
```bash
# MinIO Configuration
MINIO_ENDPOINT=http://localhost:9000
MINIO_ACCESS_KEY=admin
MINIO_SECRET_KEY=admin123
MINIO_BUCKET_NAME=flimix
MINIO_REGION=us-east-1
```

2. **Deploy to local MinIO bucket**:
```bash
npm run deploy:local
```

This will:
- Build the project (`npm run build`)
- Upload `dist/js/flimix-studio.js` and `dist/css/flimix-studio.css` to your local MinIO bucket
- Make the files available at: `http://localhost:9000/flimix/static/studio/`

3. **Use in integration**:
```html
<!-- Use local MinIO URLs -->
<link rel="stylesheet" href="http://localhost:9000/bucket-name/static/studio/css/flimix-studio.css">
<script src="http://localhost:9000/bucket-name/static/studio/js/flimix-studio.js"></script>
```

#### Production Deployment

For production deployment, use GitHub Actions:

1. **Trigger deployment**:

**Automatic**: Push to main branch
```bash
git push origin main
```

**Manual**: Go to GitHub Actions tab and manually trigger the deployment workflow.

3. **GitHub Action will**:
- Build the project
- Upload to production bucket
- Make files available at: `https://your-production-bucket.com/flimix-studio-prod/static/studio/`

4. **Use in production integration**:
```html
<!-- Use production URLs -->
<link rel="stylesheet" href="https://your-production-bucket.com/bucket-name/static/studio/css/flimix-studio.css">
<script src="https://your-production-bucket.com/bucket-name/static/studio/js/flimix-studio.js"></script>
```

## Quick Start

### Basic HTML Integration

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Flimix Studio</title>
    <link rel="stylesheet" href="https://your-bucket.com/bucket-name/static/studio/css/flimix-studio.css">
</head>
<body>
    <div id="flimix-studio-container" style="height: 100vh;"></div>
    
    <script src="https://your-bucket.com/bucket-name/static/studio/js/flimix-studio.js"></script>
    <script>
        window.FlimixStudio.onReady(function() {
            const root = window.FlimixStudio.render(
                document.getElementById('flimix-studio-container'),
                {
                    schema: {
                        'home': {
                            title: 'My Landing Page',
                            theme: 'dark',
                            blocks: []
                        }
                    },
                    onSavePage: async function( schema) {
                        console.log('Saving page:', pageSlug, schema);
                        // Handle save logic here
                    }
                }
            );
        });
    </script>
</body>
</html>
```

## Available Blocks

The studio comes with 16+ pre-built blocks optimized for OTT platforms:

### Content Blocks
- **Hero** - Full-width hero sections with carousel support
- **Carousel** - Horizontal scrolling content rows
- **Poster Grid** - Grid layouts for movie/show posters
- **Text** - Rich text content with typography controls
- **Image** - Single images with various sizing options
- **Video** - Video players with HLS support

### Layout Blocks
- **Section** - Container blocks for grouping content
- **Spacer** - Add vertical spacing between blocks
- **Divider** - Visual separators between sections
- **Tabs** - Tabbed content organization

### Interactive Blocks
- **CTA Button** - Call-to-action buttons with multiple variants
- **Badge Strip** - Horizontal scrolling badges/tags
- **FAQ Accordion** - Expandable question/answer sections
- **Testimonial** - Customer testimonials and reviews
- **Feature Callout** - Highlight key features or benefits

## JSON Schema Structure

The studio outputs clean, structured JSON that can be rendered across any platform:

```json
{
  "title": "Amazon Prime Landing Page",
  "theme": "dark",
  "visibility": {
    "platform": ["mobile", "desktop", "tv"],
    "region": ["US", "CA", "UK"]
  },
  "blocks": [
    {
      "type": "hero",
      "id": "hero-001",
      "props": {
        "variant": "carousel",
        "items": [
          {
            "id": "hero-item-1",
            "title": "Jurassic World Rebirth",
            "subtitle": "Epic adventure awaits",
            "backgroundImage": "https://example.com/hero-bg.jpg",
            "primaryCTA": {
              "label": "Watch Now",
              "link": "/watch/jurassic-world"
            }
          }
        ]
      },
      "style": {
        "backgroundColor": "#000000",
        "textColor": "#ffffff",
        "padding": "lg"
      },
      "visibility": {
        "platform": ["mobile", "desktop"]
      }
    }
  ]
}
```

## Styling & Theming

### Built-in Themes
- **Dark Theme** - Optimized for OTT platforms
- **Light Theme** - Clean, modern appearance

### Custom Styling
Each block supports extensive styling options:
- Colors (background, text, borders)
- Spacing (padding, margins)
- Typography (fonts, sizes, weights)
- Layout (alignment, sizing)
- Effects (shadows, borders, opacity)

### Responsive Design
- Automatic responsive behavior
- Platform-specific visibility controls
- Device-optimized layouts

## API Reference

### `window.FlimixStudio.render(element, props)`

Renders the Flimix Studio interface into a DOM element.

**Parameters:**
- `element: HTMLElement` - DOM element to render into
- `props: Object` - Configuration options

**Returns:** `Root` - React root instance for cleanup

### Configuration Options

```javascript
{
  id: 'home-page', // Can be a string or a number
  schema: {
    title: 'Page Title',
    theme: 'dark', // or 'light'
    blocks: [] // Array of block objects
  },
  onSavePage: async function(id, schema) {
    // Handle page saving - called when user saves a page
    // Return a Promise
  }
}
```

### Global API

```javascript
// Wait for studio to be ready
window.FlimixStudio.onReady(function() {
  // Studio is ready to use
});

// Render the studio
const root = window.FlimixStudio.render(container, options);

// Unmount the studio
window.FlimixStudio.unmount();
```

## Platform Support

### Rendering Platforms
- **Web** - React components for web applications
- **Mobile** - React Native compatible schemas
- **TV** - Smart TV and set-top box applications
- **Desktop** - Electron and desktop applications

**Built with ❤️ for the OTT industry** - Empowering content creators to build beautiful, engaging experiences across all platforms.

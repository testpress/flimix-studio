import { createRoot, type Root } from 'react-dom/client'
import './index.css'
import App, { type AppProps } from './App'

// TypeScript declaration for global FlimixStudio 
declare global {
  interface Window {
    FlimixStudio: {
      render: (el: HTMLElement, props?: AppProps) => Root;
      unmount: () => void;
    };
  }
}

let root: Root | null = null

export function renderStudio(el: HTMLElement, props: AppProps = {}) {
  // Unmount previous instance if it exists to prevent memory leaks
  if (root) {
    unmountStudio();
  }
  
  root = createRoot(el)
  root.render(<App {...props} />)
  return root
}

export function unmountStudio() {
  if (root) {
    root.unmount()
    root = null
  }
}

if (typeof window !== 'undefined') {
  window.FlimixStudio = {
    render: renderStudio,
    unmount: unmountStudio
  }
}

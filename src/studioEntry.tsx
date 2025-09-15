import { createRoot, type Root } from 'react-dom/client'
import './index.css'
import App, { type AppProps } from './App'

// TypeScript declaration for global FlimixStudio 
declare global {
  interface Window {
    FlimixStudio: {
      render: (el: HTMLElement, props?: AppProps) => Root;
      unmount: () => void;
      onReady: (callback: () => void) => void;
    };
  }
}

let root: Root | null = null
let readyCallbacks: (() => void)[] = []
let isReady = false

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

export function onReady(callback: () => void) {
  if (isReady) {
    callback()
  } else {
    readyCallbacks.push(callback)
  }
}

if (typeof window !== 'undefined') {
  window.FlimixStudio = {
    render: renderStudio,
    unmount: unmountStudio,
    onReady: onReady
  }
  
  // Mark as ready immediately when SDK is loaded
  // NOTE: Currently the SDK is marked as ready as soon as the script loads.
  // In the future, this will be changed to wait for internal SDK initialization
  // to complete (e.g., API connections, authentication, data loading, etc.)
  // before marking isReady = true. This will make the ready state dependent
  // on async operations finishing successfully.
  if (!isReady) {
    isReady = true
    readyCallbacks.forEach(callback => callback())
    readyCallbacks = []
  }
}

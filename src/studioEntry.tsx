import { createRoot, type Root } from 'react-dom/client'
import './index.css'
import { mountPreview, unmountPreview } from './previewEntry'
import PageBuilder, { type PageBuilderProps } from './PageBuilder'
import type { PagePreviewProps } from './PagePreview'

// TypeScript declaration for global FlimixStudio 
declare global {
  interface Window {
    FlimixStudio: {
      mount: (el: HTMLElement, props: PageBuilderProps) => Root;
      unmount: () => void;
      mountPreview: (el: HTMLElement, props: PagePreviewProps) => Root;
      unmountPreview: () => void;
      onReady: (callback: () => void) => void;
    };
  }
}

let root: Root | null = null
let readyCallbacks: (() => void)[] = []
let isReady = false

export function mountStudio(el: HTMLElement, props: PageBuilderProps) {
  // Unmount previous instance if it exists to prevent memory leaks
  if (root) {
    unmountStudio();
  }
  
  root = createRoot(el)
  root.render(<PageBuilder {...props} />)
  return root
}

export function unmountStudio() {
  if (root) {
    root.unmount()
    root = null
  }
}

/**
 * Registers a callback to be executed when the SDK becomes ready.
 * 
 * Purpose: Allows external code to wait for the SDK to finish initialization
 * before performing operations that depend on the SDK being fully loaded.
 * 
 * Usage:
 * - If SDK is already ready: callback executes immediately
 * - If SDK is not ready: callback is queued and will execute when SDK becomes ready
 * 
 * This is useful for ensuring proper initialization order and preventing
 * race conditions where code tries to use the SDK before it's ready.
 */
export function onReady(callback: () => void) {
  if (isReady) {
    // SDK is already ready, execute callback immediately
    callback()
  } else {
    // SDK not ready yet, queue the callback for later execution
    readyCallbacks.push(callback)
  }
}

if (typeof window !== 'undefined') {
  window.FlimixStudio = {
    mount: mountStudio,
    unmount: unmountStudio,
    mountPreview: mountPreview,
    unmountPreview: unmountPreview,
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
    // Execute all queued callbacks now that SDK is ready
    readyCallbacks.forEach(callback => callback())
    // Clear the callback queue since they've all been executed
    readyCallbacks = []
  }
}

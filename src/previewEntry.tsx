import { createRoot, type Root } from 'react-dom/client'
import './index.css'
import PagePreview, { type PagePreviewProps } from './PagePreview'

let root: Root | null = null

export function mountPreview(el: HTMLElement, props: PagePreviewProps) {
  // Unmount previous instance if it exists to prevent memory leaks
  if (root) {
    unmountPreview();
  }
  
  root = createRoot(el)
  root.render(<PagePreview {...props} />)
  return root
}

export function unmountPreview() {
  if (root) {
    root.unmount()
    root = null
  }
}


import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import PageBuilder from './PageBuilder.tsx'
import HeaderFooterEditor from './HeaderFooterEditor.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HeaderFooterEditor />
  </StrictMode>,
)

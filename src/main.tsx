import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import HeaderFooterBuilder from './editor/HeaderFooterEditor.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HeaderFooterBuilder />
  </StrictMode>,
)
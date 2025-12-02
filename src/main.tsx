import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import PageBuilder from './PageBuilder.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PageBuilder id="local-dev" />
  </StrictMode>,
)

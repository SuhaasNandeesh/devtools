import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import { App } from './App.tsx'
import { ThemeProvider } from './context/ThemeContext'
import { ClipboardProvider } from './context/ClipboardContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <ClipboardProvider>
        <App />
      </ClipboardProvider>
    </ThemeProvider>
  </StrictMode>,
)

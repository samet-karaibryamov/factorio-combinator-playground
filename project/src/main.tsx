import React from 'react'
import ReactDOM from 'react-dom/client'
import { KeyboardCapture } from 'useKeyboard'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <KeyboardCapture>
      <App />
    </KeyboardCapture>
  </React.StrictMode>
)

import React from 'react'
import ReactDOM from 'react-dom/client'
import { MotionConfig } from 'motion/react'
import { App } from './App'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MotionConfig reducedMotion="user" transition={{ type: 'spring', duration: 0.45, bounce: 0 }}>
      <App />
    </MotionConfig>
  </React.StrictMode>,
)

import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import { CssVarsProvider } from '@mui/joy/styles'
import '@fontsource/public-sans'

const router = createHashRouter([
  {
    path: '/*',
    element: <App />,
  },
])

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <CssVarsProvider>
      <RouterProvider router={router} />
    </CssVarsProvider>
  </React.StrictMode>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()

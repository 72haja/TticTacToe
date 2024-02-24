import '@builder.io/qwik/qwikloader.js'

import { render } from '@builder.io/qwik'
import { App } from './App.tsx'
import './index.css'

render(document.getElementById('app') as HTMLElement, <App />)

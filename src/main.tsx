import ReactDOM from 'react-dom/client'
import './index.css'

import 'maplibre-gl/dist/maplibre-gl.css'

import { DeckGlBugs } from './DeckGlBugs.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <DeckGlBugs />
)

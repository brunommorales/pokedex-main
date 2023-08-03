import { Route, Routes, HashRouter } from 'react-router-dom'
import { Home } from './pages/Home'
import Graphics from './pages/Graphics'

export function App() {
  return (
    <>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/graphics" element={<Graphics />} />
        </Routes>
      </HashRouter>
    </>
  )
}

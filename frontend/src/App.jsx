import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import LearningPage from './pages/LearningPage'
import ResultPage from './pages/ResultPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LearningPage />}/>
        <Route path="/result" element={<ResultPage />}/>
      </Routes>
      <script src="../node_modules/flowbite/dist/flowbite.min.js"></script>
    </BrowserRouter>
    
  )
}

export default App

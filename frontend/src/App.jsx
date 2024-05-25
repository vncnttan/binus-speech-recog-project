import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import LearningPage from './pages/LearningPage'
import TestingPage from './pages/TestingPage'
import ResultPage from './pages/ResultPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LearningPage />}/>
        <Route path="/testing" element={<TestingPage />}/>
        <Route path="/result" element={<ResultPage />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App

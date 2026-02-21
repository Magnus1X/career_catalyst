import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CPTracker from './pages/CPTracker';
import CodeInsights from './pages/CodeInsights';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cp-tracker" element={<CPTracker />} />
        <Route path="/code-insights" element={<CodeInsights />} />
        {/* Module Routes will go here */}
      </Routes>
    </Router>
  );
}

export default App;

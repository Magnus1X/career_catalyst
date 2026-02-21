import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CPTracker from './pages/CPTracker';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cp-tracker" element={<CPTracker />} />
        {/* Module Routes will go here */}
      </Routes>
    </Router>
  );
}

export default App;

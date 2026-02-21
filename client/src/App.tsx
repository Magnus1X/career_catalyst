import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CPTracker from './pages/CPTracker';
import CodeInsights from './pages/CodeInsights';
import AIMockInterviewer from './pages/AIMockInterviewer';
import EducationalRAG from './pages/EducationalRAG';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider } from './hooks/useAuth';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cp-tracker" element={<CPTracker />} />
          <Route path="/code-insights" element={<CodeInsights />} />
          <Route path="/ai-interviewer" element={<AIMockInterviewer />} />
          <Route path="/educational-rag" element={<EducationalRAG />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

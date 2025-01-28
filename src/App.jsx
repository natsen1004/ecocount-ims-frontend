import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginForm from './components/auth/LoginForm';
import SignupForm from './components/auth/SignupForm';
import ProductsPage from './pages/ProductsPage';
import ReportsPage from './pages/ReportsPage';
import AuthProvider from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/" element={<LoginForm />} />
          <Route path="/" element={<SignupForm />} />
          <Route path="/" element={<ProductsPage />} />
          <Route path="/" element={<ReportsPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/common/Navbar';
import Footer from './components/common/Footer';
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
        <Navigation />
        <div className="content">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
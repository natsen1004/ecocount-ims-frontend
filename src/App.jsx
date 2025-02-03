import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import LandingPage from "./pages/LandingPage";
import LoginForm from "./components/auth/LoginForm";
import SignupForm from "./components/auth/SignupForm";
import ProductsPage from "./pages/ProductsPage";
import ReportsPage from "./pages/ReportsPage";
import AuthProvider from "./context/AuthContext";
import axios from "axios";
import { useState, useEffect } from "react";

function AppContent() {
  const [products, setProducts] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://ecocount-ims-backend.onrender.com/products")
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    axios
      .get("https://ecocount-ims-backend.onrender.com/reports")
      .then((response) => {
        setReports(response.data);
      })
      .catch((error) => {
        console.error("Error fetching reports:", error);
      });
  }, []);

  return (
    <>
      <Navigation /> 
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/products" element={<ProductsPage products={products} loading={loading} />} />
          <Route path="/reports" element={<ReportsPage reports={reports} />} />
        </Routes>
      </div>
    <Footer />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent /> 
      </Router>
    </AuthProvider>
  );
}

export default App;

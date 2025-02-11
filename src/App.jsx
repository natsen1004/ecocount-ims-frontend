import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import LoginForm from "./components/auth/LoginForm";
import SignupForm from "./components/auth/SignupForm";
import ProductsPage from "./pages/ProductsPage";
import ReportsPage from "./pages/ReportsPage";
import Notifications from "./components/feature/Notification"; 
import AuthProvider from "./context/AuthContext"; 
import { UserProvider, useUser } from "./context/UserContext"; 
import axios from "axios";
import { useState, useEffect } from "react";

function AppContent() {
  const { userId, loading } = useUser();
  const [products, setProducts] = useState([]);
  const [reports, setReports] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!userId || loading) return;

    const fetchProducts = async () => {
      try {
        const response = await axios.get("https://ecocount-ims-backend.onrender.com/products", {
          params: { user_id: userId },
        });

        console.log("Products fetched:", response.data);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setDataLoading(true);
      }
    };

    fetchProducts();
  }, [userId, loading]);

  useEffect(() => {
    if (!userId || loading) return;

    let isMounted = true;

    const fetchReports = async () => {
      setDataLoading(true);
      try {
        const response = await axios.get("https://ecocount-ims-backend.onrender.com/reports", {
          params: { user_id: userId },
        });

        if (isMounted) {
          console.log("Reports fetched:", response.data);
          setReports(response.data);
        }
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();

    return () => {
      isMounted = false;
    };
  }, [userId, loading]);

  return (
    <>
      <Navigation />
      {userId && location.pathname === "/dashboard" && (
        <p>Please select an email to view notifications.</p>
      )}
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
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
      <UserProvider> 
        <Router>
          <AppContent />
        </Router>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;



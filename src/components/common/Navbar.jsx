import { Link, useLocation, useNavigate  } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../../styles/Navbar.css';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("user_id"); 
    setIsLoggedIn(false);
    navigate('/'); 
  };


  const isLandingPage = location.pathname === "/";

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link className="navbar-logo" to="/">
          EcoCount IMS
        </Link>
        {isLoggedIn && !isLandingPage && (
          <ul className="nav-links">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/products">
                Products
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/reports">
                Reports
              </Link>
            </li>
            <li className="nav-item">
              <button className="nav-link logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navigation;

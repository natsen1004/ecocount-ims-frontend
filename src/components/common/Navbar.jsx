import { Link } from 'react-router-dom';
import '../../styles/Navbar.css';

const Navigation = () => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link className="navbar-logo" to="/">
          EcoCount IMS
        </Link>
      
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
          </ul>
      </div>
    </nav>
  );
};

export default Navigation;

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { useState, useEffect } from "react";
import "../../styles/Navbar.css";
import axios from "axios";
import Notifications from "../feature/Notification"; 

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userEmail, setUserEmail } = useUser();
  const [emailList, setEmailList] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await axios.get(
          "https://ecocount-ims-backend.onrender.com/users"
        );
        setEmailList(response.data);
      } catch (error) {
        console.error("Failed to fetch emails:", error);
      }
    };

    fetchEmails();
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    setUserEmail(null);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link className="navbar-logo" to="/">
          EcoCount IMS
        </Link>

        {userEmail && location.pathname !== "/" && (
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
        )}

        <div className="nav-right">
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="relative p-2 text-gray-700 hover:text-gray-900"
            >
              🔔
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            <Notifications dropdownOpen={dropdownOpen} toggleDropdown={toggleDropdown} />
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="user-selection">
          <label htmlFor="userEmail">Select Your Email: </label>
          <select
            id="userEmail"
            value={userEmail || ""}
            onChange={(e) => setUserEmail(e.target.value)}
            className="text-black p-1"
          >
            <option value="">-- Select Email --</option>
            {emailList.map((user) => (
              <option key={user.id} value={user.email}>
                {user.email}
              </option>
            ))}
          </select>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;



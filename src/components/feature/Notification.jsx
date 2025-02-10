import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../../context/UserContext";
import "../../styles/Notifications.css";

const Notifications = ({ dropdownOpen, toggleDropdown }) => {
  const { userEmail } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    if (!userEmail) return;

    try {
      const response = await axios.get(
        "https://ecocount-ims-backend.onrender.com/notifications",
        { params: { user_email: userEmail } }
      );

      if (Array.isArray(response.data)) {
        setNotifications(response.data);
        setUnreadCount(response.data.filter((n) => !n.read).length);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error("Notification fetch error:", error);
      setError("Failed to fetch notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [userEmail]);

  const markAsRead = async (notificationId) => {
    try {
      await axios.post(
        "https://ecocount-ims-backend.onrender.com/notifications/mark_read",
        {
          notification_id: notificationId,
          user_email: userEmail, 
        }
      );

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId ? { ...notification, read: true } : notification
        )
      );

      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  if (!dropdownOpen) return null;

  return (
    <div className="notifications-dropdown">
      <div className="notifications-header">
        <h1 className="notifications-title">Notifications</h1>
        <button onClick={toggleDropdown} className="close-button">✖</button>
      </div>

      <div className="notifications-content">
        {loading ? (
          <div className="loading">Loading notifications...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : notifications.length === 0 ? (
          <div className="no-notifications">No notifications at this time.</div>
        ) : (
          <div className="notifications-list">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-item ${!notification.read ? 'unread' : ''}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="notification-type">{notification.type}</div>
                <div className="notification-message">{notification.message}</div>
                <div className="notification-time">
                  {new Date(notification.sent_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;







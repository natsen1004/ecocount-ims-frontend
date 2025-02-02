import { useEffect, useState } from 'react';
import axios from 'axios';
const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://127.0.0.1:5000/notifications");
        setNotifications(response.data);
      } catch {
        setError("Failed to fetch notifications. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleRetry = () => {
    setError(null);
    setNotifications([]);
    setLoading(true);
    
    axios.get("http://127.0.0.1:5000/notifications")
      .then((response) => {
        setNotifications(response.data);
      })
      .catch(() => {
        setError("Failed to fetch notifications. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (loading) {
    return <div>Loading notifications...</div>;
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <button onClick={handleRetry}>Retry</button>
      </div>
    );
  }

  return (
    <div className="p-4 grid gap-4">
      <h1 className="text-2xl font-bold">Low Stock Notifications</h1>
      {notifications.length === 0 ? (
        <p>No low-stock notifications at this time.</p>
      ) : (
        notifications.map((notification) => (
          <div key={notification.id} className="shadow-md">
            <div className="notification-card-content">
              <h2 className="text-xl font-semibold">{notification.type}</h2>
              <p>Product ID: {notification.product_id}</p>
              <p>Message: {notification.message || "Stock levels are low."}</p>
              <p>Sent At: {new Date(notification.sent_at).toLocaleString()}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Notifications;

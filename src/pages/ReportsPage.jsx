import { useEffect, useState } from 'react';
import axios from 'axios';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const ReportsPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [stockMovements, setStockMovements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://ecocount-ims-backend.onrender.com/users');
        setUsers(response.data);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Error fetching users.');
      }
    };
    fetchUsers();
  }, []);

  const fetchStockMovements = async (userId) => {
    setLoading(true);
    try {
      const response = await axios.get('https://ecocount-ims-backend.onrender.com/stock_movement', {
        params: { user_id: userId },
      });
      setStockMovements(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching stock movements:', err);
      setError('Error fetching stock movements.');
    } finally {
      setLoading(false);
    }
  };

  const handleUserChange = (e) => {
    const userId = e.target.value;
    setSelectedUserId(userId);
    if (userId) {
      fetchStockMovements(userId);
    } else {
      setStockMovements([]);
    }
  };

  const sortedMovements = [...stockMovements].sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  );

  const labels = sortedMovements.map((movement) =>
    new Date(movement.timestamp).toLocaleDateString()
  );
  const quantityChanges = sortedMovements.map((movement) => movement.quantity_change);
  const newQuantities = sortedMovements.map((movement) => movement.new_quantity);

  const lineChartData = {
    labels,
    datasets: [
      {
        label: 'Quantity Change',
        data: quantityChanges,
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: true,
      },
    ],
  };

  const barChartData = {
    labels,
    datasets: [
      {
        label: 'New Quantity',
        data: newQuantities,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  return (
    <div>
      <h1 className="reports">Reports</h1>
      <div>
        <label htmlFor="userSelect">Select User:</label>
        <select id="userSelect" value={selectedUserId} onChange={handleUserChange}>
          <option value="">-- Select a user --</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.email}
            </option>
          ))}
        </select>
      </div>

      {loading && <p>Loading reports...</p>}
      {error && <p>{error}</p>}

      {!loading && !error && stockMovements.length > 0 && (
        <>
          <div>
            <h2>Stock Movements Over Time</h2>
            <Line data={lineChartData} />
          </div>

          <div>
            <h2>Stock Levels After Movements</h2>
            <Bar data={barChartData} />
          </div>
        </>
      )}
    </div>
  );
};

export default ReportsPage;

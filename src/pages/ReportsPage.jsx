import { useEffect, useState } from 'react';
import axios from 'axios';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);


const ReportsPage = () => {
  const [stockMovements, setStockMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStockMovements = async () => {
      try {
        const response = await axios.get("https://ecocount-ims-backend.onrender.com/stock_movement");
        setStockMovements(response.data);
      } catch {
        setError("Error fetching stock movements.");
      } finally {
        setLoading(false);
      }
    };
    fetchStockMovements();
  }, []);
  if (loading) return <p>Loading reports...</p>
  if (error) return <p>{error}</p>

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
        label: "Quantity Change",
        data: quantityChanges,
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        fill: true,
      },
    ],
  };

  const barChartData ={
    labels,
    datasets: [
      {
        label: "New Quantity",
        data: newQuantities,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return (
    <div>
      <h1 className="reports">Reports</h1>
      
      <div>
        <h2>Stock Movements Over Time</h2>
        <Line data={lineChartData} />
      </div>

      <div>
        <h2>Stock Levels After Movements</h2>
        <Bar data={barChartData} />
      </div>
    </div>
  );
};

export default ReportsPage;

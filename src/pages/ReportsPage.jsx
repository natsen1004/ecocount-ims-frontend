import { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { useUser } from "../context/UserContext"; 
import { API_URL } from "../utilities/api";
import "chart.js/auto";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const ReportsPage = () => {
  const { userId } = useUser(); 
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return; 

    const fetchReports = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/reports`, {
          params: { user_id: userId },
        });

        console.log("Fetched Reports:", response.data);  

        setReports(Array.isArray(response.data) ? response.data : []);
        setError(null);
      } catch (err) {
        console.error("Error fetching reports:", err);
        setError("Error fetching reports.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [userId]); 

  if (!userId) {
    return <p>Please select a user to view reports.</p>; 
  }

  const sortedMovements = reports
    .flatMap((report) =>
      report.stock_movements.map((movement) => ({
        ...movement,
        product_name: report.product_name,
      }))
    )
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  const productSalesMap = {};

  reports.forEach((report) => {
    if (!report.product_name) {
      console.warn("Skipping report with missing product name:", report);
      return;
    }

    if (!productSalesMap[report.product_name]) {
      productSalesMap[report.product_name] = 0;
    }

    productSalesMap[report.product_name] += Number(report.total_quantity_sold) || 0;
  });

  console.log("Final Product Names for Pie Chart:", Object.keys(productSalesMap));
  console.log("Final Quantity Sold for Pie Chart:", Object.values(productSalesMap));

  const pieChartData = {
    labels: Object.keys(productSalesMap),
    datasets: [
      {
        label: "Total Quantity Sold",
        data: Object.values(productSalesMap).map(q => q || 0.1), 
        backgroundColor: [
          "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", 
          "#F7464A", "#46BFBD", "#FDB45C", "#949FB1", "#4D5360",
        ],
      },
    ],
  };

  return (
    <div>
      <h1 className="reports">Reports</h1>

      {loading && <p>Loading reports...</p>}
      {error && <p>{error}</p>}

      {!loading && !error && reports.length > 0 && (
        <>
          {Object.keys(productSalesMap).length > 0 ? (
            <div>
              <h2>Total Quantity Sold Per Product</h2>
              <div style={{ width: "400px", height: "400px", margin: "0 auto" }}>
                <Pie 
                  data={pieChartData} 
                  options={{ 
                    responsive: true, 
                    maintainAspectRatio: false 
                  }} 
                />
              </div>

            </div>
          ) : (
            <p>No sales data available.</p>
          )}

          <div>
            <h2>Stock Movements</h2>
            <table border="1">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Product</th>
                  <th>Quantity Change</th>
                  <th>New Quantity</th>
                </tr>
              </thead>
              <tbody>
                {sortedMovements.map((movement, index) => (
                  <tr key={index}>
                    <td>{new Date(movement.timestamp).toLocaleDateString()}</td>
                    <td>{movement.product_name}</td>
                    <td>{movement.quantity_change}</td>
                    <td>{movement.new_quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default ReportsPage;



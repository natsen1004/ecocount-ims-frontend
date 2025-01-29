import { useEffect, useState } from 'react';
import axios from 'axios';

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      const apiUrl = "https://ecocount-ims-backend.onrender.com/reports";

      try {
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setReports(response.data);
      } catch (err) {
        console.error("Error fetching reports:", err.message);
        setError("Failed to load reports");
      }
    };

    fetchReports();
  }, []);

  return (
    <div>
      <h1>Reports</h1>
      {error && <p>{error}</p>}
      {reports.length > 0 ? (
        <ul>
          {reports.map((report) => (
            <li key={report.id}>
              {report.title} - {report.createdAt}
            </li>
          ))}
        </ul>
      ) : (
        <p>No reports available.</p>
      )}
    </div>
  );
};

export default ReportsPage;

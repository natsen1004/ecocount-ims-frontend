import { useState, useEffect } from 'react';
import axios from 'axios';

const LandingPage = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const apiUrl = "https://ecocount-ims-backend.onrender.com/landing";

      try {
        const response = await axios.get(apiUrl);
        setData(response.data);
      } catch (err) {
        console.error("Error fetching landing page data:", err.message);
        setError("Failed to load landing page data");
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Welcome to EcoCount IMS</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {data ? (
        <div>
          <p>{data.message}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default LandingPage;

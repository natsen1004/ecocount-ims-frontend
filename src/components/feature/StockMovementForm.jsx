import { useState } from 'react';
import '../../styles/ProductForms.css';

const StockMovementForm = () => {
  const [formData, setFormData] = useState({
    sku: "",
    quantityChange: "",
    reason: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Stock Movement Data:", formData);
    alert("Stock movement recorded!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Stock Movement</h2>
      <label>
        SKU:
        <input type="text" name="sku" value={formData.sku} onChange={handleChange} required />
      </label>
      <label>
        Quantity Change:
        <input type="number" name="quantityChange" value={formData.quantityChange} onChange={handleChange} required />
      </label>
      <label>
        Reason:
        <input type="text" name="reason" value={formData.reason} onChange={handleChange} />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};

export default StockMovementForm;

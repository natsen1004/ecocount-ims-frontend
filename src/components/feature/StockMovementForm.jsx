import { useState, useEffect, useContext } from "react";
import PropTypes from 'prop-types';
import axios from "axios";
import { AuthContext } from "../../context/AuthContext"; 
import "../../styles/ProductForms.css";

const StockMovementForm = ({ fetchProducts }) => {
  const { user } = useContext(AuthContext);
  const userId = user?.id;

  const [formData, setFormData] = useState({
    productName: "",
    sku: "",
    quantityChange: "",
    newQuantity: "",
    reason: "",
    timestamp: new Date().toISOString().slice(0, 16),
  });

  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(userId || "");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("https://ecocount-ims-backend.onrender.com/users")
      .then(response => setUsers(response.data))
      .catch(error => console.error("Error fetching users:", error));
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!selectedUserId) return; 

      try {
        console.log("Fetching products for user:", selectedUserId);
        const response = await axios.get("https://ecocount-ims-backend.onrender.com/products", {
          params: { user_id: selectedUserId },
        });
        console.log("Products fetched:", response.data);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error.response?.data || error.message);
      }
    };

    fetchProducts();
  }, [selectedUserId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === "productName") {
      const trimmedValue = value.trim().toLowerCase();
      const matchedProduct = products.find(product => product.name.trim().toLowerCase() === trimmedValue);

      if (matchedProduct) {
        console.log("Matched Product:", matchedProduct);
        setFormData(prev => ({
          ...prev,
          sku: matchedProduct.sku, 
        }));
      } else {
        console.warn(`No matching product found for "${value}"`);
        setFormData(prev => ({
          ...prev,
          sku: "", 
        }));
      }
    }
  };

  const handleUserChange = (e) => {
    setSelectedUserId(e.target.value);
    setProducts([]);
    setFormData({
      productName: "",
      sku: "",
      quantityChange: "",
      newQuantity: "",
      reason: "",
      timestamp: new Date().toISOString().slice(0, 16),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting Form Data:", formData);

    if (!selectedUserId) {
        alert("Please select a user.");
        return;
    }

    if (!formData.productName) {
        alert("Please enter a product name.");
        return;
    }

    console.log("Submitting Stock Movement Data:", formData);

    const matchingProduct = products.find(product => product.name === formData.productName);
    if (!matchingProduct) {
        alert("Product not found in the product list.");
        return;
    }

    const stockMovementData = {
        product_name: formData.productName,  
        sku: formData.sku || null, 
        quantity_change: parseInt(formData.quantityChange, 10),
        new_quantity: parseInt(formData.newQuantity, 10),
        reason: formData.reason,
        user_id: selectedUserId,
        timestamp: new Date(formData.timestamp).toISOString(),
    };

    console.log("Final Stock Movement Data:", stockMovementData);

    try {
        const response = await axios.post(
            "https://ecocount-ims-backend.onrender.com/stock_movement",
            stockMovementData
        );

        console.log("Stock movement recorded:", response.data);
        alert("Stock movement recorded successfully!");

        if (fetchProducts) {
            fetchProducts(selectedUserId);
        }
    } catch (error) {
        console.error("Error submitting stock movement:", error.response?.data || error.message);
    }
};


  return (
    <form onSubmit={handleSubmit}>
      <h2>Stock Movement</h2>
      <div className="form-group">
        <label htmlFor="userId">Select User:</label>
        <select id="userId" value={selectedUserId} onChange={handleUserChange} required>
          <option value="">Select a user</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.email}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="productName">Product Name:</label>
        <input
          type="text"
          id="productName"
          name="productName"
          value={formData.productName}
          onChange={handleChange}
          placeholder="Enter product name"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="sku">SKU:</label>
        <input type="text" id="sku" name="sku" value={formData.sku} readOnly />
      </div>

      <div className="form-group">
        <label htmlFor="quantityChange">Quantity Change:</label>
        <input
          type="number"
          id="quantityChange"
          name="quantityChange"
          value={formData.quantityChange}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="newQuantity">New Quantity:</label>
        <input
          type="number"
          id="newQuantity"
          name="newQuantity"
          value={formData.newQuantity}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="reason">Reason:</label>
        <input
          type="text"
          id="reason"
          name="reason"
          value={formData.reason}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="timestamp">Timestamp:</label>
        <input
          type="datetime-local"
          id="timestamp"
          name="timestamp"
          value={formData.timestamp}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};

StockMovementForm.propTypes = {
  fetchProducts: PropTypes.func.isRequired,
};


export default StockMovementForm;



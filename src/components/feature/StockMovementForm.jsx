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
    if (!selectedUserId) return;
    
    axios.get("https://ecocount-ims-backend.onrender.com/products", {
      params: { user_id: selectedUserId },
    })
    .then(response => setProducts(response.data))
    .catch(error => console.error("Error fetching products:", error));
  }, [selectedUserId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === "productName") {
      const matchedProduct = products.find(product => product.name.trim().toLowerCase() === value.trim().toLowerCase());

      if (matchedProduct) {
        console.log("Matched Product:", matchedProduct);
        setFormData(prev => ({
          ...prev,
          sku: matchedProduct.sku, 
        }));
      } else {
        console.warn(`⚠️ No matching product found for "${value}"`);
        setFormData(prev => ({
          ...prev,
          sku: "", 
        }));
      }
    }
  };

  const handleUserChange = (e) => {
    setSelectedUserId(e.target.value);
  };

  const createNotification = async (stockMovementData) => {
    try {
        const userEmail = users.find(user => user.id === selectedUserId)?.email;
        if (!selectedUserId || !userEmail || !stockMovementData.product_name || !stockMovementData.product_id) {
            console.error("Missing required fields:", { selectedUserId, userEmail, stockMovementData });
            return;
        }

        const notificationData = {
            user_email: userEmail,
            type: "Stock Movement",
            message: `Stock ${stockMovementData.quantity_change >= 0 ? 'increased' : 'decreased'} by ${Math.abs(stockMovementData.quantity_change)} units for ${stockMovementData.product_name}. New quantity: ${stockMovementData.new_quantity}. Reason: ${stockMovementData.reason}`,
            product_id: stockMovementData.product_id, 
            read: false,
            sent_at: new Date().toISOString()
        };

        console.log("📩 Sending notification data:", notificationData);

        const response = await axios.post(
            "https://ecocount-ims-backend.onrender.com/notifications",
            notificationData
        );

        console.log("Notification created successfully:", response.data);
    } catch (error) {
        console.error("Error creating notification:", error.response?.data || error.message);
    }
};

const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("📤 Submitting Stock Movement Data:", formData);

  if (!selectedUserId) {
      alert("Please select a user.");
      return;
  }

  if (!formData.productName) {
      alert("Please enter a product name.");
      return;
  }

  const matchingProduct = products.find(product => product.name === formData.productName);
  if (!matchingProduct) {
      alert("Product not found in the product list.");
      return;
  }

  const stockMovementData = {
      product_name: formData.productName,
      product_id: matchingProduct.id,  
      sku: formData.sku || null,
      quantity_change: parseInt(formData.quantityChange, 10),
      new_quantity: parseInt(formData.newQuantity, 10),
      reason: formData.reason,
      user_id: selectedUserId,
      timestamp: new Date(formData.timestamp).toISOString(),
  };

  console.log("Final Stock Movement Data before submission:", stockMovementData);

  try {
      const response = await axios.post(
          "https://ecocount-ims-backend.onrender.com/stock_movement",
          stockMovementData
      );
      console.log("Stock movement recorded:", response.data);
      await createNotification(stockMovementData);

      alert("Stock movement recorded successfully!");

      if (fetchProducts) {
          fetchProducts(selectedUserId);
      }

      setFormData({
          productName: "",
          sku: "",
          quantityChange: "",
          newQuantity: "",
          reason: "",
          timestamp: new Date().toISOString().slice(0, 16),
      });
  } catch (error) {
      console.error("Error submitting stock movement:", error.response?.data || error.message);
      alert("Error recording stock movement. Please try again.");
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





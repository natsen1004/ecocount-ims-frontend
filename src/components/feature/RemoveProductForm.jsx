import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/ProductForms.css';

const RemoveProductForm = ({ products, removeProduct, loading }) => {
  const [selectedProductId, setSelectedProductId] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');

  const handleSelectedProductIdChange = (e) => {
    setSelectedProductId(e.target.value);
  };

  const handleSelectedUserIdChange = (e) => {
    setSelectedUserId(e.target.value);
  };

  useEffect(() => {
    axios.get('https://ecocount-ims-backend.onrender.com/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedProductId) {
      alert("Please select a product to remove.");
      return;
    }
    if (!selectedUserId) {
      alert('Please select a user.');
      return;
    }

    removeProduct(selectedProductId);

    setSelectedProductId("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Remove Product</h2>

      <div>
        <label htmlFor="product">Select Product:</label>
        <select
          id="product"
          value={selectedProductId}
          onChange={handleSelectedProductIdChange}
          required
        >
          <option value="">-- Select a Product --</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} (SKU: {product.sku})
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="userId">User:</label>
        <select
          id="userId"
          value={selectedUserId}
          onChange={handleSelectedUserIdChange}
          required
        >
          <option value="">Select a user</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.email} 
            </option>
          ))}
        </select>
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Removing..." : "Remove Product"}
      </button>
    </form>
  );
};

RemoveProductForm.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,    
      name: PropTypes.string.isRequired,  
      sku: PropTypes.string,              
    })
  ).isRequired,
  removeProduct: PropTypes.func.isRequired, 
  loading: PropTypes.bool.isRequired,       
};

export default RemoveProductForm;

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import '../../styles/ProductForms.css';

const AddProductForm = ({ addProduct, loading }) => {
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [reorderLevel, setReorderLevel] = useState(0);
  const [price, setPrice] = useState(0.0);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');

  const handleNameChange = (e) => {
    setName(e.target.value);
  };
  
  const handleSkuChange = (e) => {
    setSku(e.target.value);
  };

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };
  
  const handleReorderLevelChange = (e) => {
    setReorderLevel(e.target.value);
  }

  const handlePriceChange = (e) => {
    setPrice(parseFloat(e.target.value) || 0);
  };  

  const handleSelectedUserIdChange = (e) => {
    setSelectedUserId(e.target.value);
  }
  
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

    if (!name.trim()) {
      alert("Product name is required.");
      return;
    }

    if (!selectedUserId) {
      alert('Please select a user.');
      return;
    }

    const productData = {
      name: name.trim(),
      sku: sku.trim(),
      quantity: isNaN(quantity) ? 0 : quantity,
      reorder_level: isNaN(reorderLevel) ? 0 : reorderLevel,
      price: isNaN(price) ? 0.0 : parseFloat(price),
      user_id: selectedUserId,
    };

    console.log("Submitting Product Data:", productData); 
    addProduct(productData);

    setName("");
    setSku("");
    setQuantity(0);
    setReorderLevel(0);
    setPrice(0);
    setSelectedUserId('');
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>Add Product</h2>

      <div className="form-group">
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={handleNameChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="sku">SKU:</label>
        <input
          type="text"
          id="sku"
          value={sku}
          onChange={handleSkuChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="quantity">Quantity:</label>
        <input
          type="number"
          id="quantity"
          value={quantity}
          onChange={handleQuantityChange}
          min="0"
        />
      </div>

      <div className="form-group">
        <label htmlFor="reorderLevel">Reorder Level:</label>
        <input
          type="number"
          id="reorderLevel"
          value={reorderLevel}
          onChange={handleReorderLevelChange}
          min="0"
        />
      </div>

      <div className="form-group">
        <label htmlFor="price">Price:</label>
        <input
          type="number"
          id="price"
          value={price}
          onChange={handlePriceChange}
          step="0.01"
          min="0"
        />
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
        {loading ? "Adding..." : "Add Product"}
      </button>
    </form>
  );
};

AddProductForm.propTypes = {
  addProduct: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default AddProductForm;


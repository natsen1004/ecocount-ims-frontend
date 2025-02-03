import { useState } from 'react';
import PropTypes from 'prop-types';
import '../../styles/ProductForms.css';

const AddProductForm = ({ addProduct, loading }) => {
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [reorderLevel, setReorderLevel] = useState(0);
  const [price, setPrice] = useState(0.0);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Product name is required.");
      return;
    }

    const productData = {
      name: name.trim(),
      sku: sku.trim(),
      quantity: isNaN(quantity) ? 0 : quantity, 
      reorder_level: isNaN(reorderLevel) ? 0 : reorderLevel, 
      price: isNaN(price) ? 0.0 : price, 
    };

    console.log("Submitting Product Data:", productData); 
    addProduct(productData);

    setName("");
    setSku("");
    setQuantity(0);
    setReorderLevel(0);
    setPrice(0.0);
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
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="sku">SKU:</label>
        <input
          type="text"
          id="sku"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="quantity">Quantity:</label>
        <input
          type="number"
          id="quantity"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
          min="0"
        />
      </div>

      <div className="form-group">
        <label htmlFor="reorderLevel">Reorder Level:</label>
        <input
          type="number"
          id="reorderLevel"
          value={reorderLevel}
          onChange={(e) => setReorderLevel(parseInt(e.target.value) || 0)}
          min="0"
        />
      </div>

      <div className="form-group">
        <label htmlFor="price">Price:</label>
        <input
          type="number"
          id="price"
          value={price}
          onChange={(e) => setPrice(parseFloat(e.target.value) || 0.0)}
          step="0.01"
          min="0"
        />
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


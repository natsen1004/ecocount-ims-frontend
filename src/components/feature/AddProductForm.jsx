import { useState } from 'react';
import PropTypes from 'prop-types';

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

    const productData = { name, sku, quantity, reorder_level: reorderLevel, price };
    addProduct(productData);

    setName("");
    setSku("");
    setQuantity(0);
    setReorderLevel(0);
    setPrice(0.0);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Product</h2>

      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="sku">SKU:</label>
        <input
          type="text"
          id="sku"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="quantity">Quantity:</label>
        <input
          type="number"
          id="quantity"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          min="0"
        />
      </div>

      <div>
        <label htmlFor="reorderLevel">Reorder Level:</label>
        <input
          type="number"
          id="reorderLevel"
          value={reorderLevel}
          onChange={(e) => setReorderLevel(parseInt(e.target.value))}
          min="0"
        />
      </div>

      <div>
        <label htmlFor="price">Price:</label>
        <input
          type="number"
          id="price"
          value={price}
          onChange={(e) => setPrice(parseFloat(e.target.value))}
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

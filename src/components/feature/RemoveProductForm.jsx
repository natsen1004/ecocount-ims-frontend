import PropTypes from 'prop-types';
import { useState } from 'react';
import '../../styles/ProductForms.css';

const RemoveProductForm = ({ products, removeProduct, loading }) => {
  const [selectedProductId, setSelectedProductId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedProductId) {
      alert("Please select a product to remove.");
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
          onChange={(e) => setSelectedProductId(e.target.value)}
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

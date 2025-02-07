import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import '../../styles/ProductList.css';

const ProductList = ({ initialProducts = [], loading }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setProducts(initialProducts);
    console.log("Updated products:", initialProducts);
  }, [initialProducts]);

  if (loading) {
    return <p>Loading products...</p>;
  }

  if (!products.length) {
    return <p>No products found.</p>;
  }

  return (
    <div className="product-list-container">
      <h2>Products List</h2>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <h3>{product.name}</h3>
            <p><strong>SKU:</strong> {product.sku}</p>
            <p><strong>Quantity:</strong> {product.quantity}</p>
            <p><strong>Price:</strong> ${typeof product.price === "number" ? product.price.toFixed(2) : "N/A"}</p>
            <p><strong>Reorder Level:</strong> {product.reorder_level}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

ProductList.propTypes = {
  initialProducts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      sku: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
      price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      reorder_level: PropTypes.number.isRequired,
    })
  ).isRequired,
  loading: PropTypes.bool.isRequired,
};

export default ProductList;


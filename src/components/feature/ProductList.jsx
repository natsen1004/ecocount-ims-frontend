import PropTypes from 'prop-types';

const ProductList = ({ products, loading }) => {
  if (loading) {
    return <p>Loading products...</p>;
  }

  if (!products.length) {
    return <p>No products found.</p>;
  }

  return (
    <div>
      <h2>Products List</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <strong>{product.name}</strong> (SKU: {product.sku}, Quantity:{" "}
            {product.quantity}, Price: ${product.price.toFixed(2)}, Reorder Level:{" "}
            {product.reorder_level})
          </li>
        ))}
      </ul>
    </div>
  );
};

ProductList.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      sku: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
      price: PropTypes.number.isRequired,
      reorder_level: PropTypes.number.isRequired,
    })
  ).isRequired,
  loading: PropTypes.bool.isRequired,
};

export default ProductList;


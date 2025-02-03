import { useState, useEffect } from "react";
import axios from "axios";
import AddProductForm from "../components/feature/AddProductForm";
import RemoveProductForm from "../components/feature/RemoveProductForm";
import StockMovementForm from "../components/feature/StockMovementForm";
import ProductList from "../components/feature/ProductList"; 
import "../styles/ProductsPage.css";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [showRemoveProductForm, setShowRemoveProductForm] = useState(false);
  const [showStockMovementForm, setShowStockMovementForm] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://ecocount-ims-backend.onrender.com/products"
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error.message);
      setError("Failed to fetch products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(); 
  }, []);

  const addProduct = async (newProduct) => {
    try {
      setLoading(true);
      const response = await axios.post(
        "https://ecocount-ims-backend.onrender.com/products",
        newProduct
      );

      if (response.status === 201) {
        setProducts([...products, response.data]);
        alert("Product added successfully!");
        fetchProducts();
      }
    } catch (error) {
      console.error("Error adding product:", error.message);
      alert("Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (productId) => {
    try {
      setLoading(true);
      const response = await axios.delete(
        `https://ecocount-ims-backend.onrender.com/products/${productId}`
      );

      if (response.status === 200) {
        setProducts(products.filter((product) => product.id !== parseInt(productId)));
        alert("Product removed successfully!");
        fetchProducts();
      }
    } catch (error) {
      console.error("Error removing product:", error.message);
      alert("Failed to remove product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="products-container">
      <h1>Products Management</h1>

      {error && <p className="error-message">{error}</p>}

      <div className="form-toggle-buttons">
        <button onClick={() => setShowAddProductForm(!showAddProductForm)}>
          {showAddProductForm ? "Hide Add Product Form" : "Show Add Product Form"}
        </button>
        <button onClick={() => setShowRemoveProductForm(!showRemoveProductForm)}>
          {showRemoveProductForm ? "Hide Remove Product Form" : "Show Remove Product Form"}
        </button>
        <button onClick={() => setShowStockMovementForm(!showStockMovementForm)}>
          {showStockMovementForm ? "Hide Stock Movement Form" : "Show Stock Movement Form"}
        </button>
      </div>

      {showAddProductForm && <AddProductForm addProduct={addProduct} loading={loading} />}
      {showRemoveProductForm && (
        <RemoveProductForm products={products} removeProduct={removeProduct} loading={loading} />
      )}
      {showStockMovementForm && <StockMovementForm fetchProducts={fetchProducts} />}

      <ProductList products={products} loading={loading} />
    </div>
  );
};

export default ProductsPage;

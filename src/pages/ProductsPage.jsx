import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../utilities/api";
import { useUser } from "../context/UserContext"; 
import AddProductForm from "../components/feature/AddProductForm";
import RemoveProductForm from "../components/feature/RemoveProductForm";
import StockMovementForm from "../components/feature/StockMovementForm";
import ProductList from "../components/feature/ProductList";
import "../styles/ProductsPage.css";

const ProductsPage = () => {
  const { userId } = useUser(); 
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [showRemoveProductForm, setShowRemoveProductForm] = useState(false);
  const [showStockMovementForm, setShowStockMovementForm] = useState(false);

  const fetchProducts = async () => {
    if (!userId) return; 

    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/products`, {
        params: { user_id: userId },
      });
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [userId]); 

  const addProduct = async (newProduct) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/products`, newProduct);
      if (response.status === 201) {
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
      const response = await axios.delete(`${API_URL}/products/${productId}`, {
        data: { user_id: userId }
      });
      if (response.status === 200) {
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

  if (!userId) {
    return <p>Please select a user to view products.</p>; 
  }

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
      {showRemoveProductForm && <RemoveProductForm products={products} removeProduct={removeProduct} loading={loading} />}
      {showStockMovementForm && <StockMovementForm fetchProducts={fetchProducts} selectedUserId={userId} />} {/* ✅ Corrected */}

      <ProductList initialProducts={products} loading={loading} />
    </div>
  );
};

export default ProductsPage;




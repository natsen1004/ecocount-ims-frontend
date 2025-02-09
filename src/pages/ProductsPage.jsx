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
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");

  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [showRemoveProductForm, setShowRemoveProductForm] = useState(false);
  const [showStockMovementForm, setShowStockMovementForm] = useState(false);


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("https://ecocount-ims-backend.onrender.com/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to fetch users.");
      }
    };

    fetchUsers();
  }, []);

  const fetchProducts = async (userId) => {
    setLoading(true);
    try {
      const response = await axios.get("https://ecocount-ims-backend.onrender.com/products", {
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

  const handleUserChange = (e) => {
    const userId = e.target.value;
    setSelectedUserId(userId);
    if (userId) {
      fetchProducts(userId);
    } else {
      setProducts([]);
    }
  };

  const addProduct = async (newProduct) => {
    try {
      setLoading(true);
      const response = await axios.post(
        "https://ecocount-ims-backend.onrender.com/products",
        newProduct
      );
      if (response.status === 201) {
        alert("Product added successfully!");
        fetchProducts(newProduct.user_id);
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
        `https://ecocount-ims-backend.onrender.com/products/${productId}`,
        {
          data: { user_id: selectedUserId },
        }
      );
      if (response.status === 200) {
        alert("Product removed successfully!");
        fetchProducts(selectedUserId);
      }
    } catch (error) {
      console.error("Error removing product:", error.message);
      alert("Failed to remove product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="products-container">
      <h1>Products Management</h1>

      {error && <p className="error-message">{error}</p>}

      <div className="form-group">
        <label htmlFor="userSelect">Select User:</label>
        <select
          id="userSelect"
          value={selectedUserId}
          onChange={handleUserChange}
        >
          <option value="">-- Select a User --</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.email}
            </option>
          ))}
        </select>
      </div>

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

      {showAddProductForm && (
        <AddProductForm addProduct={addProduct} loading={loading} />
      )}
      {showRemoveProductForm && (
        <RemoveProductForm
          products={products}
          removeProduct={removeProduct}
          loading={loading}
        />
      )}
      {showStockMovementForm && (
        <StockMovementForm fetchProducts={fetchProducts} selectedUserId={selectedUserId} />
      )}

      <ProductList initialProducts={products} loading={loading} />
    </div>
  );
};

export default ProductsPage;


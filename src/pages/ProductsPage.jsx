import { useState, useEffect } from 'react';
import axios from 'axios';
import AddProductForm from '../components/AddProductForm';
import RemoveProductForm from '../components/RemoveProductForm';
import ProductList from '../components/ProductList';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");

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
    <div>
      <h1>Products Management</h1>

      {error && <p>{error}</p>}

      <AddProductForm addProduct={addProduct} loading={loading} />

      <RemoveProductForm
        products={products}
        removeProduct={removeProduct}
        loading={loading}
      />

      <ProductList products={products} loading={loading}/>
    </div>
  );
};

export default ProductsPage;

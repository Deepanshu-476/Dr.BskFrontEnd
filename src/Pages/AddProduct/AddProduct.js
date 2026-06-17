import React, { useEffect, useState } from 'react';
import './AddProduct.css';
import Admin from '../../components/Admin/Admin';
import { Link } from 'react-router-dom';
import axiosInstance from '../../components/AxiosInstance';

const getProductDisplayId = (product = {}) =>
  product.publicId || `BSK-P-${String(product._id || product.id || '').slice(-8).toUpperCase()}`;

const AddProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/user/allproducts');
        console.log("Fetched products:", response.data);
        setProducts(response.data);  // Update with fetched data
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="admin-layout">
      <Admin />
      <div className="product-content">
        <div className="admin-header">
          <h2>Products</h2>
          <Link to="/admin/Popup">
            <button className="btn-add">Add New Product</button>
          </Link>

        </div>

        {loading ? (
          <p>Loading products...</p>
        ) : (
          <div className="table-responsive">
            <table className="product-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td data-label="ID">{getProductDisplayId(product)}</td>
                    <td data-label="Name">{product.name}</td>
                    <td data-label="Price">${product.price}</td>
                    <td data-label="Stock">{product.quantity}</td>
                    <td data-label="Actions">
                      <button className="btn-edit">Edit</button>
                      <button className="btn-delete">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddProduct;

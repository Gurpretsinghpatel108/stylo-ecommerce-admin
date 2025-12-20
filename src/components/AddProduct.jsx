import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import "./AddProduct.css";

function AddProduct() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const productFromState = location.state?.product || null;

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [formData, setFormData] = useState({
    categoryId: "",
    subcategoryId: "",
    name: "",
    currentPrice: "",
    discountPrice: "",
    description: "",
    promoCode: "",
    status: "Active",
  });
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");

  // Fetch categories & subcategories safely
  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await axios.get("http://localhost:5000/api/categories");
        setCategories(catRes.data.data || []); // <- safe fallback

        const subRes = await axios.get("http://localhost:5000/api/subcategories");
        setSubcategories(subRes.data.data || []); // <- safe fallback
      } catch (err) {
        console.error("Error fetching categories/subcategories:", err);
        setCategories([]);
        setSubcategories([]);
      }
    };
    fetchData();
  }, []);

  // Prefill product form from URL param if state not available
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productFromState && id) {
        try {
          const res = await axios.get(`http://localhost:5000/api/products/${id}`);
          const product = res.data.data; // <- backend structure
          if (product) {
            setFormData({
              categoryId: product.categoryId?._id || "",
              subcategoryId: product.subcategoryId?._id || "",
              name: product.name || "",
              currentPrice: product.currentPrice || "",
              discountPrice: product.discountPrice || "",
              description: product.description || "",
              promoCode: product.promoCode || "",
              status: product.status || "Active",
            });
          }
        } catch (err) {
          console.error("Failed to fetch product", err);
        }
      }
    };
    fetchProduct();
  }, [id, productFromState]);

  // Prefill from state if available
  useEffect(() => {
    if (productFromState) {
      setFormData({
        categoryId: productFromState.categoryId?._id || "",
        subcategoryId: productFromState.subcategoryId?._id || "",
        name: productFromState.name || "",
        currentPrice: productFromState.currentPrice || "",
        discountPrice: productFromState.discountPrice || "",
        description: productFromState.description || "",
        promoCode: productFromState.promoCode || "",
        status: productFromState.status || "Active",
      });
    }
  }, [productFromState]);

  // Filter subcategories based on selected category safely
  useEffect(() => {
    if (formData.categoryId) {
      const filtered = subcategories.filter(
        (sub) => sub.categoryId && sub.categoryId._id === formData.categoryId
      );
      setFilteredSubcategories(filtered);
    } else {
      setFilteredSubcategories([]);
    }
  }, [formData.categoryId, subcategories]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      for (let key in formData) data.append(key, formData[key]);
      if (image) data.append("image", image);

      if (id || productFromState) {
        const productId = id || productFromState._id;
        await axios.put(`http://localhost:5000/api/products/${productId}`, data);
        setMessage("✅ Product updated successfully!");
      } else {
        await axios.post("http://localhost:5000/api/products", data);
        setMessage("✅ Product added successfully!");
        // reset form after adding
        setFormData({
          categoryId: "",
          subcategoryId: "",
          name: "",
          currentPrice: "",
          discountPrice: "",
          description: "",
          promoCode: "",
          status: "Active",
        });
        setImage(null);
      }

      setTimeout(() => navigate("/dashboard/products/list"), 1000);
    } catch (err) {
      console.error("Error saving product:", err);
      setMessage("❌ Something went wrong!");
    }
  };

  return (
    <div className="add-product-container">
      <h2>{id || productFromState ? "Edit Product" : "Add New Product"}</h2>
      {message && <div className="message">{message}</div>}

      <form className="product-form" onSubmit={handleSubmit}>
        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          required
        >
          <option value="">-- Select Category --</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>

        <select
          name="subcategoryId"
          value={formData.subcategoryId}
          onChange={handleChange}
          disabled={!formData.categoryId}
          required
        >
          <option value="">-- Select Subcategory --</option>
          {filteredSubcategories.map((sub) => (
            <option key={sub._id} value={sub._id}>{sub.name}</option>
          ))}
        </select>

        <input
          type="text"
          name="name"
          placeholder="Enter Product Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <div className="price-container">
          <input
            type="number"
            name="currentPrice"
            placeholder="Current Price"
            value={formData.currentPrice}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="discountPrice"
            placeholder="Discount Price"
            value={formData.discountPrice}
            onChange={handleChange}
          />
        </div>

        <select name="status" value={formData.status} onChange={handleChange} required>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <textarea
          name="description"
          placeholder="Enter Product Description"
          value={formData.description}
          onChange={handleChange}
        ></textarea>

        <input
          type="text"
          name="promoCode"
          placeholder="Promo Code (Optional)"
          value={formData.promoCode}
          onChange={handleChange}
        />

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button type="submit">{id || productFromState ? "Update Product" : "Add Product"}</button>
      </form>
    </div>
  );
}

export default AddProduct;

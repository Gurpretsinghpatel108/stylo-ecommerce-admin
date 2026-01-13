// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate, useLocation, useParams } from "react-router-dom";
// import "./AddProduct.css";

// function AddProduct() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { id } = useParams();
//   const productFromState = location.state?.product || null;

//   const [categories, setCategories] = useState([]);
//   const [subcategories, setSubcategories] = useState([]);
//   const [filteredSubcategories, setFilteredSubcategories] = useState([]);
//   const [formData, setFormData] = useState({
//     categoryId: "",
//     subcategoryId: "",
//     name: "",
//     currentPrice: "",
//     discountPrice: "",
//     description: "",
//     promoCode: "",
//     status: "Active",
//   });
//   const [image, setImage] = useState(null);
//   const [message, setMessage] = useState("");

//   // Fetch categories & subcategories safely
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const catRes = await axios.get("http://localhost:5000/api/categories");
//         setCategories(catRes.data.data || []); // <- safe fallback

//         const subRes = await axios.get("http://localhost:5000/api/subcategories");
//         setSubcategories(subRes.data.data || []); // <- safe fallback
//       } catch (err) {
//         console.error("Error fetching categories/subcategories:", err);
//         setCategories([]);
//         setSubcategories([]);
//       }
//     };
//     fetchData();
//   }, []);

//   // Prefill product form from URL param if state not available
//   useEffect(() => {
//     const fetchProduct = async () => {
//       if (!productFromState && id) {
//         try {
//           const res = await axios.get(`http://localhost:5000/api/products/${id}`);
//           const product = res.data.data; // <- backend structure
//           if (product) {
//             setFormData({
//               categoryId: product.categoryId?._id || "",
//               subcategoryId: product.subcategoryId?._id || "",
//               name: product.name || "",
//               currentPrice: product.currentPrice || "",
//               discountPrice: product.discountPrice || "",
//               description: product.description || "",
//               promoCode: product.promoCode || "",
//               status: product.status || "Active",
//             });
//           }
//         } catch (err) {
//           console.error("Failed to fetch product", err);
//         }
//       }
//     };
//     fetchProduct();
//   }, [id, productFromState]);

//   // Prefill from state if available
//   useEffect(() => {
//     if (productFromState) {
//       setFormData({
//         categoryId: productFromState.categoryId?._id || "",
//         subcategoryId: productFromState.subcategoryId?._id || "",
//         name: productFromState.name || "",
//         currentPrice: productFromState.currentPrice || "",
//         discountPrice: productFromState.discountPrice || "",
//         description: productFromState.description || "",
//         promoCode: productFromState.promoCode || "",
//         status: productFromState.status || "Active",
//       });
//     }
//   }, [productFromState]);

//   // Filter subcategories based on selected category safely
//   useEffect(() => {
//     if (formData.categoryId) {
//       const filtered = subcategories.filter(
//         (sub) => sub.categoryId && sub.categoryId._id === formData.categoryId
//       );
//       setFilteredSubcategories(filtered);
//     } else {
//       setFilteredSubcategories([]);
//     }
//   }, [formData.categoryId, subcategories]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const data = new FormData();
//       for (let key in formData) data.append(key, formData[key]);
//       if (image) data.append("image", image);

//       if (id || productFromState) {
//         const productId = id || productFromState._id;
//         await axios.put(`http://localhost:5000/api/products/${productId}`, data);
//         setMessage("✅ Product updated successfully!");
//       } else {
//         await axios.post("http://localhost:5000/api/products", data);
//         setMessage("✅ Product added successfully!");
//         // reset form after adding
//         setFormData({
//           categoryId: "",
//           subcategoryId: "",
//           name: "",
//           currentPrice: "",
//           discountPrice: "",
//           description: "",
//           promoCode: "",
//           status: "Active",
//         });
//         setImage(null);
//       }

//       setTimeout(() => navigate("/dashboard/products/list"), 1000);
//     } catch (err) {
//       console.error("Error saving product:", err);
//       setMessage("❌ Something went wrong!");
//     }
//   };

//   return (
//     <div className="add-product-container">
//       <h2>{id || productFromState ? "Edit Product" : "Add New Product"}</h2>
//       {message && <div className="message">{message}</div>}

//       <form className="product-form" onSubmit={handleSubmit}>
//         <select
//           name="categoryId"
//           value={formData.categoryId}
//           onChange={handleChange}
//           required
//         >
//           <option value="">-- Select Category --</option>
//           {categories.map((cat) => (
//             <option key={cat._id} value={cat._id}>{cat.name}</option>
//           ))}
//         </select>

//         <select
//           name="subcategoryId"
//           value={formData.subcategoryId}
//           onChange={handleChange}
//           disabled={!formData.categoryId}
//           required
//         >
//           <option value="">-- Select Subcategory --</option>
//           {filteredSubcategories.map((sub) => (
//             <option key={sub._id} value={sub._id}>{sub.name}</option>
//           ))}
//         </select>

//         <input
//           type="text"
//           name="name"
//           placeholder="Enter Product Name"
//           value={formData.name}
//           onChange={handleChange}
//           required
//         />

//         <div className="price-container">
//           <input
//             type="number"
//             name="currentPrice"
//             placeholder="Current Price"
//             value={formData.currentPrice}
//             onChange={handleChange}
//             required
//           />
//           <input
//             type="number"
//             name="discountPrice"
//             placeholder="Discount Price"
//             value={formData.discountPrice}
//             onChange={handleChange}
//           />
//         </div>

//         <select name="status" value={formData.status} onChange={handleChange} required>
//           <option value="Active">Active</option>
//           <option value="Inactive">Inactive</option>
//         </select>

//         <textarea
//           name="description"
//           placeholder="Enter Product Description"
//           value={formData.description}
//           onChange={handleChange}
//         ></textarea>

//         <input
//           type="text"
//           name="promoCode"
//           placeholder="Promo Code (Optional)"
//           value={formData.promoCode}
//           onChange={handleChange}
//         />

//         <input
//           type="file"
//           name="image"
//           accept="image/*"
//           onChange={(e) => setImage(e.target.files[0])}
//         />

//         <button type="submit">{id || productFromState ? "Update Product" : "Add Product"}</button>
//       </form>
//     </div>
//   );
// }

// export default AddProduct;









// src/components/AddProduct.jsx
import React, { useState, useEffect } from "react";
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
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Production-ready API base
  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

  // Placeholder images (yeh define kar diya - error yahin se aa raha tha!)
  const PlaceholderImg = "https://placehold.co/100x100?text=No+Image&font=roboto";
  const errorFallback = "https://placehold.co/100x100?text=Error&font=roboto";

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
  }, []);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/categories`);
      setCategories(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      alert("Categories load nahi ho rahi bhai!");
      setCategories([]);
    }
  };

  // Fetch subcategories
  const fetchSubcategories = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/subcategories`);
      setSubcategories(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.error("Failed to fetch subcategories:", err);
      alert("Subcategories load nahi ho rahi!");
      setSubcategories([]);
    }
  };

  // Prefill form for edit mode
  useEffect(() => {
    const prefillProduct = async () => {
      let product = productFromState;
      if (!product && id) {
        try {
          setLoading(true);
          const res = await axios.get(`${API_BASE}/api/products/${id}`);
          product = res.data.data || res.data; // safe fallback
        } catch (err) {
          console.error("Failed to fetch product:", err);
          setMessage("❌ Product load nahi hua!");
        } finally {
          setLoading(false);
        }
      }

      if (product) {
        setFormData({
          categoryId: product.categoryId?._id || product.categoryId || "",
          subcategoryId: product.subcategoryId?._id || product.subcategoryId || "",
          name: product.name || "",
          currentPrice: product.currentPrice || "",
          discountPrice: product.discountPrice || "",
          description: product.description || "",
          promoCode: product.promoCode || "",
          status: product.status || "Active",
        });

        if (product.image) {
          setImagePreview(`${API_BASE}/uploads/${product.image}`);
        }
      }
    };

    prefillProduct();
  }, [id, productFromState]);

  // Filter subcategories when category changes (yeh fix kiya - dropdown khulega ab)
  useEffect(() => {
    if (formData.categoryId) {
      const filtered = subcategories.filter((sub) => {
        const subCatId = sub.categoryId?._id || sub.categoryId; // populated ya string
        return subCatId && subCatId.toString() === formData.categoryId.toString();
      });
      setFilteredSubcategories(filtered);

      // Reset subcategory if not in filtered list
      if (!filtered.some(s => (s._id || s).toString() === formData.subcategoryId.toString())) {
        setFormData(prev => ({ ...prev, subcategoryId: "" }));
      }
    } else {
      setFilteredSubcategories([]);
      setFormData(prev => ({ ...prev, subcategoryId: "" }));
    }
  }, [formData.categoryId, subcategories]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImage(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.categoryId || !formData.subcategoryId) {
      alert("Product name, category aur subcategory select kar bhai!");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const data = new FormData();
      for (let key in formData) {
        data.append(key, formData[key]);
      }
      if (image) data.append("image", image);

      if (id || productFromState) {
        const productId = id || productFromState._id;
        await axios.put(`${API_BASE}/api/products/${productId}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMessage("✅ Product updated successfully!");
      } else {
        await axios.post(`${API_BASE}/api/products`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMessage("✅ Product added successfully!");
        // Reset form
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
        setImagePreview(null);
      }

      setTimeout(() => navigate("/dashboard/products/list"), 1500);
    } catch (err) {
      console.error("Error saving product:", err);
      setMessage("❌ Failed! " + (err.response?.data?.message || err.message || "Network error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-container">
      <h2>{id || productFromState ? "Edit Product" : "Add New Product"}</h2>

      {message && (
        <div className={`message ${message.includes("✅") ? "success" : "error"}`}>
          {message}
        </div>
      )}

      {loading && <div className="loading">Saving product...</div>}

      <form className="product-form" onSubmit={handleSubmit}>
        <select name="categoryId" value={formData.categoryId} onChange={handleChange} required>
          <option value="">-- Select Category --</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>

        <select
          name="subcategoryId"
          value={formData.subcategoryId}
          onChange={handleChange}
          disabled={!formData.categoryId || filteredSubcategories.length === 0}
          required
        >
          <option value="">-- Select Subcategory --</option>
          {filteredSubcategories.map(sub => (
            <option key={sub._id} value={sub._id}>{sub.name}</option>
          ))}
        </select>

        <input
          type="text"
          name="name"
          placeholder="Product Name"
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
            min="0"
            step="0.01"
          />
          <input
            type="number"
            name="discountPrice"
            placeholder="Discount Price"
            value={formData.discountPrice}
            onChange={handleChange}
            min="0"
            step="0.01"
          />
        </div>

        <textarea
          name="description"
          placeholder="Product Description"
          value={formData.description}
          onChange={handleChange}
        />

        <input
          type="text"
          name="promoCode"
          placeholder="Promo Code (Optional)"
          value={formData.promoCode}
          onChange={handleChange}
        />

        <select name="status" value={formData.status} onChange={handleChange} required>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        {/* Image Preview */}
        <div className="image-preview">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Preview"
              style={{ width: "150px", height: "150px", objectFit: "cover", borderRadius: "8px" }}
              onError={(e) => {
                e.target.src = errorFallback;
                e.target.alt = "Preview failed";
              }}
            />
          ) : (
            <p>No image selected</p>
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : (id || productFromState ? "Update Product" : "Add Product")}
        </button>
      </form>
    </div>
  );
}

export default AddProduct;
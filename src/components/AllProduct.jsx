



// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { FaEdit, FaTrash } from "react-icons/fa";
// import "./AllProduct.css";

// function AllProduct() {
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const navigate = useNavigate();

//   // ✅ Fetch all products once
//   const fetchProducts = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/products");
//       const allData = res.data.data || [];
//       setProducts(allData);
//       setFilteredProducts(allData); // by default show all
//     } catch (err) {
//       console.error("Failed to fetch products", err);
//       setProducts([]);
//       setFilteredProducts([]);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   // ✅ Handle Filter button click
//   const handleFilter = (filter) => {
//     setSelectedCategory(filter);

//     if (filter === "All") {
//       setFilteredProducts(products);
//     } else {
//       const filtered = products.filter((p) => {
//         const cat = p.categoryId?.name?.toLowerCase() || "";
//         const sub = p.subcategoryId?.name?.toLowerCase() || "";

//         // ✅ Match by category/subcategory keywords
//         if (filter === "Rings") return cat.includes("Rings");
//         if (filter === "Earrings") return cat.includes("Earrings");
//         if (filter === "Pendants") return sub.includes("Pendants");
//         if (filter === "Bracelets") return sub.includes("Bracelets");
//         if (filter === "Anklets") return sub.includes("Anklets");
//         if (filter === "Mangalsutras") return sub.includes("Mangalsutras");
//         if (filter === "Nosepins") return sub.includes("Nosepins");
//         if (filter === "Chain") return sub.includes("Chain");

//         return false;
//       });

//       setFilteredProducts(filtered);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this product?")) return;
//     try {
//       await axios.delete(`http://localhost:5000/api/products/${id}`);
//       const updated = products.filter((prod) => prod._id !== id);
//       setProducts(updated);
//       setFilteredProducts(updated);
//     } catch (err) {
//       console.error("Failed to delete product", err);
//       alert("❌ Something went wrong!");
//     }
//   };

//   const handleEdit = (product) => {
//     navigate(`/dashboard/products/product/${product._id}`, { state: { product } });
//   };

//   return (
//     <div className="all-product-container">
//       <h2>All Products</h2>

//       {/* ✅ Filter Buttons */}
//       <div className="filter-buttons" style={{ marginBottom: "15px" }}>
//         {[
//           "All",
//           "Rings",
//           "Earrings",
//           "Pendants",
//           "Bracelets",
//           "Anklets",
//           "Mangalsutras",
//           "Nosepins",
//           "Chains",
//         ].map((cat) => (
//           <button
//             key={cat}
//             onClick={() => handleFilter(cat)}
//             style={{
//               marginRight: "8px",
//               padding: "8px 14px",
//               borderRadius: "8px",
//               border: "none",
//               cursor: "pointer",
//               backgroundColor: selectedCategory === cat ? "#003580" : "#ddd",
//               color: selectedCategory === cat ? "white" : "black",
//             }}
//           >
//             {cat}
//           </button>
//         ))}
//       </div>

//       {filteredProducts.length === 0 ? (
//         <p style={{ textAlign: "center", color: "#777" }}>No products found</p>
//       ) : (
//         <div className="table-container">
//           <table className="product-table">
//             <thead>
//               <tr>
//                 <th>Image</th>
//                 <th>Name</th>
//                 <th>Category</th>
//                 <th>Subcategory</th>
//                 <th>Price</th>
//                 <th>Discount</th>
//                 <th>Status</th>
//                 <th>Promo</th>
//                 <th>Description</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredProducts.map((prod) => (
//                 <tr key={prod._id}>
//                   <td>
//                     {prod.image ? (
//                       <img
//                         src={`http://localhost:5000/uploads/${prod.image}`}
//                         alt={prod.name}
//                         className="product-thumb"
//                       />
//                     ) : (
//                       <img
//                         src="/placeholder.png"
//                         alt="No Image"
//                         className="product-thumb"
//                       />
//                     )}
//                   </td>
//                   <td>{prod.name}</td>
//                   <td>{prod.categoryId?.name || "N/A"}</td>
//                   <td>{prod.subcategoryId?.name || "N/A"}</td>
//                   <td>₹{prod.currentPrice}</td>
//                   <td>
//                     {prod.discountPrice > 0 ? `₹${prod.discountPrice}` : "-"}
//                   </td>
//                   <td>{prod.status}</td>
//                   <td>{prod.promoCode || "-"}</td>
//                   <td>{prod.description}</td>
//                   <td>
//                     <FaEdit
//                       style={{
//                         cursor: "pointer",
//                         marginRight: "10px",
//                         color: "#003580",
//                       }}
//                       onClick={() => handleEdit(prod)}
//                     />
//                     <FaTrash
//                       style={{ cursor: "pointer", color: "red" }}
//                       onClick={() => handleDelete(prod._id)}
//                     />
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }

// export default AllProduct;











// src/components/AllProduct.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./AllProduct.css";

function AllProduct() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Production-ready API base
  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

  // Placeholder images (consistent)
  const placeholderImg = "https://placehold.co/100x100?text=No+Image&font=roboto";
  const errorFallback = "https://placehold.co/100x100?text=Error&font=roboto";

  // Fetch all products
  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${API_BASE}/api/products`);
      const allData = res.data.data || [];
      setProducts(allData);
      setFilteredProducts(allData); // Default show all
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError("Products load nahi ho rahe bhai! Check backend.");
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle filter button click
  const handleFilter = (filter) => {
    setSelectedCategory(filter);

    if (filter === "All") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((p) => {
        const catName = p.categoryId?.name?.toLowerCase() || "";
        const subName = p.subcategoryId?.name?.toLowerCase() || "";

        // Match by keywords (case-insensitive)
        return (
          catName.includes(filter.toLowerCase()) ||
          subName.includes(filter.toLowerCase())
        );
      });
      setFilteredProducts(filtered);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Pakka delete karna hai is product ko?")) return;

    try {
      await axios.delete(`${API_BASE}/api/products/${id}`);
      const updated = products.filter((prod) => prod._id !== id);
      setProducts(updated);
      setFilteredProducts(updated);
      alert("Product delete ho gaya!");
    } catch (err) {
      console.error("Failed to delete product:", err);
      alert("Delete nahi hua! Check backend logs.");
    }
  };

  const handleEdit = (product) => {
    navigate(`/dashboard/products/product/${product._id}`, { state: { product } });
  };

  return (
    <div className="all-product-container">
      <h2>All Products</h2>

      {/* Filter Buttons */}
      <div className="filter-buttons">
        {[
          "All",
          "Rings",
          "Earrings",
          "Pendants",
          "Bracelets",
          "Anklets",
          "Mangalsutras",
          "Nosepins",
          "Chains",
        ].map((cat) => (
          <button
            key={cat}
            onClick={() => handleFilter(cat)}
            className={selectedCategory === cat ? "active-filter" : ""}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading">Loading products...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : filteredProducts.length === 0 ? (
        <p className="no-data">No products found</p>
      ) : (
        <div className="table-container">
          <table className="product-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Subcategory</th>
                <th>Price</th>
                <th>Discount</th>
                <th>Status</th>
                <th>Promo</th>
                <th>Description</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((prod) => (
                <tr key={prod._id}>
                  <td>
                    <img
                      src={prod.image ? `${API_BASE}/uploads/${prod.image}` : placeholderImg}
                      alt={prod.name}
                      className="product-thumb"
                      onError={(e) => {
                        e.target.src = errorFallback;
                        e.target.alt = "Image failed";
                      }}
                    />
                  </td>
                  <td>{prod.name}</td>
                  <td>{prod.categoryId?.name || "N/A"}</td>
                  <td>{prod.subcategoryId?.name || "N/A"}</td>
                  <td>₹{prod.currentPrice}</td>
                  <td>
                    {prod.discountPrice > 0 ? `₹${prod.discountPrice}` : "-"}
                  </td>
                  <td>
                    <span className={prod.status === "Active" ? "status-active" : "status-inactive"}>
                      {prod.status}
                    </span>
                  </td>
                  <td>{prod.promoCode || "-"}</td>
                  <td>{prod.description?.substring(0, 50) || "N/A"}...</td>
                  <td>
                    <FaEdit
                      className="action-icon edit"
                      onClick={() => handleEdit(prod)}
                    />
                    <FaTrash
                      className="action-icon delete"
                      onClick={() => handleDelete(prod._id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AllProduct;
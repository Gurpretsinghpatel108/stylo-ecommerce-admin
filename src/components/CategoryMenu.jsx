


// // src/components/CategoryMenu.jsx
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./CategoryMenu.css";

// function CategoryMenu() {
//   const [categories, setCategories] = useState([]);
//   const [showAddBox, setShowAddBox] = useState(false);
//   const [newCategory, setNewCategory] = useState("");
//   const [newStatus, setNewStatus] = useState("Active");
//   const [newImage, setNewImage] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [editId, setEditId] = useState(null);

//   // API base URL (Vite env se production/local handle)
//   const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   // Fetch all categories
//   const fetchCategories = async () => {
//     try {
//       const res = await axios.get(`${API_BASE}/api/categories`);
//       setCategories(Array.isArray(res.data.data) ? res.data.data : []);
//     } catch (err) {
//       console.error("Failed to fetch categories:", err);
//       alert("Categories load nahi ho rahi: " + (err.response?.data?.message || err.message || "Network error"));
//       setCategories([]);
//     }
//   };

//   // Add or Update Category
//   const handleAddOrUpdateCategory = async () => {
//     if (!newCategory.trim()) {
//       alert("Category name daal bhai");
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append("name", newCategory);
//       formData.append("status", newStatus);
//       if (newImage) formData.append("image", newImage);

//       if (editId) {
//         // UPDATE
//         await axios.put(
//           `${API_BASE}/api/categories/${editId}`,
//           formData,
//           { headers: { "Content-Type": "multipart/form-data" } }
//         );
//         alert("Category updated successfully!");
//       } else {
//         // ADD
//         await axios.post(
//           `${API_BASE}/api/categories`,
//           formData,
//           { headers: { "Content-Type": "multipart/form-data" } }
//         );
//         alert("Category added successfully!");
//       }

//       resetForm();
//       fetchCategories();
//     } catch (err) {
//       console.error("Error saving category:", err);
//       alert("Category save nahi hui: " + (err.response?.data?.message || err.message || "Network error"));
//     }
//   };

//   // Edit Category
//   const handleEdit = (cat) => {
//     setNewCategory(cat.name || "");
//     setNewStatus(cat.status || "Active");
//     setEditId(cat._id);
//     setShowAddBox(true);
//   };

//   // Delete Category (improved with logs & checks)
//   const handleDelete = async (id) => {
//     console.log("Attempting to delete category ID:", id); // ← Debug: ID check karo

//     if (!id) {
//       alert("Category ID missing hai bhai! Check console.");
//       return;
//     }

//     if (!window.confirm("Pakka delete karna hai is category ko?")) return;

//     try {
//       const response = await axios.delete(`${API_BASE}/api/categories/${id}`);
//       console.log("Delete success response:", response); // ← Success debug
//       alert("Category delete ho gayi!");
//       fetchCategories();
//     } catch (err) {
//       console.error("Full delete error:", err.response || err); // ← Detailed error
//       alert(
//         "Delete nahi hui: " +
//           (err.response?.data?.message ||
//             err.message ||
//             "Unknown error - check console & backend logs")
//       );
//     }
//   };

//   // Reset form
//   const resetForm = () => {
//     setNewCategory("");
//     setNewStatus("Active");
//     setNewImage(null);
//     setEditId(null);
//     setShowAddBox(false);
//   };

//   const filteredCategories = categories.filter(
//     (cat) => cat.name && cat.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Modern placeholder (placehold.co - working in 2026)
//   const placeholderImg = "https://placehold.co/100x100?text=No+Image&font=roboto";
//   const errorFallback = "https://placehold.co/100x100?text=Error&font=roboto";

//   return (
//     <div className="category-menu">
//       <h2>Category Management</h2>

//       <div className="top-row">
//         <input
//           type="text"
//           placeholder="Search category..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="search-input"
//         />
//         <button className="show-add-btn" onClick={() => setShowAddBox(true)}>
//           + Add New
//         </button>
//       </div>

//       {showAddBox && (
//         <div className="overlay">
//           <div className="overlay-box">
//             <h3>{editId ? "Edit Category" : "Add New Category"}</h3>
//             <input
//               type="text"
//               placeholder="Enter category name"
//               value={newCategory}
//               onChange={(e) => setNewCategory(e.target.value)}
//             />
//             <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
//               <option value="Active">Active</option>
//               <option value="Inactive">Inactive</option>
//             </select>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={(e) => setNewImage(e.target.files?.[0] || null)}
//             />
//             <div className="overlay-actions">
//               <button className="save-btn" onClick={handleAddOrUpdateCategory}>
//                 {editId ? "Update" : "Add"}
//               </button>
//               <button className="cancel-btn" onClick={resetForm}>Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {filteredCategories.length > 0 ? (
//         <table className="category-table">
//           <thead>
//             <tr>
//               <th>S.No</th>
//               <th>Image</th>
//               <th>Name</th>
//               <th>Status</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredCategories.map((cat, index) => (
//               <tr key={cat._id}>
//                 <td>{index + 1}</td>
//                 <td>
//                   <img
//                     // src={cat.image ? `${API_BASE}/uploads/${cat.image}` : placeholderImg}
//                     src={cat.image || placeholderImg}
//                     alt={cat.name || "Category image"}
//                     className="cat-image"
//                     width={100}
//                     height={100}
//                     onError={(e) => {
//                       e.target.src = errorFallback;
//                       e.target.alt = "Image load failed";
//                     }}
//                   />
//                 </td>
//                 <td>{cat.name}</td>
//                 <td>
//                   <span className={cat.status === "Active" ? "active" : "inactive"}>
//                     {cat.status}
//                   </span>
//                 </td>
//                 <td>
//                   <button className="edit-btn" onClick={() => handleEdit(cat)}>Edit</button>
//                   <button className="delete-btn" onClick={() => handleDelete(cat._id)}>Delete</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       ) : (
//         <p style={{ textAlign: "center", color: "#777" }}>No categories found</p>
//       )}
//     </div>
//   );
// }

// export default CategoryMenu;









// src/components/CategoryMenu.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CategoryMenu.css";

function CategoryMenu() {
  const [categories, setCategories] = useState([]);
  const [showAddBox, setShowAddBox] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newStatus, setNewStatus] = useState("Active");
  const [newImage, setNewImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editId, setEditId] = useState(null);

  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/categories`);
      setCategories(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      alert("Categories load nahi ho rahi: " + (err.response?.data?.message || err.message || "Network error"));
      setCategories([]);
    }
  };

  const handleAddOrUpdateCategory = async () => {
    if (!newCategory.trim()) {
      alert("Category name daal bhai");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", newCategory);
      formData.append("status", newStatus);
      if (newImage) formData.append("image", newImage);

      let response;
      if (editId) {
        response = await axios.put(
          `${API_BASE}/api/categories/${editId}`,
          formData
        );
        alert("Category updated successfully!");
      } else {
        response = await axios.post(
          `${API_BASE}/api/categories`,
          formData
        );
        alert("Category added successfully!");

        // Nayi category ko list ke END mein append kar (line by line add hoga)
        const newCat = response.data.data || response.data; // backend se returned category
        setCategories(prev => [...prev, newCat]);  // ← Yeh line add ki - end mein add
      }

      resetForm();
      // fetchCategories(); // ← Comment kar diya taaki append order maintain rahe
    } catch (err) {
      console.error("FULL ERROR DETAILS:", err);
      if (err.response) {
        alert("Server error: " + (err.response.data.message || "Unknown server error"));
      } else if (err.request) {
        alert("Network/CORS issue – backend check kar bhai!");
      } else {
        alert("Axios error: " + err.message);
      }
    }
  };

  const handleEdit = (cat) => {
    setNewCategory(cat.name || "");
    setNewStatus(cat.status || "Active");
    setEditId(cat._id);
    setShowAddBox(true);
  };

  const handleDelete = async (id) => {
    console.log("Attempting to delete category ID:", id);

    if (!id) {
      alert("Category ID missing hai bhai! Check console.");
      return;
    }

    if (!window.confirm("Pakka delete karna hai is category ko?")) return;

    try {
      await axios.delete(`${API_BASE}/api/categories/${id}`);
      alert("Category delete ho gayi!");
      fetchCategories(); // Delete ke baad full refresh (order maintain rahega)
    } catch (err) {
      console.error("Full delete error:", err.response || err);
      alert("Delete nahi hui: " + (err.response?.data?.message || err.message || "Unknown error"));
    }
  };

  const resetForm = () => {
    setNewCategory("");
    setNewStatus("Active");
    setNewImage(null);
    setEditId(null);
    setShowAddBox(false);
  };

  // Filter only (no sort – original order maintain rahega)
  const filteredCategories = categories.filter(
    (cat) => cat.name && cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const placeholderImg = "https://placehold.co/100x100?text=No+Image&font=roboto";
  const errorFallback = "https://placehold.co/100x100?text=Error&font=roboto";

  return (
    <div className="category-menu">
      <h2>Category Management</h2>

      <div className="top-row">
        <input
          type="text"
          placeholder="Search category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button className="show-add-btn" onClick={() => setShowAddBox(true)}>
          + Add New
        </button>
      </div>

      {showAddBox && (
        <div className="overlay">
          <div className="overlay-box">
            <h3>{editId ? "Edit Category" : "Add New Category"}</h3>
            <input
              type="text"
              placeholder="Enter category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNewImage(e.target.files?.[0] || null)}
            />
            <div className="overlay-actions">
              <button className="save-btn" onClick={handleAddOrUpdateCategory}>
                {editId ? "Update" : "Add"}
              </button>
              <button className="cancel-btn" onClick={resetForm}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {filteredCategories.length > 0 ? (
        <div className="table-wrapper">
          <table className="category-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Image</th>
                <th>Name</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((cat, index) => (
                <tr key={cat._id}>
                  <td>{index + 1}</td>
                  <td>
                    <img
                      src={cat.image || placeholderImg}
                      alt={cat.name || "Category image"}
                      className="cat-image"
                      width={100}
                      height={100}
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = errorFallback;
                        e.target.alt = "Image load failed";
                      }}
                    />
                  </td>
                  <td>{cat.name}</td>
                  <td>
                    <span className={cat.status === "Active" ? "active" : "inactive"}>
                      {cat.status}
                    </span>
                  </td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(cat)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(cat._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p style={{ textAlign: "center", color: "#777" }}>No categories found</p>
      )}
    </div>
  );
}

export default CategoryMenu;
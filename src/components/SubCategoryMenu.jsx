


// // src/components/SubcategoryMenu.jsx
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./SubCategoryMenu.css";

// function SubcategoryMenu() {
//   const [categories, setCategories] = useState([]);
//   const [subcategories, setSubcategories] = useState([]);
//   const [showAddBox, setShowAddBox] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [newSubcategory, setNewSubcategory] = useState("");
//   const [newImage, setNewImage] = useState(null);
//   const [newStatus, setNewStatus] = useState("Active");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [editId, setEditId] = useState(null);

//   useEffect(() => {
//     fetchCategories();
//     fetchSubcategories();
//   }, []);

//   // Fetch all categories
//   const fetchCategories = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/categories");
//       setCategories(Array.isArray(res.data.data) ? res.data.data : []);
//     } catch (err) {
//       console.error("Failed to fetch categories:", err);
//       setCategories([]);
//     }
//   };

//   // Fetch all subcategories
//   const fetchSubcategories = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/subcategories");
//       setSubcategories(Array.isArray(res.data.data) ? res.data.data : []);
//     } catch (err) {
//       console.error("Failed to fetch subcategories:", err);
//       setSubcategories([]);
//     }
//   };

//   // Add or Update Subcategory
//   const handleAddOrUpdateSubcategory = async () => {
//     if (!newSubcategory.trim() || !selectedCategory) {
//       alert("Subcategory name and category are required");
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append("name", newSubcategory);
//       formData.append("categoryId", selectedCategory);
//       formData.append("status", newStatus);
//       if (newImage) formData.append("image", newImage);

//       if (editId) {
//         // UPDATE
//         await axios.put(
//           `http://localhost:5000/api/subcategories/${editId}`,
//           formData,
//           { headers: { "Content-Type": "multipart/form-data" } }
//         );
//       } else {
//         // ADD
//         await axios.post(
//           "http://localhost:5000/api/subcategories",
//           formData,
//           { headers: { "Content-Type": "multipart/form-data" } }
//         );
//       }

//       resetForm();
//       fetchSubcategories();
//     } catch (err) {
//       console.error("Error saving subcategory:", err);
//       alert("Failed to save subcategory");
//     }
//   };

//   // Edit
//   const handleEdit = (sub) => {
//     setNewSubcategory(sub.name || "");
//     // Handle both object and string categoryId
//     setSelectedCategory(sub.categoryId?._id || sub.categoryId || "");
//     setNewStatus(sub.status || "Active");
//     setEditId(sub._id);
//     setShowAddBox(true);
//   };

//   // Delete
//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this subcategory?")) return;
//     try {
//       await axios.delete(`http://localhost:5000/api/subcategories/${id}`);
//       fetchSubcategories();
//     } catch (err) {
//       console.error("Failed to delete subcategory:", err);
//       alert("Failed to delete subcategory");
//     }
//   };

//   // Reset form
//   const resetForm = () => {
//     setNewSubcategory("");
//     setSelectedCategory("");
//     setNewStatus("Active");
//     setNewImage(null);
//     setEditId(null);
//     setShowAddBox(false);
//   };

//   // Filter subcategories to avoid invalid categoryId
//   const validSubcategories = subcategories.filter(sub =>
//     categories.some(cat => cat._id === (sub.categoryId?._id || sub.categoryId))
//   );

//   const filteredSubcategories = validSubcategories.filter(sub =>
//     sub.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="subcategory-menu">
//       <h2>Subcategory Management</h2>

//       {/* Top Row */}
//       <div className="top-row">
//         <input
//           type="text"
//           placeholder="Search subcategory..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="search-input"
//         />
//         <button className="show-add-btn" onClick={() => setShowAddBox(true)}>
//           + Add New
//         </button>
//       </div>

//       {/* Add/Edit Overlay */}
//       {showAddBox && (
//         <div className="overlay">
//           <div className="overlay-box">
//             <h3>{editId ? "Edit Subcategory" : "Add New Subcategory"}</h3>
            
//             <select
//               value={selectedCategory}
//               onChange={(e) => setSelectedCategory(e.target.value)}
//             >
//               <option value="">Select Category</option>
//               {categories.map(cat => (
//                 <option key={cat._id} value={cat._id}>
//                   {cat.name}
//                 </option>
//               ))}
//             </select>

//             <input
//               type="text"
//               placeholder="Enter subcategory"
//               value={newSubcategory}
//               onChange={(e) => setNewSubcategory(e.target.value)}
//             />

//             <select
//               value={newStatus}
//               onChange={(e) => setNewStatus(e.target.value)}
//             >
//               <option value="Active">Active</option>
//               <option value="Inactive">Inactive</option>
//             </select>

//             <input
//               type="file"
//               accept="image/*"
//               onChange={(e) => setNewImage(e.target.files[0])}
//             />

//             <div className="overlay-actions">
//               <button className="save-btn" onClick={handleAddOrUpdateSubcategory}>
//                 {editId ? "Update" : "Add"}
//               </button>
//               <button className="cancel-btn" onClick={resetForm}>Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Subcategory Table */}
//       {filteredSubcategories.length > 0 ? (
//         <table className="category-table">
//           <thead>
//             <tr>
//               <th>S.No</th>
//               <th>Image</th>
//               <th>Subcategory</th>
//               <th>Category</th>
//               <th>Status</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredSubcategories.map((sub, index) => {
//               const cat = categories.find(c => c._id === (sub.categoryId?._id || sub.categoryId));
//               return (
//                 <tr key={sub._id}>
//                   <td>{index + 1}</td>
//                   <td>
//                     {sub.image ? (
//                       <img
//                         src={`http://localhost:5000/uploads/${sub.image}`}
//                         alt={sub.name}
//                         className="cat-image"
//                       />
//                     ) : "-"}
//                   </td>
//                   <td>{sub.name}</td>
//                   <td>{cat ? cat.name : "N/A"}</td>
//                   <td>
//                     <span className={sub.status === "Active" ? "active" : "inactive"}>
//                       {sub.status}
//                     </span>
//                   </td>
//                   <td>
//                     <button className="edit-btn" onClick={() => handleEdit(sub)}>Edit</button>
//                     <button className="delete-btn" onClick={() => handleDelete(sub._id)}>Delete</button>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       ) : (
//         <p style={{ textAlign: "center", color: "#777" }}>No subcategories found</p>
//       )}
//     </div>
//   );
// }

// export default SubcategoryMenu;











// src/components/SubcategoryMenu.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SubCategoryMenu.css";

function SubcategoryMenu() {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [showAddBox, setShowAddBox] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newSubcategory, setNewSubcategory] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [newStatus, setNewStatus] = useState("Active");
  const [searchTerm, setSearchTerm] = useState("");
  const [editId, setEditId] = useState(null);

  // API base URL (Vite env se – production mein Railway URL automatic chalega)
  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

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

  // Add / Update Subcategory
  const handleAddOrUpdateSubcategory = async () => {
    if (!newSubcategory.trim() || !selectedCategory) {
      alert("Subcategory name aur category select kar bhai!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", newSubcategory);
      formData.append("categoryId", selectedCategory);
      formData.append("status", newStatus);
      if (newImage) formData.append("image", newImage);

      if (editId) {
        await axios.put(
          `${API_BASE}/api/subcategories/${editId}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        alert("Subcategory updated ho gayi!");
      } else {
        await axios.post(
          `${API_BASE}/api/subcategories`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        alert("Subcategory add ho gayi!");
      }

      resetForm();
      fetchSubcategories();
      fetchCategories(); // Category dropdown refresh
    } catch (err) {
      console.error("Error saving subcategory:", err);
      alert("Subcategory save nahi hui: " + (err.response?.data?.message || err.message));
    }
  };

  // Edit
  const handleEdit = (sub) => {
    setNewSubcategory(sub.name || "");
    setSelectedCategory(sub.categoryId?._id || sub.categoryId || "");
    setNewStatus(sub.status || "Active");
    setEditId(sub._id);
    setShowAddBox(true);
  };

  // Delete with debug
  const handleDelete = async (id) => {
    console.log("Deleting subcategory ID:", id);
    if (!window.confirm("Pakka delete karna hai?")) return;

    try {
      await axios.delete(`${API_BASE}/api/subcategories/${id}`);
      alert("Subcategory delete ho gayi!");
      fetchSubcategories();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Delete nahi hui: " + (err.response?.data?.message || err.message));
    }
  };

  // Reset form
  const resetForm = () => {
    setNewSubcategory("");
    setSelectedCategory("");
    setNewStatus("Active");
    setNewImage(null);
    setEditId(null);
    setShowAddBox(false);
  };

  // Placeholder images
  const placeholderImg = "https://placehold.co/100x100?text=No+Image&font=roboto";
  const errorFallback = "https://placehold.co/100x100?text=Error&font=roboto";

  // Filtered subcategories
  const filteredSubcategories = subcategories.filter(sub =>
    sub.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="subcategory-menu">
      <h2>Subcategory Management</h2>

      <div className="top-row">
        <input
          type="text"
          placeholder="Search subcategory..."
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
            <h3>{editId ? "Edit Subcategory" : "Add New Subcategory"}</h3>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="" disabled>Select Category</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Enter subcategory name"
              value={newSubcategory}
              onChange={(e) => setNewSubcategory(e.target.value)}
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
              <button className="save-btn" onClick={handleAddOrUpdateSubcategory}>
                {editId ? "Update" : "Add"}
              </button>
              <button className="cancel-btn" onClick={resetForm}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {filteredSubcategories.length > 0 ? (
        <table className="category-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Image</th>
              <th>Subcategory</th>
              <th>Category</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubcategories.map((sub, index) => {
              const cat = categories.find(c => c._id === (sub.categoryId?._id || sub.categoryId));
              return (
                <tr key={sub._id}>
                  <td>{index + 1}</td>
                  <td>
                    <img
                      src={sub.image ? `${API_BASE}/uploads/${sub.image}` : placeholderImg}
                      alt={sub.name || "Subcategory"}
                      className="cat-image"
                      width={100}
                      height={100}
                      onError={(e) => {
                        e.target.src = errorFallback;
                        e.target.alt = "Image failed";
                      }}
                    />
                  </td>
                  <td>{sub.name}</td>
                  <td>{cat ? cat.name : "N/A (Category missing)"}</td>
                  <td>
                    <span className={sub.status === "Active" ? "active" : "inactive"}>
                      {sub.status}
                    </span>
                  </td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(sub)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(sub._id)}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p style={{ textAlign: "center", color: "#777" }}>No subcategories found</p>
      )}
    </div>
  );
}

export default SubcategoryMenu;
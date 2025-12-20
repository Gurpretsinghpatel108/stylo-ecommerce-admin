
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

  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/categories");
      setCategories(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      setCategories([]);
    }
  };

  // Add or Update Category
  const handleAddOrUpdateCategory = async () => {
    if (!newCategory.trim()) {
      alert("Category name is required");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", newCategory);
      formData.append("status", newStatus);
      if (newImage) formData.append("image", newImage);

      if (editId) {
        // UPDATE
        await axios.put(
          `http://localhost:5000/api/categories/${editId}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        // ADD
        await axios.post(
          "http://localhost:5000/api/categories",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }

      resetForm();
      fetchCategories();
    } catch (err) {
      console.error("Error saving category:", err);
      alert("Failed to save category");
    }
  };

  // Edit
  const handleEdit = (cat) => {
    setNewCategory(cat.name || "");
    setNewStatus(cat.status || "Active");
    setEditId(cat._id);
    setShowAddBox(true);
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/categories/${id}`);
      fetchCategories();
    } catch (err) {
      console.error("Error deleting category:", err);
      alert("Failed to delete category");
    }
  };

  // Reset form
  const resetForm = () => {
    setNewCategory("");
    setNewStatus("Active");
    setNewImage(null);
    setEditId(null);
    setShowAddBox(false);
  };

  const filteredCategories = categories.filter(
    (cat) => cat.name && cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              placeholder="Enter category"
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
              onChange={(e) => setNewImage(e.target.files[0])}
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
                  {cat.image ? (
                    <img
                      src={`http://localhost:5000/uploads/${cat.image}`}
                      alt={cat.name}
                      className="cat-image"
                    />
                  ) : "-"}
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
      ) : (
        <p style={{ textAlign: "center", color: "#777" }}>No categories found</p>
      )}
    </div>
  );
}

export default CategoryMenu;






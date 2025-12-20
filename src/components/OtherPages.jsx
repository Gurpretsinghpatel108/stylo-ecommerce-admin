// src/components/pages/OtherPages.jsx
import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./OtherPages.css";

function OtherPages() {
  const [pages, setPages] = useState([]);

  useEffect(() => {
    setPages([
      { id: 1, title: "About Us", header: "Showed", footer: "Showed" },
      { id: 2, title: "Privacy Policy", header: "Showed", footer: "Showed" },
      { id: 3, title: "Terms & Conditions", header: "Showed", footer: "Showed" },
    ]);
  }, []);

  const handleDropdownChange = (id, field, value) => {
    setPages(
      pages.map((page) =>
        page.id === id ? { ...page, [field]: value } : page
      )
    );
  };

  const handleEdit = (id) => {
    alert(`Edit page with id: ${id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure to delete this page?")) {
      setPages(pages.filter((page) => page.id !== id));
    }
  };

  const handleAddNewPage = () => {
    const newId = pages.length ? pages[pages.length - 1].id + 1 : 1;
    const newPage = {
      id: newId,
      title: "New Page",
      header: "Showed",
      footer: "Showed",
    };
    setPages([...pages, newPage]);
  };

  return (
    <div className="other-pages-container">
      <h2>Other Pages</h2>
      <button onClick={handleAddNewPage} className="add-new-btn">
        + Add New Page
      </button>

      <table>
        <thead>
          <tr>
            <th>Page Title</th>
            <th>Header</th>
            <th>Footer</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {pages.map((page) => (
            <tr key={page.id}>
              <td>{page.title}</td>
              <td>
                <select
                  value={page.header}
                  onChange={(e) =>
                    handleDropdownChange(page.id, "header", e.target.value)
                  }
                >
                  <option value="Showed">Showed</option>
                  <option value="Not Showed">Not Showed</option>
                </select>
              </td>
              <td>
                <select
                  value={page.footer}
                  onChange={(e) =>
                    handleDropdownChange(page.id, "footer", e.target.value)
                  }
                >
                  <option value="Showed">Showed</option>
                  <option value="Not Showed">Not Showed</option>
                </select>
              </td>
              <td>
                <button onClick={() => handleEdit(page.id)} className="edit-btn">
                  <FaEdit />
                </button>
                <button onClick={() => handleDelete(page.id)} className="delete-btn">
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OtherPages;

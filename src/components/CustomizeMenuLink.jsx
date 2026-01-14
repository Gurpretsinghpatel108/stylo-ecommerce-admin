// src/components/pages/CustomizeMenuLinks.jsx
import React, { useState } from "react";
import "./CustomizeMenuLink.css";

function CustomizeMenuLinks() {
  const [menus, setMenus] = useState([
    { id: 1, name: "Product", status: true },
    { id: 2, name: "Blog", status: true },
    { id: 3, name: "FAQ", status: true },
    { id: 4, name: "Contact Us", status: true },
  ]);

  const handleToggle = (id) => {
    setMenus(
      menus.map((menu) =>
        menu.id === id ? { ...menu, status: !menu.status } : menu
      )
    );
  };

  const handleSubmit = () => {
    console.log("Submitted Menus:", menus);
    alert("Menus submitted! Check console for details.");
  };

  return (
    <div className="custom-menu-container">
      <h2>Customize Menu Links</h2>

      <div className="menu-grid">
        {menus.map((menu) => (
          <div key={menu.id} className="menu-card">
            <span>{menu.name}</span>
            <button
              className={`toggle-btn ${menu.status ? "on" : "off"}`}
              onClick={() => handleToggle(menu.id)}
            >
              {menu.status ? "ON" : "OFF"}
            </button>
          </div>
        ))}
      </div>

      <button className="submit-btn" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
}

export default CustomizeMenuLinks;

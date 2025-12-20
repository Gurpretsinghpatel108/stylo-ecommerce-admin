// src/components/StateManagement.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  // ✅ Import navigate
import "bootstrap/dist/css/bootstrap.min.css";

const initialStateData = [
  { id: 1, country: "India", status: "Activated" },
  { id: 2, country: "USA", status: "Deactivated" },
  { id: 3, country: "Canada", status: "Activated" },
  { id: 4, country: "Australia", status: "Activated" },
  { id: 5, country: "Germany", status: "Deactivated" },
];

function StateManagement() {
  const [stateData, setStateData] = useState(initialStateData);
  const [search, setSearch] = useState("");
  const navigate = useNavigate(); // ✅ useNavigate hook

  const handleStatusChange = (id, newStatus) => {
    const updatedData = stateData.map((item) =>
      item.id === id ? { ...item, status: newStatus } : item
    );
    setStateData(updatedData);
  };

  const handleManageState = (id) => {
    navigate(`/dashboard/country/manage-state/${id}`); // ✅ Navigate to new page
  };

  // ✅ Filter data based on search
  const filteredData = stateData.filter((item) =>
    item.country.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4 text-primary">🌍 State Management</h2>

      {/* 🔍 Search Box */}
      <div className="mb-3 d-flex justify-content-end">
        <input
          type="text"
          className="form-control w-25 shadow-sm"
          placeholder="🔍 Search Country..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover text-center align-middle shadow-sm">
          <thead className="table-dark">
            <tr>
              <th style={{ width: "40%" }}>Country</th>
              <th style={{ width: "30%" }}>Status</th>
              <th style={{ width: "30%" }}>Options</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr key={item.id}>
                  <td className="fw-bold">{item.country}</td>
                  <td>
                    <select
                      className={`form-select text-center ${
                        item.status === "Activated"
                          ? "bg-success text-white"
                          : "bg-danger text-white"
                      }`}
                      value={item.status}
                      onChange={(e) =>
                        handleStatusChange(item.id, e.target.value)
                      }
                    >
                      <option value="Activated">Activated</option>
                      <option value="Deactivated">Deactivated</option>
                    </select>
                  </td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleManageState(item.id)} // ✅ Click handler
                    >
                      Manage State
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-danger fw-bold">
                  No matching country found 🚫
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StateManagement;

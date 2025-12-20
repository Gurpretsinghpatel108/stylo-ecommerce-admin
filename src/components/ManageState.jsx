import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function ManageState() {
  const navigate = useNavigate();

  const [states, setStates] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newCountry, setNewCountry] = useState("");
  const [newState, setNewState] = useState("");
  const [editingStateId, setEditingStateId] = useState(null); // for edit mode

  // Fetch states from backend
  const fetchStates = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/states");
      setStates(res.data);
    } catch (err) {
      console.error("Failed to fetch states:", err);
    }
  };

  useEffect(() => {
    fetchStates();
  }, []);

  // Add or Update state
  const handleSaveState = async () => {
    if (!newCountry || !newState) {
      alert("Please fill all fields");
      return;
    }

    try {
      if (editingStateId) {
        // UPDATE
        const res = await axios.put(`http://localhost:5000/api/states/${editingStateId}`, {
          country: newCountry,
          name: newState,
        });
        setStates(states.map(s => (s._id === editingStateId ? res.data : s)));
      } else {
        // ADD
        const res = await axios.post("http://localhost:5000/api/states", {
          country: newCountry,
          name: newState,
        });
        setStates([...states, res.data]);
      }

      setNewCountry("");
      setNewState("");
      setEditingStateId(null);
      setShowModal(false);
    } catch (err) {
      console.error("Failed to save state:", err);
      alert("Failed to save state. Check console.");
    }
  };

  // Delete state
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this state?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/states/${id}`);
      setStates(states.filter((s) => s._id !== id));
    } catch (err) {
      console.error("Failed to delete state:", err);
    }
  };

  // Change status
  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/states/${id}`, {
        status: newStatus,
      });
      setStates(
        states.map((s) => (s._id === id ? { ...s, status: newStatus } : s))
      );
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  // Open modal for edit
  const handleEdit = (state) => {
    setEditingStateId(state._id);
    setNewCountry(state.country);
    setNewState(state.name);
    setShowModal(true);
  };

  const filteredStates = states.filter(
    (s) =>
      s.country.toLowerCase().includes(search.toLowerCase()) ||
      s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4 text-success">🏙️ Manage State</h2>

      {/* Search + Add Button */}
      <div className="d-flex justify-content-between mb-3">
        <input
          type="text"
          className="form-control w-50"
          placeholder="🔍 Search Country or State..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          ➕ Add New State
        </button>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover text-center align-middle shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>Country</th>
              <th>State</th>
              <th>Status</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            {filteredStates.length > 0 ? (
              filteredStates.map((s) => (
                <tr key={s._id}>
                  <td>{s.country}</td>
                  <td>{s.name}</td>
                  <td>
                    <select
                      className={`form-select text-center ${
                        s.status === "Activated"
                          ? "bg-success text-white"
                          : "bg-danger text-white"
                      }`}
                      value={s.status}
                      onChange={(e) => handleStatusChange(s._id, e.target.value)}
                    >
                      <option value="Activated">Activated</option>
                      <option value="Deactivated">Deactivated</option>
                    </select>
                  </td>
                  <td>
                    <button
                      className="btn btn-info btn-sm me-2"
                      onClick={() => handleEdit(s)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm me-2"
                      onClick={() => handleDelete(s._id)}
                    >
                      Delete
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() =>
                        navigate("/dashboard/country/manage-city", {
                          state: { selectedState: s },
                        })
                      }
                    >
                      Manage City
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-danger fw-bold">
                  No states added yet 🚫
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  {editingStateId ? "✏️ Edit State" : "➕ Add New State"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    setEditingStateId(null);
                    setNewCountry("");
                    setNewState("");
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Enter Country"
                  value={newCountry}
                  onChange={(e) => setNewCountry(e.target.value)}
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter State"
                  value={newState}
                  onChange={(e) => setNewState(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowModal(false);
                    setEditingStateId(null);
                    setNewCountry("");
                    setNewState("");
                  }}
                >
                  Cancel
                </button>
                <button className="btn btn-success" onClick={handleSaveState}>
                  {editingStateId ? "Update" : "Submit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageState;

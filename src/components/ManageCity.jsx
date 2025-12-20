import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function ManageCity() {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedStateId, setSelectedStateId] = useState(""); // Selected state ID
  const [newCity, setNewCity] = useState("");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Fetch all states for dropdown
  const fetchStates = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/states");
      setStates(res.data);
      if (res.data.length > 0 && !selectedStateId) {
        setSelectedStateId(res.data[0]._id); // Default first state
      }
    } catch (err) {
      console.error("Failed to fetch states:", err);
    }
  };

  // Fetch cities for selected state
  const fetchCities = async () => {
    if (!selectedStateId) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/cities?stateId=${selectedStateId}`);
      setCities(res.data);
    } catch (err) {
      console.error("Failed to fetch cities:", err);
    }
  };

  useEffect(() => {
    fetchStates();
  }, []);

  useEffect(() => {
    fetchCities();
  }, [selectedStateId]);

  // Add new city
  const handleAddCity = async () => {
    if (!newCity || !selectedStateId) {
      alert("Please fill all fields");
      return;
    }
    try {
      const res = await axios.post("http://localhost:5000/api/cities", {
        name: newCity,
        stateId: selectedStateId,
      });
      setCities([...cities, res.data]);
      setNewCity("");
      setShowModal(false);
    } catch (err) {
      console.error("Failed to add city:", err);
      alert("Failed to add city. Check console.");
    }
  };

  const handleDelete = async (cityId) => {
    if (!window.confirm("Are you sure to delete this city?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/cities/${cityId}`);
      setCities(cities.filter((c) => c._id !== cityId));
    } catch (err) {
      console.error("Failed to delete city:", err);
    }
  };

  const handleStatusChange = async (cityId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/cities/${cityId}`, { status: newStatus });
      setCities(cities.map((c) => (c._id === cityId ? { ...c, status: newStatus } : c)));
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const filteredCities = cities.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mt-4 p-4 bg-light rounded shadow-sm">
      <h2 className="text-center text-primary mb-4">🏘️ Manage City</h2>

      <div className="d-flex justify-content-between mb-3">
        <input
          type="text"
          className="form-control w-50"
          placeholder="🔍 Search City..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-success" onClick={() => setShowModal(true)}>➕ Add New City</button>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover text-center align-middle">
          <thead className="table-dark">
            <tr>
              <th>State</th>
              <th>City</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCities.length > 0 ? (
              filteredCities.map((c) => {
                const stateName = states.find((s) => s._id === selectedStateId)?.name || "N/A";
                return (
                  <tr key={c._id}>
                    <td>{stateName}</td>
                    <td>{c.name}</td>
                    <td>
                      <select
                        className={`form-select text-center ${c.status === "Activated" ? "bg-success text-white" : "bg-danger text-white"}`}
                        value={c.status}
                        onChange={(e) => handleStatusChange(c._id, e.target.value)}
                      >
                        <option value="Activated">Activated</option>
                        <option value="Deactivated">Deactivated</option>
                      </select>
                    </td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c._id)}>Delete</button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" className="text-danger fw-bold">No cities found 🚫</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">➕ Add New City</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <label>Select State:</label>
                <select
                  className="form-select mb-3"
                  value={selectedStateId}
                  onChange={(e) => setSelectedStateId(e.target.value)}
                >
                  {states.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>

                <label>City Name:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter City"
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-success" onClick={handleAddCity}>Submit</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageCity;

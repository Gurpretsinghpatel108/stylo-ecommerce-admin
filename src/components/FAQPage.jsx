
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FAQPage.css";

function FAQPage() {
  const [faqs, setFaqs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);

  // Fetch FAQs from backend
  const fetchFaqs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/faqs");
      setFaqs(res.data);
    } catch (err) {
      console.error("Error fetching FAQs:", err);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  // Add new FAQ to backend
  const handleAddFaq = async () => {
    if (!title.trim() || !description.trim()) return;
    try {
      const res = await axios.post("http://localhost:5000/api/faqs", {
        title,
        description,
      });
      setFaqs([res.data, ...faqs]);
      setTitle("");
      setDescription("");
      setShowModal(false);
    } catch (err) {
      console.error("Error adding FAQ:", err);
    }
  };

  // Delete FAQ from backend
  const handleDeleteFaq = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/faqs/${id}`);
      setFaqs(faqs.filter((faq) => faq._id !== id));
    } catch (err) {
      console.error("Error deleting FAQ:", err);
    }
  };

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.title.toLowerCase().includes(search.toLowerCase()) ||
      faq.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="faq-container">
      <h2>FAQ Management</h2>

      <div className="faq-controls">
        <div>
          Show{" "}
          <select value={entries} onChange={(e) => setEntries(Number(e.target.value))}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>{" "}
          entries
        </div>

        <div>
          <input
            type="text"
            placeholder="Search FAQs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div>
          <button className="btn-add" onClick={() => setShowModal(true)}>
            + Add New FAQ
          </button>
        </div>
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h3>Add New FAQ</h3>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
            />
            <div className="modal-buttons">
              <button className="btn-add" onClick={handleAddFaq}>
                Submit
              </button>
              <button className="btn-cancel" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <table className="faq-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {filteredFaqs.length > 0 ? (
            filteredFaqs.slice(0, entries).map((faq) => (
              <tr key={faq._id}>
                <td>{faq.title}</td>
                <td>{faq.description}</td>
                <td>
                  <button className="btn-edit">Edit</button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteFaq(faq._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No FAQs found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default FAQPage;

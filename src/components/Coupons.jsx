import React, { useState } from "react";
import { FaTrash, FaPlus } from "react-icons/fa";
import "./Coupons.css";

function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    allowedType: "Category",
    discountType: "Discount by Percent",
    quantity: "Unlimited",
    startDate: "",
    endDate: "",
  });

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newCoupon = { id: Date.now(), ...formData };
    setCoupons([...coupons, newCoupon]);
    setFormData({
      code: "",
      allowedType: "Category",
      discountType: "Discount by Percent",
      quantity: "Unlimited",
      startDate: "",
      endDate: "",
    });
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure to delete this coupon?")) {
      setCoupons(coupons.filter((coupon) => coupon.id !== id));
    }
  };

  return (
    <div className="coupons-container">
      <h2>Coupons</h2>

      {/* Add New Button */}
      <button className="add-new-btn" onClick={() => setShowModal(true)}>
        <FaPlus /> Add New Coupon
      </button>

      {/* Coupons Table */}
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Allowed Product Type</th>
            <th>Discount Type</th>
            <th>Quantity</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Option</th>
          </tr>
        </thead>
        <tbody>
          {coupons.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: "center", fontStyle: "italic" }}>
                No coupons added yet.
              </td>
            </tr>
          ) : (
            coupons.map((coupon) => (
              <tr key={coupon.id}>
                <td>{coupon.code}</td>
                <td>{coupon.allowedType}</td>
                <td>{coupon.discountType}</td>
                <td>{coupon.quantity}</td>
                <td>{coupon.startDate}</td>
                <td>{coupon.endDate}</td>
                <td>
                  <button className="delete-btn" onClick={() => handleDelete(coupon.id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Add New Coupon</h3>
            <form onSubmit={handleSubmit}>
              <label>Code:</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => handleChange("code", e.target.value)}
                required
              />

              <label>Allowed Product Type:</label>
              <select
                value={formData.allowedType}
                onChange={(e) => handleChange("allowedType", e.target.value)}
              >
                <option>Category</option>
                <option>Subcategory</option>
                <option>Child Category</option>
              </select>

              <label>Discount Type:</label>
              <select
                value={formData.discountType}
                onChange={(e) => handleChange("discountType", e.target.value)}
              >
                <option>Discount by Percent</option>
                <option>Discount by Amount</option>
              </select>

              <label>Quantity:</label>
              <select
                value={formData.quantity}
                onChange={(e) => handleChange("quantity", e.target.value)}
              >
                <option>Unlimited</option>
                <option>Limited</option>
              </select>

              <label>Start Date:</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
                required
              />

              <label>End Date:</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleChange("endDate", e.target.value)}
                required
              />

              <button type="submit" className="submit-btn">
                Submit
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Coupons;

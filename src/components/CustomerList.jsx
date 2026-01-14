import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CustomerList.css";

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [depositCustomer, setDepositCustomer] = useState(null);
  const [vendorCustomer, setVendorCustomer] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [addCustomerModal, setAddCustomerModal] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [depositData, setDepositData] = useState({ amount: "", details: "", action: "Add" });
  const [vendorData, setVendorData] = useState({
    shopName: "",
    ownerName: "",
    shopNumber: "",
    shopAddress: "",
    registrationNumber: "",
    plan: "Basic",
  });
  const [newCustomer, setNewCustomer] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });

  // Fetch customers
  const fetchCustomers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/customers");
      setCustomers(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Toggle dropdown
  const toggleDropdown = (id) => {
    setOpenDropdowns((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Block/unblock customer
  const handleBlockToggle = async (customer) => {
    try {
      const newStatus = !customer.blocked;
      await axios.put(`http://localhost:5000/api/customers/${customer._id}`, { blocked: newStatus });
      setCustomers(customers.map((c) => (c._id === customer._id ? { ...c, blocked: newStatus } : c)));
    } catch (err) {
      console.error(err);
    }
  };

  // Delete customer
  const handleDelete = async (customer) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/customers/${customer._id}`);
      setCustomers(customers.filter((c) => c._id !== customer._id));
    } catch (err) {
      console.error(err);
    }
  };

  // Deposit form handlers
  const handleDepositChange = (e) => {
    const { name, value } = e.target;
    setDepositData({ ...depositData, [name]: value });
  };

  const handleDepositSubmit = async () => {
    console.log("Deposit Action:", depositData);
    alert("Deposit Updated!");
    setDepositCustomer(null);
    setDepositData({ amount: "", details: "", action: "Add" });
  };

  // Vendor form handlers
  const handleVendorChange = (e) => {
    const { name, value } = e.target;
    setVendorData({ ...vendorData, [name]: value });
  };

  const handleVendorSubmit = async () => {
    console.log("Vendor Data:", vendorData);
    alert("Vendor Created!");
    setVendorCustomer(null);
  };

  // Add Customer handlers
  const handleNewCustomerChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer({ ...newCustomer, [name]: value });
  };

  const handleAddCustomer = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/customers", newCustomer);
      alert("Customer Added Successfully!");
      setAddCustomerModal(false);
      setNewCustomer({ fullName: "", email: "", phone: "", password: "" });
      fetchCustomers();
    } catch (err) {
      console.error(err);
      alert("Error adding customer");
    }
  };

  return (
    <div className="customer-container">
      <h2>Customer List</h2>

      <button className="btn-add-customer" onClick={() => setAddCustomerModal(true)}>
        + Add Customer
      </button>

      <table className="customer-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {customers.length > 0 ? (
            customers.map((c) => (
              <tr key={c._id}>
                <td>{c.fullName}</td>
                <td>{c.email}</td>
                <td>
                  <div className="dropdown">
                    <button className="dropdown-btn" onClick={() => toggleDropdown(c._id)}>
                      Options
                    </button>
                    {openDropdowns[c._id] && (
                      <div className="dropdown-content">
                        <button onClick={() => setDepositCustomer(c)}>Manage Deposit</button>
                        <button onClick={() => setVendorCustomer(c)}>Make Vendor</button>
                        <button>Details</button>
                        <button>Send</button>
                        <button onClick={() => handleBlockToggle(c)}>
                          {c.blocked ? "Unblock" : "Block"}
                        </button>
                        <button onClick={() => handleDelete(c)}>Delete</button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: "center", color: "red" }}>
                No customers found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Add Customer Modal */}
      {addCustomerModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New Customer</h3>

            <label>Full Name</label>
            <input name="fullName" value={newCustomer.fullName} onChange={handleNewCustomerChange} />

            <label>Email</label>
            <input name="email" value={newCustomer.email} onChange={handleNewCustomerChange} />

            <label>Phone</label>
            <input name="phone" value={newCustomer.phone} onChange={handleNewCustomerChange} />

            <label>Password</label>
            <input
              type="password"
              name="password"
              value={newCustomer.password}
              onChange={handleNewCustomerChange}
            />

            <div className="modal-buttons">
              <button onClick={handleAddCustomer}>Add</button>
              <button onClick={() => setAddCustomerModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Deposit Modal */}
      {depositCustomer && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Manage Deposit for {depositCustomer.fullName}</h3>
            <p>Current Balance: ₹{depositCustomer.balance || 0}</p>

            <label>Amount</label>
            <input type="number" name="amount" value={depositData.amount} onChange={handleDepositChange} />

            <label>Details</label>
            <input type="text" name="details" value={depositData.details} onChange={handleDepositChange} />

            <label>Action</label>
            <select name="action" value={depositData.action} onChange={handleDepositChange}>
              <option value="Add">Add</option>
              <option value="Subtract">Subtract</option>
            </select>

            <div className="modal-buttons">
              <button onClick={handleDepositSubmit}>Submit</button>
              <button onClick={() => setDepositCustomer(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Vendor Modal */}
      {vendorCustomer && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Make Vendor for {vendorCustomer.fullName}</h3>

            <label>Shop Name</label>
            <input name="shopName" value={vendorData.shopName} onChange={handleVendorChange} />

            <label>Owner Name</label>
            <input name="ownerName" value={vendorData.ownerName} onChange={handleVendorChange} />

            <label>Shop Number</label>
            <input name="shopNumber" value={vendorData.shopNumber} onChange={handleVendorChange} />

            <label>Shop Address</label>
            <input name="shopAddress" value={vendorData.shopAddress} onChange={handleVendorChange} />

            <label>Registration Number</label>
            <input
              name="registrationNumber"
              value={vendorData.registrationNumber}
              onChange={handleVendorChange}
            />

            <label>Choose Plan</label>
            <select name="plan" value={vendorData.plan} onChange={handleVendorChange}>
              <option value="Basic">Basic</option>
              <option value="Standard">Standard</option>
              <option value="Unlimited">Unlimited</option>
              <option value="Premium">Premium</option>
            </select>

            <div className="modal-buttons">
              <button onClick={handleVendorSubmit}>Submit</button>
              <button onClick={() => setVendorCustomer(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerList;

